import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Building, BookOpen, ArrowRight, History } from 'lucide-react';
import { GlassImageUploader } from '../components/GlassImageUploader';
import { GlassRecognitionResult } from '../components/GlassRecognitionResult';
import { Scene3D } from '../components/Scene3D';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { recognizeBuildingMulti, fileToBase64Many } from '../lib/ai/recognition';
import { useAppContext } from '../contexts/AppContext';
import { useRecognitionHistory } from '../hooks/useDatabase';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { recognitionResult: result, setRecognitionResult: setGlobalResult } = useAppContext();
  const { addToHistory, history } = useRecognitionHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

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
      console.error('识别失败:', err);
      setError(err instanceof Error ? err.message : '识别失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [setGlobalResult, addToHistory]);

  return (
    <div className="min-h-screen page-container">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-5 py-2.5 mb-8 text-sm font-medium text-blue-300 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full shadow-sm"
            >
              探索中国古代建筑之美
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              古建<span className="text-gradient-gold">智识</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              融合多模态AI识别与3D可视化技术，让千年建筑在数字世界重焕生机
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.a
                href="#recognition"
                className="premium-btn group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                开始识别
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/showcase"
                  className="premium-btn inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 font-semibold rounded-full hover:bg-white/10 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300"
                >
                  <Building className="w-5 h-5" />
                  浏览建筑
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="premium-shell rounded-[28px] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: 'AI智能识别',
                desc: '上传图片，AI自动识别建筑类型、年代、风格特征',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'bg-blue-500/5'
              },
              {
                icon: Building,
                title: '3D沉浸展示',
                desc: 'WebGPU高性能渲染，360°浏览古建筑细节',
                color: 'from-violet-500 to-purple-500',
                bgColor: 'bg-violet-500/5'
              },
              {
                icon: BookOpen,
                title: '知识图谱',
                desc: 'RAG检索增强，深度了解建筑历史文化',
                color: 'from-indigo-500 to-blue-500',
                bgColor: 'bg-indigo-500/5'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group p-8 ${feature.bgColor} backdrop-blur-sm border border-white/5 rounded-2xl hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 premium-shell`}
              >
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section id="recognition" className="py-32 bg-gradient-to-b from-transparent via-indigo-950/10 to-indigo-950/20">
        <div className="premium-shell rounded-[32px] p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2.5 mb-6 text-sm font-medium text-blue-300 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full"
            >
              立即体验
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              开始 <span className="text-gradient-gold">多视角识别</span> 古建筑
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              上传同一建筑的多个角度图片，AI 将进行融合识别并输出部件级细节
            </p>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-8 bg-[rgba(15,20,40,0.6)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">多图上传</h3>
                    <p className="text-sm text-slate-500">支持多角度 JPG、PNG</p>
                  </div>
                </div>
                <GlassImageUploader
                  onImageUpload={handleImageUpload}
                  isLoading={isLoading}
                />
              </div>

              <div className="mt-6">
                <GlassRecognitionResult result={result} isLoading={isLoading} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-8 bg-[rgba(15,20,40,0.6)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
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
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-1.5 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-300 rounded-full text-sm font-medium border border-blue-500/20"
                    >
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-6 p-6 bg-[rgba(15,20,40,0.5)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-white">建筑知识</h4>
                      </div>
                      <Link
                        to="/knowledge"
                        className="group text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                      >
                        了解更多
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3">{result.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(result.features)).slice(0, 4).map((feature) => (
                        <motion.span
                          key={feature}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors cursor-default"
                        >
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
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/diagnosis"
                  className="block p-6 bg-gradient-to-br from-rose-500/10 to-red-500/5 border border-rose-500/15 rounded-2xl hover:border-rose-500/30 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">病害诊断</h4>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">AI智能诊断建筑病害，3D热力图可视化展示</p>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/comparison"
                  className="block p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/15 rounded-2xl hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">建筑对比</h4>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">多建筑横向对比分析，可视化数据展示</p>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/knowledge"
                  className="block p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/15 rounded-2xl hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">历史GIS</h4>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-violet-500/30 transition-all">
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">探索建筑历史地理语境，时空维度分析</p>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 识别历史 */}
      {history.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-transparent to-indigo-950/10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">识别历史</h2>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-blue-300 hover:text-blue-200 text-sm font-medium bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors"
              >
                {showHistory ? '收起' : '展开'}
              </motion.button>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ height: showHistory ? 'auto' : '140px', overflow: 'hidden' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {history.slice(0, showHistory ? undefined : 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setGlobalResult(item.result)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    result?.name === item.result.name
                      ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-300 rounded-full text-xs font-medium">
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
          </div>
        </section>
      )}

      <AnimatePresence>{isLoading && <LoadingAnimation isLoading={isLoading} />}</AnimatePresence>
    </div>
  );
}
