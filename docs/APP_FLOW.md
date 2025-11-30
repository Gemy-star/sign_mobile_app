# App Flow Documentation

## Overview

This document describes the complete user flow through the Sign SA application, from initial load to authenticated usage.

## Flow Diagram

```
App Launch
    ↓
Font Loading
    ↓
Auth Check (useAuthActions.checkAuth)
    ↓
┌─────────────────┐
│ Is Authenticated?│
└─────────────────┘
    ↓           ↓
   NO          YES
    ↓           ↓
Login Screen    Check Subscription
    ↓           ↓
Login Success   ┌──────────────────┐
    ↓           │ Has Subscription?│
    ↓           └──────────────────┘
    │               ↓           ↓
    │              NO          YES
    │               ↓           ↓
    └─→ Welcome Screen ─→ Packages ─→ Main App
              ↓                        (Tabs)
         Skip/Continue
              ↓
          Main App
```

## Detailed Flow Steps

### 1. App Launch & Initialization

**File**: `app/_layout.tsx`

**Steps**:
1. Redux store initialized
2. Theme and Language providers wrap the app
3. Custom fonts loaded (IBM Plex Sans Arabic)
4. Splash screen shown during font loading
5. Eva Design icons registered
6. UI Kitten theme applied (light/dark based on user preference)

**Components**:
- `RootLayout` - Root component with providers
- `ThemedApp` - Theme wrapper
- `AppContent` - Main flow controller

### 2. Authentication Check

**When**: On app mount (useEffect in AppContent)

**What happens**:
```typescript
useAuthActions.checkAuth()
  ↓
authService.getAccessToken()
  ↓
authService.getUser()
  ↓
dispatch(updateUser(user)) or dispatch(logoutAction())
```

**States**:
- `isLoading: true` - Checking auth
- `isLoading: false, isAuthenticated: false` - Not logged in
- `isLoading: false, isAuthenticated: true` - Logged in

### 3. Not Authenticated Flow

**Screen**: [screens/LoginScreen.tsx](../screens/LoginScreen.tsx)

**What user sees**:
- Login form with username and password
- "Try Demo Account" button (optional)
- Language toggle

**On successful login**:
1. Credentials sent to API/mock
2. Tokens saved to storage
3. User data fetched
4. Redux auth state updated
5. `onLoginSuccess()` callback triggered
6. Flow continues to Welcome Screen

**Feature Flag Support**:
- `EXPO_PUBLIC_USE_API=false`: Uses mock authentication
- `EXPO_PUBLIC_USE_API=true`: Uses real API authentication

### 4. Authenticated Flow - Welcome Screen

**Screen**: [screens/WelcomeMotivationScreen.tsx](../screens/WelcomeMotivationScreen.tsx)

**When shown**:
- Immediately after login
- Only shown once per session (controlled by `showWelcome` state)

**What user sees**:
- Welcome message
- App features overview
- "Get Started" button

**On "Get Started"**:
1. `onGetStarted()` callback triggered
2. `showWelcome` set to `false`
3. Flow continues to subscription check

### 5. Subscription Check

**When**: After welcome screen dismissed

**What happens**:
```typescript
dataSource.getActiveSubscription()
  ↓
Check response
  ↓
┌─────────────────────┐
│ Has active sub?     │
└─────────────────────┘
    ↓           ↓
   YES          NO
    ↓           ↓
showPackages   showPackages
  = false        = true
    ↓           ↓
Main App    Packages Screen
```

**States**:
- `checkingSubscription: true` - Loading
- `showPackages: true` - No subscription
- `showPackages: false` - Has subscription

**Error Handling**:
- On error, defaults to showing packages screen (safer)
- Error logged for debugging

### 6. Packages Screen Flow

**Screen**: [screens/PackagesScreen.tsx](../screens/PackagesScreen.tsx)

**When shown**: User has no active subscription

**Flow within Packages Screen**:

#### Step 1: Package Selection
- Display all packages (Free, Pro, Premium)
- Show features and pricing
- User selects a package
- Continue to scope selection

#### Step 2: Scope Selection
- Display 8 life areas (Mental, Physical, Career, Financial, etc.)
- User selects scopes within package limit
- Validate selection
- Continue based on package type:
  - Free package → Create subscription directly
  - Paid package → Go to payment

#### Step 3: Payment (Paid packages only)
- Show order summary
- Display total amount
- Process payment
- Create subscription

**On completion**:
1. Subscription created
2. Success alert shown
3. `onComplete()` callback triggered
4. `showPackages` set to `false`
5. Flow continues to Main App

**Alternative**: User can access packages via route `/packages` anytime

### 7. Main App

**Screen**: Tabs layout `app/(tabs)/_layout.tsx`

**Tabs**:
1. Home (Dashboard) - `/(tabs)/index`
2. Goals - `/(tabs)/news`
3. Inspire - `/(tabs)/motivation`
4. Messages - `/(tabs)/messages`
5. Profile - `/(tabs)/profile`

**What user can do**:
- View dashboard stats
- Manage goals
- Read motivational messages
- View all messages
- Update profile settings
- Change subscription (navigate to `/packages`)

## State Management

### Auth State (Redux)

**Slice**: `store/slices/authSlice.ts`

**State**:
```typescript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  token: string | null
}
```

**Actions**:
- `loginStart()` - Set loading
- `loginSuccess(user, token)` - Set authenticated
- `loginFailure(error)` - Set error
- `logout()` - Clear state
- `updateUser(user)` - Update user data

### Dashboard State (Redux)

**Slice**: `store/slices/dashboardSlice.ts`

**State**:
```typescript
{
  stats: DashboardStats | null,
  isLoading: boolean,
  error: string | null,
  lastFetched: number | null
}
```

### Local State (in AppContent)

```typescript
{
  showWelcome: boolean | null,     // null = not checked, true = show, false = hide
  showPackages: boolean | null,    // null = not checked, true = show, false = hide
  checkingSubscription: boolean    // true = loading subscription status
}
```

## Feature Flags

### API Toggle

**Environment Variable**: `EXPO_PUBLIC_USE_API`

**Values**:
- `false` (default): Use mock data
- `true`: Use real API

**Affects**:
- Authentication
- Dashboard data
- Packages
- Subscriptions
- Messages
- Goals

**Implementation**: [services/data-source.service.ts](../services/data-source.service.ts)

### Logging

**Environment Variables**:
- `EXPO_PUBLIC_ENABLE_LOGGING` - Enable/disable logging
- `EXPO_PUBLIC_LOG_LEVEL` - Log level (debug, info, warn, error)

**Implementation**: [utils/logger.ts](../utils/logger.ts)

## Navigation

### Stack Navigation

**Root Stack**: Defined in `app/_layout.tsx`
- Wraps entire app
- Header hidden by default

### Tab Navigation

**Tabs Stack**: Defined in `app/(tabs)/_layout.tsx`
- 5 tabs (Home, Goals, Inspire, Messages, Profile)
- Custom icons and labels
- RTL support

### Direct Routes

**Available Routes**:
- `/packages` - Packages screen (can be accessed anytime)
- `/all-messages` - All messages screen
- `/(tabs)` - Main tabs
- `/(tabs)/index` - Dashboard
- `/(tabs)/news` - Goals
- `/(tabs)/motivation` - Inspire
- `/(tabs)/messages` - Messages
- `/(tabs)/profile` - Profile

**Navigation Methods**:
```typescript
import { router } from 'expo-router';

// Navigate to route
router.push('/packages');

// Replace current route
router.replace('/(tabs)');

// Go back
router.back();
```

## Subscription Flow Details

### Free Trial Flow

1. User selects "Free Starter" package (price = 0.00)
2. User selects scopes (max 2)
3. Subscription created immediately (no payment)
4. Success alert shown
5. User navigated to main app

**API Call**:
```typescript
dataSource.createSubscription({
  package_id: 1,
  selected_scope_ids: [1, 2]
})
```

### Paid Subscription Flow

1. User selects paid package (Pro/Premium)
2. User selects scopes
3. Payment screen shown
4. Order summary displayed
5. User confirms payment
6. Subscription created
7. Success alert shown
8. User navigated to main app

**API Call** (simulated):
```typescript
dataSource.createSubscription({
  package_id: 2,
  selected_scope_ids: [1, 2, 3, 4, 5],
  // In production:
  // customer_email: user.email,
  // redirect_url: 'myapp://payment-success',
  // post_url: 'myapp://payment-webhook'
})
```

## Testing the Flow

### Test Login → Welcome → Packages → Main App

1. Clear app data/storage
2. Launch app
3. Login with demo account
4. See welcome screen
5. Click "Get Started"
6. See packages screen (if no subscription)
7. Select a package
8. Select scopes
9. Complete subscription
10. Navigate to main app

### Test Login → Welcome → Main App (Existing Subscription)

1. Login with account that has active subscription
2. See welcome screen
3. Click "Get Started"
4. Skip packages screen
5. Navigate directly to main app

### Test Direct Navigation

```typescript
// From any screen in the app:
router.push('/packages');
```

## Error Scenarios

### Login Fails
- Error message shown in alert
- User stays on login screen
- Can retry

### Subscription Check Fails
- Error logged
- User shown packages screen (safe default)
- Can complete subscription to proceed

### Subscription Creation Fails
- Error alert shown
- User stays on packages screen
- Can retry

### Network Errors
- Handled by try/catch blocks
- Error logged
- User-friendly message shown
- Retry available

## Localization

All screens support both English and Arabic:

**English**: `locales/en.json`
**Arabic**: `locales/ar.json`

**Keys used in flow**:
- `auth.*` - Login screen
- `motivation.*` - Welcome screen
- `packages.*` - Packages screen
- `home.*` - Dashboard
- `common.*` - Common buttons/messages

**Language Toggle**:
- Available in Login screen
- Available in Profile settings
- Persisted in AsyncStorage
- RTL layout applied automatically for Arabic

## Persistence

### Data Persisted to Storage

**Auth Tokens** (AsyncStorage):
- Access token
- Refresh token

**Language Preference** (AsyncStorage):
- User's selected language (en/ar)

**Theme Preference** (AsyncStorage):
- Light/Dark mode

**Redux State** (Not persisted):
- Auth state (rebuilt on app launch)
- Dashboard stats (refetched)
- Messages (refetched)

## Performance Considerations

### Caching

**Dashboard Stats**:
- Cached for 5 minutes
- Refresh on pull-down
- Timestamp tracked in Redux

**Subscription Check**:
- Only checked once per session
- After login and welcome screen
- Not refetched unless user explicitly refreshes

### Loading States

**App Launch**: Font loading + auth check
**Login**: API call + token storage
**Welcome**: Instant (no loading)
**Subscription Check**: Shows spinner
**Packages**: Shows spinner while loading packages/scopes
**Main App**: Progressive loading per tab

## Security Considerations

1. **Tokens**: Stored in AsyncStorage (secure on device)
2. **Auto-logout**: On token expiry or invalid token
3. **API calls**: All authenticated requests include token
4. **Error messages**: Generic (don't expose sensitive info)
5. **Logging**: Excludes sensitive data in production

## Future Enhancements

1. **Skip Packages Option**: Allow users to skip packages and use free tier
2. **Package Upgrade**: Allow upgrading from within app
3. **Package Downgrade**: Allow downgrading subscription
4. **Trial Period Countdown**: Show days remaining in trial
5. **Payment Gateway Integration**: Real payment processing
6. **Subscription Management**: View history, cancel, renew
7. **Push Notifications**: For subscription expiry
8. **Deep Linking**: Handle payment callbacks
