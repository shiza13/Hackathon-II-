import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(
    baseURL: string =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  ) {
    this.baseUrl = baseURL;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      withCredentials: true, // ⭐ IMPORTANT for CORS + auth
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ✅ Attach JWT token automatically
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Handle unauthorized responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  public patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }
}

export default new ApiClient();
