// hooks/useAuth.ts
// Custom auth hooks using Redux directly - Updated to use dataSource

import { useCallback } from 'react';
import { dataSource } from '../services/dataSource.service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginFailure, loginStart, loginSuccess, logout as logoutAction, updateUser } from '../store/slices/authSlice';
import { LoginRequest, User } from '../types/api';
import { logger } from '../utils/logger';

/**
 * Hook to get auth state from Redux
 * @returns Auth state (user, isAuthenticated, isLoading, error)
 */
export const useAuthState = () => {
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};

/**
 * Hook to get auth actions
 * @returns Auth actions (login, logout, checkAuth)
 */
export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      dispatch(loginStart());
      logger.info('Attempting login', { username: credentials.username });

      const response = await dataSource.login(credentials);

      if (response.success && response.data) {
        const { access } = response.data;

        // Get user profile
        const profileResponse = await dataSource.getProfile();

        if (profileResponse.success && profileResponse.data) {
          dispatch(loginSuccess({ user: profileResponse.data, token: access }));
          logger.info('Login successful', { userId: profileResponse.data.id });
          return true;
        } else {
          const errorMessage = 'Failed to get user data';
          dispatch(loginFailure(errorMessage));
          logger.warn('Login failed - no user data');
          return false;
        }
      } else {
        const errorMessage = response.error || 'Login failed';
        dispatch(loginFailure(errorMessage));
        logger.warn('Login failed', { error: errorMessage });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      logger.error('Login error', error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }, [dispatch]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      logger.info('Logging out');

      // Clear tokens using dataSource
      await dataSource.logout();

      dispatch(logoutAction());
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout error', error instanceof Error ? error : new Error(String(error)));
      // Still dispatch logout even if clearing fails
      dispatch(logoutAction());
    }
  }, [dispatch]);

  const checkAuth = useCallback(async (): Promise<User | null> => {
    try {
      const profileResponse = await dataSource.getProfile();

      if (profileResponse.success && profileResponse.data) {
        dispatch(updateUser(profileResponse.data));
        logger.info('Auth check successful', { userId: profileResponse.data.id });
        return profileResponse.data;
      } else {
        // Clear auth state
        await dataSource.logout();
        dispatch(logoutAction());
        logger.warn('Auth check failed - no user data');
        return null;
      }
    } catch (error) {
      logger.error('Auth check error', error instanceof Error ? error : new Error(String(error)));
      // On error, clear auth state
      await dataSource.logout();
      dispatch(logoutAction());
      return null;
    }
  }, [dispatch]);

  return {
    login,
    logout,
    checkAuth,
  };
};

/**
 * Combined hook for both state and actions
 * @returns Complete auth interface (state + actions)
 */
export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();

  return {
    ...state,
    ...actions,
  };
};
