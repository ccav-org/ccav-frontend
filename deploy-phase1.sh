#!/bin/bash
# ccav.com Phase 1 部署指令
# 生成时间: 2026-05-25
# 部署包: /tmp/ccav-deploy.tar.gz (2.5MB)

set -e

echo "1. 从 Mac 传包到腾讯云..."
scp /tmp/ccav-deploy.tar.gz root@43.159.170.161:/tmp/

echo "2. SSH 到服务器解压..."
ssh root@43.159.170.161 << 'ENDSSH'
  cd /tmp
  tar xzf ccav-deploy.tar.gz
  
  # 部署前端
  rm -rf /var/www/ccav/*
  cp -r dist/* /var/www/ccav/
  chown -R www-data:www-data /var/www/ccav
  
  # 部署后端（含 Replicate 降级）
  cp server/server.mjs /opt/ccav-api/server.mjs
  cd /opt/ccav-api
  
  # 检查 .env 是否需要加 REPLICATE_API_KEY
  grep -q REPLICATE_API_KEY .env || echo "⚠️  请添加 REPLICATE_API_KEY 到 .env"
  
  # 重启 API 服务
  kill $(cat /var/run/ccav-api.pid 2>/dev/null) 2>/dev/null || true
  nohup node server.mjs > /var/log/ccav-api.log 2>&1 &
  echo $! > /var/run/ccav-api.pid
  
  # Nginx reload
  nginx -t && nginx -s reload
  
  echo "✅ 部署完成"
ENDSSH

echo "3. 验证..."
sleep 3
curl -s http://43.159.170.161/api/health | python3 -m json.tool
