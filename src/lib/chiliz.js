import { ethers } from 'ethers'
import { supabase } from './supabase'

// Mock data for demo (fallback when database not available)
const mockAthletes = [
  {
    id: '1',
    name: 'Sarah Johnson',
    sport: 'Basketball',
    university: 'University of Alabama',
    total_earnings: 15.50,
    chiliz_token_address: '0x742b19Bcf16f5Afe4f5b80b7F52a9F9A3e7E8c5D',
    token_symbol: 'SJBASKET'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    sport: 'Soccer',
    university: 'Stanford University',
    total_earnings: 23.75,
    chiliz_token_address: '0x8c5fcdC8aa6B790b3E9E7c4E4c1a6F5E2d8B4a9C',
    token_symbol: 'MWFOOT'
  }
]

const mockReactions = []

// Chiliz Chain configuration
const CHILIZ_RPC_URL = process.env.CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com/'
const CHILIZ_CHAIN_ID = 88882 // Chiliz Spicy Testnet

// Token configuration
const CHZ_DECIMALS = 18
const ATHLETE_TOKEN_SUPPLY = ethers.parseEther('1000000') // 1M tokens per athlete

// Initialize Chiliz provider
export const chilizProvider = new ethers.JsonRpcProvider(CHILIZ_RPC_URL)

// Mock functions for demonstration
export async function getChilizBalance(address) {
  try {
    if (!address) return '0'
    
    // Mock balance for demo
    return '150.5'
  } catch (error) {
    console.error('Error getting CHZ balance:', error)
    return '0'
  }
}

export async function getAthleteTokens(userAddress) {
  try {
    // Return mock athlete tokens
    return [
      {
        athleteId: '1',
        athleteName: 'Sarah Johnson',
        tokenAddress: '0x742b19Bcf16f5Afe4f5b80b7F52a9F9A3e7E8c5D',
        symbol: 'SJBASKET',
        balance: '25.0',
        usdValue: 12.50
      },
      {
        athleteId: '2', 
        athleteName: 'Marcus Rodriguez',
        tokenAddress: '0x8c5fcdC8aa6B790b3E9E7c4E4c1a6F5E2d8B4a9C',
        symbol: 'MWFOOT',
        balance: '50.0',
        usdValue: 23.75
      }
    ]
  } catch (error) {
    console.error('Error getting athlete tokens:', error)
    return []
  }
}

export async function supportAthlete(athleteId, amount, fanAddress) {
  try {
    console.log('Supporting athlete:', athleteId, 'with amount:', amount)
    
    // Mock transaction for demo
    const txHash = `0x${Math.random().toString(16).slice(2, 18)}`
    
    // Update athlete earnings in database
    const { data: athlete } = await supabase
      .from('athletes')
      .select('total_earnings')
      .eq('id', athleteId)
      .single()

    if (athlete) {
      const newEarnings = (parseFloat(athlete.total_earnings) || 0) + parseFloat(amount)
      await supabase
        .from('athletes')
        .update({ total_earnings: newEarnings })
        .eq('id', athleteId)
    }

    return {
      success: true,
      txHash,
      message: 'Support transaction completed successfully'
    }
  } catch (error) {
    console.error('Error supporting athlete:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function getEcosystemStats() {
  try {
    // Mock ecosystem stats
    return {
      totalSportsTokens: 8,
      totalFans: 15420,
      totalValueLocked: '2,450,000',
      activeAthletes: 127
    }
  } catch (error) {
    console.error('Error getting ecosystem stats:', error)
    return {
      totalSportsTokens: 0,
      totalFans: 0,
      totalValueLocked: '0',
      activeAthletes: 0
    }
  }
}

export async function getUserWalletInfo(address) {
  try {
    if (!address) return null

    const chzBalance = await getChilizBalance(address)
    const athleteTokens = await getAthleteTokens(address)
    
    return {
      address,
      chzBalance,
      athleteTokens,
      totalSportsTokens: athleteTokens.length,
      totalFansSupported: athleteTokens.reduce((sum, token) => sum + parseFloat(token.balance), 0)
    }
  } catch (error) {
    console.error('Error getting wallet info:', error)
    return null
  }
}

export async function createAthleteToken(athleteData) {
  try {
    console.log('Creating athlete token for:', athleteData.name)
    
    // Mock token creation
    const tokenAddress = `0x${Math.random().toString(16).slice(2, 42)}`
    const tokenName = `${athleteData.name.replace(/\s+/g, '')}Token`
    
    return {
      success: true,
      tokenAddress,
      symbol: athleteData.sport.toUpperCase().slice(0, 6),
      message: 'Athlete token created successfully'
    }
  } catch (error) {
    console.error('Error creating athlete token:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Fan engagement functions
export async function addFanReaction(athleteId, reaction, fanAddress) {
  try {
    const reactionData = {
      athlete_id: athleteId,
      reaction_type: reaction,
      fan_address: fanAddress,
      timestamp: new Date().toISOString()
    }

    mockReactions.push(reactionData)
    
    return {
      success: true,
      message: 'Reaction added successfully'
    }
  } catch (error) {
    console.error('Error adding fan reaction:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function getFanEngagement(athleteId) {
  try {
    const reactions = mockReactions.filter(r => r.athlete_id === athleteId)
    
    return {
      totalReactions: reactions.length,
      reactionBreakdown: {
        fire: reactions.filter(r => r.reaction_type === 'fire').length,
        heart: reactions.filter(r => r.reaction_type === 'heart').length,
        clap: reactions.filter(r => r.reaction_type === 'clap').length
      }
    }
  } catch (error) {
    console.error('Error getting fan engagement:', error)
    return {
      totalReactions: 0,
      reactionBreakdown: { fire: 0, heart: 0, clap: 0 }
    }
  }
}

export async function getAthleteEarnings(athleteId) {
  try {
    const { data, error } = await supabase
      .from('athletes')
      .select('total_earnings, monthly_from_purchases')
      .eq('id', athleteId)
      .single()

    if (error) {
      console.error('Database error:', error)
      const mockAthlete = mockAthletes.find(a => a.id === athleteId)
      return mockAthlete ? {
        total_earnings: mockAthlete.total_earnings,
        monthly_from_purchases: mockAthlete.total_earnings * 0.6
      } : { total_earnings: 0, monthly_from_purchases: 0 }
    }

    return data
  } catch (error) {
    console.error('Error getting athlete earnings:', error)
    return { total_earnings: 0, monthly_from_purchases: 0 }
  }
}

export async function processLayerZeroTransfer(fromChain, toChain, amount, recipientAddress) {
  try {
    console.log('Processing LayerZero transfer:', { fromChain, toChain, amount, recipientAddress })
    
    // Mock LayerZero cross-chain transfer
    const txHash = `0x${Math.random().toString(16).slice(2, 18)}`
    
    return {
      success: true,
      txHash,
      estimatedTime: '2-5 minutes',
      message: 'Cross-chain transfer initiated'
    }
  } catch (error) {
    console.error('Error processing LayerZero transfer:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Additional exports for compatibility
export const initializeChilizProvider = () => chilizProvider
export const supportAthleteOnChiliz = supportAthlete