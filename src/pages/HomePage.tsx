import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Building, BookOpen, ArrowRight, History, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { GlassImageUploader } from '../components/GlassImageUploader';
import { GlassRecognitionResult } from '../components/GlassRecognitionResult';
import { Scene3D } from '../components/Scene3D';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { recognizeBuildingMulti, fileToBase64Many } from '../lib/ai/recognition';
import { useAppContext } from '../contexts/useAppContext';
import { useRecognitionHistory } from '../hooks/useDatabase';
import { Link } from 'react-router-dom';

// 精选建筑图片数据
const FEATURED_BUILDINGS = [
  { img: '/images/forbidden-city-taihe.jpg', name: '故宫太和殿', location: '北京', era: '明清' },
  { img: '/images/chengqi-tulou.jpg', name: '承启楼', location: '福建', era: '清代' },
  { img: '/images/lugou-bridge.jpg', name: '卢沟桥', location: '北京', era: '金代' },
  { img: '/images/beijing-siheyuan.jpg', name: '北京四合院', location: '北京', era: '明清' },
  { img: '/images/zhaozhou-bridge.jpg', name: '赵州桥', location: '河北', era: '隋代' },
  { img: '/images/prince-gong-mansion.jpg', name: '恭王府', location: '北京', era: '清代' },
  { img: '/images/hongcun-residence.jpg', name: '宏村民居', location: '安徽', era: '明清' },
  { img: '/images/zhili-zongdushu.jpg', name: '直隶总督署', location: '河北', era: '清代' },
];

// Hero 背景轮播图
const HERO_IMAGES = [
  '/images/forbidden-city-taihe.jpg',
  '/images/VCG211309170586.jpg',
  '/images/VCG211374915873.jpg',
  '/images/VCG211417035267.jpg',
  '/images/VCG211420719358.jpg',
];

export default function HomePage() {
  const { recognitionResult: result, setRecognitionResult: setGlobalResult } = useAppContext();
  const { addToHistory, history } = useRecognitionHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [galleryStart, setGalleryStart] = useState(0);

  const presentationMode = true;

  // Hero 背景自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleImageUpload = useCallback(async (files: File[], previews: string[]) => {
    void previews;
    setIsLoading(true);
    setError(null);
    try {
      const base64List = await fileToBase64Many(files);
      const recognitionResult = await recognizeBuildingMulti(base64List);
      setGlobalResult(recognitionResult);
      await addToHistory(recognitionResult, files.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [setGlobalResult, addToHistory]);

  const visibleCount = 4;
  const canPrev = galleryStart > 0;
  const canNext = galleryStart + visibleCount < FEATURED_BUILDINGS.length;

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">

        {/* 背景图片轮播：只渲染当前帧和前一帧，避免一次性加载所有图片 */}
        <AnimatePresence mode="sync">
          <motion.div
            key={heroIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[heroIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* 多层遮罩：深色底 + 顶部渐变 + 底部渐变 */}
        <div className="absolute inset-0 bg-[#050a1a]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050a1a]/70 via-transparent to-[#050a1a]/80" />
        {/* 蓝金光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-amber-900/10" />

        {/* 底部轮播指示点 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHeroIndex(i)}
              className={`transition-all duration-500 rounded-full ${
                i === heroIndex
                  ? 'w-8 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* 顶部徽标 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-amber-400/80 text-sm tracking-[0.3em] uppercase font-medium">
              Ancient Architecture AI
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-4 leading-none tracking-tight"
          >
            古建
            <span className="relative inline-block ml-2">
              <span className="text-gradient-gold">智识</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400/0 via-amber-400 to-amber-400/0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            融合多模态 AI 识别与 3D 可视化技术<br className="hidden md:block" />
            让千年古建筑在数字世界重焕生机
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#recognition"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all"
            >
              <Camera className="w-5 h-5" />
              开始识别
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/showcase"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 hover:border-amber-400/40 transition-all"
              >
                <Building className="w-5 h-5" />
                浏览建筑
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* 向下滚动箭头 */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── 建筑图片展廊 ───────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-[#050a1a] to-[#080f24]">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">精选古建筑</h2>
              <p className="text-slate-400 text-sm mt-1">跨越千年的建筑遗珍</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGalleryStart(s => Math.max(0, s - 1))}
                disabled={!canPrev}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGalleryStart(s => Math.min(FEATURED_BUILDINGS.length - visibleCount, s + 1))}
                disabled={!canNext}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden">
            {FEATURED_BUILDINGS.slice(galleryStart, galleryStart + visibleCount).map((b, i) => (
              <motion.div
                key={b.img}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <img
                  src={b.img}
                  alt={b.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* 悬停光效 */}
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors duration-500" />
                {/* 边框 */}
                <div className="absolute inset-0 rounded-2xl border border-white/5 group-hover:border-amber-400/30 transition-colors duration-500" />
                {/* 文字 */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-400/80" />
                    <span className="text-amber-400/80 text-xs">{b.location}</span>
                    <span className="text-slate-500 text-xs ml-1">· {b.era}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 功能特性 ────────────────────────────────────── */}
      <section className="py-20 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-full tracking-widest uppercase">
            核心功能
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">智能 · 沉浸 · 传承</h2>
        </motion.div>

        <div className="premium-shell rounded-[28px] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Camera, title: 'AI智能识别', desc: '上传图片，AI自动识别建筑类型、年代、风格特征', color: 'from-blue-500 to-cyan-500', img: '/images/VCG211542298745 (1).jpg' },
              { icon: Building, title: '3D沉浸展示', desc: 'WebGPU高性能渲染，360°浏览古建筑细节', color: 'from-amber-500 to-orange-500', img: '/images/VCG211516736197.jpg' },
              { icon: BookOpen, title: '知识图谱', desc: 'RAG检索增强，深度了解建筑历史文化', color: 'from-violet-500 to-purple-500', img: '/images/VCG211532910969.jpg' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-amber-400/20 transition-all duration-500"
              >
                {/* 背景图 */}
                <div className="absolute inset-0">
                  <img src={feature.img} alt="" loading="lazy" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1426] via-[#0d1426]/80 to-[#0d1426]/50" />
                </div>
                {/* 内容 */}
                <div className="relative p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 识别区 ──────────────────────────────────────── */}
      <section id="recognition" className="py-24 relative">
        {/* 背景装饰：左右两侧模糊建筑图 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(/images/VCG211309170586.jpg)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-64 bg-cover bg-center opacity-5"
            style={{ backgroundImage: `url(/images/VCG211374915873.jpg)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a1a] via-transparent to-[#050a1a]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-indigo-950/20" />
        </div>

        <div className="page-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium text-blue-300/80 bg-blue-500/10 border border-blue-500/20 rounded-full tracking-widest uppercase">
              立即体验
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              开始 <span className="text-gradient-gold">多视角识别</span> 古建筑
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              上传同一建筑的多个角度图片，AI 将进行融合识别并输出部件级细节
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="p-8 bg-[rgba(15,20,40,0.7)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">多图上传</h3>
                    <p className="text-sm text-slate-500">支持多角度 JPG、PNG</p>
                  </div>
                </div>
                <GlassImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
              </div>
              <div className="mt-6">
                <GlassRecognitionResult result={result} isLoading={isLoading} presentationMode={presentationMode} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}>
              <div className="p-8 bg-[rgba(15,20,40,0.7)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                      <Building className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">3D 展示</h3>
                      <p className="text-sm text-slate-500">沉浸式浏览体验</p>
                    </div>
                  </div>
                  {result && (
                    <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-1.5 bg-amber-500/15 text-amber-300 rounded-full text-sm font-medium border border-amber-500/20">
                      {result.category}
                    </motion.span>
                  )}
                </div>
                <Scene3D
                  key={`${result?.name ?? 'default'}-${result?.category ?? '其他'}`}
                  buildingName={result?.name || '古建筑展示'}
                  buildingCategory={result?.category}
                  buildingEra={result?.era}
                  buildingLocation={result?.location}
                  highlights={result?.features}
                />
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-6 p-6 bg-[rgba(15,20,40,0.6)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-white">建筑知识</h4>
                      </div>
                      <Link to="/knowledge" className="group text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors">
                        了解更多 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3">{result.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(result.features)).slice(0, 4).map((feature) => (
                        <motion.span key={feature} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-sm font-medium">
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* 功能入口 */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { to: '/diagnosis', title: '病害诊断', desc: 'AI智能诊断建筑病害，3D热力图可视化展示', color: 'from-rose-500 to-red-500', bg: 'from-rose-500/10 to-red-500/5', border: 'border-rose-500/15 hover:border-rose-500/30 hover:shadow-rose-500/10', hover: 'group-hover:text-rose-300' },
                { to: '/comparison', title: '建筑对比', desc: '多建筑横向对比分析，可视化数据展示', color: 'from-blue-500 to-cyan-500', bg: 'from-blue-500/10 to-cyan-500/5', border: 'border-blue-500/15 hover:border-blue-500/30 hover:shadow-blue-500/10', hover: 'group-hover:text-blue-300' },
                { to: '/knowledge', title: '历史GIS', desc: '探索建筑历史地理语境，时空维度分析', color: 'from-amber-500 to-orange-500', bg: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-500/15 hover:border-amber-500/30 hover:shadow-amber-500/10', hover: 'group-hover:text-amber-300' },
              ].map(item => (
                <motion.div key={item.to} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                  <Link to={item.to} className={`block p-6 bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl hover:shadow-lg transition-all duration-500 group`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-lg font-bold text-white ${item.hover} transition-colors`}>{item.title}</h4>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 识别历史 ─────────────────────────────────────── */}
      {history.length > 0 && (
        <section className="py-20 page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <History className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">识别历史</h2>
            </div>
            <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-blue-300 hover:text-blue-200 text-sm font-medium bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors">
              {showHistory ? '收起' : '展开'}
            </motion.button>
          </motion.div>
          <motion.div
            animate={{ height: showHistory ? 'auto' : '140px', overflow: 'hidden' }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {history.slice(0, showHistory ? undefined : 4).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setGlobalResult(item.result)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  result?.name === item.result.name
                    ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30 shadow-lg'
                    : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-amber-400/20 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 rounded-full text-xs font-medium border border-amber-500/20">
                    {item.result.category}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-2 line-clamp-1">{item.result.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{item.result.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 bg-white/5 rounded">{item.imageCount} 张图片</span>
                  <span>·</span>
                  <span>{item.result.era}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      <AnimatePresence>{isLoading && <LoadingAnimation isLoading={isLoading} />}</AnimatePresence>
    </div>
  );
}
