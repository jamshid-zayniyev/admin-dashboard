import { getLocalStorage, setLocalStorage } from '../utils/storage';

// Initial mock data
const initialProducts = [
  {
    id: '1',
    name: { ru: 'Стул', kz: 'Орындық' },
    price: { ru: 1000, kz: 1200 },
    description: { ru: 'Деревянный стул', kz: 'Ағаш орындық' },
    material: { ru: 'Дерево', kz: 'Ағаш' },
    code: { ru: 'ST123', kz: 'OR123' },
    title: { ru: 'Комфортный стул', kz: 'Жайлы орындық' },
    size: { X: 40, Y: 90, Z: 40 },
    discountPercent: { ru: 10, kz: 12 },
    discountPrice: { ru: 900, kz: 1056 },
    mainImage: 'https://images.unsplash.com/photo-1503602642458-232111445657',
    additionalImages: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267',
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8'
    ]
  },
  {
    id: '2',
    name: { ru: 'Стол', kz: 'Үстел' },
    price: { ru: 5000, kz: 5500 },
    description: { ru: 'Обеденный стол', kz: 'Ас үстелі' },
    material: { ru: 'Дерево', kz: 'Ағаш' },
    code: { ru: 'TB456', kz: 'US456' },
    title: { ru: 'Современный стол', kz: 'Заманауи үстел' },
    size: { X: 120, Y: 75, Z: 80 },
    discountPercent: { ru: 0, kz: 0 },
    discountPrice: { ru: 0, kz: 0 },
    mainImage: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
    additionalImages: [
      'https://images.unsplash.com/photo-1581428982868-e410dd047a90',
      'https://images.unsplash.com/photo-1604061986761-d9d0cc41b0d1'
    ]
  },
  {
    id: '3',
    name: { ru: 'Диван', kz: 'Диван' },
    price: { ru: 8000, kz: 8500 },
    description: { ru: 'Мягкий диван', kz: 'Жұмсақ диван' },
    material: { ru: 'Ткань', kz: 'Мата' },
    code: { ru: 'SF789', kz: 'DV789' },
    title: { ru: 'Элегантный диван', kz: 'Элегантты диван' },
    size: { X: 200, Y: 85, Z: 90 },
    discountPercent: { ru: 15, kz: 15 },
    discountPrice: { ru: 6800, kz: 7225 },
    mainImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
    additionalImages: [
      'https://images.unsplash.com/photo-1550254478-ead40cc54513',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25'
    ]
  },
  {
    id: '4',
    name: { ru: 'Кровать', kz: 'Төсек' },
    price: { ru: 12000, kz: 12500 },
    description: { ru: 'Двуспальная кровать', kz: 'Екі адамдық төсек' },
    material: { ru: 'Дерево', kz: 'Ағаш' },
    code: { ru: 'BD101', kz: 'TS101' },
    title: { ru: 'Комфортная кровать', kz: 'Жайлы төсек' },
    size: { X: 160, Y: 200, Z: 90 },
    discountPercent: { ru: 0, kz: 0 },
    discountPrice: { ru: 0, kz: 0 },
    mainImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    additionalImages: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c'
    ]
  }
];

const initialAdmins = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    id: '3',
    username: 'supervisor',
    email: 'supervisor@example.com',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
  },
  {
    id: '4',
    username: 'moderator',
    email: 'moderator@example.com',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12'
  }
];

// Get data from localStorage or use initial data
const mockProducts = getLocalStorage('mockProducts', initialProducts);
const mockAdmins = getLocalStorage('mockAdmins', initialAdmins);

// Helper function to convert File/Blob to base64
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to process form data with images
const processFormData = async (formData) => {
  const processedData = { ...formData };

  // Convert File objects to base64
  if (formData.mainImage instanceof File) {
    processedData.mainImage = await fileToBase64(formData.mainImage);
  }

  if (formData.additionalImages) {
    const processedImages = await Promise.all(
      formData.additionalImages.map(async (image) => {
        if (image instanceof File) {
          return await fileToBase64(image);
        }
        return image;
      })
    );
    processedData.additionalImages = processedImages;
  }

  if (formData.image instanceof File) {
    processedData.image = await fileToBase64(formData.image);
  }

  return processedData;
};

// Mock API handlers
export const mockApiHandlers = {
  // Products
  getProducts: () => {
    return Promise.resolve([...mockProducts]);
  },
  
  getProduct: (id) => {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      return Promise.resolve({...product});
    }
    return Promise.reject({ status: 404, data: { message: 'Product not found' } });
  },
  
  addProduct: async (product) => {
    const processedProduct = await processFormData(product);
    const newProduct = {
      ...processedProduct,
      id: String(mockProducts.length + 1)
    };
    mockProducts.push(newProduct);
    setLocalStorage('mockProducts', mockProducts);
    return Promise.resolve(newProduct);
  },
  
  updateProduct: async ({ id, ...product }) => {
    const processedProduct = await processFormData(product);
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...processedProduct, id };
      setLocalStorage('mockProducts', mockProducts);
      return Promise.resolve(mockProducts[index]);
    }
    return Promise.reject({ status: 404, data: { message: 'Product not found' } });
  },
  
  deleteProduct: (id) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = mockProducts.splice(index, 1)[0];
      setLocalStorage('mockProducts', mockProducts);
      return Promise.resolve(deleted);
    }
    return Promise.reject({ status: 404, data: { message: 'Product not found' } });
  },
  
  // Admins
  getAdmins: () => {
    return Promise.resolve([...mockAdmins]);
  },
  
  getAdmin: (id) => {
    const admin = mockAdmins.find(a => a.id === id);
    if (admin) {
      return Promise.resolve({...admin});
    }
    return Promise.reject({ status: 404, data: { message: 'Admin not found' } });
  },
  
  addAdmin: async (admin) => {
    const processedAdmin = await processFormData(admin);
    const newAdmin = {
      ...processedAdmin,
      id: String(mockAdmins.length + 1)
    };
    mockAdmins.push(newAdmin);
    setLocalStorage('mockAdmins', mockAdmins);
    return Promise.resolve(newAdmin);
  },
  
  updateAdmin: async ({ id, ...admin }) => {
    const processedAdmin = await processFormData(admin);
    const index = mockAdmins.findIndex(a => a.id === id);
    if (index !== -1) {
      mockAdmins[index] = { ...mockAdmins[index], ...processedAdmin, id };
      setLocalStorage('mockAdmins', mockAdmins);
      return Promise.resolve(mockAdmins[index]);
    }
    return Promise.reject({ status: 404, data: { message: 'Admin not found' } });
  },
  
  deleteAdmin: (id) => {
    const index = mockAdmins.findIndex(a => a.id === id);
    if (index !== -1) {
      const deleted = mockAdmins.splice(index, 1)[0];
      setLocalStorage('mockAdmins', mockAdmins);
      return Promise.resolve(deleted);
    }
    return Promise.reject({ status: 404, data: { message: 'Admin not found' } });
  },
  
  // Auth
  login: (credentials) => {
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return Promise.resolve({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.mMSYCImSU1lis_Fwz0tQH4YjbXcg-H3Mq3wXJPg8jZ4"
      });
    }
    return Promise.reject({ status: 401, data: { message: 'Invalid credentials' } });
  },
  
  logout: () => {
    return Promise.resolve({ success: true });
  }
};

// Mock API middleware for RTK Query
export const mockApiMiddleware = (endpoint, { body, method, url }) => {
  // Extract ID from URL if present
  const idMatch = url?.match(/\/([^/]+)$/);
  const id = idMatch ? idMatch[1] : null;
  
  // Handle different endpoints
  switch (endpoint) {
    // Products
    case 'getProducts':
      return mockApiHandlers.getProducts();
      
    case 'getProduct':
      return mockApiHandlers.getProduct(id);
      
    case 'addProduct':
      return mockApiHandlers.addProduct(body);
      
    case 'updateProduct':
      return mockApiHandlers.updateProduct({ id, ...body });
      
    case 'deleteProduct':
      return mockApiHandlers.deleteProduct(id);
    
    // Admins
    case 'getAdmins':
      return mockApiHandlers.getAdmins();
      
    case 'getAdmin':
      return mockApiHandlers.getAdmin(id);
      
    case 'addAdmin':
      return mockApiHandlers.addAdmin(body);
      
    case 'updateAdmin':
      return mockApiHandlers.updateAdmin({ id, ...body });
      
    case 'deleteAdmin':
      return mockApiHandlers.deleteAdmin(id);
    
    // Auth
    case 'login':
      return mockApiHandlers.login(body);
      
    case 'logout':
      return mockApiHandlers.logout();
      
    default:
      return Promise.reject({ status: 404, data: { message: 'Endpoint not found' } });
  }
};