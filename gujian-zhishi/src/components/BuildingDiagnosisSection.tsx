import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Download, MapPin, Stethoscope, FileText, Box, Activity } from 'lucide-react';
import type { RecognitionResult } from '../types/ai';
import type { Disease3DMapping } from '../types/disease3d';
import { DiseaseHeatmap3D } from './DiseaseHeatmap3D';

interface DiseaseItem {
  id: string;
  type: '裂缝' | '腐蚀' | '风化' | '剥落' | '虫蛀' | '变形';
  severity: '轻微' | '中度' | '严重';
  position: string;
  description: string;
  recommendation: string;
  estimatedCost: string;
  urgency: '立即处理' | '近期处理' | '定期监测';
}

interface BuildingDiagnosisProps {
  result: RecognitionResult | null;
}

const DISEASE_DATABASE: Record<RecognitionResult['category'], DiseaseItem[]> = {
  皇宫: [
    {
      id: 'd1',
      type: '裂缝',
      severity: '中度',
      position: '墙体基部',
      description: '东西向贯穿裂缝，长度约1.2米，宽度3-5mm',
      recommendation: '清理裂缝后注入环氧树脂，表面做压力灌浆处理',
      estimatedCost: '2-3万元',
      urgency: '近期处理',
    },
    {
      id: 'd2',
      type: '风化',
      severity: '轻微',
      position: '台基石材',
      description: '石材表面出现粉化现象，局部有剥落',
      recommendation: '表面清洗后喷涂石材防护剂，定期监测',
      estimatedCost: '0.5-1万元',
      urgency: '定期监测',
    },
  ],
  官府: [
    {
      id: 'd3',
      type: '腐蚀',
      severity: '中度',
      position: '木柱根部',
      description: '柱根受潮腐蚀，直径减小约8%',
      recommendation: '更换腐烂部分，做防腐处理，改善排水',
      estimatedCost: '1.5-2万元',
      urgency: '近期处理',
    },
  ],
  民居: [
    {
      id: 'd4',
      type: '剥落',
      severity: '严重',
      position: '墙面抹灰',
      description: '大面积抹灰层空鼓剥落，露出内部夯土',
      recommendation: '铲除空鼓部分，重新抹灰，加设防潮层',
      estimatedCost: '3-5万元',
      urgency: '立即处理',
    },
    {
      id: 'd5',
      type: '虫蛀',
      severity: '中度',
      position: '木梁架',
      description: '发现白蚁蛀蚀痕迹，局部有蛀洞',
      recommendation: '全面杀虫处理，更换蛀损构件，建立防虫体系',
      estimatedCost: '2-4万元',
      urgency: '近期处理',
    },
  ],
  桥梁: [
    {
      id: 'd6',
      type: '变形',
      severity: '中度',
      position: '拱圈',
      description: '拱圈出现轻微下沉，跨中挠度约15mm',
      recommendation: '结构加固，增设支撑，限制载重',
      estimatedCost: '8-12万元',
      urgency: '近期处理',
    },
  ],
  其他: [
    {
      id: 'd7',
      type: '风化',
      severity: '轻微',
      position: '屋面',
      description: '瓦片局部风化，有松动现象',
      recommendation: '更换破损瓦片，整体检修屋面',
      estimatedCost: '1-2万元',
      urgency: '定期监测',
    },
  ],
};

const generateMockDiseases = (result: RecognitionResult): DiseaseItem[] => {
  const base = DISEASE_DATABASE[result.category] || DISEASE_DATABASE['其他'];
  const confidenceFactor = result.confidence;
  
  return base.map((item, index) => ({
    ...item,
    id: `${item.id}-${Date.now()}-${index}`,
    severity: confidenceFactor > 0.85 
      ? item.severity 
      : confidenceFactor > 0.7 
        ? (item.severity === '严重' ? '中度' : item.severity)
        : '轻微',
  }));
};

export const BuildingDiagnosisSection: React.FC<BuildingDiagnosisProps> = ({ result }) => {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'heatmap'>('list');

  const diseases = useMemo(() => {
    if (!result) {
      return [];
    }
    return generateMockDiseases(result);
  }, [result]);

  const stats = useMemo(() => {
    const total = diseases.length;
    const severe = diseases.filter((d) => d.severity === '严重').length;
    const immediate = diseases.filter((d) => d.urgency === '立即处理').length;
    const totalCost = diseases.reduce((sum, d) => {
      const match = d.estimatedCost.match(/(\d+(?:-\d+)?)/);
      if (match) {
        const range = match[1].split('-');
        const avg = range.length > 1 
          ? (parseInt(range[0]) + parseInt(range[1])) / 2 
          : parseInt(range[0]);
        return sum + avg;
      }
      return sum;
    }, 0);

    return { total, severe, immediate, totalCost };
  }, [diseases]);

  const selectedDisease = useMemo(
    () => diseases.find((d) => d.id === selectedDiseaseId) || null,
    [diseases, selectedDiseaseId]
  );

  // 将病害转换为3D映射格式
  const disease3DMappings: Disease3DMapping[] = useMemo(() => {
    return diseases.map((disease) => {
      const position = disease.position;
      let componentType: Disease3DMapping['componentType'] = 'wall';
      
      if (position.includes('柱') || position.includes('柱根')) {
        componentType = 'column';
      } else if (position.includes('梁') || position.includes('架')) {
        componentType = 'beam';
      } else if (position.includes('屋顶') || position.includes('屋面') || position.includes('屋檐')) {
        componentType = 'roof';
      } else if (position.includes('台基') || position.includes('基础')) {
        componentType = 'foundation';
      } else if (position.includes('拱') || position.includes('圈')) {
        componentType = 'bridge_arch';
      } else if (position.includes('墩') || position.includes('台')) {
        componentType = 'bridge_pier';
      } else if (position.includes('彩画') || position.includes('装饰')) {
        componentType = 'decoration';
      }
      
      const position3D = {
        column: { x: -1.5, y: -0.5, z: 1.0 },
        beam: { x: 0, y: 0.5, z: 0 },
        wall: { x: 2.0, y: 0, z: 0 },
        roof: { x: 0, y: 2.0, z: 0 },
        foundation: { x: 0, y: -2.0, z: 0 },
        bridge_arch: { x: 0, y: -0.5, z: 0 },
        bridge_pier: { x: -1.5, y: -1.5, z: 0 },
        decoration: { x: 0, y: 1.5, z: 1.5 }
      }[componentType] || { x: 0, y: 0, z: 0 };
      
      return {
        id: disease.id,
        diseaseId: disease.id,
        type: disease.type,
        severity: disease.severity,
        position: position3D,
        radius: disease.severity === '严重' ? 0.5 : disease.severity === '中度' ? 0.35 : 0.2,
        componentName: position,
        componentType,
        description: disease.description,
        recommendation: disease.recommendation,
        estimatedCost: disease.estimatedCost,
        urgency: disease.urgency
      };
    });
  }, [diseases]);

  const exportDiagnosisReport = () => {
    if (!result || diseases.length === 0) {
      return;
    }

    const lines = [
      '# 古建筑病害巡查报告',
      '',
      '## 基本信息',
      `- 建筑名称: ${result.name}`,
      `- 建筑类型: ${result.category}`,
      `- 建筑年代: ${result.era}`,
      `- 所在位置: ${result.location}`,
      `- 巡查日期: ${new Date().toLocaleDateString('zh-CN')}`,
      '',
      '## 病害统计',
      `- 病害总数: ${stats.total} 处`,
      `- 严重病害: ${stats.severe} 处`,
      `- 需立即处理: ${stats.immediate} 处`,
      `- 预估修缮费用: ${stats.totalCost.toFixed(1)} 万元`,
      '',
      '## 病害详情',
      ...diseases.map((disease, index) => [
        `### ${index + 1}. ${disease.type} (${disease.severity})`,
        `- 位置: ${disease.position}`,
        `- 描述: ${disease.description}`,
        `- 处理建议: ${disease.recommendation}`,
        `- 预估费用: ${disease.estimatedCost}`,
        `- 紧急程度: ${disease.urgency}`,
        '',
      ]).flat(),
      '## 处理优先级建议',
      '1. **立即处理**: 影响结构安全或可能快速恶化的病害',
      '2. **近期处理**: 中度病害，应在3-6个月内安排修缮',
      '3. **定期监测**: 轻微病害，纳入日常巡检体系',
      '',
      '## 后续工作建议',
      '- 委托具有相应资质的文物保护工程施工单位',
      '- 修缮前编制详细的修缮设计方案',
      '- 施工过程做好影像记录和档案留存',
      '- 完工后组织验收并更新建筑健康档案',
      '',
      '---',
      '本报告由古建智识系统自动生成，仅供参考。',
      `生成时间: ${new Date().toLocaleString('zh-CN')}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${result.name}-病害巡查报告.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!result) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 rounded-2xl border border-indigo-500/10 premium-shell p-6 md:p-8"
      >
        <div className="text-center py-8">
          <Stethoscope className="mx-auto h-10 w-10 text-slate-500" />
          <p className="mt-3 text-slate-400">请先上传建筑图片进行识别</p>
          <p className="text-sm text-slate-500">识别后可查看智能病害诊断结果</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-indigo-500/10 premium-shell p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1 text-xs text-rose-200">
            <Stethoscope className="h-3.5 w-3.5" />
            智能病害诊断
          </span>
          <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">建筑健康检测与修缮建议</h3>
          <p className="mt-2 text-sm text-slate-400">
            基于建筑类型和年代特征，生成典型病害清单与专业修缮方案
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'list' ? 'heatmap' : 'list')}
            className="premium-btn inline-flex items-center gap-2 rounded-lg border border-[#2C2416]/20 bg-white/5 px-4 py-2 text-sm text-slate-400 hover:bg-white/10/95"
          >
            {viewMode === 'list' ? <Box className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
            {viewMode === 'list' ? '3D热力图' : '列表视图'}
          </button>
          <button
            type="button"
            onClick={() => setShowReport(!showReport)}
            className="premium-btn inline-flex items-center gap-2 rounded-lg border border-[#2C2416]/20 bg-white/5 px-4 py-2 text-sm text-slate-400 hover:bg-white/10/95"
          >
            <FileText className="h-4 w-4" />
            {showReport ? '查看病害列表' : '查看诊断报告'}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
          <p className="text-[11px] text-slate-400">发现病害</p>
          <p className="mt-1 text-lg font-semibold text-white">{stats.total} 处</p>
        </div>
        <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
          <p className="text-[11px] text-slate-400">严重等级</p>
          <p className="mt-1 text-lg font-semibold text-rose-300">{stats.severe} 处</p>
        </div>
        <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
          <p className="text-[11px] text-slate-400">需立即处理</p>
          <p className="mt-1 text-lg font-semibold text-blue-300">{stats.immediate} 处</p>
        </div>
        <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
          <p className="text-[11px] text-slate-400">预估费用</p>
          <p className="mt-1 text-lg font-semibold text-emerald-300">{stats.totalCost.toFixed(1)} 万</p>
        </div>
      </div>

      {!showReport ? (
        viewMode === 'heatmap' ? (
          <div className="mt-6 h-[500px] rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] overflow-hidden">
            <DiseaseHeatmap3D
              category={result?.category || '其他'}
              diseases={disease3DMappings}
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
            <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
              <h4 className="text-sm font-semibold text-white">病害列表</h4>
              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
                {diseases.map((disease) => (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => setSelectedDiseaseId(disease.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                      selectedDiseaseId === disease.id
                        ? 'border-rose-300/50 bg-rose-500/10'
                        : 'border-indigo-500/10 bg-white/5 hover:bg-white/10/95'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white">{disease.type}</p>
                        <p className="text-xs text-slate-400">{disease.position}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          disease.severity === '严重'
                            ? 'bg-rose-500/15 text-rose-200 border border-rose-400/30'
                            : disease.severity === '中度'
                              ? 'bg-amber-500/15 text-amber-200 border border-amber-400/30'
                              : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30'
                        }`}
                      >
                        {disease.severity}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`text-[11px] ${
                          disease.urgency === '立即处理'
                            ? 'text-rose-300'
                            : disease.urgency === '近期处理'
                              ? 'text-blue-300'
                              : 'text-emerald-300'
                        }`}
                      >
                        {disease.urgency}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
              {selectedDisease ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{selectedDisease.type}</h4>
                      <p className="text-sm text-slate-400">
                        <MapPin className="inline h-3.5 w-3.5 mr-1" />
                        {selectedDisease.position}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        selectedDisease.severity === '严重'
                          ? 'bg-rose-500/15 text-rose-200 border border-rose-400/30'
                          : selectedDisease.severity === '中度'
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-400/30'
                            : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30'
                      }`}
                    >
                      {selectedDisease.severity}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-indigo-500/10 bg-white/5 p-3">
                      <p className="text-xs text-slate-400">病害描述</p>
                      <p className="mt-1 text-sm text-gray-200">{selectedDisease.description}</p>
                    </div>

                    <div className="rounded-lg border border-amber-400/20 bg-blue-500/5 p-3">
                      <p className="text-xs text-amber-200/80">修缮建议</p>
                      <p className="mt-1 text-sm text-gray-200">{selectedDisease.recommendation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-indigo-500/10 bg-white/5 p-3">
                        <p className="text-xs text-slate-400">预估费用</p>
                        <p className="mt-1 text-sm font-medium text-emerald-300">{selectedDisease.estimatedCost}</p>
                      </div>
                      <div className="rounded-lg border border-indigo-500/10 bg-white/5 p-3">
                        <p className="text-xs text-slate-400">建议工期</p>
                        <p className="mt-1 text-sm font-medium text-cyan-300">
                          {selectedDisease.urgency === '立即处理'
                            ? '1-2周'
                            : selectedDisease.urgency === '近期处理'
                              ? '1-2月'
                              : '3-6月'}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-lg border p-3 ${
                        selectedDisease.urgency === '立即处理'
                          ? 'border-rose-400/30 bg-rose-500/10'
                          : selectedDisease.urgency === '近期处理'
                            ? 'border-amber-400/30 bg-blue-500/10'
                            : 'border-emerald-400/30 bg-emerald-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedDisease.urgency === '立即处理' ? (
                          <AlertTriangle className="h-4 w-4 text-rose-400" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            selectedDisease.urgency === '立即处理'
                              ? 'text-rose-200'
                              : selectedDisease.urgency === '近期处理'
                                ? 'text-amber-200'
                                : 'text-emerald-200'
                          }`}
                        >
                          {selectedDisease.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Stethoscope className="h-10 w-10 text-gray-600" />
                  <p className="mt-2 text-sm text-slate-400">点击左侧病害查看详细诊断</p>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="mt-6 rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-5">
          <h4 className="text-lg font-semibold text-white mb-4">病害诊断报告</h4>

          <div className="space-y-4">
            <div className="rounded-lg border border-indigo-500/10 bg-white/5 p-4">
              <h5 className="text-sm font-medium text-white mb-2">建筑概况</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-slate-400">名称: <span className="text-gray-200">{result.name}</span></p>
                <p className="text-slate-400">类型: <span className="text-gray-200">{result.category}</span></p>
                <p className="text-slate-400">年代: <span className="text-gray-200">{result.era}</span></p>
                <p className="text-slate-400">位置: <span className="text-gray-200">{result.location}</span></p>
              </div>
            </div>

            <div className="rounded-lg border border-indigo-500/10 bg-white/5 p-4">
              <h5 className="text-sm font-medium text-white mb-2">病害汇总</h5>
              <p className="text-sm text-slate-400 leading-relaxed">
                本次巡查共发现 <span className="text-blue-300 font-medium">{stats.total} 处</span> 病害，
                其中 <span className="text-rose-300 font-medium">{stats.severe} 处</span> 为严重等级，
                <span className="text-rose-300 font-medium"> {stats.immediate} 处</span> 需要立即处理。
                预估修缮总费用约 <span className="text-emerald-300 font-medium">{stats.totalCost.toFixed(1)} 万元</span>。
              </p>
            </div>

            <div className="rounded-lg border border-amber-400/20 bg-blue-500/5 p-4">
              <h5 className="text-sm font-medium text-amber-200 mb-2">处理建议</h5>
              <ol className="space-y-1.5 text-sm text-slate-400 list-decimal list-inside">
                <li>优先处理影响结构安全的严重病害</li>
                <li>中度病害应在巡查后3个月内安排修缮</li>
                <li>建立定期巡检机制，监测轻微病害发展</li>
                <li>委托具有相应资质的文保工程施工</li>
                <li>修缮过程做好影像记录和档案留存</li>
              </ol>
            </div>
          </div>

          <button
            type="button"
            onClick={exportDiagnosisReport}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/25"
          >
            <Download className="h-4 w-4" />
            导出完整报告
          </button>
        </div>
      )}
    </motion.section>
  );
};
