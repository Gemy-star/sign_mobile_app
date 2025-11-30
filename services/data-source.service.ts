// services/data-source.service.ts
// Unified data source that switches between API and mock data based on feature flag

import { FEATURE_FLAGS } from '@/config/features.config';
import type { PaginationParams } from '@/types/api';
import { logger } from '@/utils/logger';
import { mockDataService } from './mock.service';
import { signSAService } from './signsa.service';

class DataSourceService {
  private get useApi(): boolean {
    return FEATURE_FLAGS.USE_API;
  }

  private get currentLanguage(): string {
    return signSAService.getLanguage();
  }

  private logDataSource(operation: string): void {
    logger.debug(`DataSource: ${operation} using ${this.useApi ? 'API' : 'MOCK'} data`);
  }

  // Messages methods
  async getMessages(filters?: any, pagination?: PaginationParams) {
    this.logDataSource('getMessages');
    try {
      if (this.useApi) {
        return await signSAService.getMessages(filters, pagination);
      }
      // Add language to filters for mock service
      const filtersWithLanguage = { ...filters, language: this.currentLanguage };
      return await mockDataService.getMessages(filtersWithLanguage);
    } catch (error) {
      logger.error('Get messages failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async getDailyMessage(language?: string) {
    this.logDataSource('getDailyMessage');
    try {
      if (this.useApi) {
        return await signSAService.getDailyMessages();
      }
      return await mockDataService.getDailyMessages(language || this.currentLanguage);
    } catch (error) {
      logger.error('Get daily message failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async createMessage(data: any) {
    this.logDataSource('createMessage');
    try {
      if (this.useApi) {
        return await signSAService.createMessage(data);
      }
      return await mockDataService.createMessage(data);
    } catch (error) {
      logger.error('Create message failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async rateMessage(messageId: number, data: { rating: number }) {
    this.logDataSource('rateMessage');
    try {
      if (this.useApi) {
        return await signSAService.rateMessage(messageId, data);
      }
      return await mockDataService.rateMessage(messageId, data);
    } catch (error) {
      logger.error('Rate message failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  // Goals methods
  async getGoals(filters?: any, pagination?: PaginationParams) {
    this.logDataSource('getGoals');
    try {
      if (this.useApi) {
        return await signSAService.getGoals(filters, pagination);
      }
      // Add language to filters for mock service
      const filtersWithLanguage = { ...filters, language: this.currentLanguage };
      return await mockDataService.getGoals(filtersWithLanguage, pagination);
    } catch (error) {
      logger.error('Get goals failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async createGoal(data: any) {
    this.logDataSource('createGoal');
    try {
      if (this.useApi) {
        return await signSAService.createGoal(data);
      }
      return await mockDataService.createGoal(data);
    } catch (error) {
      logger.error('Create goal failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async updateGoalProgress(goalId: number, data: { progress: number }) {
    this.logDataSource('updateGoalProgress');
    try {
      if (this.useApi) {
        return await signSAService.updateGoalProgress(goalId, data);
      }
      return await mockDataService.updateGoalProgress(goalId, data);
    } catch (error) {
      logger.error('Update goal progress failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async completeGoal(goalId: number) {
    this.logDataSource('completeGoal');
    try {
      if (this.useApi) {
        return await signSAService.completeGoal(goalId);
      }
      return await mockDataService.completeGoal(goalId);
    } catch (error) {
      logger.error('Complete goal failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async deleteGoal(goalId: number) {
    this.logDataSource('deleteGoal');
    try {
      if (this.useApi) {
        return await signSAService.deleteGoal(goalId);
      }
      return await mockDataService.deleteGoal(goalId);
    } catch (error) {
      logger.error('Delete goal failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  // Dashboard methods
  async getDashboardStats(language?: string) {
    this.logDataSource('getDashboardStats');
    try {
      if (this.useApi) {
        return await signSAService.getDashboardStats();
      }
      return await mockDataService.getDashboardStats(language || this.currentLanguage);
    } catch (error) {
      logger.error('Get dashboard stats failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  // Scopes methods
  async getScopes(language?: string) {
    this.logDataSource('getScopes');
    try {
      if (this.useApi) {
        return await signSAService.getScopes();
      }
      return await mockDataService.getScopes(language || this.currentLanguage);
    } catch (error) {
      logger.error('Get scopes failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async getScopeCategories() {
    this.logDataSource('getScopeCategories');
    try {
      if (this.useApi) {
        return await signSAService.getScopeCategories();
      }
      return await mockDataService.getScopeCategories();
    } catch (error) {
      logger.error('Get scope categories failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async updateSubscriptionScopes(subscriptionId: number, data: { selected_scope_ids: number[] }) {
    this.logDataSource('updateSubscriptionScopes');
    try {
      if (this.useApi) {
        return await signSAService.updateSubscriptionScopes(subscriptionId, data);
      }
      return await mockDataService.updateSubscriptionScopes(subscriptionId, data);
    } catch (error) {
      logger.error('Update subscription scopes failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  // Packages methods
  async getPackages(language?: string) {
    this.logDataSource('getPackages');
    try {
      if (this.useApi) {
        return await signSAService.getPackages();
      }
      return await mockDataService.getPackages(language || this.currentLanguage);
    } catch (error) {
      logger.error('Get packages failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  // Subscription methods
  async getActiveSubscription() {
    this.logDataSource('getActiveSubscription');
    try {
      if (this.useApi) {
        return await signSAService.getActiveSubscription();
      }
      return await mockDataService.getActiveSubscription();
    } catch (error) {
      logger.error('Get active subscription failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }

  async createSubscription(data: any) {
    this.logDataSource('createSubscription');
    try {
      if (this.useApi) {
        return await signSAService.createSubscription(data);
      }
      return await mockDataService.createSubscription(data);
    } catch (error) {
      logger.error('Create subscription failed', error as Error, { useApi: this.useApi });
      throw error;
    }
  }
}

export const dataSource = new DataSourceService();
