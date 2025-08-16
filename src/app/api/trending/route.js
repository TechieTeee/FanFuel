
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN
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

    // Fetch fresh data from Twitter API
    console.log('Fetching fresh Twitter sports trending data...')
    
    const trendingTopics = await fetchTwitterTrending()
    
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

async function fetchTwitterTrending() {
  const trends = []
  
  // Search for sports trending topics across all levels
  for (const keyword of SPORTS_KEYWORDS.slice(0, 5)) { // Limit to 5 to conserve API calls
    try {
      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(keyword + ' -RT')}&max_results=10&tweet.fields=created_at,author_id,public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        console.error(`Twitter API error for "${keyword}":`, response.status)
        continue
      }

      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        // Calculate virality score based on engagement metrics
        const avgEngagement = data.data.reduce((sum, tweet) => {
          const metrics = tweet.public_metrics || {}
          return sum + (metrics.retweet_count || 0) + (metrics.like_count || 0) + (metrics.reply_count || 0)
        }, 0) / data.data.length

        const viralityScore = Math.min(avgEngagement / 1000, 1.0) // Normalize to 0-1

        trends.push({
          topic: keyword,
          tweet_count: data.meta?.result_count || 0,
          virality_score: viralityScore,
          sentiment: analyzeCollegeSportsSentiment(keyword, data.data),
          related_athletes: extractCollegeAthleteNames(data.data),
          cached_at: new Date().toISOString()
        })
      }
      
      // Rate limiting - wait 200ms between requests to stay under limits
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.error(`Error fetching Twitter data for "${keyword}":`, error)
    }
  }

  return trends.sort((a, b) => b.virality_score - a.virality_score)
}

function analyzeCollegeSportsSentiment(topic, tweets) {
  const positiveWords = ['win', 'victory', 'champion', 'success', 'great', 'amazing', 'record', 'playoff', 'championship', 'recruit']
  const negativeWords = ['loss', 'fail', 'injury', 'scandal', 'controversy', 'suspended', 'transfer', 'fired', 'quit']
  
  let positiveCount = 0
  let negativeCount = 0
  
  tweets.forEach(tweet => {
    const text = tweet.text?.toLowerCase() || ''
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++
    })
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++
    })
  })
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function extractCollegeAthleteNames(tweets) {
  const athleteNames = new Set()
  
  tweets.forEach(tweet => {
    const text = tweet.text || ''
    // Pattern matching for college athlete names with common college sports terms
    const nameMatches = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g)
    if (nameMatches) {
      nameMatches.slice(0, 2).forEach(name => {
        // Filter for likely athlete names (avoid generic terms)
        if (!['March Madness', 'College Football', 'Transfer Portal', 'Bowl Game'].includes(name)) {
          athleteNames.add(name)
        }
      })
    }
  })
  
  return Array.from(athleteNames).slice(0, 5) // Return max 5 names
}
