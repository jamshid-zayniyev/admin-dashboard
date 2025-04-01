import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const setToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('adminToken');
};

export const checkAuth = () => {
  const token = getToken();
  return isTokenValid(token);
};