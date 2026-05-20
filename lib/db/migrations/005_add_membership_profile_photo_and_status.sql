-- Add profile_photo_url and status columns to membership_requests table
ALTER TABLE membership_requests
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
