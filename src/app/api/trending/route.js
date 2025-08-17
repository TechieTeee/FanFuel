
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { detectTrendingTopics } from '../../../../lib/trending-detection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CACHE_DURATION = 3600000 // 1 hour in milliseconds

// Sports keywords for trending detection across all levels
const SPORTS_KEYWORDS = [
  'WNBA', 'women\'s basketball', 'Olympics', 'Olympic sports', 'track and field',
  'MLS soccer', 'women\'s soccer', 'NWSL', 'boxing', 'UFC', 'mixed martial arts',
  'tennis', 'swimming', 'gymnastics', 'volleyball', 'lacrosse', 'softball',
  'March Madness', 'college basketball', 'NIL deal', 'college football',
  'pay equity', 'athlete salary', 'sports revenue', 'athlete endorsement'
]


export async function GET(req) {
  try {
    // Check cache first
    const { data: cachedData, error: cacheError } = await supabase
      .from('trending_cache')
      .select('*')
      .order('cached_at', { ascending: false })
      .limit(1)
      .single()

    if (!cacheError && cachedData) {
      const cacheAge = new Date().getTime() - new Date(cachedData.cached_at).getTime()
      
      if (cacheAge < CACHE_DURATION) {
        console.log('Returning cached sports trending data')
        return NextResponse.json(cachedData.topics)
      }
    }

    // Fetch fresh data from Gemini API
    console.log('Fetching fresh trending sports data from Gemini...')
    
    const trendingTopics = await detectTrendingTopics(SPORTS_KEYWORDS)
    
    // Cache the results
    await supabase
      .from('trending_cache')
      .insert({
        topics: trendingTopics,
        cached_at: new Date().toISOString()
      })

    return NextResponse.json(trendingTopics)
  } catch (error) {
    console.error('Trending API error:', error)
    
    // Return fallback sports topics if API fails
    const fallbackTopics = [
      {
        topic: 'College Football Playoff',
        tweet_count: 25420,
        virality_score: 0.94,
        sentiment: 'positive',
        related_athletes: ['Quinn Ewers', 'Carson Beck'],
        cached_at: new Date().toISOString()
      },
      {
        topic: 'NIL Deals',
        tweet_count: 18934,
        virality_score: 0.89,
        sentiment: 'positive',
        related_athletes: ['Arch Manning', 'Cooper Flagg'],
        cached_at: new Date().toISOString()
      },
      {
        topic: 'Transfer Portal',
        tweet_count: 15056,
        virality_score: 0.83,
        sentiment: 'neutral',
        related_athletes: ['Dylan Raiola', 'Jeremiah Smith'],
        cached_at: new Date().toISOString()
      },
      {
        topic: 'MLS Player Revenue',
        tweet_count: 12203,
        virality_score: 0.78,
        sentiment: 'positive',
        related_athletes: ['Carlos Vela', 'Giorgio Chiellini'],
        cached_at: new Date().toISOString()
      }
    ]
    
    return NextResponse.json(fallbackTopics)
  }
}
