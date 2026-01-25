import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '../types';

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
}

const initialState: AuthState = {
  admin: JSON.parse(localStorage.getItem('admin') || 'null'),
  token: localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ admin: AdminUser; token: string }>) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('admin');
      localStorage.removeItem('token');
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
