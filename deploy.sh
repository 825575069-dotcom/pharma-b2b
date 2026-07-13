#!/bin/bash
set -e

# 手动部署脚本（本地 → 服务器）
# 用法：./deploy.sh

SERVER_HOST="47.112.156.183"
SERVER_USER="root"
PROJECT_DIR="/home/web/pharma-b2b"

# 需要本地有 SSH key 可以免密登录服务器
# 如果没有，先用 ssh-copy-id 配置

echo "=== 同步代码到服务器 ==="
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ "$SERVER_USER@$SERVER_HOST:$PROJECT_DIR/"

echo "=== 在服务器上构建和重启 ==="
ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" << EOF
  set -e
  cd "$PROJECT_DIR"

  # 构建前端
  cd frontend/mall && npm install && npm run build && cd ../..
  cd frontend/admin && npm install && npm run build && cd ../..
  cd frontend/mobile && npm install && npm run build:h5 && cd ../..
  cd frontend/sales && npm install && npm run build:h5 && cd ../..

  # 更新 Nginx 配置
  cp deploy/nginx/*.conf /etc/nginx/conf.d/
  nginx -t
  systemctl reload nginx

  # 重启后端
  cd backend
  npm install
  pm2 reload pharma-b2b-api || pm2 start server.js --name pharma-b2b-api
  pm2 save
EOF

echo "=== 部署完成 ==="
