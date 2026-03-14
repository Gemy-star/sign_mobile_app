// services/api/admin.api.ts
// Admin API Service

import { AdminTrialRequest, AdminUser, RegisterRequest } from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Admin Endpoints
// ============================================================================

export const adminApi = {
  /**
   * List all registered users
   * GET /api/admin/users/
   * Requires: admin role + admin:user_management scope
   */
  getUsers: async (): Promise<AdminUser[]> => {
    return apiClient.get<AdminUser[]>('/admin/users/');
  },

  /**
   * Create a new admin user
   * POST /api/admin/users/
   * Requires: create_users permission
   */
  createAdminUser: async (data: RegisterRequest): Promise<AdminUser> => {
    return apiClient.post<AdminUser>('/admin/users/', data);
  },

  /**
   * Manage a user's free trial (start, extend, or cancel)
   * POST /api/admin/trials/
   * Requires: manage_trials permission
   */
  manageTrial: async (data: AdminTrialRequest): Promise<{
    message: string;
    user: AdminUser;
  }> => {
    return apiClient.post<{ message: string; user: AdminUser }>('/admin/trials/', data);
  },
};

export default adminApi;
