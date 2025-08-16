'use client'

// Flow blockchain integration for consumer-friendly NFT experiences
export interface FlowNFTMetadata {
  id: string
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  athleteId: string
  reactionType: string
  timestamp: string
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary'
}

export interface FlowAccountInfo {
  address: string
  balance: string
  nfts: FlowNFTMetadata[]
  transactions: Array<{
    id: string
    type: string
    status: string
    timestamp: string
  }>
}

export interface ReactionNFTConfig {
  athleteId: string
  athleteName: string
  reactionType: string
  reactionAmount: number
  commentaryText: string
  sentimentScore: number
  viralityScore: number
  timestamp: string
}

export class FlowService {
  private accessNodeUrl: string
  private isMainnet: boolean

  constructor(accessNodeUrl?: string, isMainnet = false) {
    this.accessNodeUrl = accessNodeUrl || process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org'
    this.isMainnet = isMainnet
  }

  // Initialize Flow account for new users
  async initializeFlowAccount(userAddress: string): Promise<{
    success: boolean
    flowAddress?: string
    error?: string
  }> {
    try {
      // Mock Flow account creation - replace with actual Flow SDK
      const mockFlowAddress = `0x${Math.random().toString(16).substr(2, 16)}`
      
      console.log('Initializing Flow account for user:', userAddress)
      
      // Simulate account setup delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      return {
        success: true,
        flowAddress: mockFlowAddress
      }
    } catch (error) {
      console.error('Flow account initialization failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Account creation failed'
      }
    }
  }

  // Mint reaction NFT on Flow
  async mintReactionNFT(config: ReactionNFTConfig): Promise<{
    success: boolean
    nftId?: string
    transactionId?: string
    error?: string
  }> {
    try {
      console.log('Minting reaction NFT:', config)

      // Generate unique NFT metadata
      const nftMetadata: FlowNFTMetadata = {
        id: `reaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${config.reactionType} for ${config.athleteName}`,
        description: `Fan reaction supporting ${config.athleteName} with a ${config.reactionType} ($${config.reactionAmount}) response to: "${config.commentaryText.slice(0, 100)}..."`,
        image: `https://fanfuel.app/nft-images/${config.reactionType.toLowerCase()}-${config.athleteId}.png`,
        attributes: [
          { trait_type: 'Athlete', value: config.athleteName },
          { trait_type: 'Reaction Type', value: config.reactionType },
          { trait_type: 'Support Amount', value: config.reactionAmount },
          { trait_type: 'Sentiment Score', value: config.sentimentScore },
          { trait_type: 'Virality Score', value: config.viralityScore },
          { trait_type: 'Timestamp', value: config.timestamp },
          { trait_type: 'Rarity', value: this.calculateRarity(config.reactionAmount, config.viralityScore) }
        ],
        athleteId: config.athleteId,
        reactionType: config.reactionType,
        timestamp: config.timestamp,
        rarity: this.calculateRarity(config.reactionAmount, config.viralityScore)
      }

      // Mock Flow NFT minting - replace with actual Cadence transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockTxId = `flow_tx_${Math.random().toString(36).substr(2, 12)}`
      
      return {
        success: true,
        nftId: nftMetadata.id,
        transactionId: mockTxId
      }
    } catch (error) {
      console.error('NFT minting failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Minting failed'
      }
    }
  }

  // Get user's Flow NFT collection
  async getUserNFTs(flowAddress: string): Promise<{
    success: boolean
    nfts?: FlowNFTMetadata[]
    error?: string
  }> {
    try {
      console.log('Fetching NFTs for Flow address:', flowAddress)

      // Mock NFT collection - replace with actual Flow NFT queries
      const mockNFTs: FlowNFTMetadata[] = [
        {
          id: 'reaction_1737045600_abc123',
          name: 'Fire for Sarah Johnson',
          description: 'Fan reaction supporting Sarah Johnson with a Fire ($5) response to criticism',
          image: 'https://fanfuel.app/nft-images/fire-sarah.png',
          attributes: [
            { trait_type: 'Athlete', value: 'Sarah Johnson' },
            { trait_type: 'Reaction Type', value: 'Fire' },
            { trait_type: 'Support Amount', value: 5 },
            { trait_type: 'Rarity', value: 'Common' }
          ],
          athleteId: '1',
          reactionType: 'Fire',
          timestamp: '2025-01-16T12:00:00Z',
          rarity: 'Common'
        }
      ]

      return {
        success: true,
        nfts: mockNFTs
      }
    } catch (error) {
      console.error('NFT fetch failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch NFTs'
      }
    }
  }

  // Calculate NFT rarity based on reaction amount and virality
  private calculateRarity(amount: number, viralityScore: number): 'Common' | 'Rare' | 'Epic' | 'Legendary' {
    const score = amount * viralityScore
    
    if (score >= 40) return 'Legendary'      // King reactions on viral content
    if (score >= 20) return 'Epic'          // Legend reactions or high virality
    if (score >= 10) return 'Rare'          // Strong/Gem reactions
    return 'Common'                         // Clap/Fire reactions
  }

  // Get Flow account information
  async getAccountInfo(flowAddress: string): Promise<{
    success: boolean
    account?: FlowAccountInfo
    error?: string
  }> {
    try {
      const nftsResult = await this.getUserNFTs(flowAddress)
      
      const mockAccount: FlowAccountInfo = {
        address: flowAddress,
        balance: '10.5432', // Mock FLOW balance
        nfts: nftsResult.nfts || [],
        transactions: [
          {
            id: 'flow_tx_abc123',
            type: 'NFT_MINT',
            status: 'SEALED',
            timestamp: '2025-01-16T12:00:00Z'
          }
        ]
      }

      return {
        success: true,
        account: mockAccount
      }
    } catch (error) {
      console.error('Account info fetch failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch account'
      }
    }
  }
}

// Factory function
export function createFlowService(isMainnet = false): FlowService {
  return new FlowService(undefined, isMainnet)
}

// Utility functions for common NFT operations
export async function mintReactionNFTForUser(
  config: ReactionNFTConfig
): Promise<{ success: boolean; nftId?: string; error?: string }> {
  const flowService = createFlowService()
  return flowService.mintReactionNFT(config)
}

export async function getUserFlowNFTs(flowAddress: string): Promise<FlowNFTMetadata[]> {
  const flowService = createFlowService()
  const result = await flowService.getUserNFTs(flowAddress)
  return result.nfts || []
}