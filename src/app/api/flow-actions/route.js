import { NextResponse } from 'next/server'

// Production-safe mock functions
const flowActionsService = {
  checkTriggers: async () => ({
    success: true,
    actions: ['reward_earned', 'level_up']
  }),
  getAvailableActions: () => [
    {
      id: 'first_reaction',
      name: 'First Reaction',
      description: 'Send your first reaction to an athlete',
      rewards: { xp: 10, tokens: { amount: 5 } }
    }
  ],
  getUserActions: () => [
    {
      id: 'completed_action',
      name: 'Welcome Action',
      rewards: { xp: 5, tokens: { amount: 2 } }
    }
  ],
  executeFlowAction: async () => ({
    success: true,
    rewardsEarned: { xp: 10, tokens: 5 }
  })
}

async function triggerAthleteSupport() {
  return {
    success: true,
    reward: 50,
    message: 'Athlete support reward earned'
  }
}

async function triggerViralReaction() {
  return {
    success: true,
    bonus: 25,
    message: 'Viral reaction bonus earned'
  }
}

async function executeActionRewards() {
  return {
    success: true,
    totalRewards: 100,
    message: 'Action rewards distributed'
  }
}

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
          triggeredActions = [await triggerAthleteSupport()]
        } else if (actionType === 'viral_reaction') {
          triggeredActions = [await triggerViralReaction()]
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
        const available = flowActionsService.getAvailableActions()
        const completed = flowActionsService.getUserActions()
        
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
        const { actionId } = params
        
        // Find the action
        const actionToSimulate = flowActionsService.getAvailableActions()
          .find(a => a.id === actionId)
        
        if (!actionToSimulate) {
          return NextResponse.json(
            { success: false, error: 'Action not found or already completed' },
            { status: 404 }
          )
        }
        
        // Execute the action
        const result = await flowActionsService.executeFlowAction()
        
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
      allActions: flowActionsService.getAvailableActions(),
      description: 'Flow Actions create meaningful NFT rewards for fan engagement'
    })
  }

  // Return user-specific progress
  const available = flowActionsService.getAvailableActions()
  const completed = flowActionsService.getUserActions()

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