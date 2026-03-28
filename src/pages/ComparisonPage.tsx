import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, GitCompare, Building2, AlertTriangle, Clock,
  TrendingUp, TrendingDown, Minus, FileText, Download,
  Activity, Shield, AlertCircle, CheckCircle2, BarChart3,
  Calendar, History,
} from 'lucide-react';
import { useRecognitionHistory } from '../hooks/useDatabase';
import { diseaseRecordsDB } from '../lib/db';
import type { DiseaseRecord } from '../lib/db';
import { DiseaseCard } from '../components/DiseaseCard';
import { TimelinePoint } from '../components/TimelinePoint';

import {
  calculateDiseaseSimilarity,
  generateTimelineComparison,
  generateComparisonReport,
  type DiseaseComparisonReport,
} from '../types/diseaseComparison';

interface BuildingInfo {
  id: string;
  name: string;
  category: string;
  era: string;
  location: string;
}

type ComparisonMode = 'temporal' | 'spatial';

// 固定的演示建筑列表
const DEMO_BUILDINGS: BuildingInfo[] = [
  { id: 'demo-taihe', name: '故宫太和殿', category: '皇宫', era: '明', location: '北京' },
  { id: 'demo-yamen', name: '内乡县衙', category: '官府', era: '清', location: '河南' },
  { id: 'demo-tulou', name: '承启楼', category: '民居', era: '清', location: '福建' },
];

function useBuildingList() {
  const { history } = useRecognitionHistory();
  return useMemo(() => {
    const fromHistory: BuildingInfo[] = history.map(item => ({
      id: `building-${item.id}`,
      name: item.result.name,
      category: item.result.category,
      era: item.result.era,
      location: item.result.location,
    }));
    // 去重
    const seen = new Set<string>();
    const unique = fromHistory.filter(b => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    });
    return [...DEMO_BUILDINGS, ...unique];
  }, [history]);
}

function getDemoDiseaseRecords(buildingId: string): DiseaseRecord[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const data: Record<string, DiseaseRecord[]> = {
    'demo-taihe': [
      { id: 1, buildingId: 'demo-taihe', buildingName: '故宫太和殿', diseaseType: '裂缝', severity: '中度', position: '墙体基部', description: '东西向贯穿裂缝，长约1.2米，宽3-5mm', recommendation: '注入环氧树脂，表面压力灌浆', estimatedCost: '2-3万元', urgency: '近期处理', recordedAt: now - 30 * day, status: 'pending' },
      { id: 2, buildingId: 'demo-taihe', buildingName: '故宫太和殿', diseaseType: '风化', severity: '轻微', position: '台基石材', description: '石材表面粉化，局部剥落', recommendation: '清洗后喷涂防护剂', estimatedCost: '0.5-1万元', urgency: '定期监测', recordedAt: now - 30 * day, status: 'pending' },
      { id: 3, buildingId: 'demo-taihe', buildingName: '故宫太和殿', diseaseType: '裂缝', severity: '严重', position: '墙体基部', description: '裂缝扩展至1.8米，宽8-10mm', recommendation: '紧急加固，钢筋网片+注浆', estimatedCost: '5-8万元', urgency: '立即处理', recordedAt: now - 5 * day, status: 'in_progress' },
    ],
    'demo-yamen': [
      { id: 4, buildingId: 'demo-yamen', buildingName: '内乡县衙', diseaseType: '腐蚀', severity: '中度', position: '木柱根部', description: '柱根受潮腐蚀，直径减小约8%', recommendation: '更换腐烂部分，做防腐处理', estimatedCost: '1.5-2万元', urgency: '近期处理', recordedAt: now - 15 * day, status: 'pending' },
      { id: 5, buildingId: 'demo-yamen', buildingName: '内乡县衙', diseaseType: '虫蛀', severity: '轻微', position: '木梁架', description: '白蚁蛀蚀痕迹，局部有蛀洞', recommendation: '全面杀虫，更换蛀损构件', estimatedCost: '1-2万元', urgency: '定期监测', recordedAt: now - 15 * day, status: 'pending' },
    ],
    'demo-tulou': [
      { id: 6, buildingId: 'demo-tulou', buildingName: '承启楼', diseaseType: '剥落', severity: '严重', position: '夯土墙面', description: '大面积抹灰层空鼓剥落，露出内部夯土', recommendation: '铲除空鼓部分，重新抹灰，加设防潮层', estimatedCost: '3-5万元', urgency: '立即处理', recordedAt: now - 10 * day, status: 'pending' },
      { id: 7, buildingId: 'demo-tulou', buildingName: '承启楼', diseaseType: '裂缝', severity: '中度', position: '夯土墙面', description: '墙面纵向裂缝，长度约3米', recommendation: '裂缝灌浆加固，监测发展情况', estimatedCost: '1-2万元', urgency: '近期处理', recordedAt: now - 10 * day, status: 'pending' },
    ],
  };
  return data[buildingId] ?? [];
}

async function loadDiseaseRecords(buildingId: string): Promise<DiseaseRecord[]> {
  if (buildingId.startsWith('demo-')) {
    return getDemoDiseaseRecords(buildingId);
  }
  const realId = buildingId.replace('building-', '');
  return diseaseRecordsDB.getByBuilding(realId);
}

function exportReport(report: DiseaseComparisonReport) {
  const lines = [
    '# 古建筑病害对比分析报告',
    `生成时间: ${new Date(report.metadata.generatedAt).toLocaleString('zh-CN')}`,
    '',
    '## 建筑信息',
    `建筑A: ${report.metadata.buildingA.name} (${report.metadata.buildingA.category})`,
    `建筑B: ${report.metadata.buildingB.name} (${report.metadata.buildingB.category})`,
    '',
    '## 关键发现',
    ...report.executiveSummary.keyFindings.map(f => `- ${f}`),
    '',
    '## 严重问题',
    ...(report.executiveSummary.criticalIssues.length > 0
      ? report.executiveSummary.criticalIssues.map(i => `- ⚠️ ${i}`)
      : ['- 未发现严重问题']),
    '',
    '## 建议措施',
    ...report.executiveSummary.recommendations.map(r => `- ${r}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `病害对比报告-${new Date().toISOString().slice(0, 10)}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// 对比结果数据结构（纯本地变量，不依赖 state）
interface ComparisonResult {
  buildingA: BuildingInfo;
  buildingB: BuildingInfo;
  diseasesA: DiseaseRecord[];
  diseasesB: DiseaseRecord[];
  report: DiseaseComparisonReport;
  mode: ComparisonMode;
}

export default function ComparisonPage() {
  const buildings = useBuildingList();
  const [mode, setMode] = useState<ComparisonMode>('spatial');
  const [buildingAId, setBuildingAId] = useState('');
  const [buildingBId, setBuildingBId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const canStart = mode === 'spatial'
    ? buildingAId !== '' && buildingBId !== '' && buildingAId !== buildingBId
    : buildingAId !== '';

  async function handleCompare() {
    const buildingA = buildings.find(b => b.id === buildingAId);
    const buildingB = buildings.find(b => b.id === buildingBId);
    if (!buildingA) return;

    setLoading(true);
    setResult(null);

    try {
      const diseasesA = await loadDiseaseRecords(buildingAId);
      const diseasesB = buildingBId ? await loadDiseaseRecords(buildingBId) : [];

      const effectiveB = buildingB ?? buildingA;
      const bRecords = mode === 'temporal' ? diseasesA : diseasesB;

      const report = generateComparisonReport(
        buildingA.id, buildingA.name, buildingA.category, diseasesA,
        effectiveB.id, effectiveB.name, effectiveB.category, bRecords,
        mode
      );

      setResult({ buildingA, buildingB: effectiveB, diseasesA, diseasesB: bRecords, report, mode });
      setActiveTab('overview');
    } finally {
      setLoading(false);
    }
  }

  // 时间轴数据
  const timelineData = useMemo(() => {
    if (!result || result.mode !== 'temporal') return [];
    return generateTimelineComparison(result.buildingA.id, result.diseasesA);
  }, [result]);

  // 相似度数据
  const similarityData = useMemo(() => {
    if (!result || result.mode !== 'spatial') return null;
    return calculateDiseaseSimilarity(result.diseasesA, result.diseasesB);
  }, [result]);

  return (
    <div className="min-h-screen pt-24 pb-20 page-container">
      <div className="premium-shell rounded-[30px] p-6 md:p-8">

        {/* 头部 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              返回首页
            </Link>
            <span className="text-slate-500">|</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">病害对比分析</h1>
                <p className="text-sm text-slate-400">基于AI识别的建筑病害智能对比</p>
              </div>
            </div>
          </div>
          {result && (
            <button type="button" onClick={() => exportReport(result.report)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
              <Download className="w-4 h-4" />导出报告
            </button>
          )}
        </motion.div>

        {/* 模式选择 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-2xl border border-indigo-500/10">
            <button type="button" onClick={() => { setMode('spatial'); setResult(null); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${mode === 'spatial' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              <GitCompare className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">建筑间对比</div>
                <div className="text-xs opacity-80">比较不同建筑的病害特征</div>
              </div>
            </button>
            <button type="button" onClick={() => { setMode('temporal'); setResult(null); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${mode === 'temporal' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              <Clock className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">时间轴对比</div>
                <div className="text-xs opacity-80">追踪同一建筑的病害变化</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* 建筑选择 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">{mode === 'spatial' ? '建筑 A' : '选择建筑'}</label>
              <select value={buildingAId} onChange={e => { setBuildingAId(e.target.value); setResult(null); }}
                style={{ colorScheme: 'dark' }}
                className="w-full p-3 bg-[#0d1426] border border-indigo-500/30 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                <option value="" className="bg-[#0d1426] text-slate-400">请选择建筑...</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="bg-[#0d1426] text-white">{b.name}（{b.category} · {b.era}）</option>
                ))}
              </select>
            </div>
            {mode === 'spatial' && (
              <div className="space-y-2">
                <label className="text-sm text-slate-300">建筑 B</label>
                <select value={buildingBId} onChange={e => { setBuildingBId(e.target.value); setResult(null); }}
                  style={{ colorScheme: 'dark' }}
                  className="w-full p-3 bg-[#0d1426] border border-indigo-500/30 rounded-xl text-white focus:border-blue-500 focus:outline-none">
                  <option value="" className="bg-[#0d1426] text-slate-400">请选择建筑...</option>
                  {buildings.filter(b => b.id !== buildingAId).map(b => (
                    <option key={b.id} value={b.id} className="bg-[#0d1426] text-white">{b.name}（{b.category} · {b.era}）</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* 开始按钮 */}
        {canStart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex justify-center">
            <button type="button" onClick={handleCompare} disabled={loading}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-2xl shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  正在分析...
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  开始对比分析
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* 提示：未选择建筑 */}
        {!canStart && !result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 rounded-2xl border border-indigo-500/10">
            <Building2 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {mode === 'spatial' ? '请选择两座建筑进行对比' : '请选择要分析的建筑'}
            </h3>
            <p className="text-slate-400 mb-4">
              {mode === 'spatial'
                ? '选择不同建筑的病害数据，进行相似度分析和经验借鉴'
                : '选择建筑后可查看其病害发展时间轴和趋势分析'}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{buildings.length} 个可用建筑</div>
              <div className="flex items-center gap-2"><History className="w-4 h-4" />支持识别历史数据</div>
            </div>
          </motion.div>
        )}

        {/* 对比结果 */}
        {result && (
          <motion.div key={result.buildingA.id + result.buildingB.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Tab 切换 */}
            <div className="flex flex-wrap gap-2 border-b border-indigo-500/10 pb-4">
              {[
                { key: 'overview', label: '概览', icon: BarChart3 },
                { key: 'diseases', label: '病害对比', icon: Activity },
                ...(result.mode === 'temporal' ? [{ key: 'timeline', label: '时间轴', icon: Clock }] : []),
                ...(result.mode === 'spatial' ? [{ key: 'similarity', label: '相似度分析', icon: GitCompare }] : []),
                { key: 'recommendations', label: '保护建议', icon: Shield },
              ].map(tab => (
                <button type="button" key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
                  <tab.icon className="w-4 h-4" />{tab.label}
                </button>
              ))}
            </div>

            {/* 概览 */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '病害总数', value: result.report.detailedComparison.diseaseCount.a + result.report.detailedComparison.diseaseCount.b, unit: '处', icon: Activity, color: 'text-white' },
                    { label: '严重病害', value: (result.report.detailedComparison.severityDistribution.a['严重'] || 0) + (result.report.detailedComparison.severityDistribution.b['严重'] || 0), unit: '处', icon: AlertTriangle, color: 'text-rose-400' },
                    { label: '需立即处理', value: result.diseasesA.filter(d => d.urgency === '立即处理').length + result.diseasesB.filter(d => d.urgency === '立即处理').length, unit: '处', icon: AlertCircle, color: 'text-amber-400' },
                    { label: '预估总费用', value: (result.report.detailedComparison.costAnalysis.a + result.report.detailedComparison.costAnalysis.b).toFixed(1), unit: '万元', icon: CheckCircle2, color: 'text-emerald-400' },
                  ].map(card => (
                    <div key={card.label} className="bg-white/5 rounded-2xl p-4 border border-indigo-500/10">
                      <div className={`flex items-center gap-2 text-sm mb-2 ${card.color === 'text-white' ? 'text-slate-400' : card.color}`}>
                        <card.icon className="w-4 h-4" />{card.label}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
                        <span className="text-sm text-slate-400">{card.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl p-6 border border-indigo-500/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />执行摘要
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">关键发现</h4>
                      <ul className="space-y-1">
                        {result.report.executiveSummary.keyFindings.map((f, i) => (
                          <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>{f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {result.report.executiveSummary.criticalIssues.length > 0 && (
                      <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                        <h4 className="text-sm font-medium text-rose-300 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />严重问题
                        </h4>
                        <ul className="space-y-1">
                          {result.report.executiveSummary.criticalIssues.map((issue, i) => (
                            <li key={i} className="text-sm text-rose-200 flex items-start gap-2">
                              <span className="mt-1">⚠️</span>{issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">建议措施</h4>
                      <ul className="space-y-1">
                        {result.report.executiveSummary.recommendations.map((r, i) => (
                          <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">→</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 病害对比 */}
            {activeTab === 'diseases' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{result.buildingA.name}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{result.diseasesA.length} 处病害</span>
                  </div>
                  <div className="space-y-3">
                    {result.diseasesA.map(d => <DiseaseCard key={d.id} disease={d} />)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{result.buildingB.name}</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">{result.diseasesB.length} 处病害</span>
                  </div>
                  <div className="space-y-3">
                    {result.diseasesB.map(d => <DiseaseCard key={d.id} disease={d} />)}
                  </div>
                </div>
              </div>
            )}

            {/* 时间轴 */}
            {activeTab === 'timeline' && result.mode === 'temporal' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <h3 className="text-lg font-bold text-white mb-6">病害发展时间轴</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500/30" />
                    <div className="space-y-6">
                      {timelineData.map((point, idx) => (
                        <TimelinePoint key={point.timestamp} point={point} index={idx} />
                      ))}
                    </div>
                  </div>
                </div>
                {result.report.timelineAnalysis && (
                  <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl p-6 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4">趋势分析</h3>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${result.report.timelineAnalysis.trend === 'improving' ? 'bg-emerald-500/20' : result.report.timelineAnalysis.trend === 'deteriorating' ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
                        {result.report.timelineAnalysis.trend === 'improving' ? <TrendingUp className="w-8 h-8 text-emerald-400" /> : result.report.timelineAnalysis.trend === 'deteriorating' ? <TrendingDown className="w-8 h-8 text-rose-400" /> : <Minus className="w-8 h-8 text-amber-400" />}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {result.report.timelineAnalysis.trend === 'improving' ? '状况改善' : result.report.timelineAnalysis.trend === 'deteriorating' ? '持续恶化' : '基本稳定'}
                        </div>
                        <div className="text-sm text-slate-400">恶化速率: {result.report.timelineAnalysis.deteriorationRate.toFixed(2)}/天</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 相似度分析 */}
            {activeTab === 'similarity' && result.mode === 'spatial' && similarityData && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">病害相似度分析</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">总体相似度</span>
                      <span className={`text-3xl font-bold ${similarityData.overallSimilarity >= 70 ? 'text-emerald-400' : similarityData.overallSimilarity >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {similarityData.overallSimilarity}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '类型相似度', value: similarityData.dimensions.typeSimilarity },
                      { label: '严重程度', value: similarityData.dimensions.severitySimilarity },
                      { label: '位置相似度', value: similarityData.dimensions.positionSimilarity },
                      { label: '紧急程度', value: similarityData.dimensions.urgencySimilarity },
                    ].map(dim => (
                      <div key={dim.label} className="bg-white/5 rounded-xl p-4">
                        <div className="text-sm text-slate-400 mb-2">{dim.label}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dim.value}%` }} />
                          </div>
                          <span className="text-sm font-medium text-white w-10">{dim.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {similarityData.commonDiseaseTypes.length > 0 && (
                  <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20">
                    <h4 className="text-sm font-medium text-emerald-300 mb-3">共同病害类型</h4>
                    <div className="flex flex-wrap gap-2">
                      {similarityData.commonDiseaseTypes.map(t => (
                        <span key={t} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
                  <h4 className="text-sm font-medium text-blue-300 mb-3">分析建议</h4>
                  <ul className="space-y-2">
                    {similarityData.recommendations.map((r, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 保护建议 */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {result.report.protectionSuggestions.map((s, idx) => (
                  <div key={idx} className={`bg-white/5 rounded-2xl p-6 border ${s.priority === 'high' ? 'border-rose-500/30' : s.priority === 'medium' ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : s.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {s.priority === 'high' ? '高优先级' : s.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      <h4 className="text-lg font-bold text-white">{s.title}</h4>
                    </div>
                    <p className="text-slate-400 mb-4">{s.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {s.estimatedCost && <div className="text-emerald-400">预估费用: <span className="font-medium">{s.estimatedCost}</span></div>}
                      {s.timeline && <div className="flex items-center gap-1 text-blue-400"><Calendar className="w-4 h-4" />{s.timeline}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
