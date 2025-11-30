// store/index.ts
// Redux store configuration
// Redux is used for: Global app-wide state, Server data (API responses), Auth, User profile
// Context is used for: Theme (dark/light mode), Language/Localization, UI preferences

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import goalsReducer from './slices/goalsSlice';
import messagesReducer from './slices/messagesSlice';
import profileReducer from './slices/profileSlice';
import scopesReducer from './slices/scopesSlice';

export const store = configureStore({
  reducer: {
    // Global app state
    auth: authReducer,
    profile: profileReducer,
    // API data (server state)
    messages: messagesReducer,
    goals: goalsReducer,
    dashboard: dashboardReducer,
    scopes: scopesReducer,
    // Theme and Language moved to Context API (lightweight UI preferences)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
