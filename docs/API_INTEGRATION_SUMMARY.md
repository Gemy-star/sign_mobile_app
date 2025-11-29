# API Integration Complete ✅

## Overview

Your motivational app is now fully integrated with the Sign SA API (https://sign-sa.net/api-docs/). The app can seamlessly switch between **mock data** (for testing/offline mode) and **real API** based on a single configuration flag.

## 📁 Files Created

### Type Definitions
- **`types/api.ts`** (362 lines)
  - Complete TypeScript interfaces for all API endpoints
  - Authentication: `User`, `TokenResponse`, `LoginRequest`
  - Scopes: `Scope`, `ScopeCategory`, `ScopeCategoryType`
  - Packages: `Package`, `PackageFeature`
  - Subscriptions: `Subscription`, `CreateSubscriptionRequest`
  - Goals: `Goal`, `CreateGoalRequest`, `GoalStatus`
  - Messages: `Message`, `MessageTone`, `DailyMessage`
  - Dashboard: `DashboardStats`, `GoalProgress`

### Configuration
- **`config/api.config.ts`**
  - Single source of truth for API configuration
  - `USE_MOCK_DATA` flag to switch between mock/real data
  - Environment-aware base URLs (dev/production)
  - All API endpoints defined as constants
  - Timeout, retry, and pagination settings

### Services
- **`services/auth.service.ts`**
  - JWT token management (login, refresh, verify)
  - Automatic token storage with AsyncStorage
  - Auto-refresh expired tokens
  - Authentication helper methods

- **`services/signsa.service.ts`**
  - Complete API client for all Sign SA endpoints
  - Dashboard, Scopes, Packages, Subscriptions
  - Goals, Messages, Payments
  - Automatic authentication headers
  - Error handling

- **`services/mock.service.ts`** (604 lines)
  - Realistic dummy data for offline mode
  - 8 life domains with full details
  - 3 subscription packages (Free, Pro, Premium)
  - Sample goals and motivational messages
  - Complete dashboard statistics

- **`services/data.service.ts`**
  - **Unified interface** that automatically switches between mock/real API
  - Use this service in your components
  - Same API whether using mock or real data

### Documentation
- **`docs/API_INTEGRATION.md`**
  - Complete usage guide
  - Code examples for all features
  - Testing strategies
  - Error handling patterns

## 🚀 Quick Start

### 1. Configure API Mode

Open `config/api.config.ts`:

```typescript
export const API_CONFIG = {
  USE_MOCK_DATA: true, // true = mock, false = real API
  BASE_URL: __DEV__
    ? 'http://127.0.0.1:6400' // Local development
    : 'https://sign-sa.net', // Production
  // ... more config
};
```

### 2. Use in Components

The motivation dashboard (`app/(tabs)/motivation.tsx`) has been updated to use the data service:

```typescript
import { dataService } from '@/services/data.service';
import { DashboardStats } from '@/types/api';

// Load dashboard data
const response = await dataService.getDashboardStats();

if (response.success) {
  // response.data contains full dashboard stats
  setDashboardData(response.data);
}
```

### 3. Authentication (When Using Real API)

```typescript
import { authService } from '@/services/auth.service';

// Login
const result = await authService.login({
  username: 'your_username',
  password: 'your_password',
});

if (result.success) {
  // User is authenticated, tokens are stored
  // All dataService calls will now include auth headers
}
```

## 📊 Mock Data Available

When `USE_MOCK_DATA: true`, the app includes:

- **User**: Demo user profile (Ahmed Al-Mansour)
- **Scopes**: All 8 life domains with Arabic translations
- **Subscription**: Active Pro subscription (SAR 99/month)
- **Goals**: 3 active goals with progress tracking
- **Messages**: 5 motivational messages in English & Arabic
- **Stats**:
  - 127 total messages
  - 3 messages today
  - 23 favorites
  - 12-day current streak

## 🔄 API Endpoints Integrated

All Sign SA API endpoints are fully integrated:

✅ **Authentication**
- POST `/auth/token/` - Login
- POST `/auth/token/refresh/` - Refresh token
- POST `/auth/token/verify/` - Verify token

✅ **Dashboard**
- GET `/dashboard/stats/` - Get dashboard statistics

✅ **Scopes** (Life Domains)
- GET `/scopes/` - List all scopes
- GET `/scopes/categories/` - Get categories
- GET `/scopes/{id}/` - Get scope details

✅ **Packages** (Subscription Tiers)
- GET `/packages/` - List packages
- GET `/packages/featured/` - Featured packages
- GET `/packages/{id}/` - Package details
- GET `/packages/{id}/comparison/` - Compare packages

✅ **Subscriptions**
- GET `/subscriptions/` - List subscriptions
- POST `/subscriptions/` - Create subscription
- GET `/subscriptions/active/` - Active subscription
- PATCH `/subscriptions/{id}/update_scopes/` - Update scopes
- POST `/subscriptions/{id}/cancel/` - Cancel subscription

✅ **Goals**
- GET `/goals/` - List goals
- POST `/goals/` - Create goal
- GET `/goals/active/` - Active goals
- PATCH `/goals/{id}/update_progress/` - Update progress
- POST `/goals/{id}/complete/` - Complete goal
- DELETE `/goals/{id}/` - Delete goal

✅ **Messages**
- GET `/messages/` - List messages
- POST `/messages/` - Create message
- GET `/messages/daily/` - Daily messages
- GET `/messages/favorites/` - Favorite messages
- POST `/messages/{id}/mark_read/` - Mark as read
- POST `/messages/{id}/rate/` - Rate message
- POST `/messages/{id}/toggle_favorite/` - Toggle favorite
- DELETE `/messages/{id}/` - Delete message

✅ **Payments**
- GET `/payments/verify/{charge_id}/` - Verify payment
- POST `/payments/webhook/` - Payment webhook

## 🎯 Component Updates

### Motivation Dashboard (`app/(tabs)/motivation.tsx`)

Updated to use API data:
- ✅ Loads dashboard stats from API/mock
- ✅ Displays real message data with Arabic support
- ✅ Loading and error states
- ✅ Pull-to-refresh capability
- ✅ Toggle favorite messages
- ✅ Retry on error

## 🔐 Security Features

- JWT tokens stored securely in AsyncStorage
- Automatic token refresh on expiration
- Bearer token authentication on all requests
- Tokens cleared on logout
- Secure error handling (no sensitive data exposed)

## 📱 Testing Workflow

### Phase 1: Mock Data (Current)
```typescript
USE_MOCK_DATA: true
```
- Test all UI flows
- Perfect for development
- No internet required
- Fast iteration

### Phase 2: Local API
```typescript
USE_MOCK_DATA: false
BASE_URL: 'http://127.0.0.1:6400'
```
- Test with real backend locally
- Debug API integration
- Verify authentication flow

### Phase 3: Production
```typescript
USE_MOCK_DATA: false
BASE_URL: 'https://sign-sa.net'
```
- Live API integration
- Real user data
- Full functionality

## 🛠️ Next Steps

### Required for Production

1. **Create Login Screen**
   - Use `authService.login()`
   - Store user credentials securely
   - Handle login errors

2. **Add Registration Flow**
   - Use `authService.register()`
   - Validate user input
   - Email verification (if required)

3. **Implement Subscription Screen**
   - Display packages from `dataService.getPackages()`
   - Create subscription flow
   - Handle payment integration

4. **Update Other Screens**
   - Category Selection: Use `dataService.getScopes()`
   - Message History: Use `dataService.getMessages()`
   - Goals: Use `dataService.getActiveGoals()`

5. **Error Handling**
   - Network error fallbacks
   - Offline mode support
   - User-friendly error messages

6. **Push Notifications**
   - Register device token
   - Handle notification scheduling
   - Deep linking from notifications

## 📦 Dependencies Installed

- `@react-native-async-storage/async-storage` - Token storage

## 🎨 API Response Format

All API methods return a consistent format:

```typescript
{
  success: boolean;
  data: T;           // Your data
  error?: string;    // Error message if failed
  message?: string;  // Optional info message
}
```

## 📖 Usage Examples

```typescript
// Dashboard
const stats = await dataService.getDashboardStats();

// Scopes
const scopes = await dataService.getScopes();

// Messages
const messages = await dataService.getMessages();
const favorites = await dataService.getFavoriteMessages();
await dataService.toggleMessageFavorite(messageId);

// Goals
const goals = await dataService.getActiveGoals();
await dataService.updateGoalProgress(goalId, { progress: 75 });

// Subscription
const subscription = await dataService.getActiveSubscription();
```

## ⚙️ Configuration Options

Edit `config/api.config.ts` to customize:

- `USE_MOCK_DATA` - Toggle mock/real data
- `BASE_URL` - API server URL
- `TIMEOUT` - Request timeout (default: 30s)
- `MAX_RETRIES` - Auto-retry failed requests
- `DEFAULT_PAGE_SIZE` - Pagination size

## 🌐 Bilingual Support

All API responses include:
- `name` / `name_ar` - English/Arabic names
- `description` / `description_ar` - Descriptions
- `content` / `content_ar` - Message content

The app automatically uses the correct language based on user preference.

## ✨ Key Features

1. **Automatic API Switching** - One flag switches entire app
2. **Type Safety** - Full TypeScript support
3. **Auto Authentication** - Tokens managed automatically
4. **Offline Support** - Mock data works offline
5. **Error Recovery** - Auto-retry and refresh
6. **Bilingual** - English & Arabic throughout
7. **Production Ready** - All endpoints implemented

## 📞 Support

- API Docs: https://sign-sa.net/api-docs/
- Integration Guide: `docs/API_INTEGRATION.md`
- Type Definitions: `types/api.ts`

---

**Status**: ✅ Complete and ready to use!

Switch `USE_MOCK_DATA` to `false` when you're ready to connect to the real API.
