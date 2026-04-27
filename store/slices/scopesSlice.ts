// store/slices/scopesSlice.ts
// Redux slice for scopes/categories data from API

import { API_CONFIG } from '@/config/api.config';
import { FEATURE_FLAGS } from '@/config/features.config';
import { scopesApi } from '@/services/api';
import { mockDataService } from '@/services/mock.service';
import { CheckAccessRequest, Scope, ScopeCategory } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScopesState {
  scopes: Scope[];
  categories: ScopeCategory[];
  currentScope: Scope | null;
  selectedScopes: number[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ScopesState = {
  scopes: [],
  categories: [],
  currentScope: null,
  selectedScopes: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchScopes = createAsyncThunk(
  'scopes/fetchScopes',
  async (category?: string, { rejectWithValue }: any = {}) => {
    try {
      logger.reduxAction('scopes/fetchScopes', { category });
      if (!FEATURE_FLAGS.USE_API || API_CONFIG.USE_MOCK_DATA) {
        logger.reduxAction('scopes/fetchScopes — using mock data');
        const response = await mockDataService.getScopes();
        return response.data ?? [];
      }
      const scopes = await scopesApi.getAll(category ? { category } : undefined);
      return scopes;
    } catch (error) {
      logger.error('fetchScopes error', error as Error);
      if (__DEV__ || API_CONFIG.USE_MOCK_DATA) {
        logger.reduxAction('scopes/fetchScopes — falling back to mock data');
        const response = await mockDataService.getScopes();
        return response.data ?? [];
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch scopes');
    }
  }
);

export const fetchScopeById = createAsyncThunk(
  'scopes/fetchScopeById',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/fetchScopeById', { id });
      const scope = await scopesApi.getById(id);
      return scope;
    } catch (error) {
      logger.error('fetchScopeById error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch scope');
    }
  }
);

export const fetchScopeCategories = createAsyncThunk(
  'scopes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/fetchCategories');
      const categories = await scopesApi.getCategories();
      return categories;
    } catch (error) {
      logger.error('fetchScopeCategories error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const checkScopeAccess = createAsyncThunk(
  'scopes/checkAccess',
  async (data: CheckAccessRequest, { rejectWithValue }) => {
    try {
      logger.reduxAction('scopes/checkAccess', data);
      const result = await scopesApi.checkAccess(data);
      return result;
    } catch (error) {
      logger.error('checkScopeAccess error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to check access');
    }
  }
);

export const updateUserScopes = createAsyncThunk(
  'scopes/updateUserScopes',
  async ({ subscriptionId, scopeIds }: { subscriptionId: number; scopeIds: number[] }, { rejectWithValue }) => {
    try {
      const { subscriptionsApi } = await import('@/services/api');
      logger.reduxAction('scopes/updateUserScopes', { subscriptionId, scopeIds });
      await subscriptionsApi.updateScopes(subscriptionId, { scope_ids: scopeIds });
      return scopeIds;
    } catch (error) {
      logger.error('updateUserScopes error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update scopes');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

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

    // Fetch Scope by ID
    builder
      .addCase(fetchScopeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScopeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentScope = action.payload;
      })
      .addCase(fetchScopeById.rejected, (state, action) => {
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
