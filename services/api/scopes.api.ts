// services/api/scopes.api.ts
// Scopes API Service

import { CheckAccessRequest, Scope, ScopeCategory } from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Scopes Endpoints
//
// Permission model (mirrors backend):
//   AllowAny    → list, retrieve, categories
//   IsAuthenticated → create, update, partial_update, destroy
// ============================================================================

export const scopesApi = {
  // --------------------------------------------------------------------------
  // AllowAny — no token required
  // --------------------------------------------------------------------------

  /**
   * List all available scopes
   * GET /api/scopes/
   */
  getAll: async (params?: {
    category?: string;
    is_active?: boolean;
  }): Promise<Scope[]> => {
    const response = await apiClient.get<Scope[] | { results: Scope[] }>('/scopes/', { params });
    return Array.isArray(response) ? response : response.results ?? [];
  },

  /**
   * Retrieve a single scope by ID
   * GET /api/scopes/{id}/
   */
  getById: async (id: number): Promise<Scope> => {
    return apiClient.get<Scope>(`/scopes/${id}/`);
  },

  /**
   * List all scope categories
   * GET /api/scopes/categories/
   */
  getCategories: async (): Promise<ScopeCategory[]> => {
    return apiClient.get<ScopeCategory[]>('/scopes/categories/');
  },

  // --------------------------------------------------------------------------
  // IsAuthenticated — valid JWT required
  // --------------------------------------------------------------------------

  /**
   * Create a new scope
   * POST /api/scopes/
   */
  create: async (data: Partial<Scope>): Promise<Scope> => {
    return apiClient.post<Scope>('/scopes/', data);
  },

  /**
   * Full update of a scope
   * PUT /api/scopes/{id}/
   */
  update: async (id: number, data: Partial<Scope>): Promise<Scope> => {
    return apiClient.put<Scope>(`/scopes/${id}/`, data);
  },

  /**
   * Partial update of a scope
   * PATCH /api/scopes/{id}/
   */
  partialUpdate: async (id: number, data: Partial<Scope>): Promise<Scope> => {
    return apiClient.patch<Scope>(`/scopes/${id}/`, data);
  },

  /**
   * Delete a scope
   * DELETE /api/scopes/{id}/
   */
  destroy: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/scopes/${id}/`);
  },

  /**
   * Check user access to scopes/permissions/features
   * POST /api/scopes/check-access/
   */
  checkAccess: async (data: CheckAccessRequest): Promise<any> => {
    return apiClient.post<any>('/scopes/check-access/', data);
  },
};

export default scopesApi;
