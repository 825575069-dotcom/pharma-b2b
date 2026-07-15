# 医药 B2B 私域一体化平台

医药行业 B2B 采购平台：PC 商城 + 管理后台 + 移动端 H5（UniApp）+ 销售端 H5。

## 技术栈

| 层 | 技术 |
|----|------|
| 管理后台 / PC 商城 | Vue3 + Vite + Element Plus + Pinia |
| 移动端 H5 | UniApp（Vue3）+ Vite，编译为 H5（微信小程序 / Android / iOS 可扩展） |
| 销售端 H5 | UniApp（Vue3）+ Vite |
| 后端（当前） | Node.js 占位服务（后续可替换为 Java/Spring Cloud） |
| 部署 | Nginx + GitHub Actions CI/CD（见 `DEPLOY.md`） |

## 项目结构

```
pharma-b2b/
├── frontend/
│   ├── mall/       # PC 客户采购商城（Vue3）
│   ├── admin/      # PC 管理后台（Vue3 + Element Plus）
│   ├── mobile/     # 移动端 H5（UniApp），线上 newb2m.gdjztw.com
│   └── sales/      # 销售端 H5（UniApp）
├── deploy/nginx/   # 三个域名的 Nginx 配置
├── docs/           # 架构 / API / 数据库设计
├── .github/workflows/deploy.yml  # CI 自动部署
├── DEPLOY.md       # 服务器信息、部署方式、踩坑记录（敏感信息已外置）
└── README.md
```

## 本地启动

```bash
# 管理后台
cd frontend/admin && npm install && npm run dev

# PC 商城
cd frontend/mall && npm install && npm run dev

# 移动端 H5（开发）
cd frontend/mobile && npm install && npm run dev:h5

# 销售端 H5（开发）
cd frontend/sales && npm install && npm run dev:h5
```

## 构建与线上预览

| 端 | 构建命令 | 线上地址 |
|----|---------|---------|
| 移动端 H5 | `cd frontend/mobile && npm run build:h5` | https://newb2m.gdjztw.com （手机壳预览：/phone.html） |
| 管理后台 | `cd frontend/admin && npm run build` | https://newb2.gdjztw.com/admin/ |
| PC 商城 | `cd frontend/mall && npm run build` | https://newb2.gdjztw.com |
| 销售端 H5 | `cd frontend/sales && npm run build:h5` | 见 `DEPLOY.md` |

> 移动端产物在 `frontend/mobile/dist/build/h5`。修改后**禁止手动 scp 覆盖**，统一走 CI（push `main` 自动部署）。

## 协作开发

- 分支策略、部署规范、踩坑记录见 **`DEPLOY.md`**
- 架构设计：`docs/architecture.md`；API 规范：`docs/api-spec.md`；库表设计：`docs/database-design.md`

## 安全

所有密码 / 密钥 / SSH 私钥**不入库**，通过 CI Secrets 或企业版密钥管理注入。详见 `DEPLOY.md` 顶部说明。

## CI 自动部署验证

本仓库已接入 GitHub Actions 自动部署：向 `main` 分支 push（或经 PR 合入）会触发 `.github/workflows/deploy.yml`，自动完成前端构建、代码同步与后端服务重启。分支策略与部署规范见 `DEPLOY.md`。
