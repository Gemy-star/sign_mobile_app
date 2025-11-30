// store/slices/scopesSlice.ts
// Redux slice for scopes/categories data from API

import { dataSource } from '@/services/data-source.service';
import { Scope, ScopeCategory } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScopesState {
  scopes: Scope[];
  categories: ScopeCategory[];
  selectedScopes: number[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ScopesState = {
  scopes: [],
  categories: [],
  selectedScopes: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks for API calls

export const fetchScopes = createAsyncThunk(
  'scopes/fetchScopes',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/fetchScopes');
      const response = await dataSource.getScopes();
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch scopes', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch scopes');
    } catch (error) {
      logger.error('fetchScopes error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchScopeCategories = createAsyncThunk(
  'scopes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/fetchCategories');
      const response = await dataSource.getScopeCategories();
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch scope categories', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch scope categories');
    } catch (error) {
      logger.error('fetchScopeCategories error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateUserScopes = createAsyncThunk(
  'scopes/updateUserScopes',
  async ({ subscriptionId, scopeIds }: { subscriptionId: number; scopeIds: number[] }, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/updateUserScopes', { subscriptionId, scopeIds });
      const response = await dataSource.updateSubscriptionScopes(subscriptionId, { selected_scope_ids: scopeIds });
      if (response.success) {
        return scopeIds;
      }
      logger.warn('Failed to update scopes', { error: response.error });
      return rejectWithValue(response.error || 'Failed to update scopes');
    } catch (error) {
      logger.error('updateUserScopes error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const scopesSlice = createSlice({
  name: 'scopes',
  initialState,
  reducers: {
    setSelectedScopes: (state, action: PayloadAction<number[]>) => {
      state.selectedScopes = action.payload;
    },
    toggleScope: (state, action: PayloadAction<number>) => {
      const index = state.selectedScopes.indexOf(action.payload);
      if (index > -1) {
        state.selectedScopes.splice(index, 1);
      } else {
        state.selectedScopes.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Scopes
    builder
      .addCase(fetchScopes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScopes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scopes = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchScopes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Categories
    builder
      .addCase(fetchScopeCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScopeCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchScopeCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update User Scopes
    builder
      .addCase(updateUserScopes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserScopes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedScopes = action.payload;
      })
      .addCase(updateUserScopes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedScopes, toggleScope, clearError } = scopesSlice.actions;

export default scopesSlice.reducer;
