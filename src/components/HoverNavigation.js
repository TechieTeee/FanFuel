'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function HoverNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '🏠 Home', emoji: '🏠' },
    { href: '/spending', label: '💳 Spending', emoji: '💳' },
    { href: '/alerts', label: '🚨 Commentary', emoji: '🚨' }
  ]

  return (
    <div
      className="fixed top-0 left-0 right-0 h-16 z-50 flex justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-4"
          >
            <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl p-3">
              <div className="flex items-center space-x-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wide transition-all duration-300 text-sm ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white shadow-lg' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <span className="mr-2">{item.emoji}</span>
                        {item.label.split(' ')[1]}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}