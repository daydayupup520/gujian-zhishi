# 高性能AI配置指南

## 支持的模型

### 1. 智谱清言（默认）
- 模型：`glm-4v-plus`
- 特点：大赛指定，平衡之选
- API Key获取：https://open.bigmodel.cn/

### 2. 阿里通义千问（性能最强）
- 模型：`qwen-vl-max-latest`
- 特点：图像理解能力最强，中文语境优化
- API Key获取：https://dashscope.aliyun.com/
- **推荐：不在乎钱的用户首选！**

### 3. 百度文心一言（备选）
- 模型：`ernie-4.0-turbo-8k`
- 特点：生态丰富
- API Key获取：https://console.bce.baidu.com/

## 环境变量配置

在 `.env.local` 文件中添加：

```bash
# 智谱清言（必选基础模型）
VITE_ZHIPU_API_KEY=你的智谱API Key

# 阿里通义千问（可选，性能最强）
VITE_DASHSCOPE_API_KEY=你的阿里云API Key

# 百度文心（可选）
VITE_BAIDU_API_KEY=你的百度API Key

# 融合模式
# single: 只用第一个成功的模型
# voting: 多模型投票（最准确）
# best: 选择置信度最高的结果
VITE_AI_FUSION_MODE=best
```

## 性能对比

| 场景 | GLM-4V-Plus | Qwen-VL-Max | 多模型融合 |
|-----|-------------|-------------|-----------|
| 单图识别 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 多图融合 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐⭐ |
| 复杂建筑 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐⭐ |
| 罕见建筑 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 响应速度 | 快 | 中等 | 慢（多模型） |
| 价格 | 中 | 高 | 最高 |

## 推荐配置

### 土豪极致性能版（推荐）
```bash
VITE_ZHIPU_API_KEY=xxx
VITE_DASHSCOPE_API_KEY=xxx
VITE_AI_FUSION_MODE=best
```
效果：同时调用智谱+通义，选最佳结果

### 单模型高性能版
```bash
VITE_ZHIPU_API_KEY=xxx
VITE_DASHSCOPE_API_KEY=xxx
VITE_AI_FUSION_MODE=single
```
效果：优先使用通义，失败时用智谱兜底

## 获取阿里云API Key

1. 访问 https://dashscope.aliyun.com/
2. 注册/登录阿里云账号
3. 进入"控制台" → "API-KEY管理"
4. 创建新的API Key
5. 新用户有免费额度！

## 费用参考

| 模型 | 价格（每千次调用） |
|-----|------------------|
| GLM-4V-Plus | 约 5-10元 |
| Qwen-VL-Max | 约 10-20元 |
| 多模型融合 | 约 15-30元 |

**一次识别成本约 0.01-0.05元**

## 切换模型

修改代码中的默认模型：

```typescript
// src/lib/ai/recognition-multi.ts
const DEFAULT_MODEL = 'qwen'; // 改为'qwen'使用通义
```
