'use client'

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { demoAthletes } from '../../../data/demo-athletes';
import { demoTransactions } from '../../../data/demo-transactions';
import FlowActions from '../../components/FlowActions';
import CustomCursor from '../../components/CustomCursor';
import AnimatedBackground from '../../components/AnimatedBackground';
import HoverNavigation from '../../components/HoverNavigation.js';
import EnhancedWallet from '../../components/web3/EnhancedWallet';
import TransactionFlow from '../../components/TransactionFlow';
import { triggerAthleteSupport, executeActionRewards } from '../../lib/flow-actions';

export default function Spending() {
  const [fuelieState, setFuelieState] = useState('waving')
  const [showTransactionFlow, setShowTransactionFlow] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [userAddress, setUserAddress] = useState('0x1234567890123456789012345678901234567890')

  // Use demo athletes as mock data
  const mockAthletes = demoAthletes

  const executeTransaction = useCallback(async (transaction) => {
    console.log('Executing transaction:', transaction)
    setShowTransactionFlow(false)
  }, [])

  const getFuelieImage = useMemo(() => {
    switch(fuelieState) {
      case 'eyes-closed':
        return '/fuelie-eyes-closed.png'
      case 'sitting':
        return '/fuelie-sitting.png'
      default:
        return '/fuelie-waving.png'
    }
  }, [fuelieState])

  const handleSupportAthlete = useCallback(async (athleteId, amount) => {
    setFuelieState('eyes-closed')
    
    try {
      // Call Chiliz API to process athlete support
      const response = await fetch('/api/chiliz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'support_athlete',
          athleteId,
          amount: amount.toString(),
          fanAddress: userAddress
        })
      })

      const result = await response.json()

      if (result.success) {
        setFuelieState('sitting')
        
        // Trigger Flow Actions for athlete support
        const athlete = demoAthletes.find(a => a.id === athleteId)
        const triggeredActions = await triggerAthleteSupport(
          userAddress,
          athleteId,
          athlete?.name || 'Unknown Athlete',
          amount,
          0.5 // Default virality score
        )

        // Execute rewards for triggered actions
        if (triggeredActions.length > 0) {
          await executeActionRewards(userAddress, triggeredActions, {
            athleteId,
            athleteName: athlete?.name,
            reactionAmount: amount,
            viralityScore: 0.5
          })
        }
        
        alert(`🏆 Successfully sent ${result.athleteShare} CHZ to athlete!\nTx: ${result.transactionHash?.slice(0, 10)}...\n${triggeredActions.length > 0 ? `\n🎉 ${triggeredActions.length} Flow Action(s) triggered!` : ''}`)
      } else {
        throw new Error(result.error || 'Transaction failed')
      }
    } catch (error) {
      setFuelieState('waving')
      alert(`❌ Failed to support athlete: ${error.message}`)
    }
  }, [userAddress, demoAthletes])

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CustomCursor />
      <AnimatedBackground />
      <HoverNavigation />

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-40 px-6 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-3xl font-black text-white bg-gradient-to-r from-[#f59e0b] to-white bg-clip-text text-transparent">
            FanFuel
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/alerts" className="text-[#ef4444] hover:text-white transition-colors duration-300 font-bold uppercase tracking-wide">
            📺 FuelFeed
          </Link>
<EnhancedWallet />
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Page Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-wider mb-4">
            ⛽ FuelStation
          </h1>
          <p className="text-xl text-[#f59e0b] font-semibold">
            Where every purchase powers champions
          </p>
        </motion.div>

        {/* Tap-to-Pay Status */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl shadow-2xl p-8 mb-12 text-white border border-[#10b981]/30 backdrop-blur-lg max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black mb-3 uppercase tracking-wider">💳 ENGINE STATUS: ACTIVE</h2>
              <p className="text-green-100 mb-6 text-lg font-medium">Every purchase automatically fuels your champions!</p>
              <div className="grid grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/30 rounded-xl p-4 border border-white/20"
                >
                  <p className="text-sm text-green-200 font-medium">This Month</p>
                  <p className="text-2xl font-black text-white">$45.80</p>
                  <p className="text-xs text-green-300 font-medium">🏆 to champions</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/30 rounded-xl p-4 border border-white/20"
                >
                  <p className="text-sm text-green-200 font-medium">Fuel Strikes</p>
                  <p className="text-2xl font-black text-white">127</p>
                  <p className="text-xs text-green-300 font-medium">⚡ this month</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-black/30 rounded-xl p-4 border border-white/20"
                >
                  <p className="text-sm text-green-200 font-medium">Impact Radius</p>
                  <p className="text-2xl font-black text-white">2</p>
                  <p className="text-xs text-green-300 font-medium">🚀 athletes fueled</p>
                </motion.div>
              </div>
            </div>
            <div className="text-center">
              <Image
                src={getFuelieImage()}
                alt="Fuelie Mascot"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 text-center"
          >
            <div className="text-4xl mb-3">📊</div>
            <p className="text-2xl font-black text-[#10b981]">127</p>
            <p className="text-sm text-gray-300 font-medium">Total Transactions</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 text-center"
          >
            <div className="text-4xl mb-3">💰</div>
            <p className="text-2xl font-black text-[#f59e0b]">$1,247.83</p>
            <p className="text-sm text-gray-300 font-medium">Total Spent</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 text-center"
          >
            <div className="text-4xl mb-3">🚀</div>
            <p className="text-2xl font-black text-[#10b981]">$62.39</p>
            <p className="text-sm text-gray-300 font-medium">Athlete Fuel</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 text-center"
          >
            <div className="text-4xl mb-3">⚡</div>
            <p className="text-2xl font-black text-[#f59e0b]">5.0%</p>
            <p className="text-sm text-gray-300 font-medium">Avg. Impact Rate</p>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto"
        >
          {/* Spending Chart */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 text-center">📈 Weekly Fuel Impact</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Monday</span>
                <div className="flex-1 mx-4 bg-gray-700/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#059669] h-3 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="text-[#10b981] font-bold">$8.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Tuesday</span>
                <div className="flex-1 mx-4 bg-gray-700/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] h-3 rounded-full" style={{width: '65%'}}></div>
                </div>
                <span className="text-[#f59e0b] font-bold">$6.20</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Wednesday</span>
                <div className="flex-1 mx-4 bg-gray-700/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#059669] h-3 rounded-full" style={{width: '95%'}}></div>
                </div>
                <span className="text-[#10b981] font-bold">$9.80</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Thursday</span>
                <div className="flex-1 mx-4 bg-gray-700/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full" style={{width: '120%'}}></div>
                </div>
                <span className="text-purple-400 font-bold">$12.40</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Friday</span>
                <div className="flex-1 mx-4 bg-gray-700/50 rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] h-3 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-[#f59e0b] font-bold">$7.30</span>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 text-center">🎯 Fuel Categories</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium flex items-center">
                    ☕ Food & Drink
                  </span>
                  <span className="text-[#10b981] font-bold">$18.45</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#059669] h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium flex items-center">
                    🛒 Shopping
                  </span>
                  <span className="text-[#f59e0b] font-bold">$15.67</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium flex items-center">
                    ⛽ Gas & Transport
                  </span>
                  <span className="text-purple-400 font-bold">$11.27</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
              <div className="border-t border-gray-600/50 pt-4 mt-6">
                <div className="text-center">
                  <p className="text-lg font-black text-white mb-2">🏆 Total Impact This Month</p>
                  <p className="text-3xl font-black text-[#10b981]">$45.39</p>
                  <p className="text-sm text-gray-400 font-medium">across 2 champions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Athletes List */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-wider text-center">🏆 Your Champions</h2>
            <div className="space-y-6">
              {mockAthletes.map((athlete, index) => (
                <motion.div 
                  key={athlete.id} 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-black/50 border border-gray-700/50 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-[#f59e0b]/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-xl text-white mb-1">{athlete.name}</h3>
                      <p className="text-[#f59e0b] font-semibold">{athlete.sport} • {athlete.university}</p>
                      <p className="text-sm text-gray-300">{athlete.position} • {athlete.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl text-[#10b981]">${athlete.total_earnings}</p>
                      <p className="text-xs text-gray-400 font-medium">🔥 {athlete.fan_count} fans</p>
                      <p className="text-xs text-[#f59e0b] font-bold">${athlete.monthly_from_purchases}/mo fuel</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{athlete.background}</p>
                  
                  {/* Performance Stats */}
                  <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-600/30">
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">📊 Recent Performance</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {athlete.sport === 'Basketball' ? (
                        <>
                          <div>
                            <p className="text-lg font-black text-[#f59e0b]">{athlete.recent_performance.points}</p>
                            <p className="text-xs text-gray-400">Points</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#10b981]">{athlete.recent_performance.assists}</p>
                            <p className="text-xs text-gray-400">Assists</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-purple-400">{athlete.recent_performance.rebounds}</p>
                            <p className="text-xs text-gray-400">Rebounds</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-lg font-black text-[#f59e0b]">{athlete.recent_performance.receptions}</p>
                            <p className="text-xs text-gray-400">Catches</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-[#10b981]">{athlete.recent_performance.yards}</p>
                            <p className="text-xs text-gray-400">Yards</p>
                          </div>
                          <div>
                            <p className="text-lg font-black text-purple-400">{athlete.recent_performance.touchdowns}</p>
                            <p className="text-xs text-gray-400">TDs</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSupportAthlete(athlete.id, 5)}
                      className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] text-white py-3 rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold uppercase tracking-wide"
                    >
                      💳 Set as Main
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSupportAthlete(athlete.id, 10)}
                      className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-bold"
                    >
                      ⚡ +$10
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Transaction History */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-wider text-center">📈 Fuel History</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {demoTransactions.map((transaction, index) => {
                const athlete = demoAthletes.find(a => a.id === transaction.athlete_id)
                const percentage = ((transaction.athlete_portion / transaction.amount) * 100).toFixed(1)
                return (
                  <motion.div 
                    key={transaction.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="bg-black/50 border border-gray-700/50 rounded-xl p-5 hover:border-[#f59e0b]/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-white text-lg">{transaction.merchant}</h3>
                          <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                            {transaction.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{transaction.location}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(transaction.timestamp).toLocaleDateString()} • {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white mb-1">${transaction.amount}</p>
                        <p className="text-sm text-[#10b981] font-bold">+${transaction.athlete_portion} ({percentage}%)</p>
                        <p className="text-xs text-[#f59e0b] font-medium">→ {athlete?.name}</p>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-medium">💪 Athlete Impact</span>
                        <span className="text-[#10b981] font-bold">${transaction.athlete_portion}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-[#10b981] to-[#059669] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Flow Actions Integration */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <FlowActions userAddress={userAddress} showAchievements={true} />
        </motion.div>

        {/* Crypto Rewards Section */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/30 max-w-6xl mx-auto mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-4">🎁 Crypto Rewards</h2>
            <p className="text-xl text-purple-300 font-semibold">Earn tokens for every dollar you fuel</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-black/50 rounded-xl p-6 border border-purple-500/30 text-center"
            >
              <div className="text-5xl mb-4">🪙</div>
              <h3 className="text-2xl font-black text-white mb-2">FUEL Tokens</h3>
              <p className="text-3xl font-black text-purple-400 mb-2">2,547</p>
              <p className="text-sm text-gray-300 font-medium">1 FUEL = $1 spent</p>
              <div className="mt-4 bg-purple-900/30 rounded-lg p-3">
                <p className="text-xs text-purple-300 font-bold">💎 This Month: +127 FUEL</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-black/50 rounded-xl p-6 border border-blue-500/30 text-center"
            >
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-black text-white mb-2">Impact NFTs</h3>
              <p className="text-3xl font-black text-blue-400 mb-2">7</p>
              <p className="text-sm text-gray-300 font-medium">Milestone rewards earned</p>
              <div className="mt-4 bg-blue-900/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 font-bold">🏆 Next: 100 transactions</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-black/50 rounded-xl p-6 border border-[#f59e0b]/30 text-center"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-black text-white mb-2">Multiplier</h3>
              <p className="text-3xl font-black text-[#f59e0b] mb-2">2.4x</p>
              <p className="text-sm text-gray-300 font-medium">Champion loyalty bonus</p>
              <div className="mt-4 bg-orange-900/30 rounded-lg p-3">
                <p className="text-xs text-orange-300 font-bold">🔥 Level 5 Supporter</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-black hover:shadow-xl transition-all duration-300 uppercase tracking-wide"
            >
              🏆 Claim Rewards
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Wallet Integration */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-md mx-auto mt-12"
        >
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 text-center">💰 SportFi Wallet</h3>
            <div className="flex justify-center">
    <EnhancedWallet />

            </div>
          </div>
        </motion.div>

        {/* Transaction Flow Modal */}
        <TransactionFlow
          isOpen={showTransactionFlow}
          onClose={() => setShowTransactionFlow(false)}
          transaction={currentTransaction}
          onConfirm={executeTransaction}
        />

      </div>
    </div>
  )
}