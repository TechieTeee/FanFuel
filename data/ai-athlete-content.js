
import { GoogleGenerativeAI } from "@google/generative-ai";
import { demoAthletes } from "./demo-athletes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAthleteContent(athlete) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Act as a sports journalist. Write a compelling backstory for the following athlete, expanding on their existing background information.

    Athlete: ${athlete.name}
    Sport: ${athlete.sport}
    Background: ${athlete.background}

    The story should be engaging and highlight the athlete's struggles and triumphs. It should be about 2-3 paragraphs long.

    Return only the generated story as a string.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const story = response.text().trim();
    return story;
  } catch (error) {
    console.error(`Error generating content for ${athlete.name}:`, error);
    return "";
  }
}

export const aiAthleteContent = await Promise.all(
  demoAthletes.map(async (athlete) => {
    const ai_content = await generateAthleteContent(athlete);
    return {
      athlete_id: athlete.id,
      ai_content,
    };
  })
);
