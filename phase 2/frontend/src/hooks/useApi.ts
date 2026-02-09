// src/hooks/useApi.ts
// Generic API hook for data fetching with SWR

import { useState } from 'react';
import useSWR, { mutate, SWRConfiguration, SWRResponse } from 'swr';
import apiClient from '../lib/api';

interface UseApiResponse<T> extends Omit<SWRResponse<T, Error>, 'data'> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  mutate: (data?: T | Promise<T> | ((currentValue: T | null) => T | Promise<T | null> | null) | null, shouldRevalidate?: boolean) => Promise<T | null>;
}

/**
 * Generic API hook for fetching data with SWR
 * @param url - API endpoint URL
 * @param options - SWR configuration options
 * @returns SWR response with data, loading, error states and mutate function
 */
const useApi = <T = any>(url: string | null, options?: SWRConfiguration): UseApiResponse<T> => {
  // Define fetcher function for SWR
  const fetcher = async (url: string) => {
    if (!url) {
      throw new Error('URL is required');
    }
    try {
      const response = await apiClient.get<T>(url);
      return response;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  };

  const { data, error, mutate: swrMutate, isValidating } = useSWR<T, Error>(
    url,
    url ? fetcher : null,
    options
  );

  return {
    data: data || null,
    isLoading: !error && !data && isValidating,
    isError: !!error,
    mutate: async (newData?: T | Promise<T> | ((currentValue: T | null) => T | Promise<T | null> | null) | null, shouldRevalidate = true) => {
      return swrMutate(newData, shouldRevalidate);
    },
    error,
    isValidating,
  };
};

/**
 * Hook for making POST requests
 */
const usePost = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = async (url: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<T>(url, data);

      // Automatically mutate the SWR cache for the same URL to trigger revalidation
      mutate(url);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('POST error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trigger,
    loading,
    error,
  };
};

/**
 * Hook for making PUT requests
 */
const usePut = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = async (url: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put<T>(url, data);

      // Automatically mutate the SWR cache for the same URL to trigger revalidation
      mutate(url);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('PUT error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trigger,
    loading,
    error,
  };
};

/**
 * Hook for making DELETE requests
 */
const useDelete = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trigger = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete<T>(url);

      // Automatically mutate the SWR cache for the same URL to trigger revalidation
      mutate(url);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('DELETE error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trigger,
    loading,
    error,
  };
};

export { useApi, usePost, usePut, useDelete };