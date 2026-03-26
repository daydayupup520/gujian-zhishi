import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Calendar, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

// 建筑数据
const BUILDINGS = [
  {
    id: 'chengqi-tulou',
    name: '承启楼',
    fullName: '承启楼（福建土楼）',
    category: '民居',
    era: '清',
    year: '1709',
    location: '福建省龙岩市永定区',
    description: '永定土楼代表作之一，外圈高大夯土墙形成防御性围合，内设多层木构廊道与院落空间。',
    image: '/data/images/chengqi-tulou.jpg',
    features: ['夯土承重墙', '环形围合', '多层合院']
  },
  {
    id: 'beijing-siheyuan',
    name: '北京四合院',
    fullName: '北京四合院（院落与影壁）',
    category: '民居',
    era: '明清',
    year: '明清形制',
    location: '北京市',
    description: '以四面房屋围合成院为基本单元，讲究礼制轴线与居住秩序，是北方传统民居的典型形态。',
    image: '/data/images/beijing-siheyuan.jpg',
    features: ['院落式布局', '中轴对称', '坐北朝南']
  },
  {
    id: 'forbidden-city-taihe',
    name: '故宫太和殿',
    fullName: '故宫太和殿',
    category: '皇宫',
    era: '明',
    year: '1420',
    location: '北京市东城区',
    description: '紫禁城的核心建筑，重檐庑殿顶，是中国现存最大的木结构大殿。',
    image: '/data/images/forbidden-city-taihe.jpg',
    features: ['重檐庑殿顶', '金丝楠木柱', '和玺彩画']
  },
  {
    id: 'zhaozhou-bridge',
    name: '赵州桥',
    fullName: '赵州桥（安济桥）',
    category: '桥梁',
    era: '隋',
    year: '605',
    location: '河北省赵县',
    description: '世界现存最古老、保存最完整的单孔敞肩石拱桥，李春设计建造。',
    image: '/data/images/zhaozhou-bridge.jpg',
    features: ['单孔敞肩拱', '世界最古老石拱桥']
  },
  {
    id: 'zhili-zongdushu',
    name: '直隶总督署',
    fullName: '直隶总督署',
    category: '官府',
    era: '清',
    year: '1730',
    location: '河北省保定市',
    description: '清代直隶总督办公处所，是中国保存最完整的清代省级衙署。',
    image: '/data/images/zhili-zongdushu.jpg',
    features: ['衙署建筑', '中轴对称', '五进院落']
  },
  {
    id: 'hongcun-residence',
    name: '宏村民居',
    fullName: '宏村古民居',
    category: '民居',
    era: '明清',
    year: '明清时期',
    location: '安徽省黟县',
    description: '徽派建筑典型代表，以水为脉，马头墙错落有致，木雕砖雕精美。',
    image: '/data/images/hongcun-residence.jpg',
    features: ['徽派建筑', '马头墙', '三雕艺术']
  },
  {
    id: 'lugou-bridge',
    name: '卢沟桥',
    fullName: '卢沟桥（广济桥）',
    category: '桥梁',
    era: '金',
    year: '1192',
    location: '北京市丰台区',
    description: '北京现存最古老的石造联拱桥，以石狮雕刻闻名，马可·波罗称之为"世界上最好的桥"。',
    image: '/data/images/lugou-bridge.jpg',
    features: ['联拱石桥', '石狮雕刻', '马可·波罗赞誉']
  },
  {
    id: 'prince-gong-mansion',
    name: '恭王府',
    fullName: '恭王府及花园',
    category: '官府',
    era: '清',
    year: '1777',
    location: '北京市西城区',
    description: '清代规模最大的一座王府，曾是和珅、永璘的宅邸，后成为恭亲王奕訢的府邸。',
    image: '/data/images/prince-gong-mansion.jpg',
    features: ['王府建筑', '花园艺术', '锡晋斋']
  }
];

const CATEGORIES = ['全部', '民居', '官府', '皇宫', '桥梁'];

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuildings = useMemo(() => {
    return BUILDINGS.filter(building => {
      const matchesCategory = selectedCategory === '全部' || building.category === selectedCategory;
      const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           building.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            <span className="text-slate-600">|</span>
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
            {CATEGORIES.map((category) => (
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

        {/* 建筑网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBuildings.map((building, index) => (
            <motion.div
              key={building.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-[rgba(15,20,40,0.6)] backdrop-blur-xl border border-indigo-500/10 rounded-3xl overflow-hidden hover:border-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              {/* 图片区域 */}
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-900/30 via-blue-900/20 to-slate-900/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-12 h-12 text-blue-400/40" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,26,0.9)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-[rgba(15,20,40,0.8)] backdrop-blur-sm text-blue-300 rounded-full text-xs font-semibold shadow-sm border border-blue-500/20">
                    {building.category}
                  </span>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                  {building.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3">{building.fullName}</p>

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

                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {building.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {building.features.slice(0, 2).map((feature) => (
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
          ))}
        </div>

        {/* 空状态 */}
        {filteredBuildings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">没有找到匹配的建筑</h3>
            <p className="text-slate-500">尝试调整搜索词或筛选条件</p>
          </motion.div>
        )}

        {/* 统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <span className="text-slate-500">共展示 </span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{BUILDINGS.length}</span>
          <span className="text-slate-500"> 座古建筑</span>
          {selectedCategory !== '全部' && (
            <span className="text-slate-500">，当前筛选: <span className="text-blue-400 font-medium">{selectedCategory}</span></span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
