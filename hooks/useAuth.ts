// hooks/useAuth.ts
// Custom auth hooks using Redux directly - replaces AuthContext

import { useCallback } from 'react';
import { authService } from '../services/auth.service';
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

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        const { access, refresh } = response.data;

        // Save tokens using authService
        await authService.setTokens(access, refresh);

        // Get user data
        const user = await authService.getUser();

        if (user) {
          dispatch(loginSuccess({ user, token: access }));
          logger.info('Login successful', { userId: user.id });
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

      // Clear tokens using authService
      await authService.clearTokens();

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
      const token = await authService.getAccessToken();

      if (!token) {
        logger.debug('No auth token found');
        return null;
      }

      const user = await authService.getUser();

      if (user) {
        dispatch(updateUser(user));
        logger.info('Auth check successful', { userId: user.id });
        return user;
      } else {
        // Token is invalid, clear it
        await authService.clearTokens();
        dispatch(logoutAction());
        logger.warn('Auth check failed - invalid token');
        return null;
      }
    } catch (error) {
      logger.error('Auth check error', error instanceof Error ? error : new Error(String(error)));
      // On error, clear auth state
      await authService.clearTokens();
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
