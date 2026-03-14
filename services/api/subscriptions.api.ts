// services/api/subscriptions.api.ts
// Subscriptions API Service

import {
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    SubscriptionDetail,
    SubscriptionList,
    UpdateScopesRequest
} from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Subscription Endpoints
// ============================================================================

export const subscriptionsApi = {
  /**
   * Get all user subscriptions
   * GET /api/subscriptions/
   */
  getAll: async (): Promise<SubscriptionList[]> => {
    return apiClient.get<SubscriptionList[]>('/subscriptions/');
  },

  /**
   * Get subscription by ID
   * GET /api/subscriptions/{id}/
   */
  getById: async (id: number): Promise<SubscriptionDetail> => {
    return apiClient.get<SubscriptionDetail>(`/subscriptions/${id}/`);
  },

  /**
   * Get active subscription
   * GET /api/subscriptions/active/
   */
  getActive: async (): Promise<SubscriptionDetail> => {
    return apiClient.get<SubscriptionDetail>('/subscriptions/active/');
  },

  /**
   * Create new subscription (initiates Tap payment)
   * POST /api/subscriptions/
   */
  create: async (data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
    return apiClient.post<CreateSubscriptionResponse>('/subscriptions/', data);
  },

  /**
   * Full update of a subscription
   * PUT /api/subscriptions/{id}/
   */
  put: async (id: number, data: Partial<SubscriptionDetail>): Promise<SubscriptionDetail> => {
    return apiClient.put<SubscriptionDetail>(`/subscriptions/${id}/`, data);
  },

  /**
   * Partial update of a subscription
   * PATCH /api/subscriptions/{id}/
   */
  patch: async (id: number, data: Partial<SubscriptionDetail>): Promise<SubscriptionDetail> => {
    return apiClient.patch<SubscriptionDetail>(`/subscriptions/${id}/`, data);
  },

  /**
   * Delete a subscription
   * DELETE /api/subscriptions/{id}/
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/subscriptions/${id}/`);
  },

  /**
   * Cancel subscription
   * POST /api/subscriptions/{id}/cancel/
   */
  cancel: async (id: number): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/subscriptions/${id}/cancel/`);
  },

  /**
   * Update selected scopes
   * PATCH /api/subscriptions/{id}/update_scopes/
   */
  updateScopes: async (id: number, data: UpdateScopesRequest): Promise<SubscriptionDetail> => {
    return apiClient.patch<SubscriptionDetail>(`/subscriptions/${id}/update_scopes/`, data);
  },
};

export default subscriptionsApi;
