import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; 

axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_CLIENT_URL;

// Set up axios with authentication interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface Package {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  foodPrice: number;
  accommodationPrice: number;
  includedServices: {
    food: boolean;
    accommodation: boolean;
  };
  startDate: Date;
  endDate: Date;
  location: string;
  images: string[];
  capacity: number;
}

export interface SelectedServices {
  food: boolean;
  accommodation: boolean;
  [key: string]: boolean;
}

export interface Booking {
  _id: string;
  package: Package;
  user: User;
  selectedServices: SelectedServices;
  totalPrice: number;
  status: string;
  bookingDate: Date;
}

export interface NewBooking {
  packageId: string;
  selectedServices: SelectedServices;
}

export interface BookingStatusUpdate {
  id: string;
  status: string;
}

interface BookingAnalytics {
  totalBookings: number;
  statusCounts: {
    completed: number;
    active: number;
    upcoming: number;
  };
  topUsers: {
    _id: string;
    name: string;
    email: string;
    bookingsCount: number;
    totalSpent: number;
  }[];
}

interface BookingState {
  bookings: Booking[];
  singleBooking: Booking | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  analytics: BookingAnalytics | null;
}

// Define a custom error type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

const initialState: BookingState = {
  bookings: [],
  singleBooking: null,
  loading: false,
  error: null,
  success: false,
  analytics: null
};

// Async Thunks
export const createBooking = createAsyncThunk<Booking, NewBooking, { rejectValue: string }>(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/booking', bookingData);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const getUserBookings = createAsyncThunk<Booking[], string | undefined, { rejectValue: string }>(
  'booking/getUserBookings',
  async (status, { rejectWithValue }) => {
    try {
      const url = status ? `/booking?status=${status}` : '/booking';
      const response = await axios.get(url);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const getAllBookings = createAsyncThunk<Booking[], { status?: string; userId?: string; packageId?: string }, { rejectValue: string }>(
  'booking/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.packageId) queryParams.append('packageId', params.packageId);

      const response = await axios.get(`/booking/package?${queryParams.toString()}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to fetch all bookings');
    }
  }
);

export const updateBookingStatus = createAsyncThunk<Booking, BookingStatusUpdate, { rejectValue: string }>(
  'booking/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/booking/${id}`, { status });
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to update booking status');
    }
  }
);

export const getBookingAnalytics = createAsyncThunk<BookingAnalytics, void, { rejectValue: string }>(
  'booking/analytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/booking/analytics');
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data?.message || 'Failed to fetch booking analytics');
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    resetBookingState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearBookingErrors(state) {
      state.error = null;
    },
    setSingleBooking(state, action: PayloadAction<Booking>) {
      state.singleBooking = action.payload;
    },
    clearSingleBooking(state) {
      state.singleBooking = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.singleBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.singleBooking = action.payload;
        state.bookings = state.bookings.map((b) => (b._id === action.payload._id ? action.payload : b));
      })
      .addCase(getBookingAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })

      // Handle all pending actions
      .addMatcher((action) => action.type.startsWith('booking/') && action.type.endsWith('/pending'), (state) => {
        state.loading = true;
        state.error = null;
      })

      // Handle all rejected actions
      .addMatcher(
        (action) => action.type.startsWith('booking/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  }
});

// Actions
export const {
  resetBookingState,
  clearBookingErrors,
  setSingleBooking,
  clearSingleBooking
} = bookingSlice.actions;

// Selectors
export const selectAllBookings = (state: RootState) => state.booking.bookings;
export const selectSingleBooking = (state: RootState) => state.booking.singleBooking;
export const selectBookingLoading = (state: RootState) => state.booking.loading;
export const selectBookingError = (state: RootState) => state.booking.error;
export const selectBookingSuccess = (state: RootState) => state.booking.success;
export const selectBookingAnalytics = (state: RootState) => state.booking.analytics;

export default bookingSlice.reducer;