/**
 * API Client
 * Base HTTP client for all API requests
 * Handles CORS, error handling, request/response formatting, JWT auth
 */

import API_CONFIG from './config';
import {
  ApiResponse,
  ApiError,
  ApiRequestError,
  RequestInit as CustomRequestInit,
} from './types';

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL?: string, timeout?: number) {
    this.baseURL = baseURL || API_CONFIG.BASE_URL;
    this.timeout = timeout || API_CONFIG.TIMEOUT;
  }

  /**
   * Set the base URL dynamically
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Get JWT token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Safely parse JSON response
   */
  private async safeJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Convert response to ApiError
   */
  private toApiError(response: Response, body: unknown): ApiError {
    const bodyObj = body as Record<string, unknown> | null;
    return {
      statusCode: response.status,
      message:
        (bodyObj?.message as string) ||
        response.statusText ||
        'Request failed',
      error: (bodyObj?.error as string) || response.statusText || 'ERROR',
      details: bodyObj?.details || body,
    };
  }

  /**
   * Handle 401 Unauthorized — clear all auth state.
   * Does NOT redirect — lets page-level guards (AdminShell, RoleGuard) handle navigation.
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      localStorage.removeItem('adminSession');
    }
  }

  /**
   * Execute HTTP request with timeout
   */
  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = this.timeout
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new ApiRequestError(408, `Request timeout after ${timeoutMs}ms`)
            ),
          timeoutMs
        )
      ),
    ]);
  }

  /**
   * Internal method to make HTTP requests
   * Automatically includes JWT Bearer token if available
   */
  private async doRequest<T>(
    endpoint: string,
    options: CustomRequestInit = {},
    timeoutMs?: number
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      ...API_CONFIG.CORS.headers,
      ...(options.headers as Record<string, string>),
    };

    // Add JWT Bearer token if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      credentials: 'include' as const,
    };

    // Add body if present
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    try {
      // Make request with timeout
      const response = await this.withTimeout(
        fetch(url, fetchOptions),
        timeoutMs
      );

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new ApiRequestError(401, 'Session expired. Please login again.');
      }

      // Handle successful response
      if (response.ok) {
        const data = (await this.safeJson(response)) as T;
        return data;
      }

      // Handle error response
      const errorBody = await this.safeJson(response);
      const apiError = this.toApiError(response, errorBody);
      throw new ApiRequestError(
        apiError.statusCode,
        apiError.message,
        apiError.details
      );
    } catch (error) {
      // Re-throw API errors
      if (error instanceof ApiRequestError) {
        throw error;
      }

      // Wrap fetch errors
      if (error instanceof TypeError) {
        throw new ApiRequestError(0, `Network error: ${error.message}`);
      }

      // Unknown error
      throw new ApiRequestError(500, 'Unknown error occurred', error);
    }
  }

  /**
   * Public GET request
   */
  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.doRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * Public POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>,
    timeoutMs?: number
  ): Promise<T> {
    return this.doRequest<T>(
      endpoint,
      {
        method: 'POST',
        body,
        headers,
      },
      timeoutMs
    );
  }

  /**
   * Public PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doRequest<T>(endpoint, {
      method: 'PUT',
      body,
      headers,
    });
  }

  /**
   * Public DELETE request
   */
  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.doRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Public PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.doRequest<T>(endpoint, {
      method: 'PATCH',
      body,
      headers,
    });
  }

  /**
   * Upload files using FormData
   * Don't set Content-Type header - browser will set it with boundary
   * Includes JWT token for authenticated uploads
   */
  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    timeoutMs?: number
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {};

    // Add JWT Bearer token for authenticated uploads
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await this.withTimeout(
        fetch(url, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
        }),
        timeoutMs
      );

      // Handle 401
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new ApiRequestError(401, 'Session expired. Please login again.');
      }

      if (response.ok) {
        return (await this.safeJson(response)) as T;
      }

      const errorBody = await this.safeJson(response);
      const apiError = this.toApiError(response, errorBody);
      throw new ApiRequestError(
        apiError.statusCode,
        apiError.message,
        apiError.details
      );
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new ApiRequestError(0, `Network error: ${error.message}`);
      }

      throw new ApiRequestError(500, 'Upload failed', error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default ApiClient;
