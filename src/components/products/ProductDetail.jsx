import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

function ProductDetail({ isOpen, onClose, product }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(null);
  
  // Map language to data keys
  const lang = language === 'en' ? 'ru' : language === 'kk' ? 'kz' : 'ru';
  
  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {product.title?.[lang]} {product.name?.[lang]}
                </Dialog.Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div>
                    <div className="mb-4">
                      <img 
                        src={activeImage || product.mainImage || 'https://via.placeholder.com/400'} 
                        alt={product.name?.[lang]} 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {product.additionalImages && product.additionalImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        <div 
                          className={`cursor-pointer rounded-md overflow-hidden border-2 ${!activeImage ? 'border-primary-500' : 'border-transparent'}`}
                          onClick={() => setActiveImage(null)}
                        >
                          <img 
                            src={product.mainImage} 
                            alt="Main" 
                            className="w-full h-16 object-cover"
                          />
                        </div>
                        
                        {product.additionalImages.map((img, index) => (
                          <div 
                            key={index}
                            className={`cursor-pointer rounded-md overflow-hidden border-2 ${activeImage === img ? 'border-primary-500' : 'border-transparent'}`}
                            onClick={() => setActiveImage(img)}
                          >
                            <img 
                              src={img} 
                              alt={`Additional ${index}`} 
                              className="w-full h-16 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {t('products.code')}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {product.code?.[lang]}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {t('products.material')}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {product.material?.[lang]}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {t('products.price')}
                      </h3>
                      {product.discountPrice?.[lang] ? (
                        <div>
                          <span className="line-through text-gray-400 mr-2 text-lg">
                            ${product.price?.[lang]}
                          </span>
                          <span className="text-green-600 dark:text-green-400 text-2xl font-bold">
                            ${product.discountPrice?.[lang]}
                          </span>
                          <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                            {product.discountPercent?.[lang]}% OFF
                          </span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${product.price?.[lang]}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {t('products.size')}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {product.size ? `${product.size.X} × ${product.size.Y} × ${product.size.Z} cm` : 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {t('products.description')}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {product.description?.[lang]}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button
                    onClick={onClose}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                  >
                    {t('common.close')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ProductDetail;