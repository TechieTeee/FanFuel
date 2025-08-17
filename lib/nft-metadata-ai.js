
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateNFTMetadata(actionId, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Act as a creative writer. Generate dynamic NFT metadata for a sports-related achievement.

    Action ID: ${actionId}
    Context: ${JSON.stringify(context)}

    Based on the action and context, generate a JSON object with the following fields:
    - name: A creative and catchy name for the NFT.
    - description: A compelling description of the achievement.
    - rarity: "Common", "Rare", "Epic", or "Legendary".
    - attributes: An array of objects with "trait_type" and "value" properties.

    Return only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    const metadata = JSON.parse(jsonString);
    return metadata;
  } catch (error) {
    console.error("Error generating NFT metadata:", error);
    // Return a default response in case of an error
    return {
      name: "FanFuel Achievement",
      description: "A testament to your dedication and support.",
      rarity: "Common",
      attributes: [],
    };
  }
}
