import { apiSlice } from './apiSlice';

// Helper function to create FormData from product object
const createProductFormData = (product) => {
  const formData = new FormData();
  
  // Handle multilingual fields by flattening them
  if (product.name) {
    if (product.name.ru) formData.append('name_ru', product.name.ru);
    if (product.name.kz) formData.append('name_kz', product.name.kz);
  }
  
  if (product.price) {
    if (product.price.ru) formData.append('price_ru', product.price.ru);
    if (product.price.kz) formData.append('price_kz', product.price.kz);
  }
  
  if (product.description) {
    if (product.description.ru) formData.append('description_ru', product.description.ru);
    if (product.description.kz) formData.append('description_kz', product.description.kz);
  }
  
  if (product.material) {
    if (product.material.ru) formData.append('material_ru', product.material.ru);
    if (product.material.kz) formData.append('material_kz', product.material.kz);
  }
  
  if (product.code) {
    if (product.code.ru) formData.append('code_ru', product.code.ru);
    if (product.code.kz) formData.append('code_kz', product.code.kz);
  }
  
  if (product.title) {
    if (product.title.ru) formData.append('title_ru', product.title.ru);
    if (product.title.kz) formData.append('title_kz', product.title.kz);
  }
  
  if (product.discountPercent) {
    if (product.discountPercent.ru) formData.append('discountPercent_ru', product.discountPercent.ru);
    if (product.discountPercent.kz) formData.append('discountPercent_kz', product.discountPercent.kz);
  }
  
  if (product.discountPrice) {
    if (product.discountPrice.ru) formData.append('discountPrice_ru', product.discountPrice.ru);
    if (product.discountPrice.kz) formData.append('discountPrice_kz', product.discountPrice.kz);
  }
  
  // Handle size as separate fields
  if (product.size) {
    if (product.size.X !== undefined) formData.append('size_X', product.size.X);
    if (product.size.Y !== undefined) formData.append('size_Y', product.size.Y);
    if (product.size.Z !== undefined) formData.append('size_Z', product.size.Z);
  }
  
  // Add main image if it's a File object
  if (product.mainImage instanceof File) {
    formData.append('mainImage', product.mainImage);
  } else if (typeof product.mainImage === 'string' && !product.mainImage.startsWith('blob:')) {
    // If it's a URL string (not a blob URL), pass it as is
    formData.append('mainImageUrl', product.mainImage);
  }
  
  // Add additional images
  if (product.additionalImages && product.additionalImages.length > 0) {
    product.additionalImages.forEach((image) => {
      if (image instanceof File) {
        formData.append('additionalImages', image);
      } else if (typeof image === 'string' && !image.startsWith('blob:')) {
        // If it's a URL string (not a blob URL), add it to an array
        formData.append('additionalImageUrls', image);
      }
    });
  }
  
  return formData;
};

// Extend the API slice with product-related endpoints
export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/product/get-products',
      providesTags: ['Products'],
    }),
    
    getProduct: builder.query({
      query: (id) => `/product/get-products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    
    addProduct: builder.mutation({
      query: (product) => {
        const formData = createProductFormData(product);
        
        return {
          url: '/product/create-product',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, it will be set automatically with boundary for FormData
          formData: true,
        };
      },
      invalidatesTags: ['Products'],
    }),
    
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => {
        const formData = createProductFormData(product);
        
        return {
          url: `/product/update-product/${id}`,
          method: 'PUT',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }],
    }),
    
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete-product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;