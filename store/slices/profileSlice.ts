// store/slices/profileSlice.ts
// Redux slice for profile/preferences state

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStats {
  goals: number;
  messages: number;
  streak: number;
}

interface UserPreferences {
  darkMode: boolean;
  language: 'en' | 'ar';
  notifications: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
}

interface PrivacySettings {
  shareAnalytics: boolean;
  personalizedAds: boolean;
}

interface ProfileState {
  stats: UserStats;
  preferences: UserPreferences;
  security: SecuritySettings;
  privacy: PrivacySettings;
  isLoading: boolean;
}

const initialState: ProfileState = {
  stats: {
    goals: 0,
    messages: 0,
    streak: 0,
  },
  preferences: {
    darkMode: false,
    language: 'en',
    notifications: true,
  },
  security: {
    twoFactorAuth: false,
    biometricAuth: false,
  },
  privacy: {
    shareAnalytics: true,
    personalizedAds: false,
  },
  isLoading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setSecurity: (state, action: PayloadAction<Partial<SecuritySettings>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    setPrivacy: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetProfile: (state) => {
      return initialState;
    },
  },
});

export const {
  setStats,
  setPreferences,
  setSecurity,
  setPrivacy,
  setProfileLoading,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
