<template>
  <view class="page">
    <!-- 顶部操作栏 -->
    <view class="top-bar">
      <text class="unread-count">{{ unreadCount }} 条未读</text>
      <text class="read-all-btn" @tap="readAll">全部已读</text>
    </view>

    <!-- 消息列表 -->
    <view class="msg-list">
      <view
        v-for="msg in messages"
        :key="msg.id"
        class="msg-card"
        :class="{ unread: !msg.isRead }"
        @tap="readMessage(msg)"
      >
        <view class="msg-header">
          <view class="msg-type-tag" :class="getTypeClass(msg.type)">{{ msg.typeText }}</view>
          <text class="msg-time">{{ msg.time }}</text>
        </view>
        <view class="msg-title">{{ msg.title }}</view>
        <view class="msg-content">{{ msg.content }}</view>
        <view v-if="!msg.isRead" class="unread-dot"></view>
      </view>
    </view>

    <view v-if="messages.length === 0" class="empty">
      <text class="text-gray">暂无消息</text>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { messages as mockMessages } from '@/mock/mockMessages.js'

const messages = ref([...mockMessages])

const unreadCount = computed(() => messages.value.filter(m => !m.isRead).length)

function getTypeClass(type) {
  const map = {
    withdrawal_reject: 'tag-red',
    discount_review: 'tag-blue',
    points_warning: 'tag-orange',
    activity_online: 'tag-green',
    order_reminder: 'tag-blue'
  }
  return map[type] || 'tag-gray'
}

function readMessage(msg) {
  if (!msg.isRead) {
    msg.isRead = true
  }
}

function readAll() {
  messages.value.forEach(m => m.isRead = true)
  uni.showToast({ title: '已全部标记为已读', icon: 'none' })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #E5E7EB;
}
.unread-count { font-size: 26rpx; color: #9CA3AF; }
.read-all-btn { font-size: 26rpx; color: #2563EB; }

.msg-list { padding: 20rpx 24rpx; }
.msg-card {
  position: relative;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.msg-card.unread {
  border-left: 6rpx solid #2563EB;
}
.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.msg-type-tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}
.msg-time { font-size: 24rpx; color: #9CA3AF; }
.msg-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}
.msg-content {
  font-size: 26rpx;
  color: #6B7280;
  line-height: 1.6;
}
.unread-dot {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 16rpx;
  height: 16rpx;
  background: #EF4444;
  border-radius: 50%;
}

.empty { text-align: center; padding: 120rpx 0; }

.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
