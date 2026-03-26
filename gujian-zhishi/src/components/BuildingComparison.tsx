import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Building2, ArrowRightLeft, Trophy, Scale, ChevronDown, Sparkles } from 'lucide-react';

interface BuildingData {
  id: string;
  name: string;
  category: string;
  era: string;
  year: string;
  location: string;
  description: string;
  features: string[];
  image: string;
  structuralScore: number;
  preservationScore: number;
  digitalValue: number;
  riskLevel: '高风险' | '中风险' | '可控';
}

interface BuildingComparisonProps {
  currentBuilding?: BuildingData | null;
}

const withBase = (filePath: string) =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/, '')}`;

const BUILDING_DATABASE: BuildingData[] = [
  {
    id: 'forbidden-city-taihe',
    name: '故宫太和殿',
    category: '皇宫',
    era: '明清',
    year: '1420年',
    location: '北京',
    description: '中国现存最大的木结构大殿，位于紫禁城南北主轴线的显要位置。',
    features: ['重檐庑殿顶', '黄色琉璃瓦', '和玺彩画'],
    image: withBase('data/images/forbidden-city-taihe.jpg'),
    structuralScore: 72,
    preservationScore: 89,
    digitalValue: 94,
    riskLevel: '中风险',
  },
  {
    id: 'zhaozhou-bridge',
    name: '赵州桥',
    category: '桥梁',
    era: '隋代',
    year: '605年',
    location: '河北赵县',
    description: '世界上现存最古老、保存最完整的单孔敞肩石拱桥。',
    features: ['单孔敞肩', '大拱加小拱', '世界最古老'],
    image: withBase('data/images/zhaozhou-bridge.jpg'),
    structuralScore: 68,
    preservationScore: 91,
    digitalValue: 88,
    riskLevel: '中风险',
  },
  {
    id: 'chengqi-tulou',
    name: '福建土楼',
    category: '民居',
    era: '明清',
    year: '12-20世纪',
    location: '福建',
    description: '福建客家人特有的民居建筑形式，以独特的圆形夯土建筑闻名。',
    features: ['圆形土楼', '夯土建筑', '防御功能'],
    image: withBase('data/images/chengqi-tulou.jpg'),
    structuralScore: 78,
    preservationScore: 84,
    digitalValue: 82,
    riskLevel: '高风险',
  },
  {
    id: 'beijing-siheyuan',
    name: '四合院',
    category: '民居',
    era: '明清',
    year: '14-20世纪',
    location: '北京',
    description: '中国传统民居建筑的代表，以院落为中心四面围合。',
    features: ['中轴对称', '院落布局', '四面建房'],
    image: withBase('data/images/beijing-siheyuan.jpg'),
    structuralScore: 45,
    preservationScore: 76,
    digitalValue: 71,
    riskLevel: '可控',
  },
  {
    id: 'pingyao-yamen',
    name: '平遥县衙',
    category: '官府',
    era: '明清',
    year: '明清',
    location: '山西平遥',
    description: '保存完整的县级官署建筑群，体现古代行政空间组织。',
    features: ['中轴对称', '大堂二堂', '仪门甬道'],
    image: withBase('data/images/pingyao-yamen.jpg'),
    structuralScore: 62,
    preservationScore: 87,
    digitalValue: 79,
    riskLevel: '中风险',
  },
  {
    id: 'wuting-bridge',
    name: '五亭桥',
    category: '桥梁',
    era: '清',
    year: '1757年',
    location: '江苏扬州',
    description: '瘦西湖标志性桥梁，以桥亭组合和多拱结构形成独特景观。',
    features: ['桥亭结合', '多拱石桥', '园林景观'],
    image: withBase('data/images/wuting-bridge.jpg'),
    structuralScore: 55,
    preservationScore: 82,
    digitalValue: 86,
    riskLevel: '可控',
  },
];

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

const getRiskColor = (risk: string) => {
  switch (risk) {
    case '高风险':
      return 'text-red-500 bg-red-50 border-red-200';
    case '中风险':
      return 'text-blue-400 bg-amber-50 border-amber-200';
    case '可控':
      return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    default:
      return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

export const BuildingComparison: React.FC<BuildingComparisonProps> = ({
  currentBuilding,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [leftBuildingId, setLeftBuildingId] = useState<string>(
    currentBuilding?.id ?? BUILDING_DATABASE[0].id
  );
  const [rightBuildingId, setRightBuildingId] = useState<string>(
    BUILDING_DATABASE[1].id
  );

  const leftBuilding = useMemo(
    () => BUILDING_DATABASE.find((b) => b.id === leftBuildingId) ?? BUILDING_DATABASE[0],
    [leftBuildingId]
  );
  const rightBuilding = useMemo(
    () => BUILDING_DATABASE.find((b) => b.id === rightBuildingId) ?? BUILDING_DATABASE[1],
    [rightBuildingId]
  );

  const comparison = useMemo(() => {
    const scoreDiff = leftBuilding.structuralScore - rightBuilding.structuralScore;
    const preservationDiff = leftBuilding.preservationScore - rightBuilding.preservationScore;
    const digitalDiff = leftBuilding.digitalValue - rightBuilding.digitalValue;

    const advantages = [];
    if (scoreDiff < -10) advantages.push(`${rightBuilding.name} 结构更稳定`);
    if (preservationDiff < -10) advantages.push(`${rightBuilding.name} 保护优先级更高`);
    if (digitalDiff < -10) advantages.push(`${rightBuilding.name} 数字化展示价值更高`);
    if (advantages.length === 0) advantages.push('两建筑保护需求相近，建议联合申遗或建立区域保护联盟');

    return {
      scoreDiff,
      preservationDiff,
      digitalDiff,
      advantages,
      winner:
        leftBuilding.preservationScore > rightBuilding.preservationScore
          ? leftBuilding.name
          : rightBuilding.name,
    };
  }, [leftBuilding, rightBuilding]);

  const handleSwap = () => {
    setLeftBuildingId(rightBuildingId);
    setRightBuildingId(leftBuildingId);
  };

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 rounded-2xl border border-china-ink/5 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm hover:shadow-china-lg hover:border-china-gold/20 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-china-gold to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-china-ink">同类建筑对比分析</h3>
            <p className="text-sm text-china-ink-muted">
              并排比较两栋建筑的风险等级、保护优先级与数字化价值
            </p>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full bg-china-paper flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-china-ink-muted" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 rounded-2xl border border-china-ink/5 bg-[rgba(15,20,40,0.5)] backdrop-blur-sm p-6 shadow-china">
              {/* Building Selectors */}
              <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                <div className="flex-1 w-full">
                  <label htmlFor="left-building-selector" className="text-xs font-semibold text-china-ink-muted mb-2 block uppercase tracking-wider">左侧建筑</label>
                  <select
                    id="left-building-selector"
                    value={leftBuildingId}
                    onChange={(e) => setLeftBuildingId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-china-ink/10 bg-white text-china-ink text-sm focus:outline-none focus:border-china-gold/30 focus:ring-2 focus:ring-china-gold/10 transition-all"
                  >
                    {BUILDING_DATABASE.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-3 rounded-xl border border-china-ink/10 bg-china-paper hover:bg-china-gold/10 hover:border-china-gold/30 text-china-ink-muted hover:text-china-gold transition-all duration-300"
                  title="交换位置"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 w-full">
                  <label htmlFor="right-building-selector" className="text-xs font-semibold text-china-ink-muted mb-2 block uppercase tracking-wider">右侧建筑</label>
                  <select
                    id="right-building-selector"
                    value={rightBuildingId}
                    onChange={(e) => setRightBuildingId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-china-ink/10 bg-white text-china-ink text-sm focus:outline-none focus:border-china-gold/30 focus:ring-2 focus:ring-china-gold/10 transition-all"
                  >
                    {BUILDING_DATABASE.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Building */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-china-ink/5 bg-white overflow-hidden shadow-china hover:shadow-china-lg transition-all duration-300"
                >
                  <div className="relative h-52">
                    <img
                      src={leftBuilding.image}
                      alt={leftBuilding.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-china-ink/80 via-china-ink/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryStyle(leftBuilding.category)}`}>
                        {leftBuilding.category}
                      </span>
                      <h4 className="mt-2 text-xl font-bold text-white">{leftBuilding.name}</h4>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-china-ink-muted">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span>{leftBuilding.era} · {leftBuilding.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-china-ink-muted">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-400" />
                      </div>
                      <span>{leftBuilding.location}</span>
                    </div>
                    <p className="text-sm text-china-ink-muted line-clamp-2 leading-relaxed">{leftBuilding.description}</p>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-china-ink/5">
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">结构压力</p>
                        <p className={`text-xl font-bold ${
                          leftBuilding.structuralScore >= 70 ? 'text-red-500' : 'text-emerald-500'
                        }`}>
                          {leftBuilding.structuralScore}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">保护优先级</p>
                        <p className="text-xl font-bold text-sky-500">{leftBuilding.preservationScore}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">数字价值</p>
                        <p className="text-xl font-bold text-china-gold">{leftBuilding.digitalValue}</p>
                      </div>
                    </div>
                    
                    {/* Risk Level */}
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getRiskColor(leftBuilding.riskLevel)}`}>
                        风险等级: {leftBuilding.riskLevel}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Right Building */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-china-ink/5 bg-white overflow-hidden shadow-china hover:shadow-china-lg transition-all duration-300"
                >
                  <div className="relative h-52">
                    <img
                      src={rightBuilding.image}
                      alt={rightBuilding.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-china-ink/80 via-china-ink/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryStyle(rightBuilding.category)}`}>
                        {rightBuilding.category}
                      </span>
                      <h4 className="mt-2 text-xl font-bold text-white">{rightBuilding.name}</h4>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-china-ink-muted">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-cyan-600" />
                      </div>
                      <span>{rightBuilding.era} · {rightBuilding.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-china-ink-muted">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                      </div>
                      <span>{rightBuilding.location}</span>
                    </div>
                    <p className="text-sm text-china-ink-muted line-clamp-2 leading-relaxed">{rightBuilding.description}</p>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-china-ink/5">
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">结构压力</p>
                        <p className={`text-xl font-bold ${
                          rightBuilding.structuralScore >= 70 ? 'text-red-500' : 'text-emerald-500'
                        }`}>
                          {rightBuilding.structuralScore}
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">保护优先级</p>
                        <p className="text-xl font-bold text-sky-500">{rightBuilding.preservationScore}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-china-paper/50">
                        <p className="text-[10px] text-china-ink-muted uppercase tracking-wider mb-1">数字价值</p>
                        <p className="text-xl font-bold text-china-gold">{rightBuilding.digitalValue}</p>
                      </div>
                    </div>
                    
                    {/* Risk Level */}
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${getRiskColor(rightBuilding.riskLevel)}`}>
                        风险等级: {rightBuilding.riskLevel}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Analysis Result */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 rounded-2xl border border-china-gold/20 bg-gradient-to-br from-china-gold/5 to-amber-500/5 p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-china-gold to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-china-ink">对比结论</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-xl bg-[rgba(15,20,40,0.5)] p-4 border border-china-ink/5">
                    <p className="text-xs text-china-ink-muted uppercase tracking-wider mb-2">保护优先级差异</p>
                    <p className={`text-2xl font-bold ${
                      Math.abs(comparison.preservationDiff) > 10 ? 'text-china-gold' : 'text-china-ink'
                    }`}>
                      {comparison.preservationDiff > 0 ? '+' : ''}{comparison.preservationDiff}
                    </p>
                    <p className="text-xs text-china-ink-muted mt-1">
                      {leftBuilding.name} 更{comparison.preservationDiff > 0 ? '高' : '低'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[rgba(15,20,40,0.5)] p-4 border border-china-ink/5">
                    <p className="text-xs text-china-ink-muted uppercase tracking-wider mb-2">数字化价值差异</p>
                    <p className={`text-2xl font-bold ${
                      Math.abs(comparison.digitalDiff) > 10 ? 'text-china-gold' : 'text-china-ink'
                    }`}>
                      {comparison.digitalDiff > 0 ? '+' : ''}{comparison.digitalDiff}
                    </p>
                    <p className="text-xs text-china-ink-muted mt-1">
                      {leftBuilding.name} 更{comparison.digitalDiff > 0 ? '高' : '低'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-200">
                    <p className="text-xs text-emerald-600 uppercase tracking-wider mb-2">建议优先保护</p>
                    <p className="text-lg font-bold text-emerald-700">{comparison.winner}</p>
                    <p className="text-xs text-emerald-600/70 mt-1">综合评分更高</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-china-ink flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-china-gold" />
                    核心优势分析
                  </p>
                  <ul className="space-y-2">
                    {comparison.advantages.map((adv, idx) => (
                      <li key={`${leftBuilding.id}-${rightBuilding.id}-adv-${idx}`} className="text-sm text-china-ink-muted flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-china-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 className="w-3 h-3 text-china-gold" />
                        </div>
                        <span className="leading-relaxed">{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-[rgba(15,20,40,0.5)] border-l-4 border-china-gold">
                  <p className="text-sm text-china-ink-muted leading-relaxed">
                    <span className="font-semibold text-china-gold-dark">分析建议：</span>
                    通过对比{leftBuilding.name}与{rightBuilding.name}，我们发现
                    {comparison.preservationDiff > 10
                      ? `${leftBuilding.name}需要更紧急的保护措施`
                      : comparison.preservationDiff < -10
                        ? `${rightBuilding.name}需要更紧急的保护措施`
                        : '两建筑保护优先级相近，可制定联合保护策略'}
                    。这种基于数据驱动的古建筑比较研究方法，为遗产保护决策提供了科学依据。
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
