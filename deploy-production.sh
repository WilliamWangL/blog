#!/bin/bash

# TechReview Blog 生产环境部署脚本
# 适用：宿主机已安装 Docker, MySQL, Nginx, Redis

set -e

# --- 配置参数 ---
DOMAIN=${1:-}
EMAIL=${2:-}
DB_PASS=${3:-}
DB_USER=${4:-"root"}
REDIS_PASS=${5:-""} # 如果你的 Redis 没密码，留空

# Docker 访问宿主机的默认 IP
HOST_IP="172.17.0.1"

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$DB_PASS" ]; then
    echo "用法: ./deploy.sh <域名> <邮箱> <数据库密码> [数据库用户] [Redis密码]"
    exit 1
fi

log() { echo -e "\033[32m[INFO]\033[0m $1"; }

# 1. 编译后端
build_backend() {
    log "正在通过 Docker 编译 Java 后端..."
    cd blog-backend
    docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine \
        mvn clean package -DskipTests
    cd ..
}

# 2. 生成 Docker Compose (仅包含应用)
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
      REDIS_PASSWORD: $REDIS_PASS
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

# 3. 配置宿主机 Nginx
setup_nginx() {
    log "配置宿主机 Nginx..."
    CONF_FILE="/etc/nginx/sites-available/techreview"
    
    sudo cat > $CONF_FILE << EOF
server {
    listen 80;
    server_name $DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
server {
    listen 80;
    server_name blog-admin.$DOMAIN;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    sudo ln -sf $CONF_FILE /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl restart nginx
}

# 4. 执行部署
main() {
    build_backend
    setup_docker_compose
    
    log "启动应用容器..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    setup_nginx
    
    log "申请 SSL 证书..."
    sudo certbot --nginx -d $DOMAIN -d blog-admin.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    log "部署成功！"
}

main
