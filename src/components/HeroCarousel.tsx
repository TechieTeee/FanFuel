'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const heroImages = [
  {
    src: '/pexels-cottonbro-5740517.jpg',
    alt: 'Athletic Training',
    caption: 'Supporting Athletes'
  },
  {
    src: '/pexels-pixabay-163439.jpg', 
    alt: 'Team Sports',
    caption: 'Building Champions'
  },
  {
    src: '/pexels-football-wife-577822-1618169.jpg',
    alt: 'Competition',
    caption: 'Fueling Dreams'
  },
  {
    src: '/pexels-cottonbro-5740794.jpg',
    alt: 'Victory Moment',
    caption: 'Celebrating Success'
  },
  {
    src: '/pexels-ketut-subiyanto-4720517.jpg',
    alt: 'Athletic Focus',
    caption: 'Determined Spirit'
  },
  {
    src: '/pexels-tima-miroshnichenko-5750821.jpg',
    alt: 'Team Unity',
    caption: 'Stronger Together'
  }
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}