'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { demoAds, getRelevantAds } from '../../data/demo-ads.js'
// import { demoAthletes } from '../../data/demo-athletes' // Unused

interface PersonalizedAdsProps {
  supportedAthletes?: string[]
  maxAds?: number
  className?: string
}

export default function PersonalizedAds({ 
  supportedAthletes = [], 
  maxAds = 2, 
  className = '' 
}: PersonalizedAdsProps) {
  const relevantAds = supportedAthletes.length > 0 
    ? getRelevantAds(supportedAthletes, maxAds)
    : demoAds.slice(0, maxAds)

  if (relevantAds.length === 0) return null

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`bg-gray-900/60 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-700/30 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-white uppercase tracking-wider">🎯 Sponsored</h3>
        <span className="text-xs text-gray-400 font-medium">Personalized for you</span>
      </div>
      
      <div className="space-y-4">
        {relevantAds.map((ad, index) => (
          <motion.div
            key={ad.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`bg-gradient-to-r ${ad.backgroundColor} rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border border-white/10`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">
                  {ad.category === 'nutrition' && '🥤'}
                  {ad.category === 'tech' && '📊'}
                  {ad.category === 'training' && '💪'}
                  {ad.category === 'lifestyle' && '🏆'}
                  {ad.category === 'sports-gear' && '👟'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${ad.textColor} mb-1`}>{ad.title}</h4>
                <p className={`text-sm ${ad.textColor}/90 mb-2 leading-relaxed`}>{ad.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${ad.textColor}/70 font-medium`}>{ad.brand}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-white/30 transition-all duration-200"
                  >
                    {ad.cta}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center font-medium">
          💰 Ad revenue helps fund athlete support • 📊 Your interests help us show relevant content
        </p>
      </div>
    </motion.div>
  )
}