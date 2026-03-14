// services/dataSource.service.ts
// Unified Data Source - Switches between Real API and Mock Data

import { API_CONFIG } from '@/config/api.config';
import {
  AdminTrialRequest,
  CheckAccessRequest,
  CreateGoalRequest,
  CreateMessageRequest,
  CreateSubscriptionRequest,
  DailyMessage,
  Goal,
  Message,
  Package,
  PaginatedResponse,
  RegisterRequest,
  Scope,
  ScopeCategory,
  SubscriptionDetail,
  SubscriptionList,
  UpdateGoalRequest,
  UpdateScopesRequest,
  User
} from '@/types/api';
import {
  adminApi,
  authApi,
  dashboardApi,
  DashboardStats,
  goalsApi,
  messagesApi,
  packagesApi,
  paymentsApi,
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
      console.log(`ðŸ”„ DataSource.${method}: Using ${this.useMock ? 'MOCK' : 'API'} data`);
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

      // Accept username OR email, case-insensitively
      const loginId = credentials.username.toLowerCase().trim();
      const validIds = ['admin', 'admin@example.com'];
      if (validIds.includes(loginId) && credentials.password === 'admin123456') {
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
      const access = response.token.access;
      const refresh = response.token.refresh;
      await apiClient.setTokens(access, refresh);
      return { success: true, data: { access, refresh } };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  }

  async register(data: RegisterRequest): Promise<{
    success: boolean;
    data?: { access: string; refresh: string; user: User };
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
      const profile = await mockDataService.getProfile();
      return { success: true, data: { ...tokens, user: profile.data! } };
    }

    try {
      const response = await authApi.register(data);
      await apiClient.setTokens(response.tokens.access, response.tokens.refresh);
      return { success: true, data: { access: response.tokens.access, refresh: response.tokens.refresh, user: response.user } };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || 'Registration failed'
      };
    }
  }

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data?: User; error?: string }> {
    this.logSource('updateProfile');

    if (this.useMock) {
      const profile = await mockDataService.getProfile();
      return { success: true, data: { ...profile.data!, ...data } };
    }

    try {
      const user = await authApi.updateProfile(data);
      return { success: true, data: user };
    } catch {
      return { success: false, error: 'Failed to update profile' };
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
    } catch {
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
    } catch {
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
    } catch {
      return { success: false, error: 'Failed to load scopes' };
    }
  }

  async getScopeCategories(): Promise<{ success: boolean; data?: ScopeCategory[]; error?: string }> {
    this.logSource('getScopeCategories');

    if (this.useMock) {
      return mockDataService.getScopeCategories();
    }

    try {
      const categories = await scopesApi.getCategories();
      return { success: true, data: categories };
    } catch {
      return { success: false, error: 'Failed to load scope categories' };
    }
  }

  async getScopeById(id: number): Promise<{ success: boolean; data?: Scope; error?: string }> {
    this.logSource('getScopeById');
    try {
      const scope = await scopesApi.getById(id);
      return { success: true, data: scope };
    } catch {
      return { success: false, error: 'Failed to load scope' };
    }
  }

  async checkScopeAccess(data: CheckAccessRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    this.logSource('checkScopeAccess');
    try {
      const result = await scopesApi.checkAccess(data);
      return { success: true, data: result };
    } catch {
      return { success: false, error: 'Failed to check scope access' };
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
    } catch {
      return { success: false, error: 'Failed to load packages' };
    }
  }

  async getFeaturedPackages(): Promise<{ success: boolean; data?: Package[]; error?: string }> {
    this.logSource('getFeaturedPackages');
    if (this.useMock) {
      const all = await mockDataService.getPackages();
      return { ...all, data: all.data?.filter(p => p.is_featured) };
    }
    try {
      const packages = await packagesApi.getFeatured();
      return { success: true, data: packages };
    } catch {
      return { success: false, error: 'Failed to load featured packages' };
    }
  }

  async getPackageById(id: number): Promise<{ success: boolean; data?: Package; error?: string }> {
    this.logSource('getPackageById');
    try {
      const pkg = await packagesApi.getById(id);
      return { success: true, data: pkg };
    } catch {
      return { success: false, error: 'Failed to load package' };
    }
  }

  async getPackageComparison(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    this.logSource('getPackageComparison');
    try {
      const comparison = await packagesApi.getComparison(id);
      return { success: true, data: comparison };
    } catch {
      return { success: false, error: 'Failed to load package comparison' };
    }
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  async getSubscriptions(): Promise<{ success: boolean; data?: SubscriptionList[]; error?: string }> {
    this.logSource('getSubscriptions');
    if (this.useMock) {
      const active = await mockDataService.getActiveSubscription();
      return { success: true, data: active.data ? [active.data as any] : [] };
    }
    try {
      const subs = await subscriptionsApi.getAll();
      return { success: true, data: subs };
    } catch {
      return { success: false, error: 'Failed to load subscriptions' };
    }
  }

  async getActiveSubscription(): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('getActiveSubscription');

    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }

    try {
      const subscription = await subscriptionsApi.getActive();
      return { success: true, data: subscription };
    } catch {
      return { success: false, error: 'Failed to load subscription' };
    }
  }

  async getSubscriptionById(id: number): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('getSubscriptionById');
    try {
      const sub = await subscriptionsApi.getById(id);
      return { success: true, data: sub };
    } catch {
      return { success: false, error: 'Failed to load subscription' };
    }
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<{
    success: boolean;
    data?: { subscription_id: number; payment_url: string; charge_id: string; status: string };
    error?: string;
  }> {
    this.logSource('createSubscription');

    if (this.useMock) {
      const mockSub = await mockDataService.createSubscription(data);
      if (mockSub.success && mockSub.data) {
        return { success: true, data: { subscription_id: (mockSub.data as any).id, payment_url: '', charge_id: '', status: 'payment_initiated' } };
      }
      return { success: false, error: 'Failed to create subscription' };
    }

    try {
      const result = await subscriptionsApi.create(data);
      return { success: true, data: result };
    } catch {
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  async patchSubscription(id: number, data: Partial<SubscriptionDetail>): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('patchSubscription');
    try {
      const sub = await subscriptionsApi.patch(id, data);
      return { success: true, data: sub };
    } catch {
      return { success: false, error: 'Failed to update subscription' };
    }
  }

  async cancelSubscription(id: number): Promise<{ success: boolean; error?: string }> {
    this.logSource('cancelSubscription');
    if (this.useMock) {
      return { success: true };
    }
    try {
      await subscriptionsApi.cancel(id);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }

  async deleteSubscription(id: number): Promise<{ success: boolean; error?: string }> {
    this.logSource('deleteSubscription');
    try {
      await subscriptionsApi.delete(id);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete subscription' };
    }
  }

  async updateSubscriptionScopes(
    subscriptionId: number,
    data: UpdateScopesRequest
  ): Promise<{ success: boolean; data?: SubscriptionDetail; error?: string }> {
    this.logSource('updateSubscriptionScopes');

    if (this.useMock) {
      return mockDataService.updateSubscriptionScopes(subscriptionId, { selected_scope_ids: data.scope_ids });
    }

    try {
      const subscription = await subscriptionsApi.updateScopes(subscriptionId, data);
      return { success: true, data: subscription };
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      return { success: false, error: 'Failed to load messages' };
    }
  }

  async getDailyMessages(): Promise<{ success: boolean; data?: DailyMessage[]; error?: string }> {
    this.logSource('getDailyMessages');

    if (this.useMock) {
      return mockDataService.getDailyMessages();
    }

    try {
      const message = await messagesApi.getDaily();
      const today = new Date().toISOString().split('T')[0];
      return { success: true, data: [{ date: today, messages: [message], total_count: 1 }] };
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      return { success: false, error: 'Failed to rate message' };
    }
  }

  async deleteMessage(messageId: number): Promise<{ success: boolean; error?: string }> {
    this.logSource('deleteMessage');
    try {
      await messagesApi.delete(messageId);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to delete message' };
    }
  }

  async getMessageById(messageId: number): Promise<{ success: boolean; data?: Message; error?: string }> {
    this.logSource('getMessageById');
    try {
      const message = await messagesApi.getById(messageId);
      return { success: true, data: message };
    } catch {
      return { success: false, error: 'Failed to load message' };
    }
  }

  async getGoalById(goalId: number): Promise<{ success: boolean; data?: Goal; error?: string }> {
    this.logSource('getGoalById');
    try {
      const goal = await goalsApi.getById(goalId);
      return { success: true, data: goal };
    } catch {
      return { success: false, error: 'Failed to load goal' };
    }
  }

  async updateGoal(goalId: number, data: UpdateGoalRequest): Promise<{ success: boolean; data?: Goal; error?: string }> {
    this.logSource('updateGoal');
    try {
      const goal = await goalsApi.update(goalId, data);
      return { success: true, data: goal };
    } catch {
      return { success: false, error: 'Failed to update goal' };
    }
  }

  // ============================================================================
  // Payments
  // ============================================================================

  async verifyPayment(chargeId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    this.logSource('verifyPayment');
    try {
      const result = await paymentsApi.verifyPayment(chargeId);
      return { success: true, data: result };
    } catch {
      return { success: false, error: 'Payment verification failed' };
    }
  }

  // ============================================================================
  // Admin
  // ============================================================================

  async getAdminUsers(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    this.logSource('getAdminUsers');
    try {
      const users = await adminApi.getUsers();
      return { success: true, data: users };
    } catch {
      return { success: false, error: 'Failed to load admin users' };
    }
  }

  async manageTrial(data: AdminTrialRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    this.logSource('manageTrial');
    try {
      const result = await adminApi.manageTrial(data);
      return { success: true, data: result };
    } catch {
      return { success: false, error: 'Failed to manage trial' };
    }
  }
}

// Export singleton instance
export const dataSource = new DataSourceService();
export default dataSource;
