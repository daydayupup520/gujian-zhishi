import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import type { RecognitionResult } from '../types/ai';

type Category = RecognitionResult['category'];
type ViewMode = 'overview' | 'exploded' | 'wireframe';

interface CategoryPreset {
  cameraPosition: [number, number, number];
  structureType: string;
  engineeringFocus: string;
  suggestedFeatures: string[];
  recommendedView: string;
}

const CATEGORY_ORDER: Category[] = ['皇宫', '官府', '民居', '桥梁', '其他'];

const CATEGORY_PRESETS: Record<Category, CategoryPreset> = {
  皇宫: {
    cameraPosition: [7.8, 4.8, 7.8],
    structureType: '高台基 + 殿身 + 双重屋面',
    engineeringFocus: '礼制中轴、柱网承重、深出檐排水',
    suggestedFeatures: ['重檐', '台基', '柱网', '斗拱意向'],
    recommendedView: '45° 俯视观察屋面与台基层次',
  },
  官府: {
    cameraPosition: [8.2, 4.2, 6.6],
    structureType: '前门楼 + 中轴主堂 + 两侧廊房',
    engineeringFocus: '轴线组织、门厅过渡、院落进深',
    suggestedFeatures: ['门楼', '大堂', '轴线', '院落'],
    recommendedView: '沿中轴低角度观察门楼与正堂关系',
  },
  民居: {
    cameraPosition: [7.2, 3.8, 7.2],
    structureType: '围合院落 + 四向厢房',
    engineeringFocus: '围合采光、院落通风、生活流线',
    suggestedFeatures: ['院落', '围合', '居住单元', '排水坡面'],
    recommendedView: '略高机位俯视院落围合形态',
  },
  桥梁: {
    cameraPosition: [10.5, 3.6, 0.1],
    structureType: '多跨拱 + 桥面系统 + 栏板',
    engineeringFocus: '拱圈受压、墩台传力、桥面连续性',
    suggestedFeatures: ['拱圈', '桥墩', '栏板', '桥面'],
    recommendedView: '侧向观察拱跨比例与墩台受力路径',
  },
  其他: {
    cameraPosition: [7.0, 4.0, 7.0],
    structureType: '基础体量模型',
    engineeringFocus: '几何比例与体块关系',
    suggestedFeatures: ['体量', '层次', '构件', '比例'],
    recommendedView: '环绕观察体量关系',
  },
};

const commonMaterial = (mode: ViewMode, color: string, metalness = 0.25, roughness = 0.65) => (
  <meshStandardMaterial
    color={color}
    metalness={metalness}
    roughness={roughness}
    wireframe={mode === 'wireframe'}
  />
);

export const PalaceModel = ({ mode }: { mode: ViewMode }) => {
  const explode = mode === 'exploded' ? 1 : 0;
  const roofLift = 1.5 * explode;
  const bodyLift = 0.6 * explode;

  return (
    <group>
      <mesh position={[0, -1.75, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.4, 5.4]} />
        {commonMaterial(mode, '#2f2f34', 0.45, 0.35)}
      </mesh>
      <mesh position={[0, -1.38, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.35, 4.8]} />
        {commonMaterial(mode, '#3b3530')}
      </mesh>
      <mesh position={[0, -0.45 + bodyLift, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.3, 2.1, 3.1]} />
        {commonMaterial(mode, '#c49b40', 0.2, 0.5)}
      </mesh>
      {[-1.9, -0.95, 0, 0.95, 1.9].map((x) =>
        [-1.2, 1.2].map((z) => (
          <mesh key={`palace-col-${x}-${z}`} position={[x, -0.55 + bodyLift, z]} castShadow>
            <cylinderGeometry args={[0.09, 0.11, 2.2, 12]} />
            {commonMaterial(mode, '#8b5a2b', 0.3, 0.55)}
          </mesh>
        )),
      )}
      <mesh position={[0, 0.9 + roofLift, 0]} castShadow>
        <boxGeometry args={[5.2, 0.28, 4.0]} />
        {commonMaterial(mode, '#6d0000', 0.18, 0.62)}
      </mesh>
      <mesh position={[0, 1.25 + roofLift, 0]} castShadow>
        <coneGeometry args={[3.65, 1.15, 4]} />
        {commonMaterial(mode, '#7a0000', 0.12, 0.72)}
      </mesh>
      <mesh position={[0, 1.55 + roofLift, 0]} castShadow>
        <boxGeometry args={[0.18, 0.9, 0.18]} />
        {commonMaterial(mode, '#d4af37', 0.7, 0.25)}
      </mesh>
      <mesh position={[0, -1.15, 2.55]} receiveShadow>
        <boxGeometry args={[2.6, 0.18, 0.95]} />
        {commonMaterial(mode, '#3f3a34')}
      </mesh>
    </group>
  );
};

export const GovernmentModel = ({ mode }: { mode: ViewMode }) => {
  const explode = mode === 'exploded' ? 1 : 0;

  return (
    <group>
      <mesh position={[0, -1.8, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.3, 5.4]} />
        {commonMaterial(mode, '#2f3138', 0.35, 0.45)}
      </mesh>
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.04, 5.0]} />
        {commonMaterial(mode, '#72747a', 0.15, 0.9)}
      </mesh>
      <mesh position={[0, -0.35 + 0.45 * explode, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.9, 2.6]} />
        {commonMaterial(mode, '#bb9650', 0.25, 0.58)}
      </mesh>
      <mesh position={[0, 0.85 + 1.2 * explode, 0.2]} castShadow>
        <coneGeometry args={[2.9, 1.0, 4]} />
        {commonMaterial(mode, '#6f0a0a', 0.15, 0.7)}
      </mesh>
      <mesh position={[0, -0.75, 1.95]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.95, 0.42]} />
        {commonMaterial(mode, '#8a6437', 0.2, 0.6)}
      </mesh>
      {[-2.7, 2.7].map((x) => (
        <group key={`gov-wing-${x}`} position={[x, -0.9, -0.2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.9, 1.1, 2.4]} />
            {commonMaterial(mode, '#a98444', 0.2, 0.6)}
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <coneGeometry args={[1.55, 0.65, 4]} />
            {commonMaterial(mode, '#6f0a0a', 0.15, 0.72)}
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.6, 2.35]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.45, 0.35]} />
        {commonMaterial(mode, '#b38a4a', 0.25, 0.58)}
      </mesh>
      <mesh position={[0, 0.45, 2.35]} castShadow>
        <coneGeometry args={[1.35, 0.7, 4]} />
        {commonMaterial(mode, '#6b0b0b', 0.15, 0.72)}
      </mesh>
    </group>
  );
};

export const ResidenceModel = ({ mode }: { mode: ViewMode }) => {
  const explode = mode === 'exploded' ? 1 : 0;

  return (
    <group>
      <mesh position={[0, -1.85, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.25, 7.2]} />
        {commonMaterial(mode, '#2f3137', 0.35, 0.5)}
      </mesh>
      <mesh position={[0, -1.72, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.1, 4.2]} />
        {commonMaterial(mode, '#46506a', 0.1, 0.92)}
      </mesh>
      {[
        { side: 'north', x: 0, y: -0.85, z: -2.0, w: 3.4, h: 1.2, d: 0.8 },
        { side: 'south', x: 0, y: -0.85, z: 2.0, w: 3.4, h: 1.2, d: 0.8 },
        { side: 'west', x: -2.0, y: -0.85, z: 0, w: 0.8, h: 1.2, d: 3.4 },
        { side: 'east', x: 2.0, y: -0.85, z: 0, w: 0.8, h: 1.2, d: 3.4 },
      ].map((part) => (
        <mesh key={`res-wall-${part.side}`} position={[part.x, part.y, part.z]} castShadow receiveShadow>
          <boxGeometry args={[part.w, part.h + 0.3 * explode, part.d]} />
          {commonMaterial(mode, '#d6d8df', 0.05, 0.88)}
        </mesh>
      ))}
      {[
        { side: 'north', x: 0, y: -0.08 + 0.9 * explode, z: -2.0, r: 2.55 },
        { side: 'south', x: 0, y: -0.08 + 0.9 * explode, z: 2.0, r: 2.55 },
        { side: 'west', x: -2.0, y: -0.08 + 0.9 * explode, z: 0, r: 2.55 },
        { side: 'east', x: 2.0, y: -0.08 + 0.9 * explode, z: 0, r: 2.55 },
      ].map((part) => (
        <mesh key={`res-roof-${part.side}`} position={[part.x, part.y, part.z]} rotation={[0, Math.PI * 0.25, 0]} castShadow>
          <coneGeometry args={[part.r, 0.95, 4]} />
          {commonMaterial(mode, '#4b556d', 0.1, 0.78)}
        </mesh>
      ))}
      <mesh position={[0, -1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.25, 0.5]} />
        {commonMaterial(mode, '#7a5a2d', 0.2, 0.65)}
      </mesh>
    </group>
  );
};

export const BridgeModel = ({ mode }: { mode: ViewMode }) => {
  const explode = mode === 'exploded' ? 1 : 0;
  const deckY = 0.2 + explode * 0.65;
  const archY = -0.25 - explode * 0.25;

  return (
    <group>
      <mesh position={[0, deckY, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.45, 1.4]} />
        {commonMaterial(mode, '#c8b28a', 0.2, 0.72)}
      </mesh>
      {[-3.2, -1.1, 1.1, 3.2].map((x) => (
        <mesh key={`bridge-pier-${x}`} position={[x, -1.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 1.8, 1.0]} />
          {commonMaterial(mode, '#8f8a84', 0.15, 0.82)}
        </mesh>
      ))}
      {[-2.15, 0, 2.15].map((x) => (
        <mesh
          key={`bridge-arch-${x}`}
          position={[x, archY, 0]}
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
          castShadow
        >
          <torusGeometry args={[1.1, 0.11, 12, 64, Math.PI]} />
          {commonMaterial(mode, '#7d7974', 0.15, 0.78)}
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, index) => {
        const x = -4.4 + index * 0.68;
        const railKey = x.toFixed(2);
        return (
          <group key={`bridge-rail-${railKey}`}>
            <mesh position={[x, deckY + 0.45, -0.55]} castShadow>
              <boxGeometry args={[0.08, 0.55, 0.08]} />
              {commonMaterial(mode, '#756d60', 0.18, 0.75)}
            </mesh>
            <mesh position={[x, deckY + 0.45, 0.55]} castShadow>
              <boxGeometry args={[0.08, 0.55, 0.08]} />
              {commonMaterial(mode, '#756d60', 0.18, 0.75)}
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[13, 4.5]} />
        {commonMaterial(mode, '#1c2d4a', 0.05, 0.98)}
      </mesh>
    </group>
  );
};

export const GenericModel = ({ mode }: { mode: ViewMode }) => (
  <group>
    <mesh position={[0, -1.55, 0]} receiveShadow>
      <boxGeometry args={[5.0, 0.35, 5.0]} />
      {commonMaterial(mode, '#2f3138', 0.35, 0.45)}
    </mesh>
    <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.1, 1.5, 3.1]} />
      {commonMaterial(mode, '#b79557', 0.2, 0.58)}
    </mesh>
    <mesh position={[0, 0.65, 0]} castShadow>
      <coneGeometry args={[2.45, 1.15, 4]} />
      {commonMaterial(mode, '#6e0b0b', 0.12, 0.74)}
    </mesh>
  </group>
);

export const ModelByCategory = ({ category, mode }: { category: Category; mode: ViewMode }) => {
  if (category === '皇宫') return <PalaceModel mode={mode} />;
  if (category === '官府') return <GovernmentModel mode={mode} />;
  if (category === '民居') return <ResidenceModel mode={mode} />;
  if (category === '桥梁') return <BridgeModel mode={mode} />;
  return <GenericModel mode={mode} />;
};

interface Scene3DProps {
  buildingName?: string;
  buildingCategory?: Category;
  buildingEra?: string;
  buildingLocation?: string;
  highlights?: string[];
}

const MODE_OPTIONS: Array<{ key: ViewMode; label: string }> = [
  { key: 'overview', label: '概览' },
  { key: 'exploded', label: '分层' },
  { key: 'wireframe', label: '线框' },
];

export const Scene3D: React.FC<Scene3DProps> = ({
  buildingName = '古建筑展示',
  buildingCategory,
  buildingEra,
  buildingLocation,
  highlights,
}) => {
  const [manualCategory, setManualCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const activeCategory = manualCategory ?? buildingCategory ?? '皇宫';

  const preset = useMemo(() => CATEGORY_PRESETS[activeCategory], [activeCategory]);

  const displayFeatures = useMemo(() => {
    if (highlights && highlights.length > 0) {
      return highlights.slice(0, 4);
    }
    return preset.suggestedFeatures;
  }, [highlights, preset.suggestedFeatures]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="relative w-full h-[560px] rounded-2xl overflow-hidden border border-indigo-500/10 bg-gradient-to-b from-[rgba(15,20,40,0.5)] to-[#E8E0D0]"
    >
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setManualCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-amber-400/25 text-[#C41E3A] border border-blue-500/30/40'
                : 'bg-[rgba(15,20,40,0.4)] text-white border border-[#2C2416]/20 hover:border-[#2C2416]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {MODE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setViewMode(option.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === option.key
                ? 'bg-sky-400/25 text-sky-200 border border-sky-300/40'
                : 'bg-[rgba(15,20,40,0.4)] text-white border border-[#2C2416]/20 hover:border-[#2C2416]/40'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="absolute top-16 left-4 z-20 rounded-xl px-3 py-2 bg-[rgba(15,20,40,0.4)] backdrop-blur-md border border-indigo-500/10">
        <p className="text-[#C41E3A] text-sm font-semibold">{buildingName}</p>
        <p className="text-[11px] text-slate-400 mt-1">{buildingEra ?? '历史时期待识别'} · {buildingLocation ?? '地点待识别'}</p>
      </div>

      <Canvas
        key={`${activeCategory}-${viewMode}`}
        shadows
        dpr={[1, 2]}
        camera={{ position: preset.cameraPosition, fov: 42 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#070b14');
          gl.toneMappingExposure = 1.1;
        }}
      >
        <fog attach="fog" args={['#070b14', 12, 40]} />
        <ambientLight intensity={0.45} />
        <hemisphereLight color="#f7efe2" groundColor="#0b1328" intensity={0.45} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.1}
          color="#ffe7b0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={35}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
        />
        <pointLight position={[-6, 4, -4]} intensity={0.35} color="#6aa7ff" />

        <ModelByCategory category={activeCategory} mode={viewMode} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]} receiveShadow>
          <circleGeometry args={[18, 64]} />
          <meshStandardMaterial color="#101624" roughness={0.95} metalness={0.05} />
        </mesh>

        <ContactShadows position={[0, -2.02, 0]} opacity={0.35} scale={16} blur={2.5} far={8} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={3}
          maxDistance={18}
          maxPolarAngle={Math.PI * 0.48}
          target={[0, -0.35, 0]}
          autoRotate={viewMode === 'overview'}
          autoRotateSpeed={0.35}
        />

        {/* 使用简单的环境光代替 HDR，避免 CDN 加载失败 */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} color="#ffffff" />
      </Canvas>

      <div className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-1 md:grid-cols-4 gap-2">
        <div className="rounded-lg px-3 py-2 bg-white/5 border border-indigo-500/10 backdrop-blur-md">
          <p className="text-[11px] text-slate-400">结构形态</p>
          <p className="text-xs text-white mt-1">{preset.structureType}</p>
        </div>
        <div className="rounded-lg px-3 py-2 bg-white/5 border border-indigo-500/10 backdrop-blur-md">
          <p className="text-[11px] text-slate-400">工程关注</p>
          <p className="text-xs text-white mt-1">{preset.engineeringFocus}</p>
        </div>
        <div className="rounded-lg px-3 py-2 bg-white/5 border border-indigo-500/10 backdrop-blur-md">
          <p className="text-[11px] text-slate-400">推荐观察点</p>
          <p className="text-xs text-white mt-1">{preset.recommendedView}</p>
        </div>
        <div className="rounded-lg px-3 py-2 bg-white/5 border border-indigo-500/10 backdrop-blur-md">
          <p className="text-[11px] text-slate-400">识别关键词</p>
          <p className="text-xs text-[#C41E3A] mt-1">{displayFeatures.join(' / ')}</p>
        </div>
      </div>
    </motion.div>
  );
};
