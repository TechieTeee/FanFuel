'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useBalance } from 'wagmi'
import { chilizChain } from '@/lib/wagmi'
import { 
  getAthleteTokens, 
  getEcosystemStats
} from '@/lib/chiliz'

export default function ChilizWallet({ onSupportAthlete }) {
  const { address, isConnected, chain } = useAccount()
  const [walletInfo, setWalletInfo] = useState(null)
  const [ecosystemInfo, setEcosystemInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get CHZ balance using wagmi hook
  const { data: chzBalance } = useBalance({
    address: address,
    chainId: chilizChain.id,
  })

  useEffect(() => {
    if (isConnected && address) {
      loadWalletData()
      loadEcosystemInfo()
    }
  }, [address, isConnected])

  const loadWalletData = async () => {
    if (!address) return

    try {
      setLoading(true)
      setError(null)
      
      const tokensResult = await getAthleteTokens(address)
      const balance = chzBalance?.formatted || '0'
      
      setWalletInfo({
        balance,
        tokens: tokensResult || []
      })
    } catch (err) {
      setError('Failed to load wallet data')
      console.error('Wallet data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadEcosystemInfo = async () => {
    try {
      const result = await getEcosystemStats()
      setEcosystemInfo(result)
    } catch (err) {
      console.error('Ecosystem info error:', err)
    }
  }

  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Connect to Chiliz</h3>
          <p className="text-gray-300 text-sm">Connect your wallet to access CHZ tokens and athlete fan tokens</p>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20"
      >
        <div className="text-center">
          <div className="animate-spin w-8 h-8 mx-auto mb-4 border-2 border-orange-400 border-t-transparent rounded-full"></div>
          <p className="text-white">Loading Chiliz wallet...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-lg rounded-2xl p-6 border border-red-500/20"
      >
        <div className="text-center">
          <span className="text-2xl mb-4 block">⚠️</span>
          <h3 className="text-lg font-bold text-white mb-2">Error</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button 
            onClick={loadWalletData}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">CHZ</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Chiliz Wallet</h3>
            <p className="text-gray-400 text-xs">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-orange-400 font-bold text-lg">{chzBalance?.formatted || '0'} CHZ</p>
          <p className="text-gray-400 text-xs">${((parseFloat(chzBalance?.formatted || '0')) * 0.08).toFixed(2)}</p>
        </div>
      </div>

      {ecosystemInfo && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-orange-800/20 rounded-lg p-3">
            <div className="text-orange-400 text-xs font-medium">Sports Tokens</div>
            <div className="text-white font-bold text-lg">{ecosystemInfo.totalSportsTokens || 0}</div>
          </div>
          <div className="bg-red-800/20 rounded-lg p-3">
            <div className="text-red-400 text-xs font-medium">Total Fans</div>
            <div className="text-white font-bold text-lg">{ecosystemInfo.totalFans || 0}</div>
          </div>
        </div>
      )}

      <div className="border-t border-orange-500/20 pt-4">
        <h4 className="text-white font-bold mb-3 flex items-center">
          <span className="mr-2">🏆</span>
          My Athlete Tokens
        </h4>
        
        {walletInfo?.tokens && walletInfo.tokens.length > 0 ? (
          <div className="space-y-2">
            {walletInfo.tokens.map((token) => (
              <div key={token.athleteId} className="bg-orange-800/10 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{token.symbol}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{token.athleteName}</div>
                    <div className="text-gray-400 text-xs">{token.balance} {token.symbol}</div>
                  </div>
                </div>
                <div className="text-orange-400 text-sm font-medium">
                  ${token.usdValue?.toFixed(2) || '0.00'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-6">
            <span className="text-2xl mb-2 block">📈</span>
            <p className="text-sm">No athlete tokens yet</p>
            <p className="text-xs">Support athletes to earn their tokens</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-orange-500/20 text-center">
        <p className="text-xs text-orange-300/80">
          🔥 Chiliz Sports Ecosystem • 💰 Fan Token Trading • 🏆 Athlete Support
        </p>
      </div>
    </motion.div>
  )
}