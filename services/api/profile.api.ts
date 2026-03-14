// services/api/profile.api.ts
// Profile API Service using Axios

import { User } from '@/types/api';
import { apiClient } from '../api.client';

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export const profileApi = {
  /**
   * Get current user profile
   * GET /api/auth/profile/
   */
  getProfile: (): Promise<User> => {
    return apiClient.get<User>('/auth/profile/');
  },

  /**
   * Update user profile
   * PATCH /api/auth/profile/
   */
  updateProfile: (data: Partial<User>): Promise<User> => {
    return apiClient.patch<User>('/auth/profile/', data);
  },

  /**
   * Change password
   * POST /api/auth/change-password/
   */
  changePassword: (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/change-password/', data);
  },

  /**
   * Delete account
   * DELETE /api/auth/profile/
   */
  deleteAccount: (data: DeleteAccountRequest): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>('/auth/profile/');
  },

  /**
   * Export user data
   * GET /api/auth/export-data/
   */
  exportData: (): Promise<Blob> => {
    return apiClient.get<Blob>('/auth/export-data/', { responseType: 'blob' });
  },
};

export default profileApi;
