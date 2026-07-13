<template>
  <view class="page">
    <!-- 营销工具入口 -->
    <view class="section">
      <view class="section-title">营销工具</view>
      <view class="tool-grid">
        <view class="tool-card" @tap="goPage('/pages/marketing/products')">
          <view class="tool-icon" style="background:linear-gradient(135deg,#DBEAFE,#BFDBFE)">
            <text style="font-size:48rpx"><wx-icon name="box" size="24" /></text>
          </view>
          <view class="tool-info">
            <view class="tool-name">转发商品</view>
            <view class="tool-desc">选择商品生成分享链接/海报</view>
          </view>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>

        <view class="tool-card" @tap="goPage('/pages/marketing/videos')">
          <view class="tool-icon" style="background:linear-gradient(135deg,#D1FAE5,#A7F3D0)">
            <text style="font-size:48rpx"><wx-icon name="video" size="24" /></text>
          </view>
          <view class="tool-info">
            <view class="tool-name">转发短视频</view>
            <view class="tool-desc">选择视频合集分享给客户</view>
          </view>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>

        <view class="tool-card" @tap="goPage('/pages/marketing/activities')">
          <view class="tool-icon" style="background:linear-gradient(135deg,#FEF3C7,#FDE68A)">
            <text style="font-size:48rpx"><wx-icon name="gift" size="24" /></text>
          </view>
          <view class="tool-info">
            <view class="tool-name">转发活动</view>
            <view class="tool-desc">选择活动分享给客户</view>
          </view>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
      </view>
    </view>

    <!-- 定向优惠 -->
    <view class="section">
      <view class="section-title">定向优惠</view>
      <view class="card">
        <view class="discount-entry" @tap="goPage('/pages/marketing/discount')">
          <view class="discount-icon" style="background:#FEE2E2">
            <text style="color:#EF4444;font-size:36rpx"><wx-icon name="tag" size="24" /></text>
          </view>
          <view class="flex-1">
            <view class="text-md text-bold">定向优惠申请</view>
            <view class="text-sm text-gray mt-10">为名下客户申请专属折扣</view>
          </view>
          <text class="arrow"><wx-icon name="arrow" size="24" /></text>
        </view>
      </view>
    </view>

    <!-- 我的优惠申请 -->
    <view class="section">
      <view class="flex-between mb-20">
        <text class="section-title">我的优惠申请</text>
        <text class="text-sm text-primary" @tap="goPage('/pages/marketing/discount')">查看全部</text>
      </view>

      <!-- 状态统计 -->
      <view class="status-tabs">
        <view
          v-for="tab in statusTabs"
          :key="tab.value"
          class="status-tab"
          :class="{ active: activeStatus === tab.value }"
          @tap="activeStatus = tab.value"
        >
          {{ tab.label }}
        </view>
      </view>

      <view class="card" v-for="item in filteredDiscounts" :key="item.id">
        <view class="flex-between mb-10">
          <text class="text-md text-bold">{{ item.customerName }}</text>
          <view class="tag" :class="getStatusClass(item.status)">{{ item.statusText }}</view>
        </view>
        <view class="text-sm text-gray mb-10">{{ item.productName }}</view>
        <view class="flex-between">
          <view>
            <text class="text-sm text-gray">原价</text>
            <text class="text-sm ml-10" style="text-decoration:line-through;color:#9CA3AF">¥{{ item.originalPrice }}</text>
          </view>
          <view>
            <text class="text-sm text-gray">优惠价</text>
            <text class="text-sm text-primary text-bold ml-10">¥{{ item.discountPrice }}</text>
          </view>
          <view>
            <text class="text-sm text-gray">{{ item.discountRate }}折</text>
          </view>
        </view>
        <view class="text-sm text-gray mt-10">申请时间：{{ item.applyTime }}</view>
        <view v-if="item.rejectReason" class="reject-reason">
          <text class="text-sm text-danger">驳回原因：{{ item.rejectReason }}</text>
        </view>
      </view>

      <view v-if="filteredDiscounts.length === 0" class="empty">
        <text class="text-gray">暂无相关记录</text>
      </view>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { discountApplications } from '@/mock/mockDiscounts.js'

const activeStatus = ref('all')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已驳回', value: 'rejected' }
]

const filteredDiscounts = computed(() => {
  if (activeStatus.value === 'all') return discountApplications
  return discountApplications.filter(d => d.status === activeStatus.value)
})

function getStatusClass(status) {
  const map = { pending: 'tag-orange', approved: 'tag-green', rejected: 'tag-red' }
  return map[status] || 'tag-gray'
}

function goPage(url) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.section { padding: 0 24rpx; margin-top: 30rpx; }
.section-title { font-size: 32rpx; font-weight: 600; color: #111827; margin-bottom: 20rpx; }

.tool-grid { display: flex; flex-direction: column; gap: 20rpx; }
.tool-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}
.tool-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}
.tool-info { flex: 1; }
.tool-name { font-size: 30rpx; font-weight: 600; }
.tool-desc { font-size: 24rpx; color: #9CA3AF; margin-top: 8rpx; }
.arrow { font-size: 40rpx; color: #D1D5DB; }

.card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }

.discount-entry {
  display: flex;
  align-items: center;
}
.discount-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.status-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.status-tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 48rpx;
  font-size: 26rpx;
  color: #4B5563;
  background: #fff;
}
.status-tab.active {
  background: #2563EB;
  color: #fff;
}

.reject-reason {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #FEE2E2;
  border-radius: 12rpx;
}

.empty { text-align: center; padding: 80rpx 0; }

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
