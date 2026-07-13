# 医药B2B私域一体化平台 — API接口规范文档

> 版本：v1.0 | 更新日期：2026-07-12 | 编写：架构组

---

## 目录

- [1. 通用规范](#1-通用规范)
- [2. 用户认证服务](#2-用户认证服务)
- [3. 用户权限管理](#3-用户权限管理)
- [4. 客户档案管理](#4-客户档案管理)
- [5. 药品流向授权管理](#5-药品流向授权管理)
- [6. 商品管理](#6-商品管理)
- [7. 短视频管理](#7-短视频管理)
- [8. 商城装修配置](#8-商城装修配置)
- [9. 促销活动管理](#9-促销活动管理)
- [10. 积分系统](#10-积分系统)
- [11. 订单管理](#11-订单管理)
- [12. 售后管理](#12-售后管理)
- [13. 财务结算](#13-财务结算)
- [14. 业务员管理](#14-业务员管理)
- [15. 库存管理](#15-库存管理)
- [16. 系统配置管理](#16-系统配置管理)
- [17. 消息推送管理](#17-消息推送管理)

---

## 1. 通用规范

### 1.1 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1234567890
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `int` | 状态码：200成功，400参数错误，401未认证，403无权限，404资源不存在，500服务器错误 |
| `message` | `string` | 提示信息 |
| `data` | `object/array` | 业务数据 |
| `timestamp` | `long` | 服务器时间戳（毫秒） |

### 1.2 分页响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 20
  },
  "timestamp": 1234567890
}
```

### 1.3 请求头

| Header | 说明 | 是否必填 |
|--------|------|----------|
| `Authorization` | Bearer {access_token} | 是（除登录接口） |
| `X-Tenant-Id` | 租户ID | 是 |
| `Content-Type` | application/json | 是 |
| `Accept-Language` | zh-CN | 否 |

### 1.4 API路径规范

```
/api/v1/{service}/{resource}
```

| service | 说明 |
|---------|------|
| `auth` | 用户认证服务 |
| `user` | 用户权限服务 |
| `customer` | 客户档案服务 |
| `authorization` | 药品流向授权服务 |
| `product` | 商品服务 |
| `video` | 短视频服务 |
| `mall` | 商城装修服务 |
| `activity` | 营销活动服务 |
| `points` | 积分服务 |
| `order` | 订单服务 |
| `after-sale` | 售后服务 |
| `finance` | 财务结算服务 |
| `salesman` | 业务员服务 |
| `stock` | 库存服务 |
| `config` | 系统配置服务 |
| `message` | 消息服务 |

### 1.5 通用分页参数

| 参数 | 类型 | 是否必填 | 默认值 | 说明 |
|------|------|----------|--------|------|
| `page` | `int` | 否 | 1 | 当前页码 |
| `pageSize` | `int` | 否 | 20 | 每页条数（最大100） |
| `keyword` | `string` | 否 | - | 搜索关键词 |
| `status` | `int` | 否 | - | 状态筛选 |
| `startTime` | `datetime` | 否 | - | 开始时间 |
| `endTime` | `datetime` | 否 | - | 结束时间 |

---

## 2. 用户认证服务

### 2.1 用户登录

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/auth/login` |
| **方法** | POST |
| **权限** | 无需认证 |
| **微服务** | 用户认证服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `username` | `string` | 是 | 用户名 |
| `password` | `string` | 是 | 密码 |
| `captcha` | `string` | 否 | 验证码（开启时必填） |
| `loginType` | `int` | 否 | 登录方式：1账号密码 2手机验证码（默认1） |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "a1b2c3d4e5f6...",
    "expiresIn": 7200,
    "userInfo": {
      "id": 1001,
      "username": "admin",
      "realName": "张三",
      "avatar": "https://minio.example.com/avatar/1001.jpg",
      "userType": 2,
      "roles": ["tenant_admin"],
      "permissions": ["product:create", "product:list", "order:list"]
    }
  },
  "timestamp": 1720792397000
}
```

---

### 2.2 用户登出

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/auth/logout` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 用户认证服务 |

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null,
  "timestamp": 1720792397000
}
```

---

### 2.3 Token刷新

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/auth/refresh` |
| **方法** | POST |
| **权限** | 携带refreshToken |
| **微服务** | 用户认证服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `refreshToken` | `string` | 是 | 刷新令牌 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "f6e5d4c3b2a1...",
    "expiresIn": 7200
  },
  "timestamp": 1720792397000
}
```

---

### 2.4 获取当前用户信息

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/auth/userinfo` |
| **方法** | GET |
| **权限** | 已认证用户 |
| **微服务** | 用户认证服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1001,
    "username": "admin",
    "realName": "张三",
    "phone": "138****8888",
    "email": "admin@example.com",
    "avatar": "https://minio.example.com/avatar/1001.jpg",
    "userType": 2,
    "department": "运营部",
    "roles": [
      { "id": 1, "roleName": "租户管理员", "roleCode": "tenant_admin" }
    ],
    "permissions": ["product:create", "product:list", "order:list", "order:detail"]
  },
  "timestamp": 1720792397000
}
```

---

## 3. 用户权限管理

### 3.1 用户列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/user/users` |
| **方法** | GET |
| **权限** | `user:list` |
| **微服务** | 用户权限服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索用户名/姓名/手机号 |
| `userType` | `int` | 否 | 用户类型 |
| `status` | `int` | 否 | 状态 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1001,
        "username": "admin",
        "realName": "张三",
        "phone": "138****8888",
        "email": "admin@example.com",
        "avatar": "https://minio.example.com/avatar/1001.jpg",
        "userType": 2,
        "userTypeName": "租户管理员",
        "department": "运营部",
        "status": 1,
        "lastLoginAt": "2026-07-12 10:00:00",
        "createdAt": "2026-01-01 00:00:00"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  },
  "timestamp": 1720792397000
}
```

---

### 3.2 创建用户

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/user/users` |
| **方法** | POST |
| **权限** | `user:create` |
| **微服务** | 用户权限服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `username` | `string` | 是 | 登录用户名 |
| `password` | `string` | 是 | 密码 |
| `realName` | `string` | 否 | 真实姓名 |
| `phone` | `string` | 否 | 手机号 |
| `email` | `string` | 否 | 邮箱 |
| `userType` | `int` | 是 | 用户类型：1-6 |
| `department` | `string` | 否 | 部门 |
| `roleIds` | `int[]` | 否 | 角色ID数组 |

**响应示例**：

```json
{
  "code": 200,
  "message": "创建成功",
  "data": { "id": 1002 },
  "timestamp": 1720792397000
}
```

---

### 3.3 更新用户

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/user/users/{id}` |
| **方法** | PUT |
| **权限** | `user:update` |
| **微服务** | 用户权限服务 |

**路径参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | `long` | 用户ID |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `realName` | `string` | 否 | 真实姓名 |
| `phone` | `string` | 否 | 手机号 |
| `email` | `string` | 否 | 邮箱 |
| `department` | `string` | 否 | 部门 |
| `status` | `int` | 否 | 状态 |
| `roleIds` | `int[]` | 否 | 角色ID数组 |

---

### 3.4 删除用户

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/user/users/{id}` |
| **方法** | DELETE |
| **权限** | `user:delete` |
| **微服务** | 用户权限服务 |

---

### 3.5 角色列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/user/roles` |
| **方法** | GET |
| **权限** | `role:list` |
| **微服务** | 用户权限服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "roleName": "租户管理员",
        "roleCode": "tenant_admin",
        "description": "租户最高管理员",
        "dataScope": 1,
        "sort": 1,
        "status": 1,
        "createdAt": "2026-01-01 00:00:00"
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20
  },
  "timestamp": 1720792397000
}
```

---

### 3.6 创建角色

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/user/roles` |
| **方法** | POST |
| **权限** | `role:create` |
| **微服务** | 用户权限服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `roleName` | `string` | 是 | 角色名称 |
| `roleCode` | `string` | 是 | 角色编码 |
| `description` | `string` | 否 | 角色描述 |
| `dataScope` | `int` | 否 | 数据范围：1全部 2本人 3本部门 4自定义 |
| `sort` | `int` | 否 | 排序号 |
| `permissionIds` | `int[]` | 否 | 权限ID数组 |

---

### 3.7 更新角色

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/user/roles/{id}` |
| **方法** | PUT |
| **权限** | `role:update` |
| **微服务** | 用户权限服务 |

---

### 3.8 删除角色

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/user/roles/{id}` |
| **方法** | DELETE |
| **权限** | `role:delete` |
| **微服务** | 用户权限服务 |

---

### 3.9 权限树

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/user/permissions/tree` |
| **方法** | GET |
| **权限** | `permission:list` |
| **微服务** | 用户权限服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "parentId": 0,
      "permissionName": "商品管理",
      "permissionCode": "product",
      "permissionType": 1,
      "path": "/product",
      "icon": "shop",
      "sort": 1,
      "children": [
        {
          "id": 11,
          "parentId": 1,
          "permissionName": "商品列表",
          "permissionCode": "product:list",
          "permissionType": 2,
          "sort": 1,
          "children": []
        }
      ]
    }
  ],
  "timestamp": 1720792397000
}
```

---

## 4. 客户档案管理

### 4.1 客户列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/customer/customers` |
| **方法** | GET |
| **权限** | `customer:list` |
| **微服务** | 客户档案服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索客户名称/编码/电话 |
| `customerType` | `int` | 否 | 客户类型 |
| `status` | `int` | 否 | 状态 |
| `salesmanId` | `long` | 否 | 绑定业务员ID |
| `tag` | `string` | 否 | 标签筛选 |

---

### 4.2 客户详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/customer/customers/{id}` |
| **方法** | GET |
| **权限** | `customer:list` |
| **微服务** | 客户档案服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2001,
    "customerCode": "C202601001",
    "customerName": "健康大药房",
    "customerType": 1,
    "customerTypeName": "单体药店",
    "contactPerson": "李四",
    "contactPhone": "139****6666",
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "address": "科技园XX路XX号",
    "longitude": 113.9463,
    "latitude": 22.5370,
    "businessLicense": "91440300MA5XXXXX",
    "pharmaLicense": "粤AA75XXXXX",
    "creditLimit": 50000.00,
    "settlementType": 3,
    "settlementDays": 30,
    "status": 1,
    "tags": [
      { "id": 1, "tagName": "VIP", "tagColor": "#FFD700" },
      { "id": 2, "tagName": "深圳区域", "tagColor": "#1890FF" }
    ],
    "createdAt": "2026-01-15 10:00:00",
    "updatedAt": "2026-07-10 15:30:00"
  },
  "timestamp": 1720792397000
}
```

---

### 4.3 创建客户

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/customer/customers` |
| **方法** | POST |
| **权限** | `customer:create` |
| **微服务** | 客户档案服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerName` | `string` | 是 | 客户名称 |
| `customerType` | `int` | 是 | 客户类型：1单体药店 2连锁药店 3诊所 4医院 |
| `contactPerson` | `string` | 否 | 联系人 |
| `contactPhone` | `string` | 否 | 联系电话 |
| `province` | `string` | 否 | 省 |
| `city` | `string` | 否 | 市 |
| `district` | `string` | 否 | 区/县 |
| `address` | `string` | 否 | 详细地址 |
| `businessLicense` | `string` | 否 | 营业执照号 |
| `pharmaLicense` | `string` | 否 | 药品经营许可证号 |
| `creditLimit` | `decimal` | 否 | 信用额度 |
| `settlementType` | `int` | 否 | 结算方式：1现结 2月结 3账期 |
| `settlementDays` | `int` | 否 | 账期天数 |
| `remark` | `string` | 否 | 备注 |
| `tagNames` | `string[]` | 否 | 标签名称数组 |

---

### 4.4 更新客户

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/customer/customers/{id}` |
| **方法** | PUT |
| **权限** | `customer:update` |
| **微服务** | 客户档案服务 |

---

### 4.5 删除客户

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/customer/customers/{id}` |
| **方法** | DELETE |
| **权限** | `customer:delete` |
| **微服务** | 客户档案服务 |

---

### 4.6 客户标签管理

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/customer/customers/{id}/tags` |
| **方法** | POST |
| **权限** | `customer:update` |
| **微服务** | 客户档案服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `tagName` | `string` | 是 | 标签名称 |
| `tagCategory` | `string` | 否 | 标签分类 |
| `tagColor` | `string` | 否 | 标签颜色 |

---

## 5. 药品流向授权管理

### 5.1 授权列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/authorization/list` |
| **方法** | GET |
| **权限** | `authorization:list` |
| **微服务** | 药品流向授权服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `customerId` | `long` | 否 | 客户ID |
| `productId` | `long` | 否 | 药品ID |
| `salesmanId` | `long` | 否 | 业务员ID |
| `authorizationType` | `int` | 否 | 授权类型 |
| `status` | `int` | 否 | 状态 |

---

### 5.2 授权详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/authorization/{id}` |
| **方法** | GET |
| **权限** | `authorization:list` |
| **微服务** | 药品流向授权服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 3001,
    "authorizationCode": "AUTH202601001",
    "customerId": 2001,
    "customerName": "健康大药房",
    "productId": 5001,
    "productName": "阿莫西林胶囊",
    "brandId": 1,
    "brandName": "XX药业",
    "salesmanId": 4001,
    "salesmanName": "王五",
    "authorizationType": 1,
    "authorizationTypeName": "单品授权",
    "authorizedPrice": 25.50,
    "minPrice": 22.00,
    "startAt": "2026-01-01 00:00:00",
    "endAt": "2026-12-31 23:59:59",
    "status": 1,
    "statusName": "生效中",
    "approvedBy": "admin",
    "approvedAt": "2026-01-01 12:00:00",
    "remark": "年度合作授权",
    "createdAt": "2026-01-01 10:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 5.3 创建授权

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/authorization` |
| **方法** | POST |
| **权限** | `authorization:create` |
| **微服务** | 药品流向授权服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerId` | `long` | 是 | 被授权客户ID |
| `productId` | `long` | 否 | 授权药品ID（全品类授权时为空） |
| `brandId` | `long` | 否 | 授权品牌ID |
| `salesmanId` | `long` | 否 | 授权业务员ID |
| `authorizationType` | `int` | 是 | 授权类型：1单品 2品牌 3全品类 |
| `authorizedPrice` | `decimal` | 否 | 授权采购价 |
| `minPrice` | `decimal` | 否 | 最低限价 |
| `startAt` | `datetime` | 是 | 生效时间 |
| `endAt` | `datetime` | 否 | 失效时间 |
| `remark` | `string` | 否 | 备注 |

---

### 5.4 更新授权

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/authorization/{id}` |
| **方法** | PUT |
| **权限** | `authorization:update` |
| **微服务** | 药品流向授权服务 |

---

### 5.5 撤销授权

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/authorization/{id}/revoke` |
| **方法** | POST |
| **权限** | `authorization:revoke` |
| **微服务** | 药品流向授权服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `reason` | `string` | 是 | 撤销原因 |

---

### 5.6 授权操作日志

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/authorization/{id}/logs` |
| **方法** | GET |
| **权限** | `authorization:list` |
| **微服务** | 药品流向授权服务 |

---

## 6. 商品管理

### 6.1 商品列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/product/products` |
| **方法** | GET |
| **权限** | `product:list` |
| **微服务** | 商品服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索商品名称/通用名/编码/批准文号 |
| `categoryId` | `long` | 否 | 分类ID |
| `brandId` | `long` | 否 | 品牌ID |
| `shelfStatus` | `int` | 否 | 上下架状态 |
| `isOtc` | `int` | 否 | OTC类型 |
| `isColdChain` | `int` | 否 | 是否冷链 |
| `sortField` | `string` | 否 | 排序字段：price/sales/created |
| `sortOrder` | `string` | 否 | 排序方向：asc/desc |

---

### 6.2 商品详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/product/products/{id}` |
| **方法** | GET |
| **权限** | `product:list` |
| **微服务** | 商品服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 5001,
    "productCode": "P20260001",
    "productName": "阿莫西林胶囊",
    "commonName": "阿莫西林",
    "specification": "0.25g×24粒/盒",
    "dosageForm": "胶囊剂",
    "categoryId": 10,
    "categoryName": "抗生素类",
    "brandId": 1,
    "brandName": "XX药业",
    "manufacturer": "XX制药有限公司",
    "approvalNumber": "国药准字H2026XXXXX",
    "barcode": "6901234567890",
    "unit": "盒",
    "minOrderQty": 1,
    "purchasePrice": 18.00,
    "salePrice": 25.50,
    "marketPrice": 32.00,
    "memberPrice": 23.00,
    "stockQty": 5000,
    "isOtc": 2,
    "isOtcName": "OTC乙类",
    "isColdChain": 0,
    "storageCondition": "遮光，密封保存",
    "shelfLife": "24个月",
    "indication": "适用于敏感菌所致的感染。",
    "contraindication": "青霉素过敏者禁用。",
    "description": "<p>商品详情内容...</p>",
    "mainImage": "https://minio.example.com/product/5001/main.jpg",
    "images": [
      { "id": 1, "imageUrl": "https://minio.example.com/product/5001/1.jpg", "imageType": 1, "sort": 1 },
      { "id": 2, "imageUrl": "https://minio.example.com/product/5001/2.jpg", "imageType": 2, "sort": 1 }
    ],
    "shelfStatus": 1,
    "salesCount": 1200,
    "viewCount": 5600,
    "createdAt": "2026-01-01 00:00:00",
    "updatedAt": "2026-07-10 15:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 6.3 创建商品

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/product/products` |
| **方法** | POST |
| **权限** | `product:create` |
| **微服务** | 商品服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `productCode` | `string` | 是 | 商品编码 |
| `productName` | `string` | 是 | 商品名称 |
| `commonName` | `string` | 否 | 通用名 |
| `specification` | `string` | 否 | 规格 |
| `dosageForm` | `string` | 否 | 剂型 |
| `categoryId` | `long` | 否 | 分类ID |
| `brandId` | `long` | 否 | 品牌ID |
| `manufacturer` | `string` | 否 | 生产企业 |
| `approvalNumber` | `string` | 否 | 批准文号 |
| `barcode` | `string` | 否 | 条形码 |
| `unit` | `string` | 是 | 单位 |
| `minOrderQty` | `int` | 否 | 最小起订量（默认1） |
| `purchasePrice` | `decimal` | 是 | 采购价 |
| `salePrice` | `decimal` | 是 | 销售价 |
| `marketPrice` | `decimal` | 否 | 市场价 |
| `memberPrice` | `decimal` | 否 | 会员价 |
| `isOtc` | `int` | 否 | OTC类型（默认0） |
| `isColdChain` | `int` | 否 | 是否冷链（默认0） |
| `storageCondition` | `string` | 否 | 储存条件 |
| `shelfLife` | `string` | 否 | 保质期 |
| `indication` | `string` | 否 | 适应症 |
| `contraindication` | `string` | 否 | 禁忌 |
| `description` | `string` | 否 | 商品详情 |
| `mainImage` | `string` | 否 | 主图URL |
| `images` | `object[]` | 否 | 图片数组 |
| `shelfStatus` | `int` | 否 | 上下架状态（默认0下架） |

---

### 6.4 更新商品

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/product/products/{id}` |
| **方法** | PUT |
| **权限** | `product:update` |
| **微服务** | 商品服务 |

---

### 6.5 删除商品

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/product/products/{id}` |
| **方法** | DELETE |
| **权限** | `product:delete` |
| **微服务** | 商品服务 |

---

### 6.6 商品上架

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/product/products/{id}/shelf` |
| **方法** | POST |
| **权限** | `product:shelf` |
| **微服务** | 商品服务 |

---

### 6.7 商品下架

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/product/products/{id}/unshelf` |
| **方法** | POST |
| **权限** | `product:shelf` |
| **微服务** | 商品服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `reason` | `string` | 否 | 下架原因 |

---

### 6.8 商品分类树

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/product/categories/tree` |
| **方法** | GET |
| **权限** | `product:list` |
| **微服务** | 商品服务 |

---

### 6.9 品牌列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/product/brands` |
| **方法** | GET |
| **权限** | `product:list` |
| **微服务** | 商品服务 |

---

## 7. 短视频管理

### 7.1 视频列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/video/videos` |
| **方法** | GET |
| **权限** | `video:list` |
| **微服务** | 短视频服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索标题 |
| `categoryId` | `long` | 否 | 分类ID |
| `auditStatus` | `int` | 否 | 审核状态 |
| `publishStatus` | `int` | 否 | 发布状态 |
| `authorId` | `long` | 否 | 发布人ID |

---

### 7.2 视频详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/video/videos/{id}` |
| **方法** | GET |
| **权限** | `video:list` |
| **微服务** | 短视频服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 6001,
    "title": "夏季常备药品推荐",
    "description": "藿香正气水、风油精等夏季必备药品介绍",
    "categoryId": 3,
    "categoryName": "药品推荐",
    "videoUrl": "https://minio.example.com/video/6001.mp4",
    "coverUrl": "https://minio.example.com/video/6001/cover.jpg",
    "duration": 120,
    "fileSize": 15728640,
    "authorId": 4001,
    "authorName": "王五",
    "auditStatus": 1,
    "publishStatus": 1,
    "isTop": 0,
    "products": [
      { "productId": 5001, "productName": "藿香正气水", "salePrice": 12.00 }
    ],
    "stats": {
      "playCount": 1200,
      "likeCount": 86,
      "shareCount": 23,
      "commentCount": 15
    },
    "createdAt": "2026-07-01 10:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 7.3 上传视频

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/video/videos` |
| **方法** | POST |
| **权限** | `video:create` |
| **微服务** | 短视频服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `title` | `string` | 是 | 视频标题 |
| `description` | `string` | 否 | 视频描述 |
| `categoryId` | `long` | 否 | 分类ID |
| `videoUrl` | `string` | 是 | 视频文件URL（先上传MinIO再提交） |
| `coverUrl` | `string` | 否 | 封面图URL |
| `duration` | `int` | 否 | 视频时长（秒） |
| `fileSize` | `long` | 否 | 文件大小 |
| `productIds` | `long[]` | 否 | 关联药品ID数组 |

---

### 7.4 更新视频

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/video/videos/{id}` |
| **方法** | PUT |
| **权限** | `video:update` |
| **微服务** | 短视频服务 |

---

### 7.5 删除视频

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/video/videos/{id}` |
| **方法** | DELETE |
| **权限** | `video:delete` |
| **微服务** | 短视频服务 |

---

### 7.6 视频审核

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/video/videos/{id}/audit` |
| **方法** | POST |
| **权限** | `video:audit` |
| **微服务** | 短视频服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `auditStatus` | `int` | 是 | 审核结果：1通过 2驳回 |
| `auditRemark` | `string` | 否 | 审核备注（驳回时必填） |

---

### 7.7 视频发布/下架

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/video/videos/{id}/publish` |
| **方法** | POST |
| **权限** | `video:publish` |
| **微服务** | 短视频服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `publishStatus` | `int` | 是 | 1发布 2下架 |

---

### 7.8 视频评论列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/video/videos/{id}/comments` |
| **方法** | GET |
| **权限** | `video:list` |
| **微服务** | 短视频服务 |

---

### 7.9 发表评论

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/video/videos/{id}/comments` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 短视频服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `content` | `string` | 是 | 评论内容 |
| `parentId` | `long` | 否 | 父评论ID（回复评论时传） |

---

## 8. 商城装修配置

### 8.1 装修配置列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/mall/decorates` |
| **方法** | GET |
| **权限** | `mall:decorate:list` |
| **微服务** | 商城装修服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `pageCode` | `string` | 否 | 页面编码 |
| `platform` | `int` | 否 | 平台 |
| `isPublished` | `int` | 否 | 是否发布 |

---

### 8.2 装修配置详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/mall/decorates/{id}` |
| **方法** | GET |
| **权限** | `mall:decorate:list` |
| **微服务** | 商城装修服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 7001,
    "pageCode": "home",
    "pageName": "商城首页",
    "platform": 1,
    "platformName": "PC端",
    "components": [
      {
        "type": "banner",
        "props": {
          "images": [
            { "url": "https://minio.example.com/banner/1.jpg", "link": "/activity/1" }
          ],
          "autoplay": true,
          "interval": 3000
        }
      },
      {
        "type": "product_grid",
        "props": {
          "title": "热销推荐",
          "productIds": [5001, 5002, 5003],
          "columns": 4
        }
      },
      {
        "type": "video_section",
        "props": {
          "title": "药品科普",
          "videoIds": [6001, 6002]
        }
      }
    ],
    "isPublished": 1,
    "publishAt": "2026-07-01 00:00:00",
    "version": 3,
    "createdAt": "2026-06-01 10:00:00",
    "updatedAt": "2026-07-01 00:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 8.3 创建装修配置

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/mall/decorates` |
| **方法** | POST |
| **权限** | `mall:decorate:create` |
| **微服务** | 商城装修服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `pageCode` | `string` | 是 | 页面编码 |
| `pageName` | `string` | 是 | 页面名称 |
| `platform` | `int` | 是 | 平台：1PC 2移动端 3小程序 |
| `components` | `json` | 是 | 组件配置JSON |

---

### 8.4 更新装修配置

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/mall/decorates/{id}` |
| **方法** | PUT |
| **权限** | `mall:decorate:update` |
| **微服务** | 商城装修服务 |

---

### 8.5 发布装修配置

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/mall/decorates/{id}/publish` |
| **方法** | POST |
| **权限** | `mall:decorate:publish` |
| **微服务** | 商城装修服务 |

---

## 9. 促销活动管理

### 9.1 活动列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/activity/activities` |
| **方法** | GET |
| **权限** | `activity:list` |
| **微服务** | 营销活动服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索活动名称 |
| `activityType` | `int` | 否 | 活动类型 |
| `status` | `int` | 否 | 状态 |

---

### 9.2 活动详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/activity/activities/{id}` |
| **方法** | GET |
| **权限** | `activity:list` |
| **微服务** | 营销活动服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 8001,
    "activityCode": "ACT202607001",
    "activityName": "夏季药品大促",
    "activityType": 1,
    "activityTypeName": "满减活动",
    "description": "满300减50",
    "targetType": 1,
    "targetTypeName": "全部客户",
    "startAt": "2026-07-01 00:00:00",
    "endAt": "2026-07-31 23:59:59",
    "status": 3,
    "statusName": "进行中",
    "priority": 10,
    "approvedBy": "admin",
    "approvedAt": "2026-06-28 10:00:00",
    "products": [
      {
        "productId": 5001,
        "productName": "阿莫西林胶囊",
        "activityPrice": 20.00,
        "thresholdAmount": 300.00,
        "reduceAmount": 50.00
      }
    ],
    "createdAt": "2026-06-25 10:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 9.3 创建活动

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/activity/activities` |
| **方法** | POST |
| **权限** | `activity:create` |
| **微服务** | 营销活动服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `activityName` | `string` | 是 | 活动名称 |
| `activityType` | `int` | 是 | 活动类型：1满减 2折扣 3满赠 4秒杀 5团购 |
| `description` | `string` | 否 | 活动描述 |
| `targetType` | `int` | 是 | 适用对象：1全部 2指定客户 3指定标签 |
| `targetCustomerIds` | `long[]` | 否 | 指定客户ID（targetType=2时必填） |
| `targetTags` | `string[]` | 否 | 指定标签（targetType=3时必填） |
| `startAt` | `datetime` | 是 | 开始时间 |
| `endAt` | `datetime` | 是 | 结束时间 |
| `priority` | `int` | 否 | 优先级 |
| `products` | `object[]` | 是 | 活动商品数组 |
| `products[].productId` | `long` | 是 | 商品ID |
| `products[].activityPrice` | `decimal` | 否 | 活动价 |
| `products[].discountRate` | `decimal` | 否 | 折扣率 |
| `products[].thresholdAmount` | `decimal` | 否 | 满减门槛 |
| `products[].reduceAmount` | `decimal` | 否 | 满减金额 |
| `products[].minPurchaseQty` | `int` | 否 | 最低购买量 |
| `products[].maxPurchaseQty` | `int` | 否 | 限购数量 |

---

### 9.4 更新活动

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/activity/activities/{id}` |
| **方法** | PUT |
| **权限** | `activity:update` |
| **微服务** | 营销活动服务 |

---

### 9.5 删除活动

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/activity/activities/{id}` |
| **方法** | DELETE |
| **权限** | `activity:delete` |
| **微服务** | 营销活动服务 |

---

### 9.6 活动审批

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/activity/activities/{id}/approve` |
| **方法** | POST |
| **权限** | `activity:approve` |
| **微服务** | 营销活动服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `approved` | `boolean` | 是 | 是否通过 |
| `auditRemark` | `string` | 否 | 审批意见 |

---

### 9.7 业务员定向优惠申请

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/activity/approvals` |
| **方法** | POST |
| **权限** | `activity:approval:create`（业务员角色） |
| **微服务** | 营销活动服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerId` | `long` | 是 | 目标客户ID |
| `productId` | `long` | 否 | 目标商品ID（空为全场） |
| `requestedPrice` | `decimal` | 否 | 申请优惠价 |
| `requestedDiscount` | `decimal` | 否 | 申请折扣率 |
| `reason` | `string` | 是 | 申请理由 |
| `validStartAt` | `datetime` | 是 | 优惠生效时间 |
| `validEndAt` | `datetime` | 是 | 优惠失效时间 |

---

### 9.8 定向优惠审批

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/activity/approvals/{id}/audit` |
| **方法** | POST |
| **权限** | `activity:approval:audit` |
| **微服务** | 营销活动服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `status` | `int` | 是 | 1通过 2驳回 |
| `auditRemark` | `string` | 否 | 审批意见 |

---

## 10. 积分系统

### 10.1 积分规则列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/points/rules` |
| **方法** | GET |
| **权限** | `points:rule:list` |
| **微服务** | 积分服务 |

---

### 10.2 创建积分规则

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/points/rules` |
| **方法** | POST |
| **权限** | `points:rule:create` |
| **微服务** | 积分服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `ruleName` | `string` | 是 | 规则名称 |
| `ruleCode` | `string` | 是 | 规则编码 |
| `ruleType` | `int` | 是 | 规则类型：1下单 2签到 3评价 4首次购买 5活动奖励 |
| `pointsType` | `int` | 是 | 积分类型：1固定 2按比例 |
| `pointsValue` | `int` | 是 | 积分值 |
| `pointsRatio` | `decimal` | 否 | 比例 |
| `maxPoints` | `int` | 否 | 单次上限（0不限） |
| `dailyLimit` | `int` | 否 | 每日上限（0不限） |
| `startAt` | `datetime` | 否 | 生效时间 |
| `endAt` | `datetime` | 否 | 失效时间 |

---

### 10.3 更新积分规则

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/points/rules/{id}` |
| **方法** | PUT |
| **权限** | `points:rule:update` |
| **微服务** | 积分服务 |

---

### 10.4 积分账户查询

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/points/account` |
| **方法** | GET |
| **权限** | 已认证用户 |
| **微服务** | 积分服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accountId": 9001,
    "userId": 1001,
    "totalPoints": 5800,
    "availablePoints": 3200,
    "usedPoints": 2400,
    "expiredPoints": 200,
    "frozenPoints": 0
  },
  "timestamp": 1720792397000
}
```

---

### 10.5 积分流水查询

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/points/flows` |
| **方法** | GET |
| **权限** | 已认证用户 / `points:flow:list` |
| **微服务** | 积分服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `userId` | `long` | 否 | 用户ID（管理员查看指定用户） |
| `flowType` | `int` | 否 | 流水类型 |
| `sourceType` | `int` | 否 | 来源类型 |
| `startTime` | `datetime` | 否 | 开始时间 |
| `endTime` | `datetime` | 否 | 结束时间 |

---

### 10.6 积分商品列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/points/products` |
| **方法** | GET |
| **权限** | `points:product:list` |
| **微服务** | 积分服务 |

---

### 10.7 创建积分商品

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/points/products` |
| **方法** | POST |
| **权限** | `points:product:create` |
| **微服务** | 积分服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `productId` | `long` | 否 | 关联商品ID |
| `productName` | `string` | 是 | 商品名称 |
| `productImage` | `string` | 否 | 商品图片 |
| `pointsRequired` | `int` | 是 | 所需积分 |
| `cashPrice` | `decimal` | 否 | 额外现金 |
| `stockQty` | `int` | 是 | 兑换库存 |
| `exchangeLimit` | `int` | 否 | 每人限兑 |
| `startAt` | `datetime` | 否 | 开始时间 |
| `endAt` | `datetime` | 否 | 结束时间 |

---

### 10.8 积分兑换

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/points/exchange` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 积分服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `pointsProductId` | `long` | 是 | 积分商品ID |
| `qty` | `int` | 是 | 兑换数量 |
| `receiverName` | `string` | 否 | 收货人 |
| `receiverPhone` | `string` | 否 | 收货电话 |
| `receiverAddress` | `string` | 否 | 收货地址 |

**响应示例**：

```json
{
  "code": 200,
  "message": "兑换成功",
  "data": {
    "exchangeCode": "EXC20260712001",
    "pointsUsed": 500,
    "cashPaid": 0,
    "availablePoints": 2700
  },
  "timestamp": 1720792397000
}
```

---

### 10.9 兑换记录列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/points/exchanges` |
| **方法** | GET |
| **权限** | 已认证用户 / `points:exchange:list` |
| **微服务** | 积分服务 |

---

## 11. 订单管理

### 11.1 订单列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/order/orders` |
| **方法** | GET |
| **权限** | `order:list` |
| **微服务** | 订单服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索订单号 |
| `orderNo` | `string` | 否 | 订单编号 |
| `customerId` | `long` | 否 | 客户ID |
| `salesmanId` | `long` | 否 | 业务员ID |
| `orderStatus` | `int` | 否 | 订单状态 |
| `paymentStatus` | `int` | 否 | 支付状态 |
| `orderType` | `int` | 否 | 订单类型 |
| `startTime` | `datetime` | 否 | 开始时间 |
| `endTime` | `datetime` | 否 | 结束时间 |

---

### 11.2 订单详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/order/orders/{id}` |
| **方法** | GET |
| **权限** | `order:list` |
| **微服务** | 订单服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 10001,
    "orderNo": "ORD20260712001",
    "orderType": 1,
    "orderTypeName": "普通采购",
    "customerId": 2001,
    "customerName": "健康大药房",
    "salesmanId": 4001,
    "salesmanName": "王五",
    "receiverName": "李四",
    "receiverPhone": "139****6666",
    "receiverAddress": "广东省深圳市南山区科技园XX路XX号",
    "itemCount": 3,
    "totalQty": 100,
    "productAmount": 2550.00,
    "discountAmount": 300.00,
    "freightAmount": 0.00,
    "payAmount": 2250.00,
    "paidAmount": 2250.00,
    "paymentType": 1,
    "paymentStatus": 2,
    "orderStatus": 3,
    "orderStatusName": "已发货",
    "activityId": 8001,
    "items": [
      {
        "id": 1,
        "productId": 5001,
        "productName": "阿莫西林胶囊",
        "productCode": "P20260001",
        "specification": "0.25g×24粒/盒",
        "manufacturer": "XX制药有限公司",
        "unit": "盒",
        "qty": 50,
        "originalPrice": 25.50,
        "salePrice": 22.00,
        "discountAmount": 175.00,
        "subtotal": 1100.00
      }
    ],
    "logistics": {
      "logisticsCompany": "顺丰速运",
      "logisticsNo": "SF1234567890",
      "shippingAt": "2026-07-12 14:00:00",
      "status": 1
    },
    "remark": "请尽快发货",
    "createdAt": "2026-07-12 10:00:00",
    "updatedAt": "2026-07-12 14:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 11.3 创建订单

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/order/orders` |
| **方法** | POST |
| **权限** | `order:create` |
| **微服务** | 订单服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerId` | `long` | 是 | 客户ID |
| `items` | `object[]` | 是 | 商品明细数组 |
| `items[].productId` | `long` | 是 | 商品ID |
| `items[].qty` | `int` | 是 | 购买数量 |
| `receiverName` | `string` | 是 | 收货人 |
| `receiverPhone` | `string` | 是 | 收货电话 |
| `receiverProvince` | `string` | 否 | 收货省 |
| `receiverCity` | `string` | 否 | 收货市 |
| `receiverDistrict` | `string` | 否 | 收货区 |
| `receiverAddress` | `string` | 是 | 收货详细地址 |
| `paymentType` | `int` | 否 | 支付方式 |
| `activityId` | `long` | 否 | 活动ID |
| `remark` | `string` | 否 | 备注 |

**响应示例**：

```json
{
  "code": 200,
  "message": "下单成功",
  "data": {
    "orderId": 10001,
    "orderNo": "ORD20260712001",
    "payAmount": 2250.00
  },
  "timestamp": 1720792397000
}
```

---

### 11.4 取消订单

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/order/orders/{id}/cancel` |
| **方法** | POST |
| **权限** | `order:update` |
| **微服务** | 订单服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `cancelReason` | `string` | 是 | 取消原因 |

---

### 11.5 订单发货

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/order/orders/{id}/ship` |
| **方法** | POST |
| **权限** | `order:ship` |
| **微服务** | 订单服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `logisticsCompany` | `string` | 是 | 物流公司 |
| `logisticsNo` | `string` | 是 | 物流单号 |
| `warehouseId` | `long` | 否 | 发货仓库ID |

---

### 11.6 确认收货

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/order/orders/{id}/confirm` |
| **方法** | POST |
| **权限** | `order:update` |
| **微服务** | 订单服务 |

---

### 11.7 订单操作日志

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/order/orders/{id}/logs` |
| **方法** | GET |
| **权限** | `order:list` |
| **微服务** | 订单服务 |

---

## 12. 售后管理

### 12.1 售后列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/after-sale/list` |
| **方法** | GET |
| **权限** | `after-sale:list` |
| **微服务** | 售后服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索售后单号/订单号 |
| `customerId` | `long` | 否 | 客户ID |
| `type` | `int` | 否 | 售后类型 |
| `status` | `int` | 否 | 状态 |

---

### 12.2 售后详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/after-sale/{id}` |
| **方法** | GET |
| **权限** | `after-sale:list` |
| **微服务** | 售后服务 |

---

### 12.3 创建售后申请

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/after-sale` |
| **方法** | POST |
| **权限** | `after-sale:create` |
| **微服务** | 售后服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `orderId` | `long` | 是 | 原订单ID |
| `type` | `int` | 是 | 售后类型：1仅退款 2退货退款 3换货 |
| `reason` | `string` | 是 | 售后原因 |
| `description` | `string` | 否 | 问题描述 |
| `evidenceImages` | `string[]` | 否 | 凭证图片URL数组 |
| `items` | `object[]` | 是 | 售后明细 |
| `items[].orderItemId` | `long` | 是 | 订单明细ID |
| `items[].qty` | `int` | 是 | 售后数量 |

---

### 12.4 售后审核

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/after-sale/{id}/audit` |
| **方法** | POST |
| **权限** | `after-sale:audit` |
| **微服务** | 售后服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `status` | `int` | 是 | 1通过 2驳回 |
| `auditRemark` | `string` | 否 | 审核备注 |
| `refundAmount` | `decimal` | 否 | 退款金额（通过时填写） |
| `refundType` | `int` | 否 | 退款方式 |

---

### 12.5 确认收货（退货）

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/after-sale/{id}/receive` |
| **方法** | POST |
| **权限** | `after-sale:audit` |
| **微服务** | 售后服务 |

---

### 12.6 退款

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/after-sale/{id}/refund` |
| **方法** | POST |
| **权限** | `after-sale:refund` |
| **微服务** | 售后服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `refundAmount` | `decimal` | 是 | 退款金额 |
| `refundType` | `int` | 是 | 退款方式：1原路退回 2余额 3线下 |
| `paymentVoucher` | `string` | 否 | 退款凭证（线下退款时上传） |

---

## 13. 财务结算

### 13.1 资金流水列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/flows` |
| **方法** | GET |
| **权限** | `finance:flow:list` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索流水号/业务单号 |
| `flowType` | `int` | 否 | 流水类型 |
| `bizType` | `int` | 否 | 业务类型 |
| `customerId` | `long` | 否 | 客户ID |
| `salesmanId` | `long` | 否 | 业务员ID |
| `paymentChannel` | `int` | 否 | 支付渠道 |
| `startTime` | `datetime` | 否 | 开始时间 |
| `endTime` | `datetime` | 否 | 结束时间 |

---

### 13.2 对账记录列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/reconciliations` |
| **方法** | GET |
| **权限** | `finance:reconciliation:list` |
| **微服务** | 财务结算服务 |

---

### 13.3 创建对账

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/finance/reconciliations` |
| **方法** | POST |
| **权限** | `finance:reconciliation:create` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `reconciliationDate` | `date` | 是 | 对账日期 |
| `channel` | `int` | 是 | 对账渠道 |
| `fileUrl` | `string` | 否 | 对账文件URL |

---

### 13.4 对账差异列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/reconciliations/{id}/diffs` |
| **方法** | GET |
| **权限** | `finance:reconciliation:list` |
| **微服务** | 财务结算服务 |

---

### 13.5 处理对账差异

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/finance/reconciliation-diffs/{id}/handle` |
| **方法** | POST |
| **权限** | `finance:reconciliation:handle` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `handleStatus` | `int` | 是 | 1已处理 2已忽略 |
| `handleRemark` | `string` | 否 | 处理备注 |

---

### 13.6 提现申请列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/withdrawals` |
| **方法** | GET |
| **权限** | `finance:withdrawal:list` |
| **微服务** | 财务结算服务 |

---

### 13.7 创建提现申请

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/finance/withdrawals` |
| **方法** | POST |
| **权限** | 业务员角色 |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `amount` | `decimal` | 是 | 提现金额 |
| `bankAccount` | `string` | 否 | 银行账号 |
| `bankName` | `string` | 否 | 开户行 |
| `accountHolder` | `string` | 否 | 账户持有人 |

---

### 13.8 提现审批

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/finance/withdrawals/{id}/audit` |
| **方法** | POST |
| **权限** | `finance:withdrawal:audit` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `status` | `int` | 是 | 1通过 2驳回 |
| `auditRemark` | `string` | 否 | 审核备注 |

---

### 13.9 提现打款

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/finance/withdrawals/{id}/pay` |
| **方法** | POST |
| **权限** | `finance:withdrawal:pay` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `paymentVoucher` | `string` | 否 | 打款凭证 |

---

### 13.10 账期账户查询

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/credit-accounts` |
| **方法** | GET |
| **权限** | `finance:credit:list` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerId` | `long` | 否 | 客户ID |

---

### 13.11 账期记录列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/finance/credit-records` |
| **方法** | GET |
| **权限** | `finance:credit:list` |
| **微服务** | 财务结算服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerId` | `long` | 否 | 客户ID |
| `status` | `int` | 否 | 状态：0未还款 1已还款 2已逾期 |

---

## 14. 业务员管理

### 14.1 业务员列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/salesman/salesmen` |
| **方法** | GET |
| **权限** | `salesman:list` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `keyword` | `string` | 否 | 搜索姓名/工号/手机号 |
| `level` | `int` | 否 | 等级 |
| `status` | `int` | 否 | 状态 |
| `department` | `string` | 否 | 部门 |

---

### 14.2 业务员详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/salesman/salesmen/{id}` |
| **方法** | GET |
| **权限** | `salesman:list` |
| **微服务** | 业务员服务 |

---

### 14.3 创建业务员

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/salesman/salesmen` |
| **方法** | POST |
| **权限** | `salesman:create` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `userId` | `long` | 是 | 关联用户ID |
| `salesmanCode` | `string` | 是 | 工号 |
| `salesmanName` | `string` | 是 | 姓名 |
| `phone` | `string` | 否 | 手机号 |
| `department` | `string` | 否 | 部门 |
| `level` | `int` | 否 | 等级 |
| `region` | `string` | 否 | 负责区域 |
| `parentId` | `long` | 否 | 上级业务员ID |
| `entryDate` | `date` | 否 | 入职日期 |

---

### 14.4 更新业务员

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/salesman/salesmen/{id}` |
| **方法** | PUT |
| **权限** | `salesman:update` |
| **微服务** | 业务员服务 |

---

### 14.5 删除业务员

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/salesman/salesmen/{id}` |
| **方法** | DELETE |
| **权限** | `salesman:delete` |
| **微服务** | 业务员服务 |

---

### 14.6 业务员客户绑定

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/salesman/salesmen/{id}/customers` |
| **方法** | POST |
| **权限** | `salesman:update` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `customerIds` | `long[]` | 是 | 客户ID数组 |
| `relationType` | `int` | 否 | 关系类型：1主负责 2协办（默认1） |

---

### 14.7 业务员客户解绑

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/salesman/salesmen/{id}/customers/{customerId}` |
| **方法** | DELETE |
| **权限** | `salesman:update` |
| **微服务** | 业务员服务 |

---

### 14.8 提成规则列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/salesman/commission-rules` |
| **方法** | GET |
| **权限** | `commission:rule:list` |
| **微服务** | 业务员服务 |

---

### 14.9 创建提成规则

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/salesman/commission-rules` |
| **方法** | POST |
| **权限** | `commission:rule:create` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `ruleName` | `string` | 是 | 规则名称 |
| `ruleType` | `int` | 是 | 类型：1按销售额 2按利润 3固定金额 |
| `scopeType` | `int` | 是 | 范围：1全部 2指定商品 3指定品牌 4指定客户 5指定分类 |
| `scopeId` | `long` | 否 | 范围目标ID |
| `salesmanLevel` | `int` | 否 | 适用等级 |
| `commissionRate` | `decimal` | 否 | 提成比例 |
| `commissionAmount` | `decimal` | 否 | 固定金额 |
| `minSalesAmount` | `decimal` | 否 | 最低销售额 |
| `maxCommission` | `decimal` | 否 | 提成上限 |
| `startAt` | `datetime` | 否 | 生效时间 |
| `endAt` | `datetime` | 否 | 失效时间 |

---

### 14.10 提成记录列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/salesman/commission-records` |
| **方法** | GET |
| **权限** | `commission:record:list` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `salesmanId` | `long` | 否 | 业务员ID |
| `settlementStatus` | `int` | 否 | 结算状态 |
| `settlementPeriod` | `string` | 否 | 结算周期（如2026-07） |

---

### 14.11 业务员业绩查询

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/salesman/salesmen/{id}/performance` |
| **方法** | GET |
| **权限** | `salesman:performance:list` |
| **微服务** | 业务员服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `statType` | `int` | 否 | 统计类型：1日 2月 3年（默认2） |
| `startDate` | `date` | 否 | 开始日期 |
| `endDate` | `date` | 否 | 结束日期 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "salesmanId": 4001,
    "salesmanName": "王五",
    "statType": 2,
    "records": [
      {
        "statDate": "2026-07-01",
        "orderCount": 45,
        "customerCount": 12,
        "salesAmount": 58600.00,
        "refundAmount": 1200.00,
        "netAmount": 57400.00,
        "commissionAmount": 2870.00,
        "newCustomerCount": 3
      }
    ]
  },
  "timestamp": 1720792397000
}
```

---

## 15. 库存管理

### 15.1 仓库列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/stock/warehouses` |
| **方法** | GET |
| **权限** | `warehouse:list` |
| **微服务** | 仓储库存服务 |

---

### 15.2 创建仓库

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/warehouses` |
| **方法** | POST |
| **权限** | `warehouse:create` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `warehouseCode` | `string` | 是 | 仓库编码 |
| `warehouseName` | `string` | 是 | 仓库名称 |
| `warehouseType` | `int` | 是 | 仓库类型：1中心仓 2前置仓 3门店仓 4冷链仓 |
| `province` | `string` | 否 | 省 |
| `city` | `string` | 否 | 市 |
| `district` | `string` | 否 | 区/县 |
| `address` | `string` | 否 | 详细地址 |
| `managerId` | `long` | 否 | 管理员ID |
| `contactPhone` | `string` | 否 | 联系电话 |

---

### 15.3 库存列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/stock/stocks` |
| **方法** | GET |
| **权限** | `stock:list` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `warehouseId` | `long` | 否 | 仓库ID |
| `productId` | `long` | 否 | 商品ID |
| `keyword` | `string` | 否 | 搜索商品名称 |
| `batchNo` | `string` | 否 | 批次号 |

---

### 15.4 库存详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/stock/stocks/{id}` |
| **方法** | GET |
| **权限** | `stock:list` |
| **微服务** | 仓储库存服务 |

**响应示例**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 11001,
    "warehouseId": 1001,
    "warehouseName": "深圳中心仓",
    "productId": 5001,
    "productName": "阿莫西林胶囊",
    "productCode": "P20260001",
    "availableQty": 3000,
    "lockedQty": 500,
    "totalQty": 3500,
    "safetyStock": 500,
    "batchNo": "BATCH20260701",
    "productionDate": "2026-06-01",
    "expiryDate": "2028-06-01",
    "costPrice": 18.00,
    "updatedAt": "2026-07-12 08:00:00"
  },
  "timestamp": 1720792397000
}
```

---

### 15.5 入库

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/stocks/inbound` |
| **方法** | POST |
| **权限** | `stock:inbound` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `warehouseId` | `long` | 是 | 仓库ID |
| `productId` | `long` | 是 | 商品ID |
| `qty` | `int` | 是 | 入库数量 |
| `batchNo` | `string` | 否 | 批次号 |
| `productionDate` | `date` | 否 | 生产日期 |
| `expiryDate` | `date` | 否 | 过期日期 |
| `costPrice` | `decimal` | 否 | 成本价 |
| `bizType` | `int` | 否 | 业务类型：1采购入库 3退货入库 |
| `bizNo` | `string` | 否 | 业务单号 |
| `remark` | `string` | 否 | 备注 |

---

### 15.6 出库

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/stocks/outbound` |
| **方法** | POST |
| **权限** | `stock:outbound` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `warehouseId` | `long` | 是 | 仓库ID |
| `productId` | `long` | 是 | 商品ID |
| `qty` | `int` | 是 | 出库数量 |
| `batchNo` | `string` | 否 | 批次号（指定批次出库） |
| `bizType` | `int` | 否 | 业务类型：2订单出库 |
| `bizNo` | `string` | 否 | 业务单号 |
| `remark` | `string` | 否 | 备注 |

---

### 15.7 库存调拨

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/stocks/transfer` |
| **方法** | POST |
| **权限** | `stock:transfer` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `fromWarehouseId` | `long` | 是 | 调出仓库ID |
| `toWarehouseId` | `long` | 是 | 调入仓库ID |
| `productId` | `long` | 是 | 商品ID |
| `qty` | `int` | 是 | 调拨数量 |
| `batchNo` | `string` | 否 | 批次号 |
| `remark` | `string` | 否 | 备注 |

---

### 15.8 库存盘点

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/stocks/{id}/check` |
| **方法** | POST |
| **权限** | `stock:check` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `actualQty` | `int` | 是 | 实际盘点数量 |
| `remark` | `string` | 否 | 备注 |

---

### 15.9 库存操作日志

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/stock/stocks/logs` |
| **方法** | GET |
| **权限** | `stock:log:list` |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `warehouseId` | `long` | 否 | 仓库ID |
| `productId` | `long` | 否 | 商品ID |
| `operationType` | `int` | 否 | 操作类型 |
| `startTime` | `datetime` | 否 | 开始时间 |
| `endTime` | `datetime` | 否 | 结束时间 |

---

### 15.10 缺货订阅

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/stock/subscribe` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 仓储库存服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `productId` | `long` | 是 | 商品ID |
| `notifyChannel` | `int` | 否 | 通知渠道（默认1站内信） |

---

## 16. 系统配置管理

### 16.1 配置列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/config/configs` |
| **方法** | GET |
| **权限** | `config:list` |
| **微服务** | 系统配置服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `configGroup` | `string` | 否 | 配置分组 |

---

### 16.2 配置详情

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/config/configs/{id}` |
| **方法** | GET |
| **权限** | `config:list` |
| **微服务** | 系统配置服务 |

---

### 16.3 创建配置

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/config/configs` |
| **方法** | POST |
| **权限** | `config:create` |
| **微服务** | 系统配置服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `configGroup` | `string` | 是 | 配置分组 |
| `configKey` | `string` | 是 | 配置键名 |
| `configValue` | `string` | 否 | 配置值 |
| `configType` | `int` | 否 | 值类型：1字符串 2数字 3布尔 4JSON |
| `description` | `string` | 否 | 配置说明 |

---

### 16.4 更新配置

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/config/configs/{id}` |
| **方法** | PUT |
| **权限** | `config:update` |
| **微服务** | 系统配置服务 |

---

### 16.5 删除配置

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/config/configs/{id}` |
| **方法** | DELETE |
| **权限** | `config:delete` |
| **微服务** | 系统配置服务 |

---

### 16.6 第三方接口配置列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/config/third-party` |
| **方法** | GET |
| **权限** | `config:third-party:list` |
| **微服务** | 系统配置服务 |

---

### 16.7 创建第三方接口配置

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/config/third-party` |
| **方法** | POST |
| **权限** | `config:third-party:create` |
| **微服务** | 系统配置服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `providerCode` | `string` | 是 | 服务商编码 |
| `providerName` | `string` | 是 | 服务商名称 |
| `apiUrl` | `string` | 否 | 接口地址 |
| `appId` | `string` | 否 | 应用ID |
| `appSecret` | `string` | 否 | 应用密钥 |
| `extraConfig` | `json` | 否 | 额外配置 |

---

### 16.8 更新第三方接口配置

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/config/third-party/{id}` |
| **方法** | PUT |
| **权限** | `config:third-party:update` |
| **微服务** | 系统配置服务 |

---

## 17. 消息推送管理

### 17.1 消息模板列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/message/templates` |
| **方法** | GET |
| **权限** | `message:template:list` |
| **微服务** | 消息服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `channel` | `int` | 否 | 推送渠道 |
| `bizType` | `string` | 否 | 业务类型 |

---

### 17.2 创建消息模板

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/message/templates` |
| **方法** | POST |
| **权限** | `message:template:create` |
| **微服务** | 消息服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `templateCode` | `string` | 是 | 模板编码 |
| `templateName` | `string` | 是 | 模板名称 |
| `channel` | `int` | 是 | 推送渠道：1站内信 2短信 3微信 4邮件 |
| `bizType` | `string` | 否 | 业务类型 |
| `title` | `string` | 否 | 消息标题 |
| `content` | `string` | 是 | 模板内容（支持 ${variable}） |
| `variables` | `json` | 否 | 变量定义 |
| `externalTemplateId` | `string` | 否 | 第三方模板ID |

---

### 17.3 更新消息模板

| 项目 | 内容 |
|------|------|
| **路径** | `PUT /api/v1/message/templates/{id}` |
| **方法** | PUT |
| **权限** | `message:template:update` |
| **微服务** | 消息服务 |

---

### 17.4 删除消息模板

| 项目 | 内容 |
|------|------|
| **路径** | `DELETE /api/v1/message/templates/{id}` |
| **方法** | DELETE |
| **权限** | `message:template:delete` |
| **微服务** | 消息服务 |

---

### 17.5 消息推送记录列表

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/message/records` |
| **方法** | GET |
| **权限** | `message:record:list` |
| **微服务** | 消息服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `receiverId` | `long` | 否 | 接收人ID |
| `channel` | `int` | 否 | 推送渠道 |
| `bizType` | `string` | 否 | 业务类型 |
| `sendStatus` | `int` | 否 | 发送状态 |
| `startTime` | `datetime` | 否 | 开始时间 |
| `endTime` | `datetime` | 否 | 结束时间 |

---

### 17.6 站内信列表（当前用户）

| 项目 | 内容 |
|------|------|
| **路径** | `GET /api/v1/message/inbox` |
| **方法** | GET |
| **权限** | 已认证用户 |
| **微服务** | 消息服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `page` | `int` | 否 | 页码 |
| `pageSize` | `int` | 否 | 每页条数 |
| `readStatus` | `int` | 否 | 阅读状态：0未读 1已读 |

---

### 17.7 标记消息已读

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/message/records/{id}/read` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 消息服务 |

---

### 17.8 全部标记已读

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/message/inbox/read-all` |
| **方法** | POST |
| **权限** | 已认证用户 |
| **微服务** | 消息服务 |

---

### 17.9 手动推送消息

| 项目 | 内容 |
|------|------|
| **路径** | `POST /api/v1/message/send` |
| **方法** | POST |
| **权限** | `message:send` |
| **微服务** | 消息服务 |

**请求参数**：

| 参数 | 类型 | 是否必填 | 说明 |
|------|------|----------|------|
| `templateCode` | `string` | 是 | 模板编码 |
| `receiverIds` | `long[]` | 是 | 接收人ID数组 |
| `channel` | `int` | 否 | 推送渠道（默认使用模板配置） |
| `variables` | `object` | 否 | 模板变量值 |
| `bizType` | `string` | 否 | 业务类型 |
| `bizId` | `long` | 否 | 业务ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "发送成功",
  "data": {
    "totalCount": 5,
    "successCount": 5,
    "failCount": 0
  },
  "timestamp": 1720792397000
}
```

---

## 附录：错误码总表

| code | HTTP Status | 说明 |
|------|-------------|------|
| 200 | 200 | 成功 |
| 400 | 400 | 参数错误 |
| 401 | 401 | 未认证/Token过期 |
| 403 | 403 | 无权限 |
| 404 | 404 | 资源不存在 |
| 409 | 409 | 资源冲突（如重复创建） |
| 422 | 422 | 业务校验失败 |
| 429 | 429 | 请求过于频繁 |
| 500 | 500 | 服务器内部错误 |
| 503 | 503 | 服务不可用 |

| 业务错误码 | 说明 |
|------------|------|
| 10001 | 用户名或密码错误 |
| 10002 | 账号已禁用 |
| 10003 | 验证码错误 |
| 10004 | Token已过期 |
| 20001 | 商品不存在或已下架 |
| 20002 | 库存不足 |
| 20003 | 不在授权范围内 |
| 30001 | 活动未开始或已结束 |
| 30002 | 积分不足 |
| 30003 | 兑换库存不足 |
| 40001 | 订单状态不允许此操作 |
| 40002 | 售后申请超时 |
| 50001 | 余额不足 |
| 50002 | 提现金额超出可提现额度 |
| 60001 | 仓库不存在 |
| 60002 | 库存锁定失败 |

---

> **文档结束** — 共计 17 个模块、80+ 核心API接口，覆盖 8 大微服务。
