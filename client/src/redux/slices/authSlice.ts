import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store'; // ✅ Make sure this path matches your setup

axios.defaults.baseURL = import.meta.env.VITE_PUBLIC_CLIENT_URL || 'http://localhost:5000/api/';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface ClientUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clients: ClientUser[];
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  clients: []
};

// Register
export const register = createAsyncThunk<AuthResponse, FormData, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/reg', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

// Login
export const login = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk<AuthResponse, { idToken: string }, { rejectValue: string }>(
  'auth/googleLogin',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/g-login', idToken);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Google login failed');
      }
      return rejectWithValue('Google login failed');
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk<User, void, { state: RootState; rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
      }
      return rejectWithValue('Failed to get user profile');
    }
  }
);

  // Update Profile
  export const updateProfile = createAsyncThunk<AuthResponse, FormData, { state: RootState; rejectValue: string }>(
    'auth/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const response = await axios.put('/auth/profile', userData, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
        return rejectWithValue('Profile update failed');
      }
    }
  );

// Get All Clients
export const getAllClients = createAsyncThunk<ClientUser[], void, { state: RootState; rejectValue: string }>(
  'auth/getAllClients',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/auth/clients', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data.users;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients');
      }
      return rejectWithValue('Failed to fetch clients');
    }
  }
);

// Logout
export const logout = createAsyncThunk<null>('auth/logout', async () => {
  localStorage.removeItem('token');
  return null;
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Registration failed';
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
      })

      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Google login failed';
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to get user profile';
      })

      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Profile update failed';
      })

      .addCase(getAllClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action: PayloadAction<ClientUser[]>) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch clients';
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.clients = [];
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
