<template>
  <view class="page">
    <!-- 客户基本信息 -->
    <view class="header">
      <view class="flex items-center">
        <view class="customer-avatar">{{ customer.name?.charAt(0) }}</view>
        <view class="ml-20">
          <view class="flex items-center">
            <text class="customer-name">{{ customer.name }}</text>
            <view class="tag" :class="getTagClass(customer.tag)">{{ getTagText(customer.tag) }}</view>
          </view>
          <view class="text-sm mt-10" style="color:rgba(255,255,255,0.85)">
            {{ customer.contact }} · {{ customer.phone }}
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <!-- 联系信息 -->
      <view class="card">
        <view class="card-title">基本信息</view>
        <view class="info-row">
          <text class="info-label">联系人</text>
          <text class="info-value">{{ customer.contact }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">电话</text>
          <text class="info-value text-primary" @tap="callPhone">{{ customer.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">地址</text>
          <text class="info-value" style="flex:1;text-align:right">{{ customer.address }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">建档日期</text>
          <text class="info-value">{{ customer.createdAt }}</text>
        </view>
      </view>
    </view>

    <!-- 账期额度 -->
    <view class="section">
      <view class="card">
        <view class="card-title">账期额度</view>
        <view class="credit-info">
          <view class="flex-between mb-20">
            <text class="text-sm text-gray">已用额度</text>
            <text class="text-md text-bold">¥{{ formatMoney(customer.usedCredit) }} / ¥{{ formatMoney(customer.creditLimit) }}</text>
          </view>
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: creditPercent + '%' }"></view>
          </view>
          <view class="flex-between mt-20">
            <view>
              <text class="text-sm text-gray">剩余额度</text>
              <view class="text-lg text-primary text-bold">¥{{ formatMoney(customer.creditLimit - customer.usedCredit) }}</view>
            </view>
            <view>
              <text class="text-sm text-gray">积分余额</text>
              <view class="text-lg text-warning text-bold">{{ customer.points }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 历史采购记录 -->
    <view class="section">
      <view class="card">
        <view class="card-title">历史采购记录</view>
        <view class="order-list">
          <view v-for="order in customerOrders" :key="order.id" class="order-item">
            <view class="flex-between">
              <text class="text-sm text-gray">{{ order.orderNo }}</text>
              <view class="tag" :class="order.status === 'completed' ? 'tag-green' : 'tag-blue'">
                {{ order.statusText }}
              </view>
            </view>
            <view class="mt-10 text-sm">{{ order.items.map(i => i.name).join('、') }}</view>
            <view class="flex-between mt-10">
              <text class="text-sm text-gray">{{ order.createdAt }}</text>
              <text class="text-md text-primary text-bold">¥{{ formatMoney(order.amount) }}</text>
            </view>
          </view>
        </view>
        <view v-if="customerOrders.length === 0" class="empty-text">
          <text class="text-gray">暂无采购记录</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="bottom-bar safe-bottom">
      <view class="btn-outline" style="flex:1" @tap="goProxyOrder">
        <text><wx-icon name="clipboard" size="24" /> 代客下单</text>
      </view>
      <view class="btn-outline" style="flex:1" @tap="goShareProduct">
        <text><wx-icon name="box" size="24" /> 分享商品</text>
      </view>
      <view class="btn-outline" style="flex:1" @tap="goShareActivity">
        <text><wx-icon name="gift" size="24" /> 分享活动</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { customers, getTagText, getTagClass } from '@/mock/mockCustomers.js'
import { orders } from '@/mock/mockOrders.js'

const customer = ref({})
const customerOrders = ref([])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.options?.id || currentPage.$page?.options?.id || 'C001'
  const found = customers.find(c => c.id === id)
  if (found) {
    customer.value = found
    customerOrders.value = orders.filter(o => o.customerId === id)
  }
})

const creditPercent = computed(() => {
  if (!customer.value.creditLimit) return 0
  return Math.min(100, (customer.value.usedCredit / customer.value.creditLimit) * 100)
})

function formatMoney(num) {
  return (num || 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function callPhone() {
  uni.makePhoneCall({ phoneNumber: customer.value.phone })
}
function goProxyOrder() {
  uni.navigateTo({ url: `/pages/order/create?customerId=${customer.value.id}` })
}
function goShareProduct() {
  uni.navigateTo({ url: `/pages/marketing/products?customerId=${customer.value.id}` })
}
function goShareActivity() {
  uni.navigateTo({ url: `/pages/marketing/activities?customerId=${customer.value.id}` })
}
</script>

<style scoped>
.page { min-height: 100vh; padding-bottom: 140rpx; }

.header {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding: 30rpx;
}
.customer-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 600;
}
.customer-name { font-size: 34rpx; font-weight: 600; color: #fff; margin-right: 12rpx; }

.section { padding: 0 24rpx; margin-top: 20rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; }
.card-title { font-size: 30rpx; font-weight: 600; margin-bottom: 24rpx; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 28rpx; color: #9CA3AF; }
.info-value { font-size: 28rpx; color: #111827; }

.progress-bar {
  height: 20rpx;
  background: #F3F4F6;
  border-radius: 10rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563EB, #60A5FA);
  border-radius: 10rpx;
  transition: width 0.3s;
}

.order-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.order-item:last-child { border-bottom: none; }
.empty-text { text-align: center; padding: 40rpx 0; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #E5E7EB;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
