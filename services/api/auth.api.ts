// services/api/auth.api.ts
// Authentication API Service

import {
    LoginRequest,
    RegisterRequest,
    TokenRefreshRequest,
    TokenResponse,
    User,
} from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Authentication Endpoints
// ============================================================================

export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register/
   */
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    return apiClient.post<TokenResponse>('/auth/register/', data);
  },

  /**
   * Login user
   * POST /api/auth/login/
   * Returns JWT with user scopes
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    return apiClient.post<TokenResponse>('/auth/login/', credentials);
  },

  /**
   * Refresh access token
   * POST /api/auth/token/refresh/
   */
  refreshToken: async (data: TokenRefreshRequest): Promise<{ access: string }> => {
    return apiClient.post<{ access: string }>('/auth/token/refresh/', data);
  },

  /**
   * Verify token
   * POST /api/auth/token/verify/
   */
  verifyToken: async (token: string): Promise<void> => {
    return apiClient.post<void>('/auth/token/verify/', { token });
  },

  /**
   * Get current user profile
   * GET /api/auth/profile/
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/auth/profile/');
  },

  /**
   * Update user profile
   * PUT /api/auth/profile/
   * PATCH /api/auth/profile/
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiClient.patch<User>('/auth/profile/', data);
  },

  /**
   * Change password
   * POST /api/auth/change-password/
   */
  changePassword: async (data: {
    old_password: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/change-password/', data);
  },

  /**
   * Request password reset
   * POST /api/auth/password-reset/
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/password-reset/', { email });
  },

  /**
   * Confirm password reset
   * POST /api/auth/password-reset-confirm/
   */
  confirmPasswordReset: async (data: {
    token: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/password-reset-confirm/', data);
  },

  /**
   * Logout (client-side token clearing)
   */
  logout: async (): Promise<void> => {
    await apiClient.clearTokens();
  },
};

export default authApi;
