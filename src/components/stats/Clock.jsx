import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiClock } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

function Clock() {
  const [time, setTime] = useState(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center">
        <div className="bg-purple-500 p-3 rounded-full">
          <HiClock className="w-6 h-6 text-white" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('stats.currentTime')}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {time.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Clock;