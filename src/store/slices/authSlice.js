import { createSlice } from '@reduxjs/toolkit';
import { getUserFromToken } from '../../api/authApi';

// Initial state for the auth slice
const initialState = {
  user: getUserFromToken(),
  isAuthenticated: !!getUserFromToken(),
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set the user and authentication status
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // Clear the user and authentication status
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export the actions
export const { setCredentials, clearCredentials } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;