#!/bin/bash
# 古建智识 - 一键部署脚本（阿里云/腾讯云/华为云通用）
# 支持系统：CentOS 7/8, Ubuntu 18/20/22

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    log_error "请使用 root 权限运行此脚本"
    exit 1
fi

# 检测操作系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    log_error "无法检测操作系统"
    exit 1
fi

log_info "检测到操作系统: $OS $VER"

# 安装基础依赖
install_base() {
    log_info "正在安装基础依赖..."
    
    if [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum update -y
        yum install -y yum-utils
        yum install -y wget curl git
    elif [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt-get update
        apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        apt-get install -y wget curl git
    else
        log_error "不支持的操作系统"
        exit 1
    fi
    
    log_success "基础依赖安装完成"
}

# 安装 Docker
install_docker() {
    log_info "正在安装 Docker..."
    
    if command -v docker &> /dev/null; then
        log_warn "Docker 已安装，跳过安装步骤"
        docker --version
        return
    fi
    
    # 使用阿里云镜像加速安装
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
    
    # 启动 Docker
    systemctl start docker
    systemctl enable docker
    
    # 配置 Docker 国内镜像加速
    mkdir -p /etc/docker
    cat > /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
    
    systemctl restart docker
    
    log_success "Docker 安装完成"
    docker --version
}

# 安装 Docker Compose
install_docker_compose() {
    log_info "正在安装 Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log_warn "Docker Compose 已安装，跳过安装步骤"
        docker-compose --version
        return
    fi
    
    # 使用国内镜像下载
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://get.daocloud.io/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # 创建软链接
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log_success "Docker Compose 安装完成"
    docker-compose --version
}

# 部署项目
deploy_project() {
    log_info "开始部署古建智识项目..."
    
    PROJECT_DIR="/opt/gujian-zhishi"
    
    # 创建项目目录
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    # 下载项目代码
    if [ -d "$PROJECT_DIR/.git" ]; then
        log_info "更新项目代码..."
        git pull origin master
    else
        log_info "克隆项目代码..."
        git clone https://github.com/daydayupup520/gujian-zhishi.git .
    fi
    
    # 提示输入 API Key
    echo ""
    log_warn "请输入智谱清言 API Key（直接回车使用默认测试 Key）"
    log_info "获取地址: https://open.bigmodel.cn/"
    read -p "API Key: " API_KEY
    
    if [ -z "$API_KEY" ]; then
        API_KEY="c5cc6b4d1afc40f1b73106ae07e95cd5.ug0fjCyrxXSdv9jm"
        log_warn "使用默认 API Key"
    fi
    
    # 创建环境文件
    echo "VITE_ZHIPU_API_KEY=$API_KEY" > .env
    
    # 构建并启动
    log_info "正在构建 Docker 镜像（这可能需要 5-10 分钟）..."
    docker-compose down 2>/dev/null || true
    docker-compose build --no-cache
    
    log_info "正在启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    if docker-compose ps | grep -q "Up"; then
        log_success "服务启动成功！"
    else
        log_error "服务启动失败，请检查日志: docker-compose logs"
        exit 1
    fi
    
    log_success "项目部署完成！"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 开放 80 端口
    if command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=http
        firewall-cmd --reload
        log_success "firewalld 配置完成"
    elif command -v ufw &> /dev/null; then
        ufw allow 80/tcp
        ufw --force enable
        log_success "ufw 配置完成"
    else
        log_warn "未检测到防火墙，跳过配置"
    fi
}

# 显示访问信息
show_info() {
    SERVER_IP=$(curl -s ip.sb 2>/dev/null || curl -s ifconfig.me 2>/dev/null || echo "你的服务器IP")
    
    echo ""
    echo "========================================"
    echo -e "${GREEN}🎉 古建智识部署成功！${NC}"
    echo "========================================"
    echo ""
    echo "📍 访问地址:"
    echo -e "   ${YELLOW}http://$SERVER_IP${NC}"
    echo ""
    echo "📁 项目目录: /opt/gujian-zhishi"
    echo ""
    echo "🔧 常用命令:"
    echo "   查看状态: docker-compose ps"
    echo "   查看日志: docker-compose logs -f"
    echo "   重启服务: docker-compose restart"
    echo "   停止服务: docker-compose down"
    echo "   更新项目: cd /opt/gujian-zhishi && git pull && docker-compose up -d --build"
    echo ""
    echo "📖 更多信息请查看: https://github.com/daydayupup520/gujian-zhishi"
    echo "========================================"
}

# 主函数
main() {
    echo "========================================"
    echo "  古建智识 - 一键部署脚本"
    echo "========================================"
    echo ""
    
    install_base
    install_docker
    install_docker_compose
    deploy_project
    configure_firewall
    show_info
}

# 运行主函数
main