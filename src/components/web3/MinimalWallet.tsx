'use client'

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'

export default function MinimalWallet() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <motion.div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </motion.div>
    )
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

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
                    className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 uppercase tracking-wide"
                  >
                    🔗 Connect Wallet
                  </motion.button>
                )
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openChainModal}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
                  >
                    ⚠️ Wrong Network
                  </motion.button>
                )
              }

              return (
                <div className="flex items-center space-x-3">
                  {/* Chain Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openChainModal}
                    className="bg-gray-800/80 backdrop-blur-lg border border-gray-600/50 px-4 py-2 rounded-xl hover:border-[#f59e0b]/50 transition-all duration-300 flex items-center space-x-2"
                  >
                    {chain.hasIcon && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        className="w-5 h-5"
                      />
                    )}
                    <span className="text-white font-bold text-sm">
                      {chain.name}
                    </span>
                  </motion.button>

                  {/* Account Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAccountModal}
                    className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-4 py-2 rounded-xl font-bold hover:shadow-xl transition-all duration-300"
                  >
                    <span className="text-sm">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </span>
                  </motion.button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}