'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const athletes = [
  {
    id: 1,
    name: "Sha'Carri Richardson",
    sport: "Track & Field",
    image: "/Shacarri_Richardson.png",
    emoji: "🏃‍♀️",
    topic: {
      title: "Olympic Athlete Financial Support Crisis",
      description: "Track star criticizes lack of financial support for Olympic athletes during Joe Rogan podcast appearance. ESPN analysts discuss massive revenue gaps between individual sports and team athletics, highlighting how Olympic champions often struggle financially despite global recognition.",
      trending: "Joe Rogan Experience, ESPN, Fox Sports, The Athletic"
    }
  },
  {
    id: 2,
    name: "Francis Ngannou",
    sport: "Mixed Martial Arts",
    image: "/Francis_Ngannou.jpg",
    emoji: "🥊",
    topic: {
      title: "UFC Fighter Pay Disparity Exposed",
      description: "Heavyweight champion calls out UFC promotion for massive fighter pay gaps during explosive ESPN interview. MMA analysts and former fighters join heated debates about combat sports revenue distribution and athlete exploitation in billion-dollar promotions.",
      trending: "ESPN MMA, Joe Rogan Experience, MMA Hour, TMZ Sports"
    }
  },
  {
    id: 3,
    name: "USWNT Stars",
    sport: "Women's Soccer",
    image: "/US_Women_Soccer_Equal_Pay.png",
    emoji: "⚽",
    topic: {
      title: "Equal Pay Victory Sparks Global Movement",
      description: "USWNT's historic equal pay settlement ignites passionate sports radio debates nationwide. Discussions center on extending pay equity principles across all women's sports, with hosts and analysts debating implementation challenges and timeline for achieving full parity.",
      trending: "ESPN Radio, Fox Sports Radio, The Dan Patrick Show, The Athletic"
    }
  },
  {
    id: 4,
    name: "Henry Cejudo",
    sport: "Mixed Martial Arts",
    image: "/Henry_Cejudo_UFC_Fighter.png",
    emoji: "🥊",
    topic: {
      title: "Post-Career Financial Struggles Revealed",
      description: "Former two-division champion opens up about retirement income challenges on Ariel Helwani's MMA Hour. Discussion highlights how even elite champions face financial uncertainty after careers end, spurring broader MMA media coverage of fighter post-retirement planning.",
      trending: "MMA Hour, ESPN MMA, UFC podcasts, Submission Radio"
    }
  },
  {
    id: 5,
    name: "Shedeur Sanders",
    sport: "College Football",
    image: "/Shadeur_Sanders_Cleveland_Brown.png",
    emoji: "🏈",
    topic: {
      title: "NIL Deals vs Performance Scrutiny",
      description: "Colorado quarterback faces intense criticism over NIL earnings versus on-field results. College football analysts question correlation between NIL money and team performance on College GameDay and Pat McAfee Show, sparking debates about student-athlete compensation fairness.",
      trending: "College GameDay, Pat McAfee Show, Sports Illustrated, ESPN College Football"
    }
  },
  {
    id: 6,
    name: "Tennis Champions",
    sport: "Women's Tennis",
    image: "/US_Women_Tennis_Equal_Pay.jpg",
    emoji: "🎾",
    topic: {
      title: "Tennis Equal Prize Money Campaign",
      description: "Leading women's tennis stars unite to advocate for equal prize money across all professional tournaments. Tennis Channel and ESPN Tennis cover the growing movement, with sports journalists debating implementation challenges and examining successful equal pay models.",
      trending: "Tennis Channel, ESPN Tennis, Wimbledon Radio, WTA Insider"
    }
  }
]

export default function FeaturedAthleteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % athletes.length)
      }, 5000) // 5 seconds per athlete
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying])

  const currentAthlete = athletes[currentIndex]

  const nextAthlete = () => {
    setCurrentIndex((prev) => (prev + 1) % athletes.length)
    setIsAutoPlaying(false)
  }

  const prevAthlete = () => {
    setCurrentIndex((prev) => (prev - 1 + athletes.length) % athletes.length)
    setIsAutoPlaying(false)
  }

  const goToAthlete = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-6xl mx-auto mb-16"
    >
      {/* Main Carousel Container */}
      <div className="relative">
        {/* Newspaper Frame Background */}
        <div className="relative">
          <img
            src="/Sports_Newspaper_Frame_Background_Layer.png"
            alt="Sports Page Newspaper Frame"
            className="w-full h-auto rounded-lg shadow-2xl opacity-95"
            style={{ filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.4))' }}
          />
          
          {/* Featured Athlete Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAthlete.id}
                initial={{ scale: 0.7, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="text-center"
              >
                <motion.img
                  src={currentAthlete.image}
                  alt={currentAthlete.name}
                  className="w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full border-6 border-white shadow-2xl object-cover mx-auto mb-4"
                  whileHover={{ scale: 1.05 }}
                  style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))' }}
                />
                <motion.h3 
                  className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentAthlete.name}
                </motion.h3>
                <motion.p 
                  className="text-lg text-[#f59e0b] font-bold uppercase tracking-wide drop-shadow-md"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentAthlete.sport}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={prevAthlete}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextAthlete}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

      {/* Featured Topic Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`topic-${currentAthlete.id}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-2xl p-8 -mt-72"
        >
          <div className="text-center mb-6">
            <motion.span 
              className="text-4xl mb-4 block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentAthlete.emoji}
            </motion.span>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2">
              📺 Currently Trending
            </h3>
            <h4 className="text-xl text-[#f59e0b] font-bold mb-4">
              {currentAthlete.topic.title}
            </h4>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-200 text-lg leading-relaxed mb-6 text-center">
              {currentAthlete.topic.description}
            </p>
            
            <div className="bg-gray-800/60 p-4 rounded-lg border-l-4 border-[#ef4444]">
              <span className="text-sm text-gray-400 font-medium">
                🔥 Trending across: <span className="text-[#f59e0b]">{currentAthlete.topic.trending}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}