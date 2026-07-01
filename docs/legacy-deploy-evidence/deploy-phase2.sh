#!/bin/bash
# ccav.com Phase 2 部署指令
# A线：建表+写API（courses/progress/quiz tables + API routes + seed data）

set -e

echo "===== ccav.com Phase 2 部署 ====="

# ============ 1. 打包 ============
echo "📦 打包前端..."
cd /Users/wanwei98241gmail.com/Desktop/AI视频制作/ccav-web

npm run build

echo "📦 打包部署包..."
rm -rf /tmp/ccav-deploy
mkdir -p /tmp/ccav-deploy

# 前端静态
cp -r out/* /tmp/ccav-deploy/

# 后端
cp server/server.mjs server/db.js server/auth.js server/models.mjs server/courses.mjs server/seed.mjs /tmp/ccav-deploy/

# 生成 package.json 用于后端
cat > /tmp/ccav-deploy/package.json << 'PKG'
{
  "name": "ccav-api",
  "version": "2.0.0",
  "type": "module",
  "private": true,
  "dependencies": {
    "express": "^4.18.0",
    "better-sqlite3": "^11.0.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3"
  }
}
PKG

cd /tmp && tar czf ccav-deploy.tar.gz ccav-deploy/
ls -lh /tmp/ccav-deploy.tar.gz

# ============ 2. 上传到服务器 ============
echo ""
echo "🚀 上传到腾讯云..."
scp /tmp/ccav-deploy.tar.gz root@43.159.170.161:/tmp/

# ============ 3. 服务器部署 ============
echo ""
echo "🔧 SSH 执行部署..."
ssh root@43.159.170.161 << 'ENDSSH'
  set -e
  
  echo "解压..."
  cd /tmp
  tar xzf ccav-deploy.tar.gz
  
  # --- 前端 ---
  echo "部署前端..."
  rm -rf /var/www/ccav/*
  cp -r /tmp/ccav-deploy/*.html /tmp/ccav-deploy/_next /tmp/ccav-deploy/*.txt /var/www/ccav/ 2>/dev/null || true
  cp -r /tmp/ccav-deploy/* /var/www/ccav/ 2>/dev/null
  chown -R www-data:www-data /var/www/ccav
  
  # --- 后端 ---
  echo "部署后端..."
  # 复制新文件
  for f in server.mjs db.js auth.js models.mjs courses.mjs seed.mjs; do
    [ -f "/tmp/ccav-deploy/$f" ] && cp "/tmp/ccav-deploy/$f" /opt/ccav-api/
  done
  
  # 确保 package.json 有依赖
  cd /opt/ccav-api
  if [ -f /tmp/ccav-deploy/package.json ]; then
    cp /tmp/ccav-deploy/package.json /opt/ccav-api/package.json
    npm install --production 2>/dev/null || true
  fi
  
  # --- 种子数据 ---
  echo "导入种子数据..."
  node /opt/ccav-api/seed.mjs
  
  # --- 重启API ---
  echo "重启API服务..."
  kill $(cat /var/run/ccav-api.pid 2>/dev/null) 2>/dev/null || true
  sleep 1
  nohup node /opt/ccav-api/server.mjs > /var/log/ccav-api.log 2>&1 &
  echo $! > /var/run/ccav-api.pid
  
  # --- Nginx ---
  echo "Nginx reload..."
  nginx -t && nginx -s reload
  
  echo ""
  echo "✅ 部署完成"
ENDSSH

# ============ 4. 验证 ============
echo ""
echo "🔍 验证..."
sleep 3

echo ""
echo "=== 健康检查 ==="
curl -s http://43.159.170.161/api/health | python3 -m json.tool

echo ""
echo "=== 课程列表 ==="
curl -s http://43.159.170.161/api/courses | python3 -c "
import json,sys
d = json.load(sys.stdin)
for c in d['courses']:
    print(f'  ✅ {c[\"title\"]} ({c[\"lesson_count\"]}课)')
"

echo ""
echo "=== 前端 ==="
curl -s -o /dev/null -w "%{http_code}" http://43.159.170.161/
echo " (首页)"
curl -s -o /dev/null -w "%{http_code}" http://43.159.170.161/courses/
echo " (课程页)"

echo ""
echo "===== Phase 2 部署完成 ✅ ====="
