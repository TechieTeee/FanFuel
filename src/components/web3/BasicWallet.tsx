'use client'

import dynamic from 'next/dynamic'

// Import ConnectButton dynamically to avoid SSR issues
const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-6 py-3 rounded-xl font-bold">
        🔗 Loading...
      </div>
    )
  }
)

export default function BasicWallet() {
  return <ConnectButton />
}