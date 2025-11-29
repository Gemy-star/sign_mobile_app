// config/api.config.ts
// API Configuration and Environment Settings

// Helper to get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  return process.env[key] || fallback;
};

const getEnvBool = (key: string, fallback: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
};

export const API_CONFIG = {
  // Toggle between mock data and real API
  // Set via EXPO_PUBLIC_USE_MOCK_DATA in .env file
  USE_MOCK_DATA: getEnvBool('EXPO_PUBLIC_USE_MOCK_DATA', true),

  // API Base URLs
  // Set via EXPO_PUBLIC_API_BASE_URL in .env file
  BASE_URL: getEnvVar(
    'EXPO_PUBLIC_API_BASE_URL',
    __DEV__ ? 'http://127.0.0.1:6400' : 'https://sign-sa.net'
  ),

  // API Version
  API_VERSION: 'v1',

  // Request Timeouts (milliseconds)
  // Set via EXPO_PUBLIC_API_TIMEOUT in .env file
  TIMEOUT: parseInt(getEnvVar('EXPO_PUBLIC_API_TIMEOUT', '30000'), 10),
  UPLOAD_TIMEOUT: 120000,

  // Debug Mode
  DEBUG: getEnvBool('EXPO_PUBLIC_DEBUG', __DEV__),

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Token Storage Keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: '@sign_sa_access_token',
    REFRESH_TOKEN: '@sign_sa_refresh_token',
    USER_DATA: '@sign_sa_user_data',
    PREFERENCES: '@sign_sa_preferences',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ANALYTICS: false,
    ENABLE_CRASH_REPORTING: false,
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_OFFLINE_MODE: true,
  },

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/token/',
      REFRESH: '/auth/token/refresh/',
      VERIFY: '/auth/token/verify/',
      REGISTER: '/auth/register/',
      LOGOUT: '/auth/logout/',
    },

    // Dashboard
    DASHBOARD: {
      STATS: '/dashboard/stats/',
    },

    // Scopes (Life Domains)
    SCOPES: {
      LIST: '/scopes/',
      CATEGORIES: '/scopes/categories/',
      DETAIL: (id: number) => `/scopes/${id}/`,
    },

    // Packages (Subscription Tiers)
    PACKAGES: {
      LIST: '/packages/',
      FEATURED: '/packages/featured/',
      DETAIL: (id: number) => `/packages/${id}/`,
      COMPARISON: (id: number) => `/packages/${id}/comparison/`,
    },

    // Subscriptions
    SUBSCRIPTIONS: {
      LIST: '/subscriptions/',
      CREATE: '/subscriptions/',
      ACTIVE: '/subscriptions/active/',
      DETAIL: (id: number) => `/subscriptions/${id}/`,
      UPDATE: (id: number) => `/subscriptions/${id}/`,
      CANCEL: (id: number) => `/subscriptions/${id}/cancel/`,
      UPDATE_SCOPES: (id: number) => `/subscriptions/${id}/update_scopes/`,
    },

    // Goals
    GOALS: {
      LIST: '/goals/',
      CREATE: '/goals/',
      ACTIVE: '/goals/active/',
      DETAIL: (id: number) => `/goals/${id}/`,
      UPDATE: (id: number) => `/goals/${id}/`,
      DELETE: (id: number) => `/goals/${id}/`,
      COMPLETE: (id: number) => `/goals/${id}/complete/`,
      UPDATE_PROGRESS: (id: number) => `/goals/${id}/update_progress/`,
    },

    // Messages
    MESSAGES: {
      LIST: '/messages/',
      CREATE: '/messages/',
      DAILY: '/messages/daily/',
      FAVORITES: '/messages/favorites/',
      DETAIL: (id: number) => `/messages/${id}/`,
      UPDATE: (id: number) => `/messages/${id}/`,
      DELETE: (id: number) => `/messages/${id}/`,
      MARK_READ: (id: number) => `/messages/${id}/mark_read/`,
      RATE: (id: number) => `/messages/${id}/rate/`,
      TOGGLE_FAVORITE: (id: number) => `/messages/${id}/toggle_favorite/`,
    },

    // Payments
    PAYMENTS: {
      VERIFY: (chargeId: string) => `/payments/verify/${chargeId}/`,
      WEBHOOK: '/payments/webhook/',
    },
  },
};

// Helper to get full API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  return `${baseUrl}${endpoint}`;
};

// Helper to check if using mock data
export const useMockData = (): boolean => {
  return API_CONFIG.USE_MOCK_DATA;
};

// Helper to get storage key
export const getStorageKey = (key: keyof typeof API_CONFIG.STORAGE_KEYS): string => {
  return API_CONFIG.STORAGE_KEYS[key];
};
