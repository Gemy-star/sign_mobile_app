// services/api/subscriptions.api.ts
// Subscriptions API Service

import {
    CreateSubscriptionRequest,
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
   * Get current active subscription
   * GET /api/subscriptions/current/
   */
  getCurrent: async (): Promise<SubscriptionDetail> => {
    return apiClient.get<SubscriptionDetail>('/subscriptions/current/');
  },

  /**
   * Create new subscription
   * POST /api/subscriptions/
   */
  create: async (data: CreateSubscriptionRequest): Promise<{
    subscription: SubscriptionDetail;
    payment_url?: string;
    message: string;
  }> => {
    return apiClient.post<{
      subscription: SubscriptionDetail;
      payment_url?: string;
      message: string;
    }>('/subscriptions/', data);
  },

  /**
   * Update selected scopes
   * PATCH /api/subscriptions/{id}/update-scopes/
   */
  updateScopes: async (id: number, data: UpdateScopesRequest): Promise<SubscriptionDetail> => {
    return apiClient.patch<SubscriptionDetail>(`/subscriptions/${id}/update-scopes/`, data);
  },

  /**
   * Cancel subscription
   * POST /api/subscriptions/{id}/cancel/
   */
  cancel: async (id: number): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/subscriptions/${id}/cancel/`);
  },

  /**
   * Renew subscription
   * POST /api/subscriptions/{id}/renew/
   */
  renew: async (id: number): Promise<{
    subscription: SubscriptionDetail;
    payment_url?: string;
    message: string;
  }> => {
    return apiClient.post<{
      subscription: SubscriptionDetail;
      payment_url?: string;
      message: string;
    }>(`/subscriptions/${id}/renew/`);
  },

  /**
   * Get subscription history
   * GET /api/subscriptions/history/
   */
  getHistory: async (): Promise<SubscriptionList[]> => {
    return apiClient.get<SubscriptionList[]>('/subscriptions/history/');
  },
};

export default subscriptionsApi;
