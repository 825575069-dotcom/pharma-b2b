<template>
  <view class="page">
    <!-- 顶部用户信息 -->
    <view class="header">
      <view class="header-content">
        <view class="flex items-center">
          <image class="avatar" :src="info.avatar" mode="aspectFill" />
          <view class="ml-20">
            <view class="text-lg text-bold" style="color:#fff">{{ info.name }}</view>
            <view class="text-sm" style="color:rgba(255,255,255,0.8)">{{ info.region }} · {{ info.level }}</view>
          </view>
        </view>
        <view class="header-badge" @tap="goMessage">
          <wx-icon name="bell-white" size="32" />
          <view v-if="info.todos.unreadMessages > 0" class="badge">{{ info.todos.unreadMessages }}</view>
        </view>
      </view>
    </view>

    <!-- 当月核心数据 -->
    <view class="section">
      <view class="card stats-card">
        <view class="card-title">当月核心数据</view>
        <view class="stats-grid">
          <view class="stat-item">
            <view class="stat-value text-primary">¥{{ formatNum(info.monthlyData.performance) }}</view>
            <view class="stat-label">业绩总额</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ info.monthlyData.orderCount }}</view>
            <view class="stat-label">订单数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-success">¥{{ formatNum(info.monthlyData.estimatedCommission) }}</view>
            <view class="stat-label">预估提成</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-warning">¥{{ formatNum(info.monthlyData.withdrawnAmount) }}</view>
            <view class="stat-label">已提现</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 待办事项 -->
    <view class="section">
      <view class="card">
        <view class="card-title">待办事项</view>
        <view class="todo-list">
          <view class="todo-item" @tap="goSleepingCustomers">
            <view class="todo-icon" style="background:#FEF3C7">
              <wx-icon name="warning" size="24" />
            </view>
            <view class="flex-1">
              <view class="text-md text-bold">待跟进沉睡客户</view>
              <view class="text-sm text-gray">{{ info.todos.sleepingCustomers }} 位客户需要跟进</view>
            </view>
            <view class="todo-count text-warning">{{ info.todos.sleepingCustomers }}</view>
          </view>
          <view class="todo-item" @tap="goMessage">
            <view class="todo-icon" style="background:#DBEAFE">
              <wx-icon name="msg" size="24" />
            </view>
            <view class="flex-1">
              <view class="text-md text-bold">未读消息</view>
              <view class="text-sm text-gray">{{ info.todos.unreadMessages }} 条未读消息</view>
            </view>
            <view class="todo-count text-primary">{{ info.todos.unreadMessages }}</view>
          </view>
          <view class="todo-item" @tap="goWithdrawal">
            <view class="todo-icon" style="background:#FEE2E2">
              <wx-icon name="money" size="24" />
            </view>
            <view class="flex-1">
              <view class="text-md text-bold">待审核提现</view>
              <view class="text-sm text-gray">{{ info.todos.pendingWithdrawals }} 笔提现待审核</view>
            </view>
            <view class="todo-count text-danger">{{ info.todos.pendingWithdrawals }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 短视频拓客转化 -->
    <view class="section">
      <view class="card">
        <view class="card-title">短视频拓客转化</view>
        <view class="stats-grid">
          <view class="stat-item">
            <view class="stat-value text-primary">{{ info.videoConversion.forwardCount }}</view>
            <view class="stat-label">转发数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ info.videoConversion.playCount }}</view>
            <view class="stat-label">播放数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-success">{{ info.videoConversion.convertedOrders }}</view>
            <view class="stat-label">转化订单</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-warning">¥{{ formatNum(info.videoConversion.convertedAmount) }}</view>
            <view class="stat-label">转化金额</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="section">
      <view class="card">
        <view class="card-title">快捷操作</view>
        <view class="quick-grid">
          <view class="quick-item" @tap="goProxyOrder">
            <view class="quick-icon" style="background:#DBEAFE">
              <text style="color:#2563EB;font-size:36rpx"><wx-icon name="clipboard" size="24" /></text>
            </view>
            <view class="quick-text">代客下单</view>
          </view>
          <view class="quick-item" @tap="goForwardVideo">
            <view class="quick-icon" style="background:#D1FAE5">
              <text style="color:#10B981;font-size:36rpx"><wx-icon name="video" size="24" /></text>
            </view>
            <view class="quick-text">转发视频</view>
          </view>
          <view class="quick-item" @tap="goForwardActivity">
            <view class="quick-icon" style="background:#FEF3C7">
              <text style="color:#F59E0B;font-size:36rpx"><wx-icon name="gift" size="24" /></text>
            </view>
            <view class="quick-text">转发活动</view>
          </view>
          <view class="quick-item" @tap="goWithdrawal">
            <view class="quick-icon" style="background:#FEE2E2">
              <text style="color:#EF4444;font-size:36rpx"><wx-icon name="money" size="24" /></text>
            </view>
            <view class="quick-text">提现</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 近期动态 -->
    <view class="section">
      <view class="card">
        <view class="card-title">近期动态</view>
        <view class="activity-list">
          <view v-for="item in activities" :key="item.id" class="activity-item">
            <view class="activity-dot" :class="item.type === 'order' ? 'bg-primary' : 'bg-warning'"></view>
            <view class="flex-1">
              <view class="text-sm" style="color:#111827">{{ item.title }}</view>
              <view class="text-sm text-gray mt-10">{{ item.time }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { salesmanInfo, recentActivities } from '@/mock/mockSalesman.js'

const info = ref(salesmanInfo)
const activities = ref(recentActivities)

function formatNum(num) {
  return (num / 1000).toFixed(1) + 'k'
}

function goMessage() {
  uni.navigateTo({ url: '/pages/message/index' })
}
function goSleepingCustomers() {
  uni.switchTab({ url: '/pages/customer/index' })
}
function goWithdrawal() {
  uni.navigateTo({ url: '/pages/performance/withdrawal' })
}
function goProxyOrder() {
  uni.navigateTo({ url: '/pages/order/create' })
}
function goForwardVideo() {
  uni.navigateTo({ url: '/pages/marketing/videos' })
}
function goForwardActivity() {
  uni.navigateTo({ url: '/pages/marketing/activities' })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.header {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding: 30rpx 30rpx 50rpx;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
}
.header-badge {
  position: relative;
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  font-size: 36rpx;
  color: #fff;
}
.badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  background: #EF4444;
  color: #fff;
  font-size: 20rpx;
  border-radius: 16rpx;
  padding: 0 8rpx;
}

.section { padding: 0 24rpx; margin-top: 20rpx; }
.section:first-of-type { margin-top: -30rpx; }

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24rpx;
}

.stats-card {
  box-shadow: 0 4rpx 20rpx rgba(37,99,235,0.08);
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
}
.stat-item {
  width: 50%;
  padding: 16rpx 0;
}
.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}
.stat-label {
  font-size: 24rpx;
  color: #9CA3AF;
}

.todo-list { display: flex; flex-direction: column; gap: 24rpx; }
.todo-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F9FAFB;
  border-radius: 16rpx;
}
.todo-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  margin-right: 20rpx;
}
.todo-count {
  font-size: 40rpx;
  font-weight: 700;
}

.quick-grid {
  display: flex;
  flex-wrap: wrap;
}
.quick-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx 0;
}
.quick-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}
.quick-text { font-size: 24rpx; color: #4B5563; }

.activity-list { display: flex; flex-direction: column; gap: 24rpx; }
.activity-item {
  display: flex;
  align-items: flex-start;
}
.activity-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-top: 10rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.bg-primary { background: #2563EB; }
.bg-warning { background: #F59E0B; }
</style>
