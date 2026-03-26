#!/bin/bash

# Server Setup Script for Ubuntu/Debian
# Run this on a fresh server to prepare for deployment

set -e

log() {
    echo "[SETUP] $1"
}

# Update system
update_system() {
    log "Updating system packages..."
    apt-get update
    apt-get upgrade -y
}

# Install essential packages
install_essentials() {
    log "Installing essential packages..."
    apt-get install -y \
        curl \
        wget \
        git \
        vim \
        htop \
        ufw \
        fail2ban \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release
}

# Configure firewall
setup_firewall() {
    log "Configuring firewall..."
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw --force enable
}

# Setup fail2ban
setup_fail2ban() {
    log "Configuring fail2ban..."
    systemctl enable fail2ban
    systemctl start fail2ban
}

# Create deployment user
create_user() {
    if ! id "deployer" &>/dev/null; then
        log "Creating deployer user..."
        useradd -m -s /bin/bash deployer
        usermod -aG sudo deployer
        usermod -aG docker deployer
        log "Please set password for deployer user:"
        passwd deployer
    fi
}

# Optimize system for Docker
optimize_system() {
    log "Optimizing system for Docker..."
    
    # Increase file watchers for Node.js
    echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf
    sysctl -p
    
    # Setup log rotation for Docker
    cat > /etc/logrotate.d/docker-container << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
EOF
}

# Main setup
main() {
    log "Starting server setup..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        echo "Please run as root (use sudo)"
        exit 1
    fi
    
    update_system
    install_essentials
    setup_firewall
    setup_fail2ban
    optimize_system
    
    log "Server setup completed!"
    log ""
    log "Next steps:"
    log "1. Logout and login as 'deployer' user"
    log "2. Clone your repository"
    log "3. Run ./deploy-production.sh <domain> <email>"
    log ""
}

main