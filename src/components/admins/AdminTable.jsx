import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiSearch } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

function AdminTable({ admins, onEdit, onDelete }) {
  const { t } = useTranslation();
  
  // Filter state
  const [usernameFilter, setUsernameFilter] = useState('');
  
  // Apply filters to admins
  const filteredAdmins = admins.filter(admin => {
    // Filter by username
    if (usernameFilter && !admin.username?.toLowerCase().includes(usernameFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 mb-4 rounded-t-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('admins.username')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                placeholder={t('admins.enterUsername')}
              />
              <HiSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setUsernameFilter('')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="px-6 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredAdmins.length} of {admins.length} admins
        </p>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avatar
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img
                        src={admin.image || 'https://via.placeholder.com/150'}
                        alt={admin.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {admin.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(admin)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(admin)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No admins found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;