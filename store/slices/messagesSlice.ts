// store/slices/messagesSlice.ts
// Redux slice for messages data from API

import { messagesApi } from '@/services/api';
import { CreateMessageRequest, Message, MessageFilters, PaginationParams } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessagesState {
  messages: Message[];
  favoriteMessages: Message[];
  currentMessage: Message | null;
  dailyMessage: Message | null;
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
  favoriteMessages: [],
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

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (params: { pagination?: PaginationParams; filters?: MessageFilters } | undefined, { rejectWithValue }) => {
    params = params ?? {};
    try {
      logger.reduxAction('messages/fetchMessages', params);
      const messages = await messagesApi.getAll(params.filters);
      return { results: messages, count: messages.length };
    } catch (error: any) {
      // 403 means the user has no active subscription — not an app error.
      // Return an empty list so UI can show a "subscribe" prompt instead of an error.
      if (error?.status === 403) {
        return { results: [], count: 0, noSubscription: true };
      }
      logger.error('fetchMessages error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch messages');
    }
  }
);

export const fetchDailyMessage = createAsyncThunk(
  'messages/fetchDailyMessage',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchDailyMessage');
      const message = await messagesApi.getDaily();
      return message;
    } catch (error) {
      logger.error('fetchDailyMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch daily message');
    }
  }
);

export const fetchFavoriteMessages = createAsyncThunk(
  'messages/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchFavorites');
      const messages = await messagesApi.getFavorites();
      return messages;
    } catch (error) {
      logger.error('fetchFavoriteMessages error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch favorites');
    }
  }
);

export const fetchMessageById = createAsyncThunk(
  'messages/fetchMessageById',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/fetchMessageById', { id });
      const message = await messagesApi.getById(id);
      return message;
    } catch (error) {
      logger.error('fetchMessageById error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch message');
    }
  }
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData: CreateMessageRequest, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/createMessage', { messageData });
      const message = await messagesApi.create(messageData);
      return message;
    } catch (error) {
      logger.error('createMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create message');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (messageId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/markAsRead', { messageId });
      const message = await messagesApi.markAsRead(messageId);
      return message;
    } catch (error) {
      logger.error('markMessageAsRead error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to mark as read');
    }
  }
);

export const rateMessage = createAsyncThunk(
  'messages/rateMessage',
  async ({ messageId, rating }: { messageId: number; rating: number }, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/rateMessage', { messageId, rating });
      const message = await messagesApi.rate(messageId, rating);
      return message;
    } catch (error) {
      logger.error('rateMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to rate message');
    }
  }
);

export const toggleMessageFavorite = createAsyncThunk(
  'messages/toggleFavorite',
  async (messageId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/toggleFavorite', { messageId });
      const message = await messagesApi.toggleFavorite(messageId);
      return message;
    } catch (error) {
      logger.error('toggleMessageFavorite error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle favorite');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('messages/deleteMessage', { messageId });
      await messagesApi.delete(messageId);
      return messageId;
    } catch (error) {
      logger.error('deleteMessage error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete message');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

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
      })
      .addCase(fetchDailyMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Favorites
    builder
      .addCase(fetchFavoriteMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favoriteMessages = action.payload;
      })
      .addCase(fetchFavoriteMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Message by ID
    builder
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.currentMessage = action.payload;
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

    // Mark as Read
    builder
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m.id === action.payload.id);
        if (msg) msg.is_read = true;
        if (state.currentMessage?.id === action.payload.id) state.currentMessage.is_read = true;
      });

    // Rate Message
    builder
      .addCase(rateMessage.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m.id === action.payload.id);
        if (msg) msg.user_rating = action.payload.user_rating;
        if (state.currentMessage?.id === action.payload.id) {
          state.currentMessage.user_rating = action.payload.user_rating;
        }
      });

    // Toggle Favorite
    builder
      .addCase(toggleMessageFavorite.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m.id === action.payload.id);
        if (msg) msg.is_favorited = action.payload.is_favorited;
        if (state.currentMessage?.id === action.payload.id) {
          state.currentMessage.is_favorited = action.payload.is_favorited;
        }
        // Sync favoriteMessages list
        if (action.payload.is_favorited) {
          if (!state.favoriteMessages.some((m) => m.id === action.payload.id)) {
            state.favoriteMessages.push(action.payload);
          }
        } else {
          state.favoriteMessages = state.favoriteMessages.filter((m) => m.id !== action.payload.id);
        }
      });

    // Delete Message
    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m.id !== action.payload);
        state.favoriteMessages = state.favoriteMessages.filter((m) => m.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.currentMessage?.id === action.payload) state.currentMessage = null;
      });
  },
});

export const { setFilters, setCurrentPage, clearError, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
