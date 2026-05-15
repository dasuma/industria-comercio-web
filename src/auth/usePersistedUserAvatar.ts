'use client';

import { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'bia_user_photo_';

// Google a veces devuelve `photoURL` vacío en re-logins (token sin scope
// completo, image expirada en CDN) — guardar la foto en localStorage como
// dataURL nos garantiza tenerla aún cuando Firebase no la trae. La key
// incluye el uid para que cuentas distintas no se pisen.
const fetchAsDataURL = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    // Si Google devuelve un body que no es imagen (ej. una página de error
    // 404 con HTML) y lo guardamos como dataURL, el browser después pinta
    // el broken-image icon sobre nuestro Avatar. Filtrar por content-type
    // y por el mime del blob nos evita cachear basura.
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith('image/')) return null;
    return await new Promise<string | null>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

// Lee el cache de localStorage sincrónicamente. Lo usamos como lazy init de
// `useState` para que el primer render ya tenga la foto disponible (sin
// flash de iniciales) si el user ya pasó por acá antes.
const readCached = (uid: string | undefined | null): string | null => {
  if (!uid || typeof window === 'undefined') return null;
  return window.localStorage.getItem(`${STORAGE_PREFIX}${uid}`);
};

export const usePersistedUserAvatar = (
  uid: string | undefined | null,
  photoURL: string | null | undefined
): string | null => {
  const [resolved, setResolved] = useState<string | null>(
    () => readCached(uid) ?? photoURL ?? null
  );
  // Cuando cambia el `uid` (logout + login con otra cuenta) re-leemos el
  // cache de ese uid. Patrón canónico de "derived state from props":
  // setState durante render — React lo descarta y re-renderea con el
  // nuevo state sin agendar un commit extra (más limpio que un effect).
  const [trackedUid, setTrackedUid] = useState(uid);
  if (trackedUid !== uid) {
    setTrackedUid(uid);
    setResolved(readCached(uid) ?? photoURL ?? null);
  }

  useEffect(() => {
    if (!uid || !photoURL) return;
    let cancelled = false;
    void fetchAsDataURL(photoURL).then(dataUrl => {
      if (cancelled || !dataUrl) return;
      try {
        window.localStorage.setItem(`${STORAGE_PREFIX}${uid}`, dataUrl);
      } catch {
        // Quota lleno o storage deshabilitado — silencioso, seguimos con la URL.
      }
      setResolved(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [uid, photoURL]);

  return resolved;
};
