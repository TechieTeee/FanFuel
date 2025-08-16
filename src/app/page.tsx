'use client'

import { useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedBackground from '../components/AnimatedBackground'
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
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
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
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FanFuel
              </span>
            </div>
            <MagneticButton 
              href="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
          >
            {/* Hero Background Images */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 2 }}
                className="absolute top-20 left-10 w-32 h-32 rounded-full overflow-hidden"
              >
                <Image
                  src="/pexels-cottonbro-5740517.jpg"
                  alt="Sports Background"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 2, delay: 0.3 }}
                className="absolute top-32 right-20 w-24 h-24 rounded-full overflow-hidden"
              >
                <Image
                  src="/pexels-pixabay-163439.jpg"
                  alt="Sports Background"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 2, delay: 0.6 }}
                className="absolute bottom-40 left-1/4 w-28 h-28 rounded-full overflow-hidden"
              >
                <Image
                  src="/pexels-football-wife-577822-1618169.jpg"
                  alt="Sports Background"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mb-8"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Image
                  src="/fuelie-waving.png"
                  alt="Fuelie Mascot Waving"
                  width={250}
                  height={250}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-7xl md:text-8xl font-black mb-6 leading-none"
            >
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Where Fans
              </span>
              <motion.span 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              >
                Fuel
              </motion.span>
              <span className="block bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                the Future
              </span>
            </motion.h1>

            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Transform your everyday purchases into athlete support. Every tap, swipe, and purchase automatically 
              sends a percentage to your chosen athletes, plus get alerts to provide extra support during critical moments.
            </motion.p>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <MagneticButton 
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Start Supporting Athletes
              </MagneticButton>
              <MagneticButton 
                href="/about"
                className="bg-white/20 backdrop-blur-md text-gray-800 px-10 py-5 rounded-full text-xl font-semibold border-2 border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                Learn More
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Problem Statement */}
          <section className="py-32 px-6">
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
                className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                The Challenge
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <Image
                      src="/pexels-yankrukov-8199172.jpg"
                      alt="NIL Market"
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">$1.7B NIL Market</h3>
                  <p className="text-gray-600 leading-relaxed">Concentrated among 2% of elite athletes, leaving 798,000+ underrepresented student-athletes with minimal NIL revenue.</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <Image
                      src="/pexels-karolina-grabowska-8106658.jpg"
                      alt="Daily Spending"
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">$7T Daily Spending</h3>
                  <p className="text-gray-600 leading-relaxed">Fans spend trillions on everyday purchases but none of this supports their favorite athletes directly.</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-white/10 backdrop-blur-lg p-10 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <Image
                      src="/pexels-cottonbro-7335859.jpg"
                      alt="Fan Frustration"
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Fan Frustration</h3>
                  <p className="text-gray-600 leading-relaxed">Fans want to financially support athletes but current methods are complex, limited, and disconnected from daily life.</p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* How It Works */}
          <section className="py-32 px-6">
            <div className="container mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl rounded-[3rem] p-16 border border-white/20 shadow-2xl"
              >
                <motion.h2 
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-6xl font-bold text-center mb-20 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                >
                  How FanFuel Works
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
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl"
                      >
                        <Image
                          src="/pexels-cottonbro-5740794.jpg"
                          alt="Choose Athletes"
                          width={48}
                          height={48}
                          className="rounded-2xl object-cover"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Choose Your Athletes</h4>
                    <p className="text-gray-600 leading-relaxed">Select your favorite underrepresented athletes to support through your everyday spending</p>
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
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl"
                      >
                        <Image
                          src="/pexels-ketut-subiyanto-4720517.jpg"
                          alt="Tap to Pay"
                          width={48}
                          height={48}
                          className="rounded-2xl object-cover"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Tap-to-Pay Daily</h4>
                    <p className="text-gray-600 leading-relaxed">Use FanFuel for everyday purchases - coffee, gas, groceries, anything you buy</p>
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
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl"
                      >
                        <Image
                          src="/pexels-tima-miroshnichenko-5750821.jpg"
                          alt="Auto Split"
                          width={48}
                          height={48}
                          className="rounded-2xl object-cover"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Auto-Split Revenue</h4>
                    <p className="text-gray-600 leading-relaxed">A percentage of every purchase automatically goes to your chosen athletes via blockchain</p>
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
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl"
                      >
                        <Image
                          src="/pexels-mikhail-nilov-8455986.jpg"
                          alt="Critical Alerts"
                          width={48}
                          height={48}
                          className="rounded-2xl object-cover"
                        />
                      </motion.div>
                    </div>
                    <h4 className="text-xl font-bold mb-4 text-gray-800">Critical Moment Alerts</h4>
                    <p className="text-gray-600 leading-relaxed">AI detects when athletes face criticism and suggests extra support opportunities</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Blockchain Partners */}
          <section className="py-32 px-6">
            <div className="container mx-auto text-center">
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold mb-20 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
              >
                Powered by Leading Blockchain Partners
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-10">
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg p-10 rounded-3xl border border-red-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-bold text-white">C</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Chiliz Chain</h3>
                  <p className="text-gray-600 leading-relaxed">SportFi foundation with 2M+ sports fans and EVM compatibility</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg p-10 rounded-3xl border border-blue-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-bold text-white">L</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">LayerZero</h3>
                  <p className="text-gray-600 leading-relaxed">Omnichain infrastructure enabling cross-chain NFT bridging</p>
                </motion.div>
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-lg p-10 rounded-3xl border border-green-200/30 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-bold text-white">F</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Flow</h3>
                  <p className="text-gray-600 leading-relaxed">Consumer-grade UX with mainstream adoption focus</p>
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
              Built for ETHGlobal NY 2025 Hackathon
            </motion.p>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  )
}
