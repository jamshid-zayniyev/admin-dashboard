import { apiSlice } from './apiSlice';

// Helper function to create FormData from admin object
const createAdminFormData = (admin) => {
  const formData = new FormData();
  
  // Add all text fields
  if (admin.username) formData.append('username', admin.username);
  if (admin.password) formData.append('password', admin.password);
  if (admin.email) formData.append('email', admin.email);
  
  // Add image if it's a File object
  if (admin.image instanceof File) {
    formData.append('image', admin.image);
  } else if (typeof admin.image === 'string' && !admin.image.startsWith('blob:')) {
    // If it's a URL string (not a blob URL), pass it as is
    formData.append('imageUrl', admin.image);
  }
  
  return formData;
};

// Extend the API slice with admin-related endpoints
export const adminsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query({
      query: () => '/worker/get-workers',
      providesTags: ['Admins'],
    }),
    
    getAdmin: builder.query({
      query: (id) => `/worker/get-workers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Admins', id }],
    }),
    
    addAdmin: builder.mutation({
      query: (admin) => {
        const formData = createAdminFormData(admin);
        
        return {
          url: '/worker/create-worker',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Admins'],
    }),
    
    updateAdmin: builder.mutation({
      query: ({ id, ...admin }) => {
        const formData = createAdminFormData(admin);
        
        return {
          url: `/worker/update-worker/${id}`,
          method: 'PUT',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Admins', id }],
    }),
    
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/worker/delete-worker/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetAdminsQuery,
  useGetAdminQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminsApi;