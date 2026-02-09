// src/lib/api.ts
// API client with JWT token handling for the application

import { getAuthToken } from './auth';

// Base API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Creates a configured fetch instance with JWT token handling
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || BASE_URL;
  }

  /**
   * Makes an API request with automatic JWT token inclusion
   * @param endpoint - API endpoint path
   * @param options - Fetch options
   * @returns Promise resolving to the response
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get the auth token from storage
    const token = getAuthToken();

    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    } as Record<string, string>;

    // Add authorization header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Construct the final options
    const fetchOptions: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, fetchOptions);

      // Handle different response status codes
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If we can't parse the error response, use status text
          errorData = {
            error: {
              message: response.statusText,
              status: response.status
            }
          };
        }

        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      // For successful responses, try to parse JSON
      // Handle cases where response body is empty
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // If not JSON, return text or empty object
        const text = await response.text();
        return text ? JSON.parse(text) : {};
      }
    } catch (error) {
      // Re-throw the error to be handled by calling code
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server');
      }
      throw error;
    }
  }

  /**
   * GET request helper
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request helper
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request helper
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create a singleton instance of the API client
const apiClient = new ApiClient();

export default apiClient;

// Export the ApiClient class if someone needs to create their own instance
export { ApiClient };