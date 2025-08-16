'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EnhancedWallet() {
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [chainId, setChainId] = useState<number>(0)
  const [showChainModal, setShowChainModal] = useState(false)

  const supportedChains = [
    { id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 88882, name: 'Chiliz', symbol: 'CHZ', color: '#DC2626' },
    { id: 10, name: 'Optimism', symbol: 'OP', color: '#FF0420' },
    { id: 8453, name: 'Base', symbol: 'ETH', color: '#0052FF' }
  ]

  useEffect(() => {
    setMounted(true)
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        
        if (accounts.length > 0) {
          setConnected(true)
          setAccount(accounts[0])
          setChainId(parseInt(chainId, 16))
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }
  }

  const handleConnect = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        
        setConnected(true)
        setAccount(accounts[0])
        setChainId(parseInt(chainId, 16))
      } else {
        alert('Please install MetaMask')
      }
    } catch (error) {
      alert(`Connection failed: ${error.message}`)
    }
  }

  const switchChain = async (targetChainId: number) => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
        setChainId(targetChainId)
        setShowChainModal(false)
      }
    } catch (error) {
      console.error('Chain switch failed:', error)
      alert(`Failed to switch chain: ${error.message}`)
    }
  }

  const getCurrentChain = () => {
    return supportedChains.find(chain => chain.id === chainId) || 
           { id: chainId, name: 'Unknown', symbol: '?', color: '#666666' }
  }

  if (!mounted) {
    return (
      <motion.div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </motion.div>
    )
  }

  if (!connected) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnect}
        style={{
          background: 'linear-gradient(to right, #f59e0b, #ef4444)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          position: 'relative',
          pointerEvents: 'auto'
        }}
      >
        🔗 Connect Wallet
      </motion.button>
    )
  }

  const currentChain = getCurrentChain()
  const isChilizChain = chainId === 88882

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        {/* Chain Indicator */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChainModal(!showChainModal)}
          style={{
            backgroundColor: currentChain.color + '20',
            border: `1px solid ${currentChain.color}30`,
            color: currentChain.color,
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 9999,
            position: 'relative',
            pointerEvents: 'auto'
          }}
        >
          {isChilizChain && '⚽'} {currentChain.name}
        </motion.button>

        {/* Account Display */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            backgroundColor: '#10b98180',
            border: '1px solid #10b98130',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '14px',
            zIndex: 9999,
            position: 'relative',
            pointerEvents: 'auto'
          }}
        >
          {account.slice(0, 6)}...{account.slice(-4)}
        </motion.div>

        {/* Chiliz SportFi Indicator */}
        {isChilizChain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: '#DC262620',
              border: '1px solid #DC262630',
              color: '#DC2626',
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '12px',
              zIndex: 9999,
              position: 'relative'
            }}
          >
            ⚽ SportFi
          </motion.div>
        )}
      </div>

      {/* Chain Switch Modal */}
      <AnimatePresence>
        {showChainModal && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              width: '280px',
              backgroundColor: '#1f2937f0',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid #374151',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              zIndex: 10000,
              padding: '16px'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                Switch Network
              </h4>
              <p style={{ color: '#9CA3AF', fontSize: '12px' }}>
                Select a blockchain network
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {supportedChains.map((chain) => (
                <motion.button
                  key={chain.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => switchChain(chain.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: chainId === chain.id ? `2px solid ${chain.color}` : '1px solid #374151',
                    backgroundColor: chainId === chain.id ? `${chain.color}20` : '#00000050',
                    color: chainId === chain.id ? chain.color : 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: chain.color
                    }}
                  />
                  {chain.name}
                  {chain.id === 88882 && <span>⚽</span>}
                  {chainId === chain.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                </motion.button>
              ))}
            </div>

            <button
              onClick={() => setShowChainModal(false)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}