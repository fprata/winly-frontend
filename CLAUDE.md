# Winly Frontend — Project-Specific Guidelines

> General practices: see `../CLAUDE.md`
> Design system reference: see `DESIGN_SYSTEM.md`

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Supabase (auth + data), Stripe (payments)
- next-intl for i18n, React Query for server state
- Vitest + Testing Library (unit), Playwright (e2e)

## Route Structure (`src/app/`)
```
[locale]/
├── (dashboard)/    # Authenticated dashboard pages
├── (auth)/         # Login, signup, password reset
├── (onboarding)/   # User onboarding flow
├── personas/       # Persona selection
├── about/, terms/, privacy/, contact/  # Public pages
└── layout.tsx, page.tsx  # Root layout & landing
api/
├── analyze, chat, checkout, cron, export
├── health, lookup, notifications, webhooks
```

## Component Organization
- `src/components/ui/` — Design system primitives (Button, Card, Badge, Input, Select, Toast, etc.)
- `src/components/tender/` — Tender detail views (OverviewTab, InsightsTab, AwardTab, RiskScoreHero, TenderChatbot)
- `src/components/*.tsx` — Feature components (ExplorerClient, MatchesClient, BuyerIntelligenceClient, etc.)

## Key Conventions
- Use `slate-*` for all neutrals — never `gray-*`.
- Follow the design system label pattern: `text-[10px] font-black text-slate-400 uppercase tracking-widest`.
- Icons: Lucide React. Card headers use `size={18}`, section titles `size={20}`.
- Cards: `rounded-2xl` with `border-slate-200 shadow-sm`.
- Always use the `<Button>` component from `@/components/ui/Button` for actions.

## i18n
- Translation files in `messages/` (JSON).
- All user-facing strings must use `useTranslations()` from next-intl.
- Locale routing handled by `[locale]` segment + `src/i18n.ts`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

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

## Deployment
Hosted on Vercel. Config in `vercel.json`. CSP headers configured in `next.config.ts`.
