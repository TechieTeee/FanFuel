'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import AnimatedBackground from '../../components/AnimatedBackground'
import CustomCursor from '../../components/CustomCursor'

export default function Dashboard() {
  const [fuelieState, setFuelieState] = useState('waving')
  
  // Mock data for demo
  const mockAthletes = [
    {
      id: '1',
      name: 'Sarah Johnson',
      sport: 'Basketball',
      university: 'State University',
      position: 'Point Guard',
      year: 'Junior',
      background: 'First-generation college student, pre-med',
      total_earnings: 15.50,
      fan_count: 8,
      monthly_from_purchases: 12.30
    },
    {
      id: '2', 
      name: 'Marcus Williams',
      sport: 'Football',
      university: 'Tech College',
      position: 'Wide Receiver',
      year: 'Sophomore',
      background: 'From underserved community, business major',
      total_earnings: 287.50,
      fan_count: 45,
      monthly_from_purchases: 245.20
    }
  ]

  const mockCommentary = [
    {
      id: '1',
      text: 'This point guard is completely overrated and making too many turnovers in crucial moments',
      athlete_id: '1',
      sentiment: 'negative',
      intensity: 0.8,
      virality_score: 0.75,
      source: 'Social Media Discussion',
      created_at: '2025-01-16T10:30:00Z'
    },
    {
      id: '2',
      text: 'Williams needs to step up his game if this team wants any chance at success',
      athlete_id: '2', 
      sentiment: 'negative',
      intensity: 0.6,
      virality_score: 0.45,
      source: 'Sports Forum',
      created_at: '2025-01-16T09:15:00Z'
    }
  ]

  const getFuelieImage = () => {
    switch(fuelieState) {
      case 'eyes-closed':
        return '/fuelie-eyes-closed.png'
      case 'sitting':
        return '/fuelie-sitting.png'
      default:
        return '/fuelie-waving.png'
    }
  }

  const handleSupportAthlete = (athleteId, amount) => {
    setFuelieState('eyes-closed')
    
    // Simulate processing
    setTimeout(() => {
      setFuelieState('sitting')
      alert(`Successfully sent $${amount} support to athlete!`)
    }, 2000)
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CustomCursor />
      <AnimatedBackground />

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 px-6 py-6 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/fanfuel-logo.png"
              alt="FanFuel Logo"
              width={50}
              height={50}
              className="rounded-full drop-shadow-xl"
            />
          </motion.div>
          <span className="text-3xl font-black text-white bg-gradient-to-r from-[#f59e0b] to-white bg-clip-text text-transparent">
            FanFuel
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <ConnectButton />
          <motion.div 
            animate={{ 
              y: [0, -8, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="flex items-center space-x-3 bg-black/80 backdrop-blur-md border border-[#f59e0b]/30 px-4 py-2 rounded-xl"
          >
            <Image
              src={getFuelieImage()}
              alt="Fuelie Mascot"
              width={40}
              height={40}
              className="rounded-full drop-shadow-xl"
            />
            <span className="text-sm font-bold text-white">
              {fuelieState === 'eyes-closed' ? '🔄 Processing...' : 
               fuelieState === 'sitting' ? '✅ Success!' : '🚀 Ready to fuel!'}
            </span>
          </motion.div>
        </div>
      </motion.header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Tap-to-Pay Status */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-2xl shadow-2xl p-8 mb-12 text-white border border-[#10b981]/30 backdrop-blur-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black mb-3 uppercase tracking-wider">💳 PAYMENT ENGINE ACTIVE</h2>
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
                width={80}
                height={80}
                className="rounded-full mb-2"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#10b981] px-6 py-3 rounded-xl font-black hover:bg-gray-100 shadow-xl uppercase tracking-wide"
              >
                📈 View Battle Log
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Athletes List */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <h2 className="text-3xl font-black mb-8 text-white uppercase tracking-wider">🏆 Your Champions</h2>
            <div className="space-y-4">
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
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">{athlete.background}</p>
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

          {/* Commentary Feed */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-white uppercase tracking-wider">🔥 Battle Alerts</h2>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-pulse shadow-lg shadow-[#ef4444]/30"></div>
                <span className="text-sm text-[#f59e0b] font-bold uppercase tracking-wide">🤖 AI SCANNING</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {mockCommentary.map((comment, index) => {
                const athlete = mockAthletes.find(a => a.id === comment.athlete_id)
                return (
                  <motion.div 
                    key={comment.id} 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.01, y: -3 }}
                    className="border-l-4 border-[#ef4444] bg-gray-800/60 p-6 rounded-xl backdrop-blur-md border border-gray-700/30 hover:border-[#ef4444]/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="bg-[#ef4444]/20 text-[#ef4444] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border border-[#ef4444]/30">
                            🚨 THREAT DETECTED
                          </span>
                          <span className="text-gray-400 text-sm font-medium">{comment.source}</span>
                        </div>
                        <p className="text-white mb-4 text-lg leading-relaxed font-medium">&ldquo;{comment.text}&rdquo;</p>
                        <p className="text-sm text-gray-300">
                          Target: <strong className="text-[#f59e0b]">{athlete?.name}</strong> <span className="text-gray-500">({athlete?.sport})</span>
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="bg-[#ef4444]/20 text-[#ef4444] px-3 py-1 rounded-full text-sm font-black border border-[#ef4444]/30">
                          🔥 {Math.round(comment.intensity * 100)}% Intensity
                        </div>
                        <div className="bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full text-sm font-black border border-[#f59e0b]/30">
                          🚀 {Math.round(comment.virality_score * 100)}% Viral
                        </div>
                      </div>
                    </div>
                    
                    {/* Support Actions */}
                    <div className="border-t border-gray-600/50 pt-6 mt-6">
                      <h4 className="font-black mb-4 text-white uppercase tracking-wide">💪 COUNTER-STRIKE: {athlete?.name}</h4>
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSupportAthlete(comment.athlete_id, 5)}
                          className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
                        >
                          🛡️ Defend $5
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSupportAthlete(comment.athlete_id, 15)}
                          className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
                        >
                          ⚡ Boost $15
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSupportAthlete(comment.athlete_id, 25)}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
                        >
                          🏆 Champion $25
                        </motion.button>
                      </div>
                      <p className="text-xs text-gray-400 mt-3 font-medium">
                        🎯 80% direct impact to {athlete?.name} • 20% platform fuel
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Powered By */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 pt-8 border-t border-gray-600/50"
            >
              <p className="text-center text-sm text-gray-400 mb-6 font-bold uppercase tracking-wider">🏆 Built for Dominance</p>
              <div className="flex justify-center space-x-6">
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ef4444]/20 to-[#ef4444]/10 rounded-full flex items-center justify-center mb-3 border border-[#ef4444]/30 group-hover:border-[#ef4444] transition-all duration-300">
                    <span className="text-2xl">⛓️</span>
                  </div>
                  <span className="text-xs text-gray-300 font-bold">Chiliz</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-full flex items-center justify-center mb-3 border border-blue-500/30 group-hover:border-blue-500 transition-all duration-300">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <span className="text-xs text-gray-300 font-bold">LayerZero</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/10 rounded-full flex items-center justify-center mb-3 border border-[#10b981]/30 group-hover:border-[#10b981] transition-all duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-xs text-gray-300 font-bold">Flow</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-full flex items-center justify-center mb-3 border border-purple-500/30 group-hover:border-purple-500 transition-all duration-300">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <span className="text-xs text-gray-300 font-bold">Gemini</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}