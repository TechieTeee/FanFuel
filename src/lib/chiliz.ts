import { ethers } from 'ethers'
import { supabase } from './supabase'

// Chiliz Chain configuration
const CHILIZ_RPC_URL = process.env.CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com/'
const CHILIZ_CHAIN_ID = 88882 // Chiliz Spicy Testnet
const CHILIZ_PRIVATE_KEY = process.env.CHILIZ_PRIVATE_KEY

// SportFi native configuration
const CHZ_DECIMALS = 18
const ATHLETE_TOKEN_SUPPLY = ethers.parseEther('1000000') // 1M tokens per athlete

export interface AthleteData {
  id: string
  name: string
  sport: string
  university: string
  position?: string
  year?: string
}

export interface FanSupportTransaction {
  athleteId: string
  amount: string
  fanAddress: string
  transactionHash?: string
}

export interface ChilizWalletInfo {
  address: string
  chzBalance: string
  athleteTokens: AthleteToken[]
}

export interface AthleteToken {
  tokenAddress: string
  athleteId: string
  symbol: string
  balance: string
}

// Initialize Chiliz provider
let chilizProvider: ethers.JsonRpcProvider
let chilizWallet: ethers.Wallet

export const initializeChilizProvider = () => {
  try {
    chilizProvider = new ethers.JsonRpcProvider(CHILIZ_RPC_URL)
    
    if (CHILIZ_PRIVATE_KEY) {
      chilizWallet = new ethers.Wallet(CHILIZ_PRIVATE_KEY, chilizProvider)
    }
    
    return { success: true, provider: chilizProvider }
  } catch (error) {
    console.error('Failed to initialize Chiliz provider:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Athlete Token Contract ABI (simplified ERC-20 with sport features)
const ATHLETE_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function supportAthlete(uint256 amount) external payable',
  'function getAthleteEarnings() view returns (uint256)',
  'function athleteInfo() view returns (tuple(string name, string sport, string university))',
  'event AthleteSupported(address indexed fan, uint256 amount, uint256 athleteShare)'
]

// Simple Athlete Token Factory ABI
const TOKEN_FACTORY_ABI = [
  'function createAthleteToken(string memory name, string memory symbol, string memory sport, string memory university) returns (address)',
  'function getAthleteToken(string memory athleteId) view returns (address)',
  'event AthleteTokenCreated(string indexed athleteId, address indexed tokenAddress)'
]

// Deploy athlete token on Chiliz Chain
export const createAthleteToken = async (athleteData: AthleteData): Promise<{
  success: boolean
  tokenAddress?: string
  error?: string
}> => {
  try {
    if (!chilizWallet) {
      throw new Error('Chiliz wallet not initialized')
    }

    // For demo purposes, we'll create a mock token deployment
    const tokenSymbol = `${athleteData.name.split(' ').map(n => n[0]).join('')}${athleteData.sport.slice(0,3).toUpperCase()}`
    const tokenName = `${athleteData.name} Fan Token`

    // Simulate token deployment
    const mockTokenAddress = ethers.getCreateAddress({
      from: chilizWallet.address,
      nonce: Date.now()
    })

    // Store in database
    const { error: dbError } = await supabase
      .from('athletes')
      .update({ 
        chiliz_token_address: mockTokenAddress,
        token_symbol: tokenSymbol 
      })
      .eq('id', athleteData.id)

    if (dbError) {
      throw new Error(`Database update failed: ${dbError.message}`)
    }

    return {
      success: true,
      tokenAddress: mockTokenAddress
    }
  } catch (error) {
    console.error('Failed to create athlete token:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Support athlete with CHZ tokens
export const supportAthleteOnChiliz = async (
  athleteId: string,
  amount: string,
  fanAddress: string
): Promise<{
  success: boolean
  transactionHash?: string
  athleteShare?: string
  error?: string
}> => {
  try {
    if (!chilizProvider || !chilizWallet) {
      throw new Error('Chiliz provider not initialized')
    }

    // Get athlete token address from database
    const { data: athlete, error: dbError } = await supabase
      .from('athletes')
      .select('chiliz_token_address, name')
      .eq('id', athleteId)
      .single()

    if (dbError || !athlete) {
      throw new Error('Athlete not found')
    }

    const amountWei = ethers.parseEther(amount)
    const athleteShare = amountWei * BigInt(80) / BigInt(100) // 80% to athlete
    const platformFee = amountWei - athleteShare // 20% platform fee

    // For demo: simulate transaction
    const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`

    // Store transaction in database
    const { error: txError } = await supabase
      .from('fan_reactions')
      .insert({
        fan_address: fanAddress,
        athlete_id: athleteId,
        reaction_type: 'support',
        amount: parseFloat(amount),
        blockchain: 'chiliz',
        transaction_hash: mockTxHash
      })

    if (txError) {
      throw new Error(`Transaction recording failed: ${txError.message}`)
    }

    // Update athlete earnings
    const { error: updateError } = await supabase
      .from('athletes')
      .update({ 
        total_earnings: athlete.total_earnings + parseFloat(ethers.formatEther(athleteShare))
      })
      .eq('id', athleteId)

    if (updateError) {
      console.error('Failed to update athlete earnings:', updateError)
    }

    return {
      success: true,
      transactionHash: mockTxHash,
      athleteShare: ethers.formatEther(athleteShare)
    }
  } catch (error) {
    console.error('Failed to support athlete on Chiliz:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get CHZ balance for connected wallet
export const getChilizBalance = async (address: string): Promise<{
  success: boolean
  balance?: string
  error?: string
}> => {
  try {
    if (!chilizProvider) {
      const initResult = initializeChilizProvider()
      if (!initResult.success) {
        throw new Error('Failed to initialize Chiliz provider')
      }
    }

    const balanceWei = await chilizProvider.getBalance(address)
    const balanceEth = ethers.formatEther(balanceWei)

    return {
      success: true,
      balance: balanceEth
    }
  } catch (error) {
    console.error('Failed to get CHZ balance:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get athlete tokens owned by fan
export const getFanAthleteTokens = async (fanAddress: string): Promise<{
  success: boolean
  tokens?: AthleteToken[]
  error?: string
}> => {
  try {
    // Get all supported athletes from database
    const { data: reactions, error: dbError } = await supabase
      .from('fan_reactions')
      .select(`
        athlete_id,
        amount,
        athletes (
          name,
          sport,
          chiliz_token_address,
          token_symbol
        )
      `)
      .eq('fan_address', fanAddress)
      .eq('blockchain', 'chiliz')

    if (dbError) {
      throw new Error(`Database query failed: ${dbError.message}`)
    }

    // Aggregate token holdings by athlete
    const tokenMap = new Map<string, AthleteToken>()
    
    reactions?.forEach(reaction => {
      const athlete = reaction.athletes
      const athleteId = reaction.athlete_id
      
      if (athlete && athlete.chiliz_token_address) {
        const existing = tokenMap.get(athleteId)
        const currentBalance = existing ? parseFloat(existing.balance) : 0
        
        tokenMap.set(athleteId, {
          tokenAddress: athlete.chiliz_token_address,
          athleteId: athleteId,
          symbol: athlete.token_symbol || `${athlete.name.split(' ').map(n => n[0]).join('')}`,
          balance: (currentBalance + reaction.amount).toString()
        })
      }
    })

    return {
      success: true,
      tokens: Array.from(tokenMap.values())
    }
  } catch (error) {
    console.error('Failed to get fan athlete tokens:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get SportFi ecosystem information
export const getChilizEcosystemInfo = async (): Promise<{
  success: boolean
  info?: {
    totalSportsTokens: number
    totalFans: number
    totalVolume: string
    popularSports: string[]
  }
  error?: string
}> => {
  try {
    // Mock SportFi ecosystem data (in production, query from Chiliz APIs)
    return {
      success: true,
      info: {
        totalSportsTokens: 47,
        totalFans: 2100000,
        totalVolume: '2847529.5',
        popularSports: ['Football', 'Basketball', 'Soccer', 'Tennis', 'Baseball']
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Initialize Chiliz connection when module loads
if (typeof window === 'undefined') {
  // Server-side initialization
  initializeChilizProvider()
}

export { chilizProvider, chilizWallet }