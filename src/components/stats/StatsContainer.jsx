import { motion } from 'framer-motion';
import StatCard from './StatCard';
import Clock from './Clock';
import DateCard from './DateCard';
import { HiShoppingBag, HiUsers } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useGetProductsQuery } from '../../api/productsApi';
import { useGetAdminsQuery } from '../../api/adminsApi';

function StatsContainer() {
  const { t } = useTranslation();
  const { data: products = [] } = useGetProductsQuery();
  const { data: admins = [] } = useGetAdminsQuery();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatCard
        title={t('stats.totalProducts')}
        value={products.length.toString()}
        icon={HiShoppingBag}
        color="bg-blue-500"
      />
      <StatCard
        title={t('stats.totalAdmins')}
        value={admins.length.toString()}
        icon={HiUsers}
        color="bg-green-500"
      />
      <DateCard />
      <Clock />
    </motion.div>
  );
}

export default StatsContainer;