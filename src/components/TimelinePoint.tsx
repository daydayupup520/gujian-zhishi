import type { TimelineComparisonPoint } from '../types/diseaseComparison';

export function TimelinePoint({ point, index }: { point: TimelineComparisonPoint; index: number }) {
  return (
    <div className="relative pl-12">
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
            {point.changes.severityIncreased} 处病害恶化
          </div>
        )}
      </div>
    </div>
  );
}
