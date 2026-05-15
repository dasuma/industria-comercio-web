import Link from 'next/link';
import { getDictionary } from '@/i18n/getDictionary';

const NotFoundPage = async () => {
  const dict = await getDictionary();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-title-h5 text-text-strong-950">{dict.notFound.title}</h1>
        <p className="text-paragraph-sm text-text-sub-600">{dict.notFound.description}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-stroke-soft-200 px-4 py-2 text-label-sm text-text-strong-950 hover:bg-bg-weak-50"
        >
          {dict.common.goHome}
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
