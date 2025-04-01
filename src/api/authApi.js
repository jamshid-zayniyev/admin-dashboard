import { apiSlice } from './apiSlice';
import { setToken, removeToken, getToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Transform the response to handle token storage
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Store the token in localStorage
          if (data.token) {
            setToken(data.token);
          }
        } catch (error) {
          console.error('Login failed:', error);
          removeToken();
        }
      },
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      // Remove the token on logout
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // Always remove token regardless of API response
          removeToken();
        }
      },
    }),
  }),
});

// Extract the user information from the JWT token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub,
      username: decoded.name,
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Invalid token:', error);
    removeToken();
    return null;
  }
};

// Export the generated hooks
export const { useLoginMutation, useLogoutMutation } = authApi;