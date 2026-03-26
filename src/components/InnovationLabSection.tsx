import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ClipboardCheck, ShieldAlert, Sparkles } from 'lucide-react';
import type { RecognitionResult } from '../types/ai';

interface InnovationLabSectionProps {
  result: RecognitionResult | null;
}

interface RiskProfile {
  humidity: number;
  traffic: number;
  seismic: number;
  focus: string;
}

const SAMPLE_RESULT: RecognitionResult = {
  name: '故宫太和殿',
  category: '皇宫',
  era: '明清',
  year: '1420年',
  location: '北京',
  features: ['重檐庑殿顶', '黄色琉璃瓦', '高台基'],
  description: '示例数据：用于展示保护策略模块的交互能力。',
  confidence: 0.93,
};

const RISK_PROFILES: Record<RecognitionResult['category'], RiskProfile> = {
  皇宫: { humidity: 1.15, traffic: 1.1, seismic: 0.95, focus: '大型木构与高等级彩画保护' },
  官府: { humidity: 1.0, traffic: 1.05, seismic: 1.0, focus: '院落序列与木构节点维护' },
  民居: { humidity: 1.2, traffic: 0.9, seismic: 1.05, focus: '夯土/砖木复合结构耐久性' },
  桥梁: { humidity: 0.95, traffic: 1.25, seismic: 1.15, focus: '拱圈受力与桥面载荷管理' },
  其他: { humidity: 1.0, traffic: 1.0, seismic: 1.0, focus: '综合病害与多维巡检' },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const getEraWeight = (era: string) => {
  const table = [
    { keys: ['先秦', '秦', '汉'], value: 95 },
    { keys: ['唐', '宋'], value: 88 },
    { keys: ['元'], value: 82 },
    { keys: ['明', '清'], value: 76 },
    { keys: ['民国', '近代'], value: 66 },
  ];

  const matched = table.find((item) => item.keys.some((key) => era.includes(key)));
  return matched ? matched.value : 70;
};

export const InnovationLabSection: React.FC<InnovationLabSectionProps> = ({ result }) => {
  const [humidity, setHumidity] = useState(64);
  const [traffic, setTraffic] = useState(58);
  const [seismic, setSeismic] = useState(42);
  const [pitchText, setPitchText] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'done' | 'failed'>('idle');

  const activeResult = result ?? SAMPLE_RESULT;
  const isSampleMode = !result;

  const analysis = useMemo(() => {
    const profile = RISK_PROFILES[activeResult.category];
    const humidityPressure = clamp(Math.round(humidity * profile.humidity), 0, 100);
    const trafficPressure = clamp(Math.round(traffic * profile.traffic), 0, 100);
    const seismicPressure = clamp(Math.round(seismic * profile.seismic), 0, 100);

    const structuralPressure = clamp(
      Math.round((humidityPressure * 0.34 + trafficPressure * 0.38 + seismicPressure * 0.28)),
      0,
      100,
    );

    const eraWeight = getEraWeight(activeResult.era);
    const preservationPriority = clamp(Math.round(structuralPressure * 0.62 + eraWeight * 0.38), 0, 100);
    const featureBonus = clamp(activeResult.features.length * 9, 0, 30);
    const confidenceBonus = Math.round(activeResult.confidence * 22);
    const digitalValue = clamp(Math.round(42 + featureBonus + confidenceBonus - structuralPressure * 0.16), 0, 100);

    const sortedRisks = [
      { key: '湿度风险', value: humidityPressure, action: '开启分区除湿与木构含水率日监测，建立 7 天趋势预警。' },
      { key: '人流风险', value: trafficPressure, action: '设置分时预约与单向参观路径，降低局部高峰荷载。' },
      { key: '震害风险', value: seismicPressure, action: '对关键节点做抗震加固评估，优先处理薄弱连接部位。' },
    ].sort((a, b) => b.value - a.value);

    const level = structuralPressure >= 75 ? '高风险' : structuralPressure >= 50 ? '中风险' : '可控';

    const nowActions = sortedRisks.slice(0, 2).map((item) => item.action);
    const midActions = [
      `围绕“${profile.focus}”建立季度巡检清单与构件健康档案。`,
      `结合 ${activeResult.category} 形制，做一次针对性的病害普查与数字建档。`,
    ];
    const longActions = [
      '建设数字孪生看板，按周更新病害热区与修缮进度。',
            '形成可复用的保护标准流程，支持校内外科普展示与学术交流。',
    ];

    return {
      profile,
      humidityPressure,
      trafficPressure,
      seismicPressure,
      structuralPressure,
      preservationPriority,
      digitalValue,
      level,
      sortedRisks,
      nowActions,
      midActions,
      longActions,
    };
  }, [activeResult, humidity, traffic, seismic]);

  const handleGeneratePitch = async () => {
        const generated = `【功能特色：AI古建保护策略沙盘】\n` +
      `目标建筑：${activeResult.name}（${activeResult.category}）\n` +
      `当前结构压力指数：${analysis.structuralPressure}/100（${analysis.level}）\n` +
      `保护优先级：${analysis.preservationPriority}/100；数字化展示价值：${analysis.digitalValue}/100\n` +
      `首要风险：${analysis.sortedRisks[0]?.key ?? '综合风险'}\n` +
      `立即策略：${analysis.nowActions.join('；')}\n` +
      `我们将识别结果、3D模型与风险参数联动，形成“可解释、可演示、可落地”的古建保护决策辅助系统。`;

    setPitchText(generated);

    if (!navigator.clipboard?.writeText) {
      setCopyState('failed');
      return;
    }

    try {
      await navigator.clipboard.writeText(generated);
      setCopyState('done');
      window.setTimeout(() => setCopyState('idle'), 2200);
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-[#0a1020] via-[#0b1426] to-[#07101d] p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-blue-500/30/30 text-amber-200 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            核心功能：AI 保护策略沙盘
          </p>
          <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">古建风险模拟 + 修缮路线生成</h3>
          <p className="mt-2 text-sm text-slate-400">
            联动识别结果和环境参数，输出可用于展示汇报的保护优先级与行动方案。
            {isSampleMode ? ' 当前为示例模式（上传识别后自动切换真实建筑）。' : ''}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6">
        <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">风险参数调节</h4>
            <span className="text-xs text-slate-400">目标：{activeResult.name}</span>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>空气湿度压力</span>
                <span>{humidity}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={humidity}
                onChange={(event) => setHumidity(Number(event.target.value))}
                className="w-full accent-cyan-400"
              />
            </label>

            <label className="block">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>游客流量压力</span>
                <span>{traffic}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={traffic}
                onChange={(event) => setTraffic(Number(event.target.value))}
                className="w-full accent-amber-400"
              />
            </label>

            <label className="block">
              <div className="flex justify-between text-sm text-slate-400 mb-1">
                <span>地震活动压力</span>
                <span>{seismic}</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={seismic}
                onChange={(event) => setSeismic(Number(event.target.value))}
                className="w-full accent-rose-400"
              />
            </label>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
              <p className="text-[11px] text-slate-400">湿度风险</p>
              <p className="text-sm text-cyan-200 mt-1">{analysis.humidityPressure}</p>
            </div>
            <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
              <p className="text-[11px] text-slate-400">人流风险</p>
              <p className="text-sm text-amber-200 mt-1">{analysis.trafficPressure}</p>
            </div>
            <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
              <p className="text-[11px] text-slate-400">震害风险</p>
              <p className="text-sm text-rose-200 mt-1">{analysis.seismicPressure}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-5">
          <h4 className="text-lg font-semibold text-white">策略输出面板</h4>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="relative h-28 w-28 rounded-full p-2"
              style={{
                background: `conic-gradient(#f59e0b 0deg ${analysis.structuralPressure * 3.6}deg, rgba(255,255,255,0.12) ${analysis.structuralPressure * 3.6}deg 360deg)`,
              }}
            >
              <div className="h-full w-full rounded-full bg-[#0b1426] flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{analysis.structuralPressure}</span>
                <span className="text-[10px] text-slate-400">结构压力</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-slate-400">
                风险等级：
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs border ${
                  analysis.level === '高风险'
                    ? 'text-rose-200 border-rose-400/40 bg-rose-500/15'
                    : analysis.level === '中风险'
                      ? 'text-amber-200 border-amber-400/40 bg-amber-500/15'
                      : 'text-emerald-200 border-emerald-400/40 bg-emerald-500/15'
                }`}>
                  {analysis.level}
                </span>
              </p>
              <p className="text-slate-400">保护优先级：<span className="text-white">{analysis.preservationPriority}/100</span></p>
              <p className="text-slate-400">数字展示价值：<span className="text-white">{analysis.digitalValue}/100</span></p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
            <p className="text-[11px] text-slate-400">保护重点</p>
            <p className="text-sm text-white mt-1">{analysis.profile.focus}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-4">
          <p className="text-sm font-semibold text-rose-200 inline-flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            立即行动（7天）
          </p>
          <ul className="mt-2 space-y-2 text-sm text-gray-200">
            {analysis.nowActions.map((action) => (
              <li key={`${activeResult.name}-${action}`}>- {action}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-sky-400/20 bg-sky-500/5 p-4">
          <p className="text-sm font-semibold text-sky-200 inline-flex items-center gap-2">
            <Activity className="w-4 h-4" />
            中期优化（1季度）
          </p>
          <ul className="mt-2 space-y-2 text-sm text-gray-200">
            {analysis.midActions.map((action) => (
              <li key={`${activeResult.name}-${action}`}>- {action}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-amber-400/20 bg-blue-500/5 p-4">
          <p className="text-sm font-semibold text-amber-200 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            长期能力（年度）
          </p>
          <ul className="mt-2 space-y-2 text-sm text-gray-200">
            {analysis.longActions.map((action) => (
              <li key={`${activeResult.category}-${action}`}>- {action}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-indigo-500/10 bg-white/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">一键生成保护策略文案</p>
            <p className="text-xs text-slate-400 mt-1">自动根据识别结果和风险参数生成可直接朗读的方案介绍。</p>
          </div>

          <button
            type="button"
            onClick={handleGeneratePitch}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
          >
            <ClipboardCheck className="w-4 h-4" />
            生成并复制
          </button>
        </div>

        {copyState !== 'idle' && (
          <p className={`mt-3 text-xs ${copyState === 'done' ? 'text-emerald-300' : 'text-rose-300'}`}>
            {copyState === 'done' ? '已复制到剪贴板，可直接粘贴到文档。' : '浏览器禁止自动复制，文案已生成在下方，可手动复制。'}
          </p>
        )}

        <textarea
          value={pitchText}
          readOnly
                    placeholder="点击“生成并复制”后，这里会出现保护策略文案..."
          className="mt-3 h-40 w-full rounded-lg border border-indigo-500/10 bg-[#060a14] p-3 text-sm text-gray-200 placeholder:text-slate-500 outline-none"
        />
      </div>
    </motion.div>
  );
};
