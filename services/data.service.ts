// services/data.service.ts
// Unified Data Service - Switches between Mock and Real API

import { API_CONFIG } from '@/config/api.config';
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
  UpdateScopesRequest,
} from '@/types/api';
import { mockDataService } from './mock.service';
import { signSAService } from './signsa.service';

/**
 * Unified Data Service
 * Automatically switches between mock data and real API based on API_CONFIG.USE_MOCK_DATA
 */
class DataService {
  private get useMock(): boolean {
    return API_CONFIG.USE_MOCK_DATA;
  }

  // ============================================================================
  // Dashboard
  // ============================================================================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    if (this.useMock) {
      return mockDataService.getDashboardStats();
    }
    return signSAService.getDashboardStats();
  }

  // ============================================================================
  // Scopes (Life Domains)
  // ============================================================================

  async getScopes(): Promise<ApiResponse<Scope[]>> {
    if (this.useMock) {
      return mockDataService.getScopes();
    }
    return signSAService.getScopes();
  }

  async getScopeCategories(): Promise<ApiResponse<ScopeCategory[]>> {
    if (this.useMock) {
      return mockDataService.getScopeCategories();
    }
    return signSAService.getScopeCategories();
  }

  async getScopeById(id: number): Promise<ApiResponse<Scope>> {
    if (this.useMock) {
      const scopes = await mockDataService.getScopes();
      const scope = scopes.data?.find(s => s.id === id);
      if (!scope) {
        return { success: false, data: null as any, error: 'Scope not found' };
      }
      return { success: true, data: scope };
    }
    return signSAService.getScopeById(id);
  }

  // ============================================================================
  // Packages (Subscription Tiers)
  // ============================================================================

  async getPackages(): Promise<ApiResponse<Package[]>> {
    if (this.useMock) {
      return mockDataService.getPackages();
    }
    return signSAService.getPackages();
  }

  async getFeaturedPackages(): Promise<ApiResponse<Package[]>> {
    if (this.useMock) {
      const packages = await mockDataService.getPackages();
      const featured = packages.data?.filter(p => p.is_featured) || [];
      return { success: true, data: featured };
    }
    return signSAService.getFeaturedPackages();
  }

  async getPackageById(id: number): Promise<ApiResponse<Package>> {
    if (this.useMock) {
      const packages = await mockDataService.getPackages();
      const pkg = packages.data?.find(p => p.id === id);
      if (!pkg) {
        return { success: false, data: null as any, error: 'Package not found' };
      }
      return { success: true, data: pkg };
    }
    return signSAService.getPackageById(id);
  }

  async getPackageComparison(id: number): Promise<ApiResponse<PackageComparison>> {
    if (this.useMock) {
      // Mock comparison data
      const packages = await mockDataService.getPackages();
      return {
        success: true,
        data: {
          packages: packages.data || [],
          features: [],
        },
      };
    }
    return signSAService.getPackageComparison(id);
  }

  // ============================================================================
  // Subscriptions
  // ============================================================================

  async getSubscriptions(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Subscription>>> {
    if (this.useMock) {
      const sub = await mockDataService.getActiveSubscription();
      return {
        success: true,
        data: {
          count: 1,
          next: null,
          previous: null,
          results: sub.data ? [sub.data] : [],
        },
      };
    }
    return signSAService.getSubscriptions(params);
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<Subscription>> {
    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }
    return signSAService.createSubscription(data);
  }

  async getActiveSubscription(): Promise<ApiResponse<Subscription>> {
    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }
    return signSAService.getActiveSubscription();
  }

  async getSubscriptionById(id: number): Promise<ApiResponse<Subscription>> {
    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }
    return signSAService.getSubscriptionById(id);
  }

  async updateSubscription(id: number, data: Partial<Subscription>): Promise<ApiResponse<Subscription>> {
    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }
    return signSAService.updateSubscription(id, data);
  }

  async cancelSubscription(id: number): Promise<ApiResponse<{ message: string }>> {
    if (this.useMock) {
      return {
        success: true,
        data: { message: 'Subscription cancelled successfully' },
      };
    }
    return signSAService.cancelSubscription(id);
  }

  async updateSubscriptionScopes(id: number, data: UpdateScopesRequest): Promise<ApiResponse<Subscription>> {
    if (this.useMock) {
      return mockDataService.getActiveSubscription();
    }
    return signSAService.updateSubscriptionScopes(id, data);
  }

  // ============================================================================
  // Goals
  // ============================================================================

  async getGoals(filters?: GoalFilters, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Goal>>> {
    if (this.useMock) {
      const goals = await mockDataService.getActiveGoals();
      return {
        success: true,
        data: {
          count: goals.data?.length || 0,
          next: null,
          previous: null,
          results: goals.data || [],
        },
      };
    }
    return signSAService.getGoals(filters, params);
  }

  async createGoal(data: CreateGoalRequest): Promise<ApiResponse<Goal>> {
    if (this.useMock) {
      return mockDataService.createGoal(data);
    }
    return signSAService.createGoal(data);
  }

  async getActiveGoals(): Promise<ApiResponse<Goal[]>> {
    if (this.useMock) {
      return mockDataService.getActiveGoals();
    }
    return signSAService.getActiveGoals();
  }

  async getGoalById(id: number): Promise<ApiResponse<Goal>> {
    if (this.useMock) {
      const goals = await mockDataService.getActiveGoals();
      const goal = goals.data?.find(g => g.id === id);
      if (!goal) {
        return { success: false, data: null as any, error: 'Goal not found' };
      }
      return { success: true, data: goal };
    }
    return signSAService.getGoalById(id);
  }

  async updateGoal(id: number, data: Partial<CreateGoalRequest>): Promise<ApiResponse<Goal>> {
    if (this.useMock) {
      const goal = await this.getGoalById(id);
      return goal;
    }
    return signSAService.updateGoal(id, data);
  }

  async deleteGoal(id: number): Promise<ApiResponse<void>> {
    if (this.useMock) {
      return { success: true, data: undefined };
    }
    return signSAService.deleteGoal(id);
  }

  async completeGoal(id: number, data?: CompleteGoalRequest): Promise<ApiResponse<Goal>> {
    if (this.useMock) {
      const goal = await this.getGoalById(id);
      if (goal.data) {
        goal.data.status = 'completed';
        goal.data.status_display = 'Completed';
        goal.data.completed_at = new Date().toISOString();
        goal.data.progress_percentage = 100;
      }
      return goal;
    }
    return signSAService.completeGoal(id, data);
  }

  async updateGoalProgress(id: number, data: UpdateProgressRequest): Promise<ApiResponse<Goal>> {
    if (this.useMock) {
      return mockDataService.updateGoalProgress(id, data.progress);
    }
    return signSAService.updateGoalProgress(id, data);
  }

  // ============================================================================
  // Messages
  // ============================================================================

  async getMessages(filters?: MessageFilters, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Message>>> {
    if (this.useMock) {
      return mockDataService.getMessages();
    }
    return signSAService.getMessages(filters, params);
  }

  async createMessage(data: CreateMessageRequest): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      return {
        success: true,
        data: null as any,
        message: 'Message created (mock)',
      };
    }
    return signSAService.createMessage(data);
  }

  async getDailyMessages(): Promise<ApiResponse<DailyMessage[]>> {
    if (this.useMock) {
      return mockDataService.getDailyMessages();
    }
    return signSAService.getDailyMessages();
  }

  async getFavoriteMessages(): Promise<ApiResponse<Message[]>> {
    if (this.useMock) {
      return mockDataService.getFavoriteMessages();
    }
    return signSAService.getFavoriteMessages();
  }

  async getMessageById(id: number): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      const messages = await mockDataService.getMessages();
      const message = messages.data?.results.find(m => m.id === id);
      if (!message) {
        return { success: false, data: null as any, error: 'Message not found' };
      }
      return { success: true, data: message };
    }
    return signSAService.getMessageById(id);
  }

  async updateMessage(id: number, data: Partial<Message>): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      const message = await this.getMessageById(id);
      return message;
    }
    return signSAService.updateMessage(id, data);
  }

  async deleteMessage(id: number): Promise<ApiResponse<void>> {
    if (this.useMock) {
      return { success: true, data: undefined };
    }
    return signSAService.deleteMessage(id);
  }

  async markMessageAsRead(id: number): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      return mockDataService.markMessageAsRead(id);
    }
    return signSAService.markMessageAsRead(id);
  }

  async rateMessage(id: number, data: RateMessageRequest): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      const message = await this.getMessageById(id);
      if (message.data) {
        message.data.user_rating = data.rating;
      }
      return message;
    }
    return signSAService.rateMessage(id, data);
  }

  async toggleMessageFavorite(id: number): Promise<ApiResponse<Message>> {
    if (this.useMock) {
      return mockDataService.toggleMessageFavorite(id);
    }
    return signSAService.toggleMessageFavorite(id);
  }

  // ============================================================================
  // Payments
  // ============================================================================

  async verifyPayment(chargeId: string): Promise<ApiResponse<PaymentVerification>> {
    if (this.useMock) {
      return {
        success: true,
        data: {
          charge_id: chargeId,
          status: 'captured',
          message: 'Payment verified successfully (mock)',
        },
      };
    }
    return signSAService.verifyPayment(chargeId);
  }
}

// Export singleton instance
export const dataService = new DataService();

// Export for convenience
export { API_CONFIG } from '@/config/api.config';

