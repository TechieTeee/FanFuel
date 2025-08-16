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
    name: 'Marcus Williams',
    sport: 'Football',
    university: 'University of Oregon',
    total_earnings: 287.50,
    chiliz_token_address: '0x8f3Da5C1b2F7E9B6c4A1D9F8e7C6b5A4E3f2D1C0',
    token_symbol: 'MWFOOT'
  }
]

let mockReactions: any[] = []

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

// FanFuelToken Contract ABI (OpenZeppelin-based with SportFi features)
const FANFUEL_TOKEN_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function athleteInfo() view returns (tuple(string name, string sport, string university, string position, uint256 totalEarnings, uint256 fanCount, bool isActive))',
  'function supportAthlete(string reactionType) payable',
  'function getAthleteStats() view returns (uint256 totalEarnings, uint256 fanCount, uint256 totalSupported, uint256 transactionCount)',
  'function getFanStats(address fan) view returns (uint256 totalContributed, uint256 tokensEarned, uint256 supportCount)',
  'function getRecentSupport(uint256 count) view returns (tuple(address fan, uint256 amount, uint256 athleteShare, uint256 platformFee, uint256 timestamp, string reactionType)[])',
  'event AthleteSupported(address indexed fan, uint256 amount, uint256 athleteShare, uint256 platformFee, string reactionType)',
  'event TokensEarned(address indexed fan, uint256 tokensEarned, uint256 supportAmount)'
]

// ReactionNFT Contract ABI
const REACTION_NFT_ABI = [
  'function mintReaction(address fan, string athleteId, string athleteName, uint8 reactionType, uint256 supportAmount, string commentary, string metadataURI) returns (uint256)',
  'function getFanReactions(address fan) view returns (uint256[])',
  'function getAthleteReactions(string athleteId) view returns (uint256[])',
  'function getReactionData(uint256 tokenId) view returns (tuple(address fan, string athleteId, string athleteName, uint8 reactionType, uint256 supportAmount, string commentary, uint256 timestamp, string metadataURI, bool isSpecial))',
  'function getReactionTypeInfo(uint8 reactionType) view returns (string name, string emoji, uint256 minAmount)',
  'event ReactionMinted(uint256 indexed tokenId, address indexed fan, string indexed athleteId, uint8 reactionType, uint256 supportAmount)'
]

// REAL deployed contract addresses on Chiliz Spicy Testnet
// Deployed: 2025-08-16T15:18:35.995Z
// Deployer: 0x0AD5C175820d6760996E9496379D83C336d560D1
// Test Transaction: 0xded631a7245d847f71f397963e4dcd33c293d6e03cab4d2f809d98347c889bf9
const DEPLOYED_CONTRACTS = {
  SARAH_TOKEN: '0xec39e94bb2BDDfba995DF9EB14356657604155E5',
  MARCUS_TOKEN: '0xb9b687Bb5447287A3b30b1EDB6c4be112A934073',
  REACTION_NFT: '0xD5aa426E4702860155bAa6E3173C010420fc6326'
}

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

    // Get athlete data (try database first, fallback to mock)
    let athlete
    try {
      const { data: dbAthlete, error: dbError } = await supabase
        .from('athletes')
        .select('chiliz_token_address, name, total_earnings')
        .eq('id', athleteId)
        .single()

      athlete = dbError ? mockAthletes.find(a => a.id === athleteId) : dbAthlete
    } catch {
      athlete = mockAthletes.find(a => a.id === athleteId)
    }

    if (!athlete) {
      throw new Error('Athlete not found')
    }

    const amountWei = ethers.parseEther(amount)
    const athleteShare = amountWei * BigInt(80) / BigInt(100) // 80% to athlete
    const platformFee = amountWei - athleteShare // 20% platform fee

    // For demo: simulate transaction
    const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`

    // Store transaction (try database first, fallback to mock storage)
    try {
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

      if (!txError) {
        // Update athlete earnings in database
        await supabase
          .from('athletes')
          .update({ 
            total_earnings: athlete.total_earnings + parseFloat(ethers.formatEther(athleteShare))
          })
          .eq('id', athleteId)
      }
    } catch {
      // Fallback to mock storage
      mockReactions.push({
        fan_address: fanAddress,
        athlete_id: athleteId,
        reaction_type: 'support',
        amount: parseFloat(amount),
        blockchain: 'chiliz',
        transaction_hash: mockTxHash,
        created_at: new Date().toISOString()
      })

      // Update mock athlete earnings
      const mockAthlete = mockAthletes.find(a => a.id === athleteId)
      if (mockAthlete) {
        mockAthlete.total_earnings += parseFloat(ethers.formatEther(athleteShare))
      }
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

// Get contract instance
export const getFanFuelTokenContract = (athleteId: string) => {
  if (!chilizProvider) {
    initializeChilizProvider()
  }
  
  const contractAddress = athleteId === '1' ? DEPLOYED_CONTRACTS.SARAH_TOKEN : DEPLOYED_CONTRACTS.MARCUS_TOKEN
  return new ethers.Contract(contractAddress, FANFUEL_TOKEN_ABI, chilizProvider)
}

// Get ReactionNFT contract instance
export const getReactionNFTContract = () => {
  if (!chilizProvider) {
    initializeChilizProvider()
  }
  
  return new ethers.Contract(DEPLOYED_CONTRACTS.REACTION_NFT, REACTION_NFT_ABI, chilizProvider)
}

// Support athlete using deployed contract
export const supportAthleteWithContract = async (
  athleteId: string,
  amount: string,
  fanAddress: string,
  reactionType: string
): Promise<{
  success: boolean
  transactionHash?: string
  error?: string
}> => {
  try {
    if (!chilizWallet) {
      throw new Error('Chiliz wallet not initialized')
    }

    const contract = getFanFuelTokenContract(athleteId)
    const contractWithSigner = contract.connect(chilizWallet)
    
    const amountWei = ethers.parseEther(amount)
    
    // Call contract support function
    const tx = await contractWithSigner.supportAthlete(reactionType, { 
      value: amountWei,
      gasLimit: 300000
    })
    
    const receipt = await tx.wait()
    
    return {
      success: true,
      transactionHash: receipt.hash
    }
  } catch (error) {
    console.error('Contract support failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Contract interaction failed'
    }
  }
}

export { chilizProvider, chilizWallet, FANFUEL_TOKEN_ABI, REACTION_NFT_ABI }