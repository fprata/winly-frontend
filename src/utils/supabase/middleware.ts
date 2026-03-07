import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { BYPASS_AUTH } from '@/utils/dev-auth'

export async function updateSession(request: NextRequest, response?: NextResponse) {
  // Skip all auth logic in dev bypass mode
  if (BYPASS_AUTH) return response || NextResponse.next({ request: { headers: request.headers } });

  // Use the response passed from next-intl, or create a new one
  let supabaseResponse = response || NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          // Do NOT create a new response here, use the existing one to preserve next-intl rewrites
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get pathname without locale prefix for route checking
  // Supports /en/path, /pt/path, or /path
  const pathname = request.nextUrl.pathname
  const pathnameWithoutLocale = pathname.replace(/^\/(en|pt)(\/|$)/, '/')

  const isAuthPage = pathnameWithoutLocale.startsWith('/login') || pathnameWithoutLocale.startsWith('/auth')
  const isOnboardingPage = pathnameWithoutLocale.startsWith('/onboarding')
  const isDashboardPage = pathnameWithoutLocale.startsWith('/dashboard')
  const isLandingPage = pathnameWithoutLocale === '/' || pathname === '/en' || pathname === '/pt'
  const isPersonasPage = pathnameWithoutLocale.startsWith('/personas')

  // Extract locale from pathname to preserve it in redirects
  const localeMatch = pathname.match(/^\/(en|pt)/)
  const localePrefix = localeMatch ? localeMatch[0] : ''

  // 1. Unauthenticated users:
  if (!user) {
    if (!isAuthPage && !isLandingPage && !isPersonasPage) {
       const url = request.nextUrl.clone()
       url.pathname = `${localePrefix}/login`
       return NextResponse.redirect(url)
    }
    // Allow access to landing page, personas page, and auth pages
    return supabaseResponse
  }

  // 2. Authenticated users:
  if (user) {
    if (isAuthPage) {
        const url = request.nextUrl.clone()
        url.pathname = `${localePrefix}/dashboard`
        return NextResponse.redirect(url)
    }

    // Check if user has completed onboarding
    const { data: profile, error } = await supabase
      .from('clients')
      .select('id')
      .eq('email', user.email)
      .maybeSingle()

    if (!profile && !error && !isOnboardingPage) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/onboarding`
      return NextResponse.redirect(url)
    }

    if (profile && isOnboardingPage) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}