// services/api/messages.api.ts
// AI Messages API Service

import {
    CreateMessageRequest,
    DailyMessage,
    Message
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
  getAll: async (params?: {
    scope?: number;
    goal?: number;
    message_type?: string;
    is_read?: boolean;
    is_favorited?: boolean;
  }): Promise<Message[]> => {
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
   * Mark message as read
   * POST /api/messages/{id}/mark-read/
   */
  markAsRead: async (id: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/mark-read/`);
  },

  /**
   * Toggle favorite status
   * POST /api/messages/{id}/toggle-favorite/
   */
  toggleFavorite: async (id: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/toggle-favorite/`);
  },

  /**
   * Rate message
   * POST /api/messages/{id}/rate/
   */
  rate: async (id: number, rating: number): Promise<Message> => {
    return apiClient.post<Message>(`/messages/${id}/rate/`, { rating });
  },

  /**
   * Delete message
   * DELETE /api/messages/{id}/
   */
  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/messages/${id}/`);
  },

  /**
   * Get unread messages
   * GET /api/messages/unread/
   */
  getUnread: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages/unread/');
  },

  /**
   * Get favorited messages
   * GET /api/messages/favorites/
   */
  getFavorites: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages/favorites/');
  },

  /**
   * Get messages by scope
   * GET /api/messages/by-scope/{scope_id}/
   */
  getByScope: async (scopeId: number): Promise<Message[]> => {
    return apiClient.get<Message[]>(`/messages/by-scope/${scopeId}/`);
  },

  /**
   * Get messages by goal
   * GET /api/messages/by-goal/{goal_id}/
   */
  getByGoal: async (goalId: number): Promise<Message[]> => {
    return apiClient.get<Message[]>(`/messages/by-goal/${goalId}/`);
  },

  /**
   * Get daily messages
   * GET /api/messages/daily/
   */
  getDaily: async (): Promise<DailyMessage[]> => {
    return apiClient.get<DailyMessage[]>('/messages/daily/');
  },

  /**
   * Get today's messages
   * GET /api/messages/today/
   */
  getToday: async (): Promise<Message[]> => {
    return apiClient.get<Message[]>('/messages/today/');
  },
};

export default messagesApi;
