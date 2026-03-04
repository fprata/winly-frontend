# Winly Design System

Standard reference for all UI components. Follow these patterns when building new features or modifying existing ones.

---

## Color Palette

### Neutrals — Slate (NOT gray)

All neutral colors use `slate`. Never use `gray-*` classes in the dashboard.

| Token | Usage |
|-------|-------|
| `slate-900` | Primary text, dark backgrounds, buttons |
| `slate-800` | Secondary text on light bg |
| `slate-700` | Body text |
| `slate-500` | Muted text |
| `slate-400` | Labels, placeholders, secondary labels |
| `slate-200` | Borders |
| `slate-100` | Subtle borders, dividers |
| `slate-50` | Secondary backgrounds, hover fills |

### Semantic Colors

| Role | Color | Usage |
|------|-------|-------|
| Primary | `blue-600` | Links, primary highlights, active states |
| Success | `emerald-600` | Positive indicators, in-range badges |
| Warning | `amber-600` | Caution, medium risk, award-related |
| Danger | `rose-600` | High risk, errors, incumbent alerts |
| Info | `indigo-600` | Secondary highlights |
| Accent | `purple-600` | Sector data, CPV, tertiary highlights |
| Teal | `teal-600` | Brand accent (marketing pages, CTA buttons) |

### Background Tokens

| Element | Class |
|---------|-------|
| Page background | `bg-[#fafbfc]` (dashboard), `bg-white` (marketing) |
| Primary card | `bg-white` |
| Secondary fill | `bg-slate-50` |
| Dark card | `bg-slate-900 text-white` |
| Semantic fills | `bg-{color}-50` with `border-{color}-200` |

---

## Typography

### Fonts

- **Body**: DM Sans (400, 500, 600, 700) — applied via `font-sans`
- **Display**: Plus Jakarta Sans (500, 600, 700, 800) — applied via `font-display`

### Scale

| Token | Size | Usage |
|-------|------|-------|
| `text-4xl` | 36px | Page hero titles |
| `text-3xl` | 30px | Page titles, large numbers |
| `text-2xl` | 24px | Section titles, stat values |
| `text-xl` | 20px | Card titles |
| `text-lg` | 18px | Section headings |
| `text-sm` | 14px | Body text, form fields |
| `text-xs` | 12px | Captions, small body |
| `text-[10px]` | 10px | **Standard micro-label** — all uppercase labels |
| `text-[9px]` | 9px | **Sub-labels only** — badges, footnotes, risk badges |

> **Rule**: Do NOT use `text-[11px]`, `text-[8px]`, or `text-[13px]`. Use `text-xs` (12px) or `text-[10px]` (10px) instead.

### Weight Patterns

| Weight | Usage |
|--------|-------|
| `font-black` | Uppercase micro-labels, badges, stat values |
| `font-bold` | Headings, link text, strong body |
| `font-medium` | Body text, descriptions |

### Label Pattern (the most common element)

```
text-[10px] font-black text-slate-400 uppercase tracking-widest
```

Use this exact combination for all section labels, metadata headers, and stat captions.

---

## Spacing

### Card Padding

| Level | Class | Usage |
|-------|-------|-------|
| Primary | `p-8` | Top-level cards, main sections |
| Secondary | `p-6` | Nested cards, sidebar cards |
| Compact | `p-4`–`p-5` | List items, inner elements |

> **Rule**: Do NOT use `p-10` or `p-12` on cards. Use `p-8` maximum.

### Gap Scale

| Token | Usage |
|-------|-------|
| `gap-2` | Tight groupings (icon + text, badges) |
| `gap-3` | Standard element spacing |
| `gap-4` | Comfortable section spacing |
| `gap-6` | Card grid gaps |
| `gap-8` | Major section gaps |

### Section Spacing

- Between major sections: `space-y-8`
- Between cards in a grid: `gap-6` or `gap-8`
- Inside cards between groups: `space-y-6` or `mb-6`

---

## Border Radius

| Token | Usage |
|-------|-------|
| `rounded-2xl` | **Primary cards** — all dashboard containers |
| `rounded-xl` | Inner cards, form elements, buttons, list items |
| `rounded-lg` | Inputs, small components, badges |
| `rounded-full` | Avatars, pills, progress bars |
| `rounded-3xl` | Marketing pages only (landing, about, pricing) |

> **Rule**: Do NOT use `rounded-[32px]`. Use `rounded-2xl` (16px) for dashboard cards.

---

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-sm` | Default card shadow |
| `shadow-md` | Hover state escalation |
| `shadow-lg` | Modals, dropdowns, tooltips |
| `shadow-xl` | Dark theme cards, hero sections |
| `shadow-2xl` | Chat panel, floating elements |

### Hover Pattern

```
shadow-sm hover:shadow-md transition-all
```

---

## Cards

### Primary Card

```html
<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
```

### Secondary Card (nested)

```html
<div class="bg-slate-50 rounded-xl border border-slate-100 p-6">
```

### Dark Card

```html
<div class="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
```

### Clickable Card

```html
<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6
            hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
```

---

## Buttons

Use the `<Button>` component from `@/components/ui/Button`. Variants:

| Variant | Usage |
|---------|-------|
| `primary` | Default actions (dark bg) |
| `secondary` | Secondary actions (white bg, border) |
| `accent` | CTAs, upgrade prompts (teal bg) |
| `danger` | Destructive actions |
| `ghost` | Tertiary, inline actions |

| Size | Class |
|------|-------|
| `sm` | Compact inline actions |
| `md` | Default |
| `lg` | Hero CTAs, prominent actions |

### Ad-hoc Button Pattern (when Button component isn't suitable)

```html
<button class="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest
               bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm">
```

---

## Icons (Lucide React)

### Size Scale

| Size | Usage |
|------|-------|
| `size={12}` | Inside badges, tiny indicators |
| `size={14}` | Inline with text, buttons, compact UI |
| `size={16}` | Navigation, back arrows, standard inline |
| `size={18}` | Card section headers |
| `size={20}` | Section titles, prominent headers |
| `size={24}` | Large section icons, feature cards |
| `size={28}`+ | Hero elements, sidebar icons |

> **Rule**: Card section headers always use `size={18}`. Section titles use `size={20}`.

---

## Badges

### Standard Badge

```html
<span class="text-[10px] font-black text-{color}-600 bg-{color}-50
             px-2 py-0.5 rounded uppercase border border-{color}-100">
```

### Risk Badge (color-coded)

```html
<span class="text-[9px] font-black text-white bg-{emerald|amber|rose}-500
             px-2 py-0.5 rounded-full">
```

---

## Forms

### Input

```html
<input class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl
              text-sm font-medium text-slate-800 placeholder:text-slate-400
              focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50
              transition-all" />
```

### Label

```html
<label class="block text-xs font-medium text-slate-500 mb-1.5">
```

---

## Z-Index Scale

| Value | Usage |
|-------|-------|
| `z-10` | Sticky table headers |
| `z-20` | Dropdown backdrop |
| `z-30` | Sticky header, dropdown menus |
| `z-40` | Sidebar overlay |
| `z-50` | Modals, chat panel, floating buttons |
| `z-[100]` | Toasts |

---

## Transitions

| Pattern | Usage |
|---------|-------|
| `transition-all duration-200` | Quick feedback (hover colors) |
| `transition-all duration-300` | Standard interactions (cards, panels) |
| `transition-transform` | Icon animations |
| `hover:-translate-y-px` | Subtle card lift |
| `active:scale-95` | Press feedback on buttons |

---

## Page Layout

### Dashboard Content

```html
<div class="max-w-6xl mx-auto pb-20 px-4">
```

### Two-Column Layout (main + sidebar)

```html
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div class="lg:col-span-8"><!-- Main --></div>
  <div class="lg:col-span-4"><!-- Sidebar --></div>
</div>
```

### Section Header

```html
<h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-6
           flex items-center gap-2">
  <Icon size={18} class="text-blue-600" />
  Section Title
</h3>
```
