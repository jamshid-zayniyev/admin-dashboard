import { motion } from 'framer-motion';
import { HiCalendar } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

function DateCard() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const today = new Date();
  
  // Format date based on current language
  const formattedDate = today.toLocaleDateString(
    language === 'en' ? 'en-US' : 
    language === 'ru' ? 'ru-RU' : 'kk-KZ', 
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center">
        <div className="bg-orange-500 p-3 rounded-full">
          <HiCalendar className="w-6 h-6 text-white" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('stats.todaysDate')}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {formattedDate}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default DateCard;