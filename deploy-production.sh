#!/bin/bash

# TechReview Blog 部署脚本 (仅限 IP 访问，无域名，无 SSL)
# 适用：宿主机已安装 Docker, MySQL, Redis

set -e

# --- 配置参数 ---
# 现在只接收两个参数：数据库用户名 和 数据库密码
DB_USER=${1:-"root"}
DB_PASS=${2:-}

# Docker 访问宿主机的默认 IP
HOST_IP="172.17.0.1"

if [ -z "$DB_PASS" ]; then
    echo "用法: ./deploy.sh <数据库密码> [数据库用户名]"
    echo "示例: ./deploy.sh password123 root"
    exit 1
fi

log() { echo -e "\033[32m[INFO]\033[0m $1"; }

# 1. 编译后端
build_backend() {
    log "正在通过 Docker 编译 Java 后端..."
    if [ -d "blog-backend" ]; then
        cd blog-backend
        docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine \
            mvn clean package -DskipTests
        cd ..
    else
        log "错误: 未找到 blog-backend 目录"
        exit 1
    fi
}

# 2. 生成 Docker Compose
setup_docker_compose() {
    log "生成 docker-compose.prod.yml..."
    cat > docker-compose.prod.yml << EOF
version: '3.8'
services:
  backend:
    build: ./blog-backend
    container_name: techreview-backend
    environment:
      DB_HOST: $HOST_IP
      DB_PORT: 3306
      DB_USERNAME: $DB_USER
      DB_PASSWORD: $DB_PASS
      REDIS_HOST: $HOST_IP
      REDIS_PORT: 6379
      JWT_SECRET: $(openssl rand -base64 64)
    restart: unless-stopped

  frontend:
    build: ./blog-frontend
    container_name: techreview-frontend
    ports:
      - "3000:80"
    restart: unless-stopped

  admin:
    build: ./blog-admin
    container_name: techreview-admin
    ports:
      - "3001:80"
    restart: unless-stopped
EOF
}

# 3. 执行部署
main() {
    log "开始部署应用 (数据库用户: $DB_USER)..."
    
    build_backend
    setup_docker_compose
    
    log "启动 Docker 容器..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    log "------------------------------------------------"
    log "部署成功！"
    log "你可以通过以下地址访问："
    log "  - 博客前端: http://服务器IP:3000"
    log "  - 管理后台: http://服务器IP:3001"
    log "------------------------------------------------"
}

main
