import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const seedAthletes = [
  {
    id: '1',
    name: 'Sarah Johnson',
    sport: 'Basketball',
    university: 'University of Alabama',
    position: 'Point Guard',
    year: 'Junior',
    background: 'First-generation college student, pre-med',
    total_earnings: 15.50,
    fan_count: 8
  },
  {
    id: '2', 
    name: 'Marcus Williams',
    sport: 'Football',
    university: 'University of Oregon',
    position: 'Wide Receiver',
    year: 'Sophomore',
    background: 'From underserved community, business major',
    total_earnings: 287.50,
    fan_count: 45
  }
]

export async function POST() {
  try {
    // Insert seed athletes
    const { data: athletes, error: athleteError } = await supabase
      .from('athletes')
      .upsert(seedAthletes, { onConflict: 'id' })
      .select()

    if (athleteError) {
      throw new Error(`Failed to seed athletes: ${athleteError.message}`)
    }

    // Create some sample commentary
    const seedCommentary = [
      {
        text: 'This point guard is completely overrated and making too many turnovers in crucial moments',
        athlete_id: '1',
        sentiment: 'negative',
        intensity: 0.8,
        virality_score: 0.75,
        source: 'Social Media Discussion'
      },
      {
        text: 'Williams needs to step up his game if this team wants any chance at success',
        athlete_id: '2', 
        sentiment: 'negative',
        intensity: 0.6,
        virality_score: 0.45,
        source: 'Sports Forum'
      }
    ]

    const { data: commentary, error: commentaryError } = await supabase
      .from('commentary')
      .upsert(seedCommentary)
      .select()

    if (commentaryError) {
      console.warn('Failed to seed commentary:', commentaryError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      athletes: athletes?.length || 0,
      commentary: commentary?.length || 0
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seeding failed' },
      { status: 500 }
    )
  }
}