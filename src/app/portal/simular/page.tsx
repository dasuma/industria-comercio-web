import Link from 'next/link';
import { PortalSimulator } from './PortalSimulator';

const currentYear = new Date().getFullYear();
const taxYear = currentYear - 1;

const SimularPage = () => (
  <div
    className="flex min-h-screen flex-col"
    style={{
      background:
        'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(30,71,153,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(15,41,82,0.1) 0%, transparent 60%), #f1f5f9'
    }}
  >
    {/* ── Header ── */}
    <header style={{ background: 'rgba(10,25,55,0.97)', backdropFilter: 'blur(12px)' }}>
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
        {/* Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>

        <div className="flex flex-col">
          <span className="text-sm leading-tight font-bold text-white">
            Alcaldía de Nemocon — Cundinamarca
          </span>
          <span className="text-[10px] font-medium tracking-widest text-blue-300 uppercase">
            Portal de Industria y Comercio
          </span>
        </div>

        {/* Back to portal */}
        <div className="ml-auto">
          <Link
            href="/portal"
            className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider text-blue-300 uppercase transition hover:text-white"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            ← Volver al portal
          </Link>
        </div>
      </div>
    </header>

    {/* ── Main ── */}
    <main className="flex flex-1 items-start justify-center p-6 lg:p-10">
      <div className="w-full max-w-3xl">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-800">Simulador de Liquidación ICA</h1>
          <p className="mt-1 text-sm text-slate-500">
            Estimá el valor del impuesto de Industria y Comercio para el año gravable {taxYear}.
          </p>
        </div>
        <PortalSimulator />
      </div>
    </main>

    {/* ── Footer ── */}
    <footer
      className="px-6 py-4 text-center text-xs"
      style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(10,25,55,0.97)' }}
    >
      © {currentYear} Alcaldía de Nemocon — Cundinamarca · Secretaría de Hacienda
    </footer>
  </div>
);

export default SimularPage;
