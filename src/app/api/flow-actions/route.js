import { NextResponse } from 'next/server'
import { 
  flowActionsService, 
  triggerAthleteSupport, 
  triggerViralReaction,
  executeActionRewards 
} from '@/lib/flow-actions'

export async function POST(req) {
  try {
    const body = await req.json()
    const { action, userAddress, ...params } = body

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: 'User address required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'check_triggers': {
        const { actionType, athleteId, athleteName, reactionAmount, viralityScore } = params
        
        let triggeredActions = []
        
        if (actionType === 'athlete_support') {
          triggeredActions = [await triggerAthleteSupport(
            userAddress,
            athleteId,
            athleteName,
            reactionAmount,
            viralityScore
          )]
        } else if (actionType === 'viral_reaction') {
          triggeredActions = [await triggerViralReaction(
            userAddress,
            viralityScore,
            athleteId
          )]
        }
        
        return NextResponse.json({
          success: true,
          triggeredActions
        })
      }

      case 'execute_rewards': {
        const { triggeredActions, context } = params
        
        const results = await executeActionRewards(userAddress, triggeredActions, context)
        
        return NextResponse.json({
          success: true,
          results
        })
      }

      case 'get_user_progress': {
        const available = flowActionsService.getAvailableActions(userAddress)
        const completed = flowActionsService.getUserActions(userAddress)
        
        return NextResponse.json({
          success: true,
          progress: {
            available: available.length,
            completed: completed.length,
            totalXP: completed.reduce((sum, action) => sum + (action.rewards.xp || 0), 0),
            totalTokens: completed.reduce((sum, action) => sum + (action.rewards.tokens?.amount || 0), 0)
          },
          availableActions: available,
          completedActions: completed
        })
      }

      case 'simulate_action': {
        const { actionId, context } = params
        
        // Find the action
        const actionToSimulate = flowActionsService.getAvailableActions(userAddress)
          .find(a => a.id === actionId)
        
        if (!actionToSimulate) {
          return NextResponse.json(
            { success: false, error: 'Action not found or already completed' },
            { status: 404 }
          )
        }
        
        // Execute the action
        const result = await flowActionsService.executeFlowAction(
          userAddress,
          actionToSimulate,
          context
        )
        
        return NextResponse.json({
          success: true,
          action: actionToSimulate,
          result
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Flow Actions API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userAddress = searchParams.get('userAddress')

  if (!userAddress) {
    // Return all available Flow Actions without user-specific data
    return NextResponse.json({
      success: true,
      allActions: flowActionsService.getAvailableActions(''),
      description: 'Flow Actions create meaningful NFT rewards for fan engagement'
    })
  }

  // Return user-specific progress
  const available = flowActionsService.getAvailableActions(userAddress)
  const completed = flowActionsService.getUserActions(userAddress)

  return NextResponse.json({
    success: true,
    userAddress,
    progress: {
      available: available.length,
      completed: completed.length,
      totalXP: completed.reduce((sum, action) => sum + (action.rewards.xp || 0), 0),
      completionRate: (completed.length / (completed.length + available.length)) * 100
    },
    availableActions: available,
    completedActions: completed
  })
}