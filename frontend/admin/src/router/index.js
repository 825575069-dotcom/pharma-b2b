import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
    ],
  },
  {
    path: '/products',
    component: Layout,
    redirect: '/products/sku',
    meta: { title: '商品管理', icon: 'Goods' },
    children: [
      {
        path: 'sku',
        name: 'ProductSKU',
        component: () => import('@/views/products/sku.vue'),
        meta: { title: '药品SKU管理', icon: 'Box' },
      },
      {
        path: 'category',
        name: 'ProductCategory',
        component: () => import('@/views/products/category.vue'),
        meta: { title: '商品分类', icon: 'Files' },
      },
      {
        path: 'brand',
        name: 'ProductBrand',
        component: () => import('@/views/products/brand.vue'),
        meta: { title: '品牌管理', icon: 'Collection' },
      },
      {
        path: 'subscription',
        name: 'ProductSubscription',
        component: () => import('@/views/products/subscription.vue'),
        meta: { title: '缺货订阅', icon: 'BellFilled' },
      },
    ],
  },
  {
    path: '/videos',
    component: Layout,
    redirect: '/videos/list',
    meta: { title: '短视频中心', icon: 'VideoCamera' },
    children: [
      {
        path: 'list',
        name: 'VideoList',
        component: () => import('@/views/videos/list.vue'),
        meta: { title: '视频管理', icon: 'VideoPlay' },
      },
      {
        path: 'audit',
        name: 'VideoAudit',
        component: () => import('@/views/videos/audit.vue'),
        meta: { title: '视频审核', icon: 'CircleCheck' },
      },
      {
        path: 'comments',
        name: 'VideoComments',
        component: () => import('@/views/videos/comments.vue'),
        meta: { title: '评论管理', icon: 'ChatDotRound' },
      },
      {
        path: 'stats',
        name: 'VideoStats',
        component: () => import('@/views/videos/stats.vue'),
        meta: { title: '数据统计', icon: 'DataLine' },
      },
    ],
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/activities',
    meta: { title: '营销中心', icon: 'Present' },
    children: [
      {
        path: 'activities',
        name: 'MarketingActivities',
        component: () => import('@/views/marketing/activities.vue'),
        meta: { title: '促销活动管理', icon: 'Discount' },
      },
      {
        path: 'approval',
        name: 'MarketingApproval',
        component: () => import('@/views/marketing/approval.vue'),
        meta: { title: '定向优惠审批', icon: 'Stamp' },
      },
      {
        path: 'points-shop',
        name: 'PointsShop',
        component: () => import('@/views/marketing/pointsShop.vue'),
        meta: { title: '积分商城管理', icon: 'ShoppingCartFull' },
      },
      {
        path: 'points-rules',
        name: 'PointsRules',
        component: () => import('@/views/marketing/pointsRules.vue'),
        meta: { title: '积分规则配置', icon: 'SetUp' },
      },
    ],
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/list',
    meta: { title: '订单管理', icon: 'List' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/orders/list.vue'),
        meta: { title: '订单总览', icon: 'Document' },
      },
      {
        path: 'after-sales',
        name: 'OrderAfterSales',
        component: () => import('@/views/orders/afterSales.vue'),
        meta: { title: '售后处理', icon: 'RefreshLeft' },
      },
    ],
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/flow',
    meta: { title: '财务结算', icon: 'Money' },
    children: [
      {
        path: 'flow',
        name: 'FinanceFlow',
        component: () => import('@/views/finance/flow.vue'),
        meta: { title: '资金流水', icon: 'Wallet' },
      },
      {
        path: 'reconciliation',
        name: 'FinanceReconciliation',
        component: () => import('@/views/finance/reconciliation.vue'),
        meta: { title: '对公对账', icon: 'ScaleToOriginal' },
      },
      {
        path: 'withdrawal',
        name: 'FinanceWithdrawal',
        component: () => import('@/views/finance/withdrawal.vue'),
        meta: { title: '业务员提现审核', icon: 'CreditCard' },
      },
      {
        path: 'credit',
        name: 'FinanceCredit',
        component: () => import('@/views/finance/credit.vue'),
        meta: { title: '账期管理', icon: 'Calendar' },
      },
    ],
  },
  {
    path: '/salesmen',
    component: Layout,
    redirect: '/salesmen/list',
    meta: { title: '业务员管理', icon: 'UserFilled' },
    children: [
      {
        path: 'list',
        name: 'SalesmanList',
        component: () => import('@/views/salesmen/list.vue'),
        meta: { title: '业务员档案', icon: 'Avatar' },
      },
      {
        path: 'commission',
        name: 'SalesmanCommission',
        component: () => import('@/views/salesmen/commission.vue'),
        meta: { title: '提成规则', icon: 'Coin' },
      },
      {
        path: 'assignment',
        name: 'SalesmanAssignment',
        component: () => import('@/views/salesmen/assignment.vue'),
        meta: { title: '客户分配', icon: 'Connection' },
      },
      {
        path: 'dashboard',
        name: 'SalesmanDashboard',
        component: () => import('@/views/salesmen/dashboard.vue'),
        meta: { title: '数据看板', icon: 'DataAnalysis' },
      },
    ],
  },
  {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/list',
    meta: { title: '仓储库存', icon: 'Box' },
    children: [
      {
        path: 'list',
        name: 'InventoryList',
        component: () => import('@/views/inventory/list.vue'),
        meta: { title: '库存总览', icon: 'Files' },
      },
      {
        path: 'records',
        name: 'InventoryRecords',
        component: () => import('@/views/inventory/records.vue'),
        meta: { title: '出入库记录', icon: 'Switch' },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/qualification',
    meta: { title: '系统配置', icon: 'Setting' },
    children: [
      {
        path: 'qualification',
        name: 'SystemQualification',
        component: () => import('@/views/system/qualification.vue'),
        meta: { title: '企业资质', icon: 'OfficeBuilding' },
      },
      {
        path: 'permission',
        name: 'SystemPermission',
        component: () => import('@/views/system/permission.vue'),
        meta: { title: '权限管理', icon: 'Lock' },
      },
      {
        path: 'message-template',
        name: 'SystemMessageTemplate',
        component: () => import('@/views/system/messageTemplate.vue'),
        meta: { title: '消息模板', icon: 'Message' },
      },
      {
        path: 'api-config',
        name: 'SystemApiConfig',
        component: () => import('@/views/system/apiConfig.vue'),
        meta: { title: '第三方接口', icon: 'Link' },
      },
      {
        path: 'params',
        name: 'SystemParams',
        component: () => import('@/views/system/params.vue'),
        meta: { title: '全局参数', icon: 'Tools' },
      },
      {
        path: 'decoration',
        name: 'SystemDecoration',
        component: () => import('@/views/system/decoration.vue'),
        meta: { title: '商城装修', icon: 'Brush' },
      },
    ],
  },
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/list',
    meta: { title: '药品流向授权', icon: 'Promotion' },
    children: [
      {
        path: 'list',
        name: 'AuthorizationList',
        component: () => import('@/views/authorization/list.vue'),
        meta: { title: '授权列表', icon: 'Document' },
      },
      {
        path: 'log',
        name: 'AuthorizationLog',
        component: () => import('@/views/authorization/log.vue'),
        meta: { title: '授权日志', icon: 'Notebook' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
