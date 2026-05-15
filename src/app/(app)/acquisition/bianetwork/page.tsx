import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/config/routes';

const BiaNetworkRootPage = () => {
  redirect(APP_ROUTES.users);
};

export default BiaNetworkRootPage;
