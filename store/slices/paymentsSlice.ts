// store/slices/paymentsSlice.ts
// Redux slice for payment verification state

import { paymentsApi } from '@/services/api';
import { PaymentVerification } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface PaymentsState {
  verification: PaymentVerification | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  verification: null,
  isLoading: false,
  error: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (chargeId: string, { rejectWithValue }) => {
    try {
      logger.reduxAction('payments/verify', { chargeId });
      const result = await paymentsApi.verifyPayment(chargeId);
      return result;
    } catch (error) {
      logger.error('verifyPayment error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Payment verification failed');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearVerification: (state) => {
      state.verification = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verification = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearVerification, clearError } = paymentsSlice.actions;

export default paymentsSlice.reducer;
