// services/api/scopes.api.ts
// Scopes API Service

import { Scope, ScopeCategory } from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Scopes Endpoints
// ============================================================================

export const scopesApi = {
  /**
   * Get all available scopes
   * GET /api/scopes/
   */
  getAll: async (params?: {
    category?: string;
    is_active?: boolean;
  }): Promise<Scope[]> => {
    return apiClient.get<Scope[]>('/scopes/', { params });
  },

  /**
   * Get scope by ID
   * GET /api/scopes/{id}/
   */
  getById: async (id: number): Promise<Scope> => {
    return apiClient.get<Scope>(`/scopes/${id}/`);
  },

  /**
   * Get scopes by category
   * GET /api/scopes/by-category/
   */
  getByCategory: async (): Promise<ScopeCategory[]> => {
    return apiClient.get<ScopeCategory[]>('/scopes/by-category/');
  },

  /**
   * Get user's selected scopes
   * GET /api/scopes/my-scopes/
   */
  getMyScopes: async (): Promise<Scope[]> => {
    return apiClient.get<Scope[]>('/scopes/my-scopes/');
  },

  /**
   * Validate scope access
   * POST /api/scopes/validate-access/
   */
  validateAccess: async (scopeId: number): Promise<{
    has_access: boolean;
    message: string;
  }> => {
    return apiClient.post<{
      has_access: boolean;
      message: string;
    }>('/scopes/validate-access/', { scope_id: scopeId });
  },

  /**
   * Get scope statistics
   * GET /api/scopes/{id}/stats/
   */
  getStats: async (id: number): Promise<{
    total_goals: number;
    completed_goals: number;
    active_goals: number;
    total_messages: number;
    completion_rate: number;
  }> => {
    return apiClient.get(`/scopes/${id}/stats/`);
  },
};

export default scopesApi;
