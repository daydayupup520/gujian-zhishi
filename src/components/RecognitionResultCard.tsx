import React from 'react';
import { Building, Calendar, MapPin, Star, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RecognitionResult } from '../types/ai';

interface RecognitionResultProps {
  result: RecognitionResult | null;
  isLoading?: boolean;
}

export const RecognitionResultCard: React.FC<RecognitionResultProps> = ({
  result,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[rgba(15,20,40,0.5)] backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/10 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gradient-to-r from-amber-200/50 to-yellow-200/50 rounded-lg w-3/4"></div>
          <div className="h-4 bg-indigo-500/15 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-amber-50 rounded"></div>
            <div className="h-4 bg-amber-50 rounded"></div>
            <div className="h-4 bg-amber-50 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-[rgba(15,20,40,0.5)] backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/10 shadow-lg text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
            <Building size={40} className="text-blue-400" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">等待识别</h3>
        <p className="text-slate-400 leading-relaxed">
          上传古建筑图片后，AI 将自动识别建筑类型、年代、风格特征
        </p>
      </div>
    );
  }

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case '皇宫':
        return 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 border-red-200';
      case '民居':
        return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 border-amber-200';
      case '官府':
        return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-200';
      case '桥梁':
        return 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-600 border-cyan-200';
      default:
        return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '皇宫':
        return '👑';
      case '民居':
        return '🏠';
      case '官府':
        return '🏛️';
      case '桥梁':
        return '🌉';
      default:
        return '🏯';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-[rgba(15,20,40,0.6)] backdrop-blur-xl rounded-2xl p-8 border border-blue-500/15 shadow-xl shadow-amber-900/5 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-gradient-gold mb-3"
          >
            {result.name}
          </motion.h3>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${getCategoryStyle(
                result.category
              )}`}
            >
              <span>{getCategoryIcon(result.category)}</span>
              {result.category}
            </span>
            {result.year && (
              <span className="px-3 py-1.5 bg-amber-50 text-blue-300 rounded-full text-sm border border-amber-200">
                {result.year}
              </span>
            )}
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border border-amber-200"
        >
          <Sparkles size={18} className="text-blue-400" />
          <Star size={18} className="text-blue-400 fill-amber-500" />
          <span className="font-bold text-blue-300 text-lg">{(result.confidence * 100).toFixed(0)}%</span>
        </motion.div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-md">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">年代</p>
            <p className="font-semibold text-white">{result.era} · {result.year}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-md">
            <MapPin size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">位置</p>
            <p className="font-semibold text-white">{result.location}</p>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      {result.features && result.features.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">建筑特点</h4>
          <div className="flex flex-wrap gap-2">
            {result.features.map((feature, index) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-300 rounded-full text-sm font-medium border border-amber-200 hover:bg-blue-500/15 transition-colors cursor-default"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Description */}
      {result.description && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">简介</h4>
          <div className="p-4 bg-gradient-to-br from-blue-500/10/80 to-indigo-500/10/80 rounded-xl border border-amber-100">
            <p className="text-[#3C3122] leading-relaxed">{result.description}</p>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pt-4 border-t border-blue-500/15 flex items-center justify-between"
      >
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle size={16} className="text-green-500" />
          <span>AI 识别完成 · 结果仅供参考</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-400">
          <Sparkles size={14} />
          <span>Powered by GLM-4V</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
