import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; 

axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_CLIENT_URL;

// Interfaces
export interface Package {
  _id: string;
  fromLocation: string;
  toLocation: string;
  startDate: string;
  endDate: string;
  basePrice: number;
  includedServices: {
    food: boolean;
    accommodation: boolean;
  };
  foodPrice: number;
  accommodationPrice: number;
  description: string;
  images: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status?: 'completed' | 'active' | 'upcoming';
}

interface PackageFilters {
  fromLocation?: string;
  toLocation?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: 'completed' | 'active' | 'upcoming';
  page?: number;
  limit?: number;
}

interface PackageResponse {
  success: boolean;
  count: number;
  data: Package[];
}

interface PackageAnalytics {
  packagesCount: Array<{
    _id: string;
    count: number;
  }>;
  bookingsPerPackage: Array<{
    _id: string;
    bookingsCount: number;
    packageName: string;
    toLocation: string;
    startDate: string;
    endDate: string;
  }>;
}

interface PackageState {
  packages: Package[];
  selectedPackage: Package | null;
  isLoading: boolean;
  error: string | null;
  count: number;
  analytics: PackageAnalytics | null;
}

const initialState: PackageState = {
  packages: [],
  selectedPackage: null,
  isLoading: false,
  error: null,
  count: 0,
  analytics: null
};

// Create Package
export const createPackage = createAsyncThunk<Package, FormData, { state: RootState; rejectValue: string }>(
  'package/create',
  async (packageData: FormData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('/packages/create', packageData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create package');
      }
      return rejectWithValue('Failed to create package');
    }
  }
);

// Get Packages with Filters
export const getPackages = createAsyncThunk<PackageResponse, PackageFilters, { state: RootState; rejectValue: string }>(
  'package/getAll',
  async (filters: PackageFilters, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.fromLocation) queryParams.append('fromLocation', filters.fromLocation);
      if (filters.toLocation) queryParams.append('toLocation', filters.toLocation);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      
      const response = await axios.get(`/packages/?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch packages');
      }
      return rejectWithValue('Failed to fetch packages');
    }
  }
);

// Get Package by ID
export const getPackageById = createAsyncThunk<Package, string, { state: RootState; rejectValue: string }>(
  'package/getById',
  async (packageId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`/packages/${packageId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch package details');
      }
      return rejectWithValue('Failed to fetch package details');
    }
  }
);

// Update Package
export const updatePackage = createAsyncThunk<Package, { id: string; data: FormData }, { state: RootState; rejectValue: string }>(
  'package/update',
  async ({ id, data }: { id: string; data: FormData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`/packages/${id}`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update package');
      }
      return rejectWithValue('Failed to update package');
    }
  }
);

// Delete Package
export const deletePackage = createAsyncThunk<string, string, { state: RootState; rejectValue: string }>(
  'package/delete',
  async (packageId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`/packages/${packageId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return packageId;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete package');
      }
      return rejectWithValue('Failed to delete package');
    }
  }
);

// Get Package Analytics
export const getPackageAnalytics = createAsyncThunk<PackageAnalytics, void, { state: RootState; rejectValue: string }>(
  'package/analytics',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/packages/analytics', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
      }
      return rejectWithValue('Failed to fetch analytics');
    }
  }
);

// Slice
const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    clearPackageError: (state) => {
      state.error = null;
    },
    clearSelectedPackage: (state) => {
      state.selectedPackage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action: PayloadAction<Package>) => {
        state.isLoading = false;
        state.packages.unshift(action.payload);
        state.count = state.packages.length;
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to create package';
      })

      .addCase(getPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPackages.fulfilled, (state, action: PayloadAction<PackageResponse>) => {
        state.isLoading = false;
        state.packages = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch packages';
      })

      .addCase(getPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPackageById.fulfilled, (state, action: PayloadAction<Package>) => {
        state.isLoading = false;
        state.selectedPackage = action.payload;
      })
      .addCase(getPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch package details';
      })

      .addCase(updatePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action: PayloadAction<Package>) => {
        state.isLoading = false;
        state.selectedPackage = action.payload;
        // Update the package in the packages array if it exists
        state.packages = state.packages.map(pkg => 
          pkg._id === action.payload._id ? action.payload : pkg
        );
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to update package';
      })

      .addCase(deletePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.packages = state.packages.filter(pkg => pkg._id !== action.payload);
        state.count = state.packages.length;
        if (state.selectedPackage && state.selectedPackage._id === action.payload) {
          state.selectedPackage = null;
        }
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to delete package';
      })

      .addCase(getPackageAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPackageAnalytics.fulfilled, (state, action: PayloadAction<PackageAnalytics>) => {
        state.isLoading = false;
        state.analytics = action.payload;
      })
      .addCase(getPackageAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch analytics';
      });
  }
});

export const { clearPackageError, clearSelectedPackage } = packageSlice.actions;
export default packageSlice.reducer;


