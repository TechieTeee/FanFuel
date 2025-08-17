'use client'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateNFTMetadata(actionId, context) {
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

// Flow Actions - Meaningful user actions that create NFT rewards and cross-chain value

// Demo flow actions for user engagement
export const demoFlowActions = [
  {
    id: 'first_support',
    type: 'champion_support',
    title: 'Champion Supporter',
    description: 'Support your first athlete with FanFuel',
    trigger: {
      condition: 'first_athlete_support',
      threshold: 1
    },
    rewards: {
      nftMetadata: {
        name: 'First Champion Badge',
        description: 'Awarded for supporting your first athlete',
        rarity: 'Common',
        attributes: [
          { trait_type: 'Achievement', value: 'First Support' },
          { trait_type: 'Rarity', value: 'Common' }
        ]
      },
      crossChainRewards: [
        { chain: 'flow', type: 'nft_mint', value: 'champion_supporter_nft' },
        { chain: 'chiliz', type: 'fan_token', value: 100 }
      ]
    },
    isCompleted: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'viral_moment',
    type: 'viral_reaction',
    title: 'Viral Moment Creator',
    description: 'Create a viral moment by sharing athlete content',
    trigger: {
      condition: 'social_shares',
      threshold: 10
    },
    rewards: {
      nftMetadata: {
        name: 'Viral Moment NFT',
        description: 'Created when your athlete support goes viral',
        rarity: 'Rare',
        attributes: [
          { trait_type: 'Impact', value: 'Viral' },
          { trait_type: 'Shares', value: '10+' }
        ]
      },
      crossChainRewards: [
        { chain: 'flow', type: 'rare_nft', value: 'viral_moment_nft' },
        { chain: 'ethereum', type: 'eth_reward', value: '0.01' }
      ]
    },
    isCompleted: false,
    progress: 0,
    maxProgress: 10
  }
]

// FlowActionManager class for handling user actions
export class FlowActionManager {
  constructor() {
    this.userActions = new Map()
    this.completedActions = new Map()
  }

  async loadUserActions(userAddress) {
    try {
      // Return demo actions for now
      return demoFlowActions.map(action => ({
        ...action,
        userId: userAddress,
        createdAt: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error loading user actions:', error)
      return []
    }
  }

  async completeAction(
    userAddress,
    action,
    actionData
  ) {
    const userActionHistory = this.userActions.get(userAddress) || []
    
    // Check if action can be completed
    if (actionData.type === 'first_support' && actionData.value >= 1) {
      return true
    } else if (actionData.type === 'viral_shares' && actionData.value >= 10) {
      return true
    }
    
    return false
  }

  async executeAction(userAddress, actionId, context) {
    try {
      console.log('Executing Flow Action:', actionId)

      // Find the action
      const action = demoFlowActions.find(a => a.id === actionId)
      if (!action) {
        throw new Error('Action not found')
      }

      const nftMetadata = await generateNFTMetadata(actionId, context);

      // Simulate execution
      const result = {
        success: true,
        nftId: `nft_${actionId}_${Date.now()}`,
        nftMetadata,
        crossChainRewards: action.rewards.crossChainRewards.map(reward => ({
          chain: reward.chain,
          txHash: `0x${Math.random().toString(16).slice(2, 18)}`
        }))
      }

      return result
    } catch (error) {
      console.error('Error executing Flow action:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  getAvailableActions(userAddress) {
    return demoFlowActions.filter(action => !action.isCompleted)
  }

  getCompletedActions(userAddress) {
    return demoFlowActions.filter(action => action.isCompleted)
  }
}

// Execute multiple actions in sequence
export async function executeFlowActions(
  userAddress,
  actions,
  context
) {
  const results = []
  const manager = new FlowActionManager()

  for (const action of actions) {
    try {
      const result = await manager.executeAction(userAddress, action.id, context)
      results.push({ action, result })
    } catch (error) {
      console.error('Error executing action:', action.id, error)
      results.push({ action, result: { success: false, error: error.message } })
    }
  }

  return results
}

// Export singleton instance
export const flowActionManager = new FlowActionManager()

// Additional exports for compatibility
export const flowActionsService = flowActionManager
export const triggerAthleteSupport = (athleteId, amount) => flowActionManager.executeAction('user', 'first_support', { athleteId, amount })
export const triggerViralReaction = (content) => flowActionManager.executeAction('user', 'viral_moment', { content })
export const executeActionRewards = (actionId, context) => flowActionManager.executeAction('user', actionId, context)