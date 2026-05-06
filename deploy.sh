#!/bin/bash
# deploy.sh

set -e

# 参数获取
DB_PASS="${1:-}"
DB_USER="${2:-"root"}"
HOST_IP="172.17.0.1"

if [ -z "$DB_PASS" ]; then
    echo "[ERROR] 必须提供数据库密码"
    exit 1
fi

# 1. 编译后端
echo "[INFO] 正在编译后端..."
cd blog-backend
docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine mvn clean package -DskipTests -U
cd ..

# 2. 随机生成一个 JWT Secret (确保只有一行且无换行符)
MY_JWT_SECRET=$(openssl rand -base64 32 | tr -d '\n\r')

# 3. 生成 Docker Compose 文件 (注意引号的使用)
echo "[INFO] 生成 docker-compose.prod.yml..."
cat > docker-compose.prod.yml << EOF
version: '3.8'
services:
  backend:
    build: ./blog-backend
    container_name: techreview-backend
    ports:
      - "8080:8080"
    environment:
      DB_HOST: "$HOST_IP"
      DB_PORT: "3306"
      DB_USERNAME: "$DB_USER"
      DB_PASSWORD: "$DB_PASS"
      REDIS_HOST: "$HOST_IP"
      REDIS_PORT: "6379"
      JWT_SECRET: "$MY_JWT_SECRET"
    restart: unless-stopped

  frontend:
    build: ./blog-frontend
    container_name: techreview-frontend
    ports:
      - "3002:80"
    restart: unless-stopped

  admin:
    build: ./blog-admin
    container_name: techreview-admin
    ports:
      - "3001:80"
    restart: unless-stopped
EOF

# 4. 自动检测命令并启动
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "[INFO] 正在清理旧容器..."
# 停止并移除旧的容器、网络
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml down --remove-orphans || true

# 强制删除可能残留的同名容器（防止意外冲突）
docker rm -f techreview-backend techreview-frontend techreview-admin || true

echo "[INFO] 正在启动新容器..."
$DOCKER_COMPOSE_CMD -f docker-compose.prod.yml up --build -d

echo "[INFO] 部署成功！"
