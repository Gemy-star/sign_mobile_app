// types/api.ts
// TypeScript interfaces for Sign SA API

// ============================================================================
// API Response Wrapper Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  mobile_phone?: string;
  country?: string;
  date_of_birth?: string; // YYYY-MM-DD
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface TokenVerifyRequest {
  token: string;
}

export type UserRole = 'normal' | 'subscriber' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  role_display: string;
  mobile_phone?: string | null;
  country?: string;
  date_of_birth?: string | null;
  is_phone_verified: boolean;
  trial_started_at?: string | null;
  trial_expires_at?: string | null;
  has_used_trial: boolean;
  has_active_trial: string;
  trial_remaining_days: string;
  is_active?: boolean;
  date_joined: string;
}

// ============================================================================
// Scope Types (8 Life Domains)
// ============================================================================

export interface Scope {
  id: number;
  name: string;
  category: ScopeCategoryType;
  category_display?: string;
  description: string;
  icon?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ScopeCategoryType =
  | 'mental'
  | 'physical'
  | 'career'
  | 'financial'
  | 'relationships'
  | 'spiritual'
  | 'creativity'
  | 'lifestyle';

export interface ScopeCategory {
  category: ScopeCategoryType;
  name: string;
  name_ar: string;
  count: number;
}

// ============================================================================
// Package Types (Subscription Tiers)
// ============================================================================

export interface Package {
  id: number;
  name: string;
  description: string;
  price: string; // decimal
  duration: PackageDuration;
  duration_display?: string;
  duration_days: number; // Number of days for this package
  max_scopes?: number; // Maximum number of scopes user can select
  messages_per_day?: number; // Number of AI messages per day
  custom_goals_enabled: boolean; // Allow users to set custom goals
  priority_support: boolean;
  is_active: boolean;
  is_featured: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export type PackageDuration = 'monthly' | 'quarterly' | 'yearly';

export interface PackageFeature {
  id: number;
  name: string;
  description: string;
  is_premium: boolean;
}

export interface PackageComparison {
  packages: Package[];
  features: ComparisonFeature[];
}

export interface ComparisonFeature {
  name: string;
  name_ar: string;
  values: { [packageId: number]: boolean | string | number };
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface SubscriptionList {
  id: number;
  user: number;
  user_email?: string;
  package: number;
  package_name?: string;
  status: SubscriptionStatus;
  status_display?: string;
  is_active_status: boolean;
  start_date?: string | null;
  end_date?: string | null;
  amount_paid?: string | null; // decimal
  auto_renew: boolean;
  created_at: string;
}

export interface SubscriptionDetail {
  id: number;
  user: User;
  package: Package;
  package_id: number;
  selected_scopes: Scope[]; // readOnly
  selected_scope_ids: number[];
  status: SubscriptionStatus;
  status_display?: string;
  is_active_status: boolean;
  start_date?: string | null;
  end_date?: string | null;
  payment_id?: string | null; // Tap Payment ID
  payment_method?: string | null;
  amount_paid?: string | null; // decimal
  auto_renew: boolean;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type Subscription = SubscriptionDetail; // Default to detail view

export type SubscriptionStatus =
  | 'pending'
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'payment_failed';

export interface CreateSubscriptionRequest {
  package_id: number;
  selected_scope_ids?: number[];
  customer_email?: string;
  customer_phone?: string;
  redirect_url?: string;
  post_url?: string;
}

export interface UpdateScopesRequest {
  selected_scope_ids: number[];
}

// ============================================================================
// Goal Types
// ============================================================================

export interface Goal {
  id: number;
  user: number; // readOnly
  subscription: number;
  scope?: number | null;
  scope_name?: string; // readOnly
  title: string;
  description?: string;
  target_date?: string | null; // date format
  status: GoalStatus;
  status_display?: string; // readOnly
  progress_percentage: number; // 0-100
  created_at: string; // readOnly
  updated_at: string; // readOnly
  completed_at?: string | null;
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'abandoned';

export interface CreateGoalRequest {
  subscription: number;
  scope?: number | null;
  title: string;
  description?: string;
  target_date?: string | null; // YYYY-MM-DD
}

export interface UpdateGoalRequest {
  subscription?: number;
  scope?: number | null;
  title?: string;
  description?: string;
  target_date?: string | null;
  status?: GoalStatus;
  progress_percentage?: number;
}

export interface UpdateProgressRequest {
  progress_percentage: number;
}

export interface CompleteGoalRequest {
  completed_at?: string;
}

// ============================================================================
// Message Types (AIMessage)
// ============================================================================

export interface Message {
  id: number;
  user: number;
  subscription: number;
  scope?: number | null;
  scope_name?: string;
  goal?: number | null;
  goal_title?: string;
  message_type: MessageType;
  message_type_display?: string;
  prompt_used?: string; // The prompt sent to ChatGPT
  content?: string; // AI-generated message content
  is_read: boolean;
  is_favorited: boolean;
  user_rating?: number | null; // 1-5 rating
  ai_model?: string;
  tokens_used?: number | null;
  generation_time?: number | null; // Time in seconds
  created_at: string;
}

export type MessageType =
  | 'motivational'
  | 'supportive'
  | 'challenging'
  | 'reminder';

export type MessageTone = MessageType; // Alias for compatibility

export interface CreateMessageRequest {
  scope_id: number;
  goal_id?: number;
  tone: MessageTone;
  scheduled_for?: string;
}

export interface RateMessageRequest {
  rating: number; // 1-5
}

export interface DailyMessage {
  date: string;
  messages: Message[];
  total_count: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentRequest {
  package_id: number;
  scope_ids: number[];
  success_url: string;
  cancel_url: string;
}

export interface PaymentResponse {
  charge_id: string;
  payment_url: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
}

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'cancelled';

export interface PaymentVerification {
  charge_id: string;
  status: PaymentStatus;
  subscription?: Subscription;
  message: string;
}

export interface WebhookPayload {
  event: string;
  data: any;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  user: User;
  subscription?: Subscription;
  stats: {
    total_messages: number;
    messages_today: number;
    favorite_messages: number;
    current_streak: number;
    longest_streak: number;
    active_goals: number;
    completed_goals: number;
    active_scopes: number;
  };
  recent_messages: Message[];
  upcoming_messages: Message[];
  goals_progress: GoalProgress[];
}

export interface GoalProgress {
  goal: Goal;
  progress_percentage: number;
  days_remaining: number;
}

// ============================================================================
// Generic API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  error?: string;
  message?: string;
  status?: number;
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface MessageFilters {
  scope_id?: number;
  goal_id?: number;
  tone?: MessageTone;
  is_favorite?: boolean;
  is_read?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  language?: string; // 'en' or 'ar'
}

export interface GoalFilters {
  scope_id?: number;
  status?: GoalStatus;
  is_completed?: boolean;
  search?: string;
}

