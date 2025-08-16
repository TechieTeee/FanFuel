'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { flowActionsService, type FlowAction, executeActionRewards } from '../lib/flow-actions'

interface FlowActionsProps {
  userAddress?: string
  showAchievements?: boolean
}

export default function FlowActions({ userAddress, showAchievements = true }: FlowActionsProps) {
  const [availableActions, setAvailableActions] = useState<FlowAction[]>([])
  const [completedActions, setCompletedActions] = useState<FlowAction[]>([])
  const [recentRewards, setRecentRewards] = useState<unknown[]>([])
  const [showRewardsModal, setShowRewardsModal] = useState(false)

  useEffect(() => {
    if (userAddress) {
      loadUserActions()
    }
  }, [userAddress])

  const loadUserActions = useCallback(() => {
    if (!userAddress) return

    const available = flowActionsService.getAvailableActions(userAddress)
    const completed = flowActionsService.getUserActions(userAddress)
    
    setAvailableActions(available)
    setCompletedActions(completed)
  }, [userAddress])

  // Handle action completion and reward distribution
  const handleActionCompleted = useCallback(async (
    action: FlowAction,
    context: unknown
  ) => {
    if (!userAddress) return

    try {
      const results = await executeActionRewards(userAddress, [action], context)
      
      if (results[0]?.result.success) {
        setRecentRewards(prev => [...prev, { action, ...results[0].result }])
        setShowRewardsModal(true)
        loadUserActions() // Refresh action lists
        
        // Auto-hide rewards modal after 4 seconds
        setTimeout(() => setShowRewardsModal(false), 4000)
      }
    } catch (error) {
      console.error('Action reward failed:', error)
    }
  }, [userAddress, loadUserActions])

  const getActionIcon = useMemo(() => (type: string) => {
    switch (type) {
      case 'champion_support': return '🏆'
      case 'viral_reaction': return '🔥'
      case 'milestone_achievement': return '💎'
      case 'community_rally': return '🚀'
      default: return '⚡'
    }
  }, [])

  const getRarityColor = useMemo(() => (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-500 to-amber-600'
      case 'Epic': return 'from-purple-500 to-indigo-600'
      case 'Rare': return 'from-blue-500 to-cyan-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Available Actions */}
      {availableActions.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            ⚡ Available Flow Actions
          </h3>
          <div className="space-y-3">
            {availableActions.slice(0, 3).map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-black/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getActionIcon(action.type)}</span>
                      <div>
                        <h4 className="font-bold text-white">{action.title}</h4>
                        <p className="text-sm text-gray-300">{action.description}</p>
                      </div>
                    </div>
                    
                    {/* Rewards Preview */}
                    <div className="flex items-center space-x-4 mt-3">
                      <div className={`bg-gradient-to-r ${getRarityColor(action.rewards.nftMetadata.rarity)} px-3 py-1 rounded-full`}>
                        <span className="text-xs font-bold text-white">
                          {action.rewards.nftMetadata.rarity} NFT
                        </span>
                      </div>
                      {action.rewards.tokens && (
                        <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                          <span className="text-xs font-bold text-orange-300">
                            +{action.rewards.tokens.amount} {action.rewards.tokens.symbol}
                          </span>
                        </div>
                      )}
                      {action.rewards.xp && (
                        <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                          <span className="text-xs font-bold text-green-300">
                            +{action.rewards.xp} XP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Completed Achievements */}
      {showAchievements && completedActions.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
        >
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            🏆 Completed Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedActions.map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.05 }}
                className="bg-black/50 rounded-xl p-4 border border-green-500/20"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">{getActionIcon(action.type)}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{action.title}</h4>
                    <div className={`bg-gradient-to-r ${getRarityColor(action.rewards.nftMetadata.rarity)} px-2 py-1 rounded-full mt-1`}>
                      <span className="text-xs font-bold text-white">
                        {action.rewards.nftMetadata.rarity}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rewards Modal */}
      <AnimatePresence>
        {showRewardsModal && recentRewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowRewardsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  Flow Action Completed!
                </h3>
                
                {recentRewards.map((reward, index) => (
                  <div key={index} className="mb-6">
                    <div className={`bg-gradient-to-r ${getRarityColor(reward.action.rewards.nftMetadata.rarity)} rounded-xl p-4 mb-4`}>
                      <h4 className="font-bold text-white mb-2">
                        {reward.action.rewards.nftMetadata.name}
                      </h4>
                      <p className="text-sm text-white/90">
                        {reward.action.rewards.nftMetadata.description}
                      </p>
                    </div>
                    
                    {/* Rewards Summary */}
                    <div className="space-y-2">
                      {reward.action.rewards.tokens && (
                        <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-500/30">
                          <span className="text-orange-300 font-bold">
                            +{reward.action.rewards.tokens.amount} {reward.action.rewards.tokens.symbol}
                          </span>
                        </div>
                      )}
                      {reward.action.rewards.xp && (
                        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                          <span className="text-green-300 font-bold">
                            +{reward.action.rewards.xp} XP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRewardsModal(false)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}