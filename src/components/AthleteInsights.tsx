'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FanDemographic {
  age_group: string
  percentage: number
  avg_spending: number
}

interface InsightData {
  athleteId: string
  athleteName: string
  totalRevenue: number
  fanCount: number
  engagementRate: number
  demographics: FanDemographic[]
  topSupportReasons: string[]
  growthRate: number
  brandValue: number
}

interface AthleteInsightsProps {
  athleteId: string
  isPremium?: boolean
}

export default function AthleteInsights({ athleteId, isPremium = false }: AthleteInsightsProps) {
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock insights data that athletes would pay to access
  const insightData: InsightData = {
    athleteId,
    athleteName: 'Maria Rodriguez',
    totalRevenue: 8943.20,
    fanCount: 15670,
    engagementRate: 8.4,
    demographics: [
      { age_group: '18-24', percentage: 32, avg_spending: 45.60 },
      { age_group: '25-34', percentage: 28, avg_spending: 78.90 },
      { age_group: '35-44', percentage: 24, avg_spending: 112.40 },
      { age_group: '45+', percentage: 16, avg_spending: 89.20 }
    ],
    topSupportReasons: [
      'Overcoming adversity (34%)',
      'Olympic dreams (28%)', 
      'Underrepresented sport (22%)',
      'Community involvement (16%)'
    ],
    growthRate: 156.7,
    brandValue: 245000
  }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider">📊 Athlete Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            💎 PREMIUM
          </span>
          <span className="text-xs text-gray-400">For athletes only</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700/50">
        {['overview', 'demographics', 'growth', 'brand-value'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 px-1 text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
              selectedTab === tab 
                ? 'text-[#f59e0b] border-b-2 border-[#f59e0b]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div className="bg-black/50 rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-sm text-gray-400 font-bold mb-2">💰 TOTAL FAN REVENUE</h3>
              <p className="text-3xl font-black text-[#10b981]">${insightData.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">From {insightData.fanCount.toLocaleString()} active supporters</p>
            </div>
            <div className="bg-black/50 rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-sm text-gray-400 font-bold mb-2">📈 ENGAGEMENT RATE</h3>
              <p className="text-3xl font-black text-[#f59e0b]">{insightData.engagementRate}%</p>
              <p className="text-xs text-gray-500">Above industry average (5.2%)</p>
            </div>
          </div>
          <div className="bg-black/50 rounded-xl p-4 border border-gray-700/30">
            <h3 className="text-sm text-gray-400 font-bold mb-3">🎯 TOP SUPPORT REASONS</h3>
            <div className="space-y-2">
              {insightData.topSupportReasons.map((reason, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-white">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Demographics Tab */}
      {selectedTab === 'demographics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-black text-white">👥 Fan Demographics & Spending Patterns</h3>
          {insightData.demographics.map((demo, index) => (
            <div key={index} className="bg-black/50 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{demo.age_group} years old</span>
                <span className="text-[#f59e0b] font-bold">{demo.percentage}% of fanbase</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-[#10b981] to-[#059669] h-2 rounded-full"
                  style={{ width: `${demo.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">Average monthly support: ${demo.avg_spending}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Growth Tab */}
      {selectedTab === 'growth' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-black/50 rounded-xl p-8 border border-gray-700/30">
            <h3 className="text-lg font-black text-white mb-4">📈 90-Day Growth Metrics</h3>
            <p className="text-5xl font-black text-[#10b981] mb-2">+{insightData.growthRate}%</p>
            <p className="text-gray-400 mb-6">Fan growth rate (Industry avg: +23%)</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-[#f59e0b]">+2,840</p>
                <p className="text-xs text-gray-400">New fans</p>
              </div>
              <div>
                <p className="text-2xl font-black text-purple-400">+$1,200</p>
                <p className="text-xs text-gray-400">Monthly revenue</p>
              </div>
              <div>
                <p className="text-2xl font-black text-blue-400">15.8K</p>
                <p className="text-xs text-gray-400">Social mentions</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Brand Value Tab */}
      {selectedTab === 'brand-value' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-black/50 rounded-xl p-6 border border-gray-700/30 text-center">
            <h3 className="text-lg font-black text-white mb-4">💎 Estimated Brand Value</h3>
            <p className="text-4xl font-black text-[#f59e0b] mb-2">${insightData.brandValue.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mb-4">Based on fan engagement and spending patterns</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Sponsor Value</p>
                <p className="text-xl font-bold text-[#10b981]">${(insightData.brandValue * 0.6).toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-400">Licensing Value</p>
                <p className="text-xl font-bold text-purple-400">${(insightData.brandValue * 0.4).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Features Notice */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            📊 Detailed analytics help athletes negotiate better brand deals
          </p>
          <span className="text-xs text-[#f59e0b] font-bold">$49/month for athletes</span>
        </div>
      </div>
    </motion.div>
  )
}