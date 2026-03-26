import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Calendar, Building2, ArrowUpRight, X, Landmark, Sparkles } from 'lucide-react';

const withBase = (filePath: string) => `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/, '')}`;

interface ShowcaseItem {
  id: string;
  name: string;
  category: string;
  era: string;
  year: string;
  location: string;
  description: string;
  story: string;
  significance: string;
  focusPoints: string[];
  features: string[];
  color: string;
  icon: string;
  image: string;
}

const showcases: ShowcaseItem[] = [
  {
    id: 'forbidden-city-taihe',
    name: '故宫太和殿',
    category: '皇宫',
    era: '明清',
    year: '1420年',
    location: '北京',
    description: '中国现存最大的木结构大殿，位于紫禁城南北主轴线的显要位置，是明清两代皇帝举行大典的场所。',
    story: '太和殿始建于明永乐年间，后历经火灾与重建，清代形成今天所见形制，是国家礼仪与王朝权力的核心舞台。',
    significance: '作为宫殿建筑最高等级范式，太和殿集中呈现了台基、柱网、屋顶与彩画系统的协同。',
    focusPoints: ['先看台基高度与殿身比例关系', '再看重檐与斗拱的承托层次', '最后观察中轴空间如何组织仪式动线'],
    features: ['重檐庑殿顶', '黄色琉璃瓦', '和玺彩画'],
    color: 'from-red-500 to-rose-600',
    icon: '👑',
    image: withBase('data/images/forbidden-city-taihe.jpg'),
  },
  {
    id: 'zhaozhou-bridge',
    name: '赵州桥',
    category: '桥梁',
    era: '隋代',
    year: '605年',
    location: '河北赵县',
    description: '世界上现存最古老、保存最完整的单孔敞肩石拱桥，距今已有1400多年历史，由著名工匠李春设计建造。',
    story: '赵州桥建于隋代，是中国古代桥梁工程的重要里程碑，以创新的敞肩结构显著提高了排洪与减重能力。',
    significance: '其"大拱+小拱"的组合体现了古代工程师对受力与材料效率的深刻理解。',
    focusPoints: ['侧视观察拱圈曲线和跨度比例', '注意敞肩小拱的减重与泄洪作用', '对比桥墩与桥面的受力传递路径'],
    features: ['单孔敞肩', '大拱加小拱', '世界最古老'],
    color: 'from-cyan-500 to-blue-600',
    icon: '🌉',
    image: withBase('data/images/zhaozhou-bridge.jpg'),
  },
  {
    id: 'chengqi-tulou',
    name: '福建土楼',
    category: '民居',
    era: '明清',
    year: '12-20世纪',
    location: '福建',
    description: '福建客家人特有的民居建筑形式，以其独特的圆形或方形夯土建筑闻名于世，聚族而居，具有防御功能。',
    story: '土楼随着客家聚族生活需求逐步成熟，形成"防御+居住+宗族组织"三位一体的建筑体系。',
    significance: '承启楼代表了夯土围合、木构内廊与公共院落空间的高度整合，是地域材料智慧的典型案例。',
    focusPoints: ['看外圈夯土墙厚度与开窗控制', '看内廊如何组织垂直交通与邻里关系', '看中心院落如何承担公共活动'],
    features: ['圆形土楼', '夯土建筑', '防御功能'],
    color: 'from-blue-500 to-orange-600',
    icon: '🏠',
    image: withBase('data/images/chengqi-tulou.jpg'),
  },
  {
    id: 'beijing-siheyuan',
    name: '四合院',
    category: '民居',
    era: '明清',
    year: '14-20世纪',
    location: '北京',
    description: '中国传统民居建筑的代表，以院落为中心，四面围合的建筑形式，体现了中国传统的中轴对称布局。',
    story: '四合院在长期城市生活中形成稳定形制，通过门、院、房的层层递进实现礼序、私密与日常生活平衡。',
    significance: '它是北方院落住宅的典型母题，反映了朝向、气候、家庭结构与礼制观念对空间的共同塑造。',
    focusPoints: ['先看正房与厢房的等级关系', '再看院落尺度与采光通风逻辑', '最后看影壁与门道如何组织视线与动线'],
    features: ['中轴对称', '院落布局', '四面建房'],
    color: 'from-emerald-500 to-teal-600',
    icon: '🏡',
    image: withBase('data/images/beijing-siheyuan.jpg'),
  },
];

const FALLBACK_IMAGE = withBase('data/images/forbidden-city-wumen.jpg');

const getCategoryStyle = (category: string) => {
  switch (category) {
    case '皇宫':
      return 'bg-gradient-to-r from-red-500/10 to-rose-500/10 text-red-600 border-red-200';
    case '民居':
      return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-400 border-amber-200';
    case '官府':
      return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200';
    case '桥梁':
      return 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-600 border-cyan-200';
    default:
      return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-600 border-gray-200';
  }
};

export const ShowcaseSection: React.FC = () => {
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseItem | null>(null);

  return (
    <section id="showcase" className="relative scroll-mt-28 py-32 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-china-paper/30 to-transparent" />
      <div className="absolute inset-0 bg-pattern-china opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-china-gold/10 to-amber-500/10 border border-china-gold/30 rounded-full shadow-sm"
          >
            <Landmark className="w-4 h-4 text-china-gold" />
            <span className="text-sm font-semibold text-china-gold-dark">经典案例</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-china-ink mb-6"
          >
            探索 <span className="text-gradient-gold">建筑瑰宝</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-china-ink-muted max-w-3xl mx-auto"
          >
            从皇宫到民居，从桥梁到园林，发现中华建筑的独特魅力
          </motion.p>
        </motion.div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcases.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-china-ink/5 hover:border-china-gold/30 hover:shadow-china-lg transition-all duration-500">
                {/* Cover Image */}
                <div className={`relative h-64 bg-gradient-to-br ${item.color} overflow-hidden`}>
                  <img
                    src={item.image}
                    alt={`${item.name} 实景图`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  {/* Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />

                  {/* Building Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Building2 className="w-16 h-16 text-white/80" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 backdrop-blur-sm text-sm font-medium rounded-full border ${getCategoryStyle(item.category)}`}>
                      <span className="mr-1">{item.icon}</span>
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-china-ink/80 via-china-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                    <motion.button
                      type="button"
                      onClick={() => setActiveShowcase(item)}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-china-ink font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-china-gold hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      查看详情
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-china-ink mb-3 group-hover:text-china-gold-dark transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-china-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span>{item.era} · {item.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-400" />
                      </div>
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="text-china-ink-muted text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-gradient-to-r from-china-gold/10 to-amber-500/10 text-china-gold-dark text-xs rounded-full border border-china-gold/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {activeShowcase && (
            <motion.div
              className="fixed inset-0 z-[90] bg-china-ink/60 backdrop-blur-sm px-4 py-8 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveShowcase(null)}
            >
              <motion.div
                className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl overflow-hidden border border-china-gold/20 bg-white shadow-2xl"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative h-72 md:h-full min-h-[20rem]">
                    <img
                      src={activeShowcase.image}
                      alt={`${activeShowcase.name} 详情图`}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-china-ink/60 via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-medium border ${getCategoryStyle(activeShowcase.category)}`}>
                      <span className="mr-1">{activeShowcase.icon}</span>
                      {activeShowcase.category}
                    </span>
                  </div>

                  {/* Content Side */}
                  <div className="p-6 md:p-8 bg-white">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-china-ink">{activeShowcase.name}</h3>
                      <button
                        type="button"
                        onClick={() => setActiveShowcase(null)}
                        className="p-2 rounded-full border border-china-ink/10 text-china-ink-muted hover:text-china-ink hover:border-china-gold/30 hover:bg-china-gold/5 transition-all"
                        aria-label="关闭详情"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-china-ink-muted mb-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-china-gold" />
                        <span>{activeShowcase.era} · {activeShowcase.year}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-china-gold" />
                        <span>{activeShowcase.location}</span>
                      </div>
                    </div>

                    <p className="text-china-ink-muted leading-relaxed mb-6">{activeShowcase.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="rounded-xl border border-china-ink/5 bg-china-paper/50 px-3 py-3">
                        <p className="text-[11px] text-china-ink-muted uppercase tracking-wider">建筑类型</p>
                        <p className="mt-1 text-sm font-semibold text-china-ink">{activeShowcase.category}</p>
                      </div>
                      <div className="rounded-xl border border-china-ink/5 bg-china-paper/50 px-3 py-3">
                        <p className="text-[11px] text-china-ink-muted uppercase tracking-wider">主要年代</p>
                        <p className="mt-1 text-sm font-semibold text-china-ink">{activeShowcase.year}</p>
                      </div>
                      <div className="rounded-xl border border-china-ink/5 bg-china-paper/50 px-3 py-3">
                        <p className="text-[11px] text-china-ink-muted uppercase tracking-wider">所在地区</p>
                        <p className="mt-1 text-sm font-semibold text-china-ink">{activeShowcase.location}</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-china-gold/20 bg-gradient-to-br from-china-gold/5 to-amber-500/5 px-4 py-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-china-gold" />
                        <p className="text-xs font-semibold text-china-gold-dark uppercase tracking-wider">建筑价值</p>
                      </div>
                      <p className="text-sm text-china-ink-muted leading-relaxed">{activeShowcase.significance}</p>
                    </div>

                    <div className="rounded-xl border border-china-ink/5 bg-china-paper/30 px-4 py-4 mb-6">
                      <p className="text-xs font-semibold text-china-ink-muted uppercase tracking-wider mb-2">历史脉络</p>
                      <p className="text-sm text-china-ink-muted leading-relaxed">{activeShowcase.story}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeShowcase.features.map((feature) => (
                        <span
                          key={`${activeShowcase.id}-${feature}`}
                          className="px-3 py-1.5 text-xs rounded-full border border-china-gold/30 bg-gradient-to-r from-china-gold/10 to-amber-500/10 text-china-gold-dark"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-china-ink mb-3">推荐观察点</p>
                      <ol className="space-y-2">
                        {activeShowcase.focusPoints.map((point, index) => (
                          <li key={`${activeShowcase.id}-focus-${point}`} className="flex gap-3 text-sm text-china-ink-muted">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-china-gold/10 text-china-gold-dark text-xs font-semibold flex items-center justify-center border border-china-gold/20">
                              {index + 1}
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
