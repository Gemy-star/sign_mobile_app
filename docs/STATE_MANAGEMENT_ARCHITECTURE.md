# State Management Architecture

## Overview
This application uses a **hybrid state management approach** combining Redux Toolkit and Context API, following React best practices for optimal separation of concerns.

---

## ✅ Redux Toolkit - For Global App-Wide State

### When to Use Redux:
- **Global, app-wide state** that many screens need
- **Server data** (API responses, cached data)
- **Authentication** state (user, token, session)
- **User profile** data (preferences, settings, stats)
- **Complex data** that requires normalization
- **State that needs to persist** across sessions
- **Data that benefits from Redux DevTools** debugging

### Redux Slices in This App:

#### 1. Auth Slice (`store/slices/authSlice.ts`)
**Purpose:** Authentication and user session management

**State:**
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
- `loginStart()` - Begin login process
- `loginSuccess(user, token)` - Set authenticated user
- `loginFailure(error)` - Handle login error
- `logout()` - Clear authentication state
- `updateUser(userData)` - Update user information
- `clearError()` - Clear error messages

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };
}
```

---

#### 2. Profile Slice (`store/slices/profileSlice.ts`)
**Purpose:** User profile data, preferences, and statistics

**State:**
```typescript
{
  stats: {
    goals: number,
    messages: number,
    streak: number
  },
  preferences: {
    notifications: boolean,
    emailUpdates: boolean
  },
  security: {
    twoFactorEnabled: boolean,
    lastPasswordChange: string
  },
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends',
    dataSharing: boolean
  },
  isLoading: boolean
}
```

**Actions:**
- `setStats(stats)` - Update user statistics
- `setPreferences(preferences)` - Update user preferences
- `setSecurity(security)` - Update security settings
- `setPrivacy(privacy)` - Update privacy settings
- `setProfileLoading(boolean)` - Set loading state
- `resetProfile()` - Clear all profile data

**Usage Example:**
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPreferences } from '@/store/slices/profileSlice';

function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.profile);

  const handleToggleNotifications = (enabled: boolean) => {
    dispatch(setPreferences({ notifications: enabled }));
  };
}
```

---

## ✅ Context API - For UI Preferences

### When to Use Context:
- **Theme** (dark/light mode) - UI preference
- **Language / Localization** - UI preference
- **Small UI preferences** (font size, animations)
- **Very local, lightweight state** that doesn't need Redux DevTools
- **State that changes frequently** (theme toggles)
- **Computed values** (colors object, translation function)

### Contexts in This App:

#### 1. Theme Context (`contexts/ThemeContext.tsx`)
**Purpose:** Dark/light mode and color scheme management

**Provides:**
```typescript
{
  colors: ThemeColors,           // Computed color palette
  colorScheme: 'light' | 'dark', // Current theme mode
  setColorScheme: (scheme) => void,
  toggleColorScheme: () => void
}
```

**Features:**
- ✨ Automatic color palette calculation based on theme
- ✨ Instant theme switching without re-renders
- ✨ Fallback to light theme if provider not found

**Usage Example:**
```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { colors, colorScheme, toggleColorScheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Button onPress={toggleColorScheme}>
        Toggle {colorScheme === 'light' ? 'Dark' : 'Light'} Mode
      </Button>
    </View>
  );
}
```

---

#### 2. Language Context (`contexts/LanguageContext.tsx`)
**Purpose:** Internationalization (i18n) and localization

**Provides:**
```typescript
{
  language: 'en' | 'ar',              // Current language
  setLanguage: (lang) => void,        // Change language
  changeLanguage: (lang) => void,     // Alias for compatibility
  t: (key, params?) => string         // Translation function
}
```

**Features:**
- 🌐 Support for English and Arabic (RTL)
- 💾 Persists language preference to AsyncStorage
- 🔄 Automatic translation with nested key support
- 📝 Parameter interpolation with `{{variable}}` syntax

**Usage Example:**
```typescript
import { useLanguage } from '@/contexts/LanguageContext';

function WelcomeScreen() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View>
      <Text>{t('welcome.title')}</Text>
      <Text>{t('welcome.greeting', { name: 'John' })}</Text>
      <Button onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
        Switch Language
      </Button>
    </View>
  );
}
```

---

#### 3. Auth Context (`contexts/AuthContext.tsx`)
**Purpose:** Authentication utilities and backward compatibility

**Note:** This context wraps Redux auth state for legacy compatibility. New code should use Redux directly.

**Usage:**
```typescript
// ✅ Preferred (use Redux directly)
const { user } = useAppSelector((state) => state.auth);

// ⚠️ Legacy (for backward compatibility)
const { user } = useAuth();
```

---

## Architecture Decisions

### Why This Split?

| Aspect | Redux | Context |
|--------|-------|---------|
| **Data Type** | Server data, global state | UI preferences |
| **Scope** | App-wide, many screens | Local, few components |
| **Persistence** | Yes (with redux-persist) | Optional (AsyncStorage) |
| **DevTools** | ✅ Full debugging support | ❌ No DevTools |
| **Performance** | Optimized with selectors | Fast for simple state |
| **Testing** | Easy to test reducers | Simple unit tests |
| **Boilerplate** | More setup | Minimal setup |

---

## Screen-by-Screen Breakdown

### 1. Home Screen (`app/(tabs)/index.tsx`)
**Uses:**
- ✅ Redux: `auth.user` (global auth state)
- ✅ Context: `theme.colors`, `language.t` (UI preferences)
- ✅ Local: `loading` state (component-specific)

```typescript
const { colors } = useTheme();                     // Context - UI preference
const { t, language } = useLanguage();             // Context - UI preference
const { user } = useAppSelector(state => state.auth); // Redux - global state
const [loading, setLoading] = useState(false);     // Local state
```

---

### 2. Profile Screen (`app/(tabs)/profile.tsx`)
**Uses:**
- ✅ Redux: `auth.user`, `profile.preferences` (global state)
- ✅ Context: `theme`, `language` (UI preferences)
- ✅ Local: Modal visibility states (component-specific)

```typescript
const { colors, toggleColorScheme } = useTheme();        // Context
const { language, setLanguage } = useLanguage();         // Context
const { user } = useAppSelector(state => state.auth);    // Redux
const { preferences } = useAppSelector(state => state.profile); // Redux
const [showModal, setShowModal] = useState(false);       // Local
```

---

### 3. Messages Screen (`app/(tabs)/messages.tsx`)
**Uses:**
- ✅ Context: `theme.colors`, `language.t` (UI preferences)
- ✅ Local: `searchQuery` state (component-specific)

```typescript
const { colors, colorScheme } = useTheme();    // Context
const { t, language } = useLanguage();         // Context
const [searchQuery, setSearchQuery] = useState(''); // Local
```

---

### 4. Goals Screen (`app/(tabs)/news.tsx`)
**Uses:**
- ✅ Context: `theme.colorScheme`, `language.t` (UI preferences)
- ✅ Local: `filter` state (component-specific)

```typescript
const { colorScheme } = useTheme();           // Context
const { t, language } = useLanguage();        // Context
const [filter, setFilter] = useState('all'); // Local
```

---

### 5. Motivation Screen (`app/(tabs)/motivation.tsx`)
**Uses:**
- ✅ Context: `theme.colors`, `language.t` (UI preferences)
- ✅ Local: `loading` state (component-specific)

```typescript
const { colors, colorScheme } = useTheme(); // Context
const { t, language } = useLanguage();      // Context
const [loading, setLoading] = useState(false); // Local
```

---

### 6. Notification Screen (`app/(tabs)/notification.tsx`)
**Uses:**
- ✅ Context: `language.t` (UI preference)

```typescript
const { t, language } = useLanguage(); // Context only
```

---

## Best Practices

### ✅ DO:

1. **Use Redux for:**
   - User authentication state
   - Server data and API responses
   - Global app state (cart, products, notifications)
   - Data that needs to persist
   - Complex state that benefits from DevTools

2. **Use Context for:**
   - Theme (dark/light mode)
   - Language/localization
   - UI preferences (font size, animations)
   - Computed values (colors object, translation function)

3. **Use Local State for:**
   - Form inputs
   - Modal visibility
   - Loading indicators
   - Temporary UI state
   - Component-specific flags

### ❌ DON'T:

1. **Don't use Redux for:**
   - Theme preferences (use Context)
   - Language selection (use Context)
   - Temporary UI state (use local state)
   - Component-specific flags (use local state)

2. **Don't use Context for:**
   - Server data (use Redux)
   - Authentication (use Redux)
   - Complex global state (use Redux)

3. **Don't use Local State for:**
   - Data shared across screens (use Redux)
   - User authentication (use Redux)
   - App-wide preferences (use Context or Redux)

---

## Migration Guide

### From Context to Redux (for global state):

**Before:**
```typescript
// ❌ Using Context for global state
const AuthContext = createContext();
const { user } = useAuth();
```

**After:**
```typescript
// ✅ Using Redux for global state
const { user } = useAppSelector(state => state.auth);
```

---

### From Redux to Context (for UI preferences):

**Before:**
```typescript
// ❌ Using Redux for UI preferences
const { theme } = useAppSelector(state => state.theme);
dispatch(toggleTheme());
```

**After:**
```typescript
// ✅ Using Context for UI preferences
const { colorScheme, toggleColorScheme } = useTheme();
toggleColorScheme();
```

---

## Testing Strategy

### Testing Redux:
```typescript
import { store } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

test('should handle login', () => {
  store.dispatch(loginSuccess({ id: '1', name: 'Test' }, 'token'));
  expect(store.getState().auth.isAuthenticated).toBe(true);
});
```

### Testing Context:
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

test('should toggle theme', () => {
  const { result } = renderHook(() => useTheme(), {
    wrapper: ThemeProvider
  });

  act(() => {
    result.current.toggleColorScheme();
  });

  expect(result.current.colorScheme).toBe('dark');
});
```

---

## Future Improvements

### Planned Enhancements:

1. **Redux Persist**
   - Persist auth and profile state across app restarts
   - Sync with AsyncStorage

2. **Redux DevTools**
   - Enable Redux DevTools for debugging
   - Time-travel debugging for state changes

3. **Redux Middleware**
   - API middleware for async operations
   - Error handling middleware
   - Analytics middleware

4. **Optimistic Updates**
   - Update UI immediately, sync with server in background
   - Rollback on failure

5. **Normalized State**
   - Use `@reduxjs/toolkit` entity adapters
   - Efficient lookups and updates

---

## Summary

| Feature | Technology | Reason |
|---------|-----------|--------|
| Authentication | ✅ Redux | Global state, persists, needs DevTools |
| User Profile | ✅ Redux | Global state, server data, complex |
| Theme Mode | ✅ Context | UI preference, changes frequently |
| Language | ✅ Context | UI preference, localization |
| Loading States | ✅ Local State | Component-specific, temporary |
| Modal Visibility | ✅ Local State | Component-specific, temporary |
| Form Inputs | ✅ Local State | Component-specific, temporary |

---

**Last Updated:** November 30, 2025
**Architecture Version:** 2.0
**Status:** ✅ Production Ready
