<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <img :src="favicon" alt="logo" />
        <span v-show="!isCollapsed" class="logo-text">医药B2B管理后台</span>
      </div>
      <el-scrollbar class="menu-scroll">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :collapse-transition="false"
          background-color="#1E293B"
          text-color="#94A3B8"
          active-text-color="#FFFFFF"
          unique-opened
          router
        >
          <template v-for="route in filteredRoutes" :key="route.path">
            <!-- 单子菜单 -->
            <el-menu-item v-if="route.children && route.children.length === 1 && !route.meta" :index="route.path + '/' + route.children[0].path">
              <el-icon><component :is="route.children[0].meta?.icon" /></el-icon>
              <template #title>{{ route.children[0].meta?.title }}</template>
            </el-menu-item>
            <!-- 多子菜单 -->
            <el-sub-menu v-else-if="route.children && route.children.length > 1" :index="route.path">
              <template #title>
                <el-icon><component :is="route.meta?.icon" /></el-icon>
                <span>{{ route.meta?.title }}</span>
              </template>
              <el-menu-item
                v-for="child in route.children"
                :key="child.path"
                :index="route.path + '/' + child.path"
              >
                <el-icon><component :is="child.meta?.icon" /></el-icon>
                <template #title>{{ child.meta?.title }}</template>
              </el-menu-item>
            </el-sub-menu>
            <!-- 单独路由 -->
            <el-menu-item v-else :index="route.path">
              <el-icon><component :is="route.meta?.icon || route.children?.[0]?.meta?.icon" /></el-icon>
              <template #title>{{ route.meta?.title || route.children?.[0]?.meta?.title }}</template>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 右侧主区域 -->
    <div class="main-area">
      <!-- 顶部栏 -->
      <div class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">{{ item.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 全局消息通知 -->
          <el-badge :value="23" :max="99" class="notification-badge">
            <el-icon class="header-icon" @click="showNotifications = true"><Bell /></el-icon>
          </el-badge>
          <!-- 角色切换 -->
          <el-select v-model="currentRole" placeholder="切换角色" size="small" style="width: 140px" @change="handleRoleChange">
            <el-option label="平台管理员" value="admin" />
            <el-option label="租户老板" value="boss" />
            <el-option label="财务" value="finance" />
            <el-option label="仓管" value="warehouse" />
            <el-option label="业务员" value="salesman" />
            <el-option label="客户" value="customer" />
          </el-select>
          <!-- 用户头像 -->
          <el-dropdown>
            <div class="user-info">
              <el-avatar :size="32" class="user-avatar">{{ userInfo.name.charAt(0) }}</el-avatar>
              <div class="user-detail">
                <div class="user-name">{{ userInfo.name }}</div>
                <div class="user-role">{{ userInfo.roleName }}</div>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <!-- 消息通知抽屉 -->
    <el-drawer v-model="showNotifications" title="消息通知" size="420px" direction="rtl">
      <div class="notification-list">
        <div v-for="item in todoItems" :key="item.id" class="notification-item">
          <div class="notif-icon" :class="item.priority">
            <el-icon><Warning v-if="item.priority === 'urgent'" /><CircleCheck v-else-if="item.priority === 'high'" /><InfoFilled v-else /></el-icon>
          </div>
          <div class="notif-content">
            <div class="notif-title">{{ item.title }}</div>
            <div class="notif-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { dashboardData } from '@/mock/mockDashboard'
import { roleMenuMap } from '@/mock/mockPermissions'
import favicon from '@/assets/favicon.svg'

const route = useRoute()
const userStore = useUserStore()
const isCollapsed = ref(false)
const showNotifications = ref(false)
const currentRole = ref(userStore.currentRole)
const userInfo = computed(() => userStore.userInfo)
const todoItems = dashboardData.todoItems

const activeMenu = computed(() => route.path)

const breadcrumbItems = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({ path: item.path, title: item.meta.title }))
})

// 根据角色权限过滤路由
const allRoutes = computed(() => {
  const router = require('@/router')
  return router.default.options.routes
})

// 简单的路由过滤逻辑 - 根据角色菜单权限
const filteredRoutes = computed(() => {
  // 所有路由（排除login）
  const routes = [
    { path: '/dashboard', children: [{ path: 'dashboard', meta: { title: '工作台', icon: 'Odometer' } }], meta: { title: '工作台', icon: 'Odometer' } },
    { path: '/products', meta: { title: '商品管理', icon: 'Goods' }, children: [
      { path: 'sku', meta: { title: '药品SKU管理', icon: 'Box' } },
      { path: 'category', meta: { title: '商品分类', icon: 'Files' } },
      { path: 'brand', meta: { title: '品牌管理', icon: 'Collection' } },
      { path: 'subscription', meta: { title: '缺货订阅', icon: 'BellFilled' } },
    ]},
    { path: '/videos', meta: { title: '短视频中心', icon: 'VideoCamera' }, children: [
      { path: 'list', meta: { title: '视频管理', icon: 'VideoPlay' } },
      { path: 'audit', meta: { title: '视频审核', icon: 'CircleCheck' } },
      { path: 'comments', meta: { title: '评论管理', icon: 'ChatDotRound' } },
      { path: 'stats', meta: { title: '数据统计', icon: 'DataLine' } },
    ]},
    { path: '/marketing', meta: { title: '营销中心', icon: 'Present' }, children: [
      { path: 'activities', meta: { title: '促销活动管理', icon: 'Discount' } },
      { path: 'approval', meta: { title: '定向优惠审批', icon: 'Stamp' } },
      { path: 'points-shop', meta: { title: '积分商城管理', icon: 'ShoppingCartFull' } },
      { path: 'points-rules', meta: { title: '积分规则配置', icon: 'SetUp' } },
    ]},
    { path: '/orders', meta: { title: '订单管理', icon: 'List' }, children: [
      { path: 'list', meta: { title: '订单总览', icon: 'Document' } },
      { path: 'after-sales', meta: { title: '售后处理', icon: 'RefreshLeft' } },
    ]},
    { path: '/finance', meta: { title: '财务结算', icon: 'Money' }, children: [
      { path: 'flow', meta: { title: '资金流水', icon: 'Wallet' } },
      { path: 'reconciliation', meta: { title: '对公对账', icon: 'ScaleToOriginal' } },
      { path: 'withdrawal', meta: { title: '业务员提现审核', icon: 'CreditCard' } },
      { path: 'credit', meta: { title: '账期管理', icon: 'Calendar' } },
    ]},
    { path: '/salesmen', meta: { title: '业务员管理', icon: 'UserFilled' }, children: [
      { path: 'list', meta: { title: '业务员档案', icon: 'Avatar' } },
      { path: 'commission', meta: { title: '提成规则', icon: 'Coin' } },
      { path: 'assignment', meta: { title: '客户分配', icon: 'Connection' } },
      { path: 'dashboard', meta: { title: '数据看板', icon: 'DataAnalysis' } },
    ]},
    { path: '/inventory', meta: { title: '仓储库存', icon: 'Box' }, children: [
      { path: 'list', meta: { title: '库存总览', icon: 'Files' } },
      { path: 'records', meta: { title: '出入库记录', icon: 'Switch' } },
    ]},
    { path: '/system', meta: { title: '系统配置', icon: 'Setting' }, children: [
      { path: 'qualification', meta: { title: '企业资质', icon: 'OfficeBuilding' } },
      { path: 'permission', meta: { title: '权限管理', icon: 'Lock' } },
      { path: 'message-template', meta: { title: '消息模板', icon: 'Message' } },
      { path: 'api-config', meta: { title: '第三方接口', icon: 'Link' } },
      { path: 'params', meta: { title: '全局参数', icon: 'Tools' } },
      { path: 'decoration', meta: { title: '商城装修', icon: 'Brush' } },
    ]},
    { path: '/authorization', meta: { title: '药品流向授权', icon: 'Promotion' }, children: [
      { path: 'list', meta: { title: '授权列表', icon: 'Document' } },
      { path: 'log', meta: { title: '授权日志', icon: 'Notebook' } },
    ]},
  ]

  const allowedMenus = roleMenuMap[userStore.currentRole] || []
  
  return routes.filter(routeItem => {
    if (!routeItem.children || routeItem.children.length === 0) return false
    // 单子菜单
    if (routeItem.children.length === 1 && routeItem.path !== '/') {
      const menuKey = `${routeItem.path.replace('/', '')}.${routeItem.children[0].path}`
      const rootMenuKey = `${routeItem.path.replace('/', '')}`
      return allowedMenus.includes(menuKey) || allowedMenus.includes(`${rootMenuKey}`)
    }
    // 多子菜单 - 过滤子项
    routeItem.children = routeItem.children.filter(child => {
      const menuKey = `${routeItem.path.replace('/', '')}.${child.path}`
      return allowedMenus.includes(menuKey)
    })
    return routeItem.children.length > 0
  })
})

const handleRoleChange = (val) => {
  userStore.setRole(val)
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: #1E293B;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  flex-shrink: 0;

  &.collapsed {
    width: 64px;
  }

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

    img {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }

    .logo-text {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  .menu-scroll {
    flex: 1;
    overflow: hidden;

    :deep(.el-menu) {
      border-right: none;
    }

    :deep(.el-sub-menu__title:hover),
    :deep(.el-menu-item:hover) {
      background-color: rgba(37, 99, 235, 0.15) !important;
    }

    :deep(.el-menu-item.is-active) {
      background-color: #2563EB !important;
    }
  }
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      color: #64748B;
      transition: color 0.2s;

      &:hover {
        color: #2563EB;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .header-icon {
      font-size: 20px;
      cursor: pointer;
      color: #64748B;
      transition: color 0.2s;

      &:hover {
        color: #2563EB;
      }
    }

    .notification-badge {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      .user-avatar {
        background: #2563EB;
        color: #fff;
        font-size: 14px;
      }

      .user-detail {
        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: #1F2937;
        }

        .user-role {
          font-size: 12px;
          color: #94A3B8;
        }
      }
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #F9FAFB;
}

.notification-list {
  .notification-item {
    display: flex;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #F3F4F6;

    .notif-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;

      &.urgent {
        background: #FEE2E2;
        color: #EF4444;
      }
      &.high {
        background: #FEF3C7;
        color: #F59E0B;
      }
      &.medium {
        background: #DBEAFE;
        color: #2563EB;
      }
    }

    .notif-content {
      .notif-title {
        font-size: 14px;
        color: #1F2937;
        margin-bottom: 4px;
      }

      .notif-time {
        font-size: 12px;
        color: #9CA3AF;
      }
    }
  }
}
</style>
