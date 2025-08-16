
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { text } = await request.json()

  // In a real application, you would use a sentiment analysis model here.
  // For now, we'll simulate the response.
  const sentiment = 'negative'
  const intensity = Math.random() * 0.5 + 0.5 // Random intensity between 0.5 and 1.0
  const virality_score = Math.random() * 0.5 + 0.5 // Random virality between 0.5 and 1.0

  // Simulate a reaction recommendation based on intensity and virality
  let suggested_reaction = 2
  if (intensity > 0.8 && virality_score > 0.8) {
    suggested_reaction = 50 // King
  } else if (intensity > 0.7 && virality_score > 0.7) {
    suggested_reaction = 25 // Legend
  } else if (intensity > 0.6 && virality_score > 0.6) {
    suggested_reaction = 15 // Strong
  } else if (intensity > 0.5 && virality_score > 0.5) {
    suggested_reaction = 10 // Gem
  } else if (intensity > 0.4 && virality_score > 0.4) {
    suggested_reaction = 5 // Fire
  }

  return NextResponse.json({
    sentiment,
    intensity,
    virality_score,
    suggested_reaction,
  })
}
