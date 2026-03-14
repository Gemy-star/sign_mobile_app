// services/api/messages.api.ts
// AI Messages API Service

import {
    CreateMessageRequest,
    Message,
    MessageFilters
} from '@/types/api';
import { apiClient } from '../api.client';

// ============================================================================
// Messages Endpoints
// ============================================================================

export const messagesApi = {
  /**
   * Get all user messages
   * GET /api/messages/
   */
  getAll: async (params?: MessageFilters): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages/', { params });
  },

  /**
   * Get message by ID
   * GET /api/messages/{id}/
   */
  getById: async (id: number): Promise<Message> => {
    return apiClient.get<Message>(`/messages/${id}/`);
  },

  /**
   * Generate new AI message
   * POST /api/messages/
   */
  create: async (data: CreateMessageRequest): Promise<Message> => {
    return apiClient.post<Message>('/messages/', data);
  },

  /**
   * Full update of a message
   * PUT /api/messages/{id}/
   */
  put: async (id: number, data: Partial<Message>): Promise<Message> => {
    return apiClient.put<Message>(`/messages/${id}/`, data);
  },

  /**
   * Partial update of a message
   * PATCH /api/messages/{id}/
   */
  patch: async (id: number, data: Partial<Message>): Promise<Message> => {
    return apiClient.patch<Message>(`/messages/${id}/`, data);
  },

  /**
   * Delete message
   * DELETE /api/messages/{id}/
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/messages/${id}/`);
  },

  /**
   * Mark message as read
   * POST /api/messages/{id}/mark_read/
   */
  markAsRead: async (id: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/mark_read/`);
  },

  /**
   * Rate message (1-5 stars)
   * POST /api/messages/{id}/rate/
   */
  rate: async (id: number, rating: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/rate/`, { rating });
  },

  /**
   * Toggle favorite status
   * POST /api/messages/{id}/toggle_favorite/
   */
  toggleFavorite: async (id: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/toggle_favorite/`);
  },

  /**
   * Get today's daily message (auto-generates if not exists)
   * GET /api/messages/daily/
   */
  getDaily: async (): Promise<Message> => {
    return apiClient.get<Message>('/messages/daily/');
  },

  /**
   * Get favorited messages
   * GET /api/messages/favorites/
   */
  getFavorites: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages/favorites/');
  },
};

export default messagesApi;
