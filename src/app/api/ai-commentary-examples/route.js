
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { demoAthletes } from '../../../../data/demo-athletes';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateCommentary(athlete) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Act as a sports commentator. Generate a short, controversial, and negative commentary about the following athlete.

    Athlete: ${athlete.name}
    Sport: ${athlete.sport}

    The commentary should be about 1-2 sentences long and suitable for a social media post.

    Return only the generated commentary as a string.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const commentary = response.text().trim();
    return commentary;
  } catch (error) {
    console.error(`Error generating commentary for ${athlete.name}:`, error);
    return "";
  }
}

// Reliable mock commentary data with proper fields
const MOCK_COMMENTARY = [
  {
    id: '1-0',
    text: 'Sarah Johnson needs to step up her game if Alabama wants any chance this season. Her shooting percentage is concerning.',
    athlete_id: '1',
    source: 'ESPN Sports Center',
    created_at: new Date().toISOString(),
    intensity: 0.75,
    virality_score: 0.68
  },
  {
    id: '1-1',
    text: 'Not impressed with Sarah Johnson\'s defensive play lately. Alabama deserves better leadership on the court.',
    athlete_id: '1',
    source: 'Fox Sports',
    created_at: new Date().toISOString(),
    intensity: 0.82,
    virality_score: 0.71
  },
  {
    id: '2-0',
    text: 'Marcus Williams is overhyped. Oregon\'s offense struggles whenever he touches the ball.',
    athlete_id: '2',
    source: 'Sports Illustrated',
    created_at: new Date().toISOString(),
    intensity: 0.88,
    virality_score: 0.79
  },
  {
    id: '2-1',
    text: 'Williams needs to prove he belongs at the college level. His decision-making has been questionable all season.',
    athlete_id: '2',
    source: 'Bleacher Report',
    created_at: new Date().toISOString(),
    intensity: 0.73,
    virality_score: 0.65
  }
];

export async function GET() {
  try {
    // Try Gemini API first for fresh content
    const aiCommentaryExamples = await Promise.all(
      demoAthletes.flatMap(async (athlete) => {
        const comments = [];
        for (let i = 0; i < 2; i++) {
          const text = await generateCommentary(athlete);
          
          // If Gemini fails or returns empty, use mock data
          if (!text || text.length === 0) {
            const mockComment = MOCK_COMMENTARY.find(c => c.athlete_id === athlete.id && c.id.endsWith(`-${i}`));
            if (mockComment) {
              return mockComment;
            }
          }
          
          comments.push({
            id: `${athlete.id}-${i}`,
            text,
            athlete_id: athlete.id,
            source: "X (formerly Twitter)",
            created_at: new Date().toISOString(),
            intensity: Math.random() * 0.4 + 0.6, // Random between 0.6-1.0 for negative commentary
            virality_score: Math.random() * 0.3 + 0.5, // Random between 0.5-0.8 for viral potential
          });
        }
        return comments;
      })
    ).then(results => results.flat());
    
    // If any results are undefined or empty, fill with mock data
    const validResults = aiCommentaryExamples.filter(comment => comment && comment.text);
    
    if (validResults.length === 0) {
      console.log('Gemini API failed, using reliable mock commentary');
      return NextResponse.json(MOCK_COMMENTARY);
    }
    
    return NextResponse.json(validResults);
  } catch (error) {
    console.error("Error fetching AI commentary examples:", error);
    // Return reliable mock data on any error
    console.log('Using emergency fallback commentary');
    return NextResponse.json(MOCK_COMMENTARY);
  }
}
