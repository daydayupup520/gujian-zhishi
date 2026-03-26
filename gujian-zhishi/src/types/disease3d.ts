/**
 * 病害与3D联动类型定义
 */

export interface Disease3DMapping {
  id: string;
  diseaseId: string;
  type: '裂缝' | '腐蚀' | '风化' | '剥落' | '虫蛀' | '变形';
  severity: '轻微' | '中度' | '严重';
  // 3D空间位置
  position: {
    x: number;
    y: number;
    z: number;
  };
  // 影响范围（半径）
  radius: number;
  // 关联的构件名称
  componentName: string;
  // 构件类型（用于确定在模型上的位置）
  componentType: 'foundation' | 'column' | 'beam' | 'wall' | 'roof' | 'decoration' | 'bridge_arch' | 'bridge_pier';
  description: string;
  recommendation: string;
  estimatedCost: string;
  urgency: '立即处理' | '近期处理' | '定期监测';
}

export interface DiseasePrediction {
  year: number;
  // 病害恶化程度 (0-100)
  severityProgression: number;
  // 影响面积扩散比例
  areaSpread: number;
  // 结构安全评分 (0-100)
  structuralSafetyScore: number;
  // 修缮紧急度
  maintenanceUrgency: '低' | '中' | '高' | '紧急';
  // 预计修缮成本增长
  costMultiplier: number;
  // 恶化描述
  description: string;
}

export interface ComponentDiseaseHotspot {
  componentType: string;
  componentName: string;
  position: { x: number; y: number; z: number };
  // 热力值 (0-1)
  heatValue: number;
  diseases: Disease3DMapping[];
  // 典型病害类型
  typicalDiseases: string[];
  // 预防建议
  preventionTips: string;
}

// 建筑类型对应的典型病害位置映射
export const CATEGORY_DISEASE_MAPPINGS: Record<string, ComponentDiseaseHotspot[]> = {
  皇宫: [
    {
      componentType: 'column',
      componentName: '檐柱',
      position: { x: -1.9, y: -0.55, z: 1.2 },
      heatValue: 0.7,
      diseases: [],
      typicalDiseases: ['柱根糟朽', '裂缝', '虫蛀'],
      preventionTips: '定期检查柱根防腐层，保持通风干燥'
    },
    {
      componentType: 'roof',
      componentName: '屋檐',
      position: { x: 0, y: 1.25, z: 0 },
      heatValue: 0.8,
      diseases: [],
      typicalDiseases: ['彩画脱落', '瓦片破损', '斗拱松动'],
      preventionTips: '定期清理屋顶杂物，检查防水层'
    },
    {
      componentType: 'foundation',
      componentName: '台基',
      position: { x: 0, y: -1.75, z: 0 },
      heatValue: 0.5,
      diseases: [],
      typicalDiseases: ['石材风化', '排水不畅'],
      preventionTips: '保持台基周围排水通畅'
    }
  ],
  官府: [
    {
      componentType: 'column',
      componentName: '木柱',
      position: { x: -1.5, y: -0.35, z: 1.0 },
      heatValue: 0.75,
      diseases: [],
      typicalDiseases: ['柱根腐蚀', '裂缝', '倾斜'],
      preventionTips: '做好柱根防水处理'
    },
    {
      componentType: 'wall',
      componentName: '山墙',
      position: { x: 3.8, y: -0.35, z: 0 },
      heatValue: 0.6,
      diseases: [],
      typicalDiseases: ['墙体开裂', '抹灰脱落'],
      preventionTips: '检查墙体沉降情况'
    }
  ],
  民居: [
    {
      componentType: 'wall',
      componentName: '夯土墙',
      position: { x: 0, y: -0.85, z: 2.0 },
      heatValue: 0.85,
      diseases: [],
      typicalDiseases: ['墙面剥落', '裂缝', '受潮'],
      preventionTips: '做好屋面防水，保持墙体干燥'
    },
    {
      componentType: 'beam',
      componentName: '木梁',
      position: { x: 0, y: -0.3, z: 0 },
      heatValue: 0.7,
      diseases: [],
      typicalDiseases: ['虫蛀', '腐朽', '变形'],
      preventionTips: '定期检查白蚁，做好防腐'
    }
  ],
  桥梁: [
    {
      componentType: 'bridge_arch',
      componentName: '拱圈',
      position: { x: 0, y: -0.25, z: 0 },
      heatValue: 0.8,
      diseases: [],
      typicalDiseases: ['拱圈变形', '裂缝', '石材风化'],
      preventionTips: '监测拱圈沉降和位移'
    },
    {
      componentType: 'bridge_pier',
      componentName: '桥墩',
      position: { x: -1.1, y: -1.0, z: 0 },
      heatValue: 0.7,
      diseases: [],
      typicalDiseases: ['基础冲刷', '墩身裂缝'],
      preventionTips: '定期清理河道，检查基础稳定性'
    }
  ]
};

// 病害时序预测数据生成
export function generateDiseasePredictions(
  currentSeverity: '轻微' | '中度' | '严重',
  diseaseType: string
): DiseasePrediction[] {
  const baseSeverity = currentSeverity === '轻微' ? 20 : currentSeverity === '中度' ? 50 : 80;
  const predictions: DiseasePrediction[] = [];
  
  const years = [5, 10, 20, 50];
  const multipliers = [1.3, 1.8, 2.8, 4.5];
  
  years.forEach((year, index) => {
    const progression = Math.min(baseSeverity * multipliers[index], 100);
    predictions.push({
      year,
      severityProgression: Math.round(progression),
      areaSpread: Math.round(progression * 0.8),
      structuralSafetyScore: Math.max(100 - progression, 20),
      maintenanceUrgency: progression > 80 ? '紧急' : progression > 60 ? '高' : progression > 40 ? '中' : '低',
      costMultiplier: multipliers[index],
      description: getPredictionDescription(diseaseType, year, progression)
    });
  });
  
  return predictions;
}

function getPredictionDescription(diseaseType: string, year: number, severity: number): string {
  if (severity > 80) {
    return `${year}年后${diseaseType}已极度恶化，结构安全受到严重威胁，必须立即进行大规模修缮`;
  } else if (severity > 60) {
    return `${year}年后${diseaseType}明显恶化，影响范围扩大，建议近期安排修缮`;
  } else if (severity > 40) {
    return `${year}年后${diseaseType}有所发展，需要加强监测并准备修缮方案`;
  } else {
    return `${year}年后${diseaseType}发展缓慢，定期监测即可`;
  }
}
