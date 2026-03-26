import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import type { RecognitionResult } from '../../types/ai';

const MODEL_URL = '/models/mobilenet/model.json';
const MODEL_CACHE_NAME = 'gujian-local-ai-model-cache-v1';

let modelPromise: Promise<mobilenet.MobileNet> | null = null;

type InputImage = Parameters<mobilenet.MobileNet['classify']>[0];

const CATEGORY_RULES: Array<{ category: RecognitionResult['category']; keywords: string[] }> = [
  { category: '桥梁', keywords: ['bridge', 'viaduct', 'suspension'] },
  { category: '皇宫', keywords: ['palace', 'castle', 'fortress'] },
  { category: '官府', keywords: ['courthouse', 'government', 'city hall'] },
  { category: '民居', keywords: ['house', 'residence', 'cottage', 'villa', 'home'] },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const toChineseCategory = (className: string): RecognitionResult['category'] => {
  const lower = className.toLowerCase();
  const matched = CATEGORY_RULES.find((rule) => rule.keywords.some((keyword) => lower.includes(keyword)));
  return matched?.category ?? '其他';
};

const toSourceTag = '本地MobileNet';

const normalizeResult = (
  topPredictions: Array<{ className: string; probability: number }>,
  imageCount: number,
): RecognitionResult => {
  const top1 = topPredictions[0] ?? { className: 'ancient architecture', probability: 0.5 };
  const category = toChineseCategory(top1.className);
  const confidence = clamp(top1.probability, 0.2, 0.98);
  const uniqueFeatures = Array.from(new Set(topPredictions.map((item) => item.className)));

  return {
    name: `${top1.className}（本地推理）`,
    category,
    era: '待考证（本地模型估计）',
    year: '1911年前（演示估计）',
    location: '中国（本地模型无法精准定位）',
    features: uniqueFeatures.length > 0 ? uniqueFeatures : ['古建筑轮廓', '屋顶结构', '立面纹理'],
    description: `由${toSourceTag}离线识别得到，适合演示“云端 + 本地双AI架构”。该结果用于现场展示，不作为文保鉴定依据。`,
    confidence,
    components: {
      dougongType: '待确认（本地通用模型）',
      beastCount: 0,
      beastTypes: [],
      paintingPattern: '待确认',
      roofType: '待确认',
      confidence: clamp(confidence * 0.85, 0.2, 0.95),
    },
    fusion: {
      imageCount,
      consistency: clamp(0.6 + confidence * 0.25, 0.45, 0.95),
      crossViewSummary:
        imageCount > 1
          ? '本地模型已完成多图离线汇总，适用于无网络环境演示。'
          : '本地模型已完成单图离线识别，建议补充多角度图片提升稳定性。',
    },
    gis: {
      placeName: '中国',
      lat: 35.8617,
      lng: 104.1954,
      dynastyContext: '本地通用视觉模型无法提供精确历史地理语境。',
      territoryLevel: '待确认',
      timeline: [
        {
          period: '古代',
          territoryContext: '仅用于离线识别演示，不代表真实考据结论。',
          locationRole: '示意位置',
        },
      ],
    },
  };
};

async function cacheModelAssets(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cache = await caches.open(MODEL_CACHE_NAME);
    let modelJson = await cache.match(MODEL_URL);

    if (!modelJson) {
      const modelResponse = await fetch(MODEL_URL);
      if (!modelResponse.ok) {
        return;
      }
      await cache.put(MODEL_URL, modelResponse.clone());
      modelJson = modelResponse;
    }

    const parsed = (await modelJson.clone().json()) as {
      weightsManifest?: Array<{ paths?: string[] }>;
    };

    const shardPaths = (parsed.weightsManifest ?? []).flatMap((entry) => entry.paths ?? []);
    const baseUrl = MODEL_URL.slice(0, MODEL_URL.lastIndexOf('/') + 1);

    await Promise.all(
      shardPaths.map(async (path) => {
        const absoluteUrl = new URL(path, baseUrl).toString();
        const matched = await cache.match(absoluteUrl);
        if (matched) {
          return;
        }
        const response = await fetch(absoluteUrl);
        if (response.ok) {
          await cache.put(absoluteUrl, response.clone());
        }
      }),
    );
  } catch {
    // 缓存失败时不阻断识别流程（例如首次离线进入）
  }
}

export async function loadLocalRecognitionModel(): Promise<mobilenet.MobileNet> {
  if (!modelPromise) {
    modelPromise = (async () => {
      await cacheModelAssets();
      return mobilenet.load({ modelUrl: MODEL_URL, version: 1, alpha: 1.0 });
    })();
  }
  return modelPromise;
}

export async function classifyImageLocally(image: InputImage, topK = 3): Promise<RecognitionResult> {
  const model = await loadLocalRecognitionModel();
  const predictions = await model.classify(image, topK);
  return normalizeResult(predictions, 1);
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('本地图片读取失败'));
    };
    image.src = url;
  });
}

export async function recognizeBuildingLocalMulti(files: File[]): Promise<RecognitionResult> {
  if (files.length === 0) {
    throw new Error('请先上传图片');
  }

  const model = await loadLocalRecognitionModel();
  const predictions = await Promise.all(
    files.map(async (file) => {
      const image = await fileToImage(file);
      const result = await model.classify(image, 3);
      return result[0] ?? { className: 'ancient architecture', probability: 0.45 };
    }),
  );

  const meanConfidence =
    predictions.reduce((sum, item) => sum + item.probability, 0) / Math.max(1, predictions.length);

  const ranked = [...predictions]
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .map((item, idx) => ({
      className: item.className,
      probability: idx === 0 ? meanConfidence : item.probability,
    }));

  return normalizeResult(ranked, files.length);
}
