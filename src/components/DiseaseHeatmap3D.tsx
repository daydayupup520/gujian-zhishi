import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, TrendingUp, DollarSign, Activity, X, ChevronRight } from 'lucide-react';
import type { Disease3DMapping, DiseasePrediction, ComponentDiseaseHotspot } from '../types/disease3d';
import { CATEGORY_DISEASE_MAPPINGS, generateDiseasePredictions } from '../types/disease3d';
import type { RecognitionResult } from '../types/ai';
import { PalaceModel, GovernmentModel, ResidenceModel, BridgeModel, GenericModel } from './Scene3D';

interface DiseaseHeatmap3DProps {
  category: RecognitionResult['category'];
  diseases: Disease3DMapping[];
  onHotspotClick?: (hotspot: ComponentDiseaseHotspot, disease: Disease3DMapping | null) => void;
}

// 热力图球体组件
const HeatmapSphere = ({
  position,
  radius,
  heatValue,
  isSelected,
  onClick,
  diseaseCount
}: {
  position: [number, number, number];
  radius: number;
  heatValue: number;
  isSelected: boolean;
  onClick: () => void;
  diseaseCount: number;
}) => {
  // 根据热力值确定颜色
  const color = useMemo(() => {
    if (heatValue > 0.7) return '#ef4444'; // 红色 - 严重
    if (heatValue > 0.4) return '#f59e0b'; // 橙色 - 中度
    return '#eab308'; // 黄色 - 轻微
  }, [heatValue]);

  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.6 : 0.35}
          depthWrite={false}
        />
      </mesh>
      {isSelected && (
        <Html center>
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap pointer-events-none animate-pulse">
            {diseaseCount} 处病害
          </div>
        </Html>
      )}
    </group>
  );
};

// 病害预测时间轴组件
const DiseasePredictionTimeline = ({
  predictions,
}: {
  predictions: DiseasePrediction[];
  diseaseType: string;
}) => {
  return (
    <div className="bg-[rgba(15,20,40,0.6)] rounded-xl p-4 border border-blue-500/25">
      <h4 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        AI病害发展预测
      </h4>
      <div className="space-y-3">
        {predictions.map((pred, index) => (
          <div key={pred.year} className="relative">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  pred.severityProgression > 80 ? 'bg-red-500' :
                  pred.severityProgression > 60 ? 'bg-orange-500' :
                  pred.severityProgression > 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                {index < predictions.length - 1 && (
                  <div className="w-0.5 h-full bg-indigo-500/20 my-1" />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{pred.year}年后</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    pred.maintenanceUrgency === '紧急' ? 'bg-red-500/20 text-red-400' :
                    pred.maintenanceUrgency === '高' ? 'bg-orange-500/20 text-orange-400' :
                    pred.maintenanceUrgency === '中' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    紧急度: {pred.maintenanceUrgency}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">
                    恶化程度: <span className="text-white">{pred.severityProgression}%</span>
                  </div>
                  <div className="text-slate-400">
                    安全评分: <span className={pred.structuralSafetyScore < 50 ? 'text-red-400' : 'text-white'}>
                      {pred.structuralSafetyScore}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mt-1">{pred.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主组件
export const DiseaseHeatmap3D: React.FC<DiseaseHeatmap3DProps> = ({
  category,
  diseases,
  onHotspotClick
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<ComponentDiseaseHotspot | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  // View mode state reserved for future use

  // 获取当前建筑类型的病害热点
  const hotspots = useMemo(() => {
    const baseHotspots = CATEGORY_DISEASE_MAPPINGS[category] || [];
    // 将实际病害与热点关联
    return baseHotspots.map(hotspot => {
      const relatedDiseases = diseases.filter(d => 
        d.componentType === hotspot.componentType
      );
      return {
        ...hotspot,
        diseases: relatedDiseases,
        heatValue: relatedDiseases.length > 0 
          ? Math.max(...relatedDiseases.map(d => 
              d.severity === '严重' ? 0.9 : d.severity === '中度' ? 0.6 : 0.3
            ))
          : hotspot.heatValue * 0.3 // 没有病害时显示潜在风险
      };
    });
  }, [category, diseases]);

  // 生成预测数据
  const predictions = useMemo(() => {
    if (!selectedHotspot || selectedHotspot.diseases.length === 0) return null;
    const mostSevereDisease = selectedHotspot.diseases.reduce((prev, current) => {
      const severityScore = { '严重': 3, '中度': 2, '轻微': 1 };
      return severityScore[prev.severity] > severityScore[current.severity] ? prev : current;
    });
    return generateDiseasePredictions(mostSevereDisease.severity, mostSevereDisease.type);
  }, [selectedHotspot]);

  const handleHotspotClick = (hotspot: ComponentDiseaseHotspot) => {
    setSelectedHotspot(hotspot);
    setShowPrediction(true);
    const mainDisease = hotspot.diseases.length > 0 ? hotspot.diseases[0] : null;
    onHotspotClick?.(hotspot, mainDisease);
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D场景 */}
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* 根据建筑类型显示对应模型 */}
        <group>
          {category === '皇宫' && <PalaceModel mode="overview" />}
          {category === '官府' && <GovernmentModel mode="overview" />}
          {category === '民居' && <ResidenceModel mode="overview" />}
          {category === '桥梁' && <BridgeModel mode="overview" />}
          {!['皇宫', '官府', '民居', '桥梁'].includes(category) && <GenericModel mode="overview" />}
        </group>

        {/* 热力图球体 */}
        {hotspots.map((hotspot, index) => (
          <HeatmapSphere
            key={`${hotspot.componentType}-${index}`}
            position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}
            radius={0.3 + hotspot.heatValue * 0.2}
            heatValue={hotspot.heatValue}
            isSelected={selectedHotspot?.componentName === hotspot.componentName}
            onClick={() => handleHotspotClick(hotspot)}
            diseaseCount={hotspot.diseases.length}
          />
        ))}
      </Canvas>

      {/* 图例 */}
      <div className="absolute top-4 left-4 bg-[rgba(15,20,40,0.6)] rounded-lg p-3 border border-blue-500/25">
        <h4 className="text-blue-400 text-sm font-medium mb-2">病害热力图</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">严重 (&gt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">中度 (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-slate-400">轻微 (&lt;40%)</span>
          </div>
        </div>
      </div>

      {/* 详情面板 */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto"
          >
            <div className="bg-[#0c1220]/98 backdrop-blur-xl rounded-xl border border-indigo-500/25 overflow-hidden shadow-xl">
              {/* 头部 */}
              <div className="p-4 border-b border-indigo-500/15">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-blue-300">
                    {selectedHotspot.componentName}
                  </h3>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  风险等级: {selectedHotspot.heatValue > 0.7 ? '高' : selectedHotspot.heatValue > 0.4 ? '中' : '低'}
                </p>
              </div>

              {/* 病害列表 */}
              <div className="p-4 space-y-3">
                {selectedHotspot.diseases.length > 0 ? (
                  selectedHotspot.diseases.map((disease) => (
                    <div
                      key={disease.id}
                      className="bg-white/5 rounded-lg p-3 border-l-4 border-red-500"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          disease.severity === '严重' ? 'text-red-400' :
                          disease.severity === '中度' ? 'text-blue-400' : 'text-yellow-400'
                        }`} />
                        <span className="text-white font-medium">{disease.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          disease.severity === '严重' ? 'bg-red-500/20 text-red-400' :
                          disease.severity === '中度' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {disease.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{disease.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {disease.urgency}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {disease.estimatedCost}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-400 text-sm">暂无检测到病害，但存在以下典型风险：</p>
                    <ul className="mt-2 space-y-1">
                      {selectedHotspot.typicalDiseases.map((disease, idx) => (
                        <li key={idx} className="text-slate-300 text-sm flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-blue-400" />
                          {disease}
                        </li>
                      ))}
                    </ul>
                    <p className="text-blue-300 text-xs mt-3">
                      预防建议: {selectedHotspot.preventionTips}
                    </p>
                  </div>
                )}
              </div>

              {/* AI预测切换 */}
              {predictions && (
                <div className="border-t border-indigo-500/15">
                  <button
                    onClick={() => setShowPrediction(!showPrediction)}
                    className="w-full p-3 flex items-center justify-between text-blue-300 hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      查看AI恶化预测
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showPrediction ? 'rotate-90' : ''}`} />
                  </button>
                  {showPrediction && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <DiseasePredictionTimeline
                          predictions={predictions}
                          diseaseType={selectedHotspot.diseases[0]?.type || '病害'}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseHeatmap3D;
