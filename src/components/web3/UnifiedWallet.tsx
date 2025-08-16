'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { chilizChain } from '../../lib/wagmi'
import { 
  getAthleteTokens, 
  getEcosystemStats,
   
} from '../../lib/chiliz'

interface UnifiedWalletProps {
  showBalance?: boolean
  showTokens?: boolean
  compact?: boolean
}

export default function UnifiedWallet({ 
  showBalance = true, 
  showTokens = true, 
  compact = false 
}: UnifiedWalletProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [athleteTokens, setAthleteTokens] = useState<AthleteToken[]>([])
  const [ecosystemInfo, setEcosystemInfo] = useState<unknown>(null)
  const [showChilizDetails, setShowChilizDetails] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get CHZ balance only when connected and on Chiliz chain
  const { data: chzBalance } = useBalance({
    address: address,
    chainId: chilizChain.id,
    query: {
      enabled: isConnected && address !== undefined && chainId === chilizChain.id
    }
  })

  const isOnChilizChain = chainId === chilizChain.id

  useEffect(() => {
    if (isConnected && address && isOnChilizChain) {
      loadChilizData()
    }
  }, [address, isConnected, isOnChilizChain])

  const loadChilizData = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const [tokensResult, ecosystemResult] = await Promise.all([
        getAthleteTokens(address),
        getEcosystemStats()
      ])
      
      if (tokensResult.success && tokensResult.tokens) {
        setAthleteTokens(tokensResult.tokens)
      }
      
      if (ecosystemResult.success) {
        setEcosystemInfo(ecosystemResult.info)
      }
    } catch (error) {
      console.error('Failed to load Chiliz data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchToChiliz = () => {
    if (switchChain) {
      switchChain({ chainId: chilizChain.id })
    }
  }

  return (
    <div className="relative">
      {/* Enhanced ConnectButton with Chiliz Integration */}
      <div className="flex items-center space-x-3">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading'
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated')

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openConnectModal}
                        type="button"
                        className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>🔗</span>
                        <span>Connect Wallet</span>
                      </motion.button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openChainModal}
                        type="button"
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                      >
                        Wrong network
                      </motion.button>
                    )
                  }

                  return (
                    <div className="flex items-center space-x-3">
                      {/* Chain Indicator with Chiliz Special Treatment */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openChainModal}
                        type="button"
                        className={`px-3 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center space-x-2 ${
                          chain.id === chilizChain.id
                            ? 'bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30'
                            : 'bg-gray-600/20 border border-gray-500/30 text-gray-300 hover:bg-gray-600/30'
                        }`}
                      >
                        {chain.id === chilizChain.id && <span>⚽</span>}
                        <span>{chain.name}</span>
                        {chain.id === chilizChain.id && showBalance && chzBalance && (
                          <span className="text-xs bg-red-500/20 px-2 py-1 rounded">
                            {parseFloat(chzBalance.formatted).toFixed(2)} CHZ
                          </span>
                        )}
                      </motion.button>

                      {/* Account Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openAccountModal}
                        type="button"
                        className="bg-gray-800/80 border border-gray-600/30 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700/80 transition-all duration-300 flex items-center space-x-2"
                      >
                        <span>{account.displayName}</span>
                        {account.displayBalance && (
                          <span className="text-xs text-gray-400">
                            {account.displayBalance}
                          </span>
                        )}
                      </motion.button>

                      {/* Chiliz Special Actions */}
                      {chain.id === chilizChain.id && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowChilizDetails(!showChilizDetails)}
                          className="bg-red-600/20 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg font-bold hover:bg-red-600/30 transition-colors"
                        >
                          ⚽ SportFi
                        </motion.button>
                      )}

                      {/* Switch to Chiliz if not on Chiliz */}
                      {chain.id !== chilizChain.id && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSwitchToChiliz}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <span>⚽</span>
                          <span>Chiliz</span>
                        </motion.button>
                      )}
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>

      {/* Expandable Chiliz Details */}
      <AnimatePresence>
        {showChilizDetails && isConnected && isOnChilizChain && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-red-500/30 shadow-2xl z-50"
          >
            <div className="p-4">
              {/* SportFi Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⚽</span>
                  <div>
                    <h4 className="font-bold text-white">Chiliz SportFi</h4>
                    <p className="text-xs text-red-300">Sports-Native Blockchain</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChilizDetails(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              {/* CHZ Balance */}
              {showBalance && chzBalance && (
                <div className="bg-black/50 rounded-lg p-3 mb-3 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-300">CHZ Balance</p>
                      <p className="text-lg font-bold text-white">
                        {parseFloat(chzBalance.formatted).toFixed(4)} CHZ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        ≈ ${(parseFloat(chzBalance.formatted) * 0.12).toFixed(2)}
                      </p>
                      <p className="text-xs text-red-300">SportFi Ready</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ecosystem Info */}
              {ecosystemInfo && (
                <div className="bg-black/30 rounded-lg p-3 mb-3 border border-red-500/20">
                  <h5 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">
                    🏆 SportFi Ecosystem
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-red-400">{ecosystemInfo.totalSportsTokens}</p>
                      <p className="text-xs text-gray-400">Sports Tokens</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-400">
                        {(ecosystemInfo.totalFans / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-400">Sports Fans</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Athlete Tokens */}
              {showTokens && (
                <div>
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-gray-400">Loading tokens...</p>
                    </div>
                  ) : athleteTokens.length > 0 ? (
                    <div>
                      <h5 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">
                        💪 Your Athlete Tokens
                      </h5>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {athleteTokens.slice(0, 3).map((token) => (
                          <div 
                            key={token.athleteId}
                            className="bg-black/50 rounded-lg p-2 border border-red-500/20 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-white text-xs">{token.symbol}</p>
                              <p className="text-xs text-gray-400">Athlete Token</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-400 text-xs">
                                ${parseFloat(token.balance).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400">Support</p>
                            </div>
                          </div>
                        ))}
                        {athleteTokens.length > 3 && (
                          <p className="text-xs text-center text-gray-400">
                            +{athleteTokens.length - 3} more tokens
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <div className="text-2xl mb-1">🎯</div>
                      <p className="text-xs text-gray-400">No athlete tokens</p>
                      <p className="text-xs text-red-300">Start supporting athletes!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-3 border-t border-gray-700/50 mt-3">
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadChilizData}
                    className="bg-red-600/20 border border-red-500/30 text-red-300 px-2 py-1 rounded text-xs font-bold hover:bg-red-600/30 transition-colors"
                  >
                    🔄 Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-600/20 border border-orange-500/30 text-orange-300 px-2 py-1 rounded text-xs font-bold hover:bg-orange-600/30 transition-colors"
                  >
                    ⛽ Add CHZ
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chain Switch Notification */}
      <AnimatePresence>
        {isConnected && !isOnChilizChain && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-yellow-900/90 backdrop-blur-lg rounded-xl border border-yellow-500/30 p-3 shadow-xl z-40"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-400">⚠️</span>
              <p className="text-sm font-bold text-white">Switch to SportFi</p>
            </div>
            <p className="text-xs text-yellow-200 mb-3">
              Connect to Chiliz Chain for sports features
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSwitchToChiliz}
              className="w-full bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>⚽</span>
              <span>Switch to Chiliz</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}