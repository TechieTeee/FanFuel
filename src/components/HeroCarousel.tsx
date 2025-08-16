'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const heroImages = [
  {
    src: '/pexels-football-wife-577822-1618169.jpg',
    alt: 'Competition',
    caption: '💪 Fueling Greatness'
  },
  {
    src: '/pexels-cottonbro-5740517.jpg',
    alt: 'Athletic Training',
    caption: '⚡ Igniting Champions'
  },
  {
    src: '/pexels-pixabay-163439.jpg', 
    alt: 'Team Sports',
    caption: '🔥 Building Legends'
  },
  {
    src: '/pexels-cottonbro-5740794.jpg',
    alt: 'Victory Moment',
    caption: '🏆 Championship Moments'
  },
  {
    src: '/pexels-ketut-subiyanto-4720517.jpg',
    alt: 'Athletic Focus',
    caption: '🎯 Unstoppable Focus'
  },
  {
    src: '/pexels-tima-miroshnichenko-5750821.jpg',
    alt: 'Team Unity',
    caption: '⭐ Legendary Unity'
  },
  {
    src: '/pexels-nappy-935948.jpg',
    alt: 'Athletic Power',
    caption: '💥 Pure Power'
  },
  {
    src: '/pexels-yankrukov-8199172.jpg',
    alt: 'Training Intensity',
    caption: '🚀 Elite Performance'
  },
  {
    src: '/pexels-mikhail-nilov-6620724.jpg',
    alt: 'Victory Celebration',
    caption: '🔥 Victory Fuel'
  },
  {
    src: '/pexels-george-pak-7972525.jpg',
    alt: 'Athletic Excellence',
    caption: '⚡ Excellence Unleashed'
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