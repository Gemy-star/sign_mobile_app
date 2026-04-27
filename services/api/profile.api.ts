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

/** Matches the backend /api/user/message-preferences/ schema */
export interface MessagePreferences {
  delivery_time?: string;      // "HH:MM" 24-hour
  timezone?: string;
  message_length?: 'short' | 'medium' | 'long';
  tone?: string;
  topics?: string[];           // scope category names
  ai_personalization?: boolean;
  use_goals_for_customization?: boolean;
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

  /**
   * Get message delivery preferences (delivery_time, tone, topics, etc.)
   * GET /api/user/message-preferences/
   */
  getMessagePreferences: (): Promise<MessagePreferences> => {
    return apiClient.get<MessagePreferences>('/user/message-preferences/');
  },

  /**
   * Update message delivery preferences.
   * Persists delivery_time (and optionally tone/topics) to the backend so the
   * server-side cron knows when each user wants their daily messages.
   * PUT /api/user/message-preferences/
   */
  updateMessagePreferences: (data: Partial<MessagePreferences>): Promise<MessagePreferences> => {
    return apiClient.put<MessagePreferences>('/user/message-preferences/', data);
  },
};

export default profileApi;
