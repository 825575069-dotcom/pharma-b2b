# Pharma-B2B 生产部署文档

## 服务器信息

- **IP**: `47.112.156.183`
- **SSH 账号**: `root`
- **项目路径**: `/home/web/pharma-b2b`
- **数据库**: MySQL 8.0
  - 数据库名: `pharma_b2b`
  - 应用账号: `pharma` / `Pharma@B2b2026`
  - Root 密码: `Root@B2b2#2026`

## 域名配置

| 域名 | 用途 | 对应目录 / 反向代理 |
|------|------|---------------------|
| `newb2.gdjztw.com` | 前端 PC 商城 | `/home/web/pharma-b2b/frontend/mall/dist` |
| `newb2.gdjztw.com/admin` | 管理后台 | `/home/web/pharma-b2b/frontend/admin/dist` |
| `newb2b.gdjztw.com` | 后端 API | `127.0.0.1:3000` |
| `newb2m.gdjztw.com` | 移动端 H5 | `/home/web/pharma-b2b/frontend/mobile/dist/build/h5` |

> 当前 `newb2b.gdjztw.com` 运行的是 Node.js 占位后端，后续可替换为 Java/Spring Cloud 服务。

## 服务进程

- **Nginx**: `systemctl status nginx`
- **后端 API**: `pm2 status` (进程名 `pharma-b2b-api`)

## 部署方式

### 方式一：GitHub Actions 自动部署（推荐）

1. 在 GitHub 创建仓库（例如 `yourname/pharma-b2b`）
2. 将本地代码推送：
   ```bash
   git remote add origin https://github.com/yourname/pharma-b2b.git
   git branch -M main
   git push -u origin main
   ```
3. 在仓库 Settings -> Secrets and variables -> Actions 中添加：
   - `SERVER_HOST`: `47.112.156.183`
   - `SERVER_USER`: `root`
   - `SERVER_SSH_KEY`: 服务器 root 私钥（用于 GitHub Actions 连接服务器）
4. 以后每次 push 到 `main` 分支，GitHub Actions 会自动：
   - 构建所有前端
   - 同步代码到 `/home/web/pharma-b2b/`
   - 更新 Nginx 配置并 reload
   - 重启后端服务

### 方式二：本地手动部署

```bash
./deploy.sh
```

## 常用维护命令

```bash
# 查看后端日志
pm2 logs pharma-b2b-api

# 重启后端
pm2 reload pharma-b2b-api

# 重载 Nginx
nginx -t && systemctl reload nginx

# 进入项目目录
cd /home/web/pharma-b2b

# 查看 Git 提交记录
git log --oneline -10
```

## SSL/HTTPS

当前配置为 HTTP。如需 HTTPS，请准备证书后修改 `deploy/nginx/*.conf`：

```nginx
listen 443 ssl http2;
ssl_certificate /path/to/cert.pem;
ssl_certificate_key /path/to/key.pem;
```

并添加 80 端口到 443 的跳转。
