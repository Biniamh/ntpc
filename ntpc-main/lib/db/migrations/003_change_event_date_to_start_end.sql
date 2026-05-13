-- Migration: Change ey_events.date to start_date and end_date
ALTER TABLE ey_events ADD COLUMN start_date TEXT NOT NULL DEFAULT '';
ALTER TABLE ey_events ADD COLUMN end_date TEXT NOT NULL DEFAULT '';
UPDATE ey_events SET start_date = date, end_date = date WHERE date IS NOT NULL;
ALTER TABLE ey_events DROP COLUMN date;