import { motion } from 'framer-motion';
import { Upload, Sparkles, Box, BookOpen, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: '上传图片',
    description: '拖拽或点击上传古建筑照片，支持 JPG、PNG 格式',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI 识别',
    description: '智谱清言 AI 自动分析建筑类型、年代、风格特征',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    number: '03',
    icon: Box,
    title: '3D 展示',
    description: '沉浸式 3D 场景展示，支持旋转、缩放、多角度观赏',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '04',
    icon: BookOpen,
    title: '探索知识',
    description: '查看详细的建筑知识、历史背景和文化价值',
    color: 'from-green-500 to-emerald-500',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-32 bg-gradient-to-b from-transparent to-[#F5F0E8] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-blue-400 bg-amber-400/10 border border-amber-400/20 rounded-full">
            使用流程
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            简单 <span className="text-gradient-gold">四步</span>，探索古建筑
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            无需专业知识，上传图片即可获得专业的古建筑识别和分析
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="relative p-8 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl hover:border-blue-500/25 transition-all duration-500 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-2 text-6xl font-bold text-white/5 group-hover:text-blue-400/20 transition-colors">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="relative text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-blue-400/50" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};