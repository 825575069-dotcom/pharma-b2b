<template>
  <view class="page">
    <!-- 积分概览 -->
    <view class="summary-card">
      <view class="summary-item">
        <text class="summary-num">{{ pointsData.total }}</text>
        <text class="summary-label">当前积分</text>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item">
        <text class="summary-num text-success">{{ pointsData.yearEarned }}</text>
        <text class="summary-label">本年获得</text>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item">
        <text class="summary-num text-danger">{{ pointsData.yearUsed }}</text>
        <text class="summary-label">本年消耗</text>
      </view>
    </view>

    <!-- 积分流水 -->
    <scroll-view scroll-y class="history-scroll">
      <view v-for="record in pointsData.history" :key="record.id" class="history-item">
        <view class="hi-left">
          <view class="hi-icon" :style="{ background: record.amount > 0 ? '#D1FAE5' : '#FEE2E2' }">
            <text class="icon-text" :style="{ color: record.amount > 0 ? '#10B981' : '#EF4444' }">{{ record.amount > 0 ? '+' : '-' }}</text>
          </view>
          <view class="hi-info">
            <text class="hi-source">{{ record.source }}</text>
            <text class="hi-desc">{{ record.description }}</text>
            <text class="hi-time">{{ record.time }}</text>
          </view>
        </view>
        <view class="hi-right">
          <text class="hi-amount" :style="{ color: record.amount > 0 ? '#10B981' : '#EF4444' }">{{ record.amount > 0 ? '+' : '' }}{{ record.amount }}</text>
          <text class="hi-balance">余额{{ record.balance }}</text>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mockPoints } from '../../mock/mockPoints.js'

export default {
  data() {
    return {
      pointsData: mockPoints
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.summary-card {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 30rpx;

  .summary-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .summary-num {
      font-size: 40rpx;
      font-weight: 700;
      color: #2563EB;
    }

    .summary-label {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 6rpx;
    }
  }

  .summary-divider {
    width: 1rpx;
    height: 60rpx;
    background: #e5e7eb;
  }
}

.history-scroll {
  height: calc(100vh - 200rpx);
}

.history-item {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 16rpx 12rpx;
  border-radius: 12rpx;
  padding: 20rpx;

  .hi-left {
    flex: 1;
    display: flex;

    .hi-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16rpx;

      .icon-text {
        font-size: 32rpx;
        font-weight: 700;
      }
    }

    .hi-info {
      flex: 1;

      .hi-source {
        font-size: 28rpx;
        color: #1f2937;
        font-weight: 500;
      }

      .hi-desc {
        font-size: 22rpx;
        color: #6B7280;
        margin-top: 4rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 400rpx;
      }

      .hi-time {
        font-size: 20rpx;
        color: #9CA3AF;
        margin-top: 4rpx;
      }
    }
  }

  .hi-right {
    text-align: right;

    .hi-amount {
      font-size: 32rpx;
      font-weight: 700;
    }

    .hi-balance {
      font-size: 20rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }
  }
}
</style>
