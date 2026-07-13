// 角色权限配置 - 角色对应的菜单权限
export const roles = [
  { key: 'admin', name: '平台管理员', desc: '拥有全部功能权限' },
  { key: 'boss', name: '租户老板', desc: '拥有全部业务管理权限，含数据看板' },
  { key: 'finance', name: '财务', desc: '财务结算、资金流水、对账、账期' },
  { key: 'warehouse', name: '仓管', desc: '仓储库存、出入库管理' },
  { key: 'salesman', name: '业务员', desc: '业务员档案、客户分配、提成查看' },
  { key: 'customer', name: '客户', desc: '商品浏览、订单查看' },
]

// 各角色的菜单权限路径
export const roleMenuMap = {
  admin: [
    'dashboard',
    'products.sku', 'products.category', 'products.brand', 'products.subscription',
    'videos.list', 'videos.audit', 'videos.comments', 'videos.stats',
    'marketing.activities', 'marketing.approval', 'marketing.points-shop', 'marketing.points-rules',
    'orders.list', 'orders.after-sales',
    'finance.flow', 'finance.reconciliation', 'finance.withdrawal', 'finance.credit',
    'salesmen.list', 'salesmen.commission', 'salesmen.assignment', 'salesmen.dashboard',
    'inventory.list', 'inventory.records',
    'system.qualification', 'system.permission', 'system.message-template', 'system.api-config', 'system.params', 'system.decoration',
    'authorization.list', 'authorization.log',
  ],
  boss: [
    'dashboard',
    'products.sku', 'products.category', 'products.brand', 'products.subscription',
    'videos.list', 'videos.audit', 'videos.comments', 'videos.stats',
    'marketing.activities', 'marketing.approval', 'marketing.points-shop', 'marketing.points-rules',
    'orders.list', 'orders.after-sales',
    'finance.flow', 'finance.reconciliation', 'finance.withdrawal', 'finance.credit',
    'salesmen.list', 'salesmen.commission', 'salesmen.assignment', 'salesmen.dashboard',
    'inventory.list', 'inventory.records',
    'system.qualification', 'system.message-template', 'system.params', 'system.decoration',
    'authorization.list', 'authorization.log',
  ],
  finance: [
    'dashboard',
    'orders.list',
    'finance.flow', 'finance.reconciliation', 'finance.withdrawal', 'finance.credit',
  ],
  warehouse: [
    'dashboard',
    'products.sku',
    'inventory.list', 'inventory.records',
    'orders.list',
  ],
  salesman: [
    'dashboard',
    'salesmen.list', 'salesmen.assignment',
    'orders.list',
    'products.sku',
  ],
  customer: [
    'dashboard',
    'products.sku',
    'orders.list',
  ],
}

// 角色权限矩阵 - 用于权限管理页面展示
export const permissionMatrix = [
  {
    module: '工作台',
    permissions: [
      { key: 'dashboard:view', name: '查看仪表盘', roles: ['admin', 'boss', 'finance', 'warehouse', 'salesman', 'customer'] },
    ],
  },
  {
    module: '商品管理',
    permissions: [
      { key: 'products:sku:view', name: '查看药品列表', roles: ['admin', 'boss', 'warehouse', 'salesman', 'customer'] },
      { key: 'products:sku:edit', name: '新增/编辑药品', roles: ['admin', 'boss'] },
      { key: 'products:sku:shelf', name: '上下架操作', roles: ['admin', 'boss'] },
      { key: 'products:category:manage', name: '分类管理', roles: ['admin', 'boss'] },
      { key: 'products:brand:manage', name: '品牌管理', roles: ['admin', 'boss'] },
      { key: 'products:subscription:view', name: '查看缺货订阅', roles: ['admin', 'boss'] },
    ],
  },
  {
    module: '短视频中心',
    permissions: [
      { key: 'videos:list:view', name: '查看视频列表', roles: ['admin', 'boss'] },
      { key: 'videos:upload', name: '上传视频', roles: ['admin', 'boss'] },
      { key: 'videos:audit', name: '视频审核', roles: ['admin', 'boss'] },
      { key: 'videos:comment:manage', name: '评论管理', roles: ['admin', 'boss'] },
      { key: 'videos:stats:view', name: '数据统计', roles: ['admin', 'boss'] },
    ],
  },
  {
    module: '营销中心',
    permissions: [
      { key: 'marketing:activities:manage', name: '活动管理', roles: ['admin', 'boss'] },
      { key: 'marketing:approval', name: '定向优惠审批', roles: ['admin', 'boss'] },
      { key: 'marketing:points:manage', name: '积分商城管理', roles: ['admin', 'boss'] },
      { key: 'marketing:points:rules', name: '积分规则配置', roles: ['admin', 'boss'] },
    ],
  },
  {
    module: '订单管理',
    permissions: [
      { key: 'orders:view', name: '查看订单', roles: ['admin', 'boss', 'finance', 'warehouse', 'salesman', 'customer'] },
      { key: 'orders:after-sales', name: '售后处理', roles: ['admin', 'boss', 'finance'] },
    ],
  },
  {
    module: '财务结算',
    permissions: [
      { key: 'finance:flow:view', name: '资金流水', roles: ['admin', 'boss', 'finance'] },
      { key: 'finance:reconciliation', name: '对公对账', roles: ['admin', 'boss', 'finance'] },
      { key: 'finance:withdrawal:audit', name: '提现审核', roles: ['admin', 'boss', 'finance'] },
      { key: 'finance:credit:manage', name: '账期管理', roles: ['admin', 'boss', 'finance'] },
    ],
  },
  {
    module: '业务员管理',
    permissions: [
      { key: 'salesmen:list:view', name: '查看业务员', roles: ['admin', 'boss', 'salesman'] },
      { key: 'salesmen:commission:manage', name: '提成规则配置', roles: ['admin', 'boss'] },
      { key: 'salesmen:assignment', name: '客户分配', roles: ['admin', 'boss', 'salesman'] },
      { key: 'salesmen:dashboard', name: '数据看板', roles: ['admin', 'boss'] },
    ],
  },
  {
    module: '仓储库存',
    permissions: [
      { key: 'inventory:list:view', name: '库存查看', roles: ['admin', 'boss', 'warehouse'] },
      { key: 'inventory:records:view', name: '出入库记录', roles: ['admin', 'boss', 'warehouse'] },
    ],
  },
  {
    module: '系统配置',
    permissions: [
      { key: 'system:qualification', name: '企业资质', roles: ['admin', 'boss'] },
      { key: 'system:permission', name: '权限管理', roles: ['admin'] },
      { key: 'system:message-template', name: '消息模板', roles: ['admin', 'boss'] },
      { key: 'system:api-config', name: '第三方接口', roles: ['admin'] },
      { key: 'system:params', name: '全局参数', roles: ['admin', 'boss'] },
      { key: 'system:decoration', name: '商城装修', roles: ['admin', 'boss'] },
    ],
  },
  {
    module: '药品流向授权',
    permissions: [
      { key: 'authorization:list:view', name: '查看授权', roles: ['admin', 'boss'] },
      { key: 'authorization:manage', name: '新增/编辑授权', roles: ['admin', 'boss'] },
      { key: 'authorization:log:view', name: '授权日志', roles: ['admin'] },
    ],
  },
]
