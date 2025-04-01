import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './layouts/Dashboard';
import Home from './pages/Home';
import Products from './pages/Products';
import Admins from './pages/Admins';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { checkAuth, removeToken } from './utils/auth';
import { selectIsAuthenticated, setCredentials, clearCredentials } from './store/slices/authSlice';
import { getUserFromToken } from './api/authApi';
import './i18n';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const validateAuth = () => {
      const isValid = checkAuth();
      
      if (isValid) {
        const user = getUserFromToken();
        if (user) {
          dispatch(setCredentials(user));
        } else {
          dispatch(clearCredentials());
          removeToken();
        }
      } else {
        dispatch(clearCredentials());
        removeToken();
      }
      
      setIsAuthChecked(true);
    };

    validateAuth();
    
    // Set up interval to check token validity periodically
    const interval = setInterval(validateAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [dispatch]);

  // Show loading state while checking authentication
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={(value) => dispatch(setCredentials(value ? getUserFromToken() : null))} /> : <Navigate to="/" />} />
            
            <Route path="/" element={isAuthenticated ? <Dashboard setIsAuthenticated={(value) => !value && dispatch(clearCredentials())} /> : <Navigate to="/login" />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="admins" element={<Admins />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;