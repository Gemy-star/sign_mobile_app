// store/slices/goalsSlice.ts
// Redux slice for goals data from API

import { goalsApi } from '@/services/api';
import { CreateGoalRequest, Goal, GoalFilters, PaginationParams, UpdateGoalRequest } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GoalsState {
  goals: Goal[];
  activeGoals: Goal[];
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
  activeGoals: [],
  currentGoal: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (params: { pagination?: PaginationParams; filters?: GoalFilters } | undefined, { rejectWithValue }) => {
    params = params ?? {};
    try {
      logger.reduxAction('goals/fetchGoals', params);
      const goals = await goalsApi.getAll(params.filters as any);
      return { results: goals, count: goals.length };
    } catch (error) {
      logger.error('fetchGoals error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch goals');
    }
  }
);

export const fetchActiveGoals = createAsyncThunk(
  'goals/fetchActiveGoals',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/fetchActiveGoals');
      const goals = await goalsApi.getActive();
      return goals;
    } catch (error) {
      logger.error('fetchActiveGoals error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch active goals');
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchGoalById',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/fetchGoalById', { id });
      const goal = await goalsApi.getById(id);
      return goal;
    } catch (error) {
      logger.error('fetchGoalById error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch goal');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData: CreateGoalRequest, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/createGoal', { goalData });
      const goal = await goalsApi.create(goalData);
      return goal;
    } catch (error) {
      logger.error('createGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create goal');
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, data }: { id: number; data: UpdateGoalRequest }, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/updateGoal', { id, data });
      const goal = await goalsApi.update(id, data);
      return goal;
    } catch (error) {
      logger.error('updateGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update goal');
    }
  }
);

export const updateGoalProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ goalId, progress }: { goalId: number; progress: number }, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/updateProgress', { goalId, progress });
      const goal = await goalsApi.updateProgress(goalId, progress);
      return goal;
    } catch (error) {
      logger.error('updateGoalProgress error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update progress');
    }
  }
);

export const completeGoal = createAsyncThunk(
  'goals/completeGoal',
  async (goalId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/completeGoal', { goalId });
      const goal = await goalsApi.complete(goalId);
      return goal;
    } catch (error) {
      logger.error('completeGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to complete goal');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (goalId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('goals/deleteGoal', { goalId });
      await goalsApi.delete(goalId);
      return goalId;
    } catch (error) {
      logger.error('deleteGoal error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete goal');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

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
        state.lastFetched = Date.now();
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Active Goals
    builder
      .addCase(fetchActiveGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeGoals = action.payload;
      })
      .addCase(fetchActiveGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Goal by ID
    builder
      .addCase(fetchGoalById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGoal = action.payload;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
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

    // Update Goal
    builder
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.goals[index] = action.payload;
        if (state.currentGoal?.id === action.payload.id) state.currentGoal = action.payload;
      });

    // Update Goal Progress
    builder
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const goal = state.goals.find((g) => g.id === action.payload.id);
        if (goal) {
          goal.progress_percentage = action.payload.progress_percentage;
          goal.updated_at = action.payload.updated_at;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
      });

    // Complete Goal
    builder
      .addCase(completeGoal.fulfilled, (state, action) => {
        const goal = state.goals.find((g) => g.id === action.payload.id);
        if (goal) {
          goal.status = 'completed';
          goal.progress_percentage = 100;
          goal.updated_at = action.payload.updated_at;
          goal.completed_at = action.payload.completed_at;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
      });

    // Delete Goal
    builder
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        state.activeGoals = state.activeGoals.filter((g) => g.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.currentGoal?.id === action.payload) state.currentGoal = null;
      });
  },
});

export const { setFilters, setCurrentPage, clearError, clearGoals } = goalsSlice.actions;

export default goalsSlice.reducer;
