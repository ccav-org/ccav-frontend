#!/bin/bash
# ccav.com 本地开发启动脚本
# 同时启动 Next.js 开发服务器 + API 后端

echo "🚀 ccav.com 开发环境启动..."

# 读取 .env.local 中的 API Key
if [ -f server/.env ]; then
  export $(grep -v '^#' server/.env | xargs)
fi

# 如果没有设置 KIMI_API_KEY，提示用户
if [ -z "$KIMI_API_KEY" ]; then
  echo "⚠️  未设置 KIMI_API_KEY，请在 server/.env 中配置"
  echo "   或：export KIMI_API_KEY=sk-xxxx"
fi

# 代理设置（本机开发需要走 mihomo 连月之暗面）
if [ -z "$http_proxy" ] && [ -z "$NO_PROXY" ]; then
  echo "🔄 设置代理 http://127.0.0.1:7897"
  export http_proxy=http://127.0.0.1:7897
  export https_proxy=http://127.0.0.1:7897
fi

# 启动 API 后端（后台运行）
echo "📡 启动 API 服务 (端口 3001)..."
node server/server.mjs &
API_PID=$!
echo "   PID: $API_PID"

# 启动 Next.js 开发服务器
echo "🌐 启动 Next.js 开发服务..."
npx next dev -p 3000

# 退出时清理
kill $API_PID 2>/dev/null
echo "👋 服务已停止"
