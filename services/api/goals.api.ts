// services/api/goals.api.ts
// Goals API Service

import {
    CreateGoalRequest,
    Goal,
    UpdateGoalRequest
} from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Goals Endpoints
// ============================================================================

export const goalsApi = {
  /**
   * Get all user goals
   * GET /api/goals/
   */
  getAll: async (params?: {
    scope?: number;
    status?: string;
    subscription?: number;
  }): Promise<Goal[]> => {
    return apiClient.get<Goal[]>('/goals/', { params });
  },

  /**
   * Get goal by ID
   * GET /api/goals/{id}/
   */
  getById: async (id: number): Promise<Goal> => {
    return apiClient.get<Goal>(`/goals/${id}/`);
  },

  /**
   * Create new goal
   * POST /api/goals/
   */
  create: async (data: CreateGoalRequest): Promise<Goal> => {
    return apiClient.post<Goal>('/goals/', data);
  },

  /**
   * Update goal
   * PUT /api/goals/{id}/
   * PATCH /api/goals/{id}/
   */
  update: async (id: number, data: UpdateGoalRequest): Promise<Goal> => {
    return apiClient.patch<Goal>(`/goals/${id}/`, data);
  },

  /**
   * Delete goal
   * DELETE /api/goals/{id}/
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/goals/${id}/`);
  },

  /**
   * Update goal progress
   * PATCH /api/goals/{id}/update-progress/
   */
  updateProgress: async (id: number, progress_percentage: number): Promise<Goal> => {
    return apiClient.patch<Goal>(`/goals/${id}/update-progress/`, {
      progress_percentage
    });
  },

  /**
   * Complete goal
   * POST /api/goals/{id}/complete/
   */
  complete: async (id: number): Promise<Goal> => {
    return apiClient.post<Goal>(`/goals/${id}/complete/`);
  },

  /**
   * Abandon goal
   * POST /api/goals/{id}/abandon/
   */
  abandon: async (id: number): Promise<Goal> => {
    return apiClient.post<Goal>(`/goals/${id}/abandon/`);
  },

  /**
   * Get goals by scope
   * GET /api/goals/by-scope/{scope_id}/
   */
  getByScope: async (scopeId: number): Promise<Goal[]> => {
    return apiClient.get<Goal[]>(`/goals/by-scope/${scopeId}/`);
  },

  /**
   * Get active goals
   * GET /api/goals/active/
   */
  getActive: async (): Promise<Goal[]> => {
    return apiClient.get<Goal[]>('/goals/active/');
  },

  /**
   * Get completed goals
   * GET /api/goals/completed/
   */
  getCompleted: async (): Promise<Goal[]> => {
    return apiClient.get<Goal[]>('/goals/completed/');
  },
};

export default goalsApi;
