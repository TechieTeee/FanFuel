'use client'

import { createConfig, http } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { defineChain } from 'viem'
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

// Define Chiliz Chain configuration
export const chilizChain = defineChain({
  id: 88882,
  name: 'Chiliz Spicy Testnet',
  network: 'chiliz-spicy',
  nativeCurrency: {
    decimals: 18,
    name: 'CHZ',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://spicy-rpc.chiliz.com/'],
    },
    public: {
      http: ['https://spicy-rpc.chiliz.com/'],
    },
  },
  blockExplorers: {
    default: { name: 'ChilizScan', url: 'https://spicy-explorer.chiliz.com/' },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, chilizChain],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: 'FanFuel' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [chilizChain.id]: http('https://spicy-rpc.chiliz.com/'),
  },
  ssr: false,
})