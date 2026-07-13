<template>
  <view class="page">
    <view class="tip-bar">
      <text class="text-sm text-gray">选择活动分享给客户，促进成交转化</text>
    </view>

    <view class="activity-list">
      <view v-for="a in activities" :key="a.id" class="activity-card">
        <view class="activity-header">
          <view class="tag" :class="getTypeClass(a.type)">{{ a.typeText }}</view>
          <text class="text-sm text-gray">{{ a.startDate }} ~ {{ a.endDate }}</text>
        </view>
        <view class="activity-name">{{ a.name }}</view>
        <view class="activity-desc">{{ a.description }}</view>
        <view class="activity-footer">
          <view class="product-count">
            <text class="text-sm text-gray">参与商品</text>
            <text class="text-md text-primary text-bold ml-10">{{ a.productCount }} 个</text>
          </view>
          <view class="share-btn" @tap="shareActivity(a)">分享活动</view>
        </view>
      </view>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { activities } from '@/mock/mockActivities.js'

function getTypeClass(type) {
  const map = {
    full_reduction: 'tag-red',
    discount: 'tag-blue',
    gift: 'tag-green',
    bundle: 'tag-orange'
  }
  return map[type] || 'tag-gray'
}

function shareActivity(a) {
  uni.setClipboardData({
    data: `【${a.name}】\n活动时间：${a.startDate} ~ ${a.endDate}\n活动详情：${a.description}\n参与商品：${a.productCount}个`,
    success: () => {
      uni.showToast({ title: '活动信息已复制，可粘贴发送给客户', icon: 'none', duration: 2500 })
    }
  })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.tip-bar { padding: 20rpx 24rpx; }

.activity-list { padding: 0 24rpx; }
.activity-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.activity-name { font-size: 32rpx; font-weight: 600; line-height: 1.5; margin-bottom: 12rpx; }
.activity-desc { font-size: 26rpx; color: #6B7280; line-height: 1.6; }
.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F3F4F6;
}
.product-count { display: flex; align-items: center; }
.share-btn {
  background: #2563EB;
  color: #fff;
  font-size: 26rpx;
  padding: 14rpx 40rpx;
  border-radius: 48rpx;
}

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
