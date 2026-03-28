import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Stethoscope, GitCompare, BookOpen, Building2, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/diagnosis', icon: Stethoscope, label: '病害诊断' },
  { path: '/knowledge', icon: BookOpen, label: '知识图谱' },
  { path: '/comparison', icon: GitCompare, label: '建筑对比' },
  { path: '/showcase', icon: Building2, label: '建筑展示' },
  { path: '/database', icon: Database, label: '数据管理' },
];

export default function MainLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-shell overflow-x-hidden">
      {/* 顶部导航 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 top-nav-glass ${
          scrolled
            ? 'top-nav-glass--scrolled'
            : ''
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_8px_18px_rgba(59,130,246,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Building2 className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-300 to-indigo-500 opacity-0 group-hover:opacity-45 blur-md transition-opacity duration-300" />
              </motion.div>
              <div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-300 bg-clip-text text-transparent">
                  古建智识
                </span>
                <span className="block text-[10px] text-blue-400/70 tracking-[0.22em] uppercase">
                  Ancient Architecture AI
                </span>
              </div>
            </Link>

            {/* 导航菜单 */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 shadow-[0_10px_20px_rgba(59,130,246,0.15)]'
                        : 'text-slate-400 hover:text-blue-300 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                      location.pathname === item.path ? 'text-blue-400' : ''
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 主内容 */}
      <main className="page-frame relative">
        <Outlet />
      </main>

      {/* 底部导航（移动端） */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(10,10,26,0.94)] backdrop-blur-xl border-t border-[rgba(99,102,241,0.12)] shadow-[0_-8px_22px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-around py-2 px-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === item.path
                  ? 'text-blue-400 bg-gradient-to-b from-blue-500/15 to-transparent'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  location.pathname === item.path ? 'drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]' : ''
                }`} />
              </motion.div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

// 移动端菜单组件
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="relative">
      <button
        type="button"
        title="打开菜单"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-blue-300 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="菜单图标">
          <title>菜单</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-52 bg-[rgba(15,20,40,0.98)] border border-[rgba(99,102,241,0.15)] rounded-xl overflow-hidden shadow-[0_18px_38px_rgba(0,0,0,0.4)]"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-500/15 text-blue-300'
                  : 'text-slate-400 hover:bg-white/5 hover:text-blue-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}
