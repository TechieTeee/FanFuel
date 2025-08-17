'use client'

import { useState, useEffect } from 'react'

export default function BasicButton() {
  const [mounted, setMounted] = useState(false)
  const [account, setAccount] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        })
        .catch(console.error)
    }
  }, [])

  const handleConnect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask!')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(accounts[0])
    } catch (error) {
      console.error('Failed to connect:', error)
      alert(`Connection failed: ${error.message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAccount(null)
  }

  // Don't render anything server-side
  if (!mounted) {
    return (
      <button
        style={{
          backgroundColor: '#f59e0b',
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
        disabled
      >
        🔗 Loading...
      </button>
    )
  }

  // Connected state
  if (account) {
    return (
      <div style={{ 
        zIndex: 9999, 
        position: 'relative', 
        pointerEvents: 'auto',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          style={{
            backgroundColor: '#374151',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {`${account.slice(0, 6)}...${account.slice(-4)}`}
        </button>
        <button
          onClick={handleDisconnect}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  // Disconnected state
  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      style={{
        backgroundColor: isConnecting ? '#9ca3af' : '#f59e0b',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 'bold',
        border: 'none',
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        zIndex: 9999,
        position: 'relative',
        pointerEvents: 'auto',
        transition: 'all 0.2s ease',
      }}
    >
      {isConnecting ? '⏳ Connecting...' : '🔗 Connect Wallet'}
    </button>
  )
}