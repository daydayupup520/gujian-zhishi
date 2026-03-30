/**
 * 多模型AI识别模块
 * 支持智谱清言、阿里通义等多个模型
 * 自动选择最佳结果
 */

import type { RecognitionResult } from '../../types/ai';

// 模型配置
const MODELS = {
  // 智谱清言 - 平衡之选
  zhipu: {
    name: 'glm-4v-plus',
    apiBase: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: import.meta.env.VITE_ZHIPU_API_KEY || '',
    enabled: true,
  },
  // 阿里通义 - 性能之王
  qwen: {
    name: 'qwen-vl-max-latest',
    apiBase: 'https://dashscope.aliyuncs.com/api/v1',
    apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY || '',
    enabled: !!import.meta.env.VITE_DASHSCOPE_API_KEY,
  },
  // 百度文心 - 备选
  ernie: {
    name: 'ernie-4.0-turbo-8k',
    apiBase: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
    apiKey: import.meta.env.VITE_BAIDU_API_KEY || '',
    enabled: !!import.meta.env.VITE_BAIDU_API_KEY,
  },
};

// 多模型融合模式
type FusionMode = 'single' | 'voting' | 'best';
const FUSION_MODE: FusionMode = (import.meta.env.VITE_AI_FUSION_MODE as FusionMode) || 'best';

const CATEGORY_COMPONENT_DEFAULTS: Record<RecognitionResult['category'], any> = {
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

/**
 * 构建提示词 - 优化版（更详细的指令）
 */
const buildPrompt = (imageCount: number) => `你是一位资深中国古代建筑研究专家，精通建筑史、营造法式和考古学。

请对提供的${imageCount}张中国古代建筑图像进行专业识别和分析，以JSON格式返回详细结果：

{
  "name": "建筑具体名称（如：故宫太和殿、赵州桥）",
  "category": "建筑类别（必须从以下选择：民居/官府/皇宫/桥梁/其他）",
  "era": "所属朝代（如：明清、隋唐、宋元）",
  "year": "具体建造年代或时期（如：1420年、北宋皇祐年间）",
  "location": "所在地点（省市县）",
  "features": ["建筑特点1", "建筑特点2", "建筑特点3", "建筑特点4"],
  "description": "200字以内的专业建筑描述，包含历史价值、艺术价值、科学价值",
  "confidence": 0.95,
  "components": {
    "dougongType": "斗拱具体类型（如：七踩重昂、单翘重昂五踩）",
    "beastCount": 10,
    "beastTypes": ["脊兽1", "脊兽2", "脊兽3"],
    "paintingPattern": "彩画类型（和玺彩画/旋子彩画/苏式彩画/民间彩画）",
    "roofType": "屋顶形制（庑殿顶/歇山顶/悬山顶/硬山顶/卷棚顶/攒尖顶）",
    "confidence": 0.92
  },
  "fusion": {
    "imageCount": ${imageCount},
    "consistency": 0.94,
    "crossViewSummary": "多视角分析结论，指出各角度的一致性和互补性"
  },
  "gis": {
    "placeName": "标准地名",
    "lat": 39.9042,
    "lng": 116.4074,
    "dynastyContext": "详细的历史地理语境（100字以内）",
    "territoryLevel": "行政级别（都城/州府/县治/交通节点/村落）",
    "timeline": [
      {
        "period": "历史时期",
        "territoryContext": "该时期的疆域政区背景",
        "locationRole": "该地点在当时的作用"
      }
    ]
  }
}

识别要求：
1. 必须是中国古代建筑（1911年前建造），排除现代仿古建筑
2. category 严格限定：民居/官府/皇宫/桥梁/其他，不要输出寺庙、塔等类别
3. 所有字段必须填写，不确定时给出最可能的结果并降低confidence
4. 多图场景下要交叉验证，fusion.consistency反映一致性
5. 只输出JSON，不要任何解释性文字
6. 基于图像细节（斗拱、屋顶、彩画、台基）进行专业判断`;

/**
 * 调用智谱清言
 */
async function callZhipu(imageBase64List: string[]): Promise<RecognitionResult> {
  const model = MODELS.zhipu;
  
  const content = [
    ...imageBase64List.map((imageBase64) => ({
      type: 'image_url' as const,
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    })),
    { type: 'text' as const, text: buildPrompt(imageBase64List.length) },
  ];

  const response = await fetch(`${model.apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${model.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.name,
      messages: [{ role: 'user', content }],
      temperature: 0.1, // 降低随机性，提高准确性
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    throw new Error(`智谱API错误: ${response.status}`);
  }

  const data = await response.json();
  return parseAIResponse(data.choices?.[0]?.message?.content, imageBase64List.length, 'zhipu');
}

/**
 * 调用阿里通义千问
 */
async function callQwen(imageBase64List: string[]): Promise<RecognitionResult> {
  const model = MODELS.qwen;
  
  const messages = [
    {
      role: 'user',
      content: [
        ...imageBase64List.map((imageBase64) => ({
          type: 'image' as const,
          image: { url: `data:image/jpeg;base64,${imageBase64}` },
        })),
        { type: 'text' as const, text: buildPrompt(imageBase64List.length) },
      ],
    },
  ];

  const response = await fetch(`${model.apiBase}/services/aigc/multimodal-generation/generation`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${model.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model.name,
      input: { messages },
      parameters: {
        temperature: 0.1,
        result_format: 'message',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`通义API错误: ${response.status}`);
  }

  const data = await response.json();
  return parseAIResponse(data.output?.choices?.[0]?.message?.content, imageBase64List.length, 'qwen');
}

/**
 * 解析AI响应 - 增强版
 */
function parseAIResponse(content: string, imageCount: number, model: string): RecognitionResult {
  try {
    // 提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('未找到JSON数据');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    // 验证必要字段
    if (!data.name || !data.category) {
      throw new Error('缺少必要字段');
    }
    
    // 验证类别
    const validCategories = ['民居', '官府', '皇宫', '桥梁', '其他'];
    const category = validCategories.includes(data.category) ? data.category : '其他';
    
    // 构建标准化结果
    return {
      name: data.name || '未知建筑',
      category,
      era: data.era || '未知',
      year: data.year || '未知',
      location: data.location || '未知',
      features: Array.isArray(data.features) ? data.features : [],
      description: data.description || '',
      confidence: Math.min(1, Math.max(0, data.confidence || 0.5)),
      components: {
        ...CATEGORY_COMPONENT_DEFAULTS[category],
        ...data.components,
        confidence: data.components?.confidence || 0.5,
      },
      fusion: {
        imageCount,
        consistency: data.fusion?.consistency || 0.5,
        crossViewSummary: data.fusion?.crossViewSummary || '',
      },
      gis: {
        placeName: data.gis?.placeName || data.location || '未知',
        lat: data.gis?.lat || 35.8617,
        lng: data.gis?.lng || 104.1954,
        dynastyContext: data.gis?.dynastyContext || '',
        territoryLevel: data.gis?.territoryLevel || '未知',
        timeline: Array.isArray(data.gis?.timeline) ? data.gis.timeline : [],
      },
      _model: model, // 记录使用的模型
    } as RecognitionResult;
  } catch (error) {
    console.error('解析失败:', error);
    throw new Error(`AI响应解析失败: ${error}`);
  }
}

/**
 * 多模型投票 - 选择最佳结果
 */
function selectBestResult(results: RecognitionResult[]): RecognitionResult {
  if (results.length === 1) return results[0];
  
  // 按置信度排序
  const sorted = results.sort((a, b) => b.confidence - a.confidence);
  
  // 如果最高置信度>0.9，直接采用
  if (sorted[0].confidence > 0.9) {
    return { ...sorted[0], _fusion: 'best_confidence' };
  }
  
  // 投票决定类别
  const categoryVotes: Record<string, number> = {};
  results.forEach(r => {
    categoryVotes[r.category] = (categoryVotes[r.category] || 0) + r.confidence;
  });
  
  const bestCategory = Object.entries(categoryVotes)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // 选择该类别的最佳结果
  const bestResult = sorted.find(r => r.category === bestCategory) || sorted[0];
  
  return { ...bestResult, _fusion: 'voting' };
}

/**
 * 主识别函数 - 多模型融合
 */
export async function recognizeBuildingMulti(imageBase64List: string[]): Promise<RecognitionResult> {
  const normalized = imageBase64List.filter((item) => typeof item === 'string' && item.length > 0);
  if (normalized.length === 0) {
    throw new Error('未提供可识别的图片数据');
  }
  
  const results: RecognitionResult[] = [];
  const errors: string[] = [];
  
  // 并行调用所有启用的模型
  const promises: Promise<void>[] = [];
  
  if (MODELS.zhipu.enabled) {
    promises.push(
      callZhipu(normalized)
        .then(r => results.push(r))
        .catch(e => errors.push(`智谱: ${e.message}`))
    );
  }
  
  if (MODELS.qwen.enabled) {
    promises.push(
      callQwen(normalized)
        .then(r => results.push(r))
        .catch(e => errors.push(`通义: ${e.message}`))
    );
  }
  
  // 等待所有模型返回
  await Promise.all(promises);
  
  if (results.length === 0) {
    throw new Error(`所有模型调用失败: ${errors.join(', ')}`);
  }
  
  // 根据融合模式选择结果
  switch (FUSION_MODE) {
    case 'voting':
      return selectBestResult(results);
    case 'best':
      return results.sort((a, b) => b.confidence - a.confidence)[0];
    case 'single':
    default:
      return results[0];
  }
}

/**
 * 单图识别（兼容接口）
 */
export async function recognizeBuilding(imageBase64: string): Promise<RecognitionResult> {
  return recognizeBuildingMulti([imageBase64]);
}

/**
 * 文件转Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1] ?? '';
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 批量转换
 */
export async function fileToBase64Many(files: File[]): Promise<string[]> {
  const converted = await Promise.all(files.map((file) => fileToBase64(file)));
  return converted.filter((item) => item.length > 0);
}
