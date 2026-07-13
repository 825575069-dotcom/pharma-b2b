# 医药B2B私域一体化平台 — 数据库设计文档

> 版本：v1.0 | 更新日期：2026-07-12 | 编写：架构组

---

## 目录

- [1. 设计总则](#1-设计总则)
- [2. 服务1：用户&权限&药品流向授权](#2-服务1用户权限药品流向授权)
- [3. 服务2：商品&商城装修&短视频](#3-服务2商品商城装修短视频)
- [4. 服务3：营销活动&积分商城](#4-服务3营销活动积分商城)
- [5. 服务4：订单&售后](#5-服务4订单售后)
- [6. 服务5：财务结算](#6-服务5财务结算)
- [7. 服务6：业务员运营](#7-服务6业务员运营)
- [8. 服务7：仓储库存](#8-服务7仓储库存)
- [9. 服务8：系统配置&消息](#9-服务8系统配置消息)

---

## 1. 设计总则

### 1.1 公共字段约定

所有业务表和系统表均包含以下公共字段：

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID（多租户隔离字段） |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除：0正常 1作废 |

### 1.2 命名规范

- 表名前缀：`sys_`（系统表）/ `biz_`（业务表）
- 字段命名：下划线命名法（snake_case）
- 索引命名：`idx_` + 字段名 / `uk_` + 字段名（唯一索引）
- 外键命名：`fk_` + 子表缩写 + `_` + 父表缩写

### 1.3 多租户隔离方案

- **物理分库**：每个租户独立MySQL数据库（`pharma_tenant_{tenant_id}`）
- **租户路由**：通过 Spring Cloud Alibaba 的 `TenantDataSourceInterceptor` 在请求上下文中动态切换数据源
- **公共库**：`sys_tenant` 表存储在公共库 `pharma_common` 中，用于租户发现与路由

### 1.4 字符集与排序规则

```sql
-- 所有表统一使用
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2. 服务1：用户&权限&药品流向授权

> 库：`pharma_common`（sys_tenant） + `pharma_tenant_{tenant_id}`（其余表）

### 2.1 sys_tenant — 租户表

**表注释**：平台租户信息表，存储医药经销商/药企的租户基本信息，位于公共库。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 租户ID |
| `tenant_code` | `VARCHAR(32)` | 是 | - | 租户编码（唯一） |
| `tenant_name` | `VARCHAR(128)` | 是 | - | 租户名称 |
| `tenant_type` | `TINYINT` | 是 | 1 | 租户类型：1经销商 2药企 3连锁药店 |
| `contact_name` | `VARCHAR(64)` | 否 | NULL | 联系人 |
| `contact_phone` | `VARCHAR(20)` | 否 | NULL | 联系电话 |
| `business_license` | `VARCHAR(128)` | 否 | NULL | 营业执照号 |
| `pharma_license` | `VARCHAR(128)` | 否 | NULL | 药品经营许可证号 |
| `database_name` | `VARCHAR(64)` | 是 | - | 独立数据库名 |
| `database_host` | `VARCHAR(128)` | 否 | NULL | 数据库地址（支持分库到不同实例） |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `expire_at` | `DATETIME` | 否 | NULL | 到期时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_code` (`tenant_code`)
- INDEX `idx_status` (`status`)

---

### 2.2 sys_user — 用户表

**表注释**：系统用户表，支持六类角色（平台管理员、租户管理员、采购员、业务员、财务、仓库管理员）。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 用户ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `username` | `VARCHAR(64)` | 是 | - | 登录用户名 |
| `password` | `VARCHAR(128)` | 是 | - | 密码（BCrypt加密） |
| `real_name` | `VARCHAR(64)` | 否 | NULL | 真实姓名 |
| `phone` | `VARCHAR(20)` | 否 | NULL | 手机号 |
| `email` | `VARCHAR(128)` | 否 | NULL | 邮箱 |
| `avatar` | `VARCHAR(256)` | 否 | NULL | 头像URL |
| `user_type` | `TINYINT` | 是 | 3 | 用户类型：1平台管理员 2租户管理员 3采购员 4业务员 5财务 6仓库管理员 |
| `gender` | `TINYINT` | 否 | 0 | 性别：0未知 1男 2女 |
| `department` | `VARCHAR(64)` | 否 | NULL | 部门 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `last_login_at` | `DATETIME` | 否 | NULL | 最后登录时间 |
| `last_login_ip` | `VARCHAR(45)` | 否 | NULL | 最后登录IP |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_username` (`tenant_id`, `username`)
- INDEX `idx_phone` (`phone`)
- INDEX `idx_user_type` (`user_type`)

---

### 2.3 sys_role — 角色表

**表注释**：角色定义表，用于RBAC权限模型。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 角色ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `role_name` | `VARCHAR(64)` | 是 | - | 角色名称 |
| `role_code` | `VARCHAR(64)` | 是 | - | 角色编码 |
| `description` | `VARCHAR(256)` | 否 | NULL | 角色描述 |
| `data_scope` | `TINYINT` | 是 | 1 | 数据范围：1全部 2本人 3本部门 4自定义 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_role_code` (`tenant_id`, `role_code`)

---

### 2.4 sys_permission — 权限表

**表注释**：菜单及按钮权限表，树形结构。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 权限ID |
| `parent_id` | `BIGINT UNSIGNED` | 是 | 0 | 父权限ID（0为根节点） |
| `permission_name` | `VARCHAR(64)` | 是 | - | 权限名称 |
| `permission_code` | `VARCHAR(128)` | 是 | - | 权限编码（如 product:create） |
| `permission_type` | `TINYINT` | 是 | 1 | 类型：1菜单 2按钮 3接口 |
| `path` | `VARCHAR(256)` | 否 | NULL | 前端路由路径 |
| `icon` | `VARCHAR(64)` | 否 | NULL | 菜单图标 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_permission_code` (`permission_code`)
- INDEX `idx_parent_id` (`parent_id`)

> **说明**：权限表为平台级公共数据，不区分租户，所有租户共享同一套权限定义。

---

### 2.5 sys_role_permission — 角色权限关联表

**表注释**：角色与权限的多对多关联表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `role_id` | `BIGINT UNSIGNED` | 是 | - | 角色ID |
| `permission_id` | `BIGINT UNSIGNED` | 是 | - | 权限ID |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`)
- INDEX `idx_permission_id` (`permission_id`)

---

### 2.6 sys_user_role — 用户角色关联表

**表注释**：用户与角色的多对多关联表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 用户ID |
| `role_id` | `BIGINT UNSIGNED` | 是 | - | 角色ID |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_role` (`user_id`, `role_id`)

---

### 2.7 biz_customer — 药店客户档案表

**表注释**：医药渠道中的药店/终端客户档案，可被业务员绑定维护。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 客户ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `customer_code` | `VARCHAR(32)` | 是 | - | 客户编码 |
| `customer_name` | `VARCHAR(128)` | 是 | - | 客户名称（药店名） |
| `customer_type` | `TINYINT` | 是 | 1 | 客户类型：1单体药店 2连锁药店 3诊所 4医院 |
| `contact_person` | `VARCHAR(64)` | 否 | NULL | 联系人 |
| `contact_phone` | `VARCHAR(20)` | 否 | NULL | 联系电话 |
| `province` | `VARCHAR(32)` | 否 | NULL | 省 |
| `city` | `VARCHAR(32)` | 否 | NULL | 市 |
| `district` | `VARCHAR(32)` | 否 | NULL | 区/县 |
| `address` | `VARCHAR(256)` | 否 | NULL | 详细地址 |
| `longitude` | `DECIMAL(10,6)` | 否 | NULL | 经度 |
| `latitude` | `DECIMAL(10,6)` | 否 | NULL | 纬度 |
| `business_license` | `VARCHAR(128)` | 否 | NULL | 营业执照号 |
| `pharma_license` | `VARCHAR(128)` | 否 | NULL | 药品经营许可证号 |
| `credit_limit` | `DECIMAL(12,2)` | 否 | 0 | 信用额度 |
| `settlement_type` | `TINYINT` | 是 | 1 | 结算方式：1现结 2月结 3账期 |
| `settlement_days` | `INT` | 否 | 0 | 账期天数 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `remark` | `VARCHAR(512)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_customer_code` (`tenant_id`, `customer_code`)
- INDEX `idx_customer_name` (`customer_name`)
- INDEX `idx_contact_phone` (`contact_phone`)

---

### 2.8 biz_customer_tag — 客户标签表

**表注释**：客户标签管理，支持多标签分类。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 标签ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `tag_name` | `VARCHAR(64)` | 是 | - | 标签名称 |
| `tag_category` | `VARCHAR(32)` | 否 | NULL | 标签分类（如：区域、等级、品类） |
| `tag_color` | `VARCHAR(16)` | 否 | NULL | 标签颜色 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_tag_name` (`tag_name`)

---

### 2.9 biz_drug_authorization — 药品流向授权表

**表注释**：药品流向授权记录，管控药品从经销商到终端药店的流通授权。业务员/经销商向药店客户授权可采购的药品范围。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 授权ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `authorization_code` | `VARCHAR(32)` | 是 | - | 授权编号 |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 被授权客户ID |
| `product_id` | `BIGINT UNSIGNED` | 否 | NULL | 授权药品ID（NULL表示全品类授权） |
| `brand_id` | `BIGINT UNSIGNED` | 否 | NULL | 授权品牌ID |
| `salesman_id` | `BIGINT UNSIGNED` | 否 | NULL | 授权业务员ID |
| `authorization_type` | `TINYINT` | 是 | 1 | 授权类型：1单品 2品牌 3全品类 |
| `authorized_price` | `DECIMAL(12,2)` | 否 | NULL | 授权采购价（NULL按默认价） |
| `min_price` | `DECIMAL(12,2)` | 否 | NULL | 最低限价 |
| `start_at` | `DATETIME` | 是 | - | 授权生效时间 |
| `end_at` | `DATETIME` | 否 | NULL | 授权失效时间（NULL永久有效） |
| `status` | `TINYINT` | 是 | 1 | 状态：0已撤销 1生效中 2已过期 |
| `approved_by` | `BIGINT UNSIGNED` | 否 | NULL | 审批人ID |
| `approved_at` | `DATETIME` | 否 | NULL | 审批时间 |
| `remark` | `VARCHAR(512)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_authorization_code` (`authorization_code`)
- INDEX `idx_customer_product` (`customer_id`, `product_id`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_status` (`status`)

---

### 2.10 biz_authorization_log — 授权操作日志表

**表注释**：药品流向授权的操作审计日志。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 日志ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `authorization_id` | `BIGINT UNSIGNED` | 是 | - | 授权ID |
| `operator_id` | `BIGINT UNSIGNED` | 是 | - | 操作人ID |
| `operator_name` | `VARCHAR(64)` | 否 | NULL | 操作人姓名 |
| `action` | `VARCHAR(32)` | 是 | - | 操作类型：CREATE/UPDATE/REVOKE/APPROVE/REJECT |
| `before_snapshot` | `JSON` | 否 | NULL | 变更前快照 |
| `after_snapshot` | `JSON` | 否 | NULL | 变更后快照 |
| `remark` | `VARCHAR(512)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_authorization_id` (`authorization_id`)
- INDEX `idx_action` (`action`)

---

## 3. 服务2：商品&商城装修&短视频

> 库：`pharma_tenant_{tenant_id}`

### 3.1 biz_product_category — 商品分类表

**表注释**：药品/商品分类，支持多级树形结构。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 分类ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `parent_id` | `BIGINT UNSIGNED` | 是 | 0 | 父分类ID（0为根节点） |
| `category_name` | `VARCHAR(64)` | 是 | - | 分类名称 |
| `category_code` | `VARCHAR(32)` | 否 | NULL | 分类编码 |
| `level` | `TINYINT` | 是 | 1 | 层级：1一级 2二级 3三级 |
| `icon` | `VARCHAR(256)` | 否 | NULL | 分类图标URL |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_parent_id` (`parent_id`)
- INDEX `idx_level` (`level`)

---

### 3.2 biz_brand — 品牌表

**表注释**：药品品牌/药企信息。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 品牌ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `brand_name` | `VARCHAR(128)` | 是 | - | 品牌名称 |
| `brand_code` | `VARCHAR(32)` | 否 | NULL | 品牌编码 |
| `logo` | `VARCHAR(256)` | 否 | NULL | 品牌Logo URL |
| `manufacturer` | `VARCHAR(128)` | 否 | NULL | 生产企业名称 |
| `description` | `TEXT` | 否 | NULL | 品牌介绍 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_brand_name` (`brand_name`)

---

### 3.3 biz_product — 药品SKU表

**表注释**：药品商品SKU主表，存储药品核心信息。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 商品ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `product_code` | `VARCHAR(32)` | 是 | - | 商品编码 |
| `product_name` | `VARCHAR(256)` | 是 | - | 商品名称 |
| `common_name` | `VARCHAR(128)` | 否 | NULL | 通用名（药品通用名） |
| `specification` | `VARCHAR(128)` | 否 | NULL | 规格（如：10mg×24片/盒） |
| `dosage_form` | `VARCHAR(32)` | 否 | NULL | 剂型（片剂/胶囊/注射液等） |
| `category_id` | `BIGINT UNSIGNED` | 否 | NULL | 分类ID |
| `brand_id` | `BIGINT UNSIGNED` | 否 | NULL | 品牌ID |
| `manufacturer` | `VARCHAR(128)` | 否 | NULL | 生产企业 |
| `approval_number` | `VARCHAR(64)` | 否 | NULL | 批准文号（国药准字） |
| `barcode` | `VARCHAR(64)` | 否 | NULL | 条形码 |
| `unit` | `VARCHAR(16)` | 是 | - | 单位（盒/瓶/袋） |
| `min_order_qty` | `INT` | 是 | 1 | 最小起订量 |
| `purchase_price` | `DECIMAL(12,2)` | 是 | 0 | 采购价 |
| `sale_price` | `DECIMAL(12,2)` | 是 | 0 | 销售价 |
| `market_price` | `DECIMAL(12,2)` | 否 | NULL | 市场零售价 |
| `member_price` | `DECIMAL(12,2)` | 否 | NULL | 会员价 |
| `stock_qty` | `INT` | 是 | 0 | 库存数量 |
| `is_otc` | `TINYINT` | 是 | 0 | 是否OTC：0处方药 1OTC甲类 2OTC乙类 |
| `is_cold_chain` | `TINYINT` | 是 | 0 | 是否冷链：0否 1是 |
| `storage_condition` | `VARCHAR(64)` | 否 | NULL | 储存条件 |
| `shelf_life` | `VARCHAR(32)` | 否 | NULL | 保质期 |
| `indication` | `TEXT` | 否 | NULL | 适应症/功能主治 |
| `contraindication` | `TEXT` | 否 | NULL | 禁忌 |
| `description` | `TEXT` | 否 | NULL | 商品详情（富文本） |
| `main_image` | `VARCHAR(256)` | 否 | NULL | 主图URL |
| `shelf_status` | `TINYINT` | 是 | 0 | 上下架状态：0下架 1上架 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `sales_count` | `INT` | 是 | 0 | 销量 |
| `view_count` | `INT` | 是 | 0 | 浏览量 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_product_code` (`tenant_id`, `product_code`)
- INDEX `idx_category_id` (`category_id`)
- INDEX `idx_brand_id` (`brand_id`)
- INDEX `idx_shelf_status` (`shelf_status`)
- INDEX `idx_approval_number` (`approval_number`)
- FULLTEXT INDEX `ft_product_name` (`product_name`, `common_name`)

---

### 3.4 biz_product_image — 药品图片表

**表注释**：商品多图管理（详情图、轮播图等）。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 图片ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `image_url` | `VARCHAR(256)` | 是 | - | 图片URL |
| `image_type` | `TINYINT` | 是 | 1 | 图片类型：1轮播图 2详情图 3规格图 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_product_id` (`product_id`)

---

### 3.5 biz_mall_decorate — 商城装修配置表

**表注释**：PC/移动端商城页面装修配置，支持首页、活动页等自定义布局。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 装修配置ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `page_code` | `VARCHAR(32)` | 是 | - | 页面编码（home/category/custom） |
| `page_name` | `VARCHAR(64)` | 是 | - | 页面名称 |
| `platform` | `TINYINT` | 是 | 1 | 平台：1PC 2移动端 3小程序 |
| `components` | `JSON` | 是 | - | 组件配置（JSON数组，含组件类型、位置、数据源） |
| `is_published` | `TINYINT` | 是 | 0 | 是否发布：0草稿 1已发布 |
| `publish_at` | `DATETIME` | 否 | NULL | 发布时间 |
| `version` | `INT` | 是 | 1 | 版本号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_page_code_platform` (`page_code`, `platform`)

---

### 3.6 biz_video_category — 视频分类表

**表注释**：短视频内容分类。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 分类ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `category_name` | `VARCHAR(64)` | 是 | - | 分类名称 |
| `icon` | `VARCHAR(256)` | 否 | NULL | 分类图标 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)

---

### 3.7 biz_video — 短视频表

**表注释**：短视频内容主表，支持药品推广视频发布与审核。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 视频ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `title` | `VARCHAR(256)` | 是 | - | 视频标题 |
| `description` | `VARCHAR(512)` | 否 | NULL | 视频描述 |
| `category_id` | `BIGINT UNSIGNED` | 否 | NULL | 视频分类ID |
| `video_url` | `VARCHAR(512)` | 是 | - | 视频文件URL（MinIO） |
| `cover_url` | `VARCHAR(256)` | 否 | NULL | 封面图URL |
| `duration` | `INT` | 否 | 0 | 视频时长（秒） |
| `file_size` | `BIGINT` | 否 | 0 | 文件大小（字节） |
| `author_id` | `BIGINT UNSIGNED` | 是 | - | 发布人ID |
| `author_name` | `VARCHAR(64)` | 否 | NULL | 发布人姓名 |
| `audit_status` | `TINYINT` | 是 | 0 | 审核状态：0待审核 1通过 2驳回 |
| `audit_remark` | `VARCHAR(256)` | 否 | NULL | 审核备注 |
| `auditor_id` | `BIGINT UNSIGNED` | 否 | NULL | 审核人ID |
| `audited_at` | `DATETIME` | 否 | NULL | 审核时间 |
| `publish_status` | `TINYINT` | 是 | 0 | 发布状态：0未发布 1已发布 2已下架 |
| `is_top` | `TINYINT` | 是 | 0 | 是否置顶 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_category_id` (`category_id`)
- INDEX `idx_audit_status` (`audit_status`)
- INDEX `idx_publish_status` (`publish_status`)
- INDEX `idx_author_id` (`author_id`)

---

### 3.8 biz_video_product — 视频绑定药品关联表

**表注释**：短视频与药品的关联表，一个视频可关联多个药品。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `video_id` | `BIGINT UNSIGNED` | 是 | - | 视频ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 药品ID |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_video_product` (`video_id`, `product_id`)
- INDEX `idx_product_id` (`product_id`)

---

### 3.9 biz_video_comment — 视频评论表

**表注释**：短视频评论，支持回复。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 评论ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `video_id` | `BIGINT UNSIGNED` | 是 | - | 视频ID |
| `parent_id` | `BIGINT UNSIGNED` | 是 | 0 | 父评论ID（0为一级评论） |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 评论人ID |
| `user_name` | `VARCHAR(64)` | 否 | NULL | 评论人姓名 |
| `user_avatar` | `VARCHAR(256)` | 否 | NULL | 评论人头像 |
| `content` | `VARCHAR(1024)` | 是 | - | 评论内容 |
| `like_count` | `INT` | 是 | 0 | 点赞数 |
| `status` | `TINYINT` | 是 | 1 | 状态：0隐藏 1正常 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_video_id` (`video_id`)
- INDEX `idx_parent_id` (`parent_id`)

---

### 3.10 biz_video_stats — 视频统计表

**表注释**：短视频播放/点赞/分享等统计数据。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 统计ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `video_id` | `BIGINT UNSIGNED` | 是 | - | 视频ID |
| `stat_date` | `DATE` | 是 | - | 统计日期 |
| `play_count` | `INT` | 是 | 0 | 播放次数 |
| `like_count` | `INT` | 是 | 0 | 点赞数 |
| `share_count` | `INT` | 是 | 0 | 分享数 |
| `comment_count` | `INT` | 是 | 0 | 评论数 |
| `favorite_count` | `INT` | 是 | 0 | 收藏数 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_video_date` (`video_id`, `stat_date`)
- INDEX `idx_stat_date` (`stat_date`)

---

### 3.11 biz_stock_subscription — 缺货订阅表

**表注释**：商品缺货时用户订阅到货通知。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 订阅ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 订阅用户ID |
| `notify_channel` | `TINYINT` | 是 | 1 | 通知渠道：1站内信 2短信 3微信 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待通知 1已通知 2已取消 |
| `notified_at` | `DATETIME` | 否 | NULL | 通知时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_product_status` (`product_id`, `status`)
- INDEX `idx_user_id` (`user_id`)

---

## 4. 服务3：营销活动&积分商城

> 库：`pharma_tenant_{tenant_id}`

### 4.1 biz_activity — 促销活动表

**表注释**：促销活动主表，支持满减、折扣、赠品等类型。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 活动ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `activity_code` | `VARCHAR(32)` | 是 | - | 活动编码 |
| `activity_name` | `VARCHAR(128)` | 是 | - | 活动名称 |
| `activity_type` | `TINYINT` | 是 | 1 | 活动类型：1满减 2折扣 3满赠 4秒杀 5团购 |
| `description` | `VARCHAR(512)` | 否 | NULL | 活动描述 |
| `target_type` | `TINYINT` | 是 | 1 | 适用对象：1全部客户 2指定客户 3指定标签 |
| `start_at` | `DATETIME` | 是 | - | 开始时间 |
| `end_at` | `DATETIME` | 是 | - | 结束时间 |
| `status` | `TINYINT` | 是 | 0 | 状态：0草稿 1待审批 2已审批 3进行中 4已结束 5已撤销 |
| `approved_by` | `BIGINT UNSIGNED` | 否 | NULL | 审批人ID |
| `approved_at` | `DATETIME` | 否 | NULL | 审批时间 |
| `audit_remark` | `VARCHAR(256)` | 否 | NULL | 审批备注 |
| `priority` | `INT` | 是 | 0 | 优先级（数字越大优先级越高） |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_activity_code` (`activity_code`)
- INDEX `idx_status` (`status`)
- INDEX `idx_activity_type` (`activity_type`)
- INDEX `idx_start_end` (`start_at`, `end_at`)

---

### 4.2 biz_activity_product — 活动商品关联表

**表注释**：促销活动与商品的关联表，存储活动商品的专属优惠规则。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `activity_id` | `BIGINT UNSIGNED` | 是 | - | 活动ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `activity_price` | `DECIMAL(12,2)` | 否 | NULL | 活动价（折扣/秒杀价） |
| `discount_rate` | `DECIMAL(5,2)` | 否 | NULL | 折扣率（如85表示8.5折） |
| `min_purchase_qty` | `INT` | 否 | 0 | 最低购买量 |
| `max_purchase_qty` | `INT` | 否 | 0 | 限购数量（0不限） |
| `gift_product_id` | `BIGINT UNSIGNED` | 否 | NULL | 赠品商品ID |
| `gift_qty` | `INT` | 否 | 0 | 赠品数量 |
| `reduce_amount` | `DECIMAL(12,2)` | 否 | NULL | 满减金额 |
| `threshold_amount` | `DECIMAL(12,2)` | 否 | NULL | 满减门槛 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_activity_product` (`activity_id`, `product_id`)
- INDEX `idx_product_id` (`product_id`)

---

### 4.3 biz_activity_approval — 业务员定向优惠审批表

**表注释**：业务员为客户申请定向优惠的审批流程。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 审批ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `approval_code` | `VARCHAR(32)` | 是 | - | 审批单号 |
| `activity_id` | `BIGINT UNSIGNED` | 否 | NULL | 关联活动ID |
| `salesman_id` | `BIGINT UNSIGNED` | 是 | - | 申请业务员ID |
| `salesman_name` | `VARCHAR(64)` | 否 | NULL | 业务员姓名 |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 目标客户ID |
| `customer_name` | `VARCHAR(128)` | 否 | NULL | 客户名称 |
| `product_id` | `BIGINT UNSIGNED` | 否 | NULL | 目标商品ID（NULL为全场） |
| `original_price` | `DECIMAL(12,2)` | 否 | NULL | 原价 |
| `requested_price` | `DECIMAL(12,2)` | 是 | - | 申请优惠价 |
| `requested_discount` | `DECIMAL(5,2)` | 否 | NULL | 申请折扣率 |
| `reason` | `VARCHAR(512)` | 否 | NULL | 申请理由 |
| `valid_start_at` | `DATETIME` | 是 | - | 优惠生效时间 |
| `valid_end_at` | `DATETIME` | 是 | - | 优惠失效时间 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待审批 1通过 2驳回 3已撤销 |
| `approver_id` | `BIGINT UNSIGNED` | 否 | NULL | 审批人ID |
| `approver_name` | `VARCHAR(64)` | 否 | NULL | 审批人姓名 |
| `audit_remark` | `VARCHAR(256)` | 否 | NULL | 审批意见 |
| `audited_at` | `DATETIME` | 否 | NULL | 审批时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_approval_code` (`approval_code`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_status` (`status`)

---

### 4.4 biz_points_rule — 积分规则配置表

**表注释**：积分获取规则配置（下单得积分、签到得积分等）。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 规则ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `rule_name` | `VARCHAR(64)` | 是 | - | 规则名称 |
| `rule_code` | `VARCHAR(32)` | 是 | - | 规则编码 |
| `rule_type` | `TINYINT` | 是 | 1 | 规则类型：1下单 2签到 3评价 4首次购买 5活动奖励 |
| `points_type` | `TINYINT` | 是 | 1 | 积分类型：1固定积分 2按金额比例 |
| `points_value` | `INT` | 是 | 0 | 积分值（固定值或每元得积分） |
| `points_ratio` | `DECIMAL(8,2)` | 否 | NULL | 比例（如消费1元得0.5积分） |
| `min_points` | `INT` | 否 | 0 | 单次最少积分 |
| `max_points` | `INT` | 否 | 0 | 单次最多积分（0不限） |
| `daily_limit` | `INT` | 否 | 0 | 每日上限（0不限） |
| `start_at` | `DATETIME` | 否 | NULL | 生效时间 |
| `end_at` | `DATETIME` | 否 | NULL | 失效时间 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_rule_code` (`rule_code`)
- INDEX `idx_rule_type` (`rule_type`)

---

### 4.5 biz_points_account — 积分账户表

**表注释**：用户积分账户，记录可用积分总额。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 账户ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 用户ID |
| `total_points` | `INT` | 是 | 0 | 累计获得积分 |
| `available_points` | `INT` | 是 | 0 | 可用积分 |
| `used_points` | `INT` | 是 | 0 | 已使用积分 |
| `expired_points` | `INT` | 是 | 0 | 过期积分 |
| `frozen_points` | `INT` | 是 | 0 | 冻结积分 |
| `version` | `INT` | 是 | 0 | 乐观锁版本号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_user_id` (`user_id`)

---

### 4.6 biz_points_flow — 积分流水表

**表注释**：积分变动明细流水。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 流水ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `account_id` | `BIGINT UNSIGNED` | 是 | - | 积分账户ID |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 用户ID |
| `flow_type` | `TINYINT` | 是 | 1 | 流水类型：1收入 2支出 3冻结 4解冻 5过期 |
| `source_type` | `TINYINT` | 是 | 1 | 来源类型：1下单 2签到 3评价 4兑换 5活动 6退款扣回 7管理员调整 |
| `source_id` | `BIGINT UNSIGNED` | 否 | NULL | 来源业务ID（订单号/兑换记录ID等） |
| `change_points` | `INT` | 是 | 0 | 变动积分（正数增加 负数减少） |
| `before_points` | `INT` | 是 | 0 | 变动前积分 |
| `after_points` | `INT` | 是 | 0 | 变动后积分 |
| `expire_at` | `DATETIME` | 否 | NULL | 积分过期时间 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_account_id` (`account_id`)
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_source_type` (`source_type`)
- INDEX `idx_created_at` (`created_at`)

---

### 4.7 biz_points_product — 积分商品表

**表注释**：积分商城兑换商品。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 积分商品ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `product_id` | `BIGINT UNSIGNED` | 否 | NULL | 关联商品ID（NULL为纯积分商品） |
| `product_name` | `VARCHAR(256)` | 是 | - | 商品名称 |
| `product_image` | `VARCHAR(256)` | 否 | NULL | 商品图片 |
| `points_required` | `INT` | 是 | 0 | 所需积分 |
| `cash_price` | `DECIMAL(12,2)` | 否 | NULL | 需额外支付的现金（积分+现金模式） |
| `stock_qty` | `INT` | 是 | 0 | 兑换库存 |
| `exchange_limit` | `INT` | 否 | 0 | 每人限兑数量（0不限） |
| `exchange_count` | `INT` | 是 | 0 | 已兑换数量 |
| `start_at` | `DATETIME` | 否 | NULL | 兑换开始时间 |
| `end_at` | `DATETIME` | 否 | NULL | 兑换结束时间 |
| `shelf_status` | `TINYINT` | 是 | 0 | 上下架：0下架 1上架 |
| `sort` | `INT` | 是 | 0 | 排序号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_shelf_status` (`shelf_status`)
- INDEX `idx_product_id` (`product_id`)

---

### 4.8 biz_points_exchange — 积分兑换记录表

**表注释**：积分兑换订单记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 兑换记录ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `exchange_code` | `VARCHAR(32)` | 是 | - | 兑换单号 |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 用户ID |
| `points_product_id` | `BIGINT UNSIGNED` | 是 | - | 积分商品ID |
| `product_name` | `VARCHAR(256)` | 否 | NULL | 商品名称（冗余） |
| `exchange_qty` | `INT` | 是 | 1 | 兑换数量 |
| `points_used` | `INT` | 是 | 0 | 使用积分 |
| `cash_paid` | `DECIMAL(12,2)` | 否 | 0 | 支付现金 |
| `receiver_name` | `VARCHAR(64)` | 否 | NULL | 收货人 |
| `receiver_phone` | `VARCHAR(20)` | 否 | NULL | 收货电话 |
| `receiver_address` | `VARCHAR(256)` | 否 | NULL | 收货地址 |
| `logistics_no` | `VARCHAR(64)` | 否 | NULL | 物流单号 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待发货 1已发货 2已收货 3已取消 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_exchange_code` (`exchange_code`)
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_points_product_id` (`points_product_id`)
- INDEX `idx_status` (`status`)

---

## 5. 服务4：订单&售后

> 库：`pharma_tenant_{tenant_id}`

### 5.1 biz_order — 订单主表

**表注释**：采购订单主表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 订单ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `order_no` | `VARCHAR(32)` | 是 | - | 订单编号 |
| `order_type` | `TINYINT` | 是 | 1 | 订单类型：1普通采购 2活动订单 3积分兑换 4退货补货 |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `customer_name` | `VARCHAR(128)` | 否 | NULL | 客户名称（冗余） |
| `salesman_id` | `BIGINT UNSIGNED` | 否 | NULL | 业务员ID |
| `salesman_name` | `VARCHAR(64)` | 否 | NULL | 业务员姓名（冗余） |
| `receiver_name` | `VARCHAR(64)` | 是 | - | 收货人 |
| `receiver_phone` | `VARCHAR(20)` | 是 | - | 收货电话 |
| `receiver_province` | `VARCHAR(32)` | 否 | NULL | 收货省 |
| `receiver_city` | `VARCHAR(32)` | 否 | NULL | 收货市 |
| `receiver_district` | `VARCHAR(32)` | 否 | NULL | 收货区 |
| `receiver_address` | `VARCHAR(256)` | 是 | - | 收货详细地址 |
| `item_count` | `INT` | 是 | 0 | 商品种类数 |
| `total_qty` | `INT` | 是 | 0 | 商品总数量 |
| `product_amount` | `DECIMAL(12,2)` | 是 | 0 | 商品总金额 |
| `discount_amount` | `DECIMAL(12,2)` | 是 | 0 | 优惠金额 |
| `freight_amount` | `DECIMAL(12,2)` | 是 | 0 | 运费 |
| `pay_amount` | `DECIMAL(12,2)` | 是 | 0 | 应付金额 |
| `paid_amount` | `DECIMAL(12,2)` | 是 | 0 | 已付金额 |
| `payment_type` | `TINYINT` | 否 | NULL | 支付方式：1在线支付 2货到付款 3账期支付 4积分抵扣 |
| `payment_status` | `TINYINT` | 是 | 0 | 支付状态：0未支付 1部分支付 2已支付 3已退款 |
| `order_status` | `TINYINT` | 是 | 0 | 订单状态：0待付款 1待发货 2部分发货 3已发货 4已签收 5已完成 6已取消 |
| `activity_id` | `BIGINT UNSIGNED` | 否 | NULL | 关联活动ID |
| `remark` | `VARCHAR(512)` | 否 | NULL | 订单备注 |
| `cancel_reason` | `VARCHAR(256)` | 否 | NULL | 取消原因 |
| `cancel_at` | `DATETIME` | 否 | NULL | 取消时间 |
| `confirm_at` | `DATETIME` | 否 | NULL | 确认收货时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_order_no` (`order_no`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_order_status` (`order_status`)
- INDEX `idx_payment_status` (`payment_status`)
- INDEX `idx_created_at` (`created_at`)

---

### 5.2 biz_order_item — 订单明细表

**表注释**：订单商品明细。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 明细ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `order_id` | `BIGINT UNSIGNED` | 是 | - | 订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 订单编号（冗余） |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `product_name` | `VARCHAR(256)` | 否 | NULL | 商品名称（冗余） |
| `product_code` | `VARCHAR(32)` | 否 | NULL | 商品编码（冗余） |
| `specification` | `VARCHAR(128)` | 否 | NULL | 规格（冗余） |
| `manufacturer` | `VARCHAR(128)` | 否 | NULL | 生产企业（冗余） |
| `unit` | `VARCHAR(16)` | 否 | NULL | 单位 |
| `qty` | `INT` | 是 | 1 | 购买数量 |
| `original_price` | `DECIMAL(12,2)` | 是 | 0 | 原价 |
| `sale_price` | `DECIMAL(12,2)` | 是 | 0 | 成交价 |
| `discount_amount` | `DECIMAL(12,2)` | 是 | 0 | 优惠金额 |
| `subtotal` | `DECIMAL(12,2)` | 是 | 0 | 小计金额 |
| `activity_id` | `BIGINT UNSIGNED` | 否 | NULL | 活动ID |
| `authorization_id` | `BIGINT UNSIGNED` | 否 | NULL | 授权ID |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_order_id` (`order_id`)
- INDEX `idx_product_id` (`product_id`)

---

### 5.3 biz_order_log — 订单操作日志表

**表注释**：订单状态变更日志。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 日志ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `order_id` | `BIGINT UNSIGNED` | 是 | - | 订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 订单编号 |
| `operator_id` | `BIGINT UNSIGNED` | 是 | - | 操作人ID |
| `operator_name` | `VARCHAR(64)` | 否 | NULL | 操作人姓名 |
| `action` | `VARCHAR(32)` | 是 | - | 操作类型：CREATE/PAY/SHIP/CONFIRM/CANCEL/REFUND |
| `from_status` | `TINYINT` | 否 | NULL | 变更前状态 |
| `to_status` | `TINYINT` | 否 | NULL | 变更后状态 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_order_id` (`order_id`)

---

### 5.4 biz_after_sale — 售后单表

**表注释**：售后申请主表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 售后单ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `after_sale_no` | `VARCHAR(32)` | 是 | - | 售后单号 |
| `order_id` | `BIGINT UNSIGNED` | 是 | - | 原订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 原订单编号 |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `type` | `TINYINT` | 是 | 1 | 售后类型：1仅退款 2退货退款 3换货 |
| `reason` | `VARCHAR(256)` | 是 | - | 售后原因 |
| `description` | `VARCHAR(512)` | 否 | NULL | 问题描述 |
| `evidence_images` | `JSON` | 否 | NULL | 凭证图片URL数组 |
| `refund_amount` | `DECIMAL(12,2)` | 否 | 0 | 退款金额 |
| `refund_type` | `TINYINT` | 否 | NULL | 退款方式：1原路退回 2余额 3线下 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待审核 1审核通过 2审核驳回 3退货中 4已收货 5已退款 6已取消 |
| `auditor_id` | `BIGINT UNSIGNED` | 否 | NULL | 审核人ID |
| `audit_remark` | `VARCHAR(256)` | 否 | NULL | 审核备注 |
| `audited_at` | `DATETIME` | 否 | NULL | 审核时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_after_sale_no` (`after_sale_no`)
- INDEX `idx_order_id` (`order_id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_status` (`status`)

---

### 5.5 biz_after_sale_item — 售后明细表

**表注释**：售后申请的商品明细。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 明细ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `after_sale_id` | `BIGINT UNSIGNED` | 是 | - | 售后单ID |
| `order_item_id` | `BIGINT UNSIGNED` | 是 | - | 订单明细ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `product_name` | `VARCHAR(256)` | 否 | NULL | 商品名称 |
| `qty` | `INT` | 是 | 1 | 售后数量 |
| `sale_price` | `DECIMAL(12,2)` | 是 | 0 | 单价 |
| `refund_amount` | `DECIMAL(12,2)` | 是 | 0 | 退款金额 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_after_sale_id` (`after_sale_id`)

---

### 5.6 biz_logistics — 物流信息表

**表注释**：订单物流发货信息。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 物流ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `order_id` | `BIGINT UNSIGNED` | 是 | - | 订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 订单编号 |
| `logistics_company` | `VARCHAR(64)` | 是 | - | 物流公司 |
| `logistics_no` | `VARCHAR(64)` | 是 | - | 物流单号 |
| `warehouse_id` | `BIGINT UNSIGNED` | 否 | NULL | 发货仓库ID |
| `shipper_name` | `VARCHAR(64)` | 否 | NULL | 发货人 |
| `shipper_phone` | `VARCHAR(20)` | 否 | NULL | 发货电话 |
| `shipping_at` | `DATETIME` | 否 | NULL | 发货时间 |
| `delivery_at` | `DATETIME` | 否 | NULL | 签收时间 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待发货 1已发货 2已签收 |
| `tracking_info` | `JSON` | 否 | NULL | 物流轨迹信息 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_order_id` (`order_id`)
- INDEX `idx_logistics_no` (`logistics_no`)

---

## 6. 服务5：财务结算

> 库：`pharma_tenant_{tenant_id}`

### 6.1 biz_finance_flow — 资金流水表

**表注释**：平台所有资金收支流水记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 流水ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `flow_no` | `VARCHAR(32)` | 是 | - | 流水编号 |
| `flow_type` | `TINYINT` | 是 | 1 | 流水类型：1收入 2支出 |
| `biz_type` | `TINYINT` | 是 | 1 | 业务类型：1订单收款 2退款 3提现 4充值 5积分兑换 6账期还款 |
| `biz_id` | `BIGINT UNSIGNED` | 否 | NULL | 业务单据ID |
| `biz_no` | `VARCHAR(32)` | 否 | NULL | 业务单据号 |
| `customer_id` | `BIGINT UNSIGNED` | 否 | NULL | 客户ID |
| `salesman_id` | `BIGINT UNSIGNED` | 否 | NULL | 业务员ID |
| `amount` | `DECIMAL(12,2)` | 是 | 0 | 金额 |
| `balance_after` | `DECIMAL(12,2)` | 否 | NULL | 变动后余额 |
| `payment_channel` | `TINYINT` | 否 | NULL | 支付渠道：1微信 2支付宝 3银行转账 4余额 5积分 |
| `payment_voucher` | `VARCHAR(256)` | 否 | NULL | 支付凭证 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_flow_no` (`flow_no`)
- INDEX `idx_biz_type_biz_id` (`biz_type`, `biz_id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_created_at` (`created_at`)

---

### 6.2 biz_reconciliation — 对公对账记录表

**表注释**：银行/支付渠道对公对账记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 对账ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `reconciliation_no` | `VARCHAR(32)` | 是 | - | 对账编号 |
| `reconciliation_date` | `DATE` | 是 | - | 对账日期 |
| `channel` | `TINYINT` | 是 | 1 | 对账渠道：1微信 2支付宝 3银行 |
| `total_count` | `INT` | 是 | 0 | 总笔数 |
| `total_amount` | `DECIMAL(12,2)` | 是 | 0 | 总金额 |
| `matched_count` | `INT` | 是 | 0 | 已匹配笔数 |
| `matched_amount` | `DECIMAL(12,2)` | 是 | 0 | 已匹配金额 |
| `unmatched_count` | `INT` | 是 | 0 | 未匹配笔数 |
| `unmatched_amount` | `DECIMAL(12,2)` | 是 | 0 | 未匹配金额 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待对账 1对账中 2已完成 3有差异 |
| `file_url` | `VARCHAR(256)` | 否 | NULL | 对账文件URL |
| `operator_id` | `BIGINT UNSIGNED` | 否 | NULL | 操作人ID |
| `operator_name` | `VARCHAR(64)` | 否 | NULL | 操作人姓名 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_reconciliation_no` (`reconciliation_no`)
- INDEX `idx_date_channel` (`reconciliation_date`, `channel`)

---

### 6.3 biz_reconciliation_diff — 对账差异表

**表注释**：对账差异明细记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 差异ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `reconciliation_id` | `BIGINT UNSIGNED` | 是 | - | 对账记录ID |
| `flow_no` | `VARCHAR(32)` | 否 | NULL | 平台流水号 |
| `channel_no` | `VARCHAR(64)` | 否 | NULL | 渠道流水号 |
| `diff_type` | `TINYINT` | 是 | 1 | 差异类型：1平台有渠道无 2渠道有平台无 3金额不一致 |
| `platform_amount` | `DECIMAL(12,2)` | 否 | NULL | 平台金额 |
| `channel_amount` | `DECIMAL(12,2)` | 否 | NULL | 渠道金额 |
| `handle_status` | `TINYINT` | 是 | 0 | 处理状态：0待处理 1已处理 2已忽略 |
| `handle_remark` | `VARCHAR(256)` | 否 | NULL | 处理备注 |
| `handled_by` | `BIGINT UNSIGNED` | 否 | NULL | 处理人ID |
| `handled_at` | `DATETIME` | 否 | NULL | 处理时间 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_reconciliation_id` (`reconciliation_id`)
- INDEX `idx_handle_status` (`handle_status`)

---

### 6.4 biz_withdrawal — 业务员提现申请表

**表注释**：业务员佣金提现申请。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 提现ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `withdrawal_no` | `VARCHAR(32)` | 是 | - | 提现单号 |
| `salesman_id` | `BIGINT UNSIGNED` | 是 | - | 业务员ID |
| `salesman_name` | `VARCHAR(64)` | 否 | NULL | 业务员姓名 |
| `amount` | `DECIMAL(12,2)` | 是 | 0 | 提现金额 |
| `fee` | `DECIMAL(12,2)` | 是 | 0 | 手续费 |
| `actual_amount` | `DECIMAL(12,2)` | 是 | 0 | 实到金额 |
| `bank_account` | `VARCHAR(64)` | 否 | NULL | 银行账号 |
| `bank_name` | `VARCHAR(64)` | 否 | NULL | 开户行 |
| `account_holder` | `VARCHAR(64)` | 否 | NULL | 账户持有人 |
| `status` | `TINYINT` | 是 | 0 | 状态：0待审核 1审核通过 2已打款 3审核驳回 4已取消 |
| `auditor_id` | `BIGINT UNSIGNED` | 否 | NULL | 审核人ID |
| `audit_remark` | `VARCHAR(256)` | 否 | NULL | 审核备注 |
| `audited_at` | `DATETIME` | 否 | NULL | 审核时间 |
| `paid_at` | `DATETIME` | 否 | NULL | 打款时间 |
| `payment_voucher` | `VARCHAR(256)` | 否 | NULL | 打款凭证 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_withdrawal_no` (`withdrawal_no`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_status` (`status`)

---

### 6.5 biz_credit_account — 账期账户表

**表注释**：客户账期信用账户，管理授信额度与账期结算。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 账户ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `customer_name` | `VARCHAR(128)` | 否 | NULL | 客户名称 |
| `credit_limit` | `DECIMAL(12,2)` | 是 | 0 | 授信额度 |
| `used_amount` | `DECIMAL(12,2)` | 是 | 0 | 已用额度 |
| `available_amount` | `DECIMAL(12,2)` | 是 | 0 | 可用额度 |
| `settlement_days` | `INT` | 是 | 30 | 账期天数 |
| `settlement_day` | `INT` | 是 | 1 | 结算日（每月第几天） |
| `status` | `TINYINT` | 是 | 1 | 状态：0冻结 1正常 |
| `version` | `INT` | 是 | 0 | 乐观锁版本号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_customer_id` (`customer_id`)

---

### 6.6 biz_credit_record — 账期记录表

**表注释**：账期使用/还款明细记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 记录ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `account_id` | `BIGINT UNSIGNED` | 是 | - | 账期账户ID |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `record_type` | `TINYINT` | 是 | 1 | 记录类型：1使用 2还款 3调整 |
| `order_id` | `BIGINT UNSIGNED` | 否 | NULL | 关联订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 关联订单号 |
| `amount` | `DECIMAL(12,2)` | 是 | 0 | 金额（正数使用 负数还款） |
| `before_amount` | `DECIMAL(12,2)` | 是 | 0 | 变动前已用额度 |
| `after_amount` | `DECIMAL(12,2)` | 是 | 0 | 变动后已用额度 |
| `due_date` | `DATE` | 否 | NULL | 到期还款日 |
| `repaid_at` | `DATETIME` | 否 | NULL | 实际还款时间 |
| `status` | `TINYINT` | 是 | 0 | 状态：0未还款 1已还款 2已逾期 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_account_id` (`account_id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_status` (`status`)
- INDEX `idx_due_date` (`due_date`)

---

## 7. 服务6：业务员运营

> 库：`pharma_tenant_{tenant_id}`

### 7.1 biz_salesman — 业务员档案表

**表注释**：业务员信息档案，关联用户表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 业务员ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `user_id` | `BIGINT UNSIGNED` | 是 | - | 关联用户ID |
| `salesman_code` | `VARCHAR(32)` | 是 | - | 业务员工号 |
| `salesman_name` | `VARCHAR(64)` | 是 | - | 业务员姓名 |
| `phone` | `VARCHAR(20)` | 否 | NULL | 手机号 |
| `department` | `VARCHAR(64)` | 否 | NULL | 部门 |
| `level` | `TINYINT` | 是 | 1 | 等级：1初级 2中级 3高级 4资深 |
| `region` | `VARCHAR(64)` | 否 | NULL | 负责区域 |
| `parent_id` | `BIGINT UNSIGNED` | 否 | NULL | 上级业务员ID（团队层级） |
| `entry_date` | `DATE` | 否 | NULL | 入职日期 |
| `resign_date` | `DATE` | 否 | NULL | 离职日期 |
| `status` | `TINYINT` | 是 | 1 | 状态：0离职 1在职 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_salesman_code` (`tenant_id`, `salesman_code`)
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_parent_id` (`parent_id`)

---

### 7.2 biz_salesman_customer — 业务员客户关联表

**表注释**：业务员与客户的绑定关系表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 主键ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `salesman_id` | `BIGINT UNSIGNED` | 是 | - | 业务员ID |
| `customer_id` | `BIGINT UNSIGNED` | 是 | - | 客户ID |
| `relation_type` | `TINYINT` | 是 | 1 | 关系类型：1主负责 2协办 |
| `bind_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 绑定时间 |
| `unbind_at` | `DATETIME` | 否 | NULL | 解绑时间 |
| `status` | `TINYINT` | 是 | 1 | 状态：0已解绑 1有效 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_customer_id` (`customer_id`)
- INDEX `idx_status` (`status`)

---

### 7.3 biz_commission_rule — 提成规则表

**表注释**：业务员提成规则配置，支持按商品/品牌/客户级别设置不同提成比例。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 规则ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `rule_name` | `VARCHAR(64)` | 是 | - | 规则名称 |
| `rule_type` | `TINYINT` | 是 | 1 | 规则类型：1按销售额 2按利润 3按固定金额 |
| `scope_type` | `TINYINT` | 是 | 1 | 范围类型：1全部 2指定商品 3指定品牌 4指定客户 5指定分类 |
| `scope_id` | `BIGINT UNSIGNED` | 否 | NULL | 范围目标ID |
| `salesman_level` | `TINYINT` | 否 | NULL | 适用业务员等级（NULL全部） |
| `commission_rate` | `DECIMAL(5,2)` | 否 | NULL | 提成比例（百分比，如5.00表示5%） |
| `commission_amount` | `DECIMAL(12,2)` | 否 | NULL | 固定提成金额 |
| `min_sales_amount` | `DECIMAL(12,2)` | 否 | 0 | 最低销售额门槛 |
| `max_commission` | `DECIMAL(12,2)` | 否 | 0 | 提成上限（0不限） |
| `start_at` | `DATETIME` | 否 | NULL | 生效时间 |
| `end_at` | `DATETIME` | 否 | NULL | 失效时间 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_scope_type_scope_id` (`scope_type`, `scope_id`)
- INDEX `idx_status` (`status`)

---

### 7.4 biz_commission_record — 提成记录表

**表注释**：业务员提成计算记录，关联订单。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 记录ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `salesman_id` | `BIGINT UNSIGNED` | 是 | - | 业务员ID |
| `salesman_name` | `VARCHAR(64)` | 否 | NULL | 业务员姓名 |
| `order_id` | `BIGINT UNSIGNED` | 是 | - | 订单ID |
| `order_no` | `VARCHAR(32)` | 否 | NULL | 订单编号 |
| `customer_id` | `BIGINT UNSIGNED` | 否 | NULL | 客户ID |
| `customer_name` | `VARCHAR(128)` | 否 | NULL | 客户名称 |
| `product_id` | `BIGINT UNSIGNED` | 否 | NULL | 商品ID |
| `product_name` | `VARCHAR(256)` | 否 | NULL | 商品名称 |
| `sales_amount` | `DECIMAL(12,2)` | 是 | 0 | 销售额 |
| `commission_rate` | `DECIMAL(5,2)` | 是 | 0 | 提成比例 |
| `commission_amount` | `DECIMAL(12,2)` | 是 | 0 | 提成金额 |
| `rule_id` | `BIGINT UNSIGNED` | 否 | NULL | 提成规则ID |
| `settlement_status` | `TINYINT` | 是 | 0 | 结算状态：0未结算 1已结算 2已撤销 |
| `settlement_at` | `DATETIME` | 否 | NULL | 结算时间 |
| `settlement_period` | `VARCHAR(16)` | 否 | NULL | 结算周期（如2026-07） |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_salesman_id` (`salesman_id`)
- INDEX `idx_order_id` (`order_id`)
- INDEX `idx_settlement_status` (`settlement_status`)
- INDEX `idx_settlement_period` (`settlement_period`)

---

### 7.5 biz_salesman_performance — 业务员业绩表

**表注释**：业务员业绩统计表，按日/月/年汇总。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 业绩ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `salesman_id` | `BIGINT UNSIGNED` | 是 | - | 业务员ID |
| `salesman_name` | `VARCHAR(64)` | 否 | NULL | 业务员姓名 |
| `stat_type` | `TINYINT` | 是 | 1 | 统计类型：1日 2月 3年 |
| `stat_date` | `DATE` | 是 | - | 统计日期 |
| `order_count` | `INT` | 是 | 0 | 订单数 |
| `customer_count` | `INT` | 是 | 0 | 下单客户数 |
| `sales_amount` | `DECIMAL(12,2)` | 是 | 0 | 销售额 |
| `refund_amount` | `DECIMAL(12,2)` | 是 | 0 | 退款金额 |
| `net_amount` | `DECIMAL(12,2)` | 是 | 0 | 净销售额 |
| `commission_amount` | `DECIMAL(12,2)` | 是 | 0 | 提成金额 |
| `new_customer_count` | `INT` | 是 | 0 | 新增客户数 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_salesman_stat` (`salesman_id`, `stat_type`, `stat_date`)
- INDEX `idx_stat_date` (`stat_date`)

---

## 8. 服务7：仓储库存

> 库：`pharma_tenant_{tenant_id}`

### 8.1 biz_warehouse — 仓库表

**表注释**：仓库信息表。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 仓库ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `warehouse_code` | `VARCHAR(32)` | 是 | - | 仓库编码 |
| `warehouse_name` | `VARCHAR(64)` | 是 | - | 仓库名称 |
| `warehouse_type` | `TINYINT` | 是 | 1 | 仓库类型：1中心仓 2前置仓 3门店仓 4冷链仓 |
| `province` | `VARCHAR(32)` | 否 | NULL | 省 |
| `city` | `VARCHAR(32)` | 否 | NULL | 市 |
| `district` | `VARCHAR(32)` | 否 | NULL | 区/县 |
| `address` | `VARCHAR(256)` | 否 | NULL | 详细地址 |
| `manager_id` | `BIGINT UNSIGNED` | 否 | NULL | 仓库管理员ID |
| `manager_name` | `VARCHAR(64)` | 否 | NULL | 管理员姓名 |
| `contact_phone` | `VARCHAR(20)` | 否 | NULL | 联系电话 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_warehouse_code` (`tenant_id`, `warehouse_code`)

---

### 8.2 biz_stock — 库存表

**表注释**：商品库存表，按仓库+商品维度记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 库存ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `warehouse_id` | `BIGINT UNSIGNED` | 是 | - | 仓库ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `available_qty` | `INT` | 是 | 0 | 可用库存 |
| `locked_qty` | `INT` | 是 | 0 | 锁定库存（已下单未发货） |
| `total_qty` | `INT` | 是 | 0 | 总库存（可用+锁定） |
| `safety_stock` | `INT` | 否 | 0 | 安全库存 |
| `batch_no` | `VARCHAR(32)` | 否 | NULL | 批次号 |
| `production_date` | `DATE` | 否 | NULL | 生产日期 |
| `expiry_date` | `DATE` | 否 | NULL | 过期日期 |
| `cost_price` | `DECIMAL(12,2)` | 否 | NULL | 成本价 |
| `version` | `INT` | 是 | 0 | 乐观锁版本号 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_warehouse_product_batch` (`warehouse_id`, `product_id`, `batch_no`)
- INDEX `idx_product_id` (`product_id`)

---

### 8.3 biz_stock_log — 库存操作日志表

**表注释**：库存出入库操作流水。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 日志ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `stock_id` | `BIGINT UNSIGNED` | 否 | NULL | 库存记录ID |
| `warehouse_id` | `BIGINT UNSIGNED` | 是 | - | 仓库ID |
| `product_id` | `BIGINT UNSIGNED` | 是 | - | 商品ID |
| `batch_no` | `VARCHAR(32)` | 否 | NULL | 批次号 |
| `operation_type` | `TINYINT` | 是 | 1 | 操作类型：1入库 2出库 3调拨入 4调拨出 5盘盈 6盘亏 7锁定 8解锁 |
| `biz_type` | `TINYINT` | 否 | NULL | 业务类型：1采购入库 2订单出库 3退货入库 4调拨 5盘点 |
| `biz_id` | `BIGINT UNSIGNED` | 否 | NULL | 业务单据ID |
| `biz_no` | `VARCHAR(32)` | 否 | NULL | 业务单据号 |
| `change_qty` | `INT` | 是 | 0 | 变动数量（正数入 负数出） |
| `before_qty` | `INT` | 是 | 0 | 变动前库存 |
| `after_qty` | `INT` | 是 | 0 | 变动后库存 |
| `operator_id` | `BIGINT UNSIGNED` | 是 | - | 操作人ID |
| `operator_name` | `VARCHAR(64)` | 否 | NULL | 操作人姓名 |
| `remark` | `VARCHAR(256)` | 否 | NULL | 备注 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_stock_id` (`stock_id`)
- INDEX `idx_warehouse_product` (`warehouse_id`, `product_id`)
- INDEX `idx_operation_type` (`operation_type`)
- INDEX `idx_created_at` (`created_at`)

---

## 9. 服务8：系统配置&消息

> 库：`pharma_tenant_{tenant_id}`

### 9.1 sys_config — 系统配置表

**表注释**：系统参数配置表，支持键值对配置。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 配置ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `config_group` | `VARCHAR(32)` | 是 | - | 配置分组（如：payment/logistics/sms） |
| `config_key` | `VARCHAR(128)` | 是 | - | 配置键名 |
| `config_value` | `TEXT` | 否 | NULL | 配置值 |
| `config_type` | `TINYINT` | 是 | 1 | 值类型：1字符串 2数字 3布尔 4JSON |
| `description` | `VARCHAR(256)` | 否 | NULL | 配置说明 |
| `is_system` | `TINYINT` | 是 | 0 | 是否系统内置：0否 1是（内置不可删） |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_config_group_key` (`config_group`, `config_key`)

---

### 9.2 sys_message_template — 消息模板表

**表注释**：消息推送模板配置，支持站内信/短信/微信/邮件。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 模板ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `template_code` | `VARCHAR(32)` | 是 | - | 模板编码 |
| `template_name` | `VARCHAR(64)` | 是 | - | 模板名称 |
| `channel` | `TINYINT` | 是 | 1 | 推送渠道：1站内信 2短信 3微信模板消息 4邮件 |
| `biz_type` | `VARCHAR(32)` | 否 | NULL | 业务类型（如：order_pay/salesman_audit） |
| `title` | `VARCHAR(128)` | 否 | NULL | 消息标题 |
| `content` | `TEXT` | 是 | - | 模板内容（支持变量占位符 ${variable}） |
| `variables` | `JSON` | 否 | NULL | 变量定义列表 |
| `external_template_id` | `VARCHAR(64)` | 否 | NULL | 第三方模板ID（短信/微信模板ID） |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_template_code` (`template_code`)
- INDEX `idx_channel` (`channel`)
- INDEX `idx_biz_type` (`biz_type`)

---

### 9.3 sys_message_record — 消息推送记录表

**表注释**：消息推送执行记录。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 记录ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `template_id` | `BIGINT UNSIGNED` | 否 | NULL | 模板ID |
| `template_code` | `VARCHAR(32)` | 否 | NULL | 模板编码 |
| `channel` | `TINYINT` | 是 | 1 | 推送渠道：1站内信 2短信 3微信 4邮件 |
| `receiver_id` | `BIGINT UNSIGNED` | 是 | - | 接收人ID |
| `receiver_name` | `VARCHAR(64)` | 否 | NULL | 接收人姓名 |
| `receiver_contact` | `VARCHAR(128)` | 否 | NULL | 接收联系方式（手机号/openid/邮箱） |
| `title` | `VARCHAR(128)` | 否 | NULL | 消息标题 |
| `content` | `TEXT` | 否 | NULL | 消息内容 |
| `biz_type` | `VARCHAR(32)` | 否 | NULL | 业务类型 |
| `biz_id` | `BIGINT UNSIGNED` | 否 | NULL | 业务ID |
| `send_status` | `TINYINT` | 是 | 0 | 发送状态：0待发送 1已发送 2发送失败 3已读 |
| `error_msg` | `VARCHAR(512)` | 否 | NULL | 失败原因 |
| `sent_at` | `DATETIME` | 否 | NULL | 发送时间 |
| `read_at` | `DATETIME` | 否 | NULL | 阅读时间 |
| `retry_count` | `INT` | 是 | 0 | 重试次数 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- INDEX `idx_receiver_id` (`receiver_id`)
- INDEX `idx_send_status` (`send_status`)
- INDEX `idx_biz_type_biz_id` (`biz_type`, `biz_id`)
- INDEX `idx_created_at` (`created_at`)

---

### 9.4 sys_third_party_config — 第三方接口配置表

**表注释**：第三方服务对接配置（微信、支付、物流、ERP等）。

| 字段名 | 类型 | 是否必填 | 默认值 | 注释 |
|--------|------|----------|--------|------|
| `id` | `BIGINT UNSIGNED` | 是 | AUTO_INCREMENT | 配置ID |
| `tenant_id` | `BIGINT UNSIGNED` | 是 | - | 租户ID |
| `provider_code` | `VARCHAR(32)` | 是 | - | 服务商编码（wechat/alipay/sf/erp） |
| `provider_name` | `VARCHAR(64)` | 是 | - | 服务商名称 |
| `api_url` | `VARCHAR(256)` | 否 | NULL | 接口地址 |
| `app_id` | `VARCHAR(128)` | 否 | NULL | 应用ID |
| `app_secret` | `VARCHAR(256)` | 否 | NULL | 应用密钥（加密存储） |
| `access_token` | `TEXT` | 否 | NULL | 访问令牌（加密存储） |
| `token_expire_at` | `DATETIME` | 否 | NULL | 令牌过期时间 |
| `extra_config` | `JSON` | 否 | NULL | 额外配置参数 |
| `status` | `TINYINT` | 是 | 1 | 状态：0禁用 1启用 |
| `created_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | `DATETIME` | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| `created_by` | `BIGINT UNSIGNED` | 是 | 0 | 创建人ID |
| `updated_by` | `BIGINT UNSIGNED` | 是 | 0 | 更新人ID |
| `deleted` | `TINYINT` | 是 | 0 | 逻辑删除 |

**索引**：
- PRIMARY KEY (`id`)
- UNIQUE KEY `uk_tenant_provider` (`tenant_id`, `provider_code`)

---

## 附录：表清单总览

| 序号 | 微服务 | 表名 | 说明 |
|------|--------|------|------|
| 1 | 用户&权限 | sys_tenant | 租户表 |
| 2 | 用户&权限 | sys_user | 用户表 |
| 3 | 用户&权限 | sys_role | 角色表 |
| 4 | 用户&权限 | sys_permission | 权限表 |
| 5 | 用户&权限 | sys_role_permission | 角色权限关联表 |
| 6 | 用户&权限 | sys_user_role | 用户角色关联表 |
| 7 | 用户&权限 | biz_customer | 药店客户档案表 |
| 8 | 用户&权限 | biz_customer_tag | 客户标签表 |
| 9 | 用户&权限 | biz_drug_authorization | 药品流向授权表 |
| 10 | 用户&权限 | biz_authorization_log | 授权操作日志表 |
| 11 | 商品&商城 | biz_product_category | 商品分类表 |
| 12 | 商品&商城 | biz_brand | 品牌表 |
| 13 | 商品&商城 | biz_product | 药品SKU表 |
| 14 | 商品&商城 | biz_product_image | 药品图片表 |
| 15 | 商品&商城 | biz_mall_decorate | 商城装修配置表 |
| 16 | 商品&商城 | biz_video_category | 视频分类表 |
| 17 | 商品&商城 | biz_video | 短视频表 |
| 18 | 商品&商城 | biz_video_product | 视频绑定药品关联表 |
| 19 | 商品&商城 | biz_video_comment | 视频评论表 |
| 20 | 商品&商城 | biz_video_stats | 视频统计表 |
| 21 | 商品&商城 | biz_stock_subscription | 缺货订阅表 |
| 22 | 营销&积分 | biz_activity | 促销活动表 |
| 23 | 营销&积分 | biz_activity_product | 活动商品关联表 |
| 24 | 营销&积分 | biz_activity_approval | 业务员定向优惠审批表 |
| 25 | 营销&积分 | biz_points_rule | 积分规则配置表 |
| 26 | 营销&积分 | biz_points_account | 积分账户表 |
| 27 | 营销&积分 | biz_points_flow | 积分流水表 |
| 28 | 营销&积分 | biz_points_product | 积分商品表 |
| 29 | 营销&积分 | biz_points_exchange | 积分兑换记录表 |
| 30 | 订单&售后 | biz_order | 订单主表 |
| 31 | 订单&售后 | biz_order_item | 订单明细表 |
| 32 | 订单&售后 | biz_order_log | 订单操作日志表 |
| 33 | 订单&售后 | biz_after_sale | 售后单表 |
| 34 | 订单&售后 | biz_after_sale_item | 售后明细表 |
| 35 | 订单&售后 | biz_logistics | 物流信息表 |
| 36 | 财务结算 | biz_finance_flow | 资金流水表 |
| 37 | 财务结算 | biz_reconciliation | 对公对账记录表 |
| 38 | 财务结算 | biz_reconciliation_diff | 对账差异表 |
| 39 | 财务结算 | biz_withdrawal | 业务员提现申请表 |
| 40 | 财务结算 | biz_credit_account | 账期账户表 |
| 41 | 财务结算 | biz_credit_record | 账期记录表 |
| 42 | 业务员运营 | biz_salesman | 业务员档案表 |
| 43 | 业务员运营 | biz_salesman_customer | 业务员客户关联表 |
| 44 | 业务员运营 | biz_commission_rule | 提成规则表 |
| 45 | 业务员运营 | biz_commission_record | 提成记录表 |
| 46 | 业务员运营 | biz_salesman_performance | 业务员业绩表 |
| 47 | 仓储库存 | biz_warehouse | 仓库表 |
| 48 | 仓储库存 | biz_stock | 库存表 |
| 49 | 仓储库存 | biz_stock_log | 库存操作日志表 |
| 50 | 系统配置 | sys_config | 系统配置表 |
| 51 | 系统配置 | sys_message_template | 消息模板表 |
| 52 | 系统配置 | sys_message_record | 消息推送记录表 |
| 53 | 系统配置 | sys_third_party_config | 第三方接口配置表 |

---

> **文档结束** — 共计 53 张表，覆盖 8 大微服务。
