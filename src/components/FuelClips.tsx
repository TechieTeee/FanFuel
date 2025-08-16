'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { demoAthletes } from '../../data/demo-athletes'

interface FuelClipRequest {
  athleteId: string
  requestType: 'birthday' | 'motivation' | 'congratulations' | 'custom'
  recipientName: string
  occasion: string
  customMessage: string
  price: number
  deliveryTime: string
}

interface FuelClipsProps {
  className?: string
}

export default function FuelClips({ className = '' }: FuelClipsProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestForm, setRequestForm] = useState<Partial<FuelClipRequest>>({
    requestType: 'birthday',
    recipientName: '',
    occasion: '',
    customMessage: '',
  })

  const clipPrices = {
    birthday: 75,
    motivation: 100,
    congratulations: 85,
    custom: 125
  }

  const handleRequestClip = async () => {
    const fullRequest: FuelClipRequest = {
      ...requestForm as FuelClipRequest,
      athleteId: selectedAthlete!,
      price: clipPrices[requestForm.requestType as keyof typeof clipPrices],
      deliveryTime: '3-5 business days'
    }

    // Simulate request processing
    console.log('FuelClip request:', fullRequest)
    alert(`🎬 FuelClip request sent! ${fullRequest.recipientName} will receive their personalized video from ${demoAthletes.find(a => a.id === selectedAthlete)?.name} within ${fullRequest.deliveryTime}.`)
    setShowRequestForm(false)
    setSelectedAthlete(null)
  }

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/30 ${className}`}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-white uppercase tracking-wider mb-4">🎬 FuelClips</h2>
        <p className="text-xl text-purple-300 font-semibold">Get personalized video messages from your favorite athletes</p>
        <p className="text-sm text-gray-400 mt-2">Professional athletes earn premium rates for custom content</p>
      </div>

      {!showRequestForm ? (
        <div className="space-y-6">
          {/* Athlete Selection */}
          <div>
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-wide">Choose Your Athlete</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {demoAthletes.slice(0, 4).map((athlete) => (
                <motion.div
                  key={athlete.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedAthlete(athlete.id)}
                  className={`bg-black/50 rounded-xl p-4 cursor-pointer border transition-all duration-300 ${
                    selectedAthlete === athlete.id 
                      ? 'border-purple-400 ring-2 ring-purple-400/50' 
                      : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">{athlete.name}</h4>
                    <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full text-xs font-bold">
                      AVAILABLE
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{athlete.sport} • {athlete.level || athlete.league}</p>
                  <p className="text-xs text-purple-300 font-medium">Typically responds within 48 hours</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Video Types & Pricing */}
          <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-black text-white mb-4 uppercase tracking-wide">🎥 Video Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(clipPrices).map(([type, price]) => (
                <div key={type} className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-2xl mb-2">
                    {type === 'birthday' && '🎂'}
                    {type === 'motivation' && '💪'}
                    {type === 'congratulations' && '🎉'}
                    {type === 'custom' && '✨'}
                  </div>
                  <h4 className="text-sm font-bold text-white capitalize mb-1">{type}</h4>
                  <p className="text-lg font-black text-purple-400">${price}</p>
                  <p className="text-xs text-gray-400">60-90 seconds</p>
                </div>
              ))}
            </div>
          </div>

          {/* Request Button */}
          {selectedAthlete && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRequestForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-black hover:shadow-xl transition-all duration-300 uppercase tracking-wide"
              >
                🎬 Request FuelClip from {demoAthletes.find(a => a.id === selectedAthlete)?.name}
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        /* Request Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-white">Request from {demoAthletes.find(a => a.id === selectedAthlete)?.name}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Video Type</label>
              <select 
                value={requestForm.requestType}
                onChange={(e) => setRequestForm({...requestForm, requestType: e.target.value})}
                className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500"
              >
                <option value="birthday">Birthday Message - $75</option>
                <option value="motivation">Motivational Message - $100</option>
                <option value="congratulations">Congratulations - $85</option>
                <option value="custom">Custom Message - $125</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Recipient Name</label>
              <input
                type="text"
                value={requestForm.recipientName}
                onChange={(e) => setRequestForm({...requestForm, recipientName: e.target.value})}
                placeholder="Who is this for?"
                className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Occasion/Details</label>
            <input
              type="text"
              value={requestForm.occasion}
              onChange={(e) => setRequestForm({...requestForm, occasion: e.target.value})}
              placeholder="Birthday, graduation, championship win, etc."
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Custom Message</label>
            <textarea
              value={requestForm.customMessage}
              onChange={(e) => setRequestForm({...requestForm, customMessage: e.target.value})}
              placeholder="What would you like the athlete to say? (Keep it positive and appropriate)"
              rows={4}
              className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500"
            />
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Total Cost:</span>
              <span className="text-2xl font-black text-purple-400">
                ${clipPrices[requestForm.requestType as keyof typeof clipPrices]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">97% goes to athlete, 3% platform fee</p>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRequestForm(false)}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestClip}
              disabled={!requestForm.recipientName}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              🎬 Request FuelClip
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="mt-6 pt-4 border-t border-purple-500/20 text-center">
        <p className="text-xs text-purple-300/80">
          🎬 Premium video content • 💰 Direct athlete payment • 📊 Analytics for athlete growth
        </p>
      </div>
    </motion.div>
  )
}