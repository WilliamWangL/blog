#!/bin/bash

# TechReview Blog Production Deployment Script
# For production servers with SSL and domain

set -e

DOMAIN=${1:-}
EMAIL=${2:-}

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./deploy-production.sh <domain> <email>"
    echo "Example: ./deploy-production.sh techreview.com admin@techreview.com"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo "Email is required for SSL certificate"
    exit 1
fi

log() {
    echo "[INFO] $1"
}

# Install Docker if not present
install_docker() {
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        usermod -aG docker $USER
        systemctl enable docker
        systemctl start docker
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
}

# Install Nginx and Certbot
install_nginx() {
    if ! command -v nginx &> /dev/null; then
        log "Installing Nginx..."
        apt-get update
        apt-get install -y nginx certbot python3-certbot-nginx
    fi
}

# Setup Nginx configuration
setup_nginx() {
    log "Setting up Nginx configuration..."
    
    cat > /etc/nginx/sites-available/techreview << 'EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name blog-admin.DOMAIN_PLACEHOLDER;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
    
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/techreview
    
    ln -sf /etc/nginx/sites-available/techreview /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    nginx -t
    systemctl restart nginx
}

# Setup SSL certificate
setup_ssl() {
    log "Setting up SSL certificate..."
    certbot --nginx -d $DOMAIN -d blog-admin.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    # Auto-renewal cron job
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
}

# Create production docker-compose
setup_docker_compose() {
    log "Creating production docker-compose.yml..."
    
    cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: techreview-mysql
    environment:
      MYSQL_ROOT_PASSWORD: $(openssl rand -base64 32)
      MYSQL_DATABASE: techreview_blog
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - techreview-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: techreview-redis
    networks:
      - techreview-network
    restart: unless-stopped

  backend:
    build:
      context: ./blog-backend
      dockerfile: Dockerfile
    container_name: techreview-backend
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: root
      DB_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: $(openssl rand -base64 64)
    networks:
      - techreview-network
    depends_on:
      - mysql
      - redis
    restart: unless-stopped

  frontend:
    build:
      context: ./blog-frontend
      dockerfile: Dockerfile
    container_name: techreview-frontend
    ports:
      - "3000:80"
    networks:
      - techreview-network
    depends_on:
      - backend
    restart: unless-stopped

  admin:
    build:
      context: ./blog-admin
      dockerfile: Dockerfile
    container_name: techreview-admin
    ports:
      - "3001:80"
    networks:
      - techreview-network
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  techreview-network:
    driver: bridge
EOF
}

# Main deployment
main() {
    log "Starting production deployment for $DOMAIN..."
    
    # Install dependencies
    install_docker
    install_nginx
    
    # Build applications
    cd blog-backend
    if command -v mvn &> /dev/null; then
        mvn clean package -DskipTests
    else
        docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine \
            mvn clean package -DskipTests
    fi
    cd ..
    
    # Setup infrastructure
    setup_docker_compose
    setup_nginx
    
    # Deploy
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Setup SSL
    setup_ssl
    
    log "Production deployment completed!"
    log ""
    log "Your website is now available at:"
    log "  https://$DOMAIN"
    log "  https://blog-admin.$DOMAIN"
    log ""
    log "Default login:"
    log "  Admin:  admin / admin123"
    log "  Editor: editor / editor123"
}

main