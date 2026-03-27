import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, GitCompare, Building2, Calendar, MapPin, 
  Layers, Compass, Shield, History, Image as ImageIcon,
  Ruler
} from 'lucide-react';
import { useRecognitionHistory } from '../hooks/useDatabase';
import type { RecognitionResult } from '../types/ai';

interface BuildingWithDetails {
  id: string;
  name: string;
  fullName: string;
  category: string;
  era: string;
  year: string;
  location: string;
  description: string;
  features: string[];
  image?: string;
  // 详细对比维度
  components: RecognitionResult['components'];
  fusion: RecognitionResult['fusion'];
  gis: RecognitionResult['gis'];
  confidence: number;
  recordedAt?: string;
}

// 从识别结果转换为对比数据
function convertToBuildingData(historyItem: { id?: number; result: RecognitionResult; timestamp: number }): BuildingWithDetails {
  return {
    id: `history-${historyItem.id}`,
    name: historyItem.result.name,
    fullName: `${historyItem.result.name}（${historyItem.result.category}）`,
    category: historyItem.result.category,
    era: historyItem.result.era,
    year: historyItem.result.year,
    location: historyItem.result.location,
    description: historyItem.result.description,
    features: historyItem.result.features,
    components: historyItem.result.components,
    fusion: historyItem.result.fusion,
    gis: historyItem.result.gis,
    confidence: historyItem.result.confidence,
    recordedAt: new Date(historyItem.timestamp).toISOString(),
  };
}

// 默认示例建筑（当没有历史记录时显示）
const DEFAULT_BUILDINGS: BuildingWithDetails[] = [
  {
    id: 'default-taihe',
    name: '故宫太和殿',
    fullName: '故宫太和殿（皇宫）',
    category: '皇宫',
    era: '明',
    year: '1420',
    location: '北京市东城区',
    description: '紫禁城核心建筑，中国现存最大木结构大殿',
    features: ['重檐庑殿顶', '和玺彩画', '金丝楠木柱'],
    components: {
      dougongType: '七踩重昂斗拱',
      beastCount: 10,
      beastTypes: ['龙', '凤', '狮', '天马', '海马', '狻猊', '押鱼', '獬豸', '斗牛', '行什'],
      paintingPattern: '和玺彩画',
      roofType: '重檐庑殿顶',
      confidence: 0.95,
    },
    fusion: { imageCount: 4, consistency: 0.92, crossViewSummary: '多角度确认' },
    gis: {
      placeName: '北京',
      lat: 39.9042,
      lng: 116.4074,
      dynastyContext: '明清都城核心',
      territoryLevel: '都城核心',
      timeline: [
        { period: '明永乐', territoryContext: '都城建设', locationRole: '皇宫核心' },
        { period: '明清', territoryContext: '帝国中心', locationRole: '政治中心' },
      ],
    },
    confidence: 0.92,
  },
  {
    id: 'default-tulou',
    name: '承启楼',
    fullName: '承启楼（福建土楼）',
    category: '民居',
    era: '清',
    year: '1709',
    location: '福建省龙岩市永定区',
    description: '永定土楼代表作，外圈夯土墙防御性围合',
    features: ['夯土承重墙', '环形围合', '多层合院'],
    components: {
      dougongType: '土楼简易斗拱',
      beastCount: 0,
      beastTypes: [],
      paintingPattern: '民间彩绘',
      roofType: '悬山顶',
      confidence: 0.85,
    },
    fusion: { imageCount: 3, consistency: 0.88, crossViewSummary: '三视角融合' },
    gis: {
      placeName: '福建永定',
      lat: 24.68,
      lng: 116.73,
      dynastyContext: '客家文化区',
      territoryLevel: '地方民居',
      timeline: [
        { period: '清康熙', territoryContext: '客家移民', locationRole: '宗族聚居' },
        { period: '清代', territoryContext: '山区开发', locationRole: '防御性民居' },
      ],
    },
    confidence: 0.85,
  },
];

// 获取类别样式
const getCategoryStyle = (category: string) => {
  switch (category) {
    case '皇宫':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case '官府':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case '桥梁':
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    default:
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  }
};

// 对比维度配置
const COMPARISON_DIMENSIONS = [
  { key: 'basic', label: '基本信息', icon: Building2 },
  { key: 'components', label: '构件细部', icon: Layers },
  { key: 'structure', label: '形制规模', icon: Ruler },
  { key: 'gis', label: '地理信息', icon: Compass },
  { key: 'confidence', label: '识别置信度', icon: Shield },
];

export default function ComparisonPage() {
  const { history } = useRecognitionHistory();
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState('basic');
  const [showImageComparison, setShowImageComparison] = useState(false);

  // 准备建筑列表（历史记录 + 默认示例）
  const availableBuildings = useMemo(() => {
    const historyBuildings = history.map(convertToBuildingData);
    return [...historyBuildings, ...DEFAULT_BUILDINGS];
  }, [history]);

  const toggleBuilding = (id: string) => {
    setSelectedBuildings(prev => {
      if (prev.includes(id)) {
        return prev.filter(b => b !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const selectedData = availableBuildings.filter(b => selectedBuildings.includes(b.id));

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        {/* 头部导航 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">建筑专业对比</h1>
            </div>
          </div>

          {selectedBuildings.length >= 2 && (
            <button
              type="button"
              onClick={() => setShowImageComparison(!showImageComparison)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              {showImageComparison ? '隐藏图片' : '图片对比'}
            </button>
          )}
        </motion.div>

        {/* 建筑选择区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">
              选择要对比的建筑（2-3个）
            </h2>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">
                历史记录: {history.length}条
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableBuildings.map((building) => (
              <button
                type="button"
                key={building.id}
                onClick={() => toggleBuilding(building.id)}
                className={`relative p-4 rounded-2xl border text-left transition-all duration-300 ${
                  selectedBuildings.includes(building.id)
                    ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20'
                }`}
              >
                {selectedBuildings.includes(building.id) && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {selectedBuildings.indexOf(building.id) + 1}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    building.category === '皇宫' ? 'bg-amber-500/20' :
                    building.category === '官府' ? 'bg-blue-500/20' :
                    building.category === '桥梁' ? 'bg-cyan-500/20' :
                    'bg-emerald-500/20'
                  }`}>
                    <span className="text-lg font-bold text-white/80">
                      {building.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">
                      {building.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {building.recordedAt ? 
                        new Date(building.recordedAt).toLocaleDateString() : 
                        '示例数据'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryStyle(building.category)}`}>
                    {building.category}
                  </span>
                  <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-full text-xs">
                    {building.era}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 对比结果 */}
        {selectedData.length >= 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 维度切换 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {COMPARISON_DIMENSIONS.map((dim) => (
                <button
                  type="button"
                  key={dim.key}
                  onClick={() => setActiveDimension(dim.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeDimension === dim.key
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <dim.icon className="w-4 h-4" />
                  {dim.label}
                </button>
              ))}
            </div>

            {/* 图片对比区 */}
            <AnimatePresence>
              {showImageComparison && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {selectedData.map((building) => (
                    <div key={building.id} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800">
                      {building.image ? (
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                          <div className="text-center">
                            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">{building.name}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white font-bold">{building.name}</p>
                        <p className="text-white/70 text-sm">{building.category}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 详细对比表格 */}
            <div className="overflow-x-auto rounded-2xl border border-indigo-500/10 bg-[rgba(15,20,40,0.5)]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-500/10 bg-white/5">
                    <th className="text-left p-4 text-slate-400 font-medium w-32">对比维度</th>
{selectedData.map((building, idx) => (
                      <th key={building.id} className="text-left p-4 min-w-[250px]">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            building.category === '皇宫' ? 'bg-amber-500/20' :
                            building.category === '官府' ? 'bg-blue-500/20' :
                            building.category === '桥梁' ? 'bg-cyan-500/20' :
                            'bg-emerald-500/20'
                          }`}>
                            <span className="text-lg font-bold text-white">{idx + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{building.name}</h3>
                            <p className="text-xs text-slate-400">{building.category} · {building.era}</p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-indigo-500/5">
                  {activeDimension === 'basic' && (
                    <>
                      <tr>
                        <td className="p-4 text-slate-400"><Calendar className="w-4 h-4 inline mr-2" />建造年代</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">{b.era}（{b.year}）</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400"><MapPin className="w-4 h-4 inline mr-2" />地理位置</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">{b.location}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400"><Building2 className="w-4 h-4 inline mr-2" />建筑描述</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-400 text-sm leading-relaxed">{b.description}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400"><Layers className="w-4 h-4 inline mr-2" />主要特征</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {b.features.map(f => (
                                <span key={f} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full text-xs border border-blue-500/20">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                  
                  {activeDimension === 'components' && (
                    <>
                      <tr>
                        <td className="p-4 text-slate-400">屋顶形制</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.components?.roofType || '未识别'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">斗拱类型</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.components?.dougongType || '未识别'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">彩画纹样</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.components?.paintingPattern || '未识别'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">脊兽数量</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.components?.beastCount || 0} 只
                            {b.components?.beastTypes && b.components.beastTypes.length > 0 && (
                              <span className="text-xs text-slate-500 ml-2">
                                （{b.components.beastTypes.join('、')}）
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">构件识别置信度</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(b.components?.confidence || 0) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-400 w-12">
                                {Math.round((b.components?.confidence || 0) * 100)}%
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                  
                  {activeDimension === 'structure' && (
                    <>
                      <tr>
                        <td className="p-4 text-slate-400">多视角融合</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.fusion?.imageCount || 1} 张图片
                            <span className="text-xs text-slate-500 ml-2">
                              （一致性 {Math.round((b.fusion?.consistency || 0) * 100)}%）
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">融合摘要</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-400 text-sm">
                            {b.fusion?.crossViewSummary || '单视角识别'}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                  
                  {activeDimension === 'gis' && (
                    <>
                      <tr>
                        <td className="p-4 text-slate-400"><Compass className="w-4 h-4 inline mr-2" />标准地名</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.gis?.placeName || '未定位'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">坐标位置</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300 font-mono text-sm">
                            {b.gis?.lat ? `${b.gis.lat.toFixed(4)}, ${b.gis.lng?.toFixed(4)}` : '未定位'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">历史地理语境</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-400 text-sm leading-relaxed">
                            {b.gis?.dynastyContext || '未分析'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 text-slate-400">政区层级</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4 text-slate-300">
                            {b.gis?.territoryLevel || '未确定'}
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                  
                  {activeDimension === 'confidence' && (
                    <>
                      <tr>
                        <td className="p-4 text-slate-400"><Shield className="w-4 h-4 inline mr-2" />整体置信度</td>
                        {selectedData.map(b => (
                          <td key={b.id} className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    b.confidence >= 0.85 ? 'bg-emerald-500' :
                                    b.confidence >= 0.65 ? 'bg-amber-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${b.confidence * 100}%` }}
                                />
                              </div>
                              <span className={`text-lg font-bold w-16 ${
                                b.confidence >= 0.85 ? 'text-emerald-400' :
                                b.confidence >= 0.65 ? 'text-amber-400' :
                                'text-red-400'
                              }`}>
                                {Math.round(b.confidence * 100)}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {b.confidence >= 0.85 ? '高置信度 - 结论可靠' :
                               b.confidence >= 0.65 ? '中置信度 - 建议补充' :
                               '低置信度 - 需要重拍'}
                            </p>
                          </td>
                        ))}
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* 对比总结 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-blue-400" />
                对比分析总结
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedData.map((building, idx) => (
                  <div key={building.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                        building.category === '皇宫' ? 'bg-amber-500' :
                        building.category === '官府' ? 'bg-blue-500' :
                        building.category === '桥梁' ? 'bg-cyan-500' :
                        'bg-emerald-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <h4 className="font-bold text-white">{building.name}</h4>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-slate-400">构件完整度</span>
                        <span className="text-slate-300">{building.components ? '已识别' : '未识别'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">地理定位</span>
                        <span className="text-slate-300">{building.gis?.placeName ? '已定位' : '未定位'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">多视角验证</span>
                        <span className="text-slate-300">{building.fusion?.imageCount || 1}张</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-slate-400">识别置信度</span>
                        <span className={building.confidence >= 0.85 ? 'text-emerald-400' : building.confidence >= 0.65 ? 'text-amber-400' : 'text-red-400'}>
                          {Math.round(building.confidence * 100)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[rgba(15,20,40,0.5)] rounded-2xl border border-indigo-500/10"
          >
            <GitCompare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">请选择至少2个建筑进行对比</h3>
            <p className="text-slate-400 mb-4">可以从识别历史中选择，或使用默认示例</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <History className="w-4 h-4" />
              <span>提示：识别建筑后会自动保存到历史记录</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
