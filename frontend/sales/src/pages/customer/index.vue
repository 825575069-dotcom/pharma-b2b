<template>
  <view class="page">
    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon"><wx-icon name="search-white" size="32" /></text>
        <input
          v-model="keyword"
          placeholder="搜索客户名称/电话"
          class="input"
          @confirm="onSearch"
        />
      </view>
    </view>

    <!-- 标签筛选 -->
    <scroll-view scroll-x class="tag-bar">
      <view
        v-for="tag in tags"
        :key="tag.value"
        class="tag-item"
        :class="{ active: activeTag === tag.value }"
        @tap="activeTag = tag.value"
      >
        {{ tag.label }}
      </view>
    </scroll-view>

    <!-- 客户列表 -->
    <view class="customer-list">
      <view
        v-for="c in filteredCustomers"
        :key="c.id"
        class="customer-card"
        @tap="goDetail(c.id)"
      >
        <view class="flex-between">
          <view class="flex items-center">
            <view class="customer-avatar">
              {{ c.name.charAt(0) }}
            </view>
            <view class="ml-20">
              <view class="flex items-center">
                <text class="customer-name">{{ c.name }}</text>
                <view class="tag" :class="getTagClass(c.tag)">{{ getTagText(c.tag) }}</view>
              </view>
              <view class="text-sm text-gray mt-10">联系人：{{ c.contact }}</view>
            </view>
          </view>
        </view>
        <view class="customer-info">
          <view class="info-item">
            <text class="info-label">历史采购</text>
            <text class="info-value text-primary">¥{{ formatMoney(c.totalPurchase) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">剩余账期</text>
            <text class="info-value">¥{{ formatMoney(c.creditLimit - c.usedCredit) }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">积分余额</text>
            <text class="info-value text-warning">{{ c.points }}</text>
          </view>
        </view>
        <view class="text-sm text-gray">最近下单：{{ c.lastOrderTime }}</view>
      </view>
    </view>

    <view v-if="filteredCustomers.length === 0" class="empty">
      <text class="text-gray">暂无匹配客户</text>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { customers, getTagText, getTagClass } from '@/mock/mockCustomers.js'

const keyword = ref('')
const activeTag = ref('all')

const tags = [
  { label: '全部', value: 'all' },
  { label: '新客', value: 'new' },
  { label: '沉睡', value: 'sleeping' },
  { label: '高价值', value: 'high_value' }
]

const filteredCustomers = computed(() => {
  let list = customers
  if (activeTag.value !== 'all') {
    list = list.filter(c => c.tag === activeTag.value)
  }
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(kw) ||
      c.contact.toLowerCase().includes(kw) ||
      c.phone.includes(kw)
    )
  }
  return list
})

function onSearch() {}

function formatMoney(num) {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/customer/detail?id=${id}` })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.search-bar {
  padding: 20rpx 24rpx;
  background: #fff;
}
.search-input {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 48rpx;
  padding: 16rpx 28rpx;
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.input { flex: 1; font-size: 28rpx; }

.tag-bar {
  white-space: nowrap;
  padding: 16rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #E5E7EB;
}
.tag-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  margin-right: 16rpx;
  border-radius: 48rpx;
  font-size: 26rpx;
  color: #4B5563;
  background: #F3F4F6;
  transition: all 0.2s;
}
.tag-item.active {
  background: #2563EB;
  color: #fff;
}

.customer-list { padding: 20rpx 24rpx; }
.customer-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.customer-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #DBEAFE;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
}
.customer-name {
  font-size: 30rpx;
  font-weight: 600;
  margin-right: 12rpx;
}
.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}
.customer-info {
  display: flex;
  margin: 20rpx 0;
  padding: 20rpx 0;
  border-top: 1rpx solid #F3F4F6;
  border-bottom: 1rpx solid #F3F4F6;
}
.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.info-label { font-size: 22rpx; color: #9CA3AF; margin-bottom: 8rpx; }
.info-value { font-size: 28rpx; font-weight: 600; }

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
