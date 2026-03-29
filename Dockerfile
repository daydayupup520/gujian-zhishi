# 基础镜像
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖（使用淘宝镜像加速）
RUN npm config set registry https://registry.npmmirror.com && \
    npm install

# 复制源码
COPY . .

# 设置 API Key（使用内置 key 或构建时传入）
ARG VITE_ZHIPU_API_KEY=c5cc6b4d1afc40f1b73106ae07e95cd5.ug0fjCyrxXSdv9jm
ENV VITE_ZHIPU_API_KEY=$VITE_ZHIPU_API_KEY

# 构建项目
RUN npm run build

# 生产环境使用 Nginx
FROM nginx:alpine

# 复制构建产物到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]