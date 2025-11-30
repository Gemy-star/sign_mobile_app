# Packages Feature Documentation

## Overview

The Packages feature allows users to subscribe to different subscription tiers, select life areas (scopes), and handle both free trials and paid subscriptions with payment processing.

## Files Created/Modified

### New Files
1. **screens/PackagesScreen.tsx** - Main packages screen component
2. **app/packages.tsx** - Route file for packages screen

### Modified Files
1. **services/mock.service.ts** - Added missing methods for packages and subscriptions
2. **services/data-source.service.ts** - Added package and subscription methods
3. **locales/en.json** - Added English translations for packages
4. **locales/ar.json** - Added Arabic translations for packages

## Features

### 1. Package Selection
- Display all available packages sorted by `display_order`
- Show package details:
  - Name and description
  - Price (with "FREE" for trial packages)
  - Duration (monthly/quarterly/yearly)
  - Features:
    - Number of life areas (scopes)
    - Messages per day
    - Custom goals enabled/disabled
    - Priority support enabled/disabled
- Featured badge for popular packages
- Visual selection indicator

### 2. Scope Selection
- After selecting a package, users choose their life areas
- Maximum scopes limited by package `max_scopes`
- Visual grid display with icons
- Selected/unselected states
- Validation to prevent exceeding limits

### 3. Free Trial Handling
- Automatically detected when package price = "0.00"
- Skips payment step
- Creates subscription immediately
- Success confirmation

### 4. Payment Flow
- For paid packages (price > 0)
- Shows order summary:
  - Selected package
  - Number of selected scopes
  - Total amount
- Payment note about secure processing
- Simulated payment (can be integrated with real payment gateway)

### 5. Multi-step Flow
Steps:
1. **select-package** - Choose subscription tier
2. **select-scopes** - Choose life areas
3. **payment** - Complete purchase (skipped for free trials)

## Mock Data

The mock service provides 3 packages:

1. **Free Starter** (id: 1)
   - Price: 0.00 (Free Trial)
   - Max Scopes: 2
   - Messages per day: 1
   - No custom goals
   - No priority support

2. **Pro Growth** (id: 2)
   - Price: 99.00 SAR
   - Max Scopes: 5
   - Messages per day: 3
   - Custom goals enabled
   - No priority support
   - Featured package

3. **Premium Master** (id: 3)
   - Price: 199.00 SAR
   - Max Scopes: 8
   - Messages per day: 10
   - Custom goals enabled
   - Priority support enabled
   - Featured package

## API Integration

### Feature Flag Control

The feature respects the `EXPO_PUBLIC_USE_API` environment variable:

- **USE_API=false** (default): Uses mock data from `mock.service.ts`
- **USE_API=true**: Uses real API from `signsa.service.ts`

### Endpoints Used

When API is enabled:
- `GET /packages/` - Get all packages
- `GET /scopes/` - Get all life areas
- `POST /subscriptions/` - Create subscription
- `GET /subscriptions/active/` - Get active subscription

### Data Flow

```
PackagesScreen
    ↓
dataSource.getPackages()
    ↓
FEATURE_FLAGS.USE_API ?
    ├─ true  → signSAService.getPackages()
    └─ false → mockDataService.getPackages()
```

## Usage

### Navigation

Navigate to packages screen:
```typescript
import { router } from 'expo-router';

// Navigate to packages
router.push('/packages');
```

### From Profile or Settings
```typescript
<TouchableOpacity onPress={() => router.push('/packages')}>
  <Text>Upgrade to Premium</Text>
</TouchableOpacity>
```

## Translation Keys

All translations are under the `packages` namespace:

```json
{
  "packages": {
    "title": "Choose Your Plan",
    "subtitle": "Select the perfect package to achieve your goals",
    "free": "FREE",
    "currency": "SAR",
    "popular": "Popular",
    "features": {
      "scopes": "{{count}} Life Areas",
      "messages": "{{count}} Messages/Day"
    }
    // ... more keys
  }
}
```

## Styling

The screen uses:
- **UI Kitten** for theme integration
- **Responsive design** based on screen width
- **RTL support** via i18n
- **Adaptive colors** from theme

## Error Handling

The component handles:
1. Loading states
2. API errors with Alert dialogs
3. Validation errors (scope limits, no scopes selected)
4. Payment errors
5. Network errors with logger

## Logger Integration

All actions are logged:
```typescript
logger.info('Packages loaded successfully', { count: packages.length });
logger.error('Payment error', error as Error);
```

## Future Enhancements

### Real Payment Integration

To integrate with a real payment gateway (e.g., Tap Payments):

1. Update `handlePayment` method:
```typescript
const response = await dataSource.createSubscription({
  package_id: selectedPackage.id,
  selected_scope_ids: selectedScopes,
  customer_email: user.email,
  redirect_url: 'myapp://payment-success',
  post_url: 'https://api.example.com/webhook/payment',
});

// Redirect to payment URL
if (response.success && response.data.payment_url) {
  Linking.openURL(response.data.payment_url);
}
```

2. Handle payment callback in app:
```typescript
// In app/_layout.tsx or similar
useEffect(() => {
  const handleDeepLink = (event: { url: string }) => {
    if (event.url.startsWith('myapp://payment-success')) {
      // Verify payment and update subscription
    }
  };

  Linking.addEventListener('url', handleDeepLink);
  return () => Linking.removeEventListener('url', handleDeepLink);
}, []);
```

### Additional Features
- Package comparison view
- Subscription management (upgrade/downgrade)
- Cancel subscription
- Subscription history
- Promo codes/coupons
- Annual discount badges
- Trial period countdown

## Testing

### Test Free Trial Flow
1. Set `USE_API=false` in `.env`
2. Navigate to `/packages`
3. Select "Free Starter" package
4. Select 2 scopes
5. Click "Start Free Trial"
6. Verify success message

### Test Paid Package Flow
1. Set `USE_API=false` in `.env`
2. Navigate to `/packages`
3. Select "Pro Growth" package
4. Select 3-5 scopes
5. Click "Continue to Payment"
6. Review order summary
7. Click "Pay Now"
8. Verify success message

### Test Scope Limits
1. Select "Free Starter" (max 2 scopes)
2. Try to select 3 scopes
3. Verify error alert appears

## Troubleshooting

### Packages not loading
- Check network connection
- Verify API endpoint if `USE_API=true`
- Check console logs for errors

### Scopes not displaying
- Verify scopes data has `is_active: true`
- Check icon names are valid Ionicons

### Payment not working
- Ensure payment gateway is configured
- Verify redirect URLs are registered
- Check payment response format

## Component Props

PackagesScreen has no props - it's a standalone screen component.

## State Management

Local state (useState):
- `packages` - List of available packages
- `selectedPackage` - Currently selected package
- `scopes` - List of available life areas
- `selectedScopes` - Array of selected scope IDs
- `loading` - Loading state
- `processing` - Processing state (during subscription creation)
- `step` - Current step in the flow

## Dependencies

- `react` - Core React
- `react-native` - Native components
- `@ui-kitten/components` - UI components and theming
- `react-i18next` - Internationalization
- `@expo/vector-icons` - Icons
- `@/services/data-source.service` - Data layer
- `@/types/api` - TypeScript types
- `@/utils/logger` - Logging utility
