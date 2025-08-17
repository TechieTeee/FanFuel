
import { NextResponse } from 'next/server'
import { analyzeCommentary } from '../../../../lib/gemini-analysis'

export async function POST(request) {
  const { text } = await request.json()

  const analysis = await analyzeCommentary(text)

  // Simulate a reaction recommendation based on intensity and virality
  let suggested_reaction = 2
  if (analysis.intensity > 0.8 && analysis.virality_score > 0.8) {
    suggested_reaction = 50 // King
  } else if (analysis.intensity > 0.7 && analysis.virality_score > 0.7) {
    suggested_reaction = 25 // Legend
  } else if (analysis.intensity > 0.6 && analysis.virality_score > 0.6) {
    suggested_reaction = 15 // Strong
  } else if (analysis.intensity > 0.5 && analysis.virality_score > 0.5) {
    suggested_reaction = 10 // Gem
  } else if (analysis.intensity > 0.4 && analysis.virality_score > 0.4) {
    suggested_reaction = 5 // Fire
  }

  return NextResponse.json({
    ...analysis,
    suggested_reaction,
  })
}
