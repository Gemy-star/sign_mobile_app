// services/dataSource.service.ts
// Unified Data Source - Switches between Real API and Mock Data

import { API_CONFIG } from '@/config/api.config';
import {
    CreateGoalRequest,
    CreateMessageRequest,
    CreateSubscriptionRequest,
    DailyMessage,
    Goal,
    Message,
    Package,
    PaginatedResponse,
    Scope,
    ScopeCategory,
    SubscriptionDetail,
    UpdateScopesRequest,
    User
} from '@/types/api';
import {
    authApi,
    dashboardApi,
    DashboardStats // Import DashboardStats from dashboard.api instead
    ,

    goalsApi,
    messagesApi,
    packagesApi,
    scopesApi,
    subscriptionsApi
} from './api';
import { apiClient } from './api.client';
import { mockDataService } from './mock.service';

// ============================================================================
// Unified Data Source Service
// Automatically switches between Mock Data and Real API based on API_CONFIG
// ============================================================================

class DataSourceService {
  private get useMock(): boolean {
    return API_CONFIG.USE_MOCK_DATA;
  }

  private logSource(method: string) {
    if (API_CONFIG.DEBUG) {
      console.log(`🔄 DataSource.${method}: Using ${this.useMock ? 'MOCK' : 'API'} data`);
    }
  }

  // ============================================================================
  // Authentication
  // ============================================================================

  async login(credentials: { username: string; password: string }): Promise<{
    success: boolean;
    data?: { access: string; refresh: string };
    error?: string;
  }> {
    this.logSource('login');

    if (this.useMock) {
      // Mock login - simulate API response
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credentials.username === 'admin' && credentials.password === 'admin123456') {
        const tokens = {
          access: 'mock_access_token_' + Date.now(),
          refresh: 'mock_refresh_token_' + Date.now(),
        };
        await apiClient.setTokens(tokens.access, tokens.refresh);
        return { success: true, data: tokens };
      }

      return { success: false, error: 'Invalid credentials' };
    }

    try {
      const response = await authApi.login(credentials);
      await apiClient.setTokens(response.access, response.refresh);
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  }

  async register(data: any): Promise<{
    success: boolean;
    data?: { access: string; refresh: string };
    error?: string;
  }> {
    this.logSource('register');

    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const tokens = {
        access: 'mock_access_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now(),
      };
      await apiClient.setTokens(tokens.access, tokens.refresh);
      return { success: true, data: tokens };
    }

    try {
      const response = await authApi.register(data);
      await apiClient.setTokens(response.access, response.refresh);
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed'
      };
    }
  }

  async getProfile(): Promise<{ success: boolean; data?: User; error?: string }> {
    this.logSource('getProfile');

    if (this.useMock) {
      const response = await mockDataService.getProfile();
      return response;
    }

    try {
      const user = await authApi.getProfile();
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: 'Failed to load profile' };
    }
  }

  async logout(): Promise<void> {
    this.logSource('logout');
    await apiClient.clearTokens();
  }

  // ============================================================================
  // Dashboard
  // ============================================================================

  async getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
    this.logSource('getDashboardStats');

    if (this.useMock) {
      return mockDataService.getDashboardStats();
    }

    try {
      const stats = await dashboardApi.getStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: 'Failed to load dashboard stats' };
    }
  }

  // ============================================================================
  // Scopes
  // ============================================================================

  async getScopes(): Promise<{ success: boolean; data?: Scope[]; error?: string }> {
    this.logSource('getScopes');

    if (this.useMock) {
      return mockDataService.getScopes();
    }

    try {
      const scopes = await scopesApi.getAll();
      return { success: true, data: scopes };
    } catch (error) {
      return { success: false, error: 'Failed to load scopes' };
    }
  }

  async getScopeCategories(): Promise<{ success: boolean; data?: ScopeCategory[]; error?: string }> {
    this.logSource('getScopeCategories');

    if (this.useMock) {
      return mockDataService.getScopeCategories();
    }

    try {
      const categories = await scopesApi.getByCategory();
      return { success: true, data: categories };
    } catch (error) {
      return { success: false, error: 'Failed to load scope categories' };
    }
  }

  // ============================================================================
  // Packages
  // ============================================================================

  async getPackages(): Promise<{ success: boolean; data?: Package[]; error?: string }> {
    this.logSource('getPackages');

    if (this.useMock) {
      return mockDataService.getPackages();
    }

    try {
      const packages = await packagesApi.getAll();
      return { success: true, data: packages };
    } catch (error) {
      return { success: false, error: 'Failed to load packages' };
    }
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  async getActiveSubscription(): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('getActiveSubscription');

    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }

    try {
      const subscription = await subscriptionsApi.getCurrent();
      return { success: true, data: subscription };
    } catch (error) {
      return { success: false, error: 'Failed to load subscription' };
    }
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<{
    success: boolean;
    data?: SubscriptionDetail;
    error?: string;
  }> {
    this.logSource('createSubscription');

    if (this.useMock) {
      return mockDataService.createSubscription(data);
    }

    try {
      const result = await subscriptionsApi.create(data);
      return { success: true, data: result.subscription };
    } catch (error) {
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  async updateSubscriptionScopes(
    subscriptionId: number,
    data: UpdateScopesRequest
  ): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('updateSubscriptionScopes');

    if (this.useMock) {
      return mockDataService.updateSubscriptionScopes(subscriptionId, data);
    }

    try {
      const subscription = await subscriptionsApi.updateScopes(subscriptionId, data);
      return { success: true, data: subscription };
    } catch (error) {
      return { success: false, error: 'Failed to update scopes' };
    }
  }

  // ============================================================================
  // Goals
  // ============================================================================

  async getGoals(filters?: any): Promise<{
    success: boolean;
    data?: PaginatedResponse<Goal>;
    error?: string;
  }> {
    this.logSource('getGoals');

    if (this.useMock) {
      return mockDataService.getGoals(filters);
    }

    try {
      const goals = await goalsApi.getAll(filters);
      return {
        success: true,
        data: {
          results: goals,
          count: goals.length,
          next: null,
          previous: null,
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to load goals' };
    }
  }

  async getActiveGoals(): Promise<{ success: boolean; data?: Goal[]; error?: string }> {
    this.logSource('getActiveGoals');

    if (this.useMock) {
      return mockDataService.getActiveGoals();
    }

    try {
      const goals = await goalsApi.getActive();
      return { success: true, data: goals };
    } catch (error) {
      return { success: false, error: 'Failed to load active goals' };
    }
  }

  async createGoal(data: CreateGoalRequest): Promise<{ success: boolean; data?: Goal; error?: string }> {
    this.logSource('createGoal');

    if (this.useMock) {
      return mockDataService.createGoal(data);
    }

    try {
      const goal = await goalsApi.create(data);
      return { success: true, data: goal };
    } catch (error) {
      return { success: false, error: 'Failed to create goal' };
    }
  }

  async updateGoalProgress(
    goalId: number,
    progress_percentage: number
  ): Promise<{ success: boolean; data?: Goal; error?: string }> {
    this.logSource('updateGoalProgress');

    if (this.useMock) {
      return mockDataService.updateGoalProgress(goalId, progress_percentage);
    }

    try {
      const goal = await goalsApi.updateProgress(goalId, progress_percentage);
      return { success: true, data: goal };
    } catch (error) {
      return { success: false, error: 'Failed to update goal progress' };
    }
  }

  async completeGoal(goalId: number): Promise<{ success: boolean; data?: Goal; error?: string }> {
    this.logSource('completeGoal');

    if (this.useMock) {
      return mockDataService.completeGoal(goalId);
    }

    try {
      const goal = await goalsApi.complete(goalId);
      return { success: true, data: goal };
    } catch (error) {
      return { success: false, error: 'Failed to complete goal' };
    }
  }

  async deleteGoal(goalId: number): Promise<{ success: boolean; error?: string }> {
    this.logSource('deleteGoal');

    if (this.useMock) {
      return mockDataService.deleteGoal(goalId);
    }

    try {
      await goalsApi.delete(goalId);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete goal' };
    }
  }

  // ============================================================================
  // Messages
  // ============================================================================

  async getMessages(filters?: any, pagination?: any): Promise<{
    success: boolean;
    data?: PaginatedResponse<Message>;
    error?: string;
  }> {
    this.logSource('getMessages');

    if (this.useMock) {
      return mockDataService.getMessages({ ...filters, ...pagination });
    }

    try {
      const messages = await messagesApi.getAll(filters);
      return {
        success: true,
        data: {
          results: messages,
          count: messages.length,
          next: null,
          previous: null,
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to load messages' };
    }
  }

  async getDailyMessages(): Promise<{ success: boolean; data?: DailyMessage[]; error?: string }> {
    this.logSource('getDailyMessages');

    if (this.useMock) {
      return mockDataService.getDailyMessages();
    }

    try {
      const messages = await messagesApi.getDaily();
      return { success: true, data: messages };
    } catch (error) {
      return { success: false, error: 'Failed to load daily messages' };
    }
  }

  async getFavoriteMessages(): Promise<{ success: boolean; data?: Message[]; error?: string }> {
    this.logSource('getFavoriteMessages');

    if (this.useMock) {
      return mockDataService.getFavoriteMessages();
    }

    try {
      const messages = await messagesApi.getFavorites();
      return { success: true, data: messages };
    } catch (error) {
      return { success: false, error: 'Failed to load favorite messages' };
    }
  }

  async createMessage(data: CreateMessageRequest): Promise<{ success: boolean; data?: Message; error?: string }> {
    this.logSource('createMessage');

    if (this.useMock) {
      return mockDataService.createMessage(data);
    }

    try {
      const message = await messagesApi.create(data);
      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: 'Failed to create message' };
    }
  }

  async toggleMessageFavorite(messageId: number): Promise<{ success: boolean; data?: Message; error?: string }> {
    this.logSource('toggleMessageFavorite');

    if (this.useMock) {
      return mockDataService.toggleMessageFavorite(messageId);
    }

    try {
      const message = await messagesApi.toggleFavorite(messageId);
      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: 'Failed to toggle favorite' };
    }
  }

  async markMessageAsRead(messageId: number): Promise<{ success: boolean; data?: Message; error?: string }> {
    this.logSource('markMessageAsRead');

    if (this.useMock) {
      return mockDataService.markMessageAsRead(messageId);
    }

    try {
      const message = await messagesApi.markAsRead(messageId);
      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: 'Failed to mark as read' };
    }
  }

  async rateMessage(messageId: number, rating: number): Promise<{ success: boolean; data?: Message; error?: string }> {
    this.logSource('rateMessage');

    if (this.useMock) {
      return mockDataService.rateMessage(messageId, { rating });
    }

    try {
      const message = await messagesApi.rate(messageId, rating);
      return { success: true, data: message };
    } catch (error) {
      return { success: false, error: 'Failed to rate message' };
    }
  }
}

// Export singleton instance
export const dataSource = new DataSourceService();
export default dataSource;
