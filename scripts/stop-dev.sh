#!/bin/bash
# 停止医药B2B平台所有开发服务

set -e

log() {
  echo "[$(date '+%H:%M:%S')] $1"
}

# 停止 screen 会话
stop_screen() {
  local name=$1
  if screen -ls | grep -q "\.${name}\s"; then
    screen -S "$name" -X quit 2>/dev/null || true
    log "已停止 screen 会话: $name"
  fi
}

# 按端口停止进程
kill_port() {
  local port=$1
  local pids
  pids=$(lsof -i :"$port" 2>/dev/null | grep LISTEN | awk '{print $2}' | sort -u || true)
  if [ -n "$pids" ]; then
    log "释放端口 $port (PID: $pids)"
    echo "$pids" | xargs kill -9 2>/dev/null || true
  fi
}

log "停止所有开发服务..."
for name in pharma-mall pharma-mobile pharma-sales pharma-admin pharma-preview; do
  stop_screen "$name"
done
for port in 5172 5173 5174 5175 5176; do
  kill_port "$port"
done

log "所有服务已停止"
