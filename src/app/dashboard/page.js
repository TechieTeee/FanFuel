'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/fanfuel-logo.png"
            alt="FanFuel Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-gray-900">FanFuel</span>
        </Link>
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Connect Wallet
          </button>
          <div className="flex items-center space-x-2">
            <Image
              src={getFuelieImage()}
              alt="Fuelie Mascot"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">
              {fuelieState === 'eyes-closed' ? 'Processing...' : 
               fuelieState === 'sitting' ? 'Success!' : 'Ready to help!'}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tap-to-Pay Status */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">💳 FanFuel Payments Active</h2>
              <p className="text-green-100 mb-4">Your everyday purchases are supporting athletes!</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm text-green-100">This Month</p>
                  <p className="text-xl font-bold">$45.80</p>
                  <p className="text-xs text-green-200">to athletes</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm text-green-100">Purchases</p>
                  <p className="text-xl font-bold">127</p>
                  <p className="text-xs text-green-200">this month</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm text-green-100">Impact</p>
                  <p className="text-xl font-bold">2</p>
                  <p className="text-xs text-green-200">athletes supported</p>
                </div>
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
              <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                View Transactions
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Athletes List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Featured Athletes</h2>
            <div className="space-y-4">
              {mockAthletes.map((athlete) => (
                <div key={athlete.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{athlete.name}</h3>
                      <p className="text-gray-600">{athlete.sport} • {athlete.university}</p>
                      <p className="text-sm text-gray-500">{athlete.position} • {athlete.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${athlete.total_earnings}</p>
                      <p className="text-xs text-gray-500">{athlete.fan_count} fans</p>
                      <p className="text-xs text-blue-500">${athlete.monthly_from_purchases}/mo from purchases</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{athlete.background}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSupportAthlete(athlete.id, 5)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      💳 Set as Payment Athlete
                    </button>
                    <button
                      onClick={() => handleSupportAthlete(athlete.id, 10)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      +$10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commentary Feed */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Critical Moment Alerts</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Analysis</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {mockCommentary.map((comment) => {
                const athlete = mockAthletes.find(a => a.id === comment.athlete_id)
                return (
                  <div key={comment.id} className="border-l-4 border-red-500 bg-red-50 p-6 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                            NEGATIVE SENTIMENT
                          </span>
                          <span className="text-gray-500 text-sm">{comment.source}</span>
                        </div>
                        <p className="text-gray-800 mb-3">"{comment.text}"</p>
                        <p className="text-sm text-gray-600">
                          Targeting: <strong>{athlete?.name}</strong> ({athlete?.sport})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          Intensity: {Math.round(comment.intensity * 100)}%
                        </div>
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Viral: {Math.round(comment.virality_score * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    {/* Support Actions */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3">💪 Support {athlete?.name}</h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleSupportAthlete(comment.athlete_id, 5)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          🛡️ Defend $5
                        </button>
                        <button
                          onClick={() => handleSupportAthlete(comment.athlete_id, 15)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ⚡ Boost $15
                        </button>
                        <button
                          onClick={() => handleSupportAthlete(comment.athlete_id, 25)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          🏆 Champion $25
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        80% goes directly to {athlete?.name} • 20% platform fee
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Powered By */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-center text-sm text-gray-500 mb-4">Powered by</p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-red-600">C</span>
                  </div>
                  <span className="text-xs text-gray-600">Chiliz</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-blue-600">L</span>
                  </div>
                  <span className="text-xs text-gray-600">LayerZero</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-green-600">F</span>
                  </div>
                  <span className="text-xs text-gray-600">Flow</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-purple-600">G</span>
                  </div>
                  <span className="text-xs text-gray-600">Gemini</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}