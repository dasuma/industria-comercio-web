import Link from 'next/link';
import { Button } from '@dasuma/pradma-ui';
import { getDictionary } from '@/i18n/getDictionary';

const NotFoundPage = async () => {
  const dict = await getDictionary();

  return (
    <main className="bg-bg-weak-25 flex min-h-screen items-center justify-center p-6">
      <section className="bg-bg-white-0 ring-stroke-soft-200 w-full max-w-md space-y-5 rounded-2xl p-8 text-center ring-1">
        <div className="space-y-2">
          <h1 className="text-title-h5 text-text-strong-950">{dict.notFound.title}</h1>
          <p className="text-paragraph-sm text-text-sub-600">{dict.notFound.description}</p>
        </div>
        {/* [P2] asChild: el link real hereda el estilo del botón */}
        <Button.Root variant="basic" size="medium" asChild>
          <Link href="/">{dict.common.goHome}</Link>
        </Button.Root>
      </section>
    </main>
  );
};

export default NotFoundPage;
