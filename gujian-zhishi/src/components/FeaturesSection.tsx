import { motion } from 'framer-motion';
import { Camera, Brain, Box, Zap, Shield, Clock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: '智能图像识别',
    description: '基于智谱清言 GLM-4V 大模型，精准识别古建筑的类型、年代、风格特征，支持民居、官府、皇宫、桥梁等多种建筑类别。',
    color: 'from-blue-500 to-indigo-500',
    shadow: 'shadow-blue-500/30',
    borderColor: 'border-amber-200',
    bgGradient: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: Box,
    title: '3D 沉浸体验',
    description: 'Three.js + WebGPU 构建的高性能 3D 场景，支持 360° 旋转、缩放、平移，让您身临其境般欣赏古建筑之美。',
    color: 'from-china-red to-rose-500',
    shadow: 'shadow-red-500/30',
    borderColor: 'border-red-200',
    bgGradient: 'from-red-500/10 to-rose-500/10',
  },
  {
    icon: Brain,
    title: '知识图谱',
    description: '丰富的古建筑知识库，涵盖历史背景、建筑特点、文化价值等多维度信息，AI 智能推荐相关知识。',
    color: 'from-indigo-500 to-purple-500',
    shadow: 'shadow-indigo-500/30',
    borderColor: 'border-indigo-200',
    bgGradient: 'from-indigo-500/10 to-purple-500/10',
  },
  {
    icon: Zap,
    title: '极速响应',
    description: '优化的前端架构和 AI 调用策略，秒级返回识别结果，流畅的用户体验。',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/30',
    borderColor: 'border-emerald-200',
    bgGradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: Shield,
    title: '隐私保护',
    description: '本地处理图片数据，不上传原始图片到服务器，保护您的隐私和数据安全。',
    color: 'from-cyan-500 to-blue-500',
    shadow: 'shadow-cyan-500/30',
    borderColor: 'border-cyan-200',
    bgGradient: 'from-cyan-500/10 to-blue-500/10',
  },
  {
    icon: Clock,
    title: '历史回溯',
    description: '支持 1911 年前的中国古代建筑识别，涵盖明清、宋元等多个历史时期的建筑风格。',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/30',
    borderColor: 'border-orange-200',
    bgGradient: 'from-orange-500/10 to-amber-500/10',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-china-gold/30 to-transparent" />
        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-china-gold/30 to-transparent" />
        {/* 背景纹样 */}
        <div className="absolute inset-0 bg-pattern-china opacity-50" />
        {/* 装饰性光斑 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-china-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-china-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-china-gold/10 to-amber-500/10 border border-china-gold/30 rounded-full shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-china-gold" />
            <span className="text-sm font-semibold text-china-gold-dark">核心功能</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-china-ink mb-6"
          >
            强大功能，<span className="text-gradient-gold">一触即达</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-china-ink-muted max-w-3xl mx-auto leading-relaxed"
          >
            融合前沿 AI 技术与精美交互设计，为您打造极致的古建筑探索体验
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="relative h-full bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-china-ink/5 rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:shadow-china-lg hover:-translate-y-2 hover:border-china-gold/20">
                {/* 悬停时的背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* 装饰性角标 */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-china-gold/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon */}
                <motion.div 
                  className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadow} group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-china-ink mb-3 group-hover:text-china-gold-dark transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="relative text-china-ink-muted leading-relaxed">
                  {feature.description}
                </p>

                {/* 底部装饰线 */}
                <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-china-gold/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
