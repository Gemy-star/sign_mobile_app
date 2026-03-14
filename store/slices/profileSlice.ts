// store/slices/profileSlice.ts
// Redux slice for profile/preferences state

import { profileApi } from '@/services/api';
import { User } from '@/types/api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStats {
  goals: number;
  messages: number;
  streak: number;
}

interface UserPreferences {
  darkMode: boolean;
  language: 'en' | 'ar';
  notifications: boolean;
  notificationTime: string; // "HH:MM" 24-hour format
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
  user: User | null;
  stats: UserStats;
  preferences: UserPreferences;
  security: SecuritySettings;
  privacy: PrivacySettings;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  stats: {
    goals: 0,
    messages: 0,
    streak: 0,
  },
  preferences: {
    darkMode: false,
    language: 'en',
    notifications: true,
    notificationTime: '09:00',
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
  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await profileApi.getProfile();
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to load profile');
    }
  }
);

export const updateProfile = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'profile/update',
  async (data, { rejectWithValue }) => {
    try {
      return await profileApi.updateProfile(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk<
  { message: string },
  { old_password: string; new_password: string },
  { rejectValue: string }
>(
  'profile/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      return await profileApi.changePassword(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to change password');
    }
  }
);

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
    resetProfile: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
      });
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
