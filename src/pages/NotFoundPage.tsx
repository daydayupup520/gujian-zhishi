import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-blue-200/70">
          页面未找到
        </p>
        <p className="text-blue-300/50 max-w-md mx-auto">
          你访问的页面不存在或已被移除，请返回首页继续探索古建智识。
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-500 hover:to-violet-500 transition-all"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </button>
        </div>
      </motion.div>
    </div>
  );
}
