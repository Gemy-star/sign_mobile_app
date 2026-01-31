// services/api/dashboard.api.ts
// Dashboard API Service

import { apiClient } from '../api.client';

// ============================================================================
// Dashboard Stats Types
// ============================================================================

export interface DashboardStats {
  total_goals: number;
  completed_goals: number;
  active_goals: number;
  in_progress_goals: number;
  total_messages: number;
  unread_messages: number;
  favorited_messages: number;
  total_scopes: number;
  active_subscription: boolean;
  subscription_expires_at?: string | null;
  days_until_expiry?: number | null;
  trial_status: {
    has_trial: boolean;
    is_active: boolean;
    days_remaining?: number | null;
  };
  overall_progress: number;
  weekly_progress: number;
  monthly_progress: number;
  recent_activity: ActivityItem[];
  goal_completion_rate: number;
  scope_progress: ScopeProgress[];
}

export interface ActivityItem {
  id: number;
  type: 'goal_created' | 'goal_completed' | 'message_received' | 'scope_added';
  description: string;
  created_at: string;
}

export interface ScopeProgress {
  scope_id: number;
  scope_name: string;
  scope_category: string;
  total_goals: number;
  completed_goals: number;
  progress_percentage: number;
}

// ============================================================================
// Dashboard Endpoints
// ============================================================================

export const dashboardApi = {
  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats/
   */
  getStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats/');
  },

  /**
   * Get recent activity
   * GET /api/dashboard/activity/
   */
  getActivity: async (limit?: number): Promise<ActivityItem[]> => {
    return apiClient.get<ActivityItem[]>('/dashboard/activity/', {
      params: { limit },
    });
  },

  /**
   * Get progress overview
   * GET /api/dashboard/progress/
   */
  getProgress: async (): Promise<{
    overall: number;
    weekly: number;
    monthly: number;
    by_scope: ScopeProgress[];
  }> => {
    return apiClient.get('/dashboard/progress/');
  },

  /**
   * Get subscription status
   * GET /api/dashboard/subscription-status/
   */
  getSubscriptionStatus: async (): Promise<{
    is_active: boolean;
    package_name?: string;
    expires_at?: string | null;
    days_remaining?: number | null;
    auto_renew: boolean;
  }> => {
    return apiClient.get('/dashboard/subscription-status/');
  },
};

export default dashboardApi;
