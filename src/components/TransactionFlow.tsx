'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TransactionFlowProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    type: 'support_athlete' | 'mint_nft' | 'bridge_tokens'
    athleteName?: string
    amount: number
    currency: string
    description: string
  }
  onConfirm: () => Promise<{ success: boolean; txHash?: string; error?: string }>
}

export default function TransactionFlow({ 
  isOpen, 
  onClose, 
  transaction, 
  onConfirm 
}: TransactionFlowProps) {
  const [stage, setStage] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm')
  const [txHash, setTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleConfirm = async () => {
    setStage('processing')
    
    try {
      const result = await onConfirm()
      
      if (result.success) {
        setTxHash(result.txHash || '')
        setStage('success')
        
        // Auto-close after success
        setTimeout(() => {
          onClose()
          setStage('confirm')
        }, 3000)
      } else {
        setError(result.error || 'Transaction failed')
        setStage('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStage('error')
    }
  }

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'support_athlete': return '💪'
      case 'mint_nft': return '🎨'
      case 'bridge_tokens': return '🌉'
      default: return '💰'
    }
  }

  const getStageContent = () => {
    switch (stage) {
      case 'confirm':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">{getTransactionIcon()}</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Confirm Transaction
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <p className="text-gray-300 mb-2">{transaction.description}</p>
              {transaction.athleteName && (
                <p className="text-[#f59e0b] font-bold">
                  Supporting: {transaction.athleteName}
                </p>
              )}
              <p className="text-2xl font-bold text-white mt-4">
                {transaction.amount} {transaction.currency}
              </p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] text-white py-3 rounded-xl font-bold"
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        )

      case 'processing':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-6xl mb-4"
            >
              ⚡
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Processing Transaction
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
              <div className="animate-pulse space-y-2">
                <div className="h-2 bg-[#f59e0b] rounded w-3/4 mx-auto"></div>
                <div className="h-2 bg-[#f59e0b]/50 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-300 mt-4">
                Please confirm in your wallet...
              </p>
            </div>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-bold text-[#10b981] mb-4">
              Transaction Successful!
            </h3>
            <div className="bg-[#10b981]/20 rounded-xl p-6 mb-6 border border-[#10b981]/30">
              <p className="text-white mb-2">
                {transaction.description}
              </p>
              {txHash && (
                <p className="text-xs text-gray-300 break-all">
                  Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white py-3 rounded-xl font-bold"
            >
              Continue
            </motion.button>
          </motion.div>
        )

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-[#ef4444] mb-4">
              Transaction Failed
            </h3>
            <div className="bg-[#ef4444]/20 rounded-xl p-6 mb-6 border border-[#ef4444]/30">
              <p className="text-white mb-2">
                {error}
              </p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage('confirm')}
                className="flex-1 bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white py-3 rounded-xl font-bold"
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(8px)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '90%',
              border: '1px solid #374151'
            }}
          >
            {getStageContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}