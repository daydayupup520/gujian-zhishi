/**
 * 智谱清言 AI 识别模块
 * 用于识别古建筑图片的类型、年代、构件细节与时空信息
 */

import type { RecognitionResult } from '../../types/ai';

const API_BASE = 'https://open.bigmodel.cn/api/paas/v4';
const MODEL = 'glm-4v-plus';

// 从环境变量获取 API Key
const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY || '';

type Category = RecognitionResult['category'];
type ComponentsInfo = NonNullable<RecognitionResult['components']>;
type FusionInfo = NonNullable<RecognitionResult['fusion']>;
type GisInfo = NonNullable<RecognitionResult['gis']>;

const CATEGORY_COMPONENT_DEFAULTS: Record<Category, Omit<ComponentsInfo, 'confidence'>> = {
  皇宫: {
    dougongType: '重昂七铺作',
    beastCount: 10,
    beastTypes: ['龙', '凤', '狮', '天马'],
    paintingPattern: '和玺彩画',
    roofType: '重檐庑殿顶',
  },
  官府: {
    dougongType: '单昂五铺作',
    beastCount: 7,
    beastTypes: ['狮', '海马', '獬豸'],
    paintingPattern: '旋子彩画',
    roofType: '歇山顶',
  },
  民居: {
    dougongType: '简化斗拱',
    beastCount: 3,
    beastTypes: ['狮', '海马'],
    paintingPattern: '民间吉祥纹样',
    roofType: '硬山顶',
  },
  桥梁: {
    dougongType: '桥亭抬梁式节点',
    beastCount: 2,
    beastTypes: ['狮', '海马'],
    paintingPattern: '简饰纹样',
    roofType: '桥亭组合顶',
  },
  其他: {
    dougongType: '待确认',
    beastCount: 0,
    beastTypes: [],
    paintingPattern: '待确认',
    roofType: '待确认',
  },
};

const LOCATION_GEO_TABLE: Array<{ keywords: string[]; placeName: string; lat: number; lng: number }> = [
  { keywords: ['北京', '故宫', '紫禁城'], placeName: '北京', lat: 39.9042, lng: 116.4074 },
  { keywords: ['山西', '平遥', '太原'], placeName: '山西', lat: 37.8735, lng: 112.5624 },
  { keywords: ['河北', '赵县'], placeName: '河北', lat: 38.0371, lng: 114.4698 },
  { keywords: ['福建'], placeName: '福建', lat: 26.0745, lng: 119.2965 },
  { keywords: ['江苏', '扬州'], placeName: '江苏', lat: 32.3942, lng: 119.421 },
  { keywords: ['河南'], placeName: '河南', lat: 34.7466, lng: 113.6254 },
  { keywords: ['西安', '陕西'], placeName: '陕西', lat: 34.3416, lng: 108.9398 },
  { keywords: ['洛阳'], placeName: '河南洛阳', lat: 34.6197, lng: 112.454 },
  { keywords: ['南京'], placeName: '江苏南京', lat: 32.0603, lng: 118.7969 },
  { keywords: ['杭州', '浙江'], placeName: '浙江', lat: 30.2741, lng: 120.1551 },
];

const DEFAULT_GEO = { placeName: '中国', lat: 35.8617, lng: 104.1954 };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  return value as Record<string, unknown>;
};

const asNumber = (value: unknown, fallback: number): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const asString = (value: unknown, fallback: string): string => {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};

/**
 * 将图片文件转换为 Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('读取图片失败'));
        return;
      }
      const base64Data = reader.result.split(',')[1] ?? '';
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 批量图片转换为 Base64
 */
export async function fileToBase64Many(files: File[]): Promise<string[]> {
  const converted = await Promise.all(files.map((file) => fileToBase64(file)));
  return converted.filter((item) => item.length > 0);
}

const buildPrompt = (imageCount: number) => `请识别这${imageCount}张中国古代建筑图像（多视角），并交叉验证后以 JSON 返回：
{
  "name": "建筑名称",
  "category": "建筑类别（民居/官府/皇宫/桥梁/其他）",
  "era": "所属朝代",
  "year": "建造年代",
  "location": "所在地点",
  "features": ["建筑特点1", "建筑特点2", "建筑特点3"],
  "description": "详细描述",
  "confidence": 0.95,
  "components": {
    "dougongType": "斗拱类型（如重昂七铺作）",
    "beastCount": 10,
    "beastTypes": ["脊兽种类1", "脊兽种类2"],
    "paintingPattern": "彩画纹样类型",
    "roofType": "屋顶形制",
    "confidence": 0.9
  },
  "fusion": {
    "imageCount": ${imageCount},
    "consistency": 0.9,
    "crossViewSummary": "多视角结论"
  },
  "gis": {
    "placeName": "标准地名",
    "lat": 39.9042,
    "lng": 116.4074,
    "dynastyContext": "该建筑在所属朝代的历史地理语境",
    "territoryLevel": "都城/州府/县治/交通节点/村落",
    "timeline": [
      {
        "period": "时期名",
        "territoryContext": "疆域或政区背景",
        "locationRole": "地点角色"
      }
    ]
  }
}

要求：
1. 只输出 JSON，不输出解释文字。
2. 建筑必须是 1911 年前中国古代建筑；排除庙宇与宝塔。
3. category 只能是 民居/官府/皇宫/桥梁/其他。
4. components 和 gis 必须给出，若无法确认请合理估计并在 confidence 中体现不确定度。
5. fusion.consistency 体现多图一致性（0-1）。`;

/**
 * 单图识别（兼容入口）
 */
export async function recognizeBuilding(imageBase64: string): Promise<RecognitionResult> {
  return recognizeBuildingMulti([imageBase64]);
}

/**
 * 多图融合识别
 */
export async function recognizeBuildingMulti(imageBase64List: string[]): Promise<RecognitionResult> {
  const normalized = imageBase64List.filter((item) => typeof item === 'string' && item.length > 0);
  if (normalized.length === 0) {
    throw new Error('未提供可识别的图片数据');
  }

  if (!API_KEY) {
    throw new Error('未配置 API Key，请在 .env 文件中设置 VITE_ZHIPU_API_KEY');
  }

  const prompt = buildPrompt(normalized.length);

  try {
    const content = [
      ...normalized.map((imageBase64) => ({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${imageBase64}`,
        },
      })),
      {
        type: 'text',
        text: prompt,
      },
    ];

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API 请求失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content ?? '';
    return parseRecognitionResult(contentText, normalized.length);
  } catch (error) {
    console.error('识别失败:', error);
    throw error;
  }
}

/**
 * 解析 AI 返回的结果
 */
function parseRecognitionResult(content: string, imageCount: number): RecognitionResult {
  try {
    return validateResult(JSON.parse(content), imageCount);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return validateResult(JSON.parse(jsonMatch[0]), imageCount);
    }
    throw new Error('无法解析识别结果');
  }
}

const inferComponents = (category: Category, confidence: number): ComponentsInfo => {
  const defaults = CATEGORY_COMPONENT_DEFAULTS[category];
  return {
    ...defaults,
    confidence: clamp(confidence * 0.92, 0.45, 0.99),
  };
};

const inferDynastyContext = (era: string): string => {
  if (era.includes('先秦') || era.includes('秦') || era.includes('汉')) {
    return '该建筑处于早期国家形制形成期，地理格局以都城与区域中心为主。';
  }
  if (era.includes('隋') || era.includes('唐') || era.includes('宋') || era.includes('元')) {
    return '该建筑与中古时期州府交通网络和区域经济中心关联紧密。';
  }
  if (era.includes('明') || era.includes('清')) {
    return '该建筑处于明清行政体系与礼制空间高度成熟阶段。';
  }
  if (era.includes('民国') || era.includes('近代')) {
    return '该建筑位于传统格局向近代城市体系过渡的历史节点。';
  }
  return '该建筑处于中国历史地理格局的重要演化阶段。';
};

const inferTerritoryLevel = (category: Category): string => {
  if (category === '皇宫') return '都城核心';
  if (category === '官府') return '州府县治节点';
  if (category === '桥梁') return '交通枢纽';
  if (category === '民居') return '聚落社区';
  return '区域节点';
};

const buildTimeline = (era: string, placeName: string): GisInfo['timeline'] => {
  if (era.includes('明') || era.includes('清')) {
    return [
      { period: '唐宋时期', territoryContext: '区域政区与城镇网络逐步稳定', locationRole: `${placeName}形成重要城市节点` },
      { period: '元代', territoryContext: '跨区域治理体系强化', locationRole: `${placeName}在交通与行政体系中地位提升` },
      { period: '明清时期', territoryContext: '礼制与行政空间定型', locationRole: `${placeName}成为传统建筑存量集中区` },
    ];
  }

  if (era.includes('隋') || era.includes('唐') || era.includes('宋') || era.includes('元')) {
    return [
      { period: '秦汉时期', territoryContext: '郡县体系奠基', locationRole: `${placeName}纳入区域治理框架` },
      { period: '隋唐时期', territoryContext: '大一统交通体系完善', locationRole: `${placeName}成为重要交通或行政节点` },
      { period: '宋元时期', territoryContext: '城市与商贸网络扩展', locationRole: `${placeName}建筑活动显著增强` },
    ];
  }

  return [
    { period: '早期阶段', territoryContext: '区域聚落体系形成', locationRole: `${placeName}出现早期建筑活动` },
    { period: '发展阶段', territoryContext: '政区与交通网络演化', locationRole: `${placeName}逐步成为区域节点` },
    { period: '成熟阶段', territoryContext: '历史格局稳定', locationRole: `${placeName}形成可识别建筑遗存` },
  ];
};

const inferGis = (location: string, era: string, category: Category): GisInfo => {
  const hit = LOCATION_GEO_TABLE.find((item) => item.keywords.some((key) => location.includes(key))) ?? DEFAULT_GEO;
  return {
    placeName: hit.placeName,
    lat: hit.lat,
    lng: hit.lng,
    dynastyContext: inferDynastyContext(era),
    territoryLevel: inferTerritoryLevel(category),
    timeline: buildTimeline(era, hit.placeName),
  };
};

const parseComponents = (raw: unknown, category: Category, confidence: number): ComponentsInfo => {
  const defaults = inferComponents(category, confidence);
  const data = asRecord(raw);
  if (!data) return defaults;

  const beastTypes = asStringArray(data.beastTypes);
  const parsedConfidence = clamp(asNumber(data.confidence, defaults.confidence), 0, 1);
  const beastCountRaw = asNumber(data.beastCount, defaults.beastCount);

  return {
    dougongType: asString(data.dougongType, defaults.dougongType),
    beastCount: clamp(Math.round(beastCountRaw), 0, 16),
    beastTypes: beastTypes.length > 0 ? beastTypes : defaults.beastTypes,
    paintingPattern: asString(data.paintingPattern, defaults.paintingPattern),
    roofType: asString(data.roofType, defaults.roofType),
    confidence: parsedConfidence,
  };
};

const parseFusion = (raw: unknown, imageCount: number, confidence: number): FusionInfo => {
  const data = asRecord(raw);
  const defaultConsistency = clamp((imageCount > 1 ? 0.78 : 0.65) + confidence * 0.2, 0.45, 0.99);

  if (!data) {
    return {
      imageCount,
      consistency: defaultConsistency,
      crossViewSummary: imageCount > 1 ? '多视角特征一致，结论稳定。' : '单视角识别，建议补充侧立面与细部照片。',
    };
  }

  return {
    imageCount: clamp(Math.round(asNumber(data.imageCount, imageCount)), 1, 12),
    consistency: clamp(asNumber(data.consistency, defaultConsistency), 0, 1),
    crossViewSummary: asString(
      data.crossViewSummary,
      imageCount > 1 ? '多视角特征一致，结论稳定。' : '单视角识别，建议补充侧立面与细部照片。',
    ),
  };
};

const parseGis = (raw: unknown, location: string, era: string, category: Category): GisInfo => {
  const fallback = inferGis(location, era, category);
  const data = asRecord(raw);
  if (!data) return fallback;

  const lat = clamp(asNumber(data.lat, fallback.lat), 15, 55);
  const lng = clamp(asNumber(data.lng, fallback.lng), 70, 140);

  const timelineRaw = Array.isArray(data.timeline) ? data.timeline : [];
  const timeline = timelineRaw
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => item !== null)
    .map((item) => ({
      period: asString(item.period, '历史时期'),
      territoryContext: asString(item.territoryContext, '疆域与政区背景待补充'),
      locationRole: asString(item.locationRole, '地点角色待补充'),
    }));

  return {
    placeName: asString(data.placeName, fallback.placeName),
    lat,
    lng,
    dynastyContext: asString(data.dynastyContext, fallback.dynastyContext),
    territoryLevel: asString(data.territoryLevel, fallback.territoryLevel),
    timeline: timeline.length > 0 ? timeline : fallback.timeline,
  };
};

/**
 * 验证并规范化结果
 */
function validateResult(result: unknown, imageCount: number): RecognitionResult {
  const validCategories: Category[] = ['民居', '官府', '皇宫', '桥梁', '其他'];
  const data = asRecord(result) ?? {};

  const category =
    typeof data.category === 'string' && validCategories.includes(data.category as Category)
      ? (data.category as Category)
      : '其他';

  const features = asStringArray(data.features);
  const confidence = clamp(asNumber(data.confidence, 0.5), 0, 1);
  const location = asString(data.location, '未知');
  const era = asString(data.era, '未知');

  return {
    name: asString(data.name, '未知建筑'),
    category,
    era,
    year: asString(data.year, '未知'),
    location,
    features,
    description: asString(data.description, ''),
    confidence,
    components: parseComponents(data.components, category, confidence),
    fusion: parseFusion(data.fusion, imageCount, confidence),
    gis: parseGis(data.gis, location, era, category),
  };
}

/**
 * 模拟识别（用于测试和演示）
 */
export function mockRecognizeBuilding(imageCount = 1): Promise<RecognitionResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const confidence = imageCount > 1 ? 0.96 : 0.93;
      const base: RecognitionResult = {
        name: '故宫太和殿',
        category: '皇宫',
        era: '明清',
        year: '1420年',
        location: '北京',
        features: ['重檐庑殿顶', '黄色琉璃瓦', '和玺彩画', '龙纹装饰'],
        description:
          '故宫太和殿是中国现存最大的木结构大殿，位于北京紫禁城南北主轴线的显要位置。建筑气势恢宏，装饰华丽，是中国古代宫殿建筑的杰出代表。',
        confidence,
      };

      resolve({
        ...base,
        components: parseComponents(undefined, base.category, base.confidence),
        fusion: parseFusion(undefined, imageCount, base.confidence),
        gis: parseGis(undefined, base.location, base.era, base.category),
      });
    }, 1200);
  });
}
