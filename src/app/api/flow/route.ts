import { NextRequest, NextResponse } from 'next/server'
import { createFlowService, mintReactionNFTForUser, getUserFlowNFTs, type ReactionNFTConfig } from '@/lib/flow'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...params } = body

    const flowService = createFlowService()

    switch (action) {
      case 'initialize_account': {
        const { userAddress } = params
        
        const result = await flowService.initializeFlowAccount(userAddress)
        return NextResponse.json(result)
      }

      case 'mint_reaction_nft': {
        const config: ReactionNFTConfig = {
          athleteId: params.athleteId,
          athleteName: params.athleteName,
          reactionType: params.reactionType,
          reactionAmount: params.reactionAmount,
          commentaryText: params.commentaryText,
          sentimentScore: params.sentimentScore || 0.5,
          viralityScore: params.viralityScore || 0.3,
          timestamp: new Date().toISOString()
        }
        
        const result = await mintReactionNFTForUser(config)
        
        // If successful, also store in Supabase for tracking
        if (result.success) {
          // TODO: Add Supabase integration to store NFT metadata
          console.log('NFT minted successfully:', result.nftId)
        }
        
        return NextResponse.json(result)
      }

      case 'get_user_nfts': {
        const { flowAddress } = params
        
        const nfts = await getUserFlowNFTs(flowAddress)
        
        return NextResponse.json({
          success: true,
          nfts
        })
      }

      case 'get_account_info': {
        const { flowAddress } = params
        
        const result = await flowService.getAccountInfo(flowAddress)
        return NextResponse.json(result)
      }

      case 'get_nft_marketplace': {
        // Mock marketplace data - replace with actual Flow marketplace queries
        const mockMarketplace = {
          featured_nfts: [
            {
              id: 'featured_1',
              name: 'Legend Reaction - Championship Game',
              price: '50.0',
              currency: 'FLOW',
              rarity: 'Legendary',
              athlete: 'Sarah Johnson',
              image: 'https://fanfuel.app/nft-images/legend-championship.png'
            }
          ],
          recent_sales: [
            {
              id: 'sale_1',
              nft_name: 'Fire Reaction',
              price: '5.0',
              currency: 'FLOW',
              timestamp: '2025-01-16T10:00:00Z'
            }
          ],
          total_volume: '12,547.50',
          total_sales: 1247
        }

        return NextResponse.json({
          success: true,
          marketplace: mockMarketplace
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Flow API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return Flow service status and capabilities
  return NextResponse.json({
    success: true,
    service: 'Flow NFT Service',
    status: 'active',
    capabilities: [
      'NFT Minting',
      'Account Management', 
      'Marketplace Integration',
      'Cross-chain Identity'
    ],
    endpoints: {
      initialize_account: 'POST /api/flow { action: "initialize_account", userAddress }',
      mint_nft: 'POST /api/flow { action: "mint_reaction_nft", athleteId, reactionType, ... }',
      get_nfts: 'POST /api/flow { action: "get_user_nfts", flowAddress }',
      marketplace: 'POST /api/flow { action: "get_nft_marketplace" }'
    }
  })
}