import { NextResponse } from 'next/server';
import { getServerEnv } from '@/config/env';

// Sin esto Next intenta prerenderizar el handler en `next build`, y ahí las
// variables de entorno del App Service todavía no existen.
export const dynamic = 'force-dynamic';

export const GET = () =>
  NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: getServerEnv().APP_VERSION ?? 'dev'
  });
