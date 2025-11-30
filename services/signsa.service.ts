// services/signsa.service.ts
// Main API Service for Sign SA Platform

import { API_CONFIG, getApiUrl } from '@/config/api.config';
import {
    ApiResponse,
    CompleteGoalRequest,
    CreateGoalRequest,
    CreateMessageRequest,
    CreateSubscriptionRequest,
    DailyMessage,
    DashboardStats,
    Goal,
    GoalFilters,
    Message,
    MessageFilters,
    Package,
    PackageComparison,
    PaginatedResponse,
    PaginationParams,
    PaymentVerification,
    RateMessageRequest,
    Scope,
    ScopeCategory,
    Subscription,
    UpdateProgressRequest,
    UpdateScopesRequest
} from '@/types/api';
import { authService } from './auth.service';

class SignSAService {
  private language: string = 'en';

  // ============================================================================
  // Language Management
  // ============================================================================

  setLanguage(language: string) {
    this.language = language;
  }

  getLanguage(): string {
    return this.language;
  }

  // ============================================================================
  // Generic Request Handler
  // ============================================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = getApiUrl(endpoint);
      const response = await authService.authenticatedRequest(url, options, this.language);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          success: false,
          data: null as any,
          error: error.detail || error.error || error.message || `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ============================================================================
  // Dashboard
  // ============================================================================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);
  }

  // ============================================================================
  // Scopes (Life Domains)
  // ============================================================================

  async getScopes(): Promise<ApiResponse<Scope[]>> {
    return this.request<Scope[]>(API_CONFIG.ENDPOINTS.SCOPES.LIST);
  }

  async getScopeCategories(): Promise<ApiResponse<ScopeCategory[]>> {
    return this.request<ScopeCategory[]>(API_CONFIG.ENDPOINTS.SCOPES.CATEGORIES);
  }

  async getScopeById(id: number): Promise<ApiResponse<Scope>> {
    return this.request<Scope>(API_CONFIG.ENDPOINTS.SCOPES.DETAIL(id));
  }

  // ============================================================================
  // Packages (Subscription Tiers)
  // ============================================================================

  async getPackages(): Promise<ApiResponse<Package[]>> {
    return this.request<Package[]>(API_CONFIG.ENDPOINTS.PACKAGES.LIST);
  }

  async getFeaturedPackages(): Promise<ApiResponse<Package[]>> {
    return this.request<Package[]>(API_CONFIG.ENDPOINTS.PACKAGES.FEATURED);
  }

  async getPackageById(id: number): Promise<ApiResponse<Package>> {
    return this.request<Package>(API_CONFIG.ENDPOINTS.PACKAGES.DETAIL(id));
  }

  async getPackageComparison(id: number): Promise<ApiResponse<PackageComparison>> {
    return this.request<PackageComparison>(API_CONFIG.ENDPOINTS.PACKAGES.COMPARISON(id));
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  async getSubscriptions(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Subscription>>> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<PaginatedResponse<Subscription>>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.LIST}${queryString}`
    );
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActiveSubscription(): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.ACTIVE);
  }

  async getSubscriptionById(id: number): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.DETAIL(id));
  }

  async updateSubscription(id: number, data: Partial<Subscription>): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.CANCEL(id), {
      method: 'POST',
    });
  }

  async updateSubscriptionScopes(id: number, data: UpdateScopesRequest): Promise<ApiResponse<Subscription>> {
    return this.request<Subscription>(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.UPDATE_SCOPES(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // Goals
  // ============================================================================

  async getGoals(filters?: GoalFilters, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Goal>>> {
    const queryString = this.buildQueryString({ ...filters, ...params });
    return this.request<PaginatedResponse<Goal>>(
      `${API_CONFIG.ENDPOINTS.GOALS.LIST}${queryString}`
    );
  }

  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    return this.request<Goal>(API_CONFIG.ENDPOINTS.GOALS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActiveGoals(): Promise<ApiResponse<Goal[]>> {
    return this.request<Goal[]>(API_CONFIG.ENDPOINTS.GOALS.ACTIVE);
  }

  async getGoalById(id: number): Promise<ApiResponse<Goal>> {
    return this.request<Goal>(API_CONFIG.ENDPOINTS.GOALS.DETAIL(id));
  }

  async updateGoal(id: number, data: Partial<CreateGoalRequest>): Promise<ApiResponse<Goal>> {
    return this.request<Goal>(API_CONFIG.ENDPOINTS.GOALS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.GOALS.DELETE(id), {
      method: 'DELETE',
    });
  }

  async completeGoal(id: number, data?: CompleteGoalRequest): Promise<ApiResponse<Goal>> {
    return this.request<Goal>(API_CONFIG.ENDPOINTS.GOALS.COMPLETE(id), {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async updateGoalProgress(id: number, data: UpdateProgressRequest): Promise<ApiResponse<Goal>> {
    return this.request<Goal>(API_CONFIG.ENDPOINTS.GOALS.UPDATE_PROGRESS(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // Messages
  // ============================================================================

  async getMessages(filters?: MessageFilters, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Message>>> {
    const queryString = this.buildQueryString({ ...filters, ...params });
    return this.request<PaginatedResponse<Message>>(
      `${API_CONFIG.ENDPOINTS.MESSAGES.LIST}${queryString}`
    );
  }

  async createMessage(data: CreateMessageRequest): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDailyMessages(): Promise<ApiResponse<DailyMessage[]>> {
    return this.request<DailyMessage[]>(API_CONFIG.ENDPOINTS.MESSAGES.DAILY);
  }

  async getFavoriteMessages(): Promise<ApiResponse<Message[]>> {
    return this.request<Message[]>(API_CONFIG.ENDPOINTS.MESSAGES.FAVORITES);
  }

  async getMessageById(id: number): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.DETAIL(id));
  }

  async updateMessage(id: number, data: Partial<Message>): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMessage(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(API_CONFIG.ENDPOINTS.MESSAGES.DELETE(id), {
      method: 'DELETE',
    });
  }

  async markMessageAsRead(id: number): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.MARK_READ(id), {
      method: 'POST',
    });
  }

  async rateMessage(id: number, data: RateMessageRequest): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.RATE(id), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleMessageFavorite(id: number): Promise<ApiResponse<Message>> {
    return this.request<Message>(API_CONFIG.ENDPOINTS.MESSAGES.TOGGLE_FAVORITE(id), {
      method: 'POST',
    });
  }

  // ============================================================================
  // Payments
  // ============================================================================

  async verifyPayment(chargeId: string): Promise<ApiResponse<PaymentVerification>> {
    return this.request<PaymentVerification>(API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY(chargeId));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params).filter(([_, value]) => value !== undefined && value !== null);

    if (filtered.length === 0) return '';

    const queryParams = new URLSearchParams();
    filtered.forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    return `?${queryParams.toString()}`;
  }
}

// Export singleton instance
export const signSAService = new SignSAService();
