// services/mock.service.ts
// Mock Data Service for Testing and Offline Mode - Updated to match real API schema

import {
  ApiResponse,
  CreateSubscriptionRequest,
  DailyMessage,
  DashboardStats,
  Goal,
  GoalProgress,
  Message,
  Package,
  PaginatedResponse,
  Scope,
  ScopeCategory,
  ScopeCategoryType,
  Subscription,
  SubscriptionDetail,
  User
} from '@/types/api';

class MockDataService {
  // ============================================================================
  // Mock User Data
  // ============================================================================

  private mockUser: User = {
    id: 1,
    username: 'demo_user',
    email: 'demo@sign-sa.net',
    first_name: 'Ahmed',
    last_name: 'Al-Mansour',
    date_joined: '2024-01-15T10:00:00Z',
  };

  // ============================================================================
  // Mock Scopes (8 Life Domains) - Matching real API schema
  // ============================================================================

  private mockScopes: Scope[] = [
    {
      id: 1,
      name: 'Mental Health',
      category: 'mental' as ScopeCategoryType,
      category_display: 'Mental',
      description: 'Emotional intelligence, mindset, and mental resilience',
      icon: 'brain',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Physical Health',
      category: 'physical' as ScopeCategoryType,
      category_display: 'Physical',
      description: 'Fitness, nutrition, and overall wellness',
      icon: 'dumbbell',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'Career Development',
      category: 'career' as ScopeCategoryType,
      category_display: 'Career',
      description: 'Professional growth and career advancement',
      icon: 'briefcase',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      name: 'Financial Wellness',
      category: 'financial' as ScopeCategoryType,
      category_display: 'Financial',
      description: 'Money management and financial security',
      icon: 'dollar-sign',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      name: 'Relationships',
      category: 'relationships' as ScopeCategoryType,
      category_display: 'Relationships',
      description: 'Building meaningful connections',
      icon: 'heart',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 6,
      name: 'Spiritual Growth',
      category: 'spiritual' as ScopeCategoryType,
      category_display: 'Spiritual',
      description: 'Inner peace and purpose',
      icon: 'sparkles',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 7,
      name: 'Creativity',
      category: 'creativity' as ScopeCategoryType,
      category_display: 'Creativity',
      description: 'Artistic expression and innovation',
      icon: 'palette',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 8,
      name: 'Lifestyle Balance',
      category: 'lifestyle' as ScopeCategoryType,
      category_display: 'Lifestyle',
      description: 'Work-life harmony and personal fulfillment',
      icon: 'sun',
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  // ============================================================================
  // Mock Packages (Subscription Tiers) - Matching real API schema
  // ============================================================================

  private mockPackages: Package[] = [
    {
      id: 1,
      name: 'Free Starter',
      description: 'Perfect for getting started with personal development',
      price: '0.00',
      duration: 'monthly',
      duration_display: 'Monthly',
      duration_days: 30,
      max_scopes: 2,
      messages_per_day: 1,
      custom_goals_enabled: false,
      priority_support: false,
      is_featured: false,
      is_active: true,
      display_order: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Pro Growth',
      description: 'Unlock your full potential with advanced features',
      price: '99.00',
      duration: 'monthly',
      duration_display: 'Monthly',
      duration_days: 30,
      max_scopes: 5,
      messages_per_day: 3,
      custom_goals_enabled: true,
      priority_support: false,
      is_featured: true,
      is_active: true,
      display_order: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'Premium Master',
      description: 'The ultimate personal development experience',
      price: '199.00',
      duration: 'monthly',
      duration_display: 'Monthly',
      duration_days: 30,
      max_scopes: 8,
      messages_per_day: 10,
      custom_goals_enabled: true,
      priority_support: true,
      is_featured: true,
      is_active: true,
      display_order: 3,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  // ============================================================================
  // Mock Subscription - Matching real API schema
  // ============================================================================

  private mockSubscription: SubscriptionDetail = {
    id: 1,
    user: this.mockUser,
    package: this.mockPackages[1], // Pro Growth
    package_id: 2,
    selected_scopes: [this.mockScopes[0], this.mockScopes[1], this.mockScopes[2]],
    selected_scope_ids: [1, 2, 3],
    status: 'active',
    status_display: 'Active',
    is_active_status: true,
    start_date: '2024-11-01T00:00:00Z',
    end_date: '2024-12-01T00:00:00Z',
    payment_id: 'chg_TS02A0120241234567',
    payment_method: 'VISA',
    amount_paid: '99.00',
    auto_renew: true,
    cancelled_at: null,
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  };

  // ============================================================================
  // Mock Goals - Matching real API schema
  // ============================================================================

  private mockGoals: Goal[] = [
    {
      id: 1,
      user: 1,
      subscription: 1,
      scope: 1,
      scope_name: 'Mental Health',
      title: 'Practice Daily Meditation',
      description: 'Meditate for 15 minutes every morning',
      target_date: '2024-12-31',
      status: 'in_progress',
      status_display: 'In Progress',
      progress_percentage: 65,
      created_at: '2024-11-01T00:00:00Z',
      updated_at: '2024-11-29T00:00:00Z',
      completed_at: null,
    },
    {
      id: 2,
      user: 1,
      subscription: 1,
      scope: 2,
      scope_name: 'Physical Health',
      title: 'Run 5K Without Stopping',
      description: 'Build endurance to run 5 kilometers continuously',
      target_date: '2025-01-15',
      status: 'in_progress',
      status_display: 'In Progress',
      progress_percentage: 40,
      created_at: '2024-11-10T00:00:00Z',
      updated_at: '2024-11-29T00:00:00Z',
      completed_at: null,
    },
    {
      id: 3,
      user: 1,
      subscription: 1,
      scope: 3,
      scope_name: 'Career Development',
      title: 'Learn TypeScript Advanced Patterns',
      description: 'Master advanced TypeScript for career growth',
      target_date: '2024-12-15',
      status: 'in_progress',
      status_display: 'In Progress',
      progress_percentage: 80,
      created_at: '2024-10-15T00:00:00Z',
      updated_at: '2024-11-29T00:00:00Z',
      completed_at: null,
    },
  ];

  // ============================================================================
  // Mock Messages (AIMessage) - Matching real API schema
  // ============================================================================

  private mockMessages: Message[] = [
    {
      id: 1,
      user: 1,
      subscription: 1,
      scope: 1,
      scope_name: 'Mental Health',
      goal: 1,
      goal_title: 'Practice Daily Meditation',
      message_type: 'motivational',
      message_type_display: 'Motivational',
      prompt_used: 'Generate a calm motivational message about mental health and meditation',
      content: 'Your mind is your most powerful tool. Take a moment today to practice mindfulness and strengthen your mental resilience.',
      is_read: true,
      is_favorited: true,
      user_rating: 5,
      ai_model: 'gpt-4',
      tokens_used: 156,
      generation_time: 1.2,
      created_at: '2024-11-29T08:00:00Z',
    },
    {
      id: 2,
      user: 1,
      subscription: 1,
      scope: 2,
      scope_name: 'Physical Health',
      goal: 2,
      goal_title: 'Run 5K Without Stopping',
      message_type: 'motivational',
      message_type_display: 'Motivational',
      prompt_used: 'Generate an energetic message about physical fitness and running',
      content: 'Every step you take brings you closer to your goal. Keep pushing forward, champion!',
      is_read: true,
      is_favorited: false,
      user_rating: null,
      ai_model: 'gpt-4',
      tokens_used: 142,
      generation_time: 0.9,
      created_at: '2024-11-29T14:00:00Z',
    },
    {
      id: 3,
      user: 1,
      subscription: 1,
      scope: 3,
      scope_name: 'Career Development',
      goal: 3,
      goal_title: 'Learn TypeScript Advanced Patterns',
      message_type: 'challenging',
      message_type_display: 'Challenging',
      prompt_used: 'Generate motivational message about career development and learning',
      content: "Mastery comes from consistent practice. You're 80% there - finish strong!",
      is_read: false,
      is_favorited: false,
      user_rating: null,
      ai_model: 'gpt-4',
      tokens_used: 138,
      generation_time: 1.1,
      created_at: '2024-11-29T18:00:00Z',
    },
    {
      id: 4,
      user: 1,
      subscription: 1,
      scope: 1,
      scope_name: 'Mental Health',
      goal: null,
      goal_title: null,
      message_type: 'supportive',
      message_type_display: 'Supportive',
      prompt_used: 'Generate calm breathing exercise message',
      content: 'Take three deep breaths. Feel the calm wash over you. You are in control of your peace.',
      is_read: true,
      is_favorited: true,
      user_rating: 5,
      ai_model: 'gpt-4',
      tokens_used: 145,
      generation_time: 1.0,
      created_at: '2024-11-28T20:00:00Z',
    },
    {
      id: 5,
      user: 1,
      subscription: 1,
      scope: 4,
      scope_name: 'Financial Wellness',
      goal: null,
      goal_title: null,
      message_type: 'reminder',
      message_type_display: 'Reminder',
      prompt_used: 'Generate direct message about financial planning',
      content: 'Financial freedom starts with one smart decision at a time. Review your budget today.',
      is_read: true,
      is_favorited: false,
      user_rating: 4,
      ai_model: 'gpt-4',
      tokens_used: 152,
      generation_time: 1.3,
      created_at: '2024-11-27T10:00:00Z',
    },
  ];

  // ============================================================================
  // Public API Methods
  // ============================================================================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await this.simulateDelay();

    const stats: DashboardStats = {
      user: this.mockUser,
      subscription: this.mockSubscription,
      stats: {
        total_messages: 127,
        messages_today: 3,
        favorite_messages: 23,
        current_streak: 12,
        longest_streak: 28,
        active_goals: 3,
        completed_goals: 8,
        active_scopes: 3,
      },
      recent_messages: this.mockMessages.slice(0, 5),
      upcoming_messages: [],
      goals_progress: this.mockGoals.map(goal => ({
        goal,
        progress_percentage: goal.progress_percentage,
        days_remaining: this.calculateDaysRemaining(goal.target_date || ''),
      })),
    };

    return {
      success: true,
      data: stats,
    };
  }

  async getScopes(): Promise<ApiResponse<Scope[]>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockScopes,
    };
  }

  async getScopeCategories(): Promise<ApiResponse<ScopeCategory[]>> {
    await this.simulateDelay();
    
    const categories: ScopeCategory[] = [
      { category: 'mental', name: 'Mental Health', name_ar: 'الصحة النفسية', count: 1 },
      { category: 'physical', name: 'Physical Health', name_ar: 'الصحة البدنية', count: 1 },
      { category: 'career', name: 'Career', name_ar: 'المهنة', count: 1 },
      { category: 'financial', name: 'Financial', name_ar: 'المالية', count: 1 },
      { category: 'relationships', name: 'Relationships', name_ar: 'العلاقات', count: 1 },
      { category: 'spiritual', name: 'Spiritual', name_ar: 'الروحانية', count: 1 },
      { category: 'creativity', name: 'Creativity', name_ar: 'الإبداع', count: 1 },
      { category: 'lifestyle', name: 'Lifestyle', name_ar: 'نمط الحياة', count: 1 },
    ];

    return {
      success: true,
      data: categories,
    };
  }

  async getPackages(): Promise<ApiResponse<Package[]>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockPackages,
    };
  }

  async getActiveSubscription(): Promise<ApiResponse<SubscriptionDetail>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockSubscription,
    };
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<SubscriptionDetail>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockSubscription,
    };
  }

  async getActiveGoals(): Promise<ApiResponse<Goal[]>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockGoals.filter(g => g.status !== 'completed'),
    };
  }

  async getMessages(): Promise<ApiResponse<PaginatedResponse<Message>>> {
    await this.simulateDelay();
    return {
      success: true,
      data: {
        count: this.mockMessages.length,
        next: null,
        previous: null,
        results: this.mockMessages,
      },
    };
  }

  async getFavoriteMessages(): Promise<ApiResponse<Message[]>> {
    await this.simulateDelay();
    return {
      success: true,
      data: this.mockMessages.filter(m => m.is_favorited),
    };
  }

  async getDailyMessages(): Promise<ApiResponse<DailyMessage[]>> {
    await this.simulateDelay();
    
    const today = new Date().toISOString().split('T')[0];
    const dailyMessages: DailyMessage[] = [
      {
        date: today,
        messages: this.mockMessages.filter(m => m.created_at.startsWith(today)),
        total_count: 3,
      },
    ];

    return {
      success: true,
      data: dailyMessages,
    };
  }

  async toggleMessageFavorite(id: number): Promise<ApiResponse<Message>> {
    await this.simulateDelay();
    
    const message = this.mockMessages.find(m => m.id === id);
    if (!message) {
      return {
        success: false,
        data: null as any,
        error: 'Message not found',
      };
    }

    message.is_favorited = !message.is_favorited;
    return {
      success: true,
      data: message,
    };
  }

  async markMessageAsRead(id: number): Promise<ApiResponse<Message>> {
    await this.simulateDelay();
    
    const message = this.mockMessages.find(m => m.id === id);
    if (!message) {
      return {
        success: false,
        data: null as any,
        error: 'Message not found',
      };
    }

    message.is_read = true;
    return {
      success: true,
      data: message,
    };
  }

  async createGoal(data: any): Promise<ApiResponse<Goal>> {
    await this.simulateDelay();
    
    const scope = this.mockScopes.find(s => s.id === data.scope_id);
    const newGoal: Goal = {
      id: this.mockGoals.length + 1,
      user: 1,
      subscription: 1,
      scope: data.scope_id,
      scope_name: scope?.name,
      title: data.title,
      description: data.description,
      target_date: data.target_date,
      status: 'not_started',
      status_display: 'Not Started',
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    };

    this.mockGoals.push(newGoal);
    return {
      success: true,
      data: newGoal,
    };
  }

  async updateGoalProgress(id: number, progress: number): Promise<ApiResponse<Goal>> {
    await this.simulateDelay();
    
    const goal = this.mockGoals.find(g => g.id === id);
    if (!goal) {
      return {
        success: false,
        data: null as any,
        error: 'Goal not found',
      };
    }

    goal.progress_percentage = progress;
    goal.status = progress > 0 ? 'in_progress' : 'not_started';
    goal.status_display = progress > 0 ? 'In Progress' : 'Not Started';
    goal.updated_at = new Date().toISOString();

    return {
      success: true,
      data: goal,
    };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateDaysRemaining(targetDate: string): number {
    if (!targetDate) return 0;
    const target = new Date(targetDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
