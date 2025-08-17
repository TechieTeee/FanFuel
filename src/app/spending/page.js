'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { demoAthletes } from '../../../data/demo-athletes';

import { demoTransactions } from '../../../data/demo-transactions';
import FlowActions from '../../components/FlowActions';
import CustomCursor from '../../components/CustomCursor';
import AnimatedBackground from '../../components/AnimatedBackground';
import HoverNavigation from '../../components/HoverNavigation.js';
import MinimalWallet from '../../components/web3/MinimalWallet';
import TransactionFlow from '../../components/TransactionFlow';
import PersonalizedAds from '../../components/PersonalizedAds';
// import AthleteInsights from '../../components/AthleteInsights'; // Unused
import FuelClips from '../../components/FuelClips';
import FueliChatBubble from '../../components/FueliChatBubble';
import { triggerAthleteSupport, executeActionRewards } from '../../lib/flow-actions';

export default function Spending() {
  const [fuelieState, setFuelieState] = useState('waving')
  const [showTransactionFlow, setShowTransactionFlow] = useState(false)
  const [currentTransaction] = useState(null) // setCurrentTransaction unused
  const [userAddress] = useState('0x1234567890123456789012345678901234567890') // setUserAddress unused
  const [aiAthleteContent, setAiAthleteContent] = useState([]);
  const [fuelieMessages, setFuelieMessages] = useState([
    {
      text: "Welcome to your FuelStation! Every purchase automatically supports your champions. 🏆",
      type: "guide"
    },
    {
      text: "Tip: Connect multiple payment methods to maximize your athlete support! 💳", 
      type: "tip"
    },
    {
      text: "Your fuel impact is growing! You've supported 2 athletes this month. 🚀",
      type: "celebration"
    }
  ]);

  // Use demo athletes as mock data
  const mockAthletes = demoAthletes
  
  // Contextual Fueli message triggers
  const showTipMessage = (messageType) => {
    const tipMessages = {
      'wallet-hover': {
        text: "Pro tip: Connect your wallet to unlock automatic athlete funding with every purchase! 💳",
        type: "tip"
      },
      'stats-hover': {
        text: "Impressive stats! You're in the top 10% of supporters this month! 🏆",
        type: "celebration"
      },
      'athlete-hover': {
        text: "Click 'Set as Main' to automatically fund this athlete with every purchase! ⚡",
        type: "guide"
      },
      'chart-hover': {
        text: "Your fuel impact is growing steadily! Consistency is key to helping athletes. 📈",
        type: "encourage"
      }
    };
    
    if (tipMessages[messageType]) {
      setFuelieMessages(prev => [tipMessages[messageType], ...prev.slice(0, 2)]);
    }
  };

  const executeTransaction = useCallback(async (transaction) => {
    console.log('Executing transaction:', transaction)
    setShowTransactionFlow(false)
  }, [])

  useEffect(() => {
    const fetchAiAthleteContent = async () => {
      try {
        const response = await fetch('/api/ai-athlete-content');
        const data = await response.json();
        setAiAthleteContent(data);
      } catch (error) {
        console.error('Error fetching AI athlete content:', error);
      }
    };
    fetchAiAthleteContent();
  }, []);

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
        
        // Update Fueli messages with success feedback
        setFuelieMessages(prev => [
          {
            text: `Awesome! You just fueled ${demoAthletes.find(a => a.id === athleteId)?.name} with $${amount}! 🎆`,
            type: "celebration"
          },
          {
            text: "Your impact is making a real difference in athlete's lives! Keep it up! 👏",
            type: "encourage"
          },
          ...prev.slice(0, 1) // Keep original welcome message
        ]);
        
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
      
      // Update Fueli messages with helpful guidance on error
      setFuelieMessages(prev => [
        {
          text: "Oops! Something went wrong. Try checking your wallet connection. 🔧",
          type: "warning"
        },
        {
          text: "Don't worry! Your previous fuel contributions are still active. 💪",
          type: "encourage"
        },
        ...prev.slice(0, 1)
      ]);
      
      alert(`❌ Failed to support athlete: ${error.message}`)
    }
  }, [userAddress]) // demoAthletes is imported constant, doesn't need to be in deps

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
          <div onMouseEnter={() => showTipMessage('wallet-hover')}>
            <MinimalWallet />
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Page Title - Enhanced */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative"
        >
          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -top-8 -right-4 w-12 h-12 bg-[#f59e0b]/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              rotate: [0, -3, 0, 3, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1 
            }}
            className="absolute -top-4 -left-8 w-8 h-8 bg-[#10b981]/20 rounded-full blur-lg"
          />
          
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 0 20px rgba(245, 158, 11, 0.3)",
                "0 0 40px rgba(245, 158, 11, 0.5)", 
                "0 0 20px rgba(245, 158, 11, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-wider mb-4 filter drop-shadow-2xl"
          >
            ⛽ FuelStation
          </motion.h1>
          <motion.p 
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg sm:text-xl text-[#f59e0b] font-semibold filter drop-shadow-md"
          >
            Where every purchase powers champions
          </motion.p>
        </motion.div>

        {/* Tap-to-Pay Status - Enhanced with Glassmorphism */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -10 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#10b981]/20 via-[#059669]/15 to-transparent backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 text-white border border-[#10b981]/20 max-w-4xl mx-auto group"
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#10b981]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#059669]/15 rounded-full blur-3xl animate-pulse delay-1000" />
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
                src={getFuelieImage}
                alt="Fuelie Mascot"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats Overview - Enhanced with Floating Cards */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-4 gap-8 mb-12 max-w-7xl mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.08, y: -15, rotateX: 5 }}
            className="relative group bg-gradient-to-br from-[#10b981]/15 via-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-[#10b981]/30 text-center overflow-hidden shadow-2xl hover:shadow-[#10b981]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-5xl mb-4 filter drop-shadow-lg"
            >📊</motion.div>
            <p className="text-3xl font-black text-[#10b981] mb-2 filter drop-shadow-md">127</p>
            <p className="text-sm text-gray-200 font-semibold uppercase tracking-wider">Total Transactions</p>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#10b981]/20 rounded-full blur-xl" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.08, y: -15, rotateX: 5 }}
            className="relative group bg-gradient-to-br from-[#f59e0b]/15 via-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-[#f59e0b]/30 text-center overflow-hidden shadow-2xl hover:shadow-[#f59e0b]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4 filter drop-shadow-lg"
            >💰</motion.div>
            <p className="text-3xl font-black text-[#f59e0b] mb-2 filter drop-shadow-md">$1,247.83</p>
            <p className="text-sm text-gray-200 font-semibold uppercase tracking-wider">Total Spent</p>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#f59e0b]/20 rounded-full blur-xl" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.08, y: -15, rotateX: 5 }}
            className="relative group bg-gradient-to-br from-[#10b981]/15 via-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-[#10b981]/30 text-center overflow-hidden shadow-2xl hover:shadow-[#10b981]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-4 filter drop-shadow-lg"
            >🚀</motion.div>
            <p className="text-3xl font-black text-[#10b981] mb-2 filter drop-shadow-md">$62.39</p>
            <p className="text-sm text-gray-200 font-semibold uppercase tracking-wider">Athlete Fuel</p>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#10b981]/20 rounded-full blur-xl" />
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.08, y: -15, rotateX: 5 }}
            className="relative group bg-gradient-to-br from-[#f59e0b]/15 via-gray-900/90 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-[#f59e0b]/30 text-center overflow-hidden shadow-2xl hover:shadow-[#f59e0b]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4 filter drop-shadow-lg"
            >⚡</motion.div>
            <p className="text-3xl font-black text-[#f59e0b] mb-2 filter drop-shadow-md">5.0%</p>
            <p className="text-sm text-gray-200 font-semibold uppercase tracking-wider">Avg. Impact Rate</p>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#f59e0b]/20 rounded-full blur-xl" />
          </motion.div>
        </motion.div>

        {/* Charts Section - Enhanced Mobile */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 max-w-6xl mx-auto px-4"
        >
          {/* Spending Chart - Enhanced with Animation */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-[#f59e0b]/5 opacity-50" />
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 text-center filter drop-shadow-md">📈 Weekly Fuel Impact</h3>
            <div className="space-y-6">
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between group hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
              >
                <span className="text-gray-200 font-semibold">Monday</span>
                <div className="flex-1 mx-4 bg-gray-700/30 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#10b981] via-[#10b981] to-[#059669] h-4 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
                <span className="text-[#10b981] font-bold text-lg filter drop-shadow-sm">$8.50</span>
              </motion.div>
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between group hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
              >
                <span className="text-gray-200 font-semibold">Tuesday</span>
                <div className="flex-1 mx-4 bg-gray-700/30 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#f59e0b] via-[#f59e0b] to-[#ef4444] h-4 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
                <span className="text-[#f59e0b] font-bold text-lg filter drop-shadow-sm">$6.20</span>
              </motion.div>
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between group hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
              >
                <span className="text-gray-200 font-semibold">Wednesday</span>
                <div className="flex-1 mx-4 bg-gray-700/30 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#10b981] via-[#10b981] to-[#059669] h-4 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
                <span className="text-[#10b981] font-bold text-lg filter drop-shadow-sm">$9.80</span>
              </motion.div>
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between group hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
              >
                <span className="text-gray-200 font-semibold">Thursday</span>
                <div className="flex-1 mx-4 bg-gray-700/30 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 h-4 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                    <div className="absolute inset-0 animate-pulse bg-purple-400/30 rounded-full" />
                  </motion.div>
                </div>
                <span className="text-purple-400 font-bold text-lg filter drop-shadow-sm">$12.40</span>
              </motion.div>
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between group hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
              >
                <span className="text-gray-200 font-semibold">Friday</span>
                <div className="flex-1 mx-4 bg-gray-700/30 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1.5, delay: 1.3, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#f59e0b] via-[#f59e0b] to-[#ef4444] h-4 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
                <span className="text-[#f59e0b] font-bold text-lg filter drop-shadow-sm">$7.30</span>
              </motion.div>
            </div>
          </div>

          {/* Category Breakdown - Enhanced */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-purple-500/5 opacity-50" />
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 text-center filter drop-shadow-md">🎯 Fuel Categories</h3>
            <div className="space-y-6">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-200 font-semibold flex items-center gap-2">
                    <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>☕</motion.span>
                    Food & Drink
                  </span>
                  <span className="text-[#10b981] font-bold text-lg">$18.45</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-[#10b981] via-[#10b981] to-[#059669] h-3 rounded-full shadow-lg relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
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

        {/* Strategic Ad Placement - Natural Integration */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-5xl mx-auto mb-12 px-4"
        >
          <PersonalizedAds supportedAthletes={['1', '2', '3']} maxAds={2} />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
          
          {/* Athletes List */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <div className="flex items-center justify-center mb-8">
              <motion.h2 
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(16, 185, 129, 0.3)",
                    "0 0 20px rgba(16, 185, 129, 0.5)", 
                    "0 0 10px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider text-center filter drop-shadow-lg"
              >
                🏆 Your Champions
              </motion.h2>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="ml-4 w-6 h-6 border-2 border-[#10b981] border-t-transparent rounded-full"
              />
            </div>
            <div className="space-y-6">
              {mockAthletes.map((athlete, index) => {
                const aiContent = aiAthleteContent.find(c => c.athlete_id === athlete.id);
                return (
                  <div key={`athlete-section-${index}`}>
                    <motion.div 
                    key={athlete.id} 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, y: -10, rotateY: 5 }}
                    className="relative group bg-gradient-to-br from-black/60 via-gray-900/70 to-black/60 backdrop-blur-lg border border-gray-700/40 rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#f59e0b]/10 transition-all duration-500 hover:border-[#f59e0b]/40 overflow-hidden"
                  >
                    {/* Floating Glow Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f59e0b]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#10b981]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div>
                        <motion.h3 
                          whileHover={{ scale: 1.05 }}
                          className="font-black text-xl text-white mb-2 filter drop-shadow-md"
                        >
                          {athlete.name}
                        </motion.h3>
                        <p className="text-[#f59e0b] font-bold mb-1 filter drop-shadow-sm">{athlete.sport} • {athlete.university}</p>
                        <p className="text-sm text-gray-300 font-medium">{athlete.position} • {athlete.year}</p>
                      </div>
                      <div className="text-right">
                        <motion.p 
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                          className="font-black text-2xl text-[#10b981] filter drop-shadow-lg"
                        >
                          ${athlete.total_earnings}
                        </motion.p>
                        <p className="text-xs text-gray-300 font-bold mb-1">🔥 {athlete.fan_count} fans</p>
                        <motion.p 
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-xs text-[#f59e0b] font-bold"
                        >
                          ${athlete.monthly_from_purchases}/mo fuel
                        </motion.p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 leading-relaxed">{athlete.background}</p>
                    {aiContent && <p className="text-sm text-gray-400 italic mt-2">{aiContent.ai_content}</p>}
                    
                    {/* Performance Stats */}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-600/30">
                      <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">📊 Recent Performance</p>
                      <div className="text-center">
                        <p className="text-lg font-black text-[#f59e0b]">{athlete.recent_game}</p>
                      </div>
                    </div>
                    <div className="relative z-10 flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(athlete.id, 5)}
                        onMouseEnter={() => showTipMessage('athlete-hover')}
                        className="relative overflow-hidden flex-1 bg-gradient-to-br from-[#10b981] via-[#10b981] to-[#059669] text-white py-4 rounded-xl hover:shadow-2xl hover:shadow-[#10b981]/25 transition-all duration-500 text-sm font-bold uppercase tracking-wide border border-[#10b981]/30 group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">💳 Set as Main</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(athlete.id, 10)}
                        className="relative overflow-hidden bg-gradient-to-br from-[#f59e0b] via-[#f59e0b] to-[#ef4444] text-white px-6 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#f59e0b]/25 transition-all duration-500 text-sm font-bold border border-[#f59e0b]/30 group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">⚡ +$10</span>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {/* Natural Ad Integration - After 2nd Athlete */}
                  {index === 1 && (
                    <motion.div 
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mt-6"
                    >
                      <PersonalizedAds supportedAthletes={[athlete.id]} maxAds={1} />
                    </motion.div>
                  )}
                  </div>
                )
              })}
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

        {/* FuelClips - Premium Video Messages */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <FuelClips />
        </motion.div>


        {/* Transaction Flow Modal */}
        <TransactionFlow
          isOpen={showTransactionFlow}
          onClose={() => setShowTransactionFlow(false)}
          transaction={currentTransaction}
          onConfirm={executeTransaction}
        />

        {/* Fueli Chat Guide */}
        <FueliChatBubble 
          messages={fuelieMessages}
          fuelieState={fuelieState}
          position="bottom-right"
          autoRotate={true}
        />

      </div>
    </div>
  )
}
