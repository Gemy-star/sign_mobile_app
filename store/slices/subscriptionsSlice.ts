// store/slices/subscriptionsSlice.ts
// Redux slice for subscriptions data from API

import { subscriptionsApi } from '@/services/api';
import {
    CreateSubscriptionRequest,
    CreateSubscriptionResponse,
    SubscriptionDetail,
    SubscriptionList,
    UpdateScopesRequest
} from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface SubscriptionsState {
  subscriptions: SubscriptionList[];
  activeSubscription: SubscriptionDetail | null;
  currentSubscription: SubscriptionDetail | null;
  pendingPayment: CreateSubscriptionResponse | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  activeSubscription: null,
  currentSubscription: null,
  pendingPayment: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/fetchAll');
      const subs = await subscriptionsApi.getAll();
      return subs;
    } catch (error) {
      logger.error('fetchSubscriptions error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch subscriptions');
    }
  }
);

export const fetchActiveSubscription = createAsyncThunk(
  'subscriptions/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/fetchActive');
      const sub = await subscriptionsApi.getActive();
      return sub;
    } catch (error) {
      logger.error('fetchActiveSubscription error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'No active subscription');
    }
  }
);

export const fetchSubscriptionById = createAsyncThunk(
  'subscriptions/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/fetchById', { id });
      const sub = await subscriptionsApi.getById(id);
      return sub;
    } catch (error) {
      logger.error('fetchSubscriptionById error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch subscription');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/create',
  async (data: CreateSubscriptionRequest, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/create', data);
      const result = await subscriptionsApi.create(data);
      return result;
    } catch (error) {
      logger.error('createSubscription error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create subscription');
    }
  }
);

export const patchSubscription = createAsyncThunk(
  'subscriptions/patch',
  async ({ id, data }: { id: number; data: Partial<SubscriptionDetail> }, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/patch', { id, data });
      const sub = await subscriptionsApi.patch(id, data);
      return sub;
    } catch (error) {
      logger.error('patchSubscription error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update subscription');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancel',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/cancel', { id });
      await subscriptionsApi.cancel(id);
      return id;
    } catch (error) {
      logger.error('cancelSubscription error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to cancel subscription');
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/delete', { id });
      await subscriptionsApi.delete(id);
      return id;
    } catch (error) {
      logger.error('deleteSubscription error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete subscription');
    }
  }
);

export const updateSubscriptionScopes = createAsyncThunk(
  'subscriptions/updateScopes',
  async ({ id, data }: { id: number; data: UpdateScopesRequest }, { rejectWithValue }) => {
    try {
      logger.reduxAction('subscriptions/updateScopes', { id, data });
      const sub = await subscriptionsApi.updateScopes(id, data);
      return sub;
    } catch (error) {
      logger.error('updateSubscriptionScopes error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update scopes');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPendingPayment: (state) => {
      state.pendingPayment = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Active
    builder
      .addCase(fetchActiveSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSubscription = action.payload;
      })
      .addCase(fetchActiveSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.activeSubscription = null;
        state.error = action.payload as string;
      });

    // Fetch by ID
    builder
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create (initiates payment)
    builder
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingPayment = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Patch
    builder
      .addCase(patchSubscription.fulfilled, (state, action) => {
        if (state.activeSubscription?.id === action.payload.id) {
          state.activeSubscription = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      });

    // Cancel
    builder
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        if (state.activeSubscription?.id === action.payload) {
          state.activeSubscription = null;
        }
        state.subscriptions = state.subscriptions.filter((s) => s.id !== action.payload);
      });

    // Delete
    builder
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter((s) => s.id !== action.payload);
        if (state.activeSubscription?.id === action.payload) state.activeSubscription = null;
        if (state.currentSubscription?.id === action.payload) state.currentSubscription = null;
      });

    // Update scopes
    builder
      .addCase(updateSubscriptionScopes.fulfilled, (state, action) => {
        if (state.activeSubscription?.id === action.payload.id) {
          state.activeSubscription = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      });
  },
});

export const { clearError, clearPendingPayment } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
