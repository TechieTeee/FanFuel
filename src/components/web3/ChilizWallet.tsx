'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useBalance } from 'wagmi'
import { chilizChain } from '@/lib/wagmi'
import { 
  getChilizBalance, 
  getFanAthleteTokens, 
  getChilizEcosystemInfo,
  type AthleteToken,
  type ChilizWalletInfo 
} from '@/lib/chiliz'

interface ChilizWalletProps {
  onSupportAthlete?: (athleteId: string, amount: string) => void
}

export default function ChilizWallet({ onSupportAthlete }: ChilizWalletProps) {
  const { address, isConnected, chain } = useAccount()
  const [walletInfo, setWalletInfo] = useState<ChilizWalletInfo | null>(null)
  const [ecosystemInfo, setEcosystemInfo] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    
    setLoading(true)
    setError(null)

    try {
      // Get athlete tokens owned by this fan
      const tokensResult = await getFanAthleteTokens(address)
      
      if (tokensResult.success && tokensResult.tokens) {
        setWalletInfo({
          address,
          chzBalance: chzBalance?.formatted || '0',
          athleteTokens: tokensResult.tokens
        })
      } else {
        throw new Error(tokensResult.error || 'Failed to load athlete tokens')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const loadEcosystemInfo = async () => {
    try {
      const result = await getChilizEcosystemInfo()
      if (result.success) {
        setEcosystemInfo(result.info)
      }
    } catch (err) {
      console.error('Failed to load ecosystem info:', err)
    }
  }

  const isOnChilizChain = chain?.id === chilizChain.id

  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 text-center"
      >
        <div className="text-4xl mb-4">🔗</div>
        <h3 className="text-xl font-bold text-white mb-2">Connect to Chiliz SportFi</h3>
        <p className="text-gray-300 text-sm">Connect your wallet to access the sports-native blockchain</p>
      </motion.div>
    )
  }

  if (!isOnChilizChain) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30 text-center"
      >
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">Switch to Chiliz Chain</h3>
        <p className="text-gray-300 text-sm mb-4">
          You&apos;re on {chain?.name}. Switch to Chiliz Spicy Testnet for SportFi features.
        </p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors">
          Switch to Chiliz
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-lg rounded-xl p-6 border border-red-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">⚽</div>
          <div>
            <h3 className="text-xl font-bold text-white">Chiliz SportFi</h3>
            <p className="text-sm text-red-300">Sports-Native Blockchain</p>
          </div>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      {/* CHZ Balance */}
      <div className="bg-black/50 rounded-lg p-4 mb-4 border border-red-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">CHZ Balance</p>
            <p className="text-2xl font-bold text-white">
              {chzBalance?.formatted || '0'} CHZ
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">≈ ${(parseFloat(chzBalance?.formatted || '0') * 0.12).toFixed(2)}</p>
            <p className="text-xs text-red-300">SportFi Ready</p>
          </div>
        </div>
      </div>

      {/* Ecosystem Stats */}
      {ecosystemInfo && (
        <div className="bg-black/30 rounded-lg p-4 mb-4 border border-red-500/20">
          <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">🏆 SportFi Ecosystem</h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-red-400">{ecosystemInfo.totalSportsTokens}</p>
              <p className="text-xs text-gray-400">Sports Tokens</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-400">{(ecosystemInfo.totalFans / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-400">Sports Fans</p>
            </div>
          </div>
        </div>
      )}

      {/* Athlete Tokens */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-400">Loading athlete tokens...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
          <p className="text-sm text-red-300">⚠️ {error}</p>
        </div>
      ) : walletInfo?.athleteTokens && walletInfo.athleteTokens.length > 0 ? (
        <div>
          <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">💪 Your Athlete Tokens</h4>
          <div className="space-y-3">
            {walletInfo.athleteTokens.map((token) => (
              <motion.div 
                key={token.athleteId}
                whileHover={{ scale: 1.02 }}
                className="bg-black/50 rounded-lg p-3 border border-red-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{token.symbol}</p>
                    <p className="text-xs text-gray-400">Athlete Token</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-400">${parseFloat(token.balance).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Support Given</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm text-gray-400">No athlete tokens yet</p>
          <p className="text-xs text-red-300">Start supporting athletes to earn tokens!</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadWalletData()}
            className="bg-red-600/20 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-600/30 transition-colors"
          >
            🔄 Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600/20 border border-orange-500/30 text-orange-300 px-3 py-2 rounded-lg text-sm font-bold hover:bg-orange-600/30 transition-colors"
          >
            ⛽ Add CHZ
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}