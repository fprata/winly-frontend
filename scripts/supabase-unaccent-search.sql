-- Migration: Full-text search with accent insensitivity
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================================
-- 1. Enable extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Create a custom text search configuration that strips accents
-- ============================================================
-- Drop if exists to allow re-running
DROP TEXT SEARCH CONFIGURATION IF EXISTS public.portuguese_unaccent;
CREATE TEXT SEARCH CONFIGURATION public.portuguese_unaccent (COPY = pg_catalog.portuguese);
ALTER TEXT SEARCH CONFIGURATION public.portuguese_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;

DROP TEXT SEARCH CONFIGURATION IF EXISTS public.simple_unaccent;
CREATE TEXT SEARCH CONFIGURATION public.simple_unaccent (COPY = pg_catalog.simple);
ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;

-- ============================================================
-- 3. Add tsvector columns to tenders table
-- ============================================================
ALTER TABLE tenders ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate the search vector (Portuguese config with unaccent)
UPDATE tenders SET search_vector =
  setweight(to_tsvector('public.portuguese_unaccent', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('public.portuguese_unaccent', COALESCE(buyer_name, '')), 'B') ||
  setweight(to_tsvector('public.portuguese_unaccent', COALESCE(description, '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_tenders_search_vector ON tenders USING GIN (search_vector);

-- 4. Trigger to auto-update search_vector on insert/update
-- ============================================================
CREATE OR REPLACE FUNCTION tenders_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('public.portuguese_unaccent', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('public.portuguese_unaccent', COALESCE(NEW.buyer_name, '')), 'B') ||
    setweight(to_tsvector('public.portuguese_unaccent', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tenders_search_vector_trigger ON tenders;
CREATE TRIGGER tenders_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, buyer_name, description
  ON tenders
  FOR EACH ROW
  EXECUTE FUNCTION tenders_search_vector_update();

-- ============================================================
-- 5. Add tsvector column to intel_buyers
-- ============================================================
ALTER TABLE intel_buyers ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE intel_buyers SET search_vector =
  to_tsvector('public.simple_unaccent', COALESCE(name, ''));

CREATE INDEX IF NOT EXISTS idx_intel_buyers_search ON intel_buyers USING GIN (search_vector);

CREATE OR REPLACE FUNCTION intel_buyers_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('public.simple_unaccent', COALESCE(NEW.name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS intel_buyers_search_trigger ON intel_buyers;
CREATE TRIGGER intel_buyers_search_trigger
  BEFORE INSERT OR UPDATE OF name
  ON intel_buyers
  FOR EACH ROW
  EXECUTE FUNCTION intel_buyers_search_vector_update();

-- ============================================================
-- 6. Add tsvector column to intel_competitors
-- ============================================================
ALTER TABLE intel_competitors ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE intel_competitors SET search_vector =
  to_tsvector('public.simple_unaccent', COALESCE(name, ''));

CREATE INDEX IF NOT EXISTS idx_intel_competitors_search ON intel_competitors USING GIN (search_vector);

CREATE OR REPLACE FUNCTION intel_competitors_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('public.simple_unaccent', COALESCE(NEW.name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS intel_competitors_search_trigger ON intel_competitors;
CREATE TRIGGER intel_competitors_search_trigger
  BEFORE INSERT OR UPDATE OF name
  ON intel_competitors
  FOR EACH ROW
  EXECUTE FUNCTION intel_competitors_search_vector_update();
