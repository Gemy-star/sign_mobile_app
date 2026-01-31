// services/api.client.ts
// Axios API Client Configuration with JWT Token Management

import { API_CONFIG } from '@/config/api.config';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import { ApiError, ERROR_CODES, getErrorMessage, getHttpErrorCode } from '@/utils/errorMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// API Client Instance
// ============================================================================

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  private currentLanguage: 'en' | 'ar' = 'en';

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/api`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // ============================================================================
  // Language Management
  // ============================================================================

  setLanguage(language: 'en' | 'ar') {
    this.currentLanguage = language;
    if (API_CONFIG.DEBUG) {
      console.log('🌐 API Client language set to:', language);
    }
  }

  getLanguage(): 'en' | 'ar' {
    return this.currentLanguage;
  }

  // ============================================================================
  // Request/Response Interceptors
  // ============================================================================

  private setupInterceptors() {
    // Request Interceptor - Add JWT token and language to headers
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add Accept-Language header
        if (config.headers) {
          config.headers['Accept-Language'] = this.currentLanguage;
        }

        if (API_CONFIG.DEBUG) {
          console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            language: this.currentLanguage,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        if (API_CONFIG.DEBUG) {
          console.error('❌ Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle token refresh and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (API_CONFIG.DEBUG) {
          console.log('📥 API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle network errors
        if (!error.response) {
          const networkError = new ApiError(
            getErrorMessage(ERROR_CODES.NETWORK_ERROR, this.currentLanguage),
            ERROR_CODES.NETWORK_ERROR
          );
          return Promise.reject(networkError);
        }

        const status = error.response.status;

        // Handle 401 Unauthorized - Token expired
        if (status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Wait for token refresh to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Refresh the access token
            const response = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/token/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            await this.setAccessToken(access);

            // Retry all queued requests
            this.refreshSubscribers.forEach((callback) => callback(access));
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            // Token refresh failed - logout user
            await this.clearTokens();
            this.refreshSubscribers = [];

            if (API_CONFIG.DEBUG) {
              console.error('❌ Token refresh failed:', refreshError);
            }

            const authError = new ApiError(
              getErrorMessage(ERROR_CODES.TOKEN_EXPIRED, this.currentLanguage),
              ERROR_CODES.TOKEN_EXPIRED,
              401
            );
            return Promise.reject(authError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle 403 Forbidden
        if (status === 403) {
          const responseData: any = error.response.data;
          const code = responseData?.error?.code || ERROR_CODES.FORBIDDEN;
          const forbiddenError = new ApiError(
            getErrorMessage(code, this.currentLanguage),
            code,
            403,
            responseData?.error?.details
          );
          return Promise.reject(forbiddenError);
        }

        // Handle 404 Not Found
        if (status === 404) {
          const notFoundError = new ApiError(
            getErrorMessage(ERROR_CODES.NOT_FOUND, this.currentLanguage),
            ERROR_CODES.NOT_FOUND,
            404
          );
          return Promise.reject(notFoundError);
        }

        // Handle 422 Validation Error
        if (status === 422) {
          const responseData: any = error.response.data;
          const validationError = new ApiError(
            getErrorMessage(ERROR_CODES.VALIDATION_ERROR, this.currentLanguage),
            ERROR_CODES.VALIDATION_ERROR,
            422,
            responseData?.error?.details || responseData
          );
          return Promise.reject(validationError);
        }

        // Handle 429 Rate Limit
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const message = retryAfter
            ? `${getErrorMessage(ERROR_CODES.RATE_LIMIT_EXCEEDED, this.currentLanguage)} (${retryAfter}s)`
            : getErrorMessage(ERROR_CODES.RATE_LIMIT_EXCEEDED, this.currentLanguage);

          const rateLimitError = new ApiError(
            message,
            ERROR_CODES.RATE_LIMIT_EXCEEDED,
            429,
            { retry_after: retryAfter }
          );
          return Promise.reject(rateLimitError);
        }

        // Handle 500+ Server Errors
        if (status >= 500) {
          const serverError = new ApiError(
            getErrorMessage(ERROR_CODES.SERVER_ERROR, this.currentLanguage),
            ERROR_CODES.SERVER_ERROR,
            status
          );
          return Promise.reject(serverError);
        }

        // Handle other errors
        const responseData: any = error.response.data;
        const errorCode = responseData?.error?.code || getHttpErrorCode(status);
        const apiError = new ApiError(
          responseData?.error?.message || getErrorMessage(errorCode, this.currentLanguage),
          errorCode,
          status,
          responseData?.error?.details
        );

        if (API_CONFIG.DEBUG) {
          console.error('❌ API Error:', {
            status,
            url: error.config?.url,
            message: apiError.message,
            code: apiError.code,
            details: apiError.details,
          });
        }

        return Promise.reject(apiError);
      }
    );
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async setAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Error setting access token:', error);
    }
  }

  async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  }

  async setTokens(access: string, refresh: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(access),
      this.setRefreshToken(refresh),
    ]);
  }

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
        API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        API_CONFIG.STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // ============================================================================
  // Response Validation
  // ============================================================================

  private validateResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      const errorCode = response.error?.code || ERROR_CODES.UNKNOWN_ERROR;
      const errorMessage = response.error?.message || getErrorMessage(errorCode, this.currentLanguage);

      throw new ApiError(
        errorMessage,
        errorCode,
        undefined,
        response.error?.details
      );
    }

    return response.data as T;
  }

  // ============================================================================
  // HTTP Methods
  // ============================================================================

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return this.validateResponse(response.data);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return this.validateResponse(response.data);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return this.validateResponse(response.data);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return this.validateResponse(response.data);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return this.validateResponse(response.data);
  }

  // ============================================================================
  // Pagination Utilities
  // ============================================================================

  async getPaginated<T = any>(
    url: string,
    params: PaginationParams = {},
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, page_size = 20, ordering, search } = params;

    const queryParams: Record<string, any> = {
      page,
      page_size,
    };

    if (ordering) {
      queryParams.ordering = ordering;
    }

    if (search) {
      queryParams.search = search;
    }

    const response = await this.client.get<ApiResponse<PaginatedResponse<T>>>(url, {
      ...config,
      params: { ...queryParams, ...config?.params },
    });

    return this.validateResponse(response.data);
  }

  // Helper to fetch all pages
  async getAllPaginated<T = any>(
    url: string,
    params: Omit<PaginationParams, 'page'> = {},
    config?: AxiosRequestConfig
  ): Promise<T[]> {
    const allResults: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getPaginated<T>(url, { ...params, page }, config);
      allResults.push(...response.results);

      hasMore = response.next !== null;
      page++;
    }

    return allResults;
  }

  // ============================================================================
  // Public Getters
  // ============================================================================

  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
