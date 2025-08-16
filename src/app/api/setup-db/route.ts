import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const DB_SCHEMA = `
-- Athletes table
CREATE TABLE IF NOT EXISTS athletes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  university TEXT,
  position TEXT,
  year TEXT,
  background TEXT,
  total_earnings DECIMAL DEFAULT 0,
  fan_count INTEGER DEFAULT 0,
  profile_image TEXT,
  chiliz_token_address TEXT,
  token_symbol TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Commentary table for tracking mentions
CREATE TABLE IF NOT EXISTS commentary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  athlete_id TEXT REFERENCES athletes(id),
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
  athlete_id TEXT REFERENCES athletes(id),
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
  athlete_id TEXT REFERENCES athletes(id),
  reaction_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trending topics cache table
CREATE TABLE IF NOT EXISTS trending_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topics JSONB NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW()
);
`

export async function POST() {
  try {
    // Execute schema creation using raw SQL
    const { error } = await supabase.rpc('exec_sql', { sql: DB_SCHEMA })

    if (error) {
      console.error('Schema creation error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to create database schema. Using mock data for demo.',
        mockMode: true
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully'
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database setup failed. Using mock data for demo.',
      mockMode: true
    })
  }
}