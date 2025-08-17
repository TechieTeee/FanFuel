
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getReactionSuggestion(athlete, commentary, fanHistory) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Act as a fan engagement expert. Your goal is to suggest a reaction amount that is appropriate for the situation.

    Athlete: ${JSON.stringify(athlete)}
    Commentary: ${JSON.stringify(commentary)}
    Fan History: ${JSON.stringify(fanHistory)}

    Based on the athlete's earnings, the severity of the commentary, and the fan's past support, suggest a reaction amount from the following tiers: 2, 5, 10, 15, 25, 50.

    Return only the suggested amount as a number.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = parseInt(response.text().trim(), 10);
    return suggestion;
  } catch (error) {
    console.error("Error getting reaction suggestion:", error);
    // Return a default suggestion in case of an error
    return 5;
  }
}
