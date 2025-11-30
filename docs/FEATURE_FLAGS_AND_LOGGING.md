# Feature Flags & Logging System

## Feature Flag Configuration

The app now supports switching between **API mode** and **Mock data mode** via feature flags.

### Configuration File: `config/features.config.ts`

```typescript
export const FEATURE_FLAGS = {
  USE_API: false,              // Switch between API and mock data
  ENABLE_LOGGING: true,        // Enable/disable logging system
  LOG_LEVEL: 'info',          // Log level: 'debug' | 'info' | 'warn' | 'error'
  LOG_TO_CONSOLE: __DEV__,    // Console logs (development only)
  LOG_TO_SERVICE: !__DEV__,   // Send logs to external service (production)
};
```

### How It Works

#### Data Source Service (`services/data-source.service.ts`)

The `DataSourceService` acts as a unified interface that automatically switches between:
- **API calls** (`signsa.service.ts`) when `USE_API = true`
- **Mock data** (`mock.service.ts`) when `USE_API = false`

All Redux slices now use `dataSource` instead of calling the API or mock services directly:

```typescript
import { dataSource } from '@/services/data-source.service';

// Redux thunk
const response = await dataSource.getMessages(filters, pagination);
```

#### Switching Modes

**To use REAL API:**
```typescript
// config/features.config.ts
USE_API: true
```

**To use MOCK data:**
```typescript
// config/features.config.ts
USE_API: false
```

### Advantages

1. **Single Source of Truth**: All data requests go through one service
2. **Easy Testing**: Switch to mock data instantly for testing/development
3. **No Code Changes**: Redux slices work identically in both modes
4. **Automatic Logging**: All data operations are logged automatically

---

## Logging System

### Production-Ready Logger (`utils/logger.ts`)

Comprehensive logging system with multiple levels and production support.

#### Features

- **Log Levels**: debug, info, warn, error
- **Development Mode**: Logs to console
- **Production Mode**: Can send to external logging service (Sentry, LogRocket, etc.)
- **Context Support**: Attach metadata to logs
- **Error Tracking**: Full error stack traces
- **API Logging**: Specialized methods for API requests/responses
- **Redux Logging**: Track Redux actions and state changes
- **Memory Buffer**: Keeps last 100 logs in memory

#### Usage

```typescript
import { logger } from '@/utils/logger';

// Basic logging
logger.info('User logged in', { userId: 123 });
logger.warn('API response slow', { duration: 5000 });
logger.error('Failed to fetch data', error, { endpoint: '/api/messages' });

// API-specific logging
logger.apiRequest('GET', '/api/messages', { page: 1 });
logger.apiResponse('GET', '/api/messages', 200, { count: 50 });
logger.apiError('POST', '/api/goals', new Error('Network timeout'));

// Redux action logging
logger.reduxAction('messages/fetchMessages', { page: 1 });
```

#### Convenience Methods

```typescript
import { log } from '@/utils/logger';

log.debug('Debug message');
log.info('Info message');
log.warn('Warning message');
log.error('Error occurred', error);
log.apiRequest('POST', '/api/login', credentials);
log.reduxAction('auth/login', { username });
```

#### Configuration

```typescript
// config/features.config.ts
FEATURE_FLAGS = {
  ENABLE_LOGGING: true,        // Master switch
  LOG_LEVEL: 'info',          // Minimum level to log
  LOG_TO_CONSOLE: __DEV__,    // Console (dev only)
  LOG_TO_SERVICE: !__DEV__,   // External service (production)
}
```

#### Log Levels Hierarchy

```
debug < info < warn < error
```

If `LOG_LEVEL = 'warn'`, only warn and error logs will be recorded.

#### Integration with External Services

To send logs to external service (production), update the `sendToService` method:

```typescript
// utils/logger.ts - sendToService method
private async sendToService(entry: LogEntry): Promise<void> {
  if (!FEATURE_FLAGS.LOG_TO_SERVICE) return;

  try {
    // Example: Sentry
    // Sentry.captureMessage(entry.message, {
    //   level: entry.level,
    //   extra: entry.context,
    // });

    // Example: Custom backend
    // await fetch('https://your-logging-api.com/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // });
  } catch (error) {
    // Fail silently in production
  }
}
```

#### Viewing Logs

```typescript
import { logger } from '@/utils/logger';

// Get all stored logs
const logs = logger.getLogs();

// Clear logs
logger.clearLogs();
```

---

## Redux Integration

All Redux slices now:
1. ✅ Use `dataSource` for data operations
2. ✅ Log all actions with `logger.reduxAction()`
3. ✅ Log errors with full context
4. ✅ Log warnings for failed operations

### Example: Messages Slice

```typescript
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchMessages', params);
      const response = await dataSource.getMessages(params.filters, params.pagination);

      if (response.success && response.data) {
        return response.data;
      }

      logger.warn('Failed to fetch messages', { error: response.error });
      return rejectWithValue(response.error);
    } catch (error) {
      logger.error('fetchMessages error', error as Error);
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Removed Contexts

### LoadingContext ❌ REMOVED

**Why?** Not used anywhere in the application. Loading states are handled by Redux slices.

**Alternative:** Use Redux loading states:
```typescript
const { isLoading } = useAppSelector(state => state.messages);
```

### SidebarContext ✅ KEPT

**Why?** Actively used in header and sidebar components. This is UI state, not global data.

**Fixed:** Added proper TypeScript types to prevent errors.

---

## Migration Checklist

- [x] Created `config/features.config.ts` for feature flags
- [x] Created `utils/logger.ts` production logging system
- [x] Created `services/data-source.service.ts` unified data service
- [x] Updated all Redux slices to use `dataSource`
- [x] Added logging to all Redux thunks
- [x] Removed unused `LoadingContext`
- [x] Fixed `SidebarContext` TypeScript types
- [x] Updated `_layout.tsx` to remove LoadingProvider

---

## Testing

### Test Mock Mode
```typescript
// config/features.config.ts
USE_API: false
```
1. Run app: `npx expo start`
2. All data should come from `mock.service.ts`
3. Check console for "DataSource: ... using MOCK data" logs

### Test API Mode
```typescript
// config/features.config.ts
USE_API: true
```
1. Ensure API backend is running
2. Run app: `npx expo start`
3. All data should come from real API
4. Check console for "DataSource: ... using API data" logs

### Test Logging Levels
```typescript
// config/features.config.ts
LOG_LEVEL: 'debug'  // See all logs
LOG_LEVEL: 'info'   // See info, warn, error
LOG_LEVEL: 'warn'   // See only warn and error
LOG_LEVEL: 'error'  // See only errors
```

---

## Production Deployment

Before deploying to production:

1. **Set API mode**:
   ```typescript
   USE_API: true
   ```

2. **Configure logging**:
   ```typescript
   ENABLE_LOGGING: true
   LOG_LEVEL: 'warn'          // Only log warnings and errors
   LOG_TO_CONSOLE: false       // Don't log to console in production
   LOG_TO_SERVICE: true        // Send to logging service
   ```

3. **Integrate logging service** (optional):
   - Uncomment Sentry integration in `logger.ts`
   - Or implement custom logging endpoint

4. **Build**:
   ```bash
   npx expo build:android
   npx expo build:ios
   ```

---

## Benefits

### For Development
- Instant switching between mock and real data
- Detailed console logging for debugging
- No need to run backend during UI development

### For Testing
- Test with mock data for consistent results
- Test with real API for integration testing
- Easy to reproduce issues with logging

### For Production
- Clean error tracking
- Performance monitoring via logs
- User behavior insights
- Quick issue diagnosis

---

## Architecture Summary

```
┌─────────────────────┐
│   React Components  │
│   (Tab Screens)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Redux Thunks      │
│   (Async Actions)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  DataSource Service │ ◄─── FEATURE_FLAGS.USE_API
│  (Auto Switch)      │
└──────┬──────────────┘
       │
       ├───────────────┬─────────────┐
       ▼               ▼             ▼
┌────────────┐  ┌────────────┐  ┌────────┐
│ signSAService│  │mockService │  │ logger │
│   (API)    │  │   (Mock)   │  │        │
└────────────┘  └────────────┘  └────────┘
```

---

## Questions?

- Feature flags: `config/features.config.ts`
- Logging: `utils/logger.ts`
- Data source: `services/data-source.service.ts`
- Redux slices: `store/slices/*.ts`
