/**
 * Centralised tier configuration — single source of truth for feature access.
 *
 * To change which features are available per tier, edit the FEATURE_ACCESS map below.
 * Every tier check across the app (pages, API routes, components) reads from here.
 */

// ---------------------------------------------------------------------------
// Tier classification
// ---------------------------------------------------------------------------

const ENTERPRISE_TIERS = new Set(['Enterprise', 'Professional']);
const PRO_TIERS = new Set(['Pro', 'Starter']);
const ALL_PAID_TIERS = new Set([...ENTERPRISE_TIERS, ...PRO_TIERS]);

export type TierName = 'free' | 'Pro' | 'Enterprise';

/** Normalise any raw DB tier value to one of the three canonical tiers. */
export function normaliseTier(raw: string | null | undefined): TierName {
  if (!raw) return 'free';
  if (ENTERPRISE_TIERS.has(raw)) return 'Enterprise';
  if (PRO_TIERS.has(raw)) return 'Pro';
  return 'free';
}

export function isPaid(tier: string | null | undefined): boolean {
  return ALL_PAID_TIERS.has(tier || '');
}

export function isEnterprise(tier: string | null | undefined): boolean {
  return ENTERPRISE_TIERS.has(tier || '');
}

export function isPro(tier: string | null | undefined): boolean {
  return ALL_PAID_TIERS.has(tier || '');
}

// ---------------------------------------------------------------------------
// Feature access matrix
// ---------------------------------------------------------------------------

export type Feature =
  | 'unlimitedMatches'
  | 'aiAnalysis'
  | 'aiChat'
  | 'pdfExport'
  | 'excelExport'
  | 'buyerIntel'
  | 'competitorIntel'
  | 'marketOverview';

/**
 * The minimum tier required for each feature.
 *  - 'free'       → available to everyone
 *  - 'Pro'        → requires Pro or Enterprise
 *  - 'Enterprise' → requires Enterprise only
 */
const FEATURE_MIN_TIER: Record<Feature, TierName> = {
  unlimitedMatches: 'Pro',
  aiAnalysis:       'Pro',       // Pro gets 5/mo, Enterprise unlimited
  aiChat:           'Enterprise',
  pdfExport:        'Enterprise',
  excelExport:      'Enterprise',
  buyerIntel:       'Pro',
  competitorIntel:  'Pro',
  marketOverview:   'Pro',
};

const TIER_RANK: Record<TierName, number> = { free: 0, Pro: 1, Enterprise: 2 };

/** Check whether a user's tier grants access to a feature. */
export function hasAccess(tier: string | null | undefined, feature: Feature): boolean {
  const normalised = normaliseTier(tier);
  const minTier = FEATURE_MIN_TIER[feature];
  return TIER_RANK[normalised] >= TIER_RANK[minTier];
}

/** Return the minimum tier needed for a given feature (for upgrade CTAs). */
export function requiredTier(feature: Feature): TierName {
  return FEATURE_MIN_TIER[feature];
}

/** Build the full feature-access map for a given tier. */
export function featureAccess(tier: string | null | undefined) {
  const n = normaliseTier(tier);
  return Object.fromEntries(
    (Object.keys(FEATURE_MIN_TIER) as Feature[]).map((f) => [f, TIER_RANK[n] >= TIER_RANK[FEATURE_MIN_TIER[f]]]),
  ) as Record<Feature, boolean>;
}
