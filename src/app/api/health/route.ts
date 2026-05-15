import { NextResponse } from 'next/server';
import { env } from '@/config/env';

export const GET = () =>
  NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
  });
