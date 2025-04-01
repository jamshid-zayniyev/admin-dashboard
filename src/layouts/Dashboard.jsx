import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiShoppingBag, HiUsers, HiMenu, HiX, HiMoon, HiSun, HiLogout } from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../store/slices/authSlice';
import { useLogoutMutation } from '../api/authApi';
import LanguageSelector from '../components/language/LanguageSelector';
import { removeToken } from '../utils/auth';

function Dashboard({ setIsAuthenticated }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  
  // RTK Query hook for logout
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call the logout mutation
      await logout().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear credentials and token regardless of API response
      removeToken();
      dispatch(clearCredentials());
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/', icon: HiHome, label: t('dashboard.home') },
    { path: '/products', icon: HiShoppingBag, label: t('dashboard.products') },
    { path: '/admins', icon: HiUsers, label: t('dashboard.admins') },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? '16rem' : '0',
            opacity: isSidebarOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`bg-white dark:bg-gray-800 shadow-lg overflow-hidden flex-shrink-0`}
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">{t('dashboard.title')}</h1>
          </div>
          <nav className="mt-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    isActive ? 'bg-primary-50 dark:bg-primary-900 border-r-4 border-primary-500' : ''
                  }`
                }
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex flex-col overflow-hidden"
          animate={{ 
            marginLeft: isSidebarOpen ? '0' : '0',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200"
              >
                {isSidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-200"
                >
                  {darkMode ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
                </button>
                
                {/* User Avatar Dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-primary-600 transition-colors duration-200">
                      {currentUser?.username?.substring(0, 2).toUpperCase() || 'AU'}
                    </div>
                  </Menu.Button>
                  
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium">{currentUser?.username || 'Admin User'}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{currentUser?.email || 'admin@example.com'}</p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } group flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 disabled:opacity-50`}
                            >
                              {isLoggingOut ? (
                                <svg className="animate-spin h-5 w-5 mr-3 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <HiLogout className="w-5 h-5 mr-3" />
                              )}
                              {t('dashboard.logout')}
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;