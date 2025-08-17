
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function detectTrendingTopics(keywords) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Act as a sports analyst. Analyze the following keywords and identify the top 5 trending topics in sports right now.
    For each topic, provide a JSON object with the following fields:
    - topic: The name of the trending topic.
    - virality_score: A score from 0 to 1 indicating the potential for the topic to go viral.
    - tweet_count: An estimated number of tweets related to the topic.
    - sentiment: "positive", "negative", or "neutral".
    - related_athletes: An array of up to 3 related athlete names.

    Keywords: ${keywords.join(", ")}

    Return only an array of JSON objects.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(jsonString);
    return analysis;
  } catch (error) {
    console.error("Error detecting trending topics:", error);
    // Return a default response in case of an error
    return [];
  }
}
