import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function ImageInput({ label, onChange, value }) {
  const [preview, setPreview] = useState(value || null);
  const { t } = useTranslation();

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a blob URL for preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(previewUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-input"
        />
        <label
          htmlFor="image-input"
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200"
        >
          {t('forms.uploadImage')}
        </label>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ImageInput;