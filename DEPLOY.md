# Pharma-B2B 生产部署文档

> ⚠️ **安全须知（协作前必读）**
> 本文档**不存放任何明文密码**。所有敏感凭证（数据库密码、SSH 私钥、API Key）统一通过 **CI Secrets / 企业版密钥管理** 注入，禁止写入仓库。
> 服务器账号与密码由管理员在以下位置维护：
> - GitHub Actions：仓库 `Settings → Secrets` 中的 `SERVER_HOST` / `SERVER_USER` / `SERVER_SSH_KEY`
> - 企业版：对应的密钥库（Key Vault）
> 如需本地连服务器，请向管理员私下索取，不要粘贴到任何文件或聊天记录里。

## 服务器信息

- **IP**: 见 CI Secret `SERVER_HOST`（生产：`47.112.156.183`）
- **SSH 账号**: 见 CI Secret `SERVER_USER`
- **项目路径**: `/home/web/pharma-b2b`
- **数据库**: MySQL 8.0
  - 数据库名: `pharma_b2b`
  - 应用账号 / 密码：由管理员通过密钥管理下发（**不要硬编码**）
  - Root 密码：仅管理员持有，禁止共享

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

---

## 移动端 H5 构建与预览

```bash
cd frontend/mobile
npm install
npm run build:h5
# 产物在 dist/build/h5，线上访问 https://newb2m.gdjztw.com
# 手机壳预览页：https://newb2m.gdjztw.com/phone.html
```

销售端 H5 同理：`cd frontend/sales && npm install && npm run build:h5`

## 协作规范（多人开发必读）

1. **禁止直接 push 到 `main`**。每人从 `main` 切 `feature/xxx` 分支开发，合并走 PR（Pull Request），至少 1 人 Review 后由管理员合入。
2. **禁止手动 `scp` 覆盖服务器**（会互相覆盖）。一切部署走 CI（push `main` 自动触发）。
3. 修改 `deploy/nginx/*.conf` 后必须 `nginx -t` 校验再 reload。

## 踩坑记录（新手必看，已验证）

- **前端静态资源改了不生效**：Nginx 对 `static/` 类资源曾设 `Cache-Control: immutable` 强缓存。前端改资源后**必须改文件名**（如 tabbar 图标 `home.png → home-v4.png` 并在 `pages.json` 同步引用），否则浏览器长期命中旧缓存。现 `deploy/nginx/newb2m.gdjztw.com.conf` 已改为 `expires 1h; must-revalidate`。
- **管理后台白屏**：`frontend/admin` 的 `vite.config.js` 须设 `base: '/admin/'`，Nginx 用 `location /admin/ { alias .../admin/dist/; }` 代理，否则 `/assets/` 会和商城冲突。
- **底部 tab 栏图标更新**：uni-app 原生 tabBar 读 `static/tabbar/*.png`，由 `pages.json` 的 `iconPath` 引用。换图标 = 生成新 PNG + 改 `pages.json` + 文件名带版本号防缓存。
- **页面底部留白 / 顶部被滚动推走**：列表页用 `flex` 纵向布局（`.page { height: calc(100vh - 100rpx); display:flex; flex-direction:column }`），顶部元素 `flex-shrink:0`，滚动容器 `flex:1; min-height:0`，不要写死 `calc(100vh - N)`。

