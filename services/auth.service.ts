// services/auth.service.ts
// Authentication Service with JWT Token Management

import { API_CONFIG, getApiUrl, getStorageKey } from '@/config/api.config';
import {
    ApiResponse,
    LoginRequest,
    RegisterRequest,
    TokenRefreshRequest,
    TokenResponse,
    TokenVerifyRequest,
    User,
} from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  // ============================================================================
  // Token Management
  // ============================================================================

  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      this.accessToken = await AsyncStorage.getItem(getStorageKey('ACCESS_TOKEN'));
    }
    return this.accessToken;
  }

  /**
   * Get current refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    if (!this.refreshToken) {
      this.refreshToken = await AsyncStorage.getItem(getStorageKey('REFRESH_TOKEN'));
    }
    return this.refreshToken;
  }

  /**
   * Store authentication tokens
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    await AsyncStorage.multiSet([
      [getStorageKey('ACCESS_TOKEN'), accessToken],
      [getStorageKey('REFRESH_TOKEN'), refreshToken],
    ]);
  }

  /**
   * Clear all authentication data
   */
  async clearTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;

    await AsyncStorage.multiRemove([
      getStorageKey('ACCESS_TOKEN'),
      getStorageKey('REFRESH_TOKEN'),
      getStorageKey('USER_DATA'),
    ]);
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    if (!this.user) {
      const userData = await AsyncStorage.getItem(getStorageKey('USER_DATA'));
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
    return this.user;
  }

  /**
   * Store user data
   */
  async setUser(user: User): Promise<void> {
    this.user = user;
    await AsyncStorage.setItem(getStorageKey('USER_DATA'), JSON.stringify(user));
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;

    // Verify token is still valid
    const isValid = await this.verifyToken(token);
    return isValid;
  }

  // ============================================================================
  // Authentication API Methods
  // ============================================================================

  /**
   * Login with username and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    // Mock login when API is disabled
    if (API_CONFIG.USE_MOCK_DATA) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          data: null as any,
          error: error.detail || error.error || 'Login failed',
        };
      }

      const data: TokenResponse = await response.json();

      // Store tokens
      await this.setTokens(data.access, data.refresh);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Mock login for development/testing
   */
  private async mockLogin(credentials: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock admin user
    if (credentials.username === 'admin' && credentials.password === 'admin123456') {
      const mockTokens: TokenResponse = {
        access: 'mock_access_token_admin',
        refresh: 'mock_refresh_token_admin',
      };

      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@motivateme.com',
        first_name: 'Admin',
        last_name: 'User',
        is_active: true,
        date_joined: new Date().toISOString(),
      };

      await this.setTokens(mockTokens.access, mockTokens.refresh);
      await this.setUser(mockUser);

      return {
        success: true,
        data: mockTokens,
      };
    }

    // Mock demo user (for backward compatibility)
    if (credentials.username === 'demo_user' && credentials.password === 'demo123') {
      const mockTokens: TokenResponse = {
        access: 'mock_access_token_demo',
        refresh: 'mock_refresh_token_demo',
      };

      const mockUser: User = {
        id: 2,
        username: 'demo_user',
        email: 'demo@motivateme.com',
        first_name: 'Demo',
        last_name: 'User',
        is_active: true,
        date_joined: new Date().toISOString(),
      };

      await this.setTokens(mockTokens.access, mockTokens.refresh);
      await this.setUser(mockUser);

      return {
        success: true,
        data: mockTokens,
      };
    }

    // Invalid credentials
    return {
      success: false,
      data: null as any,
      error: 'Invalid username or password',
    };
  }

  /**
   * Register new user account
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          data: null as any,
          error: error.detail || error.error || 'Registration failed',
        };
      }

      const data: User = await response.json();
      await this.setUser(data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<ApiResponse<TokenResponse>> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        return {
          success: false,
          data: null as any,
          error: 'No refresh token available',
        };
      }

      const request: TokenRefreshRequest = { refresh: refreshToken };

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        // Refresh token is invalid, clear all auth data
        await this.clearTokens();
        return {
          success: false,
          data: null as any,
          error: 'Session expired. Please login again.',
        };
      }

      const data: TokenResponse = await response.json();

      // Update tokens
      await this.setTokens(data.access, data.refresh);

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * Verify if token is valid
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const request: TokenVerifyRequest = { token };

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH.VERIFY), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  /**
   * Logout user and clear all data
   */
  async logout(): Promise<void> {
    await this.clearTokens();
  }

  // ============================================================================
  // Authorization Header Helper
  // ============================================================================

  /**
   * Get authorization headers for API requests
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken();

    if (!token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Make authenticated request with automatic token refresh
   */
  async authenticatedRequest<T>(
    url: string,
    options: RequestInit = {},
    language?: string
  ): Promise<Response> {
    const headers = await this.getAuthHeaders();

    // If language is provided and there's a body, add language to it
    let body = options.body;
    if (language && options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
      try {
        const bodyData = body ? JSON.parse(body as string) : {};
        bodyData.language = language;
        body = JSON.stringify(bodyData);
      } catch (e) {
        // If body is not JSON, just use original body
      }
    }

    let response = await fetch(url, {
      ...options,
      body,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...options.headers,
      },
    });

    // If unauthorized, try to refresh token and retry
    if (response.status === 401) {
      const refreshResult = await this.refreshAccessToken();

      if (refreshResult.success) {
        // Retry request with new token
        const newHeaders = await this.getAuthHeaders();
        response = await fetch(url, {
          ...options,
          body,
          headers: {
            'Content-Type': 'application/json',
            ...newHeaders,
            ...options.headers,
          },
        });
      }
    }

    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
