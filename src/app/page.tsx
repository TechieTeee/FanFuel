'use client'

import { useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import AnimatedBackground from '../components/AnimatedBackground'
import HeroCarousel from '../components/HeroCarousel'
import TypewriterText from '../components/TypewriterText'
import SmoothScroll from '../components/SmoothScroll'
import CustomCursor from '../components/CustomCursor'
import MagneticButton from '../components/MagneticButton'
import HoverNavigation from '../components/HoverNavigation.js'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.fade-in-up', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <SmoothScroll>
      <div ref={containerRef} className="relative min-h-screen overflow-hidden">
        <CustomCursor />
        <AnimatedBackground />
        <HoverNavigation />
        
        {/* Web3 Connect Button - Upper Right */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="fixed top-6 right-6 z-40"
        >
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
                        <button
                          onClick={openConnectModal}
                          className="bg-black/80 backdrop-blur-md border border-[#f59e0b]/50 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-[#f59e0b]"
                        >
                          🔗 Connect
                        </button>
                      )
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      >
                        🏆 {account.displayName}
                      </button>
                    )
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </motion.div>

        {/* Hero Section */}
        <main className="relative min-h-screen">
          <motion.div 
            ref={heroRef}
            style={{ y, opacity }}
            className="relative flex items-center justify-center min-h-screen px-6"
          >
            <HeroCarousel />
            
            <div className="relative z-10 text-center max-w-5xl mx-auto">
              <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-8xl md:text-9xl font-black mb-8 leading-none tracking-tight"
              >
                <span className="block text-white drop-shadow-2xl mb-4">
                  FUEL
                </span>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="block bg-gradient-to-r from-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent drop-shadow-xl"
                >
                  <TypewriterText 
                    words={['GREATNESS', 'LEGENDS', 'REVOLUTION', 'CHAMPIONS', 'DOMINANCE']}
                    className=""
                  />
                </motion.div>
              </motion.h1>

              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="text-2xl md:text-3xl text-white/90 mb-8 max-w-4xl mx-auto font-light leading-tight drop-shadow-lg tracking-wide"
              >
                The revolution starts with your next purchase.
              </motion.p>
              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.7 }}
                className="text-lg md:text-xl text-[#f59e0b]/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg"
              >
                Transform every coffee, every meal, every transaction into direct support for underrepresented student athletes. This is how legends are born.
              </motion.p>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <MagneticButton 
                  href="/spending"
                  className="bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white px-16 py-6 rounded-xl text-xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 uppercase tracking-wider border-2 border-[#f59e0b] hover:border-white"
                >
                  ⚡ IGNITE GREATNESS
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>

          {/* Meet Fuelie Section */}
          <section className="py-20 px-6 relative">
            <div className="container mx-auto text-center">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="mb-8"
                >
                  <Image
                    src="/fuelie-waving.png"
                    alt="Meet Fuelie"
                    width={150}
                    height={150}
                    className="drop-shadow-2xl opacity-90"
                  />
                </motion.div>
                <motion.h2 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-wider"
                >
                  🤖 Meet Fuelie
                </motion.h2>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-xl md:text-2xl text-orange-300 max-w-4xl mx-auto mb-6 font-semibold"
                >
                  Your AI-powered champion for athlete empowerment
                </motion.p>
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="max-w-5xl mx-auto space-y-4"
                >
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Fuelie isn't just an AI assistant – he's a revolutionary force that transforms ordinary spending into extraordinary athlete support. Every tap of your card becomes a declaration of belief in underrepresented champions.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    With advanced blockchain intelligence and real-time sports analytics, Fuelie identifies critical moments when your favorite athletes need support most. He doesn't just process payments – he orchestrates a movement that turns everyday fans into kingmakers.
                  </p>
                  <p className="text-lg text-orange-300/90 font-medium">
                    "Every purchase is a vote. Every transaction is a statement. Every fan becomes a champion maker." - Fuelie
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-24 px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="container mx-auto"
            >
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-black text-center mb-8 text-white uppercase tracking-wider"
              >
                🔥 THE BROKEN SYSTEM
              </motion.h2>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-[#ef4444] text-center mb-16 max-w-4xl mx-auto font-semibold"
              >
                While billions flow through collegiate sports, the student athletes who give everything get nothing.
              </motion.p>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-500/30"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">📈</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide">📈 $1.7B Monopolized</h3>
                  <p className="text-gray-200 leading-relaxed text-lg font-medium">A massive market completely dominated by 2% of elite athletes. Meanwhile, 798,000+ talented student-athletes fight for scraps. <span className="text-red-400 font-bold">This ends now.</span></p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-500/30"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">💰</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide">💰 $7T Wasted Power</h3>
                  <p className="text-gray-200 leading-relaxed text-lg font-medium">Every single day, passionate fans spend TRILLIONS on coffee, gas, groceries, and life. <span className="text-orange-400 font-bold">None of it reaches the student athletes they love.</span> Pure wasted potential.</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-orange-500/30"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">😤</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide">😤 Fan Rage</h3>
                  <p className="text-gray-200 leading-relaxed text-lg font-medium">Millions of fans are screaming to support their heroes but are trapped in a system designed to exclude them. <span className="text-yellow-400 font-bold">Donations are awkward. Merchandise barely helps. The connection is broken.</span></p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* How It Works */}
          <section className="py-24 px-6">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-2xl rounded-3xl p-16 border border-gray-700/50 shadow-2xl"
              >
                <motion.h2 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-7xl font-black text-center mb-8 text-white uppercase tracking-wider"
                >
                  ⚡ THE FANFUEL WAY
                </motion.h2>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-[#f59e0b] text-center mb-16 max-w-4xl mx-auto font-semibold"
                >
                  Four unstoppable steps to athlete revolution
                </motion.p>
                <div className="grid md:grid-cols-4 gap-10">
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotateY: 15 }}
                        transition={{ duration: 0.4 }}
                        className="w-24 h-24 flex items-center justify-center mx-auto mb-4"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <span className="text-9xl drop-shadow-2xl">🏆</span>
                      </motion.div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">Choose Your Champions</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Discover hidden gems and rising stars who deserve your support. <span className="text-[#f59e0b] font-bold">Your choice. Your impact. Your legacy.</span></p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotateY: 15 }}
                        transition={{ duration: 0.4 }}
                        className="w-24 h-24 flex items-center justify-center mx-auto mb-4"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <span className="text-9xl drop-shadow-2xl">💳</span>
                      </motion.div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">Transform Spending</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Every coffee, every meal, every purchase becomes a precision strike for athlete support. <span className="text-[#10b981] font-bold">Normal life, extraordinary impact.</span></p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotateY: 15 }}
                        transition={{ duration: 0.4 }}
                        className="w-24 h-24 flex items-center justify-center mx-auto mb-4"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <span className="text-9xl drop-shadow-2xl">⚡</span>
                      </motion.div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">⚡ Instant Impact</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Blockchain-powered splits happen in milliseconds. <span className="text-[#10b981] font-bold">Zero friction. Maximum velocity. Pure athlete fuel.</span></p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="relative mb-8">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotateY: 15 }}
                        transition={{ duration: 0.4 }}
                        className="w-24 h-24 flex items-center justify-center mx-auto mb-4"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <span className="text-9xl drop-shadow-2xl">💪</span>
                      </motion.div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">💪 Battle Intelligence</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Fuelie's AI engine detects career-defining moments – championships, injuries, breakthroughs. <span className="text-[#ef4444] font-bold">Strike when it matters most.</span></p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="py-20 px-6">
            <div className="container mx-auto text-center">
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-black mb-8 text-center text-white uppercase tracking-wider"
              >
                🏆 BUILT FOR DOMINANCE
              </motion.h2>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-[#f59e0b] text-center mb-16 max-w-3xl mx-auto font-medium"
              >
                Elite-grade infrastructure meets championship-level execution
              </motion.p>
              <div className="grid md:grid-cols-3 gap-10">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-red-500/50"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">⛓️</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase">⛓️ Chiliz Chain</h3>
                  <p className="text-gray-200 leading-relaxed text-lg">The ultimate SportFi battleground. <span className="text-red-400 font-bold">2M+ sports fans</span> already locked and loaded with EVM precision.</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-blue-500/50"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">🌐</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase">🌐 LayerZero</h3>
                  <p className="text-gray-200 leading-relaxed text-lg">Omnichain warfare technology. <span className="text-blue-400 font-bold">Cross-chain NFT bridging</span> that breaks down every barrier between fans and athletes.</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gray-900/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-green-500/50"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-8xl drop-shadow-2xl">⚡</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase">⚡ Flow Protocol</h3>
                  <p className="text-gray-200 leading-relaxed text-lg">Consumer-grade simplicity meets <span className="text-green-400 font-bold">mainstream domination.</span> Built for the masses, optimized for impact.</p>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative py-20 px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full filter blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-xl"></div>
          </div>
          <div className="container mx-auto text-center relative">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div>
                <Image
                  src="/FanFuel_Logo.png"
                  alt="FanFuel Logo"
                  width={200}
                  height={200}
                  className="rounded-full drop-shadow-xl"
                />
              </div>
            </motion.div>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl text-[#f59e0b] mb-8 max-w-4xl mx-auto font-bold text-center"
            >
              🚀 Where Every Purchase Becomes a Championship Moment
            </motion.p>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-300 font-medium"
            >
              🏆 Built for the fans fueling the future
            </motion.p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}
