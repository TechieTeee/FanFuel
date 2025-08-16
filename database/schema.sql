-- FanFuel Database Schema
-- Create tables for the core FanFuel functionality

-- Athletes table
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  university TEXT,
  position TEXT,
  year TEXT,
  background TEXT,
  total_earnings DECIMAL DEFAULT 0,
  fan_count INTEGER DEFAULT 0,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Commentary table for tracking mentions
CREATE TABLE IF NOT EXISTS commentary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  athlete_id UUID REFERENCES athletes(id),
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  intensity DECIMAL CHECK (intensity >= 0 AND intensity <= 1),
  virality_score DECIMAL CHECK (virality_score >= 0 AND virality_score <= 1),
  source TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fan reactions table
CREATE TABLE IF NOT EXISTS fan_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_address TEXT NOT NULL,
  athlete_id UUID REFERENCES athletes(id),
  commentary_id UUID REFERENCES commentary(id),
  reaction_type TEXT CHECK (reaction_type IN ('support', 'defend', 'cheer', 'boost')),
  amount DECIMAL NOT NULL,
  blockchain TEXT CHECK (blockchain IN ('chiliz', 'flow', 'ethereum')),
  transaction_hash TEXT,
  nft_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commentary reactions table (legacy, keeping for compatibility)
CREATE TABLE IF NOT EXISTS commentary_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athletes(id),
  reaction_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fans table
CREATE TABLE IF NOT EXISTS fans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT UNIQUE NOT NULL,
  email TEXT,
  total_spent DECIMAL DEFAULT 0,
  supported_athletes TEXT[], -- Array of athlete IDs
  nft_count INTEGER DEFAULT 0,
  reputation_score DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NFT metadata table
CREATE TABLE IF NOT EXISTS nft_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  attributes JSONB,
  athlete_id UUID REFERENCES athletes(id),
  reaction_id UUID REFERENCES fan_reactions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_athletes_sport ON athletes(sport);
CREATE INDEX IF NOT EXISTS idx_athletes_university ON athletes(university);
CREATE INDEX IF NOT EXISTS idx_commentary_athlete ON commentary(athlete_id);
CREATE INDEX IF NOT EXISTS idx_commentary_sentiment ON commentary(sentiment);
CREATE INDEX IF NOT EXISTS idx_fan_reactions_athlete ON fan_reactions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_fan_reactions_fan ON fan_reactions(fan_address);
CREATE INDEX IF NOT EXISTS idx_fans_address ON fans(address);

-- Row Level Security (RLS) - Enable but allow all for demo
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentary ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_metadata ENABLE ROW LEVEL SECURITY;

-- Allow all operations for demo purposes
CREATE POLICY "Allow all for athletes" ON athletes FOR ALL USING (true);
CREATE POLICY "Allow all for commentary" ON commentary FOR ALL USING (true);
CREATE POLICY "Allow all for fan_reactions" ON fan_reactions FOR ALL USING (true);
CREATE POLICY "Allow all for fans" ON fans FOR ALL USING (true);
CREATE POLICY "Allow all for nft_metadata" ON nft_metadata FOR ALL USING (true);
CREATE POLICY "Allow all for commentary_reactions" ON commentary_reactions FOR ALL USING (true);