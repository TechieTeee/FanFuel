import { NextRequest, NextResponse } from 'next/server'
import { 
  supportAthleteOnChiliz, 
  createAthleteToken, 
  getChilizBalance,
  initializeChilizProvider 
} from '@/lib/chiliz'

// POST /api/chiliz - Handle Chiliz Chain operations
export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    // Initialize Chiliz provider
    const initResult = initializeChilizProvider()
    if (!initResult.success) {
      return NextResponse.json(
        { error: 'Failed to initialize Chiliz provider' },
        { status: 500 }
      )
    }

    switch (action) {
      case 'support_athlete':
        const { athleteId, amount, fanAddress } = params
        
        if (!athleteId || !amount || !fanAddress) {
          return NextResponse.json(
            { error: 'Missing required parameters: athleteId, amount, fanAddress' },
            { status: 400 }
          )
        }

        const supportResult = await supportAthleteOnChiliz(athleteId, amount, fanAddress)
        
        if (supportResult.success) {
          return NextResponse.json({
            success: true,
            transactionHash: supportResult.transactionHash,
            athleteShare: supportResult.athleteShare,
            message: `Successfully sent ${supportResult.athleteShare} CHZ to athlete`
          })
        } else {
          return NextResponse.json(
            { error: supportResult.error || 'Failed to support athlete' },
            { status: 500 }
          )
        }

      case 'create_athlete_token':
        const { athleteData } = params
        
        if (!athleteData || !athleteData.name || !athleteData.sport) {
          return NextResponse.json(
            { error: 'Missing athlete data' },
            { status: 400 }
          )
        }

        const tokenResult = await createAthleteToken(athleteData)
        
        if (tokenResult.success) {
          return NextResponse.json({
            success: true,
            tokenAddress: tokenResult.tokenAddress,
            message: 'Athlete token created successfully'
          })
        } else {
          return NextResponse.json(
            { error: tokenResult.error || 'Failed to create athlete token' },
            { status: 500 }
          )
        }

      case 'get_balance':
        const { address } = params
        
        if (!address) {
          return NextResponse.json(
            { error: 'Missing wallet address' },
            { status: 400 }
          )
        }

        const balanceResult = await getChilizBalance(address)
        
        if (balanceResult.success) {
          return NextResponse.json({
            success: true,
            balance: balanceResult.balance,
            symbol: 'CHZ'
          })
        } else {
          return NextResponse.json(
            { error: balanceResult.error || 'Failed to get balance' },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Chiliz API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/chiliz - Get ecosystem information
export async function GET() {
  try {
    const initResult = initializeChilizProvider()
    if (!initResult.success) {
      return NextResponse.json(
        { error: 'Failed to initialize Chiliz provider' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      chainInfo: {
        name: 'Chiliz Spicy Testnet',
        chainId: 88882,
        symbol: 'CHZ',
        explorer: 'https://spicy-explorer.chiliz.com/',
        rpc: 'https://spicy-rpc.chiliz.com/'
      },
      sportfiFeatures: [
        'Native sports fan tokenization',
        'EVM-compatible smart contracts',
        'Low transaction costs for microtransactions',
        '2M+ existing sports fans',
        'Seamless athlete token creation'
      ]
    })
  } catch (error) {
    console.error('Chiliz ecosystem API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}