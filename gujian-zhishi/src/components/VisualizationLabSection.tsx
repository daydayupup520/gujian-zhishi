import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Sparkles, Target } from 'lucide-react';
import type { RecognitionResult } from '../types/ai';

type MetricKey =
  | 'heritageDepth'
  | 'craftComplexity'
  | 'publicAttention'
  | 'protectionUrgency'
  | 'digitalPotential';

type EraBandKey = 'ancient' | 'medieval' | 'imperial' | 'modern';

interface VizPoint {
  id: string;
  name: string;
  category: RecognitionResult['category'];
  era: string;
  location: string;
  scores: Record<MetricKey, number>;
}

interface VisualizationLabSectionProps {
  result: RecognitionResult | null;
}

const METRIC_LABELS: Record<MetricKey, string> = {
  heritageDepth: '历史深度',
  craftComplexity: '工艺复杂度',
  publicAttention: '公众关注度',
  protectionUrgency: '保护紧迫度',
  digitalPotential: '数字展示潜力',
};

const METRIC_COLORS: Record<MetricKey, string> = {
  heritageDepth: '#f59e0b',
  craftComplexity: '#ef4444',
  publicAttention: '#38bdf8',
  protectionUrgency: '#f97316',
  digitalPotential: '#22c55e',
};

const CATEGORY_COLORS: Record<RecognitionResult['category'], string> = {
  皇宫: '#f59e0b',
  官府: '#60a5fa',
  民居: '#34d399',
  桥梁: '#f472b6',
  其他: '#a3a3a3',
};

const ERA_BANDS: Array<{ key: EraBandKey; label: string }> = [
  { key: 'ancient', label: '先秦-汉' },
  { key: 'medieval', label: '唐-宋-元' },
  { key: 'imperial', label: '明-清' },
  { key: 'modern', label: '近现代' },
];

const BASE_POINTS: VizPoint[] = [
  {
    id: 'forbidden-city-taihe',
    name: '故宫太和殿',
    category: '皇宫',
    era: '明清',
    location: '北京',
    scores: {
      heritageDepth: 92,
      craftComplexity: 96,
      publicAttention: 94,
      protectionUrgency: 76,
      digitalPotential: 97,
    },
  },
  {
    id: 'zhaozhou-bridge',
    name: '赵州桥',
    category: '桥梁',
    era: '隋代',
    location: '河北赵县',
    scores: {
      heritageDepth: 90,
      craftComplexity: 88,
      publicAttention: 82,
      protectionUrgency: 69,
      digitalPotential: 86,
    },
  },
  {
    id: 'chengqi-tulou',
    name: '福建土楼',
    category: '民居',
    era: '明清',
    location: '福建',
    scores: {
      heritageDepth: 81,
      craftComplexity: 78,
      publicAttention: 80,
      protectionUrgency: 84,
      digitalPotential: 83,
    },
  },
  {
    id: 'beijing-siheyuan',
    name: '四合院',
    category: '民居',
    era: '明清',
    location: '北京',
    scores: {
      heritageDepth: 73,
      craftComplexity: 66,
      publicAttention: 74,
      protectionUrgency: 52,
      digitalPotential: 78,
    },
  },
  {
    id: 'pingyao-yamen',
    name: '平遥县衙',
    category: '官府',
    era: '明清',
    location: '山西平遥',
    scores: {
      heritageDepth: 76,
      craftComplexity: 74,
      publicAttention: 71,
      protectionUrgency: 64,
      digitalPotential: 80,
    },
  },
  {
    id: 'wuting-bridge',
    name: '五亭桥',
    category: '桥梁',
    era: '清代',
    location: '江苏扬州',
    scores: {
      heritageDepth: 71,
      craftComplexity: 72,
      publicAttention: 86,
      protectionUrgency: 58,
      digitalPotential: 88,
    },
  },
];

const CATEGORY_BASE: Record<RecognitionResult['category'], { craft: number; attention: number; urgency: number; digital: number }> = {
  皇宫: { craft: 90, attention: 92, urgency: 72, digital: 95 },
  官府: { craft: 78, attention: 70, urgency: 62, digital: 82 },
  民居: { craft: 68, attention: 73, urgency: 66, digital: 76 },
  桥梁: { craft: 82, attention: 84, urgency: 58, digital: 88 },
  其他: { craft: 64, attention: 64, urgency: 60, digital: 70 },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getEraDepth = (era: string) => {
  if (era.includes('先秦') || era.includes('秦') || era.includes('汉')) {
    return 96;
  }
  if (era.includes('隋') || era.includes('唐') || era.includes('宋')) {
    return 90;
  }
  if (era.includes('元')) {
    return 84;
  }
  if (era.includes('明') || era.includes('清')) {
    return 76;
  }
  if (era.includes('民国') || era.includes('近代')) {
    return 66;
  }
  return 70;
};

const resolveEraBand = (era: string): EraBandKey => {
  if (era.includes('先秦') || era.includes('秦') || era.includes('汉')) {
    return 'ancient';
  }
  if (era.includes('隋') || era.includes('唐') || era.includes('宋') || era.includes('元')) {
    return 'medieval';
  }
  if (era.includes('明') || era.includes('清')) {
    return 'imperial';
  }
  return 'modern';
};

const toCurrentPoint = (result: RecognitionResult | null): VizPoint => {
  if (!result) {
    return {
      ...BASE_POINTS[0],
      id: 'current-recognition',
      name: '当前识别（示例）',
    };
  }

  const base = CATEGORY_BASE[result.category];
  const confidenceScore = clamp(Math.round(result.confidence * 100), 0, 100);
  const featureBoost = clamp(result.features.length * 7, 0, 28);
  const heritageDepth = clamp(Math.round(getEraDepth(result.era) * 0.72 + confidenceScore * 0.28), 0, 100);

  return {
    id: 'current-recognition',
    name: `${result.name}（当前识别）`,
    category: result.category,
    era: result.era,
    location: result.location,
    scores: {
      heritageDepth,
      craftComplexity: clamp(base.craft + Math.round(featureBoost * 0.4), 0, 100),
      publicAttention: clamp(base.attention + Math.round(confidenceScore * 0.16), 0, 100),
      protectionUrgency: clamp(base.urgency + Math.round((100 - confidenceScore) * 0.3), 0, 100),
      digitalPotential: clamp(base.digital + Math.round(featureBoost * 0.45), 0, 100),
    },
  };
};

export const VisualizationLabSection: React.FC<VisualizationLabSectionProps> = ({ result }) => {
  const [xMetric, setXMetric] = useState<MetricKey>('heritageDepth');
  const [yMetric, setYMetric] = useState<MetricKey>('protectionUrgency');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const currentPoint = useMemo(() => toCurrentPoint(result), [result]);

  const points = useMemo(() => {
    const filtered = BASE_POINTS.filter((item) => item.id !== currentPoint.id);
    return [...filtered, currentPoint];
  }, [currentPoint]);

  const focusPoint = useMemo(() => {
    return points.find((item) => item.id === focusedId) ?? currentPoint;
  }, [currentPoint, focusedId, points]);

  const scatter = useMemo(() => {
    const width = 640;
    const height = 340;
    const padding = 46;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    return points.map((item) => ({
      ...item,
      x: padding + (item.scores[xMetric] / 100) * innerWidth,
      y: height - padding - (item.scores[yMetric] / 100) * innerHeight,
      width,
      height,
      padding,
    }));
  }, [points, xMetric, yMetric]);

  const radar = useMemo(() => {
    const metrics: MetricKey[] = [
      'heritageDepth',
      'craftComplexity',
      'publicAttention',
      'protectionUrgency',
      'digitalPotential',
    ];
    const center = 110;
    const radius = 78;

    const polygon = metrics
      .map((metric, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI * 2) / metrics.length;
        const scoreRadius = (focusPoint.scores[metric] / 100) * radius;
        const x = center + Math.cos(angle) * scoreRadius;
        const y = center + Math.sin(angle) * scoreRadius;
        return `${x},${y}`;
      })
      .join(' ');

    const axis = metrics.map((metric, index) => {
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / metrics.length;
      const x = center + Math.cos(angle) * (radius + 16);
      const y = center + Math.sin(angle) * (radius + 16);
      return { metric, x, y, angle };
    });

    return { metrics, polygon, axis, center, radius };
  }, [focusPoint]);

  const eraBands = useMemo(() => {
    return ERA_BANDS.map((band) => {
      const inBand = points.filter((item) => resolveEraBand(item.era) === band.key);
      const urgency = inBand.length
        ? Math.round(inBand.reduce((sum, item) => sum + item.scores.protectionUrgency, 0) / inBand.length)
        : 0;
      const digital = inBand.length
        ? Math.round(inBand.reduce((sum, item) => sum + item.scores.digitalPotential, 0) / inBand.length)
        : 0;

      return {
        ...band,
        count: inBand.length,
        urgency,
        digital,
      };
    });
  }, [points]);

  const featureCloud = useMemo(() => {
    const defaults = ['斗拱', '屋脊', '梁架', '彩画', '院落', '拱券'];
    if (!result) {
      return defaults;
    }
    return Array.from(new Set([...result.features, ...defaults])).slice(0, 8);
  }, [result]);

  const valueGap = focusPoint.scores.digitalPotential - focusPoint.scores.protectionUrgency;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-[#0c111f] via-[#0f1528] to-[#0a1324] p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            信息可视化实验台
          </span>
          <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">古建多维画像与时序洞察</h3>
          <p className="mt-2 text-sm text-slate-400">
            通过散点、雷达与热力时序联动展示建筑特征，支持对识别结果进行可解释分析。
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-base font-semibold text-white inline-flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-300" />
              多维散点分布
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="viz-x-metric" className="text-xs text-slate-400">
                X轴
              </label>
              <select
                id="viz-x-metric"
                value={xMetric}
                onChange={(event) => setXMetric(event.target.value as MetricKey)}
                className="rounded-md border border-[#2C2416]/30/15 bg-white/75 px-2 py-1 text-xs text-white"
              >
                {Object.entries(METRIC_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <label htmlFor="viz-y-metric" className="text-xs text-slate-400">
                Y轴
              </label>
              <select
                id="viz-y-metric"
                value={yMetric}
                onChange={(event) => setYMetric(event.target.value as MetricKey)}
                className="rounded-md border border-[#2C2416]/30/15 bg-white/75 px-2 py-1 text-xs text-white"
              >
                {Object.entries(METRIC_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <svg viewBox="0 0 640 340" className="h-[340px] min-w-[620px] w-full rounded-lg border border-indigo-500/10 bg-[#090f1f]">
              <title>古建筑多维散点分布图</title>
              {[20, 40, 60, 80].map((value) => {
                const y = 340 - 46 - ((340 - 92) * value) / 100;
                return (
                  <line
                    key={`grid-y-${value}`}
                    x1={46}
                    x2={594}
                    y1={y}
                    y2={y}
                    stroke="rgba(148,163,184,0.2)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {[20, 40, 60, 80].map((value) => {
                const x = 46 + ((640 - 92) * value) / 100;
                return (
                  <line
                    key={`grid-x-${value}`}
                    y1={46}
                    y2={294}
                    x1={x}
                    x2={x}
                    stroke="rgba(148,163,184,0.2)"
                    strokeDasharray="4 4"
                  />
                );
              })}

              <line x1={46} x2={594} y1={294} y2={294} stroke="rgba(226,232,240,0.65)" />
              <line x1={46} x2={46} y1={46} y2={294} stroke="rgba(226,232,240,0.65)" />

              {scatter.map((item) => {
                const isCurrent = item.id === 'current-recognition';
                const isFocused = focusPoint.id === item.id;
                const color = CATEGORY_COLORS[item.category];

                return (
                  <g key={item.id}>
                    <circle
                      cx={item.x}
                      cy={item.y}
                      r={isFocused ? 9 : isCurrent ? 8 : 6.5}
                      fill={color}
                      fillOpacity={isCurrent ? 0.95 : 0.85}
                      stroke={isCurrent ? '#ffffff' : 'rgba(15,23,42,0.8)'}
                      strokeWidth={isCurrent ? 2.5 : 1.8}
                    />
                    {isFocused && (
                      <text
                        x={item.x + 10}
                        y={item.y - 10}
                        fill="#e2e8f0"
                        fontSize="12"
                      >
                        {item.name}
                      </text>
                    )}
                  </g>
                );
              })}

              <text x={320} y={329} textAnchor="middle" fill="rgba(226,232,240,0.9)" fontSize="12">
                {METRIC_LABELS[xMetric]}
              </text>
              <text
                x={14}
                y={172}
                textAnchor="middle"
                transform="rotate(-90 14,172)"
                fill="rgba(226,232,240,0.9)"
                fontSize="12"
              >
                {METRIC_LABELS[yMetric]}
              </text>
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
            {(Object.keys(CATEGORY_COLORS) as RecognitionResult['category'][]).map((category) => (
              <span key={category} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[category] }}
                />
                {category}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {points.map((item) => (
              <button
                key={`focus-${item.id}`}
                type="button"
                onClick={() => setFocusedId(item.id)}
                className={`rounded-full border px-2.5 py-1 text-xs transition ${
                  focusPoint.id === item.id
                    ? 'border-cyan-300/60 bg-cyan-400/15 text-cyan-100'
                    : 'border-[#2C2416]/30/15 bg-white/5 text-slate-400 hover:bg-white/10/95'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
            <h4 className="text-base font-semibold text-white inline-flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-300" />
              当前焦点画像
            </h4>
            <p className="mt-1 text-sm text-slate-400">{focusPoint.name}</p>
            <p className="text-xs text-slate-400">{focusPoint.location} · {focusPoint.era}</p>

            <div className="mt-4 flex justify-center">
              <svg viewBox="0 0 220 220" className="h-52 w-52">
                <title>建筑能力雷达图</title>
                {[20, 40, 60, 80, 100].map((level) => {
                  const r = (radar.radius * level) / 100;
                  const pointsText = radar.axis
                    .map((item) => {
                      const x = radar.center + Math.cos(item.angle) * r;
                      const y = radar.center + Math.sin(item.angle) * r;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <polygon
                      key={`radar-grid-${level}`}
                      points={pointsText}
                      fill="none"
                      stroke="rgba(148,163,184,0.22)"
                    />
                  );
                })}

                {radar.axis.map((item) => (
                  <line
                    key={`radar-axis-${item.metric}`}
                    x1={radar.center}
                    y1={radar.center}
                    x2={item.x}
                    y2={item.y}
                    stroke="rgba(148,163,184,0.35)"
                  />
                ))}

                <polygon
                  points={radar.polygon}
                  fill="rgba(56,189,248,0.28)"
                  stroke="rgba(56,189,248,0.92)"
                  strokeWidth="2"
                />

                {radar.axis.map((item) => (
                  <text
                    key={`radar-label-${item.metric}`}
                    x={item.x}
                    y={item.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(226,232,240,0.9)"
                    fontSize="11"
                  >
                    {METRIC_LABELS[item.metric]}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
            <h5 className="text-sm font-semibold text-white inline-flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-300" />
              指标剖面
            </h5>
            <div className="mt-3 space-y-2.5">
              {(Object.keys(METRIC_LABELS) as MetricKey[]).map((metric) => (
                <div key={`metric-${metric}`}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{METRIC_LABELS[metric]}</span>
                    <span>{focusPoint.scores[metric]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${focusPoint.scores[metric]}%`,
                        backgroundColor: METRIC_COLORS[metric],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4 md:col-span-2">
          <p className="text-sm font-semibold text-white">时序热力带</p>
          <p className="mt-1 text-xs text-slate-400">按时代聚合保护紧迫度与数字化潜力，用于识别阶段性投入重点。</p>
          <div className="mt-3 space-y-3">
            {eraBands.map((band) => (
              <div key={band.key}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{band.label}</span>
                  <span>{band.count} 个样本</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-orange-400"
                      style={{ width: `${band.urgency}%` }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: `${band.digital}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-orange-400" />保护紧迫度
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />数字化潜力
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
          <p className="text-sm font-semibold text-white">洞察摘要</p>
          <p className="mt-2 text-xs text-slate-400">
            当前样本“数字化潜力 - 保护紧迫度”差值：
            <span className={`ml-1 ${valueGap >= 0 ? 'text-emerald-300' : 'text-orange-300'}`}>
              {valueGap >= 0 ? '+' : ''}
              {valueGap}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {featureCloud.map((feature) => (
              <span
                key={`feature-cloud-${feature}`}
                className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-100"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
