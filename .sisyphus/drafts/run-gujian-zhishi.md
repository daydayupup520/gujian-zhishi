# Draft: Run gujian-zhishi

## Requirements (confirmed)
- 打开 `gujian-zhishi` 项目并运行它
- 需要可执行、低歧义的运行方案

## Technical Decisions
- 以 Web 开发模式作为默认运行路径：`npm run dev`
- 保留两条补充路径：生产预览 `npm run preview`、桌面端 `npm run electron`
- 运行前检查 Node/npm 版本、依赖、环境变量文件

## Research Findings
- `package.json`: 存在 `dev` / `build` / `preview` / `electron` 脚本
- `README.md`: Node >= 18，npm >= 9，默认访问 `http://localhost:5173`
- 项目根目录: 已存在 `node_modules/` 与 `.env.local`
- `vite.config.ts`: `base` 为 `./`，兼容本地预览/桌面打包路径

## Open Questions
- 用户要运行 Web 开发版，还是 Electron 桌面版

## Scope Boundaries
- INCLUDE: 启动方式、前置检查、常见失败点、验证方式
- EXCLUDE: 修改代码、重构运行脚本、部署到服务器
