import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/config/routes';

const RetentionPage = () => {
  redirect(APP_ROUTES.retentionContracts);
};

export default RetentionPage;
