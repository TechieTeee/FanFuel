'use client'

import { useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TrendingUp, Smartphone, RotateCcw, BellRing, Cpu, Network, Sparkles } from 'lucide-react'
import { IconProps } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import HeroCarousel from '../components/HeroCarousel'
import TypewriterText from '../components/TypewriterText'
import SmoothScroll from '../components/SmoothScroll'
import CustomCursor from '../components/CustomCursor'
import MagneticButton from '../components/MagneticButton'

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
        
        {/* Floating Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 bg-black/80 backdrop-blur-md border border-gray-800/50 rounded-xl shadow-2xl"
        >
          <div className="flex items-center justify-between space-x-8">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/fanfuel-logo.png"
                  alt="FanFuel Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </motion.div>
              <span className="text-2xl font-bold text-white">
                FanFuel
              </span>
            </div>
            <MagneticButton 
              href="/dashboard"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Launch App
            </MagneticButton>
          </div>
        </motion.header>

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
                  className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-xl"
                >
                  <TypewriterText 
                    words={['GREATNESS', 'DREAMS', 'CHAMPIONS', 'VICTORY', 'PASSION']}
                    className=""
                  />
                </motion.div>
              </motion.h1>

              <motion.p 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto font-light leading-tight drop-shadow-lg tracking-wide"
              >
                Every purchase. Every moment. Every athlete.
              </motion.p>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <MagneticButton 
                  href="/dashboard"
                  className="bg-white text-black px-12 py-6 rounded-none text-xl font-black shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 uppercase tracking-wider"
                >
                  FUEL NOW
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
                  className="text-4xl font-bold text-white mb-4"
                >
                  Meet Fuelie
                </motion.h2>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-xl text-gray-300 max-w-2xl mx-auto"
                >
                  Your guide to seamless athlete support
                </motion.p>
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
                className="text-5xl md:text-6xl font-black text-center mb-16 text-white uppercase tracking-wider"
              >
                THE REALITY
              </motion.h2>
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
                      <Image
                        src="/icons/chart.png"
                        alt="Growth Chart 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">$1.7B NIL Market</h3>
                  <p className="text-gray-300 leading-relaxed">Concentrated among 2% of elite athletes, leaving 798,000+ underrepresented student-athletes with minimal NIL revenue.</p>
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
                      <Image
                        src="/icons/mobile.png"
                        alt="Mobile Phone 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">$7T Daily Spending</h3>
                  <p className="text-gray-300 leading-relaxed">Fans spend trillions on everyday purchases but none of this supports their favorite athletes directly.</p>
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
                      <Image
                        src="/icons/bell.png"
                        alt="Notification Bell 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Fan Frustration</h3>
                  <p className="text-gray-300 leading-relaxed">Fans want to financially support athletes but current methods are complex, limited, and disconnected from daily life.</p>
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
                  className="text-5xl md:text-6xl font-black text-center mb-16 text-white uppercase tracking-wider"
                >
                  PURE PERFORMANCE
                </motion.h2>
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
                        <Image
                          src="/icons/magic.png"
                          alt="Magic 3D Icon"
                          width={96}
                          height={96}
                          className="drop-shadow-2xl"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white">Choose Athletes</h4>
                    <p className="text-gray-300 leading-relaxed">Select underrepresented athletes to support through everyday spending</p>
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
                        <Image
                          src="/icons/mobile.png"
                          alt="Mobile Payment 3D Icon"
                          width={96}
                          height={96}
                          className="drop-shadow-2xl"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white">Tap-to-Pay</h4>
                    <p className="text-gray-300 leading-relaxed">Use FanFuel for everyday purchases - coffee, gas, groceries, anything</p>
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
                        <Image
                          src="/icons/cube.png"
                          alt="Automation Cube 3D Icon"
                          width={96}
                          height={96}
                          className="drop-shadow-2xl"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white">Auto-Split</h4>
                    <p className="text-gray-300 leading-relaxed">Percentage of every purchase automatically goes to your athletes via blockchain</p>
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
                        <Image
                          src="/icons/bell.png"
                          alt="Alert Bell 3D Icon"
                          width={96}
                          height={96}
                          className="drop-shadow-2xl"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-white">Smart Alerts</h4>
                    <p className="text-gray-300 leading-relaxed">AI detects critical moments and suggests extra support opportunities</p>
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
                className="text-4xl font-black mb-12 text-center text-white uppercase tracking-wider"
              >
                POWERED BY CHAMPIONS
              </motion.h2>
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
                      <Image
                        src="/icons/computer.png"
                        alt="Computer 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Chiliz Chain</h3>
                  <p className="text-gray-300 leading-relaxed">SportFi foundation with 2M+ sports fans and EVM compatibility</p>
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
                      <Image
                        src="/icons/wifi.png"
                        alt="Network 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">LayerZero</h3>
                  <p className="text-gray-300 leading-relaxed">Omnichain infrastructure enabling cross-chain NFT bridging</p>
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
                      <Image
                        src="/icons/cube.png"
                        alt="Flow Cube 3D Icon"
                        width={80}
                        height={80}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Flow</h3>
                  <p className="text-gray-300 leading-relaxed">Consumer-grade UX with mainstream adoption focus</p>
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
              className="flex items-center justify-center space-x-4 mb-8"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/fuelie-sitting.png"
                  alt="Fuelie Sitting"
                  width={80}
                  height={80}
                  className="rounded-full drop-shadow-xl"
                />
              </motion.div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                FanFuel
              </span>
            </motion.div>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Transforming Everyday Purchases into Athlete Revenue
            </motion.p>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm text-gray-400"
            >
              Built for Fans, and those who build the future
            </motion.p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}
