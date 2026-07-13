#!/bin/bash
# 重启医药B2B平台所有开发服务

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

./scripts/stop-dev.sh
sleep 2
./scripts/start-dev.sh
