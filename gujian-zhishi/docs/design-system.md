# 古建智识 - 设计系统规范文档

## 项目概述
古建智识是一个 AI 驱动的中国古代建筑识别系统，设计风格应体现：
- **中国传统美学** - 宣纸质感、墨色层次、金色点缀
- **现代科技感** - 玻璃拟态、流畅动画、清晰层次
- **文化遗产气质** - 庄重典雅、细节精致、色彩克制

---

## 1. 色彩系统

### 1.1 主色调
| 颜色名称 | Tailwind 类 | HEX 值 | 用途 |
|---------|------------|--------|------|
| 帝王金 | `china-gold` | `#D4AF37` | 主按钮、重点高亮、Logo |
| 帝王金亮 | `china-gold-light` | `#E5C158` | 悬停状态、渐变 |
| 帝王金暗 | `china-gold-dark` | `#B8962F` | 激活状态、阴影 |
| 朱砂红 | `china-red` | `#C41E3A` | 印章按钮、重要提示 |
| 朱砂红亮 | `china-red-light` | `#D4384F` | 悬停状态 |

### 1.2 墨色阶（文字）
| 颜色名称 | CSS 变量 | HEX 值 | 用途 |
|---------|---------|--------|------|
| 浓墨 | `--ink-strong` | `#231d12` | 标题、重要文字 |
| 深墨 | `--ink` | `#3c3122` | 正文 |
| 中墨 | `--ink-muted` | `#5A4D3A` | 次要文字 |
| 淡墨 | `--ink-soft` | `#8B7355` | 辅助文字、placeholder |

### 1.3 背景色阶
| 颜色名称 | CSS 变量 | HEX 值 | 用途 |
|---------|---------|--------|------|
| 宣纸白 | `--bg-0` | `#f7f4ee` | 主背景 |
| 宣纸灰 | `--bg-1` | `#f1eadf` | 次要背景 |
| 宣纸暗 | `--bg-2` | `#e8dfd0` | 深色区块背景 |
| 墨黑 | `--bg-dark` | `#2C2416` | 深色模式背景（如有） |

### 1.4 功能色
- **分割线**: `rgba(65, 46, 20, 0.14)` - 细微分隔
- **边框**: `rgba(65, 46, 20, 0.1)` - 卡片边框
- **金色边框**: `rgba(212, 175, 55, 0.2)` - 强调边框

---

## 2. 排版系统

### 2.1 字体栈
```css
/* 主要文字 */
font-family: 'Inter', 'PingFang SC', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;

/* 标题（可选） */
font-family: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', serif;
```

### 2.2 字号规范
| 层级 | 桌面端 | 移动端 | 字重 | 用途 |
|-----|--------|--------|------|------|
| H1 | 56-72px | 36-48px | 700 | 页面主标题 |
| H2 | 40-48px | 28-36px | 700 | 章节标题 |
| H3 | 28-32px | 22-24px | 600 | 卡片标题 |
| H4 | 20-24px | 18-20px | 600 | 小标题 |
| Body | 16-18px | 15-16px | 400 | 正文 |
| Small | 14px | 13-14px | 400 | 辅助文字 |
| Caption | 12px | 11-12px | 400 | 标签、注释 |

### 2.3 行高
- 标题: `1.2 - 1.3`
- 正文: `1.6 - 1.8`
- 紧凑: `1.4`

---

## 3. 间距系统

### 3.1 基础单位
- **4px** 为基础单位
- 使用 Tailwind 默认间距即可

### 3.2 布局规范
| 元素 | 桌面端 | 平板 | 移动端 |
|-----|--------|------|--------|
| 页面最大宽度 | 1280px | 100% | 100% |
| 容器内边距 | 24-48px | 16-24px | 16px |
| 章节间距 | 128px (py-32) | 80-96px | 64px |
| 卡片间距 | 24-32px | 16-24px | 16px |

### 3.3 组件间距
- 卡片内边距: `24-32px (p-6 to p-8)`
- 按钮内边距: `16px 32px (px-8 py-4)`
- 标签内边距: `4px 12px (px-3 py-1)`

---

## 4. 圆角系统

| 名称 | 值 | 用途 |
|-----|---|------|
| sm | 8px | 小按钮、标签 |
| md (china) | 12px | 卡片、输入框 |
| lg (china-lg) | 20px | 大卡片、弹窗 |
| full | 9999px | 按钮、头像 |

---

## 5. 阴影系统

| 名称 | 值 | 用途 |
|-----|---|------|
| shadow-china | `0 4px 20px rgba(44, 36, 22, 0.08)` | 默认卡片 |
| shadow-china-lg | `0 8px 40px rgba(44, 36, 22, 0.12)` | 悬停卡片 |
| shadow-china-xl | `0 12px 60px rgba(44, 36, 22, 0.16)` | 弹窗、模态框 |
| shadow-gold | `0 4px 20px rgba(212, 175, 55, 0.3)` | 金色强调 |
| shadow-gold-lg | `0 8px 40px rgba(212, 175, 55, 0.4)` | 金色悬停 |

---

## 6. 组件样式

### 6.1 按钮

**主按钮 (btn-primary)**
```
- 背景: 渐变 gold → gold-dark
- 文字: china-ink (深色)
- 圆角: full (胶囊形)
- 阴影: shadow-gold
- 悬停: -translate-y-0.5, shadow-gold-lg, 闪光效果
- 过渡: 300ms
```

**次要按钮 (btn-secondary)**
```
- 背景: white/80 + backdrop-blur
- 边框: 1px china-ink/10
- 文字: china-ink
- 圆角: full
- 悬停: bg-white, border-china-gold/30
```

**印章按钮 (btn-seal)**
```
- 背景: china-red
- 文字: white
- 圆角: sm (方形)
- 字体: Noto Serif SC
- 悬停: bg-china-red-light
```

### 6.2 卡片

**玻璃卡片 (card-glass)**
```
- 背景: white/80 + backdrop-blur-md
- 边框: 1px white/60
- 圆角: china-lg (20px)
- 阴影: shadow-china
- 悬停: shadow-china-lg, -translate-y-1
```

**金色边框卡片 (card-gold)**
```
- 背景: white/90
- 边框: 1px china-gold/20
- 圆角: china-lg
- 阴影: shadow-china
- 悬停: shadow-gold, border-china-gold/40
```

**功能卡片 (card-feature)**
```
- 背景: white/70 + backdrop-blur-sm
- 边框: 1px china-ink/5
- 圆角: china (12px)
- 阴影: shadow-china
- 悬停: shadow-china-lg, -translate-y-2, 金色渐变遮罩
```

### 6.3 标签

**金色标签 (tag-gold)**
```
- 背景: china-gold/10
- 文字: china-gold-dark
- 边框: 1px china-gold/20
- 圆角: full
```

**红色标签 (tag-red)**
```
- 背景: china-red/10
- 文字: china-red
- 边框: 1px china-red/20
- 圆角: full
```

### 6.4 导航栏

**玻璃导航 (nav-glass)**
```
- 背景: white/70 + backdrop-blur-xl
- 边框: 1px bottom china-ink/5
- 阴影: shadow-china
- 滚动后: bg-white/90, 阴影增强
```

---

## 7. 动画系统

### 7.1 过渡时长
- **fast**: 150ms - 按钮状态、小交互
- **normal**: 300ms - 卡片悬停、展开
- **slow**: 500ms - 页面切换、大元素

### 7.2 缓动函数
- **默认**: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **弹性**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce)

### 7.3 常用动画
- **fade-in**: 淡入 (0.6s)
- **slide-up**: 上滑 (0.8s, translateY 30px)
- **scale-in**: 缩放入场 (0.3s, scale 0.9)
- **pulse-glow**: 金色脉冲发光 (2s infinite)
- **float**: 上下浮动 (6s infinite)

---

## 8. 特殊效果

### 8.1 文字渐变
```
.text-gradient-gold:
  bg-gradient-to-r from-china-gold via-china-gold-light to-china-gold
  bg-clip-text text-transparent
```

### 8.2 装饰性下划线
```
.border-decorated:
  底部中央渐变线, 金色, 宽度 64px
```

### 8.3 中国风纹样背景
```
.bg-pattern-china:
  SVG 回纹图案, 金色, 透明度 3%
```

---

## 9. 响应式断点

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## 10. 设计原则

1. **克制用色** - 以米白、墨色为主，金色作为点睛之笔
2. **层次清晰** - 通过阴影、透明度、背景色建立层次
3. **细节精致** - 圆角、间距、过渡都要精致
4. **文化气息** - 适当使用中国元素（纹样、印章字体）
5. **现代感** - 玻璃拟态、流畅动画体现科技感

---

## 11. 待修复问题清单

### 高优先级
- [ ] RecognitionResultCard 使用深色主题 (bg-gray-800)，需改为浅色主题
- [ ] 统一使用新版 NewNavbar 和 NewHeroSection，删除旧版
- [ ] 将硬编码颜色 #2C2416, #5A4D3A, #8B7355 替换为 china-ink 系列

### 中优先级
- [ ] 统一按钮样式，使用 btn-primary / btn-secondary 类
- [ ] 统一卡片样式，使用 card-glass / card-gold / card-feature 类
- [ ] 优化各组件悬停效果

### 低优先级
- [ ] 添加更多中国风装饰元素
- [ ] 优化加载动画
- [ ] 添加页面过渡动画

---

## 12. 文件结构

```
gujian-zhishi/
├── tailwind.config.js      # 颜色、字体、阴影配置 ✓ 已更新
├── src/
│   ├── index.css           # 全局样式、CSS 变量 ✓ 已更新
│   ├── components/
│   │   ├── NewNavbar.tsx   # 导航栏 - 待优化
│   │   ├── NewHeroSection.tsx  # 英雄区 - 待优化
│   │   ├── FeaturesSection.tsx # 功能展示 - 待优化
│   │   ├── ShowcaseSection.tsx # 案例展示 - 待优化
│   │   ├── GlassImageUploader.tsx  # 上传组件 - 待优化
│   │   ├── RecognitionResultCard.tsx   # 结果卡片 - 需修复深色主题
│   │   ├── BuildingComparison.tsx  # 对比组件 - 待优化
│   │   └── ...
```

---

**版本**: 1.0
**更新日期**: 2026-03-25
**设计师**: Gemini
