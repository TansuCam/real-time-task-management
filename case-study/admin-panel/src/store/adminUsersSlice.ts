import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types';
import api from '../api';
import { AxiosError } from 'axios';

interface AdminUsersState {
  adminUsers: AdminUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  adminUsers: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchAdminUsers = createAsyncThunk(
  'adminUsers/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin-users');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to fetch admin users');
    }
  }
);

export const createAdminUser = createAsyncThunk(
  'adminUsers/createAdminUser',
  async (userData: { name: string; email: string; role: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin-users', userData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to create admin user');
    }
  }
);

export const updateAdminUserAsync = createAsyncThunk(
  'adminUsers/updateAdminUser',
  async ({ id, data }: { id: string; data: Partial<Omit<AdminUser, 'id' | 'password'>> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin-users/${id}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to update admin user');
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  'adminUsers/deleteAdminUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin-users/${id}`);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Failed to delete admin user');
    }
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setAdminUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.adminUsers = action.payload;
    },
    addAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.adminUsers.push(action.payload);
    },
    updateAdminUser: (state, action: PayloadAction<AdminUser>) => {
      const index = state.adminUsers.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.adminUsers[index] = action.payload;
      }
    },
    removeAdminUser: (state, action: PayloadAction<string>) => {
      state.adminUsers = state.adminUsers.filter(a => a.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    // Fetch admin users
    builder.addCase(fetchAdminUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.adminUsers = action.payload;
    });
    builder.addCase(fetchAdminUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create admin user
    builder.addCase(createAdminUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAdminUser.fulfilled, (state, action) => {
      state.loading = false;
      state.adminUsers.push(action.payload);
    });
    builder.addCase(createAdminUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update admin user
    builder.addCase(updateAdminUserAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateAdminUserAsync.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.adminUsers.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.adminUsers[index] = action.payload;
      }
    });
    builder.addCase(updateAdminUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete admin user
    builder.addCase(deleteAdminUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteAdminUser.fulfilled, (state, action) => {
      state.loading = false;
      state.adminUsers = state.adminUsers.filter(a => a.id !== action.payload);
    });
    builder.addCase(deleteAdminUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setAdminUsers, addAdminUser, updateAdminUser, removeAdminUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
