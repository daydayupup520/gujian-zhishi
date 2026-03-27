/**
 * 研判报告生成器
 * 从 RecognitionResult 派生结构化报告，用于比赛展示
 * 不新增 AI 调用，只从现有字段派生
 */

import type { RecognitionResult } from '../../types/ai';

export type ConfidenceBand = '高' | '中' | '低';

export interface PresentationReport {
  headline: string;
  confidenceBand: ConfidenceBand;
  confidence: number; // 0-1, passthrough
  evidenceBullets: string[]; // 3-8 items
  crossView: {
    imageCount: number;
    consistency: number; // 0-1
    verdict: string;     // calibrated sentence
  };
  uncertainties: string[]; // 0-6 items
  nextShots: string[];     // 3-8 items
}

/**
 * 判断置信度级别
 */
function getConfidenceBand(confidence: number): ConfidenceBand {
  if (confidence >= 0.85) return '高';
  if (confidence >= 0.65) return '中';
  return '低';
}

/**
 * 生成 headline（根据置信度使用不同语气）
 */
function buildHeadline(result: RecognitionResult, band: ConfidenceBand): string {
  const confidencePercent = Math.round(result.confidence * 100);
  
  switch (band) {
    case '高':
      return `结论：${result.name}（${result.category}）｜${result.era} · ${result.year}（置信度${confidencePercent}%）`;
    case '中':
      return `研判：较可能为${result.name}（${result.category}）｜${result.era} · ${result.year}（置信度${confidencePercent}%）`;
    case '低':
    default:
      return `初判：可能为${result.name}（${result.category}）｜${result.era} · ${result.year}（置信度${confidencePercent}%，建议补拍确认）`;
  }
}

/**
 * 生成证据要点（最多8条，按优先级排序）
 */
function buildEvidenceBullets(result: RecognitionResult): string[] {
  const bullets: string[] = [];
  
  // 1) 主要特征（取前3个）
  if (result.features && result.features.length > 0) {
    const topFeatures = result.features.slice(0, 3).join('、');
    bullets.push(`主要特征：${topFeatures}`);
  }
  
  // 2-5) 构件细节（排除"待确认"）
  if (result.components) {
    const { components } = result;
    
    if (components.roofType && components.roofType !== '待确认') {
      bullets.push(`屋顶形制：${components.roofType}`);
    }
    
    if (components.dougongType && components.dougongType !== '待确认') {
      bullets.push(`斗拱类型：${components.dougongType}`);
    }
    
    if (components.paintingPattern && components.paintingPattern !== '待确认') {
      bullets.push(`彩画纹样：${components.paintingPattern}`);
    }
    
    // 脊兽
    if (components.beastCount > 0) {
      const beastTypesStr = components.beastTypes && components.beastTypes.length > 0
        ? `（${components.beastTypes.join('、')}）`
        : '';
      bullets.push(`脊兽：${components.beastCount}${beastTypesStr}`);
    }
  }
  
  // 6-8) GIS 信息
  if (result.gis) {
    if (result.gis.placeName) {
      bullets.push(`地理定位（推断）：${result.gis.placeName}`);
    }
    
    if (result.gis.dynastyContext) {
      bullets.push(`历史地理语境：${result.gis.dynastyContext}`);
    }
    
    if (result.gis.territoryLevel) {
      bullets.push(`政区/节点层级：${result.gis.territoryLevel}`);
    }
  }
  
  // 保证至少3条证据（使用必填字段作为 fallback）
  const fallbackBullets: string[] = [];
  if (bullets.length < 3) {
    const bullet1 = `识别对象：${result.name}`;
    if (!bullets.includes(bullet1)) {
      fallbackBullets.push(bullet1);
    }
  }
  if (bullets.length + fallbackBullets.length < 3) {
    const bullet2 = `类别与时代：${result.category}｜${result.era} · ${result.year}`;
    if (!bullets.includes(bullet2) && !fallbackBullets.includes(bullet2)) {
      fallbackBullets.push(bullet2);
    }
  }
  if (bullets.length + fallbackBullets.length < 3) {
    const bullet3 = `地点：${result.location}`;
    if (!bullets.includes(bullet3) && !fallbackBullets.includes(bullet3)) {
      fallbackBullets.push(bullet3);
    }
  }

  const allBullets = [...bullets, ...fallbackBullets];

  // 限制最多8条
  return allBullets.slice(0, 8);
}

/**
 * 生成多视角一致性结论
 */
function buildCrossView(result: RecognitionResult): PresentationReport['crossView'] {
  // 如果 fusion 存在，使用 fusion 的数据；否则使用单视角默认值
  const hasFusion = result.fusion !== undefined;
  const imageCount = hasFusion ? result.fusion!.imageCount : 1;
  const consistency = hasFusion
    ? result.fusion!.consistency
    : Math.max(0, Math.min(1, result.confidence));

  let verdict: string;

  if (!hasFusion) {
    // 未提供多视角融合数据时的专用 verdict
    verdict = '未提供多视角融合一致性指标，当前为单视角研判。';
  } else if (imageCount >= 2) {
    if (consistency >= 0.85) {
      verdict = '多视角一致性高，结论稳定。';
    } else if (consistency >= 0.70) {
      verdict = '多视角一致性中等，建议补充细部特写以增强结论。';
    } else {
      verdict = '多视角一致性偏低，当前结论不稳定，需要补拍关键构件。';
    }
  } else {
    verdict = '单视角输入，建议补充侧立面与檐口细部以提升稳定性。';
  }

  return {
    imageCount,
    consistency,
    verdict,
  };
}

/**
 * 生成不确定性说明（最多6条）
 */
function buildUncertainties(result: RecognitionResult, band: ConfidenceBand): string[] {
  const uncertainties: string[] = [];
  
  // 置信度偏低
  if (band === '低') {
    uncertainties.push('置信度偏低：建议补拍正立面/侧立面/构件特写。');
  }
  
  // 视角数量不足
  const imageCount = result.fusion?.imageCount ?? 1;
  if (imageCount < 3) {
    uncertainties.push('视角数量不足：多角度输入有助于交叉验证。');
  }
  
  // 部件级细节不确定
  if (result.components && result.components.confidence < 0.7) {
    uncertainties.push('部件级细节不确定：斗拱/脊兽/彩画需近景确认。');
  }
  
  // 地理定位不确定（使用标准化相等判断，避免 always-true）
  const uncertainLocations = ['未知', '待定位', '中国', '未提供'];
  const normalizedLocation = result.location.trim();
  if (uncertainLocations.includes(normalizedLocation)) {
    uncertainties.push('地理定位不确定：建议补拍环境信息或铭牌。');
  }
  
  // 限制最多6条
  return uncertainties.slice(0, 6);
}

/**
 * 默认补拍建议列表
 */
const DEFAULT_NEXT_SHOTS = [
  '正立面（含台基、柱网、门窗开间）',
  '侧立面（看屋顶起翘、檐口与山墙）',
  '檐口与斗拱近景（清晰可数铺作）',
  '屋脊与脊兽近景（数量与类型）',
  '彩画/纹样近景（和玺/旋子等）',
  '环境/铭牌/地名信息（用于定位与时代线索）',
];

/**
 * 生成补拍建议（至少3条，按缺失优先排序）
 */
function buildNextShots(result: RecognitionResult): string[] {
  const nextShots: string[] = [];
  const missingComponents: string[] = [];
  
  // 检查哪些构件信息缺失（"待确认"）
  if (result.components) {
    const { components } = result;
    
    if (!components.roofType || components.roofType === '待确认') {
      missingComponents.push('roof');
    }
    if (!components.dougongType || components.dougongType === '待确认') {
      missingComponents.push('dougong');
    }
    if (!components.paintingPattern || components.paintingPattern === '待确认') {
      missingComponents.push('painting');
    }
    if (components.beastCount === 0 || !components.beastTypes?.length) {
      missingComponents.push('beast');
    }
  }
  
  // 根据缺失构件，优先添加对应补拍建议
  if (missingComponents.includes('dougong')) {
    nextShots.push('檐口与斗拱近景（清晰可数铺作）');
  }
  if (missingComponents.includes('beast')) {
    nextShots.push('屋脊与脊兽近景（数量与类型）');
  }
  if (missingComponents.includes('painting')) {
    nextShots.push('彩画/纹样近景（和玺/旋子等）');
  }
  if (missingComponents.includes('roof')) {
    nextShots.push('侧立面（看屋顶起翘、檐口与山墙）');
  }
  
  // 补充剩余的默认建议（使用精确匹配去重，保留顺序）
  const seen = new Set(nextShots);
  for (const shot of DEFAULT_NEXT_SHOTS) {
    if (!seen.has(shot)) {
      nextShots.push(shot);
      seen.add(shot);
    }
    if (nextShots.length >= 8) break;
  }

  // 确保至少3条，最多8条
  return nextShots.slice(0, 8);
}

/**
 * 从 RecognitionResult 构建研判报告
 * 
 * @param result 识别结果
 * @returns 结构化研判报告
 */
export function buildPresentationReport(result: RecognitionResult): PresentationReport {
  const confidenceBand = getConfidenceBand(result.confidence);
  
  return {
    headline: buildHeadline(result, confidenceBand),
    confidenceBand,
    confidence: result.confidence,
    evidenceBullets: buildEvidenceBullets(result),
    crossView: buildCrossView(result),
    uncertainties: buildUncertainties(result, confidenceBand),
    nextShots: buildNextShots(result),
  };
}
