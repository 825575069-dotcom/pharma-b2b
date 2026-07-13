<template>
  <view class="page">
    <!-- 全部已读按钮 -->
    <view class="action-bar">
      <text class="unread-count">{{ unreadCount }}条未读消息</text>
      <view class="read-all-btn" @tap="markAllRead">
        <text class="read-all-text">全部已读</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y="true" scroll-with-animation="false" enhanced="true" show-scrollbar="false" class="msg-scroll">
      <view v-for="msg in messages" :key="msg.id" class="msg-item" :class="{ unread: !msg.read }" @tap="readMessage(msg)">
        <view class="msg-dot" v-if="!msg.read"></view>
        <view class="msg-icon-wrap" :style="{ background: msg.typeColor + '20' }">
          <wx-icon :name="getTypeIcon(msg.type)" :size="36" />
        </view>
        <view class="msg-body">
          <view class="msg-header">
            <text class="msg-type" :style="{ color: msg.typeColor }">{{ msg.type }}</text>
            <text class="msg-time">{{ msg.time }}</text>
          </view>
          <text class="msg-title">{{ msg.title }}</text>
          <text class="msg-content">{{ msg.content }}</text>
          <view v-if="msg.urgent" class="urgent-tag">
            <text class="urgent-text">紧急</text>
          </view>
        </view>
      </view>

      <view v-if="messages.length === 0" class="empty">
        <text class="empty-icon"><wx-icon name="msg" size="120" /></text>
        <text class="empty-text">暂无消息</text>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store
    }
  },
  computed: {
    messages() {
      return this.store.state.messages
    },
    unreadCount() {
      return this.store.state.unreadCount
    }
  },
  methods: {
    getTypeIcon(type) {
      const icons = {
        '积分到期': 'clock',
        '缺货到货': 'check',
        '授权到期': 'warning',
        '订单发货': 'truck',
        '促销活动': 'gift',
        '积分到账': 'money',
        '订单签收': 'box',
        '系统通知': 'msg'
      }
      return icons[type] || 'msg'
    },
    readMessage(msg) {
      if (!msg.read) {
        this.store.markMessageRead(msg.id)
      }
    },
    markAllRead() {
      this.store.markAllRead()
      uni.showToast({ title: '已全部标记为已读', icon: 'success' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 16rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .unread-count {
    font-size: 24rpx;
    color: #6B7280;
  }

  .read-all-btn {
    background: #f3f4f6;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;

    .read-all-text {
      font-size: 24rpx;
      color: #2563EB;
    }
  }
}

.msg-scroll {
  height: calc(100vh - 80rpx);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.msg-item {
  display: flex;
  align-items: flex-start;
  background: #fff;
  margin: 12rpx 16rpx;
  border-radius: 12rpx;
  padding: 20rpx;
  position: relative;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  contain: layout paint;

  &.unread {
    background: #f0f7ff;
  }

  .msg-dot {
    position: absolute;
    top: 24rpx;
    left: 8rpx;
    width: 12rpx;
    height: 12rpx;
    background: #EF4444;
    border-radius: 50%;
  }

  .msg-icon-wrap {
    width: 72rpx;
    height: 72rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;

    .msg-icon {
      font-size: 36rpx;
    }
  }

  .msg-body {
    flex: 1;

    .msg-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .msg-type {
        font-size: 24rpx;
        font-weight: 600;
      }

      .msg-time {
        font-size: 20rpx;
        color: #9CA3AF;
      }
    }

    .msg-title {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
      margin-top: 6rpx;
    }

    .msg-content {
      font-size: 24rpx;
      color: #6B7280;
      margin-top: 6rpx;
      line-height: 1.5;
    }

    .urgent-tag {
      display: inline-flex;
      background: #FEE2E2;
      padding: 2rpx 10rpx;
      border-radius: 6rpx;
      margin-top: 8rpx;

      .urgent-text {
        font-size: 18rpx;
        color: #EF4444;
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 100rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #9CA3AF;
    margin-top: 20rpx;
  }
}
</style>
