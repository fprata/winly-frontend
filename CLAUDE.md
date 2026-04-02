# Winly Frontend — Project-Specific Guidelines

> General practices: see `../CLAUDE.md`
> Design system reference: see `DESIGN_SYSTEM.md`

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Supabase (auth + data), Lemon Squeezy (payments)
- next-intl for i18n, React Query for server state
- Vitest + Testing Library (unit), Playwright (e2e)

## Route Structure (`src/app/`)
```
[locale]/
├── (dashboard)/    # Authenticated dashboard pages
├── (auth)/         # Login, signup, password reset
├── (onboarding)/   # User onboarding flow
├── personas/       # Persona selection
├── about/, terms/, privacy/, cookies/, contact/  # Public pages
├── pricing/        # Dedicated pricing page
├── compare/        # Competitor comparison pages (hermix/, tendery/)
├── blog/, blog/[slug]/  # Blog with dynamic OG images
└── layout.tsx, page.tsx  # Root layout & landing
api/
├── analyze, chat, checkout, contact, cron, export
├── health, lookup, notifications, webhooks
feed.xml/, feed-pt.xml/  # RSS feeds (EN + PT)
```

## Component Organization
- `src/components/ui/` — Design system primitives (Button, Card, Badge, Input, Select, Toast, etc.)
- `src/components/tender/` — Tender detail views (OverviewTab, InsightsTab, AwardTab, RiskScoreHero, TenderChatbot)
- `src/components/blog/` — Blog components (RelatedPosts, BlogCTA)
- `src/components/*.tsx` — Feature components (ExplorerClient, MatchesClient, BuyerIntelligenceClient, CookieConsent, etc.)
- `src/providers/` — Context providers (QueryProvider, PostHogProvider)

## Key Conventions
- Use `zinc-*` for all neutrals — never `slate-*` or `gray-*`.
- Follow the design system label pattern: `text-[10px] font-black text-zinc-400 uppercase tracking-widest`.
- Icons: Lucide React. Card headers use `size={18}`, section titles `size={20}`.
- Cards: `rounded-xl` with `border-zinc-200 shadow-sm`.
- Always use the `<Button>` component from `@/components/ui/Button` for actions.

## i18n
- Translation files in `messages/` (JSON).
- All user-facing strings must use `useTranslations()` from next-intl.
- Locale routing handled by `[locale]` segment + `src/i18n.ts`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `LEMONSQUEEZY_API_KEY` / `LEMONSQUEEZY_STORE_ID` / `LEMONSQUEEZY_WEBHOOK_SECRET`

## Testing (TDD)

**Mandatory**: Write failing tests before implementing functional code. No feature is complete until the full test suite passes.

```bash
npm run test      # Vitest (unit/component)
npm run test:e2e  # Playwright (end-to-end)
npm run test:ci   # Both
```

## Running
```bash
npm install
npm run dev       # Development server
npm run build     # Production build
```

## Analytics & Privacy
- **PostHog** for product analytics (pageviews, feature usage). Only initializes after cookie consent.
- **Cookie Consent Banner** (`CookieConsent.tsx`): Accept All / Essential Only. Stores preference in `localStorage` (`cookie-consent` key). PostHog listens for `cookie-consent-updated` custom event.
- **Vercel Analytics** + **Speed Insights** for performance monitoring.
- CSP headers in `next.config.ts` allow PostHog (US + EU), Vercel, LemonSqueezy, Supabase.

## SEO & GEO
- Structured data: Organization, SoftwareApplication, FAQPage, BlogPosting, BreadcrumbList schemas.
- Dynamic OG images per blog post (`blog/[slug]/opengraph-image.tsx`).
- RSS feeds: `/feed.xml` (EN), `/feed-pt.xml` (PT).
- `llms.txt` for Generative Engine Optimization.
- Sitemap auto-generated with proper lastmod dates and locale alternates.

## Public Pages (no auth required)
Middleware (`src/utils/supabase/middleware.ts`) allows unauthenticated access to:
`/blog`, `/about`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/pricing`, `/compare`

## Deployment
Hosted on Vercel. Config in `vercel.json`. CSP headers configured in `next.config.ts`.

## Environment Variables
Add to Vercel AND `.env.local`:
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog project token
- `NEXT_PUBLIC_POSTHOG_HOST` — `https://us.i.posthog.com` (or EU)
