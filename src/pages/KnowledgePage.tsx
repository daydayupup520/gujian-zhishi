import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, BookOpen, MapPin, Compass, Landmark, History, FileText, X } from 'lucide-react';
import { useAppContext } from '../contexts/useAppContext';
import { InnovationLabSection } from '../components/InnovationLabSection';
import { HistoricalGISSection } from '../components/HistoricalGISSection';

const KNOWLEDGE_CATEGORIES = [
  { id: 'structure', name: '建筑结构', icon: Landmark, color: 'from-blue-500 to-cyan-500', topics: ['榫卯结构', '斗拱体系', '抬梁式', '穿斗式', '井干式'] },
  { id: 'history', name: '历史演变', icon: History, color: 'from-violet-500 to-purple-500', topics: ['先秦时期', '秦汉发展', '隋唐成熟', '宋元变革', '明清集大成'] },
  { id: 'culture', name: '文化内涵', icon: BookOpen, color: 'from-indigo-500 to-blue-500', topics: ['礼制等级', '风水理念', '吉祥寓意', '地方特色'] },
  { id: 'protection', name: '保护修缮', icon: Compass, color: 'from-rose-500 to-red-500', topics: ['保护原则', '修缮技术', '病害防治', '数字化保护'] }
];

// 通用知识文章
const GENERAL_ARTICLES = [
  { id: 'g1', title: '中国古建筑木结构体系', categoryName: '建筑结构', summary: '中国古代建筑以木结构为主，形成了独特的抬梁式、穿斗式、井干式三大结构体系...', readTime: '8分钟' },
  { id: 'g2', title: '斗拱：中国传统建筑的精髓', categoryName: '建筑结构', summary: '斗拱是中国古建筑特有的构件，具有承重、装饰、等级象征等多重功能...', readTime: '6分钟' },
  { id: 'g3', title: '故宫建筑的礼制等级', categoryName: '文化内涵', summary: '故宫建筑严格按照封建礼制建造，不同等级的建筑在屋顶形式、彩绘、开间数等方面都有明确规定...', readTime: '10分钟' },
  { id: 'g4', title: '古建筑的数字化保护技术', categoryName: '保护修缮', summary: '随着科技发展，三维扫描、BIM技术、AI识别等现代技术被广泛应用于古建筑保护...', readTime: '7分钟' }
];

// 知识库中已有 markdown 文件的建筑 ID
const KNOWLEDGE_FILE_IDS = [
  'chengqi-tulou',
  'forbidden-city-taihe',
  'hongcun-residence',
  'lugou-bridge',
  'neixiang-yamen',
  'pingyao-yamen',
  'prince-gong-mansion',
  'summer-palace-long-corridor',
  'zhaozhou-bridge',
  'zhili-zongdushu',
];

interface BuildingKnowledge {
  id: string;
  title: string;
  category: string;
  era: string;
  location: string;
  content: string;
}

function parseKnowledgeMd(id: string, raw: string): BuildingKnowledge {
  const lines = raw.split('\n');
  const title = (lines[0] || '').replace(/^#\s*/, '');
  let category = '';
  let era = '';
  let location = '';

  for (const line of lines.slice(1, 10)) {
    if (line.startsWith('- 类别:')) category = line.replace('- 类别:', '').trim();
    if (line.startsWith('- 年代:')) era = line.replace('- 年代:', '').trim();
    if (line.startsWith('- 地点:')) location = line.replace('- 地点:', '').trim();
  }

  return { id, title, category, era, location, content: raw };
}

export default function KnowledgePage() {
  const { recognitionResult: result } = useAppContext();
  const [activeTab, setActiveTab] = useState<'knowledge' | 'gis'>('knowledge');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [knowledgeArticles, setKnowledgeArticles] = useState<BuildingKnowledge[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<BuildingKnowledge | null>(null);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // 动态加载 markdown 知识文件
  useEffect(() => {
    async function loadKnowledge() {
      setLoadingArticles(true);
      const articles: BuildingKnowledge[] = [];

      const results = await Promise.allSettled(
        KNOWLEDGE_FILE_IDS.map(async (id) => {
          const res = await fetch(`/data/knowledge/${id}.md`);
          if (!res.ok) return null;
          const text = await res.text();
          return parseKnowledgeMd(id, text);
        })
      );

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value) {
          articles.push(r.value);
        }
      }

      setKnowledgeArticles(articles);
      setLoadingArticles(false);
    }

    loadKnowledge();
  }, []);

  // 根据选中的分类过滤通用文章
  const filteredGeneralArticles = useMemo(() => {
    if (!selectedCategory) return GENERAL_ARTICLES;
    const category = KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return GENERAL_ARTICLES;
    return GENERAL_ARTICLES.filter(a => a.categoryName === category.name);
  }, [selectedCategory]);

  // 根据选中的分类过滤建筑知识文章
  const filteredBuildingArticles = useMemo(() => {
    if (!selectedCategory) return knowledgeArticles;
    const category = KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return knowledgeArticles;
    // 简单映射：皇宫/官府 → 文化内涵/历史演变, 民居 → 建筑结构, 桥梁 → 保护修缮
    const categoryMap: Record<string, string[]> = {
      '建筑结构': ['民居'],
      '历史演变': ['皇宫', '官府'],
      '文化内涵': ['皇宫', '官府'],
      '保护修缮': ['桥梁', '民居', '皇宫', '官府'],
    };
    const matchCategories = categoryMap[category.name] || [];
    if (matchCategories.length === 0) return knowledgeArticles;
    return knowledgeArticles.filter(a => matchCategories.includes(a.category));
  }, [selectedCategory, knowledgeArticles]);

  // 简单 markdown 渲染为 HTML
  function renderMarkdown(md: string) {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-bold text-white mt-6 mb-3">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-2xl font-bold text-white mb-4">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-slate-300 ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-slate-300 leading-relaxed">{line}</p>;
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 返回首页
            </Link>
            <span className="text-slate-500">|</span>
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
            {/* 分类导航 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {KNOWLEDGE_CATEGORIES.map((category) => (
                <button type="button" key={category.id} onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)} className={`p-6 rounded-2xl border text-left transition-all duration-300 ${selectedCategory === category.id ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10' : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20 hover:shadow-md'}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-md`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {category.topics.slice(0, 3).map((topic) => <span key={topic} className="text-xs text-slate-400">{topic}</span>)}
                    {category.topics.length > 3 && <span className="text-xs text-slate-400">+{category.topics.length - 3}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* 通用知识文章 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                专题知识
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGeneralArticles.map((article, index) => (
                  <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-6 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl hover:border-blue-500/25 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs">{article.categoryName}</span>
                      <span className="text-xs text-slate-400">{article.readTime}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{article.title}</h4>
                    <p className="text-slate-400 text-sm line-clamp-2">{article.summary}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 建筑知识库 - 动态加载 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                建筑知识库
                <span className="text-sm font-normal text-slate-400 ml-2">({knowledgeArticles.length} 篇)</span>
              </h2>

              {loadingArticles ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBuildingArticles.map((article, index) => (
                    <motion.button
                      type="button"
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedArticle(article)}
                      className="p-5 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl hover:border-blue-500/25 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          article.category === '皇宫' ? 'bg-amber-500/15 text-amber-300' :
                          article.category === '官府' ? 'bg-blue-500/15 text-blue-300' :
                          article.category === '桥梁' ? 'bg-cyan-500/15 text-cyan-300' :
                          'bg-emerald-500/15 text-emerald-300'
                        }`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-slate-400">{article.era}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{article.title}</h4>
                      <p className="text-xs text-slate-400">{article.location}</p>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* 创新实验室 */}
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

      {/* 文章详情弹窗 */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-[#0f1024] border border-indigo-500/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    selectedArticle.category === '皇宫' ? 'bg-amber-500/20 text-amber-300' :
                    selectedArticle.category === '官府' ? 'bg-blue-500/20 text-blue-300' :
                    selectedArticle.category === '桥梁' ? 'bg-cyan-500/20 text-cyan-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {selectedArticle.category}
                  </span>
                  <span className="text-sm text-slate-500">{selectedArticle.era} · {selectedArticle.location}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(selectedArticle.content)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
