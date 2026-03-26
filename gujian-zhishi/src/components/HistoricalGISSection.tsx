import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinned, Clock3 } from 'lucide-react';
import type { RecognitionResult } from '../types/ai';

interface HistoricalGISSectionProps {
  result: RecognitionResult | null;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const HistoricalGISSection: React.FC<HistoricalGISSectionProps> = ({ result }) => {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  const gis = result?.gis;

  const mapUrl = useMemo(() => {
    if (!gis) {
      return '';
    }

    const lat = clamp(gis.lat, 15, 55);
    const lng = clamp(gis.lng, 70, 140);
    const west = (lng - 0.6).toFixed(4);
    const east = (lng + 0.6).toFixed(4);
    const south = (lat - 0.35).toFixed(4);
    const north = (lat + 0.35).toFixed(4);

    return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lng.toFixed(4)}`;
  }, [gis]);

  const activeTimeline = gis?.timeline?.[activeTimelineIndex];

  return (
    <motion.section
      id="historical-gis"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-[#0a1220] via-[#0f182b] to-[#0b1324] p-6 md:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
            <MapPinned className="h-3.5 w-3.5" />
            历史 GIS 时空联动
          </span>
          <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">建筑位置与朝代地理语境</h3>
          <p className="mt-2 text-sm text-slate-400">
            根据识别结果自动定位建筑坐标，并展示其在历史时期中的政区与空间角色变化。
          </p>
        </div>
      </div>

      {!result && (
        <div className="mt-6 rounded-xl border border-dashed border-[#2C2416]/20 bg-white/40 p-8 text-center text-slate-400">
          请先完成识别，系统将自动生成历史 GIS 定位与时间轴。
        </div>
      )}

      {result && !gis && (
        <div className="mt-6 rounded-xl border border-dashed border-[#2C2416]/20 bg-white/40 p-8 text-center text-slate-400">
          当前结果暂无 GIS 信息，建议上传多角度图片后重试。
        </div>
      )}

      {result && gis && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-3">
            <iframe
              title="历史GIS地图"
              src={mapUrl}
              className="h-[320px] w-full rounded-lg border border-indigo-500/10"
              loading="lazy"
            />
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
                <p className="text-xs text-slate-400">标准地名</p>
                <p className="mt-1 text-white">{gis.placeName}</p>
              </div>
              <div className="rounded-lg border border-indigo-500/10 bg-white/5 px-3 py-2">
                <p className="text-xs text-slate-400">历史层级</p>
                <p className="mt-1 text-white">{gis.territoryLevel}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">坐标：{gis.lat.toFixed(4)}, {gis.lng.toFixed(4)}</p>
          </div>

          <div className="rounded-xl border border-indigo-500/10 bg-[rgba(15,20,40,0.4)] p-4">
            <h4 className="text-base font-semibold text-white inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-blue-300" />
              历史时间轴
            </h4>

            <p className="mt-2 text-sm text-slate-400">{gis.dynastyContext}</p>

            <div className="mt-4 space-y-2">
              {gis.timeline.map((item, index) => (
                <button
                  key={`${item.period}-${item.locationRole}`}
                  type="button"
                  onClick={() => setActiveTimelineIndex(index)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                    activeTimelineIndex === index
                      ? 'border-blue-500/20 bg-amber-500/15'
                      : 'border-indigo-500/10 bg-white/5 hover:bg-white/10/95'
                  }`}
                >
                  <p className="text-sm font-medium text-white">{item.period}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.territoryContext}</p>
                </button>
              ))}
            </div>

            {activeTimeline && (
              <div className="mt-4 rounded-lg border border-cyan-300/30 bg-cyan-500/10 p-3">
                <p className="text-xs text-cyan-200">当前时期地点角色</p>
                <p className="mt-1 text-sm text-white">{activeTimeline.locationRole}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
};
