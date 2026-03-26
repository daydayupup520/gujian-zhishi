import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, BookOpen, MapPin, Compass, Landmark, History } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { InnovationLabSection } from '../components/InnovationLabSection';
import { HistoricalGISSection } from '../components/HistoricalGISSection';

const KNOWLEDGE_CATEGORIES = [
  { id: 'structure', name: '建筑结构', icon: Landmark, color: 'from-blue-500 to-cyan-500', topics: ['榫卯结构', '斗拱体系', '抬梁式', '穿斗式', '井干式'] },
  { id: 'history', name: '历史演变', icon: History, color: 'from-violet-500 to-purple-500', topics: ['先秦时期', '秦汉发展', '隋唐成熟', '宋元变革', '明清集大成'] },
  { id: 'culture', name: '文化内涵', icon: BookOpen, color: 'from-indigo-500 to-blue-500', topics: ['礼制等级', '风水理念', '吉祥寓意', '地方特色'] },
  { id: 'protection', name: '保护修缮', icon: Compass, color: 'from-rose-500 to-red-500', topics: ['保护原则', '修缮技术', '病害防治', '数字化保护'] }
];

const KNOWLEDGE_ARTICLES = [
  { id: 1, title: '中国古建筑木结构体系', category: '建筑结构', summary: '中国古代建筑以木结构为主，形成了独特的抬梁式、穿斗式、井干式三大结构体系...', readTime: '8分钟' },
  { id: 2, title: '斗拱：中国传统建筑的精髓', category: '建筑结构', summary: '斗拱是中国古建筑特有的构件，具有承重、装饰、等级象征等多重功能...', readTime: '6分钟' },
  { id: 3, title: '故宫建筑的礼制等级', category: '文化内涵', summary: '故宫建筑严格按照封建礼制建造，不同等级的建筑在屋顶形式、彩绘、开间数等方面都有明确规定...', readTime: '10分钟' },
  { id: 4, title: '古建筑的数字化保护技术', category: '保护修缮', summary: '随着科技发展，三维扫描、BIM技术、AI识别等现代技术被广泛应用于古建筑保护...', readTime: '7分钟' }
];

export default function KnowledgePage() {
  const { recognitionResult: result } = useAppContext();
  const [activeTab, setActiveTab] = useState<'knowledge' | 'gis'>('knowledge');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return KNOWLEDGE_ARTICLES;
    const category = KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return KNOWLEDGE_ARTICLES;
    return KNOWLEDGE_ARTICLES.filter(a => a.category === category.name);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 返回首页
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">知识图谱</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1.5 border border-indigo-500/10 shadow-sm">
            <button type="button" onClick={() => setActiveTab('knowledge')} className={`premium-btn flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'knowledge' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <BookOpen className="w-4 h-4" /> 知识百科
            </button>
            <button type="button" onClick={() => setActiveTab('gis')} className={`premium-btn flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === 'gis' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <MapPin className="w-4 h-4" /> 历史GIS
            </button>
          </div>
        </motion.div>

        {activeTab === 'knowledge' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {KNOWLEDGE_CATEGORIES.map((category) => (
                <button type="button" key={category.id} onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)} className={`p-6 rounded-2xl border text-left transition-all duration-300 ${selectedCategory === category.id ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20 hover:shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-md`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {category.topics.slice(0, 3).map((topic) => <span key={topic} className="text-xs text-slate-500">{topic}</span>)}
                    {category.topics.length > 3 && <span className="text-xs text-slate-500">+{category.topics.length - 3}</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-6 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl hover:border-blue-500/25 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs">{article.category}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{article.title}</h4>
                  <p className="text-slate-400 text-sm line-clamp-2">{article.summary}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <InnovationLabSection result={result} />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HistoricalGISSection result={result} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
