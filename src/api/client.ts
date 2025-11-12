// API Client for Craftify
// Handles all HTTP requests to the backend

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiConfig, getAuthHeader, RETRY_CONFIG } from '../config/api';

/**
 * API Client with axios implementation
 */
class ApiClient {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: apiConfig.headers,
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers = {
            ...config.headers,
            ...getAuthHeader(this.authToken),
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;

        // Retry logic for specific status codes
        if (
          response &&
          RETRY_CONFIG.retryOn.includes(response.status) &&
          (!config.retryCount || config.retryCount < RETRY_CONFIG.maxRetries)
        ) {
          config.retryCount = (config.retryCount || 0) + 1;

          // Exponential backoff
          const delay = RETRY_CONFIG.retryDelay * Math.pow(2, config.retryCount - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.axiosInstance(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data);
    return response.data;
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T>(
    url: string,
    file: any,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(percentCompleted);
      };
    }

    const response: AxiosResponse<T> = await this.axiosInstance.post(url, formData, config);
    return response.data;
  }

  /**
   * Get axios instance for custom requests
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export default apiClient;
