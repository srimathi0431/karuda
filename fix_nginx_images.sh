#!/bin/bash

# Backup the current config
cp /etc/nginx/sites-available/srikaruda.shop /etc/nginx/sites-available/srikaruda.shop.backup.$(date +%Y%m%d_%H%M%S)

# Add the images location block after the API location block
sed -i '/location \/api\/ {/,/}/a\
\
    # Images proxy - serve from backend\
    location /images/ {\
        proxy_pass http://localhost:8030/images/;\
        proxy_http_version 1.1;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }' /etc/nginx/sites-available/srikaruda.shop

# Test the configuration
echo "Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration is valid. Restarting nginx..."
    systemctl restart nginx
    sleep 2
    
    echo ""
    echo "Testing image access..."
    echo "1. Backend direct:"
    curl -I http://localhost:8030/images/products/Kinnam.png | grep "HTTP"
    
    echo ""
    echo "2. Through nginx:"
    curl -I https://srikaruda.shop/images/products/Kinnam.png | grep "HTTP"
    
    echo ""
    echo "Checking error logs for any issues:"
    tail -5 /var/log/nginx/error.log
else
    echo "Configuration test failed. Restoring backup..."
    cp /etc/nginx/sites-available/srikaruda.shop.backup.$(date +%Y%m%d_%H%M%S) /etc/nginx/sites-available/srikaruda.shop
fi
