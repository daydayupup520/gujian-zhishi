import React from 'react';
import { motion } from 'framer-motion';
import { Building, Calendar, MapPin, Star, CheckCircle, Sparkles, Layers, Compass } from 'lucide-react';
import type { RecognitionResult } from '../types/ai';

interface GlassRecognitionResultProps {
  result: RecognitionResult | null;
  isLoading?: boolean;
}

export const GlassRecognitionResult: React.FC<GlassRecognitionResultProps> = ({
  result,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="relative p-6 premium-shell border border-indigo-500/10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-white/5 rounded" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 premium-shell border border-indigo-500/10 rounded-2xl text-center"
      >
        <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#dcc48d] to-[#b1842e] flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Building size={32} className="text-white" />
        </motion.div>
        <p className="text-slate-400">上传古建筑图片后，AI 将自动识别建筑信息</p>
      </motion.div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '皇宫':
        return 'from-red-500 to-red-600';
      case '民居':
        return 'from-blue-500 to-orange-500';
      case '官府':
        return 'from-blue-500 to-cyan-500';
      case '桥梁':
        return 'from-cyan-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryGlow = (category: string) => {
    switch (category) {
      case '皇宫':
        return 'shadow-red-500/30';
      case '民居':
        return 'shadow-blue-500/30';
      case '官府':
        return 'shadow-blue-500/30';
      case '桥梁':
        return 'shadow-cyan-500/30';
      default:
        return 'shadow-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative p-6 premium-shell border border-indigo-500/10 rounded-2xl overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(result.category)} opacity-5`} />

      <div className="relative flex items-start justify-between mb-6">
        <div>
          <motion.h3
            className="text-3xl font-bold bg-gradient-to-r from-[#7a5a1f] via-[#a07828] to-[#d2b376] bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {result.name}
          </motion.h3>
          <motion.span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getCategoryColor(result.category)} shadow-lg ${getCategoryGlow(result.category)}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {result.category}
          </motion.span>
        </div>

        <motion.div
          className="flex items-center gap-1 px-3 py-1.5 bg-[rgba(207,169,94,0.24)] border border-[rgba(154,116,43,0.35)] rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Star size={16} className="text-[#9b7326] fill-[#9b7326]" />
          <span className="font-bold text-[#7a5a1f]">{(result.confidence * 100).toFixed(0)}%</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          className="p-4 bg-white/5 rounded-xl border border-indigo-500/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Calendar size={16} />
            <span className="text-xs uppercase tracking-wider">年代</span>
          </div>
          <p className="text-white font-medium">{result.era} · {result.year}</p>
        </motion.div>

        <motion.div
          className="p-4 bg-white/5 rounded-xl border border-indigo-500/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <MapPin size={16} />
            <span className="text-xs uppercase tracking-wider">位置</span>
          </div>
          <p className="text-white font-medium">{result.location}</p>
        </motion.div>
      </div>

      {result.fusion && (
        <motion.div
          className="mb-6 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-medium text-cyan-200 mb-2 flex items-center gap-2">
            <Layers size={14} />
            多视角融合结果
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p className="text-slate-400">融合图片数：<span className="text-white font-medium">{result.fusion.imageCount}</span></p>
            <p className="text-slate-400">一致性：<span className="text-white font-medium">{(result.fusion.consistency * 100).toFixed(0)}%</span></p>
          </div>
          <p className="mt-2 text-sm text-slate-400">{result.fusion.crossViewSummary}</p>
        </motion.div>
      )}

      {result.features.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-[#a07828]" />
            建筑特点
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(result.features)).map((feature, index) => (
              <motion.span
                key={feature}
                className="px-3 py-1.5 bg-gradient-to-r from-[#ead2a1]/60 to-[#d9ba79]/45 text-[#6f4f19] border border-[#b58935]/35 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + index * 0.08 }}
                whileHover={{ scale: 1.05 }}
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {result.components && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <Compass size={14} className="text-cyan-300" />
            部件级识别
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
              <p className="text-xs text-slate-400">斗拱类型</p>
              <p className="mt-1 text-sm text-white">{result.components.dougongType}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
              <p className="text-xs text-slate-400">屋顶形制</p>
              <p className="mt-1 text-sm text-white">{result.components.roofType}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
              <p className="text-xs text-slate-400">脊兽数量 / 种类</p>
              <p className="mt-1 text-sm text-white">{result.components.beastCount} · {result.components.beastTypes.join('、') || '待确认'}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-indigo-500/10">
              <p className="text-xs text-slate-400">彩画纹样</p>
              <p className="mt-1 text-sm text-white">{result.components.paintingPattern}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">部件识别置信度 {(result.components.confidence * 100).toFixed(0)}%</p>
        </motion.div>
      )}

      {result.description && (
        <motion.div
          className="p-4 bg-gradient-to-r from-[#eddab2]/70 to-transparent rounded-xl border-l-4 border-[#a07828]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75 }}
        >
          <p className="text-slate-400 leading-relaxed">{result.description}</p>
        </motion.div>
      )}

      <motion.div
        className="mt-6 pt-4 border-t border-indigo-500/10 flex items-center text-sm text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <CheckCircle size={16} className="mr-2 text-green-500" />
        <span>AI 识别完成 · 结果仅供参考</span>
      </motion.div>
    </motion.div>
  );
};
