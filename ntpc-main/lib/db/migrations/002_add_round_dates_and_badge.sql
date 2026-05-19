-- Add date range fields to ey_rounds table
ALTER TABLE ey_rounds
ADD COLUMN from_date TEXT,
ADD COLUMN to_date TEXT;

-- Make coordinatorId optional in ey_participants table
ALTER TABLE ey_participants
ALTER COLUMN coordinator_id DROP NOT NULL;

-- Add badge_generated tracking to ey_participants table
ALTER TABLE ey_participants
ADD COLUMN badge_generated BOOLEAN DEFAULT false NOT NULL;

-- Create index for better query performance on frequently searched fields
CREATE INDEX idx_ey_participants_fayda_id ON ey_participants(fayda_id);
CREATE INDEX idx_ey_participants_event_id ON ey_participants(event_id);
CREATE INDEX idx_ey_participants_round_id ON ey_participants(round_id);
CREATE INDEX idx_ey_rounds_event_id ON ey_rounds(event_id);
