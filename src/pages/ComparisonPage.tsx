import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, GitCompare, Building2, AlertTriangle, Clock,
  TrendingUp, TrendingDown, Minus, FileText, Download,
  Activity, Shield, AlertCircle, CheckCircle2, BarChart3,
  Calendar, MapPin, History, Search
} from 'lucide-react';
import { useRecognitionHistory } from '../hooks/useDatabase';
import { diseaseRecordsDB } from '../lib/db';
import type { DiseaseRecord } from '../lib/db';

import {
  calculateDiseaseSimilarity,
  generateTimelineComparison,
  generateComparisonReport,
  type TimelineComparisonPoint,
  type DiseaseComparisonReport,
} from '../types/diseaseComparison';

// 建筑基础信息（用于展示）
interface BuildingInfo {
  id: string;
  name: string;
  category: string;
  era: string;
  location: string;
}

// 对比模式
type ComparisonMode = 'temporal' | 'spatial';

// 从识别历史获取建筑列表
function useBuildingList() {
  const { history } = useRecognitionHistory();
  
  return useMemo(() => {
    const buildings = new Map<string, BuildingInfo>();
    
    history.forEach(item => {
      const buildingId = `building-${item.id}`;
      if (!buildings.has(buildingId)) {
        buildings.set(buildingId, {
          id: buildingId,
          name: item.result.name,
          category: item.result.category,
          era: item.result.era,
          location: item.result.location,
        });
      }
    });
    
    // 添加示例建筑
    buildings.set('demo-taihe', {
      id: 'demo-taihe',
      name: '故宫太和殿',
      category: '皇宫',
      era: '明',
      location: '北京',
    });
    buildings.set('demo-yamen', {
      id: 'demo-yamen',
      name: '内乡县衙',
      category: '官府',
      era: '清',
      location: '河南',
    });
    buildings.set('demo-tulou', {
      id: 'demo-tulou',
      name: '承启楼',
      category: '民居',
      era: '清',
      location: '福建',
    });
    
    return Array.from(buildings.values());
  }, [history]);
}

// 获取建筑的所有病害记录（模拟数据）
async function getBuildingDiseaseRecords(buildingId: string): Promise<DiseaseRecord[]> {
  // 如果是真实建筑ID，从数据库获取
  if (!buildingId.startsWith('demo-')) {
    const realId = buildingId.replace('building-', '');
    return await diseaseRecordsDB.getByBuilding(realId);
  }
  
  // 返回演示数据
  return generateDemoDiseaseRecords(buildingId);
}

// 生成演示病害数据
function generateDemoDiseaseRecords(buildingId: string): DiseaseRecord[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  const demoData: Record<string, DiseaseRecord[]> = {
    'demo-taihe': [
      {
        id: 1,
        buildingId: 'demo-taihe',
        buildingName: '故宫太和殿',
        diseaseType: '裂缝',
        severity: '中度',
        position: '墙体基部',
        description: '东西向贯穿裂缝，长度约1.2米，宽度3-5mm',
        recommendation: '清理裂缝后注入环氧树脂，表面做压力灌浆处理',
        estimatedCost: '2-3万元',
        urgency: '近期处理',
        recordedAt: now - 30 * day,
        status: 'pending',
      },
      {
        id: 2,
        buildingId: 'demo-taihe',
        buildingName: '故宫太和殿',
        diseaseType: '风化',
        severity: '轻微',
        position: '台基石材',
        description: '石材表面出现粉化现象，局部有剥落',
        recommendation: '表面清洗后喷涂石材防护剂，定期监测',
        estimatedCost: '0.5-1万元',
        urgency: '定期监测',
        recordedAt: now - 30 * day,
        status: 'pending',
      },
      {
        id: 3,
        buildingId: 'demo-taihe',
        buildingName: '故宫太和殿',
        diseaseType: '裂缝',
        severity: '严重',
        position: '墙体基部',
        description: '裂缝扩展至1.8米，宽度增至8-10mm，有进一步发展趋势',
        recommendation: '紧急加固，采用钢筋网片加固结合注浆处理',
        estimatedCost: '5-8万元',
        urgency: '立即处理',
        recordedAt: now - 5 * day,
        status: 'in_progress',
      },
    ],
    'demo-yamen': [
      {
        id: 4,
        buildingId: 'demo-yamen',
        buildingName: '内乡县衙',
        diseaseType: '腐蚀',
        severity: '中度',
        position: '木柱根部',
        description: '柱根受潮腐蚀，直径减小约8%',
        recommendation: '更换腐烂部分，做防腐处理，改善排水',
        estimatedCost: '1.5-2万元',
        urgency: '近期处理',
        recordedAt: now - 15 * day,
        status: 'pending',
      },
      {
        id: 5,
        buildingId: 'demo-yamen',
        buildingName: '内乡县衙',
        diseaseType: '虫蛀',
        severity: '轻微',
        position: '木梁架',
        description: '发现白蚁蛀蚀痕迹，局部有蛀洞',
        recommendation: '全面杀虫处理，更换蛀损构件',
        estimatedCost: '1-2万元',
        urgency: '定期监测',
        recordedAt: now - 15 * day,
        status: 'pending',
      },
    ],
    'demo-tulou': [
      {
        id: 6,
        buildingId: 'demo-tulou',
        buildingName: '承启楼',
        diseaseType: '剥落',
        severity: '严重',
        position: '夯土墙面',
        description: '大面积抹灰层空鼓剥落，露出内部夯土',
        recommendation: '铲除空鼓部分，重新抹灰，加设防潮层',
        estimatedCost: '3-5万元',
        urgency: '立即处理',
        recordedAt: now - 10 * day,
        status: 'pending',
      },
      {
        id: 7,
        buildingId: 'demo-tulou',
        buildingName: '承启楼',
        diseaseType: '裂缝',
        severity: '中度',
        position: '夯土墙面',
        description: '墙面出现纵向裂缝，长度约3米',
        recommendation: '裂缝灌浆加固，监测发展情况',
        estimatedCost: '1-2万元',
        urgency: '近期处理',
        recordedAt: now - 10 * day,
        status: 'pending',
      },
    ],
  };
  
  return demoData[buildingId] || [];
}

// 导出报告
function exportComparisonReport(report: DiseaseComparisonReport) {
  const lines = [
    '# 古建筑病害对比分析报告',
    '',
    `**生成时间**: ${new Date(report.metadata.generatedAt).toLocaleString('zh-CN')}`,
    `**对比类型**: ${report.metadata.comparisonType === 'temporal' ? '时间轴对比（同一建筑）' : '空间对比（不同建筑）'}`,
    '',
    '## 建筑信息',
    '',
    '| 项目 | 建筑A | 建筑B |',
    '|------|-------|-------|',
    `| 名称 | ${report.metadata.buildingA.name} | ${report.metadata.buildingB.name} |`,
    `| 类型 | ${report.metadata.buildingA.category} | ${report.metadata.buildingB.category} |`,
    '',
    '## 执行摘要',
    '',
    '### 关键发现',
    ...report.executiveSummary.keyFindings.map(f => `- ${f}`),
    '',
    '### 严重问题',
    ...(report.executiveSummary.criticalIssues.length > 0 
      ? report.executiveSummary.criticalIssues.map(i => `- ⚠️ ${i}`)
      : ['- 未发现严重问题']),
    '',
    '### 建议措施',
    ...report.executiveSummary.recommendations.map(r => `- ${r}`),
    '',
    '## 详细对比',
    '',
    '### 病害数量',
    `- 建筑A: ${report.detailedComparison.diseaseCount.a} 处`,
    `- 建筑B: ${report.detailedComparison.diseaseCount.b} 处`,
    `- 差异: ${report.detailedComparison.diseaseCount.difference > 0 ? '+' : ''}${report.detailedComparison.diseaseCount.difference} 处`,
    '',
    '### 严重程度分布',
    '| 等级 | 建筑A | 建筑B |',
    '|------|-------|-------|',
    `| 严重 | ${report.detailedComparison.severityDistribution.a['严重'] || 0} | ${report.detailedComparison.severityDistribution.b['严重'] || 0} |`,
    `| 中度 | ${report.detailedComparison.severityDistribution.a['中度'] || 0} | ${report.detailedComparison.severityDistribution.b['中度'] || 0} |`,
    `| 轻微 | ${report.detailedComparison.severityDistribution.a['轻微'] || 0} | ${report.detailedComparison.severityDistribution.b['轻微'] || 0} |`,
    '',
    '### 费用分析',
    `- 建筑A预估费用: ${report.detailedComparison.costAnalysis.a.toFixed(1)} 万元`,
    `- 建筑B预估费用: ${report.detailedComparison.costAnalysis.b.toFixed(1)} 万元`,
    `- 费用差异: ${report.detailedComparison.costAnalysis.difference > 0 ? '+' : ''}${report.detailedComparison.costAnalysis.difference.toFixed(1)} 万元 (${report.detailedComparison.costAnalysis.percentageDiff > 0 ? '+' : ''}${report.detailedComparison.costAnalysis.percentageDiff.toFixed(1)}%)`,
    '',
  ];

  // 添加相似度分析（空间对比）
  if (report.similarityAnalysis) {
    lines.push(
      '## 病害相似度分析',
      '',
      `**总体相似度**: ${report.similarityAnalysis.overallSimilarity}%`,
      '',
      '### 各维度相似度',
      `- 类型相似度: ${report.similarityAnalysis.dimensions.typeSimilarity}%`,
      `- 严重程度相似度: ${report.similarityAnalysis.dimensions.severitySimilarity}%`,
      `- 位置相似度: ${report.similarityAnalysis.dimensions.positionSimilarity}%`,
      `- 紧急程度相似度: ${report.similarityAnalysis.dimensions.urgencySimilarity}%`,
      '',
      '### 共同病害类型',
      ...(report.similarityAnalysis.commonDiseaseTypes.length > 0
        ? report.similarityAnalysis.commonDiseaseTypes.map(t => `- ${t}`)
        : ['- 无共同病害类型']),
      '',
    );
  }

  // 添加时间轴分析（时间对比）
  if (report.timelineAnalysis) {
    lines.push(
      '## 时间轴分析',
      '',
      `**发展趋势**: ${report.timelineAnalysis.trend === 'improving' ? '改善' : report.timelineAnalysis.trend === 'deteriorating' ? '恶化' : '稳定'}`,
      `**恶化速率**: ${report.timelineAnalysis.deteriorationRate.toFixed(2)}/天`,
      '',
    );
  }

  // 添加保护建议
  lines.push(
    '## 保护建议',
    '',
    ...report.protectionSuggestions.map((s, idx) => [
      `### ${idx + 1}. ${s.title}`,
      `**优先级**: ${s.priority === 'high' ? '高' : s.priority === 'medium' ? '中' : '低'}`,
      `**描述**: ${s.description}`,
      ...(s.estimatedCost ? [`**预估费用**: ${s.estimatedCost}`] : []),
      ...(s.timeline ? [`**时间计划**: ${s.timeline}`] : []),
      ...(s.referenceCases ? [`**参考案例**: ${s.referenceCases.join(', ')}`] : []),
      '',
    ]).flat(),
    '---',
    '',
    '*本报告由古建智识系统自动生成*',
  );

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `病害对比分析报告-${new Date().toISOString().slice(0, 10)}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function ComparisonPage() {
  const buildings = useBuildingList();
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('spatial');
  const [selectedBuildingA, setSelectedBuildingA] = useState<string>('');
  const [selectedBuildingB, setSelectedBuildingB] = useState<string>('');
  const [diseasesA, setDiseasesA] = useState<DiseaseRecord[]>([]);
  const [diseasesB, setDiseasesB] = useState<DiseaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [report, setReport] = useState<DiseaseComparisonReport | null>(null);

  // 加载病害数据
  useEffect(() => {
    async function loadDiseases() {
      if (!selectedBuildingA) return;
      
      setLoading(true);
      try {
        const records = await getBuildingDiseaseRecords(selectedBuildingA);
        setDiseasesA(records);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, [selectedBuildingA]);

  useEffect(() => {
    async function loadDiseases() {
      if (!selectedBuildingB) return;
      
      setLoading(true);
      try {
        const records = await getBuildingDiseaseRecords(selectedBuildingB);
        setDiseasesB(records);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, [selectedBuildingB]);

  // 生成对比报告
  useEffect(() => {
    if (diseasesA.length === 0 || diseasesB.length === 0) {
      setReport(null);
      return;
    }

    const buildingA = buildings.find(b => b.id === selectedBuildingA);
    const buildingB = buildings.find(b => b.id === selectedBuildingB);
    
    if (!buildingA || !buildingB) return;

    const newReport = generateComparisonReport(
      buildingA.id,
      buildingA.name,
      buildingA.category,
      diseasesA,
      buildingB.id,
      buildingB.name,
      buildingB.category,
      diseasesB,
      comparisonMode
    );
    
    setReport(newReport);
  }, [diseasesA, diseasesB, comparisonMode, buildings, selectedBuildingA, selectedBuildingB]);

  // 获取时间轴数据（时间对比模式）
  const timelineData = useMemo(() => {
    if (comparisonMode !== 'temporal' || diseasesA.length === 0) return [];
    return generateTimelineComparison(selectedBuildingA, diseasesA);
  }, [comparisonMode, diseasesA, selectedBuildingA]);

  // 获取相似度数据（空间对比模式）
  const similarityData = useMemo(() => {
    if (comparisonMode !== 'spatial' || diseasesA.length === 0 || diseasesB.length === 0) return null;
    return calculateDiseaseSimilarity(diseasesA, diseasesB);
  }, [comparisonMode, diseasesA, diseasesB]);

  const canCompare = diseasesA.length > 0 && diseasesB.length > 0;

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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">病害对比分析</h1>
                <p className="text-sm text-slate-400">基于AI识别的建筑病害智能对比</p>
              </div>
            </div>
          </div>

          {report && (
            <button
              type="button"
              onClick={() => exportComparisonReport(report)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
            >
              <Download className="w-4 h-4" />
              导出报告
            </button>
          )}
        </motion.div>

        {/* 对比模式选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-2xl border border-indigo-500/10">
            <button
              type="button"
              onClick={() => setComparisonMode('spatial')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                comparisonMode === 'spatial'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <GitCompare className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">建筑间对比</div>
                <div className="text-xs opacity-80">比较不同建筑的病害特征</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('temporal')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                comparisonMode === 'temporal'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Clock className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">时间轴对比</div>
                <div className="text-xs opacity-80">追踪同一建筑的病害变化</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* 建筑选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-lg font-medium text-white mb-4">
            {comparisonMode === 'spatial' ? '选择要对比的两座建筑' : '选择要分析的建筑'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 建筑A选择 */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">
                {comparisonMode === 'spatial' ? '建筑 A' : '选择建筑'}
              </label>
              <select
                value={selectedBuildingA}
                onChange={(e) => setSelectedBuildingA(e.target.value)}
                className="w-full p-3 bg-white/5 border border-indigo-500/20 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">请选择建筑...</option>
                {buildings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.category} · {b.era})
                  </option>
                ))}
              </select>
            </div>

            {/* 建筑B选择（仅空间对比模式） */}
            {comparisonMode === 'spatial' && (
              <div className="space-y-2">
                <label className="text-sm text-slate-400">建筑 B</label>
                <select
                  value={selectedBuildingB}
                  onChange={(e) => setSelectedBuildingB(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-indigo-500/20 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">请选择建筑...</option>
                  {buildings.filter(b => b.id !== selectedBuildingA).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category} · {b.era})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              正在加载病害数据...
            </div>
          </motion.div>
        )}

        {/* 对比结果展示 */}
        {!loading && canCompare && report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tab切换 */}
            <div className="flex flex-wrap gap-2 border-b border-indigo-500/10 pb-4">
              {[
                { key: 'overview', label: '概览', icon: BarChart3 },
                { key: 'diseases', label: '病害对比', icon: Activity },
                ...(comparisonMode === 'temporal' ? [{ key: 'timeline', label: '时间轴', icon: Clock }] : []),
                ...(comparisonMode === 'spatial' ? [{ key: 'similarity', label: '相似度分析', icon: GitCompare }] : []),
                { key: 'recommendations', label: '保护建议', icon: Shield },
              ].map(tab => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 概览Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 关键指标卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-indigo-500/10">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                      <Activity className="w-4 h-4" />
                      病害总数
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">{report.detailedComparison.diseaseCount.a + report.detailedComparison.diseaseCount.b}</span>
                      <span className="text-sm text-slate-500">处</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-indigo-500/10">
                    <div className="flex items-center gap-2 text-rose-400 text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      严重病害
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-rose-400">
                        {(report.detailedComparison.severityDistribution.a['严重'] || 0) + 
                         (report.detailedComparison.severityDistribution.b['严重'] || 0)}
                      </span>
                      <span className="text-sm text-slate-500">处</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-indigo-500/10">
                    <div className="flex items-center gap-2 text-amber-400 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      需立即处理
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-amber-400">
                        {diseasesA.filter(d => d.urgency === '立即处理').length + 
                         diseasesB.filter(d => d.urgency === '立即处理').length}
                      </span>
                      <span className="text-sm text-slate-500">处</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-indigo-500/10">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      预估总费用
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-emerald-400">
                        {(report.detailedComparison.costAnalysis.a + report.detailedComparison.costAnalysis.b).toFixed(1)}
                      </span>
                      <span className="text-sm text-slate-500">万元</span>
                    </div>
                  </div>
                </div>

                {/* 执行摘要 */}
                <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl p-6 border border-indigo-500/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    执行摘要
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">关键发现</h4>
                      <ul className="space-y-1">
                        {report.executiveSummary.keyFindings.map((finding, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {report.executiveSummary.criticalIssues.length > 0 && (
                      <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                        <h4 className="text-sm font-medium text-rose-300 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          严重问题
                        </h4>
                        <ul className="space-y-1">
                          {report.executiveSummary.criticalIssues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-rose-200 flex items-start gap-2">
                              <span className="mt-1">⚠️</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">建议措施</h4>
                      <ul className="space-y-1">
                        {report.executiveSummary.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">→</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 病害对比Tab */}
            {activeTab === 'diseases' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 建筑A病害 */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {report.metadata.buildingA.name}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {diseasesA.length} 处病害
                      </span>
                    </div>
                    <div className="space-y-3">
                      {diseasesA.map(disease => (
                        <DiseaseCard key={disease.id} disease={disease} />
                      ))}
                    </div>
                  </div>

                  {/* 建筑B病害 */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">
                        {report.metadata.buildingB.name}
                      </h3>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {diseasesB.length} 处病害
                      </span>
                    </div>
                    <div className="space-y-3">
                      {diseasesB.map(disease => (
                        <DiseaseCard key={disease.id} disease={disease} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 时间轴Tab（仅时间对比模式） */}
            {activeTab === 'timeline' && comparisonMode === 'temporal' && timelineData.length > 0 && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <h3 className="text-lg font-bold text-white mb-6">病害发展时间轴</h3>
                  
                  <div className="relative">
                    {/* 时间轴线 */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-500/30" />
                    
                    <div className="space-y-6">
                      {timelineData.map((point, idx) => (
                        <TimelinePoint key={point.timestamp} point={point} index={idx} />
                      ))}
                    </div>
                  </div>
                </div>

                {report.timelineAnalysis && (
                  <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl p-6 border border-amber-500/20">
                    <h3 className="text-lg font-bold text-white mb-4">趋势分析</h3>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        report.timelineAnalysis.trend === 'improving' ? 'bg-emerald-500/20' :
                        report.timelineAnalysis.trend === 'deteriorating' ? 'bg-rose-500/20' :
                        'bg-amber-500/20'
                      }`}>
                        {report.timelineAnalysis.trend === 'improving' ? (
                          <TrendingUp className="w-8 h-8 text-emerald-400" />
                        ) : report.timelineAnalysis.trend === 'deteriorating' ? (
                          <TrendingDown className="w-8 h-8 text-rose-400" />
                        ) : (
                          <Minus className="w-8 h-8 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {report.timelineAnalysis.trend === 'improving' ? '状况改善' :
                           report.timelineAnalysis.trend === 'deteriorating' ? '持续恶化' : '基本稳定'}
                        </div>
                        <div className="text-sm text-slate-400">
                          恶化速率: {report.timelineAnalysis.deteriorationRate.toFixed(2)}/天
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 相似度Tab（仅空间对比模式） */}
            {activeTab === 'similarity' && comparisonMode === 'spatial' && similarityData && (
              <div className="space-y-6">
                {/* 总体相似度 */}
                <div className="bg-white/5 rounded-2xl p-6 border border-indigo-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">病害相似度分析</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">总体相似度</span>
                      <span className={`text-3xl font-bold ${
                        similarityData.overallSimilarity >= 70 ? 'text-emerald-400' :
                        similarityData.overallSimilarity >= 40 ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {similarityData.overallSimilarity}%
                      </span>
                    </div>
                  </div>

                  {/* 各维度相似度 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '类型相似度', value: similarityData.dimensions.typeSimilarity },
                      { label: '严重程度相似度', value: similarityData.dimensions.severitySimilarity },
                      { label: '位置相似度', value: similarityData.dimensions.positionSimilarity },
                      { label: '紧急程度相似度', value: similarityData.dimensions.urgencySimilarity },
                    ].map(dim => (
                      <div key={dim.label} className="bg-white/5 rounded-xl p-4">
                        <div className="text-sm text-slate-400 mb-2">{dim.label}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${dim.value}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white w-10">{dim.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 共同病害 */}
                {similarityData.commonDiseaseTypes.length > 0 && (
                  <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20">
                    <h4 className="text-sm font-medium text-emerald-300 mb-3">共同病害类型</h4>
                    <div className="flex flex-wrap gap-2">
                      {similarityData.commonDiseaseTypes.map(type => (
                        <span key={type} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 推荐建议 */}
                <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/20">
                  <h4 className="text-sm font-medium text-blue-300 mb-3">分析建议</h4>
                  <ul className="space-y-2">
                    {similarityData.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 保护建议Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {report.protectionSuggestions.map((suggestion, idx) => (
                  <div 
                    key={idx}
                    className={`bg-white/5 rounded-2xl p-6 border ${
                      suggestion.priority === 'high' ? 'border-rose-500/30' :
                      suggestion.priority === 'medium' ? 'border-amber-500/30' :
                      'border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          suggestion.priority === 'high' ? 'bg-rose-500/20 text-rose-300' :
                          suggestion.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {suggestion.priority === 'high' ? '高优先级' :
                           suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                        </span>
                        <h4 className="text-lg font-bold text-white">{suggestion.title}</h4>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-4">{suggestion.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {suggestion.estimatedCost && (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <span>预估费用:</span>
                          <span className="font-medium">{suggestion.estimatedCost}</span>
                        </div>
                      )}
                      {suggestion.timeline && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Calendar className="w-4 h-4" />
                          <span>{suggestion.timeline}</span>
                        </div>
                      )}
                    </div>
                    {suggestion.referenceCases && suggestion.referenceCases.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-sm text-slate-500 mb-2">参考案例:</div>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.referenceCases.map((ref, refIdx) => (
                            <span key={refIdx} className="px-2 py-1 bg-white/5 text-slate-400 rounded text-xs">
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 空状态 */}
        {!loading && !canCompare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/5 rounded-2xl border border-indigo-500/10"
          >
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {comparisonMode === 'spatial' ? '请选择两座建筑进行对比' : '请选择要分析的建筑'}
            </h3>
            <p className="text-slate-400 mb-4">
              {comparisonMode === 'spatial' 
                ? '选择不同建筑的病害数据，进行相似度分析和经验借鉴'
                : '选择建筑后可查看其病害发展时间轴和趋势分析'}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{buildings.length} 个可用建筑</span>
              </div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" />
                <span>支持识别历史数据</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 病害卡片组件
function DiseaseCard({ disease }: { disease: DiseaseRecord }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{disease.diseaseType}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            disease.severity === '严重' ? 'bg-rose-500/20 text-rose-300' :
            disease.severity === '中度' ? 'bg-amber-500/20 text-amber-300' :
            'bg-emerald-500/20 text-emerald-300'
          }`}>
            {disease.severity}
          </span>
        </div>
        <span className={`text-xs ${
          disease.urgency === '立即处理' ? 'text-rose-400' :
          disease.urgency === '近期处理' ? 'text-amber-400' :
          'text-emerald-400'
        }`}>
          {disease.urgency}
        </span>
      </div>
      <div className="text-sm text-slate-400 mb-2">
        <MapPin className="w-3 h-3 inline mr-1" />
        {disease.position}
      </div>
      <p className="text-sm text-slate-500 line-clamp-2">{disease.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-emerald-400">{disease.estimatedCost}</span>
        <span className="text-slate-500">
          {new Date(disease.recordedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

// 时间点组件
function TimelinePoint({ point, index }: { point: TimelineComparisonPoint; index: number }) {
  return (
    <div className="relative pl-12">
      {/* 时间点标记 */}
      <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-4 border-slate-900">
        <span className="text-white text-xs font-bold">{index + 1}</span>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 border border-indigo-500/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">{point.date}</span>
          {point.changes && (
            <div className="flex items-center gap-2">
              {point.changes.newDiseases > 0 && (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-xs">
                  +{point.changes.newDiseases} 新病害
                </span>
              )}
              {point.changes.resolvedDiseases > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs">
                  -{point.changes.resolvedDiseases} 已解决
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-slate-500">总数</div>
            <div className="text-white font-medium">{point.stats.total}</div>
          </div>
          <div>
            <div className="text-slate-500">严重</div>
            <div className="text-rose-400 font-medium">{point.stats.severe}</div>
          </div>
          <div>
            <div className="text-slate-500">需立即处理</div>
            <div className="text-amber-400 font-medium">{point.stats.immediate}</div>
          </div>
          <div>
            <div className="text-slate-500">预估费用</div>
            <div className="text-emerald-400 font-medium">{point.stats.totalCost.toFixed(1)}万</div>
          </div>
        </div>

        {point.changes && point.changes.severityIncreased > 0 && (
          <div className="mt-3 text-sm text-rose-400">
            ⚠️ {point.changes.severityIncreased} 处病害恶化
          </div>
        )}
      </div>
    </div>
  );
}
