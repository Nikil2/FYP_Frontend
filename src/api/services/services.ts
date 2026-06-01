/**
 * Services API Functions
 * Handles all service-related API calls
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';
import { ApiResponse, Service } from '../types';

function extractPayload<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in (response as Record<string, unknown>)) {
    const wrapped = response as ApiResponse<T>;
    if (typeof wrapped.data !== 'undefined') {
      return wrapped.data;
    }
  }

  return response as T;
}

/**
 * Get all services
 * @returns Array of all available services
 */
export async function getServices(): Promise<Service[]> {
  try {
    const response = await apiClient.get<ApiResponse<Service[]> | Service[]>(
      API_CONFIG.ENDPOINTS.SERVICES
    );
    const services = extractPayload(response);
    return Array.isArray(services) ? services : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get active services only
 * @returns Array of active services
 */
export async function getActiveServices(): Promise<Service[]> {
  try {
    const response = await apiClient.get<ApiResponse<Service[]> | Service[]>(
      API_CONFIG.ENDPOINTS.SERVICES_ACTIVE
    );
    const services = extractPayload(response);
    return Array.isArray(services) ? services : [];
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
}

/**
 * Get single service by ID
 * @param serviceId - Service ID
 * @returns Service object
 */
export async function getServiceById(serviceId: number): Promise<Service> {
  try {
    const response = await apiClient.get<ApiResponse<Service> | Service>(
      `${API_CONFIG.ENDPOINTS.SERVICES}/${serviceId}`
    );
    const service = extractPayload(response);
    if (!service) {
      throw new Error('Service not found');
    }
    return service;
  } catch (error) {
    console.error(`Error fetching service ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Get services list (alternative endpoint)
 * @returns Array of all services
 */
export async function getServicesList(): Promise<Service[]> {
  try {
    const response = await apiClient.get<ApiResponse<Service[]> | Service[]>(
      API_CONFIG.ENDPOINTS.SERVICES_LIST
    );
    const services = extractPayload(response);
    return Array.isArray(services) ? services : [];
  } catch (error) {
    console.error('Error fetching services list:', error);
    throw error;
  }
}

/**
 * Group services by category
 * @param services - Array of services
 * @returns Grouped services by category
 */
export function groupServicesByCategory(
  services: Service[]
): Record<string, Service[]> {
  return services.reduce(
    (acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>
  );
}

/**
 * Filter services by category
 * @param services - Array of services
 * @param category - Category to filter by
 * @returns Filtered services
 */
export function filterServicesByCategory(
  services: Service[],
  category: string
): Service[] {
  return services.filter((service) => service.category === category);
}

/**
 * Filter services by keyword
 * @param services - Array of services
 * @param keyword - Search keyword
 * @returns Filtered services
 */
export function filterServicesByKeyword(
  services: Service[],
  keyword: string
): Service[] {
  const lowerKeyword = keyword.toLowerCase();
  return services.filter((service) => {
    const name = service.name.toLowerCase();
    const description = service.description?.toLowerCase() ?? '';
    const category = (service.category ?? service.categoryName).toLowerCase();

    return (
      name.includes(lowerKeyword) ||
      description.includes(lowerKeyword) ||
      category.includes(lowerKeyword)
    );
  });
}

export default {
  getServices,
  getActiveServices,
  getServiceById,
  getServicesList,
  groupServicesByCategory,
  filterServicesByCategory,
  filterServicesByKeyword,
};
