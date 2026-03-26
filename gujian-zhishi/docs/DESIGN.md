# 古建智识 - 系统设计文档

## 1. 项目概述

### 1.1 项目简介

**古建智识**是一款多模态AI驱动的中国古代建筑3D可视化系统，旨在通过人工智能技术赋能文化遗产保护与传承。该系统支持用户上传古建筑图片进行智能识别，并提供3D可视化、知识图谱、对比分析和病害诊断等功能。

**赛事背景**: 2026年中国大学生计算机设计大赛（4C）参赛作品  
**赛道**: AI+信息可视化设计  
**主题**: 中国古代建筑成就——中华优秀传统文化系列之六

### 1.2 核心功能

| 功能模块 | 描述 | 技术亮点 |
|---------|------|---------|
| 🤖 智能识别 | 上传古建筑图片，AI识别建筑类型、年代、风格 | 智谱清言GLM-4V多模态大模型 |
| 🏛️ 3D可视化 | 沉浸式3D建筑浏览体验 | Three.js + WebGPU渲染 |
| 📚 知识图谱 | RAG检索增强生成 | 向量检索 + LLM生成 |
| ⚖️ 对比分析 | 多建筑横向对比与可视化 | 数据可视化 + 雷达图 |
| 🔍 病害诊断 | 建筑健康状态评估 | AI辅助诊断算法 |
| 🗺️ 历史GIS | 时空维度可视化 | 地图集成 + 时间轴 |

### 1.3 数据范围

系统包含20个中国古代建筑的完整数据：

- **民居**: 福建土楼、北京四合院、陕西窑洞、开平碉楼
- **官府**: 直隶总督署、内乡县衙、平遥县衙、丽江木府
- **皇宫**: 故宫太和殿、故宫乾清宫、故宫午门、沈阳大政殿
- **桥梁**: 赵州桥、卢沟桥、广济桥、安平桥、五亭桥

---

## 2. 系统架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        表现层 (Presentation)                     │
├─────────────┬─────────────┬─────────────┬───────────────────────┤
│  智能识别    │  3D可视化    │  知识图谱    │  对比/诊断/GIS        │
│  Diagnosis  │  Showcase   │  Knowledge  │  Comparison/DB       │
└──────┬──────┴──────┬──────┴──────┬──────┴───────────┬───────────┘
       │             │             │                  │
       ▼             ▼             ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      应用层 (Application)                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐ │
│  │ Image     │  │ 3D Scene  │  │ AI Service│  │ Data Service  │ │
│  │ Upload    │  │ Manager   │  │ Adapter   │  │ Manager       │ │
│  └───────────┘  └───────────┘  └───────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       ▼                      ▼                      ▼
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│  数据层     │        │  AI服务层   │        │  存储层     │
│  (Data)     │        │  (AI)       │        │  (Storage)  │
├─────────────┤        ├─────────────┤        ├─────────────┤
│ buildings   │        │ GLM-4V API  │        │ IndexedDB   │
│ .json       │◄──────►│ (Zhipu AI)  │        │ (Dexie)     │
├─────────────┤        ├─────────────┤        ├─────────────┤
│ knowledge/  │        │ Recognition │        │ Local       │
│ docs        │        │ Service     │        │ Storage     │
├─────────────┤        └─────────────┘        └─────────────┘
│ images/     │
└─────────────┘
```

### 2.2 技术栈

#### 2.2.1 前端技术栈

| 类别 | 技术 | 版本 | 用途 |
|-----|------|------|------|
| 框架 | React | 19.2.0 | UI组件构建 |
| 语言 | TypeScript | 5.9.3 | 类型安全 |
| 构建 | Vite | 7.3.1 | 快速开发与构建 |
| 路由 | React Router | 7.13.1 | 单页应用路由 |
| 样式 | Tailwind CSS | 3.4.17 | 原子化CSS |
| 动画 | Framer Motion | 12.34.3 | 交互动画 |
| 3D渲染 | Three.js | 0.183.2 | 3D场景渲染 |
| React 3D | @react-three/fiber | 9.5.0 | React Three.js集成 |
| 3D辅助 | @react-three/drei | 10.7.7 | 3D场景组件 |
| 图标 | lucide-react | 0.575.0 | SVG图标库 |
| 特效 | canvas-confetti | 1.9.4 | 庆祝动画 |

#### 2.2.2 数据与AI技术栈

| 类别 | 技术 | 版本 | 用途 |
|-----|------|------|------|
| 客户端DB | Dexie | 4.3.0 | IndexedDB封装 |
| AI框架 | LangChain | 1.2.28 | AI应用框架 |
| AI模型 | GLM-4V | API | 多模态识别 |
| 类型定义 | @types/three | 0.183.1 | Three.js类型 |

#### 2.2.3 开发与测试工具

| 类别 | 技术 | 版本 | 用途 |
|-----|------|------|------|
| E2E测试 | Playwright | 1.58.2 | 端到端测试 |
| 代码规范 | ESLint | 9.39.1 | 代码检查 |
| PostCSS | autoprefixer | 10.4.27 | CSS后处理 |

---

## 3. 功能模块设计

### 3.1 智能识别模块

#### 3.1.1 功能描述

通过上传古建筑图片，系统使用智谱清言GLM-4V多模态大模型进行智能识别，返回建筑的详细信息。

#### 3.1.2 核心能力

- **建筑分类**: 民居、官府、皇宫、桥梁、其他
- **年代识别**: 朝代判断 + 建造年份估计
- **构件分析**: 斗拱类型、脊兽数量、彩画纹样、屋顶形制
- **地理定位**: 自动推断经纬度坐标
- **多图融合**: 支持多视角图片交叉验证

#### 3.1.3 技术实现

```typescript
// AI识别服务架构
interface RecognitionService {
  // 单图识别
  recognizeBuilding(imageBase64: string): Promise<RecognitionResult>;
  
  // 多图融合识别
  recognizeBuildingMulti(imageBase64List: string[]): Promise<RecognitionResult>;
  
  // 模拟识别（测试/演示）
  mockRecognizeBuilding(imageCount: number): Promise<RecognitionResult>;
}

// 识别结果数据结构
interface RecognitionResult {
  name: string;                    // 建筑名称
  category: Category;              // 建筑类别
  era: string;                     // 所属朝代
  year: string;                    // 建造年代
  location: string;                // 所在地点
  features: string[];              // 建筑特点
  description: string;             // 详细描述
  confidence: number;              // 置信度
  components?: ComponentsInfo;     // 构件信息
  fusion?: FusionInfo;             // 融合信息
  gis?: GisInfo;                   // 地理信息
}
```

#### 3.1.4 提示词工程

系统使用精心设计的提示词引导AI模型输出结构化数据：

```
请识别这N张中国古代建筑图像（多视角），并交叉验证后以 JSON 返回：
{
  "name": "建筑名称",
  "category": "建筑类别（民居/官府/皇宫/桥梁/其他）",
  "era": "所属朝代",
  "year": "建造年代",
  "location": "所在地点",
  "features": ["建筑特点1", "建筑特点2"],
  "description": "详细描述",
  "confidence": 0.95,
  "components": { /* 构件详情 */ },
  "fusion": { /* 多图融合信息 */ },
  "gis": { /* 地理信息 */ }
}

要求：
1. 只输出 JSON，不输出解释文字
2. 建筑必须是 1911 年前中国古代建筑
3. category 只能是 民居/官府/皇宫/桥梁/其他
4. 无法确认的信息合理估计并标注置信度
```

### 3.2 3D可视化模块

#### 3.2.1 功能描述

使用Three.js构建沉浸式3D建筑浏览体验，支持旋转、缩放、细节查看。

#### 3.2.2 核心组件

| 组件 | 功能 | 技术实现 |
|-----|------|---------|
| Scene3D | 3D场景容器 | Canvas + WebGLRenderer |
| DiseaseHeatmap3D | 病害热力图 | 3D几何体 + 颜色映射 |
| ProtectionStrategySandbox | 保护策略沙盘 | 交互式3D场景 |
| VisualizationLabSection | 可视化实验室 | 多维度数据展示 |

#### 3.2.3 渲染管线

```
模型加载 → 材质贴图 → 光照设置 → 相机控制 → 交互处理 → 渲染输出
    │           │          │          │          │
    ▼           ▼          ▼          ▼          ▼
 GLTF/GLB   PBR材质    环境光+    OrbitControls   Raycaster
             系统     定向光+      鼠标交互      点击检测
                      点光源
```

### 3.3 知识图谱模块

#### 3.3.1 功能描述

基于RAG（检索增强生成）技术，提供专业的建筑知识讲解，包括历史背景、结构特色、文化价值。

#### 3.3.2 知识库结构

```
public/data/
├── knowledge/
│   ├── minju.md      # 民居建筑知识
│   ├── guanfu.md     # 官府建筑知识
│   ├── huanggong.md  # 皇宫建筑知识
│   ├── qiaoliang.md  # 桥梁建筑知识
│   ├── dougong.md    # 斗拱专题
│   ├── caizuo.md     # 彩画专题
│   ├── wuding.md     # 屋顶专题
│   ├── jishou.md     # 脊兽专题
│   ├── history.md    # 建筑史概览
│   └── culture.md    # 文化价值
└── buildings.json    # 建筑基础数据
```

### 3.4 对比分析模块

#### 3.4.1 功能描述

支持多建筑横向对比，通过可视化图表展示建筑特征差异。

#### 3.4.2 对比维度

- 建筑类型对比
- 年代分布分析
- 地域特征对比
- 结构特点对比
- 文化价值评估

#### 3.4.3 可视化组件

```typescript
// 对比数据接口
interface ComparisonData {
  buildings: Building[];
  dimensions: ComparisonDimension[];
  radarData: RadarChartData;
  timelineData: TimelineData;
}

// 使用Recharts/Chart.js实现雷达图、柱状图、时间轴
```

### 3.5 病害诊断模块

#### 3.5.1 功能描述

AI辅助的建筑健康状态评估系统，支持病害记录、诊断分析、保护建议。

#### 3.5.2 病害分类

| 病害类型 | 严重程度 | 处理建议 |
|---------|---------|---------|
| 结构裂缝 | 严重/中度/轻微 | 立即/近期/定期 |
| 材料风化 | 严重/中度/轻微 | 立即/近期/定期 |
| 彩画褪色 | 严重/中度/轻微 | 立即/近期/定期 |
| 虫害侵蚀 | 严重/中度/轻微 | 立即/近期/定期 |
| 水渍渗漏 | 严重/中度/轻微 | 立即/近期/定期 |

#### 3.5.3 数据结构

```typescript
interface DiseaseRecord {
  id?: number;
  buildingId: string;
  buildingName: string;
  diseaseType: string;
  severity: '轻微' | '中度' | '严重';
  position: string;
  description: string;
  recommendation: string;
  estimatedCost: string;
  urgency: '立即处理' | '近期处理' | '定期监测';
  recordedAt: number;
  status: 'pending' | 'in_progress' | 'completed';
}
```

### 3.6 历史GIS模块

#### 3.6.1 功能描述

时空维度可视化，展示建筑的历史地理背景。

#### 3.6.2 核心功能

- **地图定位**: 显示建筑在地图上的位置
- **时间轴**: 展示建筑历史沿革
- **疆域变化**: 展示不同朝代的政区背景
- **时空关联**: 建筑与历史事件的关联

---

## 4. 数据存储设计

### 4.1 客户端数据库

使用Dexie封装IndexedDB，提供以下数据表：

#### 4.1.1 数据表结构

```typescript
// 识别历史记录
interface RecognitionHistory {
  id?: number;
  timestamp: number;
  result: RecognitionResult;
  imageCount: number;
  notes?: string;
}

// 收藏的建筑
interface FavoriteBuilding {
  id?: number;
  buildingId: string;
  name: string;
  category: string;
  era: string;
  location: string;
  addedAt: number;
}

// 病害记录
interface DiseaseRecord {
  id?: number;
  buildingId: string;
  buildingName: string;
  diseaseType: string;
  severity: '轻微' | '中度' | '严重';
  position: string;
  description: string;
  recommendation: string;
  estimatedCost: string;
  urgency: '立即处理' | '近期处理' | '定期监测';
  recordedAt: number;
  status: 'pending' | 'in_progress' | 'completed';
}

// 对比组
interface ComparisonGroup {
  id?: number;
  name: string;
  buildingIds: string[];
  createdAt: number;
  notes?: string;
}

// 用户设置
interface UserSettings {
  id?: number;
  key: string;
  value: any;
  updatedAt: number;
}
```

#### 4.1.2 数据库版本管理

```typescript
class GujianDatabase extends Dexie {
  constructor() {
    super('GujianZhishiDB');
    
    this.version(1).stores({
      recognitionHistory: '++id, timestamp, [result.category]',
      favoriteBuildings: '++id, buildingId, category, addedAt',
      diseaseRecords: '++id, buildingId, diseaseType, severity, recordedAt, status',
      comparisonGroups: '++id, name, createdAt',
      settings: '++id, key, updatedAt'
    });
  }
}
```

### 4.2 静态数据

#### 4.2.1 建筑数据 (buildings.json)

```json
{
  "buildings": [
    {
      "id": "taihe-dian",
      "name": "故宫太和殿",
      "category": "皇宫",
      "era": "明清",
      "year": "1420年",
      "location": "北京",
      "coordinates": [116.3974, 39.9163],
      "features": ["重檐庑殿顶", "黄色琉璃瓦", "和玺彩画"],
      "images": ["taihe-dian-1.jpg", "taihe-dian-2.jpg"],
      "description": "...",
      "culturalValue": "...",
      "structureDetails": {...}
    }
  ]
}
```

---

## 5. 路由设计

### 5.1 路由表

| 路由 | 页面 | 功能描述 |
|-----|------|---------|
| `/` | HomePage | 首页，功能入口 |
| `/diagnosis` | DiagnosisPage | 智能识别页面 |
| `/comparison` | ComparisonPage | 对比分析页面 |
| `/knowledge` | KnowledgePage | 知识图谱页面 |
| `/showcase` | ShowcasePage | 3D展示页面 |
| `/database` | DatabasePage | 数据库/病害管理 |

### 5.2 路由配置

```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="diagnosis" element={<DiagnosisPage />} />
      <Route path="comparison" element={<ComparisonPage />} />
      <Route path="knowledge" element={<KnowledgePage />} />
      <Route path="showcase" element={<ShowcasePage />} />
      <Route path="database" element={<DatabasePage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## 6. 组件架构

### 6.1 组件层次

```
App
├── AppProvider (全局状态)
├── BrowserRouter
│   └── MainLayout
│       ├── NewNavbar (导航栏)
│       ├── Outlet (页面内容)
│       │   ├── HomePage
│       │   ├── DiagnosisPage
│       │   ├── ComparisonPage
│       │   ├── KnowledgePage
│       │   ├── ShowcasePage
│       │   └── DatabasePage
│       └── NewFooter (页脚)
```

### 6.2 核心组件列表

| 组件 | 类型 | 功能 |
|-----|------|------|
| NewNavbar | Layout | 响应式导航栏 |
| NewFooter | Layout | 页脚信息 |
| MainLayout | Layout | 页面布局容器 |
| NewHeroSection | Section | 首页Hero区域 |
| FeaturesSection | Section | 功能特性展示 |
| HowItWorksSection | Section | 使用流程说明 |
| TechStackSection | Section | 技术栈展示 |
| ImageUploader | Feature | 图片上传组件 |
| GlassImageUploader | Feature | 毛玻璃风格上传器 |
| RecognitionResultCard | Feature | 识别结果卡片 |
| GlassRecognitionResult | Feature | 毛玻璃结果展示 |
| Scene3D | 3D | 3D场景容器 |
| DiseaseHeatmap3D | 3D | 3D病害热力图 |
| BuildingComparison | Feature | 建筑对比组件 |
| BuildingDiagnosisSection | Feature | 病害诊断区域 |
| HistoricalGISSection | Feature | 历史GIS展示 |
| InnovationLabSection | Feature | 创新实验室 |
| ProtectionStrategySandbox | Feature | 保护策略沙盘 |
| VisualizationLabSection | Feature | 可视化实验室 |
| ShowcaseSection | Feature | 作品展示区域 |
| ParticleBackground | UI | 粒子背景效果 |
| LoadingAnimation | UI | 加载动画 |

### 6.3 组件设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 通用组件抽离，支持配置化
3. **组合优于继承**: 使用组合模式构建复杂UI
4. **状态提升**: 共享状态提升至Context或父组件
5. **懒加载**: 3D组件使用动态导入优化性能

---

## 7. 状态管理

### 7.1 全局状态 (AppContext)

```typescript
interface AppState {
  // 识别状态
  recognitionResult: RecognitionResult | null;
  isRecognizing: boolean;
  
  // 当前建筑
  currentBuilding: Building | null;
  
  // 收藏列表
  favorites: string[];
  
  // 对比列表
  comparisonList: string[];
  
  // 用户设置
  settings: UserSettings;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Actions
  setRecognitionResult: (result: RecognitionResult) => void;
  setCurrentBuilding: (building: Building) => void;
  toggleFavorite: (buildingId: string) => void;
  addToComparison: (buildingId: string) => void;
  removeFromComparison: (buildingId: string) => void;
}
```

### 7.2 本地状态

各页面组件维护本地状态：

```typescript
// DiagnosisPage
const [uploadedImages, setUploadedImages] = useState<File[]>([]);
const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
const [isLoading, setIsLoading] = useState(false);

// ComparisonPage
const [selectedBuildings, setSelectedBuildings] = useState<string[]>([]);
const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
```

---

## 8. 样式系统

### 8.1 Tailwind配置

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 古建筑配色
        'gujian-gold': '#D4AF37',
        'gujian-red': '#8B0000',
        'gujian-wood': '#8B4513',
        'gujian-stone': '#696969',
        'gujian-jade': '#00A86B',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'serif'],
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
```

### 8.2 自定义CSS

```css
/* custom.css */
/* 毛玻璃效果 */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 金色渐变文字 */
.text-gradient-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 50%, #D4AF37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 3D容器 */
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
}
```

---

## 9. 性能优化

### 9.1 代码分割

```typescript
// 路由懒加载
const DiagnosisPage = lazy(() => import('./pages/DiagnosisPage'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));

// 3D组件动态导入
const Scene3D = lazy(() => import('./components/Scene3D'));
```

### 9.2 图片优化

- 使用WebP格式
- 实现懒加载
- 提供响应式图片
- 压缩资源文件

### 9.3 渲染优化

- React.memo防止不必要重渲染
- useMemo缓存计算结果
- useCallback缓存回调函数
- Three.js对象池复用

### 9.4 数据库优化

- 索引优化查询
- 分页加载历史记录
- 数据压缩存储

---

## 10. 测试策略

### 10.1 测试类型

| 测试类型 | 工具 | 覆盖范围 |
|---------|------|---------|
| E2E测试 | Playwright | 关键用户流程 |
| 组件测试 | React Testing Library | 核心组件 |
| 集成测试 | Vitest | API集成、数据处理 |

### 10.2 E2E测试场景

```typescript
// e2e/recognition.spec.ts
test('用户上传图片并完成识别', async ({ page }) => {
  await page.goto('/diagnosis');
  
  // 上传图片
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-assets/taihe-dian.jpg');
  
  // 等待识别完成
  await page.waitForSelector('[data-testid="recognition-result"]');
  
  // 验证结果
  await expect(page.locator('[data-testid="building-name"]')).toHaveText('故宫太和殿');
});
```

---

## 11. 安全设计

### 11.1 API Key管理

```typescript
// .env
VITE_ZHIPU_API_KEY=your_api_key_here

// 代码中使用
const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY || '';
```

### 11.2 输入验证

- 图片类型验证（jpg, png, webp）
- 图片大小限制（最大10MB）
- 用户输入XSS防护
- URL参数校验

### 11.3 数据安全

- 敏感数据本地存储加密
- API通信HTTPS
- CORS策略配置

---

## 12. 部署方案

### 12.1 构建配置

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### 12.2 部署方式

1. **静态托管**: Vercel / Netlify / GitHub Pages
2. **CDN加速**: 静态资源CDN分发
3. **容器化**: Docker镜像部署

---

## 13. 开发规范

### 13.1 代码规范

- **ESLint**: 代码质量和风格检查
- **TypeScript**: 严格类型检查
- **命名规范**: 
  - 组件: PascalCase (e.g., `ImageUploader.tsx`)
  - 工具函数: camelCase (e.g., `fileToBase64.ts`)
  - 常量: UPPER_SNAKE_CASE
  - 类型: PascalCase + 后缀 (e.g., `RecognitionResult`)

### 13.2 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具
```

### 13.3 文件组织

```
src/
├── components/        # UI组件
│   ├── ui/           # 基础UI组件
│   ├── features/     # 功能组件
│   └── layout/       # 布局组件
├── pages/            # 页面组件
├── hooks/            # 自定义Hooks
├── lib/              # 工具库
│   ├── ai/          # AI相关
│   ├── db/          # 数据库
│   └── utils/       # 工具函数
├── contexts/         # React Context
├── types/            # TypeScript类型
├── styles/           # 样式文件
└── assets/           # 静态资源
```

---

## 14. 附录

### 14.1 依赖清单

#### 生产依赖

```json
{
  "@react-three/drei": "^10.7.7",
  "@react-three/fiber": "^9.5.0",
  "@types/three": "^0.183.1",
  "canvas-confetti": "^1.9.4",
  "dexie": "^4.3.0",
  "framer-motion": "^12.34.3",
  "langchain": "^1.2.28",
  "lucide-react": "^0.575.0",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.1",
  "three": "^0.183.2"
}
```

#### 开发依赖

```json
{
  "@eslint/js": "^9.39.1",
  "@playwright/test": "^1.58.2",
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "autoprefixer": "^10.4.27",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.9.3",
  "typescript-eslint": "^8.48.0",
  "vite": "^7.3.1"
}
```

### 14.2 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **WebGL**: 支持 WebGL 2.0

### 14.3 API限制

- **智谱清言GLM-4V**: 
  - 图片大小: 最大5MB
  - 并发限制: 根据套餐
  - 响应格式: JSON

---

## 15. 版本历史

| 版本 | 日期 | 说明 |
|-----|------|------|
| v1.0.0 | 2026-03 | 初版完成，比赛提交 |

---

**文档维护**: 古建智识开发团队  
**最后更新**: 2026年3月
