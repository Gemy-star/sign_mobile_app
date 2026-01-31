// store/slices/dashboardSlice.ts
// Redux slice for dashboard statistics from API

import { DashboardStats } from '@/services/api';
import { dataSource } from '@/services/dataSource.service';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks for API calls

export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('dashboard/fetchStats');
      const response = await dataSource.getDashboardStats();
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch dashboard stats', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch dashboard stats');
    } catch (error) {
      logger.error('fetchDashboardStats error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: (state) => {
      state.stats = null;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
