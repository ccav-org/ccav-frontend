#!/bin/bash
# ccav.com 部署脚本
# 使用: ./deploy.sh

set -e

SERVER="root@43.159.170.161"
REMOTE_DIR="/var/www/ccav"
LOCAL_DIST="./dist"

echo "🚀 开始部署 ccav.com..."

# 1. 构建
echo "🔧 构建项目..."
npm run build

# 2. 备份远程目录
echo "📥 备份远程目录..."
ssh $SERVER "mkdir -p $REMOTE_DIR && cp -r $REMOTE_DIR ${REMOTE_DIR}.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"

# 3. 上传文件
echo "🚀 上传到服务器..."
rsync -avz --delete $LOCAL_DIST/ $SERVER:$REMOTE_DIR/

# 4. 重载Nginx
echo "🔄 重载Nginx..."
ssh $SERVER "nginx -t && systemctl reload nginx"

echo "✅ 部署完成！访问: https://ccav.com"
