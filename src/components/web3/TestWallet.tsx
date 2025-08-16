'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TestWallet() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    try {
      // Check if window.ethereum exists
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        alert(`Connected: ${accounts[0]}`)
      } else {
        alert('Please install MetaMask or another Web3 wallet')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  if (!mounted) {
    return (
      <motion.div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 uppercase tracking-wide"
    >
      🔗 Connect Wallet
    </motion.button>
  )
}