// store/slices/goalsSlice.ts
// Redux slice for goals data from API

import { dataSource } from '@/services/dataSource.service';
import { Goal, GoalFilters, PaginationParams } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GoalsState {
  goals: Goal[];
  currentGoal: Goal | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: GoalFilters;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: GoalsState = {
  goals: [],
  currentGoal: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks for API calls

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (params: { pagination?: PaginationParams; filters?: GoalFilters }, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/fetchGoals', params);
      const response = await dataSource.getGoals(params.filters, params.pagination);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch goals', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch goals');
    } catch (error) {
      logger.error('fetchGoals error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData: any, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/createGoal', { goalData });
      const response = await dataSource.createGoal(goalData);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to create goal', { error: response.error });
      return rejectWithValue(response.error || 'Failed to create goal');
    } catch (error) {
      logger.error('createGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateGoalProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ goalId, progress }: { goalId: number; progress: number }, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/updateProgress', { goalId, progress });
      const response = await dataSource.updateGoalProgress(goalId, progress);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to update progress', { error: response.error });
      return rejectWithValue(response.error || 'Failed to update progress');
    } catch (error) {
      logger.error('updateGoalProgress error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const completeGoal = createAsyncThunk(
  'goals/completeGoal',
  async (goalId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/completeGoal', { goalId });
      const response = await dataSource.completeGoal(goalId);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to complete goal', { error: response.error });
      return rejectWithValue(response.error || 'Failed to complete goal');
    } catch (error) {
      logger.error('completeGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/deleteGoal', { goalId });
      const response = await dataSource.deleteGoal(goalId);
      if (response.success) {
        return goalId;
      }
      logger.warn('Failed to delete goal', { error: response.error });
      return rejectWithValue(response.error || 'Failed to delete goal');
    } catch (error) {
      logger.error('deleteGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<GoalFilters>) => {
      state.filters = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearGoals: (state) => {
      state.goals = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Goals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload.results || [];
        state.totalCount = action.payload.count || 0;
        // Calculate page from pagination
        const pageSize = state.pageSize || 20;
        state.currentPage = Math.ceil((action.payload.results?.length || 0) / pageSize);
        state.lastFetched = Date.now();
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Goal
    builder
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Goal Progress
    builder
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const goal = state.goals.find((g) => g.id === action.payload.id);
        if (goal) {
          goal.progress_percentage = action.payload.progress_percentage;
          goal.updated_at = action.payload.updated_at;
        }
      });

    // Complete Goal
    builder
      .addCase(completeGoal.fulfilled, (state, action) => {
        const goal = state.goals.find((g) => g.id === action.payload.id);
        if (goal) {
          goal.status = 'completed';
          goal.updated_at = action.payload.updated_at;
        }
      });

    // Delete Goal
    builder
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        state.totalCount -= 1;
      });
  },
});

export const { setFilters, setCurrentPage, clearError, clearGoals } = goalsSlice.actions;

export default goalsSlice.reducer;
