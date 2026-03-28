import { MapPin } from 'lucide-react';
import type { DiseaseRecord } from '../lib/db';

export function DiseaseCard({ disease }: { disease: DiseaseRecord }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{disease.diseaseType}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            disease.severity === '严重' ? 'bg-rose-500/20 text-rose-300' :
            disease.severity === '中度' ? 'bg-amber-500/20 text-amber-300' :
            'bg-emerald-500/20 text-emerald-300'
          }`}>
            {disease.severity}
          </span>
        </div>
        <span className={`text-xs ${
          disease.urgency === '立即处理' ? 'text-rose-400' :
          disease.urgency === '近期处理' ? 'text-amber-400' :
          'text-emerald-400'
        }`}>
          {disease.urgency}
        </span>
      </div>
      <div className="text-sm text-slate-400 mb-2">
        <MapPin className="w-3 h-3 inline mr-1" />
        {disease.position}
      </div>
      <p className="text-sm text-slate-500 line-clamp-2">{disease.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-emerald-400">{disease.estimatedCost}</span>
        <span className="text-slate-500">
          {new Date(disease.recordedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
