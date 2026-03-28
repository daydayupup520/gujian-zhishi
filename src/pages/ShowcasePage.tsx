import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

interface BuildingData {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  era: string;
  year: string;
  location: string;
  description: string;
  image: string;
  features: string[];
}

// 建筑卡片组件
function BuildingCard({ building, index }: { building: BuildingData; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // buildings.json 中图片路径是相对路径如 "images/xxx.jpg"，需要加 /data/ 前缀
  const imageSrc = building.image.startsWith('/')
    ? building.image
    : `/data/${building.image}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group bg-[rgba(15,20,40,0.6)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl overflow-hidden hover:border-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      {/* 图片区域 */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {!imageError && (
          <img
            src={imageSrc}
            alt={building.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-slate-900/40">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              building.category === '皇宫' ? 'bg-amber-500/20' :
              building.category === '官府' ? 'bg-blue-500/20' :
              building.category === '桥梁' ? 'bg-cyan-500/20' :
              'bg-emerald-500/20'
            }`}>
              <span className="text-4xl font-bold text-white/60">
                {building.name.charAt(0)}
              </span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,26,0.95)] via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-semibold shadow-sm border ${
            building.category === '皇宫' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            building.category === '官府' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
            building.category === '桥梁' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}>
            {building.category}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white/90 text-sm font-medium">
            {building.era} · {building.year}
          </p>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
          {building.name.split('（')[0]}
        </h3>
        <p className="text-xs text-slate-400 mb-3">{building.name}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span>{building.era}（{building.year}）</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="line-clamp-1">{building.location}</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {building.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {building.features.slice(0, 3).map((feature) => (
            <span
              key={`${building.id}-${feature}`}
              className="px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-300 rounded-full text-xs font-medium border border-blue-500/15"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ShowcasePage() {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/buildings.json')
      .then(res => res.json())
      .then((data: { buildings: BuildingData[] }) => {
        setBuildings(data.buildings);
      })
      .catch(() => {
        setBuildings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(buildings.map(b => b.category));
    return ['全部', ...Array.from(cats)];
  }, [buildings]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      const matchesCategory = selectedCategory === '全部' || building.category === selectedCategory;
      const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           building.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [buildings, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        {/* 导航栏 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              返回首页
            </Link>
            <span className="text-slate-500">|</span>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              古建筑展示
            </h1>
          </div>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10 space-y-5"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="搜索建筑名称或地点..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[rgba(15,20,40,0.6)] backdrop-blur-sm border border-indigo-500/15 rounded-2xl text-white placeholder-slate-500 focus:border-blue-500/40 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Filter className="w-5 h-5 text-slate-500 mr-2" />
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`premium-btn px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md shadow-blue-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* 建筑网格 */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBuildings.map((building, index) => (
              <BuildingCard key={building.id} building={building} index={index} />
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && filteredBuildings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">没有找到匹配的建筑</h3>
            <p className="text-slate-400">尝试调整搜索词或筛选条件</p>
          </motion.div>
        )}

        {/* 统计 */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <span className="text-slate-400">共展示 </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{buildings.length}</span>
            <span className="text-slate-400"> 座古建筑</span>
            {selectedCategory !== '全部' && (
              <span className="text-slate-400">，当前筛选: <span className="text-blue-400 font-medium">{selectedCategory}</span>（{filteredBuildings.length} 座）</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
