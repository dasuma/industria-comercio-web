import Link from 'next/link';
import { getPublicDiscountsByYear } from '@modules/pradma';
import { PortalLoginForm } from './PortalLoginForm';

const formatDate = (dateStr: string): string =>
  new Date(`${dateStr}T00:00:00`).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

const currentYear = new Date().getFullYear();
const taxYear = currentYear - 1;

const PortalPage = async () => {
  let discounts: Awaited<ReturnType<typeof getPublicDiscountsByYear>> = [];

  try {
    discounts = await getPublicDiscountsByYear(taxYear);
  } catch {
    // Si el backend no está disponible, se muestra la tabla vacía
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(30,71,153,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(15,41,82,0.1) 0%, transparent 60%), #f1f5f9'
      }}
    >
      {/* ── Header ── */}
      <header style={{ background: 'rgba(10,25,55,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
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

          {/* Right badge */}
          <div className="ml-auto">
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider text-blue-300 uppercase"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Año gravable {taxYear}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-1 flex-col items-center gap-4 p-6 lg:p-10">
        <div className="flex w-full max-w-5xl flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left — Login */}
          <div className="w-full shrink-0 lg:w-80">
            <PortalLoginForm />
          </div>

          {/* Right — ICA Discounts */}
          <div
            className="flex-1 overflow-hidden rounded-2xl"
            style={{
              background: '#ffffff',
              boxShadow:
                '0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 32px -4px rgba(0,0,0,0.10)'
            }}
          >
            {/* Panel header */}
            <div
              className="relative overflow-hidden px-7 py-6"
              style={{ background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)' }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-24 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold tracking-wide text-white uppercase">
                    Impuesto de Industria y Comercio (I.C.A)
                  </h2>
                </div>
                <p className="mt-2 text-xs text-blue-200">
                  Descuentos por pronto pago vigentes para el año gravable {taxYear}
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {discounts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-6 py-14">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-slate-400">
                    No hay descuentos disponibles para el año {taxYear}.
                  </p>
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: '#f8faff', borderBottom: '1px solid #e8eef8' }}>
                      <th className="px-6 py-3.5 text-left text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                        Beneficio tributario
                      </th>
                      <th className="px-6 py-3.5 text-left text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                        Detalle
                      </th>
                      <th className="px-6 py-3.5 text-left text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                        Fecha límite de pago
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((discount, i) => (
                      <tr
                        key={discount.id}
                        style={{
                          borderBottom: i < discounts.length - 1 ? '1px solid #f1f5f9' : 'none'
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          Descuento por pago oportuno
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                            style={{ background: '#eff6ff', color: '#1d4ed8' }}
                          >
                            {discount.percentage}% de descuento
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(discount.endDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer note */}
            <div
              className="px-6 py-4 text-xs text-slate-400"
              style={{ borderTop: '1px solid #f1f5f9' }}
            >
              Los descuentos aplican sobre el valor liquidado del impuesto ICA, previa presentación
              oportuna de la declaración.
            </div>
          </div>
        </div>

        {/* ── Simulator CTA ── */}
        <Link
          href="/portal/simular"
          className="flex w-full max-w-5xl items-center gap-4 overflow-hidden rounded-2xl transition-all hover:brightness-95 active:scale-[0.995]"
          style={{
            background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 4px 14px rgba(30,71,153,0.35)'
          }}
        >
          <div className="flex flex-1 items-center gap-4 px-6 py-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Simulador de Liquidación ICA</p>
              <p className="text-xs text-blue-300">
                Estimá el valor de tu impuesto antes de declarar — sin necesidad de ingresar
              </p>
            </div>
          </div>
          <div className="px-5 text-blue-300">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
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
};

export default PortalPage;
