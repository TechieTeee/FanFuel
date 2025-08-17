'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const heroImages = [
  {
    src: '/pexels-football-wife-577822-1618169.jpg',
    alt: 'Football Player Victory Roar',
    caption: '🔥 Victory Unleashed'
  },
  {
    src: '/pexels-cottonbro-5740794.jpg',
    alt: 'Boxer Focused Intensity',
    caption: '🥊 Fighting Spirit'
  },
  {
    src: '/pexels-football-wife-577822-1428647.jpg',
    alt: 'Determined College Football Player',
    caption: '💪 Raw Determination'
  },
  {
    src: '/pexels-alesiakozik-7290328.jpg',
    alt: 'Basketball Player Portrait',
    caption: '🏀 Championship Mindset'
  },
  {
    src: '/pexels-david-morris-1149400-15729335.jpg',
    alt: 'Live Basketball Action',
    caption: '⚡ Game-Winning Moments'
  },
  {
    src: '/pexels-tony-schnagl-6468956.jpg',
    alt: 'Hockey Goalie Intensity',
    caption: '🥅 Unbreakable Focus'
  },
  {
    src: '/pexels-pixabay-159564.jpg',
    alt: 'Lacrosse Victory Celebration',
    caption: '🏆 Pure Triumph'
  },
  {
    src: '/pexels-david-morris-1149400-2190115.jpg',
    alt: 'Passionate College Crowd',
    caption: '🔥 Fan Power Unleashed'
  },
  {
    src: '/pexels-cottonbro-10350369.jpg',
    alt: 'Volleyball Athletic Precision',
    caption: '🏹 Precision Excellence'
  },
  {
    src: '/pexels-football-wife-577822-1369501.jpg',
    alt: 'College Football Brotherhood',
    caption: '🚀 Champions Together'
  },
  {
    src: '/pexels-cottonbro-6764359.jpg',
    alt: 'Female Basketball Team Unity',
    caption: '⭐ Team Strength'
  },
  {
    src: '/pexels-wesleydavi-33417687.jpg',
    alt: 'Athletes in Motion',
    caption: '🏃 Relentless Drive'
  }
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1, rotateY: 5 }}
          animate={{ opacity: 0.9, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.95, rotateY: -5 }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
          
        </motion.div>
      </AnimatePresence>

    </div>
  )
}