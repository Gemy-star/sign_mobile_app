# Sign SA API Integration

This document explains how to use the Sign SA API integration in your motivational app.

## Quick Start

The app is configured to use **mock data** by default. To switch to the real API:

1. Open `config/api.config.ts`
2. Change `USE_MOCK_DATA: true` to `USE_MOCK_DATA: false`

```typescript
export const API_CONFIG = {
  USE_MOCK_DATA: false, // Set to false to use real API
  // ... rest of config
};
```

## Configuration

### API Endpoints

The base URL is automatically selected based on environment:
- **Development**: `http://127.0.0.1:6400`
- **Production**: `https://sign-sa.net`

All endpoints are defined in `config/api.config.ts`.

### Environment Variables

You can customize the API configuration:

```typescript
// config/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'https://your-custom-api.com',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  // ... more options
};
```

## Authentication

### Login

```typescript
import { authService } from '@/services/auth.service';

const login = async () => {
  const response = await authService.login({
    username: 'your_username',
    password: 'your_password',
  });

  if (response.success) {
    console.log('Logged in successfully');
    // Tokens are automatically stored
  }
};
```

### Check Authentication Status

```typescript
const isAuth = await authService.isAuthenticated();
```

### Logout

```typescript
await authService.logout();
```

## Using the Data Service

The `dataService` automatically switches between mock and real API based on configuration.

### Dashboard

```typescript
import { dataService } from '@/services/data.service';

const loadDashboard = async () => {
  const response = await dataService.getDashboardStats();

  if (response.success) {
    console.log(response.data.stats);
    console.log(response.data.recent_messages);
  }
};
```

### Scopes (Life Domains)

```typescript
// Get all scopes
const scopes = await dataService.getScopes();

// Get scope categories
const categories = await dataService.getScopeCategories();

// Get specific scope
const scope = await dataService.getScopeById(1);
```

### Subscription

```typescript
// Get active subscription
const subscription = await dataService.getActiveSubscription();

// Create new subscription
const newSub = await dataService.createSubscription({
  package_id: 2,
  scope_ids: [1, 2, 3],
  payment_method: 'tap',
  auto_renew: true,
});

// Update subscription scopes
await dataService.updateSubscriptionScopes(subscriptionId, {
  scope_ids: [1, 2, 3, 4],
});
```

### Goals

```typescript
// Get active goals
const goals = await dataService.getActiveGoals();

// Create new goal
const goal = await dataService.createGoal({
  scope_id: 1,
  title: 'Practice Daily Meditation',
  description: 'Meditate for 15 minutes every morning',
  target_date: '2024-12-31T00:00:00Z',
});

// Update goal progress
await dataService.updateGoalProgress(goalId, { progress: 75 });

// Complete goal
await dataService.completeGoal(goalId);
```

### Messages

```typescript
// Get all messages
const messages = await dataService.getMessages();

// Get daily messages
const daily = await dataService.getDailyMessages();

// Get favorite messages
const favorites = await dataService.getFavoriteMessages();

// Toggle favorite
await dataService.toggleMessageFavorite(messageId);

// Mark as read
await dataService.markMessageAsRead(messageId);

// Rate message
await dataService.rateMessage(messageId, { rating: 5 });
```

### Packages

```typescript
// Get all packages
const packages = await dataService.getPackages();

// Get featured packages
const featured = await dataService.getFeaturedPackages();

// Get package details
const pkg = await dataService.getPackageById(1);
```

## Mock Data

When `USE_MOCK_DATA: true`, the app uses realistic dummy data defined in `services/mock.service.ts`.

### Mock Data Includes:

- **User**: Demo user with profile information
- **Scopes**: All 8 life domains (Mental, Physical, Career, Financial, Relationships, Spiritual, Creativity, Lifestyle)
- **Packages**: 3 subscription tiers (Free, Pro, Premium)
- **Subscription**: Active Pro subscription
- **Goals**: 3 sample goals with progress tracking
- **Messages**: 5 motivational messages with various tones
- **Dashboard Stats**: Complete stats with streaks and counts

### Modifying Mock Data

Edit `services/mock.service.ts` to customize mock data:

```typescript
// services/mock.service.ts
private mockUser: User = {
  id: 1,
  username: 'your_username',
  email: 'your@email.com',
  // ... customize as needed
};
```

## Error Handling

All API methods return a standard response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}
```

Example error handling:

```typescript
const response = await dataService.getScopes();

if (response.success) {
  // Use response.data
  console.log(response.data);
} else {
  // Handle error
  console.error(response.error);
}
```

## Type Definitions

All API types are defined in `types/api.ts`:

- Authentication: `LoginRequest`, `TokenResponse`, `User`
- Scopes: `Scope`, `ScopeCategory`
- Packages: `Package`, `PackageFeature`
- Subscriptions: `Subscription`, `CreateSubscriptionRequest`
- Goals: `Goal`, `CreateGoalRequest`, `GoalStatus`
- Messages: `Message`, `MessageTone`, `DailyMessage`
- Dashboard: `DashboardStats`, `GoalProgress`

## Component Integration Example

```typescript
import React, { useEffect, useState } from 'react';
import { dataService } from '@/services/data.service';
import { DashboardStats } from '@/types/api';

export default function MyComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await dataService.getDashboardStats();

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to load data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} onRetry={loadData} />;

  return <View>{/* Render your data */}</View>;
}
```

## Testing

### Switch Between Mock and Real API

1. **Development with mock data**:
   ```typescript
   USE_MOCK_DATA: true
   ```

2. **Testing with real API**:
   ```typescript
   USE_MOCK_DATA: false
   BASE_URL: 'http://127.0.0.1:6400'
   ```

3. **Production**:
   ```typescript
   USE_MOCK_DATA: false
   BASE_URL: 'https://sign-sa.net'
   ```

## API Documentation

Full API documentation is available at:
- **OpenAPI Docs**: https://sign-sa.net/api-docs/?format=openapi
- **Local Dev**: http://127.0.0.1:6400/api-docs/

## Security

- JWT tokens are automatically stored securely using AsyncStorage
- Access tokens are automatically refreshed when expired
- All authenticated requests include the Bearer token
- Tokens are cleared on logout

## Support

For API-related issues:
- Check the API documentation at https://sign-sa.net/api-docs/
- Review error messages in the response
- Enable mock data to test offline functionality
