<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-inner">
        <!-- Logo -->
        <div class="logo" @click="router.push('/')">
          <el-icon :size="24" color="#2563EB"><FirstAidKit /></el-icon>
          <span class="logo-text">医药B2B私域采购商城</span>
        </div>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索药品名称、厂家、批准文号..."
            :prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <!-- 消息通知 -->
          <div class="action-item" @click="globalStore.openMessageDrawer()">
            <el-badge :value="userStore.unreadCount" :hidden="userStore.unreadCount === 0" :max="99">
              <el-icon :size="20"><Bell /></el-icon>
            </el-badge>
          </div>

          <!-- 购物车 -->
          <div class="action-item" @click="cartStore.toggleDrawer(true)">
            <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" :max="99">
              <el-icon :size="20"><ShoppingCart /></el-icon>
            </el-badge>
            <span class="action-label">购物车</span>
          </div>

          <!-- 个人中心 / 登录入口（随登录态切换） -->
          <div v-if="userStore.isLoggedIn" class="action-item user-action" @click="globalStore.openUserCenter()">
            <div class="user-avatar">
              <img :src="userStore.userInfo.avatar" alt="" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ userStore.userInfo.name }}</div>
              <div class="user-level">{{ userStore.userInfo.level }}</div>
            </div>
          </div>
          <el-button v-else type="primary" size="small" class="login-entry-btn" @click="userStore.goLogin()">
            登录 / 注册
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 全局弹窗组件 -->
    <ProductDrawer />
    <VideoDialog />
    <CartDrawer />
    <CheckoutDialog />
    <UserCenterDrawer />
    <PointsMallDialog />
    <MessageDrawer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Bell, ShoppingCart, User, FirstAidKit } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import ProductDrawer from '@/components/ProductDrawer.vue'
import VideoDialog from '@/components/VideoDialog.vue'
import CartDrawer from '@/components/CartDrawer.vue'
import CheckoutDialog from '@/components/CheckoutDialog.vue'
import UserCenterDrawer from '@/components/UserCenterDrawer.vue'
import PointsMallDialog from '@/components/PointsMallDialog.vue'
import MessageDrawer from '@/components/MessageDrawer.vue'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const cartStore = useCartStore()

const searchKeyword = ref('')

const handleSearch = () => {
  globalStore.setSearchKeyword(searchKeyword.value)
  router.push({ path: '/category', query: { keyword: searchKeyword.value } })
}
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  background: #F3F4F6;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .header-inner {
    max-width: 1280px;
    margin: 0 auto;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 24px;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;

  .logo-text {
    font-size: 18px;
    font-weight: 600;
    color: #1F2937;
    white-space: nowrap;
  }
}

.search-box {
  flex: 1;
  max-width: 500px;
  display: flex;
  gap: 8px;

  :deep(.el-input__wrapper) {
    border-radius: 6px;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #4B5563;
  transition: color 0.2s;

  &:hover {
    color: #2563EB;
  }

  .action-label {
    font-size: 13px;
  }
}

.login-entry-btn {
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
}

.user-action {
  gap: 8px;

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #DBEAFE;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563EB;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .user-info {
    line-height: 1.2;

    .user-name {
      font-size: 13px;
      font-weight: 500;
      color: #1F2937;
    }

    .user-level {
      font-size: 11px;
      color: #9CA3AF;
    }
  }
}

.main-content {
  min-height: calc(100vh - 64px);
}
</style>
