/**
 * useWorkerRegistration Hook
 * Handle worker registration with the API
 */

'use client';

import { useState } from 'react';
import {
  registerWorker,
  WorkerRegistrationData,
  Worker,
  ApiRequestError,
} from '@/api';

interface UseWorkerRegistrationReturn {
  register: (data: WorkerRegistrationData) => Promise<Worker>;
  loading: boolean;
  error: string | null;
  success: boolean;
  clearError: () => void;
}

export function useWorkerRegistration(): UseWorkerRegistrationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: WorkerRegistrationData): Promise<Worker> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await registerWorker(data);
      setSuccess(true);
      return result;
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const errorMsg = `Error (${err.statusCode}): ${err.message}`;
        setError(errorMsg);
        throw new Error(errorMsg);
      } else if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const errorMsg = 'Failed to register worker';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    register,
    loading,
    error,
    success,
    clearError,
  };
}

export default useWorkerRegistration;
