export const SESSION_TOKEN_COOKIE = 'olibia_session';
export const SESSION_USER_ID_COOKIE = 'olibia_session_userId';
export const SESSION_EMAIL_COOKIE = 'olibia_session_email';

export const SESSION_ENDPOINT = '/api/auth/session';

export interface SessionPayload {
  idToken: string;
  userId: string;
  email: string;
}

// Crea/rota la sesión vía endpoint server-side. El token viaja por el body
// del POST y queda en una cookie httpOnly que el JS del cliente NO puede
// leer (esa es la razón de existir de este endpoint — js-cookie no puede
// setear httpOnly desde el browser).
export const createSession = async (payload: SessionPayload): Promise<void> => {
  const response = await fetch(SESSION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }
};

// Limpia la sesión vía endpoint server-side. Hace Set-Cookie con maxAge=0
// para que el browser borre las cookies httpOnly. Si el fetch falla (red
// caída, etc.) se traga el error: el caller igual seguirá con signOut() y
// el siguiente request al backend resolverá vía 401 → cleanup forzado.
export const destroySession = async (): Promise<void> => {
  try {
    await fetch(SESSION_ENDPOINT, {
      method: 'DELETE',
      credentials: 'same-origin'
    });
  } catch {
    // Silencioso a propósito — no queremos bloquear el logout por un fallo
    // de red. El próximo 401 del backend reintentará el cleanup.
  }
};
