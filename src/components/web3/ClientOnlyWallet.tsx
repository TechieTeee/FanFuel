'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import ConnectButton to prevent SSR issues
const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => ({ default: mod.ConnectButton })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-800/80 border border-gray-600/30 text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </div>
    )
  }
)

export default function ClientOnlyWallet() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-gray-800/80 border border-gray-600/30 text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </div>
    )
  }

  return <ConnectButton />
}