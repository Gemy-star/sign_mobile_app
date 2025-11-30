// docs/REDUX_USAGE.md
# Redux Usage Guide

## Overview
The app is now configured with Redux Toolkit for state management. Redux works alongside the existing Context API providers.

## Store Structure

### Slices
- **authSlice**: Authentication state (user, token, isAuthenticated)
- **themeSlice**: Theme state (colorScheme: 'light' | 'dark')
- **languageSlice**: Language state (language: 'en' | 'ar')
- **profileSlice**: Profile settings (stats, preferences, security, privacy)

## Usage Examples

### 1. Using Redux Hooks

Import the typed hooks:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
```

### 2. Reading State

```typescript
import { useAppSelector } from '@/store/hooks';

function MyComponent() {
  // Get auth state
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Get theme
  const { colorScheme } = useAppSelector((state) => state.theme);

  // Get language
  const { language } = useAppSelector((state) => state.language);

  // Get profile stats
  const { stats } = useAppSelector((state) => state.profile);

  return (
    <View>
      <Text>User: {user?.username}</Text>
      <Text>Theme: {colorScheme}</Text>
      <Text>Language: {language}</Text>
      <Text>Goals: {stats.goals}</Text>
    </View>
  );
}
```

### 3. Dispatching Actions

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { toggleColorScheme } from '@/store/slices/themeSlice';
import { setLanguage } from '@/store/slices/languageSlice';
import { setStats } from '@/store/slices/profileSlice';

function ProfileScreen() {
  const dispatch = useAppDispatch();

  // Toggle theme
  const handleToggleTheme = () => {
    dispatch(toggleColorScheme());
  };

  // Change language
  const handleChangeLanguage = (lang: 'en' | 'ar') => {
    dispatch(setLanguage(lang));
  };

  // Update stats
  const handleUpdateStats = () => {
    dispatch(setStats({ goals: 15, messages: 50, streak: 10 }));
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View>
      <Button onPress={handleToggleTheme}>Toggle Theme</Button>
      <Button onPress={() => handleChangeLanguage('ar')}>Arabic</Button>
      <Button onPress={handleUpdateStats}>Update Stats</Button>
      <Button onPress={handleLogout}>Logout</Button>
    </View>
  );
}
```

### 4. Login Flow with Redux

```typescript
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';

function LoginScreen() {
  const dispatch = useAppDispatch();

  const handleLogin = async (username: string, password: string) => {
    dispatch(loginStart());

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(loginSuccess({
          user: data.user,
          token: data.token,
        }));
      } else {
        dispatch(loginFailure('Invalid credentials'));
      }
    } catch (error) {
      dispatch(loginFailure('Network error'));
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

### 5. Profile Settings with Redux

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setPreferences, setSecurity, setPrivacy } from '@/store/slices/profileSlice';

function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { preferences, security, privacy } = useAppSelector((state) => state.profile);

  const toggleNotifications = () => {
    dispatch(setPreferences({
      notifications: !preferences.notifications
    }));
  };

  const toggle2FA = () => {
    dispatch(setSecurity({
      twoFactorAuth: !security.twoFactorAuth
    }));
  };

  const toggleAnalytics = () => {
    dispatch(setPrivacy({
      shareAnalytics: !privacy.shareAnalytics
    }));
  };

  return (
    <View>
      <Toggle checked={preferences.notifications} onChange={toggleNotifications} />
      <Toggle checked={security.twoFactorAuth} onChange={toggle2FA} />
      <Toggle checked={privacy.shareAnalytics} onChange={toggleAnalytics} />
    </View>
  );
}
```

## Migration from Context API

You can gradually migrate from Context API to Redux:

### Option 1: Keep Both (Recommended for gradual migration)
- Keep existing Context providers
- Add Redux for new features
- Migrate contexts one by one

### Option 2: Full Migration
Update contexts to use Redux internally:

```typescript
// contexts/ThemeContext.tsx (using Redux internally)
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColorScheme, toggleColorScheme } from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { colorScheme } = useAppSelector((state) => state.theme);

  return {
    colorScheme,
    colors: Colors[colorScheme],
    setColorScheme: (scheme) => dispatch(setColorScheme(scheme)),
    toggleColorScheme: () => dispatch(toggleColorScheme()),
  };
};
```

## Available Actions

### Auth Actions
- `loginStart()` - Start login process
- `loginSuccess({ user, token })` - Login successful
- `loginFailure(error)` - Login failed
- `logout()` - Logout user
- `updateUser(userData)` - Update user data
- `clearError()` - Clear auth errors

### Theme Actions
- `setColorScheme('light' | 'dark')` - Set theme
- `toggleColorScheme()` - Toggle theme

### Language Actions
- `setLanguage('en' | 'ar')` - Set language
- `toggleLanguage()` - Toggle language

### Profile Actions
- `setStats({ goals, messages, streak })` - Update stats
- `setPreferences({ darkMode, language, notifications })` - Update preferences
- `setSecurity({ twoFactorAuth, biometricAuth })` - Update security
- `setPrivacy({ shareAnalytics, personalizedAds })` - Update privacy
- `setProfileLoading(boolean)` - Set loading state
- `resetProfile()` - Reset to initial state

## DevTools

### Redux DevTools Extension (Web)
Redux DevTools is automatically configured. Install the browser extension:
- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### React Native Debugger
For mobile debugging, use [React Native Debugger](https://github.com/jhen0409/react-native-debugger) which includes Redux DevTools.

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector` instead of plain hooks
2. **Slice Naming**: Keep slice names descriptive and consistent
3. **Action Creators**: Use the auto-generated action creators from slices
4. **Async Logic**: Use Redux Toolkit's `createAsyncThunk` for async operations
5. **Normalization**: For complex data, consider normalizing state shape
6. **Selectors**: Create reusable selectors for computed state

## Persistence (Optional)

To persist Redux state across app restarts, install redux-persist:

```bash
npm install redux-persist
```

Then configure it in your store (example not included, but well documented).

## Testing

Redux state is easily testable:

```typescript
import { store } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

test('login updates auth state', () => {
  const user = { id: '1', username: 'test', email: 'test@example.com' };
  store.dispatch(loginSuccess({ user, token: 'abc123' }));

  const state = store.getState();
  expect(state.auth.isAuthenticated).toBe(true);
  expect(state.auth.user?.username).toBe('test');
});
```

## Next Steps

1. Start using Redux hooks in your components
2. Consider creating async thunks for API calls
3. Add redux-persist for state persistence
4. Create custom selectors for complex state derivations
5. Gradually migrate context providers to use Redux internally
