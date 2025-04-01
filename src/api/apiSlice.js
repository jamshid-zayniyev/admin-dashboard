import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../utils/auth';
import { mockApiMiddleware } from './mockApi';

// Define the base URL for the API
const baseUrl = import.meta.env.VITE_API_URL || 'YOUR_BACKEND_API_URL';

// Create a custom base query that uses mock data in development
const customBaseQuery = async (args, api, extraOptions) => {
  // Check if we're in development mode and should use mock data
  const useMockApi = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
  
  if (useMockApi) {
    try {
      // Extract endpoint name from the RTK Query internal state
      const endpoint = api.endpoint;
      
      // Call the mock API middleware
      const result = await mockApiMiddleware(endpoint, args);
      
      return { data: result };
    } catch (error) {
      return {
        error: {
          status: error.status || 500,
          data: error.data || { message: 'An error occurred' }
        }
      };
    }
  }
  
  // If not using mock data, use the regular fetchBaseQuery
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = getToken();
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
    // Add CORS mode explicitly
    fetchFn: (input, init) => {
      return fetch(input, {
        ...init,
        mode: 'cors',
        credentials: 'include'
      });
    }
  });
  
  try {
    return await baseQuery(args, api, extraOptions);
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error
      }
    };
  }
};

// Create the API slice with RTK Query
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['Products', 'Admins'],
  endpoints: () => ({}),
});