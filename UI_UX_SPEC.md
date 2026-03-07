# Winly UI/UX Redesign — Specification & Status

> **Visual reference**: `design-preview-full.html` (approved HTML mockup in project root)
> **Design system guide**: `DESIGN_SYSTEM.md`

---

## Implementation Status

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Design tokens + globals.css | ✅ Done | Zinc palette, Inter font, semantic colors, utility classes |
| 2 | Inter font (replace DM Sans + Plus Jakarta Sans) | ✅ Done | `layout.tsx` updated |
| 3 | UI primitives (Button, Card, Badge, Input, Select, StatCard, PageHeader, EmptyState) | ✅ Done | All rewritten |
| 4 | Sidebar | ✅ Done | Blue-600 active state, zinc neutrals |
| 5 | DashboardHeader + DashboardLayoutClient | ✅ Done | Zinc borders, blue bell badge + FAB |
| 6 | My Matches page | ✅ Done | Score roundels, mini-bars, zinc palette |
| 7 | Explorer page | ✅ Done | Zinc palette, rounded-xl, blue hover border |
| 8 | Buyer Intelligence (search + detail) | ✅ Done | Color migration complete |
| 9 | Competitor Intelligence (search + detail) | ✅ Done | Color migration complete |
| 10 | Tender Detail page + sub-components | ✅ Done | All sub-components (OverviewTab, InsightsTab, AwardTab, RiskScoreHero, TenderDetailsTabs) |
| 11 | Dashboard overview page | ✅ Done | Color migration + StatCard color props fixed |
| 12 | Market Overview page | ✅ Done | StatCard color props fixed |
| 13 | Auth pages (login, signup, forgot-password, update-password) | ✅ Done | Logo added, max-w-md, emerald→green |
| 14 | Onboarding flow | ✅ Done | Already using Input/Button; layout correct |
| 15 | Personas page | ✅ Done | Standard card hover, zinc borders, blue values, bg-zinc-50 |
| 16 | Profile page | ✅ Done | data-label section headers, emerald→green, unused icons removed |
| 17 | Landing page (public) | ✅ Done | gray→zinc, rounded-xl, blue gradient, hover pattern |
| 18 | About / Terms / Privacy / Contact pages | ✅ Done | gray→zinc, rounded-xl, blue gradient, hover pattern |
| 19 | UserMenu component | ✅ Done | teal→blue avatar + hover |
| 20 | Navbar (public) | ✅ Done | sticky, bg-white border-zinc-200, blue CTA |
| 21 | Footer + DashboardFooter | ✅ Done | Footer light bg-white; DashboardFooter minimal py-3 px-6 |

---

## Implemented Design System

### Colors (globals.css)
All neutrals use the **zinc** scale (warmer than slate). Single primary blue.

```
--background: #fafafa          (zinc-50, page bg)
--foreground: #09090b          (zinc-950, primary text)
--color-primary: #2563eb       (blue-600, actions / active states)
--color-primary-hover: #1d4ed8 (blue-700)
--color-primary-bg: #eff6ff    (blue-50, selected chips / highlights)
```

Zinc neutrals: `zinc-50` through `zinc-950`

Semantic (status only, never decorative):
- `--color-success: #10b981` + `-text: #15803d` + `-bg: #ecfdf5`
- `--color-warning: #f59e0b` + `-text: #b45309` + `-bg: #fffbeb`
- `--color-danger: #dc2626` + `-bg: #fef2f2`
- `--color-indigo: #4338ca` + `-bg: #eef2ff`

Chart/accent colors: `--color-purple #8b5cf6`, `--color-teal #14b8a6`, `--color-sky #0ea5e9`, `--color-pink #ec4899`

### Typography
- **Font**: Inter (400/500/600/700/800), CSS variable `--font-inter`
- **Data labels**: `text-[10px] font-black text-zinc-400 uppercase tracking-widest` → via `.data-label` class
- **Headings**: `letter-spacing: -0.025em`

### Cards
```css
/* Standard */
bg-white rounded-xl border border-zinc-200 shadow-sm

/* Hover (interactive) */
hover:border-blue-500 hover:shadow-md hover:-translate-y-px transition-all duration-200
```

### Shadows
```
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

### Badge Colors (Badge component)
`blue | green | indigo | amber | rose | zinc | purple | teal | orange`
- Default neutral: `zinc`
- Old `slate` and `emerald` color props no longer exist

### StatCard Colors (StatCard component)
`blue | green | amber | indigo | zinc`
- Old `teal`, `navy` color props no longer exist — map to `blue` / `indigo`

### Score Roundels (Matches page)
SVG stroke-dasharray circles, 72×72px:
- `≥75%` → `text-blue-600`
- `≥50%` → `text-amber-500`
- `<50%` → `text-zinc-400`
- Track circle: `text-zinc-200`

Score mini-bars (CPV=violet, Strategic=sky, Semantic=teal, Keyword=emerald, Location=amber)

### Sidebar
- Active nav item: `bg-blue-600 text-white`
- Inactive: `text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900`
- Logo: blue-600 box with "W"
- Section labels: `text-[10px] font-black text-zinc-400 uppercase tracking-widest`
- Width: `w-60`

---

## Pending Tasks Detail

### Task 13 — Auth Pages
**Files**: `src/app/[locale]/(auth)/login/`, `forgot-password/`, `update-password/`

What to do:
- Full-width centered layout, white card `rounded-xl border-zinc-200 shadow-sm p-8 max-w-md`
- Logo at top (blue W box + "WinlyAI" text)
- Form fields use the `<Input>` component (enterprise-input style)
- Submit button uses `<Button variant="primary" size="lg" className="w-full">`
- Error messages in `bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600`
- Links in `text-blue-600 hover:text-blue-700 font-medium`
- Background: `bg-zinc-50`

### Task 14 — Onboarding Flow
**Files**: `src/app/[locale]/(onboarding)/`, `src/components/OnboardingForm.tsx`

What to do:
- Multi-step form with a step indicator at top (numbered pills: active=blue-600, done=green, pending=zinc-200)
- Each step is a white card centered, max-w-2xl
- Use `<Input>` and `<Select>` components throughout
- CPV selector (`CPVSelector.tsx`) needs to use zinc borders and blue selected state
- Progress bar: `h-1 bg-blue-600` filling across `bg-zinc-100`
- `<Button variant="primary">` for Next, `<Button variant="ghost">` for Back

### Task 15 — Personas Page
**Files**: `src/app/[locale]/personas/`, `src/components/PersonaCarousel.tsx`, `src/components/PersonaBadge.tsx`

What to do:
- Page uses the `enterprise-card-interactive` pattern for persona cards
- Selected persona: `border-blue-500 shadow-md` ring
- `PersonaBadge` component: update to use `enterprise-badge enterprise-badge-indigo` pattern
- `PersonaCarousel`: zinc border cards, blue active indicator

### Task 16 — Profile Page
**File**: `src/app/[locale]/(dashboard)/profile/page.tsx`, `src/components/ProfileForm.tsx`

What to do:
- Color migration done (via sed); verify visually
- Section headers: `text-[10px] font-black text-zinc-400 uppercase tracking-widest`
- Form uses `<Input>` and `<Select>` components
- Tier badge: use `<Badge color="blue">` for Professional, `<Badge color="indigo">` for Enterprise, `<Badge color="zinc">` for Free
- Save button: `<Button variant="primary">`

### Task 17 — Landing Page (Public)
**File**: `src/app/[locale]/page.tsx`

What to do:
- Hero section: white background, blue-600 CTAs, headline in `font-bold text-zinc-900 tracking-tight`
- Feature cards: `enterprise-card` pattern
- Pricing section: `enterprise-card` with blue-600 border for highlighted plan
- Use `<Navbar>` and `<Footer>` components (tasks 20/21)
- Remove any remaining `slate-*` color classes (currently 2 files: `page.tsx`, `about/page.tsx`)

### Task 18 — About / Terms / Privacy / Contact
**Files**: `src/app/[locale]/about/`, `terms/`, `privacy/`, `contact/`

What to do:
- Simple prose layout — white bg, zinc-700 body text, blue links
- Use `<Navbar>` and `<Footer>` (once updated in task 20/21)
- `about/page.tsx` still has 2 `slate-*` references — run sed

### Task 19 — UserMenu
**File**: `src/components/UserMenu.tsx`

What to do:
- Dropdown: white bg, `border-zinc-200 shadow-lg rounded-xl`
- Avatar initials circle: `bg-blue-600 text-white`
- Tier badge next to name: use zinc/blue Badge component
- Hover items: `hover:bg-zinc-50`
- Sign out option: `hover:bg-red-50 hover:text-red-600`

### Task 20 — Navbar (Public)
**File**: `src/components/Navbar.tsx`

What to do:
- `bg-white border-b border-zinc-200 sticky top-0 z-40`
- Logo: blue W box + WinlyAI text
- Nav links: `text-zinc-600 hover:text-zinc-900 font-medium text-sm`
- CTA button: `<Button variant="primary" size="sm">Get Started</Button>`
- Mobile hamburger: zinc-600 icon

### Task 21 — Footer + DashboardFooter
**Files**: `src/components/Footer.tsx`, `src/components/DashboardFooter.tsx`

What to do:
- `Footer`: `bg-white border-t border-zinc-200`, links in `text-zinc-500 hover:text-zinc-700 text-sm`
- `DashboardFooter`: minimal — `border-t border-zinc-100 py-3 px-6 text-xs text-zinc-400`

---

## Key Conventions (enforced)

- **Neutrals**: always `zinc-*`, never `slate-*` or `gray-*`
- **Cards**: `rounded-xl` (not `rounded-2xl`), `border-zinc-200 shadow-sm`
- **Hover state on interactive cards**: `hover:border-blue-500 hover:shadow-md hover:-translate-y-px`
- **Data labels**: `text-[10px] font-black text-zinc-400 uppercase tracking-widest`
- **Primary actions**: `<Button variant="primary">` — blue-600 background
- **Secondary actions**: `<Button variant="secondary">` — white bg, zinc border
- **Badge default neutral**: `color="zinc"` (not `color="slate"`)
- **Icons**: Lucide React — `size={16}` inline, `size={18}` card headers, `size={20}` section titles
- **Spacing**: `p-5` or `p-6` on cards (not `p-8` unless large detail panel)

---

## Files NOT to touch

- `design-preview-full.html` — approved visual reference, do not overwrite
- `src/components/DesignProposalPage.tsx` — old design demo, ignore
- `IMPLEMENTATION_PLAN.md` — separate technical debt tracker, unrelated to this redesign
