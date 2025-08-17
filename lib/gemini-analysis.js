
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeCommentary(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Analyze the following sports commentary and return a JSON object with the following fields:
    - sentiment: "positive", "negative", or "neutral"
    - intensity: a score from 0 to 1 indicating the intensity of the sentiment
    - virality_score: a score from 0 to 1 indicating the potential for the commentary to go viral

    Commentary: "${text}"

    Return only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(jsonString);
    return analysis;
  } catch (error) {
    console.error("Error analyzing commentary:", error);
    // Return a default response in case of an error
    return {
      sentiment: "neutral",
      intensity: 0.5,
      virality_score: 0.5,
    };
  }
}

module.exports = { analyzeCommentary };
