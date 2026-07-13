# 医药B2B私域一体化平台

## 技术栈
- **后端**: Java 17 + Spring Cloud Alibaba (Nacos/Sentinel/Seata) + MySQL + Redis + MinIO + Elasticsearch
- **前端**: Vue3 + Vite + Element Plus + Pinia
- **移动端**: UniApp (微信小程序 + Android + iOS)

## 项目结构
```
pharma-b2b/
├── frontend/
│   ├── mall/          # PC客户采购商城
│   └── admin/         # PC管理后台
├── docs/              # 架构文档、API规范、数据库设计
└── README.md
```

## 核心模块
1. 用户&权限&药品流向授权中心
2. 商品&商城装修&短视频内容中心
3. 营销活动&积分商城中心
4. 订单&售后统一中心
5. 财务结算中心
6. 业务员运营&分层数据看板中心
7. 仓储库存中心
8. 系统全局配置&消息推送中心

## 启动
```bash
cd frontend/mall && npm install && npm run dev
cd frontend/admin && npm install && npm run dev
```
