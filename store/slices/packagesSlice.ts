// store/slices/packagesSlice.ts
// Redux slice for packages data from API

import { packagesApi } from '@/services/api';
import { Package, PackageComparison } from '@/types/api';
import { logger } from '@/utils/logger';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface PackagesState {
  packages: Package[];
  featuredPackages: Package[];
  currentPackage: Package | null;
  comparison: PackageComparison | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PackagesState = {
  packages: [],
  featuredPackages: [],
  currentPackage: null,
  comparison: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ============================================================================
// Async Thunks
// ============================================================================

export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('packages/fetchPackages');
      const packages = await packagesApi.getAll();
      return packages;
    } catch (error) {
      logger.error('fetchPackages error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch packages');
    }
  }
);

export const fetchFeaturedPackages = createAsyncThunk(
  'packages/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      logger.reduxAction('packages/fetchFeatured');
      const packages = await packagesApi.getFeatured();
      return packages;
    } catch (error) {
      logger.error('fetchFeaturedPackages error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured packages');
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('packages/fetchById', { id });
      const pkg = await packagesApi.getById(id);
      return pkg;
    } catch (error) {
      logger.error('fetchPackageById error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch package');
    }
  }
);

export const fetchPackageComparison = createAsyncThunk(
  'packages/fetchComparison',
  async (id: number, { rejectWithValue }) => {
    try {
      logger.reduxAction('packages/fetchComparison', { id });
      const comparison = await packagesApi.getComparison(id);
      return comparison;
    } catch (error) {
      logger.error('fetchPackageComparison error', error as Error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch comparison');
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComparison: (state) => {
      state.comparison = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Packages
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Featured
    builder
      .addCase(fetchFeaturedPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredPackages = action.payload;
      })
      .addCase(fetchFeaturedPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch by ID
    builder
      .addCase(fetchPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Comparison
    builder
      .addCase(fetchPackageComparison.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageComparison.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comparison = action.payload;
      })
      .addCase(fetchPackageComparison.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearComparison } = packagesSlice.actions;

export default packagesSlice.reducer;
