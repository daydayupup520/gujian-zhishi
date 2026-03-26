import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  isLoading: boolean;
  text?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  isLoading,
  text = 'AI 识别中...',
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[rgba(5,5,16,0.85)] backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-32 h-32 border-4 border-blue-500/30 rounded-full"
          style={{
            borderTopColor: '#3b82f6',
            borderRightColor: 'transparent',
            borderBottomColor: '#8b5cf6',
            borderLeftColor: 'transparent',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle rotating ring */}
        <motion.div
          className="absolute inset-4 border-4 border-indigo-500/50 rounded-full"
          style={{
            borderTopColor: 'transparent',
            borderRightColor: '#6366f1',
            borderBottomColor: 'transparent',
            borderLeftColor: '#a78bfa',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-white text-2xl font-bold">AI</span>
        </motion.div>

        {/* Text */}
        <motion.p
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-blue-400 font-medium whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>

        {/* Decorative particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * 60 * Math.PI) / 180) * 80],
              y: [0, Math.sin((i * 60 * Math.PI) / 180) * 80],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
