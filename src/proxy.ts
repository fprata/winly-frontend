import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Explicitly skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Run the next-intl middleware
  const response = intlMiddleware(request);

  // 3. Run the Supabase middleware, passing the response from next-intl
  return await updateSession(request, response);
}

export const config = {
  // Broad matcher, but we handle the exclusion logic inside the middleware function for reliability
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
