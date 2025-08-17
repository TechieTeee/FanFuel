'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FueliChatBubble = ({ 
  messages = [], 
  fuelieState = 'waving', 
  position = 'bottom-right',
  autoRotate = true,
  showOnHover = false,
  className = ''
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!showOnHover);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate through messages
  useEffect(() => {
    if (autoRotate && messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length);
      }, 4000); // Change message every 4 seconds

      return () => clearInterval(interval);
    }
  }, [messages.length, autoRotate]);

  // Handle hover visibility
  useEffect(() => {
    if (showOnHover) {
      setIsVisible(isHovered);
    }
  }, [isHovered, showOnHover]);

  const getFuelieImage = () => {
    switch(fuelieState) {
      case 'eyes-closed':
        return '/fuelie-eyes-closed.png'
      case 'sitting':
        return '/fuelie-sitting.png'
      default:
        return '/fuelie-waving.png'
    }
  };

  const getPositionClasses = () => {
    switch(position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return position;
    }
  };

  if (!messages.length) return null;

  const currentMessage = messages[currentMessageIndex];

  return (
    <div 
      className={`fixed ${getPositionClasses()} z-50 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-end gap-3">
        {/* Chat Bubble */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-xs"
            >
              {/* Speech bubble */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 px-4 py-3 rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                <motion.p 
                  key={currentMessageIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium leading-relaxed"
                >
                  {currentMessage.text}
                </motion.p>
                
                {/* Emoji indicator for message type */}
                {currentMessage.type && (
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {currentMessage.type === 'tip' && '💡 Tip'}
                      {currentMessage.type === 'celebration' && '🎉 Great!'}
                      {currentMessage.type === 'warning' && '⚠️ Notice'}
                      {currentMessage.type === 'guide' && '🧭 Guide'}
                      {currentMessage.type === 'encourage' && '💪 You got this!'}
                    </span>
                    {messages.length > 1 && (
                      <div className="flex gap-1">
                        {messages.map((_, index) => (
                          <div
                            key={index}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                              index === currentMessageIndex 
                                ? 'bg-[#f59e0b]' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white transform translate-y-full"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fueli Character */}
        <motion.div
          animate={{ 
            y: [-2, 2, -2],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative"
        >
          <motion.img
            src={getFuelieImage()}
            alt="Fueli Guide"
            width={60}
            height={60}
            className="rounded-full border-3 border-[#f59e0b]/30 shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          />
          
          {/* Notification dot for new messages */}
          {messages.length > 1 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full border-2 border-white shadow-lg"
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                {messages.length}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FueliChatBubble;