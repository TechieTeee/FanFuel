import { NextResponse } from 'next/server'
import { ethers } from 'ethers'
import { createLayerZeroService, bridgeAthleteTokens, syncFanIdentityAcrossChains } from '@/lib/layerzero'

export async function POST(req) {
  try {
    const body = await req.json()
    const { action, ...params } = body

    // Create provider (using Chiliz as default)
    const provider = new ethers.JsonRpcProvider(
      process.env.CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com/'
    )

    switch (action) {
      case 'estimate_fees': {
        const { srcChainId, destChainId, payload } = params
        const service = createLayerZeroService(provider)
        
        const fees = await service.estimateCrossChainFees(srcChainId, destChainId, payload, params.gasLimit || 200000)
        
        return NextResponse.json({
          success: true,
          fees
        })
      }

      case 'bridge_tokens': {
        const { fromChain, toChain, tokenAddress, amount, recipient, privateKey } = params
        
        // Create signer from private key (in production, use user's wallet)
        const signer = new ethers.Wallet(privateKey, provider)
        
        const result = await bridgeAthleteTokens(
          fromChain,
          toChain,
          tokenAddress,
          amount,
          recipient,
          provider,
          signer
        )
        
        return NextResponse.json(result)
      }

      case 'sync_identity': {
        const { fanAddress, targetChains, privateKey } = params
        
        const signer = new ethers.Wallet(privateKey, provider)
        
        const result = await syncFanIdentityAcrossChains(
          fanAddress,
          targetChains,
          provider,
          signer
        )
        
        return NextResponse.json(result)
      }

      case 'get_supported_chains': {
        const service = createLayerZeroService(provider)
        const chains = service.getSupportedChains()
        
        return NextResponse.json({
          success: true,
          chains
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('LayerZero API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}