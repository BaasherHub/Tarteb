-- Migration: Add employer_favorites table for shortlist feature
-- Run this migration in your Supabase SQL Editor or via CLI

-- Create the employer_favorites table
CREATE TABLE IF NOT EXISTS employer_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Ensure unique combination of employer and candidate
  UNIQUE(employer_id, candidate_id)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_employer_favorites_employer_id 
  ON employer_favorites(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_favorites_candidate_id 
  ON employer_favorites(candidate_id);

-- Enable Row Level Security
ALTER TABLE employer_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Employers can only see their own favorites
CREATE POLICY "Employers can view own favorites"
  ON employer_favorites FOR SELECT
  USING (auth.uid() = employer_id);

-- RLS Policy: Employers can insert their own favorites
CREATE POLICY "Employers can add favorites"
  ON employer_favorites FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- RLS Policy: Employers can delete their own favorites
CREATE POLICY "Employers can remove favorites"
  ON employer_favorites FOR DELETE
  USING (auth.uid() = employer_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON employer_favorites TO authenticated;
