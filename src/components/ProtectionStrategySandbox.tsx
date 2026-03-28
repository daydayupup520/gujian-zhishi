import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ComponentType } from 'react';
import {
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,

  TrendingUp,
  Hammer,
  Paintbrush,
  HardHat,
  Microscope
} from 'lucide-react';
import type { RecognitionResult } from '../types/ai';

interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  duration: string;
  cost: string;
  effectiveness: number; // 0-100
  difficulty: '低' | '中' | '高';
  materials: string[];
  steps: string[];
  aiRecommendation: string;
  pros: string[];
  cons: string[];
}

interface ProtectionSandboxProps {
  result: RecognitionResult | null;
  diseaseSeverity?: '轻微' | '中度' | '严重';
}

const STRATEGIES: Record<string, Strategy[]> = {
  民居: [
    {
      id: 'minimally-invasive',
      name: '微介入修复',
      description: '采用最小干预原则，仅对损坏部分进行精准修复，最大限度保留原有材料和工艺',
      icon: Microscope,
      duration: '2-4周',
      cost: '3-8万元',
      effectiveness: 85,
      difficulty: '高',
      materials: ['传统材料', '兼容材料', '微注射树脂'],
      steps: ['病害勘察', '材料取样分析', '局部清理', '传统工艺修复', '养护监测'],
      aiRecommendation: '适合保存状态较好、仅需局部修复的民居建筑。该方案能最大程度保留历史信息，是文保专家推荐的首选方案。',
      pros: ['保留原始材料', '可逆性强', '历史价值损失小'],
      cons: ['工期较长', '技术要求高', '成本较高']
    },
    {
      id: 'preventive-protection',
      name: '预防性保护',
      description: '通过环境控制和定期维护，防止病害进一步恶化，延长建筑寿命',
      icon: Shield,
      duration: '持续进行',
      cost: '1-3万元/年',
      effectiveness: 75,
      difficulty: '低',
      materials: ['防护剂', '排水设施', '监测设备'],
      steps: ['环境监测', '防护措施', '定期巡检', '病害记录', '及时干预'],
      aiRecommendation: '适合病害初期、结构稳定的建筑。通过预防性措施可延缓病害发展，降低大修频率和成本。',
      pros: ['成本低', '可持续', '对建筑干扰小'],
      cons: ['需长期投入', '不能根治', '监测工作量大']
    },
    {
      id: 'structural-reinforcement',
      name: '结构加固',
      description: '对承重构件进行加固处理，提高结构安全性和抗震能力',
      icon: HardHat,
      duration: '1-2月',
      cost: '10-20万元',
      effectiveness: 95,
      difficulty: '中',
      materials: ['加固材料', '支撑结构', '连接件'],
      steps: ['结构评估', '方案设计', '局部卸载', '加固施工', '质量检验'],
      aiRecommendation: '适合结构出现安全隐患的建筑。优先采用隐蔽加固和内加固方式，减少对建筑外观的影响。',
      pros: ['安全性大幅提升', '使用寿命延长', '可抵御灾害'],
      cons: ['成本较高', '需专业设计', '施工复杂']
    }
  ],
  皇宫: [
    {
      id: 'restoration-grade',
      name: '修缮级保护',
      description: '严格按照文物保护标准进行修缮，恢复建筑原有面貌',
      icon: Paintbrush,
      duration: '3-6月',
      cost: '50-100万元',
      effectiveness: 90,
      difficulty: '高',
      materials: ['宫廷传统材料', '矿物颜料', '金箔'],
      steps: ['文献研究', '现状勘察', '方案论证', '逐级审批', '精细修缮'],
      aiRecommendation: '皇宫建筑必须采用最高标准的修缮方案。需经过严格的论证和审批程序，确保符合文物保护原则。',
      pros: ['恢复原貌', '等级最高', '文物价值保全'],
      cons: ['程序复杂', '成本极高', '工期很长']
    },
    {
      id: 'daily-maintenance',
      name: '日常保养',
      description: '定期清洁、检查和保养，维持建筑最佳状态',
      icon: Hammer,
      duration: '持续进行',
      cost: '20-50万元/年',
      effectiveness: 80,
      difficulty: '中',
      materials: ['保养材料', '清洁工具', '检测设备'],
      steps: ['日常巡检', '清洁保养', '病害监测', '及时维修', '档案记录'],
      aiRecommendation: '皇宫建筑需要专业的日常保养团队。通过持续的维护，可以预防病害发生，保持建筑良好状态。',
      pros: ['预防为主', '及时发现', '保持状态'],
      cons: ['需长期投入', '人力成本高', '专业性强']
    }
  ],
  官府: [
    {
      id: 'authentic-repair',
      name: '原真性修复',
      description: '在保持建筑原真性的前提下进行修复，体现历史真实性',
      icon: CheckCircle2,
      duration: '2-4月',
      cost: '30-60万元',
      effectiveness: 88,
      difficulty: '高',
      materials: ['传统材料', '历史工艺', '地方特色材料'],
      steps: ['历史研究', '现状记录', '工艺分析', '原真性修复', '验收评估'],
      aiRecommendation: '官府建筑承载着重要的历史信息。修复时应注重保持各历史时期的真实遗存，避免过度修复。',
      pros: ['历史信息完整', '原真性高', '研究价值大'],
      cons: ['修复难度大', '需历史研究', '标准难统一']
    }
  ],
  桥梁: [
    {
      id: 'load-limitation',
      name: '限载保护',
      description: '通过限制通行荷载，保护桥梁结构安全',
      icon: Shield,
      duration: '立即实施',
      cost: '5-10万元',
      effectiveness: 70,
      difficulty: '低',
      materials: ['限载设施', '监测系统', '警示标志'],
      steps: ['承载力评估', '限载方案', '设施安装', '通行管理', '效果监测'],
      aiRecommendation: '古桥梁应优先采用限载保护措施。这是最简单有效的保护方式，能显著降低结构损伤风险。',
      pros: ['成本低', '见效快', '保护效果好'],
      cons: ['影响使用', '需管理配合', '非根本解决']
    },
    {
      id: 'structural-consolidation',
      name: '结构整体加固',
      description: '对桥梁整体结构进行加固，提高承载能力和耐久性',
      icon: HardHat,
      duration: '3-6月',
      cost: '100-300万元',
      effectiveness: 92,
      difficulty: '高',
      materials: ['加固材料', '支护结构', '连接件'],
      steps: ['详细检测', '加固设计', '施工准备', '分期加固', '荷载试验'],
      aiRecommendation: '适合病害较严重的古桥。需聘请专业古桥修复团队，采用可逆性强的加固技术。',
      pros: ['安全性高', '延长寿命', '可正常通行'],
      cons: ['成本很高', '施工复杂', '需中断交通']
    }
  ]
};

export default function ProtectionStrategySandbox({ result, diseaseSeverity = '中度' }: ProtectionSandboxProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationYear, setSimulationYear] = useState(0);

  const strategies = useMemo(() => {
    if (!result) return [];
    const categoryStrategies = STRATEGIES[result.category] || STRATEGIES['民居'];
    // 根据病害严重程度调整推荐顺序
    if (diseaseSeverity === '严重') {
      return [...categoryStrategies].sort((a, b) => b.effectiveness - a.effectiveness);
    }
    return categoryStrategies;
  }, [result, diseaseSeverity]);

  const runSimulation = () => {
    setSimulationMode(true);
    setSimulationYear(0);
    
    const interval = setInterval(() => {
      setSimulationYear(prev => {
        if (prev >= 50) {
          clearInterval(interval);
          return 50;
        }
        return prev + 5;
      });
    }, 200);
  };

  const resetSimulation = () => {
    setSimulationMode(false);
    setSimulationYear(0);
  };

  if (!result) return null;

  return (
    <div className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI 保护策略沙盘</h2>
            <p className="text-slate-400">基于建筑类型和病害情况，智能推荐保护修缮方案</p>
          </div>
        </div>

        {/* AI 推荐提示 */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-400 font-medium mb-1">AI 智能分析</p>
              <p className="text-slate-400 text-sm">
                根据「{result.name}」的「{result.category}」类型和「{diseaseSeverity}」病害等级，
                系统推荐以下保护策略。已综合考虑有效性、成本、工期等因素。
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 策略卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedStrategy(strategy)}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedStrategy?.id === strategy.id
                ? 'bg-emerald-500/20 border-emerald-500/50'
                : 'bg-white/5 border-indigo-500/10 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <strategy.icon className="w-5 h-5 text-emerald-400" />
              </div>
              {index === 0 && (
                <span className="px-2 py-1 bg-blue-500/15 text-blue-400 rounded text-xs">
                  AI推荐
                </span>
              )}
            </div>
            <h3 className="font-bold text-white mb-2">{strategy.name}</h3>
            <p className="text-slate-400 text-sm line-clamp-2 mb-3">{strategy.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {strategy.duration}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> {strategy.cost}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${strategy.effectiveness}%` }}
                />
              </div>
              <span className="text-xs text-emerald-400">{strategy.effectiveness}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 策略详情 */}
      <AnimatePresence>
        {selectedStrategy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[rgba(15,20,40,0.5)] backdrop-blur-sm border border-indigo-500/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-indigo-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <selectedStrategy.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedStrategy.name}</h3>
                    <p className="text-slate-400 text-sm">{selectedStrategy.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="p-2 hover:bg-[rgba(15,20,40,0.6)] rounded-lg text-slate-400"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 左侧：方案详情 */}
              <div className="space-y-6">
                {/* AI 推荐语 */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">AI 推荐理由</span>
                  </div>
                  <p className="text-slate-400 text-sm">{selectedStrategy.aiRecommendation}</p>
                </div>

                {/* 关键指标 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 mb-1">工期</p>
                    <p className="text-white font-medium">{selectedStrategy.duration}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 mb-1">预估成本</p>
                    <p className="text-white font-medium">{selectedStrategy.cost}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl text-center">
                    <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 mb-1">实施难度</p>
                    <p className="text-white font-medium">{selectedStrategy.difficulty}</p>
                  </div>
                </div>

                {/* 实施步骤 */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    实施步骤
                  </h4>
                  <div className="space-y-2">
                    {selectedStrategy.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span className="text-slate-400 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 所需材料 */}
                <div>
                  <h4 className="text-white font-medium mb-3">主要材料</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStrategy.materials.map((material, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-sm">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右侧：模拟与评估 */}
              <div className="space-y-6">
                {/* 效果评估 */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium mb-4">优缺点分析</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-emerald-400 text-sm mb-2">✓ 优势</p>
                      <ul className="space-y-1">
                        {selectedStrategy.pros.map((pro: string, idx: number) => (
                          <li key={idx} className="text-slate-400 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-rose-400 text-sm mb-2">✗ 局限</p>
                      <ul className="space-y-1">
                        {selectedStrategy.cons.map((con, idx) => (
                          <li key={idx} className="text-slate-400 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-rose-400" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 效果模拟 */}
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    长期效果模拟
                  </h4>
                  
                  {!simulationMode ? (
                    <div className="text-center py-6">
                      <p className="text-slate-400 text-sm mb-4">模拟该策略实施50年后的保护效果</p>
                      <button
                        onClick={runSimulation}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        开始模拟
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 text-sm">时间跨度</span>
                          <span className="text-emerald-400 font-medium">{simulationYear}年</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(simulationYear / 50) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/50 rounded-lg">
                          <p className="text-slate-500 text-xs mb-1">结构健康度</p>
                          <p className="text-xl font-bold text-emerald-400">
                            {Math.min(95, 60 + (selectedStrategy.effectiveness * 0.3) + (simulationYear * 0.1)).toFixed(0)}%
                          </p>
                        </div>
                        <div className="p-3 bg-white/50 rounded-lg">
                          <p className="text-slate-500 text-xs mb-1">累计投入</p>
                          <p className="text-xl font-bold text-blue-400">
                            {simulationYear >= 50 ? selectedStrategy.cost : '计算中...'}
                          </p>
                        </div>
                      </div>
                      
                      {simulationYear >= 50 && (
                        <div className="mt-4 p-3 bg-emerald-500/20 rounded-lg">
                          <p className="text-emerald-400 text-sm">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            模拟完成！该方案能有效保护建筑50年以上
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={resetSimulation}
                        className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10/95 rounded-lg text-slate-400 text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        重新模拟
                      </button>
                    </div>
                  )}
                </div>

                {/* 采用按钮 */}
                <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  采用此方案
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
