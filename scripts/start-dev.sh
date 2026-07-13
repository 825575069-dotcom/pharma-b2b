#!/bin/bash
# 医药B2B平台开发环境一键启动脚本（screen持久会话版）
# 统一端口规划，避免端口冲突导致手机框预览空白
# 使用 screen 创建独立会话，即使关闭终端/浏览器也不会退出

set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 端口规划（必须唯一，避免冲突）
PORT_MALL=5173      # PC采购商城
PORT_MOBILE=5174    # 客户商城小程序/APP (H5)
PORT_SALES=5175     # 业务员工作台小程序 (H5)
PORT_ADMIN=5176     # 管理后台
PORT_PREVIEW=5172   # 手机框预览页面 (python http.server)

# screen 会话名
SCREEN_MALL=pharma-mall
SCREEN_MOBILE=pharma-mobile
SCREEN_SALES=pharma-sales
SCREEN_ADMIN=pharma-admin
SCREEN_PREVIEW=pharma-preview

log() {
  echo "[$(date '+%H:%M:%S')] $1"
}

# 清理已有的同名 screen 会话
cleanup_screen() {
  local name=$1
  if screen -ls | grep -q "\.${name}\s"; then
    screen -S "$name" -X quit 2>/dev/null || true
    sleep 0.5
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
    sleep 0.5
  fi
}

log "清理已有的 screen 会话和冲突端口..."
for name in $SCREEN_MALL $SCREEN_MOBILE $SCREEN_SALES $SCREEN_ADMIN $SCREEN_PREVIEW; do
  cleanup_screen "$name"
done
for port in $PORT_MALL $PORT_MOBILE $PORT_SALES $PORT_ADMIN $PORT_PREVIEW; do
  kill_port "$port"
done

# 启动各服务到独立 screen 会话
log "启动 PC 采购商城 (port: $PORT_MALL)"
screen -S "$SCREEN_MALL" -d -m zsh -c "cd '$ROOT_DIR/frontend/mall' && npm run dev"

log "启动 客户商城 H5 (port: $PORT_MOBILE)"
screen -S "$SCREEN_MOBILE" -d -m zsh -c "cd '$ROOT_DIR/frontend/mobile' && npm run dev:h5"

log "启动 业务员工作台 H5 (port: $PORT_SALES)"
screen -S "$SCREEN_SALES" -d -m zsh -c "cd '$ROOT_DIR/frontend/sales' && npm run dev:h5"

log "启动 管理后台 (port: $PORT_ADMIN)"
screen -S "$SCREEN_ADMIN" -d -m zsh -c "cd '$ROOT_DIR/frontend/admin' && npm run dev"

log "启动 手机框预览页面 (port: $PORT_PREVIEW)"
screen -S "$SCREEN_PREVIEW" -d -m zsh -c "cd '$ROOT_DIR' && python3 -m http.server $PORT_PREVIEW"

log "等待服务就绪..."
sleep 8

# 验证端口映射
verify_port() {
  local port=$1
  local expected=$2
  local actual
  actual=$(curl -s "http://localhost:$port/" | grep -oE '<title>[^<]+</title>' | sed 's/<title>//;s/<\/title>//' || echo "NO_RESPONSE")
  if echo "$actual" | grep -q "$expected"; then
    log "✅ 端口 $port 正常 → $actual"
  else
    log "❌ 端口 $port 异常: 期望包含 '$expected', 实际: '$actual'"
    return 1
  fi
}

verify_port "$PORT_MALL" "采购商城"
verify_port "$PORT_MOBILE" "商城"
verify_port "$PORT_SALES" "工作台"
verify_port "$PORT_ADMIN" "管理后台"

log ""
log "开发环境已启动（screen 持久会话，关闭终端也不会退出）:"
log "  PC 采购商城:     http://localhost:$PORT_MALL"
log "  客户商城 H5:     http://localhost:$PORT_MOBILE"
log "  业务员工作台 H5: http://localhost:$PORT_SALES"
log "  管理后台:        http://localhost:$PORT_ADMIN"
log "  手机框预览:      http://localhost:$PORT_PREVIEW/mobile-preview.html"
log ""
log "管理命令:"
log "  screen -ls                       # 查看所有会话"
log "  screen -r $SCREEN_MOBILE         # 进入 mobile 会话查看日志"
log "  ./scripts/stop-dev.sh            # 停止所有服务"
log "  ./scripts/restart-dev.sh         # 重启所有服务"
