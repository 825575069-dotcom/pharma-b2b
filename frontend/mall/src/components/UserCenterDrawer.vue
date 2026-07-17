<template>
  <el-drawer
    v-model="visible"
    title=""
    direction="rtl"
    size="640px"
    :show-close="false"
    :with-header="false"
    class="user-center-drawer"
  >
    <div class="uc-content">
      <!-- 顶部用户信息 -->
      <div class="uc-header">
        <div class="uc-close" @click="visible = false">
          <el-icon :size="18"><Close /></el-icon>
        </div>
        <div class="uc-user">
          <div class="uc-avatar">
            <img :src="userStore.userInfo.avatar" alt="" />
          </div>
          <div class="uc-user-info">
            <div class="uc-name">{{ userStore.userInfo.name }}</div>
            <div class="uc-company">{{ userStore.userInfo.company }}</div>
            <div class="uc-meta">
              <el-tag size="small" type="warning" effect="plain">{{ userStore.userInfo.level }}</el-tag>
              <span class="uc-phone">{{ userStore.userInfo.phone }}</span>
            </div>
          </div>
        </div>
        <div class="uc-stats">
          <div class="uc-stat" @click="goToPoints">
            <div class="stat-num">{{ userStore.availablePoints }}</div>
            <div class="stat-label">可用积分</div>
          </div>
          <div class="uc-stat" @click="activeTab = 'orders'">
            <div class="stat-num">{{ mockOrders.length }}</div>
            <div class="stat-label">全部订单</div>
          </div>
          <div class="uc-stat" @click="activeTab = 'collection'">
            <div class="stat-num">{{ userStore.collectedProductIds.length }}</div>
            <div class="stat-label">收藏</div>
          </div>
        </div>
      </div>

      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" class="uc-tabs">
        <!-- 消息通知 -->
        <el-tab-pane label="消息通知" name="messages">
          <div class="tab-content">
            <div class="tab-header">
              <span class="tab-title">{{ unreadMessages.length }}条未读消息</span>
              <el-button text type="primary" size="small" @click="userStore.readAllMessages()">全部已读</el-button>
            </div>
            <div class="message-list">
              <div
                v-for="msg in userStore.messages"
                :key="msg.id"
                class="message-item"
                :class="{ unread: !msg.read }"
                @click="userStore.readMessage(msg.id)"
              >
                <div class="msg-icon" :style="{ background: msg.typeColor + '20', color: msg.typeColor }">
                  <el-icon :size="16"><component :is="msg.icon" /></el-icon>
                </div>
                <div class="msg-body">
                  <div class="msg-title-row">
                    <span class="msg-title">{{ msg.title }}</span>
                    <el-tag v-if="msg.urgent && !msg.read" type="danger" size="small">紧急</el-tag>
                  </div>
                  <div class="msg-content">{{ msg.content }}</div>
                  <div class="msg-time">{{ msg.time }}</div>
                </div>
                <div v-if="!msg.read" class="msg-dot"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 我的订单 -->
        <el-tab-pane label="我的订单" name="orders">
          <div class="tab-content">
            <div class="tab-header">
              <el-radio-group v-model="orderType" size="small">
                <el-radio-button label="采购订单">采购订单</el-radio-button>
                <el-radio-button label="积分兑换">积分兑换</el-radio-button>
              </el-radio-group>
            </div>
            <div class="order-status-filter">
              <span
                v-for="s in orderStatuses"
                :key="s"
                class="status-filter-tag"
                :class="{ active: selectedOrderStatus === s }"
                @click="selectedOrderStatus = s"
              >{{ s }}</span>
            </div>
            <div class="order-list">
              <div v-for="order in filteredOrders" :key="order.id" class="order-card">
                <div class="order-header">
                  <span class="order-id">{{ order.id }}</span>
                  <span class="order-status" :style="{ color: order.statusColor }">{{ order.status }}</span>
                </div>
                <div class="order-items-mini">
                  <div v-for="item in order.items" :key="item.productId" class="oim-item">
                    <div class="oim-img">
                      <img :src="item.image" alt="" />
                    </div>
                    <div class="oim-info">
                      <div class="oim-name text-ellipsis">{{ item.name }}</div>
                      <div class="oim-spec">{{ item.spec }} x{{ item.quantity }}</div>
                    </div>
                  </div>
                </div>
                <div class="order-footer">
                  <div class="order-time">{{ order.createTime }}</div>
                  <div class="order-total">
                    <template v-if="order.type === '积分兑换'">
                      消耗{{ order.pointsUsed }}积分
                    </template>
                    <template v-else>
                      实付 <span v-if="userStore.isLoggedIn" class="order-price">¥{{ order.totalPrice.toFixed(2) }}</span>
                      <span v-else class="order-price price-mask" @click="userStore.goLogin()">登录后查看</span>
                    </template>
                  </div>
                  <el-button
                    v-if="order.logistics"
                    size="small"
                    text
                    type="primary"
                    @click="showLogistics(order)"
                  >
                    查看物流
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 我的积分 -->
        <el-tab-pane label="我的积分" name="points">
          <div class="tab-content">
            <div class="points-summary">
              <div class="ps-main">
                <div class="ps-label">可用积分</div>
                <div class="ps-value">{{ userStore.availablePoints }}</div>
              </div>
              <div class="ps-side">
                <div class="ps-row">
                  <span>本年获得</span>
                  <span class="ps-num">{{ mockPoints.yearEarned }}</span>
                </div>
                <div class="ps-row">
                  <span>本年消耗</span>
                  <span class="ps-num">{{ mockPoints.yearUsed }}</span>
                </div>
                <div class="ps-row">
                  <span>即将过期</span>
                  <span class="ps-num warn">{{ userStore.userInfo.pointsExpiring }}</span>
                </div>
              </div>
            </div>
            <el-button type="primary" round @click="globalStore.openPointsMall()" style="margin-bottom: 16px;">
              进入积分商城
            </el-button>
            <div class="points-history">
              <div class="ph-title">积分收支明细</div>
              <div class="ph-list">
                <div v-for="pt in mockPoints.history.slice(0, 15)" :key="pt.id" class="ph-item">
                  <div class="ph-icon" :style="{ background: pt.amount > 0 ? '#D1FAE5' : '#FEE2E2', color: pt.amount > 0 ? '#10B981' : '#EF4444' }">
                    <el-icon :size="14">
                      <Top v-if="pt.amount > 0" />
                      <Bottom v-else />
                    </el-icon>
                  </div>
                  <div class="ph-info">
                    <div class="ph-desc">{{ pt.description }}</div>
                    <div class="ph-meta">
                      <span>{{ pt.source }}</span>
                      <span class="divider">·</span>
                      <span>{{ pt.time }}</span>
                    </div>
                  </div>
                  <div class="ph-amount" :class="{ positive: pt.amount > 0, negative: pt.amount < 0 }">
                    {{ pt.amount > 0 ? '+' : '' }}{{ pt.amount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 我的收藏 -->
        <el-tab-pane label="我的收藏" name="collection">
          <div class="tab-content">
            <div v-if="collectedProducts.length > 0" class="collection-grid">
              <div
                v-for="product in collectedProducts"
                :key="product.id"
                class="collection-card"
                @click="globalStore.openProductDrawer(product.id)"
              >
                <div class="col-img">
                  <img :src="product.image" alt="" />
                </div>
                <div class="col-info">
                  <div class="col-name text-ellipsis">{{ product.name }}</div>
                  <div v-if="userStore.isLoggedIn" class="col-price">¥{{ product.price.toFixed(2) }}</div>
                  <div v-else class="col-price price-mask" @click="userStore.goLogin()">登录后查看</div>
                </div>
                <el-icon class="col-star" color="#F59E0B" @click.stop="userStore.toggleCollect(product.id)"><StarFilled /></el-icon>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><Star /></el-icon>
              <div class="empty-text">还没有收藏任何商品</div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 历史浏览短视频 -->
        <el-tab-pane label="浏览视频" name="videos">
          <div class="tab-content">
            <div v-if="browsedVideos.length > 0" class="video-history-list">
              <div
                v-for="v in browsedVideos"
                :key="v.id"
                class="vh-card"
                @click="globalStore.openVideoDialog(v.id)"
              >
                <div class="vh-cover">
                  <img :src="v.cover" alt="" />
                </div>
                <div class="vh-info">
                  <div class="vh-title text-ellipsis-2">{{ v.title }}</div>
                  <div class="vh-meta">
                    <span>{{ v.category }}</span>
                    <span class="divider">·</span>
                    <span>{{ formatViews(v.views) }}次播放</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><VideoPlay /></el-icon>
              <div class="empty-text">还没有观看记录</div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 缺货订阅 -->
        <el-tab-pane label="缺货订阅" name="subscription">
          <div class="tab-content">
            <div v-if="userStore.stockSubscription.filter(s => s.subscribed).length > 0" class="sub-list">
              <div
                v-for="sub in userStore.stockSubscription.filter(s => s.subscribed)"
                :key="sub.productId"
                class="sub-card"
              >
                <div class="sub-info">
                  <div class="sub-name">{{ sub.productName }}</div>
                  <div class="sub-spec">{{ sub.spec }}</div>
                  <div class="sub-time">订阅时间：{{ sub.time }}</div>
                </div>
                <el-button size="small" text type="danger" @click="userStore.toggleStockSubscription(sub.productId, sub.productName, sub.spec)">
                  取消订阅
                </el-button>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><Bell /></el-icon>
              <div class="empty-text">还没有订阅缺货商品</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 物流轨迹弹窗 -->
    <el-dialog
      v-model="logisticsVisible"
      title="物流轨迹"
      width="440px"
      append-to-body
      class="logistics-dialog"
    >
      <div v-if="currentOrder" class="logistics-content">
        <div class="lg-info">
          <div class="lg-company">{{ currentOrder.logistics.company }}</div>
          <div class="lg-no">运单号：{{ currentOrder.logistics.trackingNo }}</div>
        </div>
        <el-timeline class="lg-timeline">
          <el-timeline-item
            v-for="(trace, idx) in [...currentOrder.logistics.traces].reverse()"
            :key="idx"
            :timestamp="trace.time"
            :type="idx === 0 ? 'primary' : 'info'"
          >
            {{ trace.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Close, User, Box, Star, StarFilled, VideoPlay, Bell, Top, Bottom } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'
import { mockProducts } from '@/mock/mockProducts'
import { mockVideos } from '@/mock/mockVideos'
import { mockOrders } from '@/mock/mockOrders'
import { mockPoints } from '@/mock/mockPoints'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.userCenterDrawerVisible,
  set: (val) => { if (!val) globalStore.closeUserCenter() }
})

const activeTab = ref('messages')
const orderType = ref('采购订单')
const selectedOrderStatus = ref('全部')
const logisticsVisible = ref(false)
const currentOrder = ref(null)

const orderStatuses = ['全部', '待收货', '已完成', '已取消']

const unreadMessages = computed(() => userStore.messages.filter(m => !m.read))

const filteredOrders = computed(() => {
  let result = mockOrders.filter(o => o.type === orderType.value)
  if (selectedOrderStatus.value !== '全部') {
    result = result.filter(o => o.status === selectedOrderStatus.value)
  }
  return result
})

const collectedProducts = computed(() => {
  return mockProducts.filter(p => userStore.collectedProductIds.includes(p.id))
})

const browsedVideos = computed(() => {
  return mockVideos.filter(v => userStore.browseVideoHistory.includes(v.id))
})

const showLogistics = (order) => {
  currentOrder.value = order
  logisticsVisible.value = true
}

const goToPoints = () => {
  activeTab.value = 'points'
}

const formatViews = (views) => {
  if (views >= 10000) return (views / 10000).toFixed(1) + '万'
  return views.toString()
}
</script>

<style lang="scss" scoped>
.uc-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.uc-header {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding: 20px 24px;
  color: #FFFFFF;
  position: relative;

  .uc-close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }

  .uc-user {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;

    .uc-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .uc-user-info {
      .uc-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .uc-company {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 6px;
      }

      .uc-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .uc-phone {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
  }

  .uc-stats {
    display: flex;
    gap: 16px;

    .uc-stat {
      flex: 1;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      .stat-num {
        font-size: 24px;
        font-weight: 700;
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}

.uc-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__header) {
    padding: 0 24px;
    margin: 0;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding: 16px 24px;
}

.tab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .tab-title {
    font-size: 14px;
    color: #6B7280;
  }
}

// 消息列表
.message-list {
  .message-item {
    display: flex;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #F3F4F6;
    cursor: pointer;
    position: relative;

    &:hover {
      background: #F9FAFB;
      margin: 0 -12px;
      padding: 14px 12px;
      border-radius: 8px;
    }

    &.unread {
      .msg-title {
        font-weight: 600;
      }
    }

    .msg-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .msg-body {
      flex: 1;

      .msg-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;

        .msg-title {
          font-size: 14px;
          color: #1F2937;
        }
      }

      .msg-content {
        font-size: 13px;
        color: #6B7280;
        line-height: 1.5;
        margin-bottom: 4px;
      }

      .msg-time {
        font-size: 12px;
        color: #9CA3AF;
      }
    }

    .msg-dot {
      position: absolute;
      top: 18px;
      right: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #EF4444;
    }
  }
}

// 订单
.order-status-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  .status-filter-tag {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    color: #6B7280;
    cursor: pointer;
    background: #F3F4F6;

    &.active {
      color: #FFFFFF;
      background: #2563EB;
    }
  }
}

.order-card {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;

  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .order-id {
      font-size: 13px;
      color: #6B7280;
    }

    .order-status {
      font-size: 13px;
      font-weight: 500;
    }
  }

  .order-items-mini {
    margin-bottom: 10px;

    .oim-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;

      .oim-img {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .oim-info {
        flex: 1;
        min-width: 0;

        .oim-name {
          font-size: 13px;
          color: #1F2937;
          margin-bottom: 2px;
        }

        .oim-spec {
          font-size: 12px;
          color: #9CA3AF;
        }
      }
    }
  }

  .order-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 10px;
    border-top: 1px solid #E5E7EB;

    .order-time {
      font-size: 12px;
      color: #9CA3AF;
    }

    .order-total {
      font-size: 13px;
      color: #4B5563;
      margin-left: auto;

      .order-price {
        font-weight: 600;
        color: #EF4444;
      }
    }
  }
}

// 积分
.points-summary {
  display: flex;
  background: #F9FAFB;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;

  .ps-main {
    flex: 0 0 140px;

    .ps-label {
      font-size: 13px;
      color: #6B7280;
      margin-bottom: 4px;
    }

    .ps-value {
      font-size: 32px;
      font-weight: 700;
      color: #F59E0B;
    }
  }

  .ps-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;

    .ps-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #6B7280;

      .ps-num {
        font-weight: 600;
        color: #1F2937;

        &.warn {
          color: #F59E0B;
        }
      }
    }
  }
}

.points-history {
  .ph-title {
    font-size: 14px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 12px;
  }

  .ph-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #F3F4F6;

    .ph-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ph-info {
      flex: 1;

      .ph-desc {
        font-size: 13px;
        color: #1F2937;
        margin-bottom: 2px;
      }

      .ph-meta {
        font-size: 12px;
        color: #9CA3AF;

        .divider {
          margin: 0 4px;
          color: #E5E7EB;
        }
      }
    }

    .ph-amount {
      font-size: 15px;
      font-weight: 600;

      &.positive {
        color: #10B981;
      }

      &.negative {
        color: #EF4444;
      }
    }
  }
}

// 收藏
.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.collection-card {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .col-img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .col-info {
    flex: 1;
    min-width: 0;

    .col-name {
      font-size: 13px;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .col-price {
      font-size: 14px;
      font-weight: 600;
      color: #EF4444;
    }
  }

  .col-star {
    cursor: pointer;
    flex-shrink: 0;
  }
}

// 视频历史
.video-history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vh-card {
  display: flex;
  gap: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .vh-cover {
    width: 100px;
    height: 64px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .vh-info {
    flex: 1;
    min-width: 0;

    .vh-title {
      font-size: 13px;
      color: #1F2937;
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .vh-meta {
      font-size: 12px;
      color: #9CA3AF;

      .divider {
        margin: 0 4px;
        color: #E5E7EB;
      }
    }
  }
}

// 缺货订阅
.sub-list {
  .sub-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    background: #F9FAFB;
    border-radius: 8px;
    margin-bottom: 10px;

    .sub-info {
      .sub-name {
        font-size: 14px;
        font-weight: 500;
        color: #1F2937;
        margin-bottom: 4px;
      }

      .sub-spec {
        font-size: 12px;
        color: #9CA3AF;
        margin-bottom: 2px;
      }

      .sub-time {
        font-size: 12px;
        color: #D1D5DB;
      }
    }
  }
}

// 物流弹窗
.logistics-content {
  .lg-info {
    background: #F9FAFB;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 16px;

    .lg-company {
      font-size: 14px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .lg-no {
      font-size: 13px;
      color: #6B7280;
    }
  }

  .lg-timeline {
    padding: 0 8px;
  }
}
</style>
