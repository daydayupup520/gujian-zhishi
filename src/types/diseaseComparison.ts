/**
 * 病害对比分析类型定义
 */

import type { DiseaseRecord } from '../lib/db';

// 病害类型权重映射（用于相似度计算）
export const DISEASE_TYPE_WEIGHTS: Record<string, number> = {
  '裂缝': 1.0,
  '腐蚀': 0.9,
  '风化': 0.7,
  '剥落': 0.85,
  '虫蛀': 0.8,
  '变形': 1.0,
};

// 严重程度权重
export const SEVERITY_WEIGHTS: Record<string, number> = {
  '轻微': 1,
  '中度': 2,
  '严重': 3,
};

// 紧急程度权重
export const URGENCY_WEIGHTS: Record<string, number> = {
  '定期监测': 1,
  '近期处理': 2,
  '立即处理': 3,
};

// 病害对比维度
export interface DiseaseComparisonDimension {
  key: string;
  label: string;
  description: string;
}

export const DISEASE_COMPARISON_DIMENSIONS: DiseaseComparisonDimension[] = [
  { key: 'type', label: '病害类型', description: '裂缝、腐蚀、风化等病害种类对比' },
  { key: 'severity', label: '严重程度', description: '轻微、中度、严重等级分布' },
  { key: 'position', label: '分布位置', description: '病害发生在哪些构件部位' },
  { key: 'urgency', label: '紧急程度', description: '处理优先级排序' },
  { key: 'cost', label: '修缮成本', description: '预估费用对比分析' },
  { key: 'trend', label: '发展趋势', description: '病害随时间的变化趋势' },
];

// 时间轴对比数据
export interface TimelineComparisonPoint {
  timestamp: number;
  date: string;
  diseases: DiseaseRecord[];
  stats: {
    total: number;
    severe: number;
    moderate: number;
    minor: number;
    immediate: number;
    recent: number;
    monitor: number;
    totalCost: number;
  };
  // 相比上一次的变化
  changes?: {
    newDiseases: number;
    resolvedDiseases: number;
    severityIncreased: number;
    severityDecreased: number;
    costChange: number;
  };
}

// 相似度分析结果
export interface DiseaseSimilarityResult {
  // 总体相似度 (0-100)
  overallSimilarity: number;
  // 各维度相似度
  dimensions: {
    typeSimilarity: number;
    severitySimilarity: number;
    positionSimilarity: number;
    urgencySimilarity: number;
  };
  // 共同病害类型
  commonDiseaseTypes: string[];
  // 差异病害类型
  uniqueDiseaseTypesA: string[];
  uniqueDiseaseTypesB: string[];
  // 相似病害详情
  similarDiseases: Array<{
    diseaseA: DiseaseRecord;
    diseaseB: DiseaseRecord;
    similarity: number;
    reason: string;
  }>;
  // 推荐建议
  recommendations: string[];
}

// 对比分析报告
export interface DiseaseComparisonReport {
  // 报告元数据
  metadata: {
    generatedAt: number;
    buildingA: {
      id: string;
      name: string;
      category: string;
    };
    buildingB: {
      id: string;
      name: string;
      category: string;
    };
    comparisonType: 'temporal' | 'spatial'; // temporal: 时间对比, spatial: 空间对比（不同建筑）
  };
  // 执行摘要
  executiveSummary: {
    keyFindings: string[];
    criticalIssues: string[];
    recommendations: string[];
  };
  // 详细对比
  detailedComparison: {
    diseaseCount: {
      a: number;
      b: number;
      difference: number;
    };
    severityDistribution: {
      a: Record<string, number>;
      b: Record<string, number>;
    };
    typeDistribution: {
      a: Record<string, number>;
      b: Record<string, number>;
    };
    costAnalysis: {
      a: number;
      b: number;
      difference: number;
      percentageDiff: number;
    };
  };
  // 相似度分析
  similarityAnalysis?: DiseaseSimilarityResult;
  // 时间轴分析（如果是同一建筑）
  timelineAnalysis?: {
    points: TimelineComparisonPoint[];
    trend: 'improving' | 'stable' | 'deteriorating';
    deteriorationRate: number;
  };
  // 保护建议
  protectionSuggestions: Array<{
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    referenceCases?: string[];
    estimatedCost?: string;
    timeline?: string;
  }>;
}

// 参考案例
export interface ReferenceCase {
  id: string;
  buildingName: string;
  buildingCategory: string;
  diseaseType: string;
  similarityScore: number;
  protectionMethod: string;
  outcome: string;
  cost: string;
  duration: string;
  lessons: string[];
}

// 智能推荐结果
export interface ProtectionRecommendation {
  type: 'immediate' | 'short-term' | 'long-term';
  title: string;
  description: string;
  rationale: string;
  relatedDiseases: string[];
  estimatedCost: string;
  priority: number; // 1-10
  referenceCases: ReferenceCase[];
}

/**
 * 计算两座建筑的病害相似度
 */
export function calculateDiseaseSimilarity(
  diseasesA: DiseaseRecord[],
  diseasesB: DiseaseRecord[]
): DiseaseSimilarityResult {
  // 1. 计算类型相似度
  const typesA = Array.from(new Set(diseasesA.map(d => d.diseaseType)));
  const typesB = Array.from(new Set(diseasesB.map(d => d.diseaseType)));
  const commonTypes = typesA.filter(t => typesB.includes(t));
  const typeSimilarity = (commonTypes.length * 2) / (typesA.length + typesB.length) * 100;

  // 2. 计算严重程度相似度
  const severityDistA = getSeverityDistribution(diseasesA);
  const severityDistB = getSeverityDistribution(diseasesB);
  const severitySimilarity = calculateDistributionSimilarity(severityDistA, severityDistB);

  // 3. 计算位置相似度（基于构件类型）
  const positionsA = diseasesA.map(d => extractComponentType(d.position));
  const positionsB = diseasesB.map(d => extractComponentType(d.position));
  const commonPositions = positionsA.filter(p => positionsB.includes(p));
  const positionSimilarity = (commonPositions.length * 2) / (positionsA.length + positionsB.length) * 100;

  // 4. 计算紧急程度相似度
  const urgencyDistA = getUrgencyDistribution(diseasesA);
  const urgencyDistB = getUrgencyDistribution(diseasesB);
  const urgencySimilarity = calculateDistributionSimilarity(urgencyDistA, urgencyDistB);

  // 5. 计算总体相似度（加权平均）
  const overallSimilarity = Math.round(
    typeSimilarity * 0.35 +
    severitySimilarity * 0.30 +
    positionSimilarity * 0.20 +
    urgencySimilarity * 0.15
  );

  // 6. 找出相似病害
  const similarDiseases = findSimilarDiseases(diseasesA, diseasesB);

  // 7. 生成推荐建议
  const recommendations = generateSimilarityRecommendations(
    overallSimilarity,
    commonTypes,
    diseasesA,
    diseasesB
  );

  return {
    overallSimilarity,
    dimensions: {
      typeSimilarity: Math.round(typeSimilarity),
      severitySimilarity: Math.round(severitySimilarity),
      positionSimilarity: Math.round(positionSimilarity),
      urgencySimilarity: Math.round(urgencySimilarity),
    },
    commonDiseaseTypes: commonTypes,
    uniqueDiseaseTypesA: typesA.filter(t => !typesB.includes(t)),
    uniqueDiseaseTypesB: typesB.filter(t => !typesA.includes(t)),
    similarDiseases,
    recommendations,
  };
}

/**
 * 从位置描述中提取构件类型
 */
function extractComponentType(position: string): string {
  const componentKeywords: Record<string, string[]> = {
    'column': ['柱', '柱根', '檐柱', '金柱'],
    'beam': ['梁', '木梁', '梁架', '檩条'],
    'wall': ['墙', '墙体', '山墙', '夯土墙'],
    'roof': ['屋顶', '屋面', '屋檐', '瓦片'],
    'foundation': ['台基', '基础', '地基'],
    'decoration': ['彩画', '装饰', '雕刻'],
    'bridge_arch': ['拱', '拱圈', '桥拱'],
    'bridge_pier': ['墩', '桥墩', '桥台'],
  };

  for (const [type, keywords] of Object.entries(componentKeywords)) {
    if (keywords.some(kw => position.includes(kw))) {
      return type;
    }
  }
  return 'other';
}

/**
 * 获取严重程度分布
 */
function getSeverityDistribution(diseases: DiseaseRecord[]): Record<string, number> {
  const dist: Record<string, number> = { '轻微': 0, '中度': 0, '严重': 0 };
  diseases.forEach(d => {
    dist[d.severity] = (dist[d.severity] || 0) + 1;
  });
  return dist;
}

/**
 * 获取紧急程度分布
 */
function getUrgencyDistribution(diseases: DiseaseRecord[]): Record<string, number> {
  const dist: Record<string, number> = { '定期监测': 0, '近期处理': 0, '立即处理': 0 };
  diseases.forEach(d => {
    dist[d.urgency] = (dist[d.urgency] || 0) + 1;
  });
  return dist;
}

/**
 * 计算两个分布的相似度（余弦相似度）
 */
function calculateDistributionSimilarity(
  distA: Record<string, number>,
  distB: Record<string, number>
): number {
  const keys = Array.from(new Set(Object.keys(distA).concat(Object.keys(distB))));
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  keys.forEach(key => {
    const valA = distA[key] || 0;
    const valB = distB[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  return (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))) * 100;
}

/**
 * 找出相似的病害对
 */
function findSimilarDiseases(
  diseasesA: DiseaseRecord[],
  diseasesB: DiseaseRecord[]
): Array<{
  diseaseA: DiseaseRecord;
  diseaseB: DiseaseRecord;
  similarity: number;
  reason: string;
}> {
  const similarDiseases: Array<{
    diseaseA: DiseaseRecord;
    diseaseB: DiseaseRecord;
    similarity: number;
    reason: string;
  }> = [];

  diseasesA.forEach(da => {
    diseasesB.forEach(db => {
      if (da.diseaseType === db.diseaseType) {
        const componentA = extractComponentType(da.position);
        const componentB = extractComponentType(db.position);
        
        let similarity = 50; // 基础相似度（同类型）
        let reason = `同为${da.diseaseType}`;

        if (componentA === componentB) {
          similarity += 25;
          reason += `，且均位于${da.position}`;
        }

        if (da.severity === db.severity) {
          similarity += 15;
          reason += `，严重程度均为${da.severity}`;
        }

        if (da.urgency === db.urgency) {
          similarity += 10;
          reason += `，紧急程度相同`;
        }

        similarDiseases.push({
          diseaseA: da,
          diseaseB: db,
          similarity: Math.min(similarity, 100),
          reason,
        });
      }
    });
  });

  return similarDiseases.sort((a, b) => b.similarity - a.similarity);
}

/**
 * 生成相似度分析建议
 */
function generateSimilarityRecommendations(
  overallSimilarity: number,
  commonTypes: string[],
  diseasesA: DiseaseRecord[],
  diseasesB: DiseaseRecord[]
): string[] {
  const recommendations: string[] = [];

  if (overallSimilarity >= 70) {
    recommendations.push('两座建筑病害特征高度相似，建议采用相同的保护策略');
    recommendations.push('可共享修缮经验和技术方案，提高保护效率');
  } else if (overallSimilarity >= 40) {
    recommendations.push('两座建筑存在部分相似病害，可参考彼此的保护经验');
    recommendations.push(`重点关注共同病害类型：${commonTypes.join('、')}`);
  } else {
    recommendations.push('两座建筑病害特征差异较大，需制定针对性的保护方案');
    recommendations.push('建议分别评估各自的病害成因和发展趋势');
  }

  // 检查是否有严重的共同病害
  const severeCommon = diseasesA.filter(da => 
    diseasesB.some(db => 
      db.diseaseType === da.diseaseType && 
      da.severity === '严重' && 
      db.severity === '严重'
    )
  );

  if (severeCommon.length > 0) {
    recommendations.push(`注意：两座建筑均存在严重的${severeCommon.map(d => d.diseaseType).join('、')}，需优先处理`);
  }

  return recommendations;
}

/**
 * 生成时间轴对比数据
 */
export function generateTimelineComparison(
  _buildingId: string,
  diseaseRecords: DiseaseRecord[]
): TimelineComparisonPoint[] {
  // 按时间分组
  const groupedByTime = new Map<number, DiseaseRecord[]>();
  
  diseaseRecords.forEach(record => {
    // 按天分组
    const day = new Date(record.recordedAt).setHours(0, 0, 0, 0);
    if (!groupedByTime.has(day)) {
      groupedByTime.set(day, []);
    }
    groupedByTime.get(day)!.push(record);
  });

  // 转换为时间轴点
  const points: TimelineComparisonPoint[] = [];
  const sortedDays = Array.from(groupedByTime.keys()).sort((a, b) => a - b);

  sortedDays.forEach((day, index) => {
    const diseases = groupedByTime.get(day)!;
    const stats = calculateDiseaseStats(diseases);
    
    const point: TimelineComparisonPoint = {
      timestamp: day,
      date: new Date(day).toLocaleDateString('zh-CN'),
      diseases,
      stats,
    };

    // 计算与上一次的变化
    if (index > 0) {
      const prevPoint = points[index - 1];
      point.changes = calculateChanges(prevPoint, point);
    }

    points.push(point);
  });

  return points;
}

/**
 * 计算病害统计
 */
function calculateDiseaseStats(diseases: DiseaseRecord[]) {
  const stats = {
    total: diseases.length,
    severe: diseases.filter(d => d.severity === '严重').length,
    moderate: diseases.filter(d => d.severity === '中度').length,
    minor: diseases.filter(d => d.severity === '轻微').length,
    immediate: diseases.filter(d => d.urgency === '立即处理').length,
    recent: diseases.filter(d => d.urgency === '近期处理').length,
    monitor: diseases.filter(d => d.urgency === '定期监测').length,
    totalCost: calculateTotalCost(diseases),
  };
  return stats;
}

/**
 * 计算总费用
 */
function calculateTotalCost(diseases: DiseaseRecord[]): number {
  return diseases.reduce((sum, d) => {
    const match = d.estimatedCost.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      return sum + parseFloat(match[1]);
    }
    return sum;
  }, 0);
}

/**
 * 计算两次记录间的变化
 */
function calculateChanges(
  prev: TimelineComparisonPoint,
  current: TimelineComparisonPoint
) {
  const prevDiseaseIds = new Set(prev.diseases.map(d => d.id));
  const currentDiseaseIds = new Set(current.diseases.map(d => d.id));

  const newDiseases = current.diseases.filter(d => !prevDiseaseIds.has(d.id)).length;
  const resolvedDiseases = prev.diseases.filter(d => !currentDiseaseIds.has(d.id)).length;

  // 统计严重程度变化
  let severityIncreased = 0;
  let severityDecreased = 0;

  current.diseases.forEach(cd => {
    const pd = prev.diseases.find(p => p.id === cd.id);
    if (pd) {
      const severityDiff = SEVERITY_WEIGHTS[cd.severity] - SEVERITY_WEIGHTS[pd.severity];
      if (severityDiff > 0) severityIncreased++;
      if (severityDiff < 0) severityDecreased++;
    }
  });

  return {
    newDiseases,
    resolvedDiseases,
    severityIncreased,
    severityDecreased,
    costChange: current.stats.totalCost - prev.stats.totalCost,
  };
}

/**
 * 分析发展趋势
 */
export function analyzeDiseaseTrend(points: TimelineComparisonPoint[]): {
  trend: 'improving' | 'stable' | 'deteriorating';
  deteriorationRate: number;
} {
  if (points.length < 2) {
    return { trend: 'stable', deteriorationRate: 0 };
  }

  const first = points[0];
  const last = points[points.length - 1];

  // 计算综合评分变化
  const firstScore = calculateHealthScore(first.stats);
  const lastScore = calculateHealthScore(last.stats);

  const scoreChange = lastScore - firstScore;
  const timeSpan = (last.timestamp - first.timestamp) / (1000 * 60 * 60 * 24); // 天数

  if (timeSpan === 0) {
    return { trend: 'stable', deteriorationRate: 0 };
  }

  const dailyChange = scoreChange / timeSpan;

  if (dailyChange > 0.5) {
    return { trend: 'improving', deteriorationRate: -dailyChange };
  } else if (dailyChange < -0.5) {
    return { trend: 'deteriorating', deteriorationRate: -dailyChange };
  } else {
    return { trend: 'stable', deteriorationRate: Math.abs(dailyChange) };
  }
}

/**
 * 计算健康评分 (0-100)
 */
function calculateHealthScore(stats: TimelineComparisonPoint['stats']): number {
  const severityScore = 100 - (stats.severe * 30 + stats.moderate * 15 + stats.minor * 5);
  const urgencyScore = 100 - (stats.immediate * 25 + stats.recent * 10);
  return Math.max(0, (severityScore + urgencyScore) / 2);
}

/**
 * 生成对比分析报告
 */
export function generateComparisonReport(
  buildingAId: string,
  buildingAName: string,
  buildingACategory: string,
  diseasesA: DiseaseRecord[],
  buildingBId: string,
  buildingBName: string,
  buildingBCategory: string,
  diseasesB: DiseaseRecord[],
  comparisonType: 'temporal' | 'spatial'
): DiseaseComparisonReport {
  // 基础统计
  const diseaseCount = {
    a: diseasesA.length,
    b: diseasesB.length,
    difference: diseasesA.length - diseasesB.length,
  };

  const severityDistribution = {
    a: getSeverityDistribution(diseasesA),
    b: getSeverityDistribution(diseasesB),
  };

  const typeDistribution = {
    a: getTypeDistribution(diseasesA),
    b: getTypeDistribution(diseasesB),
  };

  const costA = calculateTotalCost(diseasesA);
  const costB = calculateTotalCost(diseasesB);
  const costAnalysis = {
    a: costA,
    b: costB,
    difference: costA - costB,
    percentageDiff: costB > 0 ? ((costA - costB) / costB) * 100 : 0,
  };

  // 相似度分析（空间对比时）
  let similarityAnalysis: DiseaseSimilarityResult | undefined;
  if (comparisonType === 'spatial') {
    similarityAnalysis = calculateDiseaseSimilarity(diseasesA, diseasesB);
  }

  // 时间轴分析（时间对比时）
  let timelineAnalysis: DiseaseComparisonReport['timelineAnalysis'] | undefined;
  if (comparisonType === 'temporal') {
    const timelinePoints = generateTimelineComparison(buildingAId, diseasesA);
    const trend = analyzeDiseaseTrend(timelinePoints);
    timelineAnalysis = {
      points: timelinePoints,
      trend: trend.trend,
      deteriorationRate: trend.deteriorationRate,
    };
  }

  // 生成执行摘要
  const executiveSummary = generateExecutiveSummary(
    comparisonType,
    diseaseCount,
    severityDistribution,
    costAnalysis,
    similarityAnalysis,
    timelineAnalysis
  );

  // 生成保护建议
  const protectionSuggestions = generateProtectionSuggestions(
    comparisonType,
    diseasesA,
    diseasesB,
    similarityAnalysis,
    timelineAnalysis
  );

  return {
    metadata: {
      generatedAt: Date.now(),
      buildingA: { id: buildingAId, name: buildingAName, category: buildingACategory },
      buildingB: { id: buildingBId, name: buildingBName, category: buildingBCategory },
      comparisonType,
    },
    executiveSummary,
    detailedComparison: {
      diseaseCount,
      severityDistribution,
      typeDistribution,
      costAnalysis,
    },
    similarityAnalysis,
    timelineAnalysis,
    protectionSuggestions,
  };
}

/**
 * 获取病害类型分布
 */
function getTypeDistribution(diseases: DiseaseRecord[]): Record<string, number> {
  const dist: Record<string, number> = {};
  diseases.forEach(d => {
    dist[d.diseaseType] = (dist[d.diseaseType] || 0) + 1;
  });
  return dist;
}

/**
 * 生成执行摘要
 */
function generateExecutiveSummary(
  comparisonType: 'temporal' | 'spatial',
  diseaseCount: { a: number; b: number; difference: number },
  severityDistribution: { a: Record<string, number>; b: Record<string, number> },
  costAnalysis: { a: number; b: number; difference: number; percentageDiff: number },
  similarityAnalysis?: DiseaseSimilarityResult,
  timelineAnalysis?: DiseaseComparisonReport['timelineAnalysis']
): DiseaseComparisonReport['executiveSummary'] {
  const keyFindings: string[] = [];
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  if (comparisonType === 'temporal') {
    keyFindings.push(`时间跨度内病害数量变化：${diseaseCount.difference > 0 ? '增加' : '减少'}${Math.abs(diseaseCount.difference)}处`);
    
    if (timelineAnalysis) {
      if (timelineAnalysis.trend === 'deteriorating') {
        criticalIssues.push(`建筑健康状况持续恶化，恶化速率：${timelineAnalysis.deteriorationRate.toFixed(2)}/天`);
        recommendations.push('建议立即启动全面修缮工程');
      } else if (timelineAnalysis.trend === 'improving') {
        keyFindings.push('修缮措施效果显著，建筑健康状况持续改善');
      } else {
        keyFindings.push('建筑健康状况相对稳定，建议持续监测');
      }
    }
  } else {
    keyFindings.push(`建筑A有${diseaseCount.a}处病害，建筑B有${diseaseCount.b}处病害`);
    
    if (similarityAnalysis) {
      keyFindings.push(`两座建筑病害相似度为${similarityAnalysis.overallSimilarity}%`);
      
      if (similarityAnalysis.overallSimilarity >= 70) {
        recommendations.push('建议两座建筑共享保护资源和修缮经验');
      }
    }
  }

  // 检查严重病害
  const severeA = severityDistribution.a['严重'] || 0;
  const severeB = severityDistribution.b['严重'] || 0;
  if (severeA > 0) criticalIssues.push(`建筑A存在${severeA}处严重病害，需优先处理`);
  if (severeB > 0) criticalIssues.push(`建筑B存在${severeB}处严重病害，需优先处理`);

  // 费用分析
  if (Math.abs(costAnalysis.percentageDiff) > 30) {
    keyFindings.push(`两座建筑修缮费用差异较大（${costAnalysis.percentageDiff > 0 ? '+' : ''}${costAnalysis.percentageDiff.toFixed(1)}%）`);
  }

  return { keyFindings, criticalIssues, recommendations };
}

/**
 * 生成保护建议
 */
function generateProtectionSuggestions(
  comparisonType: 'temporal' | 'spatial',
  diseasesA: DiseaseRecord[],
  diseasesB: DiseaseRecord[],
  similarityAnalysis?: DiseaseSimilarityResult,
  timelineAnalysis?: DiseaseComparisonReport['timelineAnalysis']
): DiseaseComparisonReport['protectionSuggestions'] {
  const suggestions: DiseaseComparisonReport['protectionSuggestions'] = [];

  // 高优先级建议
  const immediateDiseasesA = diseasesA.filter(d => d.urgency === '立即处理');
  const immediateDiseasesB = diseasesB.filter(d => d.urgency === '立即处理');

  if (immediateDiseasesA.length > 0) {
    suggestions.push({
      priority: 'high',
      title: '立即处理建筑A的紧急病害',
      description: `建筑A存在${immediateDiseasesA.length}处需立即处理的病害：${immediateDiseasesA.map(d => d.diseaseType).join('、')}`,
      estimatedCost: `${immediateDiseasesA.reduce((sum, d) => {
        const match = d.estimatedCost.match(/(\d+(?:\.\d+)?)/);
        return sum + (match ? parseFloat(match[1]) : 0);
      }, 0)}万元`,
      timeline: '1-2周内启动',
    });
  }

  if (immediateDiseasesB.length > 0) {
    suggestions.push({
      priority: 'high',
      title: '立即处理建筑B的紧急病害',
      description: `建筑B存在${immediateDiseasesB.length}处需立即处理的病害：${immediateDiseasesB.map(d => d.diseaseType).join('、')}`,
      estimatedCost: `${immediateDiseasesB.reduce((sum, d) => {
        const match = d.estimatedCost.match(/(\d+(?:\.\d+)?)/);
        return sum + (match ? parseFloat(match[1]) : 0);
      }, 0)}万元`,
      timeline: '1-2周内启动',
    });
  }

  // 中优先级建议
  const recentDiseasesA = diseasesA.filter(d => d.urgency === '近期处理');
  if (recentDiseasesA.length > 0) {
    suggestions.push({
      priority: 'medium',
      title: '安排建筑A的中度病害修缮',
      description: `建议在3个月内处理以下${recentDiseasesA.length}处病害，防止恶化`,
      timeline: '3个月内完成',
    });
  }

  // 基于相似度的建议
  if (comparisonType === 'spatial' && similarityAnalysis && similarityAnalysis.overallSimilarity >= 60) {
    suggestions.push({
      priority: 'medium',
      title: '建立协同保护机制',
      description: '两座建筑病害特征相似，建议统一规划保护方案，共享修缮资源',
      referenceCases: similarityAnalysis.similarDiseases.slice(0, 3).map(s => 
        `${s.diseaseA.diseaseType}（相似度${s.similarity}%）`
      ),
    });
  }

  // 基于时间趋势的建议
  if (comparisonType === 'temporal' && timelineAnalysis?.trend === 'deteriorating') {
    suggestions.push({
      priority: 'high',
      title: '加强监测频率',
      description: `建筑健康状况持续恶化，建议将监测频率从季度调整为月度`,
      timeline: '立即执行',
    });
  }

  return suggestions;
}

export default {
  calculateDiseaseSimilarity,
  generateTimelineComparison,
  analyzeDiseaseTrend,
  generateComparisonReport,
};
