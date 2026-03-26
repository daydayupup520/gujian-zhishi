import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitCompare, Building2, Calendar, MapPin, Ruler, Info } from 'lucide-react';
import { BuildingComparison } from '../components/BuildingComparison';

// 示例建筑数据
const SAMPLE_BUILDINGS = [
  {
    id: 'chengqi-tulou',
    name: '承启楼（福建土楼）',
    category: '民居',
    era: '清',
    year: '1709',
    location: '福建省龙岩市永定区',
    features: ['夯土承重墙', '环形围合', '多层合院', '聚族而居'],
    structure: '圆形土楼，四层同心圆结构',
    area: '5376平方米',
    height: '四层，约12米'
  },
  {
    id: 'forbidden-city-taihe',
    name: '故宫太和殿',
    category: '皇宫',
    era: '明',
    year: '1420',
    location: '北京市东城区',
    features: ['重檐庑殿顶', '金丝楠木柱', '和玺彩画', '三层汉白玉台基'],
    structure: '面阔11间，进深5间',
    area: '2377平方米',
    height: '约35米（含台基）'
  },
  {
    id: 'zhaozhou-bridge',
    name: '赵州桥',
    category: '桥梁',
    era: '隋',
    year: '605',
    location: '河北省赵县',
    features: ['单孔敞肩石拱桥', '李春设计', '世界最古老石拱桥'],
    structure: '单孔敞肩拱，拱跨37米',
    length: '50.82米',
    width: '9.6米'
  },
  {
    id: 'zhili-zongdushu',
    name: '直隶总督署',
    category: '官府',
    era: '清',
    year: '1730',
    location: '河北省保定市',
    features: ['衙署建筑', '中轴对称', '大门仪门大堂'],
    structure: '五进院落，中轴对称',
    area: '约30000平方米',
    rooms: '105间'
  }
];

export default function ComparisonPage() {
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);

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

  const selectedData = SAMPLE_BUILDINGS.filter(b => selectedBuildings.includes(b.id));

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
        {/* 导航栏 */}
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
              <h1 className="text-2xl font-bold text-white">建筑对比</h1>
            </div>
          </div>

          <div className="text-slate-500 text-sm">
            已选择 <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{selectedBuildings.length}</span> / 3 个建筑
          </div>
        </motion.div>

        {/* 选择区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-medium text-white mb-4">选择要对比的建筑（最多3个）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_BUILDINGS.map((building) => (
              <button
                type="button"
                key={building.id}
                onClick={() => toggleBuilding(building.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                  selectedBuildings.includes(building.id)
                    ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'bg-[rgba(15,20,40,0.5)] border-indigo-500/10 hover:border-blue-500/20 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white">{building.name}</h3>
                  {selectedBuildings.includes(building.id) && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {selectedBuildings.indexOf(building.id) + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-white/5 rounded text-slate-400">
                    {building.category}
                  </span>
                  <span className="px-2 py-1 bg-white/5 rounded text-slate-400">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-indigo-500/10">
                    <th className="text-left p-4 text-slate-400 font-medium">对比项</th>
                    {selectedData.map((building) => (
                      <th key={building.id} className="text-left p-4 text-white font-bold min-w-[200px]">
                        {building.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-500/5">
                  <tr>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      建筑类型
                    </td>
                    {selectedData.map((building) => (
                      <td key={building.id} className="p-4 text-white">
                        <span className="px-3 py-1 bg-blue-500/15 text-blue-300 rounded-full text-sm">
                          {building.category}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      建造年代
                    </td>
                    {selectedData.map((building) => (
                      <td key={building.id} className="p-4 text-slate-300">
                        {building.era}（{building.year}年）
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      地理位置
                    </td>
                    {selectedData.map((building) => (
                      <td key={building.id} className="p-4 text-slate-400">
                        {building.location}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      结构规模
                    </td>
                    {selectedData.map((building) => (
                      <td key={building.id} className="p-4 text-slate-400">
                        {building.structure}
                        <br />
                        <span className="text-blue-300">{building.area || building.length}</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      主要特征
                    </td>
                    {selectedData.map((building) => (
                      <td key={building.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {building.features.map((feature) => (
                            <span
                              key={`${building.id}-${feature}`}
                              className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-full text-xs border border-indigo-500/10"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 可视化对比 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white mb-4">可视化分析</h3>
              <BuildingComparison />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[rgba(15,20,40,0.5)] rounded-2xl border border-indigo-500/10"
          >
            <GitCompare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">请选择至少2个建筑进行对比</h3>
            <p className="text-slate-400">点击上方建筑卡片，选择要对比的古建筑</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
