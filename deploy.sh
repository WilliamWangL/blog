#!/bin/bash

# TechReview Blog Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: local (default), production

set -e

ENV=${1:-local}
PROJECT_NAME="techreview"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if Docker is installed
check_docker() {
    log "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running. Please start Docker."
    fi
    
    log "Docker is ready!"
}

# Check port availability
check_ports() {
    log "Checking port availability..."
    
    local ports=("3306" "6379" "8080" "3000" "3001")
    local port_in_use=false
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q ":$port "; then
            warn "Port $port is already in use"
            port_in_use=true
        else
            log "Port $port is available"
        fi
    done
    
    if [ "$port_in_use" = true ]; then
        warn "Some ports are already in use. This may cause conflicts."
        warn "You can modify port mappings in docker-compose.yml"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Build backend
build_backend() {
    log "Building Java backend..."
    cd blog-backend
    
    if ! command -v mvn &> /dev/null; then
        warn "Maven not found. Using Docker to build..."
        docker run --rm -v "$(pwd)":/app -w /app maven:3.9-eclipse-temurin-21-alpine \
            mvn clean package -DskipTests
    else
        mvn clean package -DskipTests
    fi
    
    cd ..
    log "Backend build completed!"
}

# Build frontend
build_frontend() {
    log "Building frontend..."
    
    # Build blog-frontend
    cd blog-frontend
    if [ -f "package.json" ]; then
        if ! command -v npm &> /dev/null; then
            warn "npm not found. Skipping frontend build."
        else
            npm install
            npm run build
        fi
    fi
    cd ..
    
    # Build blog-admin
    cd blog-admin
    if [ -f "package.json" ]; then
        if command -v npm &> /dev/null; then
            npm install
            npm run build
        fi
    fi
    cd ..
    
    log "Frontend build completed!"
}

# Deploy with Docker Compose
deploy() {
    log "Starting deployment with Docker Compose..."
    
    # Check if Docker Compose supports healthcheck condition
    COMPOSE_VERSION=$(docker-compose version --short)
    log "Docker Compose version: $COMPOSE_VERSION"
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Remove old images to force rebuild
    log "Cleaning up old images..."
    docker rmi ${PROJECT_NAME}-backend ${PROJECT_NAME}-frontend ${PROJECT_NAME}-admin 2>/dev/null || true
    
    # Start MySQL and Redis first
    log "Starting database services..."
    docker-compose up -d mysql redis
    
    # Wait for MySQL to be healthy
    log "Waiting for MySQL to be ready..."
    for i in {1..30}; do
        if docker-compose ps mysql | grep -q "healthy"; then
            log "MySQL is ready!"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # Wait for Redis
    log "Waiting for Redis to be ready..."
    for i in {1..30}; do
        if docker-compose ps redis | grep -q "healthy"; then
            log "Redis is ready!"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # Build and start remaining services
    log "Building and starting application services..."
    docker-compose up --build -d backend frontend admin
    
    # Wait for backend to be ready
    log "Waiting for backend to start..."
    sleep 15
    
    # Check if services are running
    log "Checking service status..."
    docker-compose ps
    
    # Test backend health
    log "Testing backend connection..."
    if curl -s http://localhost:8080/api/actuator/health > /dev/null; then
        log "Backend is responding!"
    else
        warn "Backend may still be starting up..."
    fi
}

# Show deployment info
show_info() {
    echo ""
    echo "========================================"
    echo "  TechReview Blog Deployed Successfully!"
    echo "========================================"
    echo ""
    echo "Frontend:  http://localhost:3000"
    echo "Admin:     http://localhost:3001"
    echo "API:       http://localhost:8080/api"
    echo ""
    echo "Default Accounts:"
    echo "  Admin:  admin / admin123"
    echo "  Editor: editor / editor123"
    echo ""
    echo "Useful Commands:"
    echo "  View logs:    docker-compose logs -f"
    echo "  Stop:         docker-compose down"
    echo "  Restart:      docker-compose restart"
    echo ""
}

# Main deployment flow
main() {
    log "Starting TechReview Blog deployment..."
    log "Environment: $ENV"
    
    # Check prerequisites
    check_docker
    check_ports
    
    # Build applications
    build_backend
    build_frontend
    
    # Deploy
    deploy
    
    # Show info
    show_info
}

# Run main function
main