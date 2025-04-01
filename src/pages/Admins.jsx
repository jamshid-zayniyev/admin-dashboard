import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import AdminModal from '../components/admins/AdminModal';
import AdminTable from '../components/admins/AdminTable';
import { useTranslation } from 'react-i18next';
import { 
  useGetAdminsQuery, 
  useAddAdminMutation, 
  useUpdateAdminMutation, 
  useDeleteAdminMutation 
} from '../api/adminsApi';

function Admins() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    image: null
  });

  // RTK Query hooks
  const { data: admins = [], isLoading: isLoadingAdmins, error: adminsError } = useGetAdminsQuery();
  const [addAdmin, { isLoading: isAddingAdmin }] = useAddAdminMutation();
  const [updateAdmin, { isLoading: isUpdatingAdmin }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeletingAdmin }] = useDeleteAdminMutation();

  const isLoading = isAddingAdmin || isUpdatingAdmin;

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ ...admin, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (admin) => {
    if (window.confirm(t('admins.confirmDelete'))) {
      try {
        await deleteAdmin(admin.id).unwrap();
      } catch (error) {
        console.error('Failed to delete admin:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingAdmin) {
        // Update existing admin
        await updateAdmin({ 
          id: editingAdmin.id, 
          ...formData 
        }).unwrap();
      } else {
        // Add new admin
        await addAdmin(formData).unwrap();
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setEditingAdmin(null);
      setFormData({
        username: '',
        password: '',
        image: null
      });
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  if (isLoadingAdmins) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (adminsError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {adminsError.data?.message || 'Failed to load admins.'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('admins.title')}
        </h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingAdmin(null);
            setFormData({
              username: '',
              password: '',
              image: null
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          {t('admins.addAdmin')}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <AdminTable 
          admins={admins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </motion.div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
          setFormData({
            username: '',
            password: '',
            image: null
          });
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isEditing={!!editingAdmin}
      />
    </div>
  );
}

export default Admins;