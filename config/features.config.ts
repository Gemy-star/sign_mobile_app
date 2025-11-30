// config/features.config.ts
// Feature flags for the application - Configured via .env variables

// Helper to safely get env variables with defaults
const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

const getEnvString = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

export const FEATURE_FLAGS = {
  // API Configuration - from EXPO_PUBLIC_USE_API
  USE_API: getEnvBoolean('EXPO_PUBLIC_USE_API', false),

  // Logging Configuration - from EXPO_PUBLIC_ENABLE_LOGGING and EXPO_PUBLIC_LOG_LEVEL
  ENABLE_LOGGING: getEnvBoolean('EXPO_PUBLIC_ENABLE_LOGGING', true),
  LOG_LEVEL: getEnvString('EXPO_PUBLIC_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
  LOG_TO_CONSOLE: __DEV__, // Only log to console in development
  LOG_TO_SERVICE: !__DEV__, // Send logs to service in production

  // Development flags
  ENABLE_REDUX_DEVTOOLS: __DEV__,
  SHOW_DEBUG_INFO: getEnvBoolean('EXPO_PUBLIC_DEBUG', __DEV__),
} as const;

export type FeatureFlags = typeof FEATURE_FLAGS;
