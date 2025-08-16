'use client'

import { useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import BasicButton from '../components/web3/BasicButton'
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
        
        {/* Unified Web3 Connect - Upper Right */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="fixed top-6 right-6 z-40"
        >
          <BasicButton />
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
                  FUEL THE FUTURE
                </span>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="block bg-gradient-to-r from-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent drop-shadow-xl"
                >
                  <TypewriterText 
                    words={['OF SPORTS', 'OF ATHLETES', 'OF FANDOM']}
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
                Turn your everyday spending into direct support for your favorite athletes.
              </motion.p>
              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.7 }}
                className="text-lg md:text-xl text-[#f59e0b]/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg"
              >
Transform every coffee, every meal, every transaction into direct support for athletes who need it most - from Olympic hopefuls to rising MLS stars to track champions. This is how legends are born.
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
                    Fuelie isn&apos;t just an AI assistant – he&apos;s a revolutionary force that transforms ordinary spending into extraordinary athlete support. Every tap of your card becomes a declaration of belief in emerging champions across Olympic sports, professional leagues, collegiate athletics, and individual disciplines.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    With advanced blockchain intelligence and real-time sports analytics, Fuelie identifies critical moments when athletes need support most. From Olympic trials to MLS seasons to March Madness to track meets, he doesn&apos;t just process payments – he provides athletes with unprecedented fan data and revenue streams.
                  </p>
                  <p className="text-lg text-orange-300/90 font-medium">
                    &quot;Every purchase is a vote. Every transaction is a statement. Every fan becomes a champion maker. Every athlete gets the data they need to build their brand.&quot; - Fuelie
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Pay Disparity Section */}
          <section className="py-24 px-6">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-br from-red-900/80 to-orange-800/60 backdrop-blur-2xl rounded-3xl p-16 border border-red-700/50 shadow-2xl"
              >
                <motion.h2 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-7xl font-black text-center mb-8 text-white uppercase tracking-wider"
                >
                  ⚖️ THE DISPARITY CRISIS
                </motion.h2>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-yellow-300 text-center mb-16 max-w-6xl mx-auto font-semibold"
                >
                  Talented athletes across sports face shocking revenue inequality while elite leagues hoard billions
                </motion.p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
                  >
                    <h3 className="text-2xl font-bold text-red-300 mb-4">WNBA vs NBA</h3>
                    <p className="text-white/90 text-lg leading-relaxed">WNBA max salary: $230K. NBA average: $8.5M. Same sport, 37x pay gap.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
                  >
                    <h3 className="text-2xl font-bold text-red-300 mb-4">Women&apos;s Soccer</h3>
                    <p className="text-white/90 text-lg leading-relaxed">World Cup winners earned less than men&apos;s team that didn&apos;t qualify. Pure injustice.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
                  >
                    <h3 className="text-2xl font-bold text-red-300 mb-4">Olympic Athletes</h3>
                    <p className="text-white/90 text-lg leading-relaxed">Track stars with millions of followers work multiple jobs. Zero consistent income despite elite performance.</p>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20"
                  >
                    <h3 className="text-2xl font-bold text-red-300 mb-4">MLS Growth</h3>
                    <p className="text-white/90 text-lg leading-relaxed">Fastest-growing US sport but most players earn under $100K while European counterparts make millions.</p>
                  </motion.div>
                </div>
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
                While billions flow through professional sports, the athletes who give everything face massive pay disparities.
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
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-wide">📈 Billions Monopolized</h3>
                  <p className="text-gray-200 leading-relaxed text-lg font-medium">A massive market completely dominated by elite leagues. Meanwhile, UFC fighters, boxers, league soccer players, talented WNBA, Olympic, MLS, collegiate, and emerging athletes fight for scraps. <span className="text-red-400 font-bold">This ends now.</span></p>
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
                  <p className="text-gray-200 leading-relaxed text-lg font-medium">Every single day, passionate fans spend TRILLIONS on coffee, gas, groceries, and life. <span className="text-orange-400 font-bold">None of it reaches the athletes they love.</span> Pure wasted potential.</p>
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
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">1. Choose Your Champion</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Discover and support underrepresented athletes.</p>
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
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">2. Fuel Their Journey</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Your everyday purchases send direct support.</p>
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
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">3. See Your Impact</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Track your contributions and see the difference you&apos;re making.</p>
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
                    <h4 className="text-2xl font-black mb-4 text-white uppercase tracking-wide">4. Unlock Rewards</h4>
                    <p className="text-gray-200 leading-relaxed text-lg font-medium">Earn exclusive NFTs and rewards for your support.</p>
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
