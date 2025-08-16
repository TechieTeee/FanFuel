'use client'

// Flow Actions - Meaningful user actions that create NFT rewards and cross-chain value

export interface FlowAction {
  id: string
  type: 'champion_support' | 'viral_reaction' | 'milestone_achievement' | 'community_rally'
  title: string
  description: string
  trigger: {
    condition: string
    threshold?: number
  }
  rewards: {
    nftMetadata: {
      name: string
      description: string
      rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
      attributes: Array<{ trait_type: string; value: string | number }>
    }
    tokens?: {
      amount: number
      symbol: string
    }
    xp?: number
  }
  chainRewards: {
    [chainId: number]: {
      rewardType: string
      amount: string
      contract?: string
    }
  }
}

// Predefined Flow Actions for different fan behaviors
export const FLOW_ACTIONS: FlowAction[] = [
  {
    id: 'first_champion_support',
    type: 'champion_support',
    title: '🏆 First Champion Support',
    description: 'Support your first athlete with any reaction',
    trigger: {
      condition: 'first_athlete_support'
    },
    rewards: {
      nftMetadata: {
        name: 'FanFuel Pioneer',
        description: 'Awarded to early supporters who believed in athlete empowerment from day one',
        rarity: 'Rare',
        attributes: [
          { trait_type: 'Achievement', value: 'First Support' },
          { trait_type: 'Rarity', value: 'Pioneer' },
          { trait_type: 'Impact Level', value: 'Foundation Builder' }
        ]
      },
      tokens: { amount: 100, symbol: 'FUEL' },
      xp: 50
    },
    chainRewards: {
      88882: { rewardType: 'CHZ_BONUS', amount: '5.0' }, // Chiliz
      1: { rewardType: 'ETH_REBATE', amount: '0.001' },   // Ethereum
      747: { rewardType: 'FLOW_EVM_ACHIEVEMENT', amount: '1.0' } // Flow EVM Testnet
    }
  },
  {
    id: 'viral_reaction_master',
    type: 'viral_reaction',
    title: '🔥 Viral Reaction Master',
    description: 'React to content that goes viral (>80% virality score)',
    trigger: {
      condition: 'viral_content_reaction',
      threshold: 0.8
    },
    rewards: {
      nftMetadata: {
        name: 'Trendsetter Badge',
        description: 'Awarded to fans who identify and react to viral sports moments before they explode',
        rarity: 'Epic',
        attributes: [
          { trait_type: 'Achievement', value: 'Viral Spotter' },
          { trait_type: 'Timing', value: 'Early Adopter' },
          { trait_type: 'Social Impact', value: 'Trendsetter' }
        ]
      },
      tokens: { amount: 500, symbol: 'FUEL' },
      xp: 200
    },
    chainRewards: {
      88882: { rewardType: 'CHZ_MULTIPLIER', amount: '2x' },
      10: { rewardType: 'OP_REWARD', amount: '10.0' },
      747: { rewardType: 'FLOW_EVM_VIRAL', amount: '5.0' } // Flow EVM Testnet
    }
  },
  {
    id: 'king_reaction_milestone',
    type: 'milestone_achievement',
    title: '👑 King Reaction Achievement',
    description: 'Send a King reaction ($50) to an athlete',
    trigger: {
      condition: 'king_reaction_sent',
      threshold: 50
    },
    rewards: {
      nftMetadata: {
        name: 'Royal Supporter Crown',
        description: 'Exclusive NFT for fans who make King-level contributions to athlete success',
        rarity: 'Legendary',
        attributes: [
          { trait_type: 'Achievement', value: 'King Support' },
          { trait_type: 'Contribution Level', value: 'Royal' },
          { trait_type: 'Impact', value: 'Life Changing' }
        ]
      },
      tokens: { amount: 1000, symbol: 'FUEL' },
      xp: 500
    },
    chainRewards: {
      88882: { rewardType: 'CHZ_PREMIUM', amount: '25.0' },
      137: { rewardType: 'MATIC_BONUS', amount: '100.0' },
      8453: { rewardType: 'BASE_REWARD', amount: '0.01' },
      747: { rewardType: 'FLOW_EVM_KING', amount: '10.0' } // Flow EVM Testnet
    }
  },
  {
    id: 'community_rally_leader',
    type: 'community_rally',
    title: '🚀 Community Rally Leader',
    description: 'Organize a community rally supporting an athlete under fire',
    trigger: {
      condition: 'rally_participation',
      threshold: 5 // 5+ fans participate
    },
    rewards: {
      nftMetadata: {
        name: 'Rally Commander Badge',
        description: 'Leadership NFT for fans who unite communities in support of athletes',
        rarity: 'Epic',
        attributes: [
          { trait_type: 'Achievement', value: 'Rally Leader' },
          { trait_type: 'Community Impact', value: 'Unifier' },
          { trait_type: 'Leadership Level', value: 'Commander' }
        ]
      },
      tokens: { amount: 750, symbol: 'FUEL' },
      xp: 300
    },
    chainRewards: {
      88882: { rewardType: 'CHZ_COMMUNITY', amount: '15.0' },
      1: { rewardType: 'ETH_LEADERSHIP', amount: '0.005' },
      747: { rewardType: 'FLOW_EVM_RALLY', amount: '7.5' } // Flow EVM Testnet
    }
  }
]

export class FlowActionsService {
  private userActions: Map<string, FlowAction[]> = new Map()

  // Check if user action triggers any Flow Actions
  async checkActionTriggers(
    userAddress: string,
    actionData: {
      type: string
      athleteId?: string
      reactionAmount?: number
      viralityScore?: number
      participantCount?: number
    }
  ): Promise<FlowAction[]> {
    const triggeredActions: FlowAction[] = []

    for (const action of FLOW_ACTIONS) {
      const shouldTrigger = await this.evaluateTrigger(userAddress, action, actionData)
      if (shouldTrigger) {
        triggeredActions.push(action)
      }
    }

    return triggeredActions
  }

  private async evaluateTrigger(
    userAddress: string,
    action: FlowAction,
    actionData: any
  ): Promise<boolean> {
    const userActionHistory = this.userActions.get(userAddress) || []
    
    switch (action.trigger.condition) {
      case 'first_athlete_support':
        return !userActionHistory.some(a => a.type === 'champion_support')

      case 'viral_content_reaction':
        return actionData.viralityScore >= (action.trigger.threshold || 0.8)

      case 'king_reaction_sent':
        return actionData.reactionAmount >= (action.trigger.threshold || 50)

      case 'rally_participation':
        return actionData.participantCount >= (action.trigger.threshold || 5)

      default:
        return false
    }
  }

  // Execute Flow Action rewards
  async executeFlowAction(
    userAddress: string,
    action: FlowAction,
    context: any
  ): Promise<{
    success: boolean
    nftId?: string
    crossChainRewards?: Array<{ chain: number; txHash: string }>
    error?: string
  }> {
    try {
      console.log('Executing Flow Action:', action.title)

      // 1. Mint NFT on Flow EVM
      const nftResult = await fetch('/api/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mint_achievement_nft',
          network: 'flow-evm', // Use Flow EVM instead of Cadence
          contractAddress: '0x' + Math.random().toString(16).substr(2, 40), // Mock EVM contract
          athleteId: context.athleteId || 'achievement',
          athleteName: context.athleteName || 'Achievement',
          achievementType: action.type,
          rewardMetadata: action.rewards.nftMetadata,
          userAddress: userAddress,
          chainId: 747, // Flow EVM Testnet
          sentimentScore: 1.0,
          viralityScore: context.viralityScore || 0.5
        })
      })

      const nftData = await nftResult.json()

      // 2. Award tokens if specified
      if (action.rewards.tokens) {
        // Award FUEL tokens (mock implementation)
        console.log(`Awarding ${action.rewards.tokens.amount} ${action.rewards.tokens.symbol} tokens`)
      }

      // 3. Process cross-chain rewards
      const crossChainRewards = []
      for (const [chainId, reward] of Object.entries(action.chainRewards)) {
        // Mock cross-chain reward distribution
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
        crossChainRewards.push({
          chain: parseInt(chainId),
          txHash: mockTxHash
        })
        
        console.log(`Cross-chain reward on chain ${chainId}:`, reward)
      }

      // 4. Track action completion
      const currentActions = this.userActions.get(userAddress) || []
      this.userActions.set(userAddress, [...currentActions, action])

      return {
        success: true,
        nftId: nftData.nftId,
        crossChainRewards
      }
    } catch (error) {
      console.error('Flow Action execution failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Action execution failed'
      }
    }
  }

  // Get user's completed actions
  getUserActions(userAddress: string): FlowAction[] {
    return this.userActions.get(userAddress) || []
  }

  // Get available actions for user
  getAvailableActions(userAddress: string): FlowAction[] {
    const completedActions = this.getUserActions(userAddress)
    const completedIds = completedActions.map(a => a.id)
    
    return FLOW_ACTIONS.filter(action => !completedIds.includes(action.id))
  }
}

// Global service instance
export const flowActionsService = new FlowActionsService()

// Utility functions for common action triggers
export async function triggerAthleteSupport(
  userAddress: string,
  athleteId: string,
  athleteName: string,
  reactionAmount: number,
  viralityScore: number = 0.3
): Promise<FlowAction[]> {
  return flowActionsService.checkActionTriggers(userAddress, {
    type: 'athlete_support',
    athleteId,
    reactionAmount,
    viralityScore
  })
}

export async function triggerViralReaction(
  userAddress: string,
  viralityScore: number,
  athleteId: string
): Promise<FlowAction[]> {
  return flowActionsService.checkActionTriggers(userAddress, {
    type: 'viral_reaction',
    viralityScore,
    athleteId
  })
}

export async function executeActionRewards(
  userAddress: string,
  actions: FlowAction[],
  context: any
): Promise<Array<{ action: FlowAction; result: any }>> {
  const results = []
  
  for (const action of actions) {
    const result = await flowActionsService.executeFlowAction(userAddress, action, context)
    results.push({ action, result })
  }
  
  return results
}