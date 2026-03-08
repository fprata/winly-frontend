-- Performance indexes for Winly intelligence search
-- Run this in the Supabase SQL editor or via `supabase db push`
--
-- These indexes fix three bottlenecks identified in load testing:
--   1. ILIKE full-table scans on intel_buyers.name and intel_competitors.name
--   2. JSONB sequential scan on tenders.winners_list for competitor won-tenders
--
-- 1. Enable the pg_trgm extension (required for gin_trgm_ops)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. GIN trigram index for ILIKE '%q%' on intel_buyers.name
--    Converts a full-table scan into a fast index lookup
CREATE INDEX IF NOT EXISTS idx_intel_buyers_name_trgm
  ON intel_buyers USING gin (name gin_trgm_ops);

-- 3. GIN trigram index for ILIKE '%q%' on intel_competitors.name
CREATE INDEX IF NOT EXISTS idx_intel_competitors_name_trgm
  ON intel_competitors USING gin (name gin_trgm_ops);

-- 4. GIN index for JSONB containment (@>) on tenders.winners_list
--    Required for queries like: winners_list @> '[{"competitor_id":"..."}]'
CREATE INDEX IF NOT EXISTS idx_tenders_winners_list_gin
  ON tenders USING gin (winners_list);
