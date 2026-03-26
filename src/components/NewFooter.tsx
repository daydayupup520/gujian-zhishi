import { motion } from 'framer-motion';
import { Building2, Github, Mail, ExternalLink } from 'lucide-react';

const footerLinks = {
  product: [
    { label: '功能介绍', href: '#features' },
    { label: '使用流程', href: '#how-it-works' },
    { label: '案例展示', href: '#showcase' },
    { label: '技术栈', href: '#tech' },
  ],
  resources: [
    { label: 'API 文档', href: '#' },
    { label: '使用指南', href: '#' },
    { label: '常见问题', href: '#' },
    { label: '更新日志', href: '#' },
  ],
  about: [
    { label: '关于我们', href: '#' },
    { label: '联系方式', href: '#' },
    { label: '隐私政策', href: '#' },
    { label: '使用条款', href: '#' },
  ],
};

export const NewFooter: React.FC = () => {
  return (
    <footer className="relative bg-[rgba(15,20,40,0.5)] border-t border-indigo-500/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-300 bg-clip-text text-transparent">
                  古建智识
                </span>
                <span className="block text-xs text-slate-500 tracking-widest uppercase">
                  Ancient Architecture AI
                </span>
              </div>
            </motion.div>
            <p className="text-slate-400 mb-6 max-w-sm">
              基于智谱清言 AI 的智能识别系统，让中国古代建筑文化触手可及。
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 border border-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">资源</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">关于</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 古建智识. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>2026 中国大学生计算机设计大赛参赛作品</span>
              <span className="hidden md:inline">·</span>
              <span>AI+信息可视化设计</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};