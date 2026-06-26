import { getActiveLocale } from '@/i18n/getDictionary';
import { EstablishmentDetail } from '@modules/pradma';

interface Props {
  params: Promise<{ id: string }>;
}

const EstablishmentDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const locale = await getActiveLocale();
  const establishmentId = id === 'new' ? null : Number(id);

  return <EstablishmentDetail locale={locale} establishmentId={establishmentId} />;
};

export default EstablishmentDetailPage;
