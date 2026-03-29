# 古建智识 - EdgeOne Pages 部署指南

## 为什么选择 EdgeOne Pages？

| 特性 | EdgeOne Pages | Vercel | GitHub Pages |
|-----|---------------|--------|--------------|
| 国内访问速度 | ⭐⭐⭐⭐⭐ 极快 | ⭐⭐ 慢 | ⭐⭐ 慢 |
| 免费额度 |  generous | generous | 有限 |
| 自定义域名 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| HTTPS | ✅ 自动 | ✅ 自动 | ✅ 自动 |
| 边缘缓存 | ✅ 全球加速 | ✅ | ❌ |
| 绑定 Git | ✅ 自动部署 | ✅ | ✅ |

**结论**: 如果用户主要在国内，EdgeOne Pages 是最佳选择！

---

## 部署步骤

### 方法一：通过 Git 仓库自动部署（推荐）

#### 1. 准备项目

确保你的代码已推送到 GitHub：

```bash
cd gujian-zhishi
git add -A
git commit -m "准备 EdgeOne Pages 部署"
git push origin master
```

#### 2. 创建 EdgeOne Pages 配置文件

创建 `edgeone.json`：

```json
{
  "name": "gujian-zhishi",
  "version": 2,
  "build": {
    "command": "npm install && npm run build",
    "output": "dist",
    "environment": {
      "VITE_ZHIPU_API_KEY": "c5cc6b4d1afc40f1b73106ae07e95cd5.ug0fjCyrxXSdv9jm"
    }
  },
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/**/*.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/**/*.css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/**/*.{png,jpg,jpeg,gif,svg,webp,ico}",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3. 创建部署配置文件

创建 `pages.json`（EdgeOne Pages 配置文件）：

```json
{
  "name": "gujian-zhishi",
  "buildCommand": "npm install --registry=https://registry.npmmirror.com && npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --registry=https://registry.npmmirror.com",
  "environmentVariables": {
    "VITE_ZHIPU_API_KEY": "c5cc6b4d1afc40f1b73106ae07e95cd5.ug0fjCyrxXSdv9jm",
    "NODE_VERSION": "18"
  },
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 4. 登录 EdgeOne Pages 控制台

1. 访问 https://console.cloud.tencent.com/edgeone/pages
2. 使用腾讯云账号登录
3. 点击 "创建项目"

#### 5. 导入 Git 仓库

- 选择 "从 Git 仓库导入"
- 授权 GitHub 访问
- 选择 `gujian-zhishi` 仓库
- 选择 `master` 分支

#### 6. 配置构建设置

| 配置项 | 值 |
|-------|-----|
| 框架预设 | Vite |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| 环境变量 | `VITE_ZHIPU_API_KEY=你的API Key` |

#### 7. 点击部署

等待构建完成（约 2-3 分钟），会自动分配一个 `.pages.dev` 域名。

---

### 方法二：CLI 命令行部署（高级用户）

#### 1. 安装 EdgeOne CLI

```bash
npm install -g @edgeone/cli
```

#### 2. 登录

```bash
edgeone login
# 会打开浏览器让你授权腾讯云账号
```

#### 3. 初始化项目

```bash
cd gujian-zhishi
edgeone pages init
```

#### 4. 部署

```bash
edgeone pages deploy
```

---

### 方法三：本地构建后上传（最简单）

#### 1. 本地构建

```bash
cd gujian-zhishi
npm run build
```

#### 2. 拖拽上传

1. 访问 EdgeOne Pages 控制台
2. 创建项目 → 选择 "直接上传"
3. 将 `dist` 文件夹拖拽上传
4. 等待部署完成

---

## 绑定自定义域名

### 1. 添加域名

在 EdgeOne Pages 控制台：
- 进入项目 → 域名管理
- 点击 "添加自定义域名"
- 输入你的域名，如 `gujian.yourdomain.com`

### 2. 配置 DNS

在你的域名服务商处添加 CNAME 记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|-------|
| CNAME | gujian | 你的pages域名.pages.dev |

例如：
```
gujian.yourdomain.com CNAME gujian-zhishi-xxx.pages.dev
```

### 3. 申请 SSL 证书

EdgeOne Pages 会自动申请 Let's Encrypt 证书，无需手动操作。

---

## 配置环境变量（API Key）

### 在控制台设置

1. 进入项目 → 设置 → 环境变量
2. 添加：
   - 名称：`VITE_ZHIPU_API_KEY`
   - 值：`你的API Key`
3. 保存后重新部署

### 在代码中使用

```typescript
// src/lib/ai/recognition.ts
const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY;
```

---

## 常见问题

### Q1: 部署后页面空白

**原因**: 资源路径问题

**解决**: 确保 `vite.config.ts` 中 `base: './'` 或 `base: '/'`

```typescript
export default defineConfig({
  base: './',  // 或根据域名调整
  // ...
})
```

### Q2: API 请求失败（CORS）

**原因**: 浏览器跨域限制

**解决**: 使用 EdgeOne Functions 做 API 代理

创建 `functions/api/[[path]].ts`：

```typescript
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 代理到智谱 API
  const targetUrl = 'https://open.bigmodel.cn' + url.pathname.replace('/api', '');
  
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
  
  return fetch(modifiedRequest);
}
```

然后在代码中使用相对路径：
```typescript
const API_BASE = '/api/paas/v4';  // 使用相对路径
```

### Q3: 如何启用缓存

EdgeOne Pages 自动启用全球边缘缓存，无需额外配置。

### Q4: 如何查看访问统计

在 EdgeOne 控制台：
- 数据分析 → 页面分析
- 可查看 PV、UV、地理位置等

---

## 与其他平台对比

### EdgeOne Pages vs Cloudflare Pages

| 对比项 | EdgeOne Pages | Cloudflare Pages |
|-------|---------------|------------------|
| 国内访问 | ✅ 飞快 | ❌ 慢（需代理） |
| 国外访问 | ✅ 快 | ✅ 快 |
| 免费额度 | 100,000 请求/天 | 100,000 请求/天 |
| 构建时间 | 2-3 分钟 | 2-3 分钟 |
| Git 集成 | ✅ | ✅ |

**结论**: 主要用户在国内 → EdgeOne Pages；主要用户在海外 → Cloudflare Pages

### EdgeOne Pages vs Vercel

| 对比项 | EdgeOne Pages | Vercel |
|-------|---------------|--------|
| 国内访问 | ✅ 快 | ❌ 很慢 |
| Serverless | ✅ Edge Functions | ✅ Edge Functions |
| 价格 | 国内更便宜 | 国外便宜 |

---

## 最佳实践

### 1. 使用国内 npm 镜像

在部署命令中使用：
```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. 优化构建速度

- 使用 `package-lock.json` 锁定依赖版本
- 开启 npm 缓存
- 使用 `vite-plugin-image-optimizer` 优化图片

### 3. 配置重定向规则

创建 `_redirects` 文件：
```
# 旧页面重定向到新页面
/old-showcase /showcase 301

# 自定义 404
/* /index.html 404
```

### 4. 添加自定义头部

创建 `_headers` 文件：
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

---

## 部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] `vite.config.ts` 中 `base` 配置正确
- [ ] 环境变量 `VITE_ZHIPU_API_KEY` 已设置
- [ ] EdgeOne Pages 项目已创建
- [ ] 构建成功无错误
- [ ] 网站可正常访问
- [ ] AI 识别功能正常
- [ ] 3D 展示功能正常
- [ ] （可选）自定义域名已绑定
- [ ] （可选）HTTPS 证书已生效

---

## 总结

EdgeOne Pages 是部署古建智识到国内的最佳选择：

✅ **国内访问速度极快** - 腾讯云全球加速
✅ **免费额度充足** - 足够个人和小团队使用
✅ **部署简单** - 支持 Git 自动部署和拖拽上传
✅ **生态完善** - 与腾讯云其他产品无缝集成

**推荐用法**: 
- 开发测试：使用自动分配的 `.pages.dev` 域名
- 正式环境：绑定自己的域名，如 `gujian.yourdomain.com`

---

<p align="center">
  快去 EdgeOne Pages 部署你的古建智识吧！🚀
</p>
