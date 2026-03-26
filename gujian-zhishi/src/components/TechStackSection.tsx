import { motion } from 'framer-motion';

const technologies = [
  {
    category: 'AI 技术',
    items: [
      { name: '智谱清言', desc: 'GLM-4V 多模态大模型' },
      { name: 'RAG', desc: '检索增强生成' },
    ],
  },
  {
    category: '前端框架',
    items: [
      { name: 'React 19', desc: '最新版 React' },
      { name: 'TypeScript', desc: '类型安全' },
      { name: 'Vite', desc: '极速构建' },
    ],
  },
  {
    category: '3D 可视化',
    items: [
      { name: 'Three.js', desc: 'WebGL 3D 库' },
      { name: 'React Three Fiber', desc: 'React 3D 渲染' },
      { name: 'WebGPU', desc: '新一代图形 API' },
    ],
  },
  {
    category: 'UI/UX',
    items: [
      { name: 'Tailwind CSS', desc: '原子化 CSS' },
      { name: 'Framer Motion', desc: '动画库' },
      { name: 'Lucide Icons', desc: '图标库' },
    ],
  },
];

export const TechStackSection: React.FC = () => {
  return (
    <section id="tech" className="relative py-32 bg-gradient-to-b from-gray-900 to-transparent overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-blue-400 bg-amber-400/10 border border-amber-400/20 rounded-full">
            技术栈
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            基于 <span className="text-gradient-gold">前沿技术</span> 构建
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            采用业界领先的技术方案，确保最佳的用户体验和系统性能
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="p-6 h-full bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl hover:border-blue-500/25 transition-all duration-500">
                <h3 className="text-lg font-bold text-blue-400 mb-6 pb-4 border-b border-indigo-500/10">
                  {tech.category}
                </h3>
                <div className="space-y-4">
                  {tech.items.map((item) => (
                    <div key={item.name} className="group/item">
                      <div className="text-white font-medium group-hover/item:text-blue-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 p-2 pr-6 bg-white/5 backdrop-blur-sm border border-indigo-500/10 rounded-full">
            <div className="flex -space-x-2">
              {['React', 'Three.js', 'AI'].map((tech) => (
                <div
                  key={tech}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-black border-2 border-black"
                >
                  {tech[0]}
                </div>
              ))}
            </div>
            <span className="text-slate-400">技术驱动创新</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};