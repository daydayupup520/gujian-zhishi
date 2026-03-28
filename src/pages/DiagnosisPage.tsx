import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, ArrowLeft, AlertTriangle, Activity, MapPin, ChevronRight, Shield } from 'lucide-react';
import { BuildingDiagnosisSection } from '../components/BuildingDiagnosisSection';
import { DiseaseHeatmap3D } from '../components/DiseaseHeatmap3D';
import ProtectionStrategySandbox from '../components/ProtectionStrategySandbox';
import { CATEGORY_DISEASE_MAPPINGS } from '../types/disease3d';
import { useAppContext } from '../contexts/useAppContext';
import type { Disease3DMapping, ComponentDiseaseHotspot } from '../types/disease3d';

export default function DiagnosisPage() {
  const { recognitionResult: result } = useAppContext();
  const [selectedHotspot, setSelectedHotspot] = useState<ComponentDiseaseHotspot | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'heatmap' | 'strategy'>('list');

  const disease3DMappings: Disease3DMapping[] = useMemo(() => {
    if (!result) return [];

    const hotspots = CATEGORY_DISEASE_MAPPINGS[result.category] || [];
    return hotspots.flatMap((hotspot, index) => {
      const severity = index % 3 === 0 ? '严重' : index % 3 === 1 ? '中度' : '轻微';
      return [{
        id: `disease-${index}`,
        diseaseId: `disease-${index}`,
        type: (hotspot.typicalDiseases[0] as Disease3DMapping['type']) || '裂缝',
        severity: severity as Disease3DMapping['severity'],
        position: hotspot.position,
        radius: severity === '严重' ? 0.5 : severity === '中度' ? 0.35 : 0.2,
        componentName: hotspot.componentName,
        componentType: hotspot.componentType as Disease3DMapping['componentType'],
        description: `${hotspot.componentName}出现${hotspot.typicalDiseases[0]}，需要及时处理`,
        recommendation: '建议委托专业文保单位进行修缮',
        estimatedCost: severity === '严重' ? '5-8万元' : severity === '中度' ? '2-3万元' : '0.5-1万元',
        urgency: (severity === '严重' ? '立即处理' : severity === '中度' ? '近期处理' : '定期监测') as Disease3DMapping['urgency']
      }];
    });
  }, [result]);

  const diseaseSeverity = useMemo(() => {
    if (!disease3DMappings.length) return '中度';
    const severeCount = disease3DMappings.filter(d => d.severity === '严重').length;
    const moderateCount = disease3DMappings.filter(d => d.severity === '中度').length;
    if (severeCount > 0) return '严重';
    if (moderateCount > 0) return '中度';
    return '轻微';
  }, [disease3DMappings]);

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                返回首页
              </Link>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">智能病害诊断</h1>
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-3">
                <span className="text-slate-400">当前建筑:</span>
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-300 rounded-full font-medium border border-blue-500/20">{result.name}</span>
                <span className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-full text-sm border border-indigo-500/10">{result.category}</span>
              </div>
            )}
          </motion.div>

        {!result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Stethoscope className="w-20 h-20 text-slate-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">请先识别建筑</h2>
            <p className="text-slate-400 mb-8">需要先上传建筑图片进行识别，才能查看病害诊断</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full hover:scale-105 transition-transform">
              前往识别
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
              <button type="button" onClick={() => setViewMode('list')} className={`premium-btn flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:shadow-md'}`}>
                <Activity className="w-4 h-4" /> 列表视图
              </button>
              <button type="button" onClick={() => setViewMode('heatmap')} className={`premium-btn flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${viewMode === 'heatmap' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:shadow-md'}`}>
                <MapPin className="w-4 h-4" /> 3D热力图
              </button>
              <button type="button" onClick={() => setViewMode('strategy')} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${viewMode === 'strategy' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:shadow-md'}`}>
                <Shield className="w-4 h-4" /> 保护策略
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {viewMode === 'list' && (
                <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <BuildingDiagnosisSection result={result} />
                </motion.div>
              )}

              {viewMode === 'heatmap' && (
                <motion.div key="heatmap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-[600px] bg-[rgba(15,20,40,0.5)] rounded-2xl border border-indigo-500/10 overflow-hidden">
                    <DiseaseHeatmap3D category={result.category} diseases={disease3DMappings} onHotspotClick={(hotspot) => setSelectedHotspot(hotspot)} />
                  </div>
                  <div className="bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-blue-400" /> 构件详情
                    </h3>
                    {selectedHotspot ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                          <h4 className="text-xl font-bold text-blue-300 mb-2">{selectedHotspot.componentName}</h4>
                          <p className="text-slate-400 text-sm">{selectedHotspot.componentType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-2">典型病害</p>
                          <div className="space-y-2">
                            {selectedHotspot.typicalDiseases.map((disease) => (
                              <div key={disease} className="flex items-center gap-2 text-slate-300">
                                <ChevronRight className="w-4 h-4 text-rose-400" />{disease}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-sm text-blue-300 mb-1">预防建议</p>
                          <p className="text-slate-400 text-sm">{selectedHotspot.preventionTips}</p>
                        </div>
                        <button type="button" onClick={() => setSelectedHotspot(null)} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-indigo-500/10 hover:shadow-md">关闭详情</button>
                      </motion.div>
                    ) : (
                      <div className="text-center py-10 text-slate-400">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>点击3D模型上的热力球<br />查看构件详情</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {viewMode === 'strategy' && (
                <motion.div key="strategy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <ProtectionStrategySandbox result={result} diseaseSeverity={diseaseSeverity} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
