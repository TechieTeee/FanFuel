'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { chilizChain } from '@/lib/wagmi'

export default function SimpleUnifiedWallet() {
  const { address, isConnected, chain } = useAccount()
  const [showChilizInfo, setShowChilizInfo] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get CHZ balance when on Chiliz chain
  const { data: chzBalance } = useBalance({
    address: address,
    chainId: chilizChain.id,
  })

  const isOnChilizChain = chain?.id === chilizChain.id

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-gray-800/80 border border-gray-600/30 text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </div>
    )
  }

  return (
    <div className="relative">
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
                style: {
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
                  <div className="flex items-center space-x-2">
                    {/* Chain Button with Chiliz Enhancement */}
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
                      {chain.id === chilizChain.id && chzBalance && (
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

                    {/* Chiliz SportFi Badge */}
                    {chain.id === chilizChain.id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChilizInfo(!showChilizInfo)}
                        className="bg-red-600/20 border border-red-500/30 text-red-300 px-2 py-2 rounded-lg font-bold hover:bg-red-600/30 transition-colors text-sm"
                      >
                        ⚽
                      </motion.button>
                    )}
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>

      {/* Chiliz Info Dropdown */}
      <AnimatePresence>
        {showChilizInfo && isConnected && isOnChilizChain && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-red-500/30 shadow-2xl z-50 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚽</span>
                <div>
                  <h4 className="font-bold text-white text-sm">Chiliz SportFi</h4>
                  <p className="text-xs text-red-300">Sports-Native Blockchain</p>
                </div>
              </div>
              <button
                onClick={() => setShowChilizInfo(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {chzBalance && (
              <div className="bg-black/50 rounded-lg p-3 border border-red-500/20">
                <p className="text-xs text-gray-300 mb-1">CHZ Balance</p>
                <p className="text-lg font-bold text-white">
                  {parseFloat(chzBalance.formatted).toFixed(4)} CHZ
                </p>
                <p className="text-xs text-gray-400">
                  ≈ ${(parseFloat(chzBalance.formatted) * 0.12).toFixed(2)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}