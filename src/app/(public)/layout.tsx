import type { ReactNode } from 'react';

// Login es pre-auth: forzamos dark scope localmente (sin tocar next-themes)
// para que la pantalla siempre se vea en oscuro independientemente de la
// preferencia guardada. Una vez dentro de (app), next-themes aplica la
// preferencia persistida por el usuario en localStorage.
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <main
    className="dark bg-bg-white-0 text-text-strong-950 relative flex min-h-screen items-center justify-center overflow-hidden p-6"
    style={{ colorScheme: 'dark' }}
  >
    {/* Glow radial blanco desde el centro — vive detrás del modal */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 30%, transparent 60%)'
      }}
    />
    <div className="relative z-10 flex w-full items-center justify-center">{children}</div>
  </main>
);

export default PublicLayout;
