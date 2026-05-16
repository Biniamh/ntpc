-- Revert incorrect columns added by migration 004
ALTER TABLE scripture
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS content;