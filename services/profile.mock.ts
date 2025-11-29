// services/profile.mock.ts
// Mock Profile Data Service - Ready for API Integration

export interface UserStats {
  goals: number;
  messages: number;
  streak: number;
}

export interface UserPreferences {
  darkMode: boolean;
  language: 'en' | 'ar';
  notifications: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  personalizedAds: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  stats: UserStats;
  preferences: UserPreferences;
  security: SecuritySettings;
  privacy: PrivacySettings;
}

// Mock user profile data
export const MOCK_USER_PROFILE: UserProfile = {
  id: '1',
  username: 'demo_user',
  email: 'demo@motivateapp.com',
  firstName: 'Demo',
  lastName: 'User',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
  stats: {
    goals: 12,
    messages: 45,
    streak: 7,
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
};

// API-ready functions (currently using mock data)
export const ProfileService = {
  /**
   * Get user profile
   * @param userId - User ID
   * @returns User profile data
   */
  async getProfile(userId: string): Promise<UserProfile> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/profile`);
    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER_PROFILE), 500);
    });
  },

  /**
   * Update user stats
   * @param userId - User ID
   * @param stats - Updated stats
   */
  async updateStats(userId: string, stats: Partial<UserStats>): Promise<UserStats> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/stats`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(stats),
    // });
    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_USER_PROFILE.stats = { ...MOCK_USER_PROFILE.stats, ...stats };
        resolve(MOCK_USER_PROFILE.stats);
      }, 500);
    });
  },

  /**
   * Update user preferences
   * @param userId - User ID
   * @param preferences - Updated preferences
   */
  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/preferences`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(preferences),
    // });
    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_USER_PROFILE.preferences = { ...MOCK_USER_PROFILE.preferences, ...preferences };
        resolve(MOCK_USER_PROFILE.preferences);
      }, 500);
    });
  },

  /**
   * Update security settings
   * @param userId - User ID
   * @param security - Updated security settings
   */
  async updateSecurity(userId: string, security: Partial<SecuritySettings>): Promise<SecuritySettings> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/security`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(security),
    // });
    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_USER_PROFILE.security = { ...MOCK_USER_PROFILE.security, ...security };
        resolve(MOCK_USER_PROFILE.security);
      }, 500);
    });
  },

  /**
   * Update privacy settings
   * @param userId - User ID
   * @param privacy - Updated privacy settings
   */
  async updatePrivacy(userId: string, privacy: Partial<PrivacySettings>): Promise<PrivacySettings> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/privacy`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(privacy),
    // });
    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_USER_PROFILE.privacy = { ...MOCK_USER_PROFILE.privacy, ...privacy };
        resolve(MOCK_USER_PROFILE.privacy);
      }, 500);
    });
  },

  /**
   * Change password
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ currentPassword, newPassword }),
    // });
    // return await response.json();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (currentPassword === 'wrong') {
          reject({ success: false, message: 'Current password is incorrect' });
        } else {
          resolve({ success: true, message: 'Password changed successfully' });
        }
      }, 1500);
    });
  },

  /**
   * Download user data
   * @param userId - User ID
   */
  async downloadUserData(userId: string): Promise<Blob> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}/data/download`);
    // return await response.blob();

    return new Promise((resolve) => {
      setTimeout(() => {
        const data = JSON.stringify(MOCK_USER_PROFILE, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        resolve(blob);
      }, 1000);
    });
  },

  /**
   * Delete user account
   * @param userId - User ID
   * @param password - User password for confirmation
   */
  async deleteAccount(
    userId: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/users/${userId}`, {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password }),
    // });
    // return await response.json();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (password === 'wrong') {
          reject({ success: false, message: 'Password is incorrect' });
        } else {
          resolve({ success: true, message: 'Account deleted successfully' });
        }
      }, 1500);
    });
  },
};
