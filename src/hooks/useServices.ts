/**
 * useServices Hook
 * Fetch and manage services from the API
 */

'use client';

import { useEffect, useState } from 'react';
import { getServices, Service, ApiRequestError } from '@/api';

interface UseServicesOptions {
  autoFetch?: boolean;
}

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServices(options: UseServicesOptions = {}): UseServicesReturn {
  const { autoFetch = true } = options;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(`Error (${err.statusCode}): ${err.message}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch services');
      }
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchServices();
    }
  }, [autoFetch]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}

export default useServices;
