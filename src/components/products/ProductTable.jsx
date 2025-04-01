import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiEye, HiSearch } from 'react-icons/hi';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

function ProductTable({ products, onEdit, onDelete, onView }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const lang = language === 'en' ? 'ru' : language === 'kk' ? 'kz' : 'ru'; // Map language to data keys
  
  // Filter state
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    material: '',
    priceMin: '',
    priceMax: '',
  });
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };
  
  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Filter by name
    if (filters.name && !product.name?.[lang]?.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    
    // Filter by code
    if (filters.code && !product.code?.[lang]?.toLowerCase().includes(filters.code.toLowerCase())) {
      return false;
    }
    
    // Filter by material
    if (filters.material && !product.material?.[lang]?.toLowerCase().includes(filters.material.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    const price = product.discountPrice?.[lang] || product.price?.[lang] || 0;
    if (filters.priceMin && price < parseFloat(filters.priceMin)) {
      return false;
    }
    if (filters.priceMax && price > parseFloat(filters.priceMax)) {
      return false;
    }
    
    return true;
  });

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 mb-4 rounded-t-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('products.name')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                placeholder={t('products.enterName')}
              />
              <HiSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('products.code')}
            </label>
            <input
              type="text"
              value={filters.code}
              onChange={(e) => handleFilterChange('code', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              placeholder={t('products.enterCode')}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('products.material')}
            </label>
            <input
              type="text"
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              placeholder={t('products.materials.wood')}
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('products.price')} (Min)
            </label>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              placeholder="0"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 mb-1">
              {t('products.price')} (Max)
            </label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              placeholder="1000"
            />
          </div>
        </div>
        
        <div className="mt-2 text-right">
          <button
            onClick={() => setFilters({
              name: '',
              code: '',
              material: '',
              priceMin: '',
              priceMax: '',
            })}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Results count */}
      <div className="px-6 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Code
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Material
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                      <img
                        src={product.mainImage || 'https://via.placeholder.com/150'}
                        alt={product.name?.[lang] || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {product.name?.[lang] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.code?.[lang] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.material?.[lang] || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.discountPrice?.[lang] ? (
                      <div>
                        <span className="line-through text-gray-400 mr-2">
                          ${product.price?.[lang] || 0}
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          ${product.discountPrice?.[lang] || 0}
                        </span>
                      </div>
                    ) : (
                      `$${product.price?.[lang] || 0}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {product.size ? `${product.size.X}×${product.size.Y}×${product.size.Z}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView(product)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <HiEye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
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
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No products found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTable;