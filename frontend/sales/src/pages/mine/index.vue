<template>
  <view class="page">
    <!-- 个人信息 -->
    <view class="header">
      <view class="flex items-center">
        <image class="avatar" :src="info.avatar" mode="aspectFill" />
        <view class="ml-20">
          <view class="text-lg text-bold" style="color:#fff">{{ info.name }}</view>
          <view class="text-sm" style="color:rgba(255,255,255,0.8)">{{ info.employeeNo }} · {{ info.region }}</view>
          <view class="text-sm mt-10" style="color:rgba(255,255,255,0.7)">{{ info.level }} | 入职 {{ info.entryDate }}</view>
        </view>
      </view>
    </view>

    <!-- 消息中心入口 -->
    <view class="section">
      <view class="card" @tap="goMessage">
        <view class="flex-between">
          <view class="flex items-center">
            <view class="menu-icon" style="background:#DBEAFE">
              <wx-icon name="msg" size="24" />
            </view>
            <text class="text-md text-bold ml-20">消息中心</text>
          </view>
          <view class="flex items-center">
            <view v-if="info.todos.unreadMessages > 0" class="red-dot">{{ info.todos.unreadMessages }}</view>
            <text class="arrow"><wx-icon name="arrow" size="24" /></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 业绩总览 -->
    <view class="section">
      <view class="card" @tap="goPerformance">
        <view class="flex-between">
          <view class="flex items-center">
            <view class="menu-icon" style="background:#D1FAE5">
              <text style="color:#10B981"><wx-icon name="chart" size="24" /></text>
            </view>
            <text class="text-md text-bold ml-20">我的业绩</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-primary">¥{{ formatNum(info.monthlyData.performance) }}</text>
            <text class="arrow ml-10"><wx-icon name="arrow" size="24" /></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 提现管理 -->
    <view class="section">
      <view class="card" @tap="goWithdrawal">
        <view class="flex-between">
          <view class="flex items-center">
            <view class="menu-icon" style="background:#FEF3C7">
              <text style="color:#F59E0B"><wx-icon name="money" size="24" /></text>
            </view>
            <text class="text-md text-bold ml-20">提现管理</text>
          </view>
          <view class="flex items-center">
            <text class="text-sm text-warning">可提现 ¥{{ info.withdrawableAmount.toFixed(2) }}</text>
            <text class="arrow ml-10"><wx-icon name="arrow" size="24" /></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 转发转化数据 -->
    <view class="section">
      <view class="card">
        <view class="card-title">转发转化数据</view>
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

    <!-- 功能列表 -->
    <view class="section">
      <view class="card">
        <view class="menu-item" @tap="goDiscount">
          <view class="menu-icon" style="background:#FEE2E2">
            <text style="color:#EF4444"><wx-icon name="tag" size="24" /></text>
          </view>
          <text class="text-md flex-1 ml-20">定向优惠申请记录</text>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
        <view class="menu-item" @tap="goMarketing">
          <view class="menu-icon" style="background:#F3E8FF">
            <text style="color:#8B5CF6"><wx-icon name="video" size="24" /></text>
          </view>
          <text class="text-md flex-1 ml-20">营销工具箱</text>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
        <view class="menu-item" @tap="goCustomer">
          <view class="menu-icon" style="background:#E0F2FE">
            <text style="color:#0EA5E9"><wx-icon name="people" size="24" /></text>
          </view>
          <text class="text-md flex-1 ml-20">客户管理</text>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
        <view class="menu-item" @tap="goSettings">
          <view class="menu-icon" style="background:#F3F4F6">
            <text style="color:#6B7280"><wx-icon name="setting" size="24" /></text>
          </view>
          <text class="text-md flex-1 ml-20">设置</text>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
      </view>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { salesmanInfo } from '@/mock/mockSalesman.js'

const info = ref(salesmanInfo)

function formatNum(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function goMessage() { uni.navigateTo({ url: '/pages/message/index' }) }
function goPerformance() { uni.switchTab({ url: '/pages/performance/index' }) }
function goWithdrawal() { uni.navigateTo({ url: '/pages/performance/withdrawal' }) }
function goDiscount() { uni.navigateTo({ url: '/pages/marketing/discount' }) }
function goMarketing() { uni.switchTab({ url: '/pages/marketing/index' }) }
function goCustomer() { uni.switchTab({ url: '/pages/customer/index' }) }
function goSettings() { uni.showToast({ title: '设置功能开发中', icon: 'none' }) }
</script>

<style scoped>
.page { min-height: 100vh; }

.header {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding: 40rpx 30rpx 50rpx;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
}

.section { padding: 0 24rpx; margin-top: 20rpx; }
.section:first-of-type { margin-top: -30rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; }
.card-title { font-size: 30rpx; font-weight: 600; margin-bottom: 24rpx; }

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.menu-item:last-child { border-bottom: none; }
.arrow { font-size: 40rpx; color: #D1D5DB; }

.red-dot {
  background: #EF4444;
  color: #fff;
  font-size: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  border-radius: 16rpx;
  padding: 0 8rpx;
  margin-right: 12rpx;
}

.stats-grid { display: flex; flex-wrap: wrap; }
.stat-item { width: 50%; padding: 16rpx 0; }
.stat-value { font-size: 36rpx; font-weight: 700; margin-bottom: 8rpx; }
.stat-label { font-size: 24rpx; color: #9CA3AF; }
</style>
