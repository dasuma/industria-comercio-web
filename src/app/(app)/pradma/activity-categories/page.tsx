import { getActiveLocale } from '@/i18n/getDictionary';
import { ActivityCategoryList } from '@modules/pradma';

const ActivityCategoriesPage = async () => {
  const locale = await getActiveLocale();

  return <ActivityCategoryList locale={locale} />;
};

export default ActivityCategoriesPage;
