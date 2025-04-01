import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import ProductModal from '../components/products/ProductModal';
import ProductTable from '../components/products/ProductTable';
import ProductDetail from '../components/products/ProductDetail';
import { useTranslation } from 'react-i18next';
import { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from '../api/productsApi';

function Products() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: { ru: '', kz: '' },
    price: { ru: 0, kz: 0 },
    description: { ru: '', kz: '' },
    material: { ru: '', kz: '' },
    code: { ru: '', kz: '' },
    title: { ru: '', kz: '' },
    size: { X: 0, Y: 0, Z: 0 },
    discountPercent: { ru: 0, kz: 0 },
    discountPrice: { ru: 0, kz: 0 },
    mainImage: null,
    additionalImages: []
  });

  // RTK Query hooks
  const { data: products = [], isLoading: isLoadingProducts, error: productsError } = useGetProductsQuery();
  const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProductMutation();

  const isLoading = isAddingProduct || isUpdatingProduct;

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setViewingProduct(product);
    setIsDetailOpen(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(t('products.confirmDelete'))) {
      try {
        await deleteProduct(product.id).unwrap();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct({ 
          id: editingProduct.id, 
          ...formData 
        }).unwrap();
      } else {
        // Add new product
        await addProduct(formData).unwrap();
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({
        name: { ru: '', kz: '' },
        price: { ru: 0, kz: 0 },
        description: { ru: '', kz: '' },
        material: { ru: '', kz: '' },
        code: { ru: '', kz: '' },
        title: { ru: '', kz: '' },
        size: { X: 0, Y: 0, Z: 0 },
        discountPercent: { ru: 0, kz: 0 },
        discountPrice: { ru: 0, kz: 0 },
        mainImage: null,
        additionalImages: []
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {productsError.data?.message || 'Failed to load products.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('products.title')}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: { ru: '', kz: '' },
              price: { ru: 0, kz: 0 },
              description: { ru: '', kz: '' },
              material: { ru: '', kz: '' },
              code: { ru: '', kz: '' },
              title: { ru: '', kz: '' },
              size: { X: 0, Y: 0, Z: 0 },
              discountPercent: { ru: 0, kz: 0 },
              discountPrice: { ru: 0, kz: 0 },
              mainImage: null,
              additionalImages: []
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          {t('products.addProduct')}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <ProductTable 
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </motion.div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData({
            name: { ru: '', kz: '' },
            price: { ru: 0, kz: 0 },
            description: { ru: '', kz: '' },
            material: { ru: '', kz: '' },
            code: { ru: '', kz: '' },
            title: { ru: '', kz: '' },
            size: { X: 0, Y: 0, Z: 0 },
            discountPercent: { ru: 0, kz: 0 },
            discountPrice: { ru: 0, kz: 0 },
            mainImage: null,
            additionalImages: []
          });
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditing={!!editingProduct}
      />

      <ProductDetail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
      />
    </div>
  );
}

export default Products;