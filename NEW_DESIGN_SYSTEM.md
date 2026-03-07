# Winly Design System — Proposed Revamp

## Core Philosophy: "Enterprise Clarity"
The previous design system leaned heavily into soft, rounded shapes (`rounded-2xl`), uppercase micro-labels (`text-[10px] uppercase`), and varied semantic colors (teal, amber, emerald). This new proposal shifts to a more sophisticated, data-centric, and professional aesthetic optimized for a procurement intelligence platform.

**Key Changes:**
1. **Crisper Geometry:** Moving from `rounded-2xl` to `rounded-lg` or `rounded-xl`. Less bubbly, more structured.
2. **Sharper Neutrals:** Shifting from Slate to Zinc/Neutral for a cleaner, high-contrast monochrome base.
3. **Refined Typography:** Replacing shouty uppercase micro-labels with legible, mixed-case `text-xs font-medium`.
4. **Focused Accents:** Using a single, strong primary color (Electric Blue/Indigo) to guide the eye, reserving semantic colors (Red, Green, Yellow) strictly for status indicators.
5. **Flatter Surfaces:** Less reliance on deep shadows. Utilizing subtle borders and soft background fills to define hierarchy.

---

## 1. Color Palette

### Neutrals — Zinc
Zinc provides a modern, crisp grayscale that pairs perfectly with high-tech dashboards.
- `zinc-950` / `zinc-900`: Primary text, deep dark backgrounds, primary buttons.
- `zinc-700`: Secondary text, unselected tabs.
- `zinc-500`: Tertiary text, placeholders, metadata labels.
- `zinc-200`: Dividers, strong borders.
- `zinc-100`: Subtle borders, inactive states.
- `zinc-50`: App background, table headers, hover states.

### Semantic Colors
Used strictly for data meaning, not decoration.
- **Primary Action (Brand):** `blue-600` (Electric/Royal Blue) for primary links, active tabs, and key call-to-actions.
- **Success (Active/Awarded):** `emerald-600`
- **Warning (Expiring/Medium Risk):** `amber-500`
- **Danger (Expired/High Risk):** `red-500`

---

## 2. Typography

- **Font Family:** Inter or system-ui. Highly legible for numbers and data tables.
- **Data Labels:** `text-xs font-medium text-zinc-500` (Replaces `text-[10px] uppercase tracking-widest`).
- **Data Values:** `text-sm font-semibold text-zinc-900`.
- **Large Stats:** `text-3xl font-bold tracking-tight text-zinc-900`.
- **Card Titles:** `text-base font-semibold text-zinc-900`.

---

## 3. Cards & Surfaces

The bubbly `rounded-2xl` is replaced with crisp `rounded-xl`.

### Standard Card
```html
<div class="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
  <!-- Content -->
</div>
```

### Interactive/Hover Card (e.g., Tender List Item)
```html
<div class="bg-white rounded-xl border border-zinc-200 p-5 transition-all hover:border-blue-500 hover:shadow-md cursor-pointer group">
  <!-- Content -->
</div>
```

---

## 4. Components

### Badges
Softer backgrounds, clear text. No more tiny uppercase text.
```html
<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
  Active
</span>
```

### Buttons
Flatter, slightly more rectangular.
- **Primary:** `bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-800`
- **Secondary:** `bg-white text-zinc-900 border border-zinc-200 rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-50`

### Inputs
Crisp borders, subtle focus rings.
```html
<input class="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
```

---

## 5. Layout & Spacing
- Use an `8px` grid system.
- Standard gap between card elements: `gap-4` or `gap-6`.
- Tighter coupling between labels and their values (`gap-1` or `mb-1`).
