import type { ReactNode } from 'react';

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <main
    className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
    style={{
      background: 'linear-gradient(145deg, #060d1c 0%, #091828 45%, #0d2140 100%)'
    }}
  >
    {/* ── Decorative background layers ── */}
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Blue radial glow — top left */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '55%',
          height: '65%',
          background:
            'radial-gradient(ellipse at center, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0.03) 50%, transparent 70%)'
        }}
      />

      {/* Deep navy glow — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-25%',
          right: '-15%',
          width: '60%',
          height: '70%',
          background:
            'radial-gradient(ellipse at center, rgba(15,52,110,0.55) 0%, rgba(10,30,70,0.2) 55%, transparent 75%)'
        }}
      />

      {/* Center soft glow — behind the card */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(180,210,255,0.03) 0%, transparent 65%)'
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 100%)'
        }}
      />
    </div>

    <div className="relative z-10 flex w-full items-center justify-center">{children}</div>
  </main>
);

export default PublicLayout;
