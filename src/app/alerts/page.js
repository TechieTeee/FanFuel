'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { demoAthletes } from '../../../data/demo-athletes';

import { getReactionSuggestion } from '../../../lib/ai-reaction-suggestions.ts';
import FlowActions from '../../components/FlowActions';
import CustomCursor from '../../components/CustomCursor';
import AnimatedBackground from '../../components/AnimatedBackground';
import HoverNavigation from '../../components/HoverNavigation.js';
import MinimalWallet from '../../components/web3/MinimalWallet';
import { triggerAthleteSupport, triggerViralReaction, executeActionRewards } from '../../lib/flow-actions';
import PersonalizedAds from '../../components/PersonalizedAds';
import FeaturedAthleteCarousel from '../../components/FeaturedAthleteCarousel';

export default function Alerts() {
  const [fuelieState, setFuelieState] = useState('waving')
    const [ncaaData, setNcaaData] = useState({ rankings: [], games: [], trending_topics: [] })
  const [loading, setLoading] = useState(true)
  const [commentary, setCommentary] = useState([])
  const [userAddress] = useState('0x1234567890123456789012345678901234567890')
  const [fanHistory] = useState({ totalSpent: 125, reactions: 15 })
  const [aiCommentaryExamplesData, setAiCommentaryExamplesData] = useState([]);

  useEffect(() => {
    const fetchNCAAData = async () => {
      try {
        const [rankingsRes, gamesRes, trendingRes] = await Promise.all([
          fetch('https://ncaa-api.henrygd.me/rankings/football/fbs/associated-press'),
          fetch('https://ncaa-api.henrygd.me/scoreboard/football/fbs/2025/1'),
          fetch('/api/trending'),
        ])
        
        const rankingsData = await rankingsRes.json()
        const gamesData = await gamesRes.json()
        const trendingData = await trendingRes.json()
        
        setNcaaData({
          rankings: rankingsData.data || [],
          games: gamesData.games || [],
          trending_topics: trendingData || [],
        })
        
      } catch (error) {
        console.error('Error fetching NCAA data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNCAAData()
  }, [])

  useEffect(() => {
    const getCommentary = async () => {
      try {
        const response = await fetch('/api/ai-commentary-examples');
        const data = await response.json();
        const commentaryWithSuggestions = await Promise.all(
          data.map(async (comment) => {
            const athlete = demoAthletes.find(a => a.id === comment.athlete_id)
            const suggested_reaction = await getReactionSuggestion(athlete, comment, fanHistory)
            return { ...comment, suggested_reaction }
          })
        )
        setCommentary(commentaryWithSuggestions)
      } catch (error) {
        console.error('Error fetching AI commentary examples:', error);
      }
    }

    getCommentary()
  }, [fanHistory])

  const handleSupportAthlete = useCallback(async (athleteId, amount, viralityScore = 0.5) => {
    setFuelieState('eyes-closed')
    
    try {
      // Get athlete info
      const athlete = demoAthletes.find(a => a.id === athleteId)
      
      // Trigger Flow Actions for athlete support
      const triggeredActions = await triggerAthleteSupport(
        userAddress,
        athleteId,
        athlete?.name || 'Unknown Athlete',
        amount,
        viralityScore
      )

      // Check for viral reaction triggers if virality score is high
      if (viralityScore >= 0.8) {
        const viralActions = await triggerViralReaction(
          userAddress,
          viralityScore,
          athleteId
        )
        triggeredActions.push(...viralActions)
      }

      // Execute rewards for triggered actions
      if (triggeredActions.length > 0) {
        await executeActionRewards(userAddress, triggeredActions, {
          athleteId,
          athleteName: athlete?.name,
          reactionAmount: amount,
          viralityScore
        })
      }
      
      setFuelieState('sitting')
      alert(`🏆 Successfully sent ${amount} support to ${athlete?.name}!
${triggeredActions.length > 0 ? `
🎉 ${triggeredActions.length} Flow Action(s) triggered on Flow EVM!` : ''}`)
    } catch (error) {
      setFuelieState('waving')
      alert(`❌ Failed to support athlete: ${error.message}`)
    }
  }, [userAddress])


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
          <Link href="/spending" className="text-[#f59e0b] hover:text-white transition-colors duration-300 font-bold uppercase tracking-wide">
            ⛽ FuelStation
          </Link>
<MinimalWallet />
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
            📺 FuelFeed
          </h1>
          <p className="text-xl text-[#f59e0b] font-semibold">
            React with impact - every response fuels champions
          </p>
        </motion.div>

        {/* Cinematic Athlete Carousel with Newspaper Frame */}
        <FeaturedAthleteCarousel />

        {/* Live Sports News Ticker - Enhanced */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#ef4444]/15 via-[#f59e0b]/10 to-transparent backdrop-blur-xl rounded-2xl border border-[#ef4444]/20 mb-8 max-w-5xl mx-auto shadow-2xl group"
        >
          {/* Animated Glow Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ef4444]/10 to-[#f59e0b]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ef4444]/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#f59e0b]/15 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="relative z-10 bg-gradient-to-r from-[#ef4444]/20 to-[#f59e0b]/20 backdrop-blur-sm px-6 py-3 border-b border-[#ef4444]/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-wider filter drop-shadow-md">📺 Live Sports Feed</h3>
              <div className="flex items-center space-x-3">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-[#ef4444] rounded-full shadow-lg shadow-[#ef4444]/50"
                ></motion.div>
                <span className="text-xs text-[#f59e0b] font-bold uppercase tracking-wider filter drop-shadow-sm">Breaking</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="p-4 text-center">
              <span className="text-gray-400 font-medium">⏳ Loading live sports data...</span>
            </div>
          ) : (
            <div className="relative h-12 overflow-hidden">
              <motion.div
                animate={{ x: [1200, -2400] }}
                transition={{ 
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute flex items-center h-full space-x-8 whitespace-nowrap"
              >
{[
                  "💰 WNBA: Star players launch crowdfunding campaigns to supplement league salaries",
                  "⚽ BREAKTHROUGH: USWNT equal pay victory inspires global women's sports movement",
                  "🏃 OLYMPICS: Track athletes gain million+ followers but struggle with financial support",
                  "🏀 PAY GAP: WNBA All-Star earns less in full season than NBA player makes in single game",
                  "🏊 SWIMMING: Olympic champion works part-time job to fund training between Games",
                  "⚽ MLS: Young American talents choosing European clubs over domestic opportunities", 
                  "🤸 GYMNASTICS: Elite gymnasts petition for better financial support after Olympic success",
                  "🎾 TENNIS: Lower-ranked players struggle as tour expenses exceed prize money",
                  "🏃 VIRAL: Track star's TikTok about athlete struggles reaches 10M views in 24 hours",
                  "⚽ WOMEN'S SOCCER: NWSL attendance up 300% but player salaries lag far behind men",
                  "🏊 FUNDING: Olympic swimmer launches Patreon to crowdfund training expenses",
                  "🏀 G-LEAGUE: Developmental players work multiple jobs while chasing NBA dreams",
                  "🏃 DIAMOND LEAGUE: Track stars gain social media fame but need financial stability",
                  "⚽ USWNT: World Cup champions advocate for better youth soccer funding nationwide",
                  "💪 CHANGE: Athletes turn to fan-funding platforms to bridge income gaps across sports"
                ].map((story, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-white font-medium">{story}</span>
                    {index < 14 && <span className="text-[#ef4444] mx-6 text-xl">•</span>}
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Trending Topics - Enhanced */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -10 }}
          className="relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/30 max-w-5xl mx-auto mb-12 group"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-[#ef4444]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#f59e0b]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#ef4444]/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <h2 className="relative z-10 text-3xl font-black text-white uppercase tracking-wider mb-6 text-center filter drop-shadow-md">🔥 Trending Topics</h2>
          <div className="relative z-10 flex flex-wrap justify-center gap-6">
            {ncaaData.trending_topics?.length > 0 ? ncaaData.trending_topics.map((topic, index) => (
              <motion.div 
                key={index} 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group bg-gradient-to-br from-gray-800/70 via-gray-700/60 to-gray-800/70 backdrop-blur-lg p-6 rounded-2xl border border-gray-600/40 shadow-lg hover:shadow-2xl hover:border-[#f59e0b]/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <p className="relative z-10 text-lg font-bold text-white mb-2 filter drop-shadow-sm">{topic.topic}</p>
                <p className="relative z-10 text-sm text-gray-300 font-medium">Virality Score: {(topic.virality_score || 0).toFixed(2)}</p>
                <p className="relative z-10 text-xs text-gray-400 font-medium">{topic.tweet_count || 0} tweets</p>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#f59e0b]/20 rounded-full blur-lg" />
              </motion.div>
            )) : [
              {
                topic: 'WNBA Pay Equity Movement',
                virality_score: 0.96,
                tweet_count: 35420,
                sentiment: 'positive'
              },
              {
                topic: 'USWNT Equal Pay Victory',
                virality_score: 0.94,
                tweet_count: 28934,
                sentiment: 'positive'
              },
              {
                topic: 'Olympic Trials 2025',
                virality_score: 0.89,
                tweet_count: 22156,
                sentiment: 'positive'
              },
              {
                topic: 'MLS Rising Stars',
                virality_score: 0.84,
                tweet_count: 18203,
                sentiment: 'positive'
              },
              {
                topic: 'Track Athletes Go Viral',
                virality_score: 0.81,
                tweet_count: 15876,
                sentiment: 'positive'
              }
            ].map((topic, index) => (
              <motion.div 
                key={index} 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group bg-gradient-to-br from-gray-800/70 via-gray-700/60 to-gray-800/70 backdrop-blur-lg p-6 rounded-2xl border border-gray-600/40 shadow-lg hover:shadow-2xl hover:border-[#f59e0b]/40 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <p className="relative z-10 text-lg font-bold text-white mb-2 filter drop-shadow-sm">{topic.topic}</p>
                <p className="relative z-10 text-sm text-gray-300 font-medium">Virality Score: {topic.virality_score}</p>
                <p className="relative z-10 text-xs text-gray-400 font-medium">{topic.tweet_count} tweets</p>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#f59e0b]/20 rounded-full blur-lg" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Strategic Ad Placement */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-5xl mx-auto mb-12 flex justify-center"
        >
          <PersonalizedAds supportedAthletes={['1', '2']} maxAds={1} />
        </motion.div>

        {/* NCAA Games */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-6 text-center">🏈 Upcoming Games</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading games...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ncaaData.games?.length > 0 ? ncaaData.games.slice(0, 3).map((game, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-lg font-semibold text-white">{game.awayTeam.school} @ {game.homeTeam.school}</p>
                  <p className="text-sm text-gray-400">{new Date(game.startDate).toLocaleDateString()}</p>
                </div>
              )) : [
                {
                  awayTeam: { school: 'Alabama' },
                  homeTeam: { school: 'Georgia' },
                  startDate: '2025-01-20T19:00:00Z',
                  week: 1
                },
                {
                  awayTeam: { school: 'Ohio State' },
                  homeTeam: { school: 'Michigan' },
                  startDate: '2025-01-21T15:30:00Z',
                  week: 1
                },
                {
                  awayTeam: { school: 'USC' },
                  homeTeam: { school: 'Notre Dame' },
                  startDate: '2025-01-22T20:00:00Z',
                  week: 1
                }
              ].map((game, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-lg font-semibold text-white">{game.awayTeam.school} @ {game.homeTeam.school}</p>
                  <p className="text-sm text-gray-400">{new Date(game.startDate).toLocaleDateString()}</p>
                  <p className="text-xs text-[#f59e0b] font-bold">Week {game.week}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* NCAA Rankings */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-6 text-center">🏆 AP Top 5 Football Rankings</h2>
          {loading ? (
            <div className="text-center text-gray-400">Loading rankings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {ncaaData.rankings?.length > 0 ? ncaaData.rankings.slice(0, 5).map((ranking, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-2xl font-black text-[#f59e0b]">#{ranking.rank}</p>
                  <p className="text-lg font-semibold text-white">{ranking.school}</p>
                  <p className="text-sm text-gray-400">({ranking.record})</p>
                </div>
              )) : [
                { rank: 1, school: 'Texas', record: '13-1' },
                { rank: 2, school: 'Ohio State', record: '12-2' },
                { rank: 3, school: 'Oregon', record: '13-1' },
                { rank: 4, school: 'Penn State', record: '13-2' },
                { rank: 5, school: 'Notre Dame', record: '12-2' }
              ].map((ranking, index) => (
                <div key={index} className="text-center bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-2xl font-black text-[#f59e0b]">#{ranking.rank}</p>
                  <p className="text-lg font-semibold text-white">{ranking.school}</p>
                  <p className="text-sm text-gray-400">({ranking.record})</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Commentary Feed */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50 max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">📺 Live FuelFeed</h2>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-[#ef4444] rounded-full animate-pulse shadow-lg shadow-[#ef4444]/30"></div>
              <span className="text-sm text-[#f59e0b] font-bold uppercase tracking-wide">🤖 AI SCANNING</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {commentary.map((comment, index) => {
              const athlete = demoAthletes.find(a => a.id === comment.athlete_id)
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
                          💬 NEGATIVE SENTIMENT
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
                  
                  {/* Paid Reactions */}
                  <div className="border-t border-gray-600/50 pt-6 mt-6">
                    <h4 className="font-black mb-4 text-white uppercase tracking-wide filter drop-shadow-md">💰 PAID REACTIONS: {athlete?.name}</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 2, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-[#10b981] via-[#10b981] to-[#059669] text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-[#10b981]/25 transition-all duration-300 font-bold text-sm border border-[#10b981]/30 group ${comment.suggested_reaction === 2 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">👏 Clap $2</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 5, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-[#f59e0b] via-[#f59e0b] to-[#ef4444] text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-[#f59e0b]/25 transition-all duration-300 font-bold text-sm border border-[#f59e0b]/30 group ${comment.suggested_reaction === 5 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">🔥 Fire $5</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 10, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-600 to-purple-800 text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 font-bold text-sm border border-purple-500/30 group ${comment.suggested_reaction === 10 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">💎 Gem $10</span>
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 15, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 font-bold text-sm border border-blue-500/30 group ${comment.suggested_reaction === 15 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">💪 Strong $15</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 25, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-800 text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 font-bold text-sm border border-yellow-500/30 group ${comment.suggested_reaction === 25 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">🏆 Legend $25</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08, y: -3, rotateZ: -1.5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSupportAthlete(comment.athlete_id, 50, comment.virality_score)}
                        className={`relative overflow-hidden bg-gradient-to-br from-pink-500 via-pink-600 to-pink-800 text-white px-4 py-3 rounded-xl hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 font-bold text-sm border border-pink-500/30 group ${comment.suggested_reaction === 50 ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/25' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">👑 King $50</span>
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 font-medium">
                      💰 Your reaction appears publicly with payment amount • 🏆 100% goes to {athlete?.name}
                    </p>
                  </div>

                  {/* Recommended Athletes */}
                  <div className="border-t border-gray-600/50 pt-6 mt-6">
                    <h4 className="font-black mb-4 text-white uppercase tracking-wide">🔥 You might also like:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {demoAthletes.filter(a => a.sport === athlete?.sport && a.id !== athlete?.id).map(recommendedAthlete => (
                        <div key={recommendedAthlete.id} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                          <p className="font-bold text-white">{recommendedAthlete.name}</p>
                          <p className="text-sm text-gray-400">{recommendedAthlete.sport} - {recommendedAthlete.university}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </motion.div>

        {/* Flow Actions Integration */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <FlowActions userAddress={userAddress} showAchievements={true} />
        </motion.div>


      </div>
    </div>
  )
}