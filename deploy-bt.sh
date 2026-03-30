#!/bin/bash
# 宝塔面板一键部署脚本

echo "🚀 开始部署古建智识..."

# 进入网站目录（请根据实际情况修改）
WEB_DIR="/www/wwwroot/gujian"
cd $WEB_DIR

# 如果目录不存在，创建它
if [ ! -d "$WEB_DIR" ]; then
    mkdir -p $WEB_DIR
fi

echo "📦 步骤 1/4: 下载最新代码..."
if [ -d ".git" ]; then
    git pull
else
    git clone https://github.com/daydayupup520/gujian-zhishi.git .
fi

echo "📦 步骤 2/4: 安装依赖..."
npm install --registry=https://registry.npmmirror.com

echo "🔨 步骤 3/4: 构建项目..."
npm run build

echo "📂 步骤 4/4: 复制文件到网站根目录..."
# 备份原文件（如果有）
if [ -f "index.html" ]; then
    mv index.html index.html.bak
fi

# 复制 dist 内容到根目录
cp -r dist/* .

echo "✅ 部署完成！"
echo "🌐 请刷新网页查看效果"
