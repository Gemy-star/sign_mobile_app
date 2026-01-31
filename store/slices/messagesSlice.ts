// store/slices/messagesSlice.ts
// Redux slice for messages data from API

import { dataSource } from '@/services/dataSource.service';
import { Message, MessageFilters, PaginationParams } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagesState {
  messages: Message[];
  currentMessage: Message | null;
  dailyMessage: any | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: MessageFilters;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: MessagesState = {
  messages: [],
  currentMessage: null,
  dailyMessage: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20,
  filters: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks for API calls

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params: { pagination?: PaginationParams; filters?: MessageFilters }, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchMessages', params);
      const response = await dataSource.getMessages(params.filters, params.pagination);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch messages', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch messages');
    } catch (error) {
      logger.error('fetchMessages error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchDailyMessage = createAsyncThunk(
  'messages/fetchDailyMessage',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchDailyMessage');
      const response = await dataSource.getDailyMessages();
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to fetch daily message', { error: response.error });
      return rejectWithValue(response.error || 'Failed to fetch daily message');
    } catch (error) {
      logger.error('fetchDailyMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData: any, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/createMessage', { messageData });
      const response = await dataSource.createMessage(messageData);
      if (response.success && response.data) {
        return response.data;
      }
      logger.warn('Failed to create message', { error: response.error });
      return rejectWithValue(response.error || 'Failed to create message');
    } catch (error) {
      logger.error('createMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const rateMessage = createAsyncThunk(
  'messages/rateMessage',
  async ({ messageId, rating }: { messageId: number; rating: number }, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/rateMessage', { messageId, rating });
      const response = await dataSource.rateMessage(messageId, rating);
      if (response.success) {
        return { messageId, rating };
      }
      logger.warn('Failed to rate message', { error: response.error });
      return rejectWithValue(response.error || 'Failed to rate message');
    } catch (error) {
      logger.error('rateMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<MessageFilters>) => {
      state.filters = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.results || [];
        state.totalCount = action.payload.count || 0;
        // Calculate page from pagination
        const pageSize = state.pageSize || 20;
        state.currentPage = Math.ceil((action.payload.results?.length || 0) / pageSize);
        state.lastFetched = Date.now();
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Daily Message
    builder
      .addCase(fetchDailyMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyMessage = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDailyMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Message
    builder
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Rate Message
    builder
      .addCase(rateMessage.fulfilled, (state, action) => {
        const message = state.messages.find(m => m.id === action.payload.messageId);
        if (message) {
          message.user_rating = action.payload.rating;
        }
      });
  },
});

export const { setFilters, setCurrentPage, clearError, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
