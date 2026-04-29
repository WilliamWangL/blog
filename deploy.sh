#!/bin/bash
# deploy.sh

set -e

# 只接收数据库密码和用户名
DB_PASS=${1:-}
DB_USER=${2:-"root"}
HOST_IP="172.17.0.1"

if [ -z "$DB_PASS" ]; then
    echo "错误: 必须提供数据库密码"
    echo "用法: ./deploy.sh <数据库密码> <数据库用户名>"
    exit 1
fi

echo "[INFO] 开始部署应用..."

# 1. 编译后端
echo "[INFO] 正在编译后端..."
cd blog-backend
docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine mvn clean package -DskipTests
cd ..

# 2. 生成 Docker Compose 文件
echo "[INFO] 生成 docker-compose.prod.yml..."
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

# 3. 启动容器
echo "[INFO] 正在启动 Docker 容器..."
docker-compose -f docker-compose.prod.yml up --build -d

echo "[INFO] 部署成功！"
