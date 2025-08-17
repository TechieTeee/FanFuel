
import { GoogleGenerativeAI } from "@google/generative-ai";
import { demoAthletes } from "./demo-athletes";

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

export const aiCommentaryExamples = await Promise.all(
  demoAthletes.flatMap(async (athlete) => {
    const comments = [];
    for (let i = 0; i < 2; i++) {
      const text = await generateCommentary(athlete);
      comments.push({
        id: `${athlete.id}-${i}`,
        text,
        athlete_id: athlete.id,
        source: "X (formerly Twitter)",
        created_at: new Date().toISOString(),
      });
    }
    return comments;
  })
).then(results => results.flat());
