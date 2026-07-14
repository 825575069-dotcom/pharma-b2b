<template>
  <view class="page">
    <!-- 顶部用户信息卡 -->
    <view class="header-bg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="user-card">
        <view class="user-top">
          <view class="user-avatar">
            <image v-if="store.state.user.avatar" :src="store.state.user.avatar" mode="aspectFill" style="width: 100%; height: 100%; border-radius: 50%;" />
            <text v-else class="avatar-text">{{ store.state.user.name.charAt(0) }}</text>
          </view>
          <view class="user-info">
            <text class="user-name">{{ store.state.user.name }}</text>
            <text class="user-company">{{ store.state.user.company }}</text>
            <view class="user-level">
              <text class="level-text">{{ store.state.user.level }}</text>
            </view>
          </view>
          <view class="settings-btn" @tap="goSettings">
            <text class="settings-icon"><wx-icon name="setting" size="40" /></text>
          </view>
        </view>

        <view class="user-stats">
          <view class="stat-item" @tap="goPoints">
            <text class="stat-num">{{ store.state.user.points }}</text>
            <text class="stat-label">我的积分</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">¥{{ formatCredit(store.state.user.creditAvailable) }}</text>
            <text class="stat-label">账期额度</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item" @tap="goCollect">
            <text class="stat-num">{{ store.state.user.collectCount }}</text>
            <text class="stat-label">我的收藏</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 消息通知入口 -->
    <view class="msg-entry" @tap="goMessage">
      <view class="msg-left">
        <text class="msg-icon"><wx-icon name="msg-white" size="36" /></text>
        <text class="msg-title">消息通知</text>
      </view>
      <view class="msg-right">
        <view v-if="store.state.unreadCount > 0" class="msg-badge">
          <text class="badge-text">{{ store.state.unreadCount }}条未读</text>
        </view>
        <text class="msg-arrow">></text>
      </view>
    </view>

    <!-- 我的订单 -->
    <view class="card-section">
      <view class="card-header" @tap="goOrderList('')">
        <text class="card-title">我的订单</text>
        <text class="card-more">查看全部 ></text>
      </view>
      <view class="order-tabs">
        <view class="order-tab" @tap="goOrderList('待付款')">
          <view class="tab-icon icon-pay"><wx-icon name="money" size="36" /></view>
          <text class="tab-text">待付款</text>
        </view>
        <view class="order-tab" @tap="goOrderList('待发货')">
          <view class="tab-icon icon-ship"><wx-icon name="box" size="36" /></view>
          <text class="tab-text">待发货</text>
        </view>
        <view class="order-tab" @tap="goOrderList('待收货')">
          <view class="tab-icon icon-receive"><wx-icon name="truck" size="36" /></view>
          <text class="tab-text">待收货</text>
        </view>
        <view class="order-tab" @tap="goOrderList('已完成')">
          <view class="tab-icon icon-done"><wx-icon name="check" size="36" /></view>
          <text class="tab-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="card-section">
      <view class="card-header">
        <text class="card-title">常用功能</text>
      </view>
      <view class="func-list">
        <view class="func-item" @tap="goPoints">
          <view class="func-icon"><wx-icon name="gift" size="44" /></view>
          <text class="func-text">积分商城</text>
        </view>
        <view class="func-item" @tap="goPointsDetail">
          <view class="func-icon"><wx-icon name="chart" size="44" /></view>
          <text class="func-text">积分明细</text>
        </view>
        <view class="func-item" @tap="goCollect">
          <view class="func-icon"><wx-icon name="star" size="44" /></view>
          <text class="func-text">我的收藏</text>
        </view>
        <view class="func-item" @tap="goHistory">
          <view class="func-icon"><wx-icon name="video" size="44" /></view>
          <text class="func-text">浏览视频历史</text>
        </view>
        <view class="func-item" @tap="goSubscribe">
          <view class="func-icon"><wx-icon name="bell" size="44" /></view>
          <text class="func-text">缺货订阅</text>
        </view>
        <view class="func-item" @tap="goAddress">
          <view class="func-icon"><wx-icon name="location" size="44" /></view>
          <text class="func-text">收货地址管理</text>
        </view>
      </view>
    </view>

    <view style="height: 40rpx;"></view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store,
      statusBarHeight: 20
    }
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
  },
  onShow() {
    // 刷新数据
  },
  methods: {
    formatCredit(num) {
      return (num / 10000).toFixed(1) + '万'
    },
    goSettings() {
      uni.showToast({ title: '设置功能开发中', icon: 'none' })
    },
    goMessage() {
      uni.navigateTo({ url: '/pages/message/index' })
    },
    goOrderList(status) {
      uni.navigateTo({ url: `/pages/order/list?status=${status}` })
    },
    goPoints() {
      uni.navigateTo({ url: '/pages/points/index' })
    },
    goPointsDetail() {
      uni.navigateTo({ url: '/pages/points/detail' })
    },
    goCollect() {
      uni.navigateTo({ url: '/pages/mine/collect' })
    },
    goHistory() {
      uni.navigateTo({ url: '/pages/mine/history' })
    },
    goSubscribe() {
      uni.navigateTo({ url: '/pages/mine/subscribe' })
    },
    goAddress() {
      uni.navigateTo({ url: '/pages/mine/address' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: calc(100vh - 100rpx);
  background: #f5f6fa;
}

.header-bg {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding-bottom: 24rpx;
  padding-top: 24rpx;
}

.user-card {
  margin: 0 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);

  .user-top {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-text {
      font-size: 44rpx;
      font-weight: 700;
      color: #2563EB;
      line-height: 1;
    }
  }

  .user-info {
    flex: 1;
    margin-left: 24rpx;

    .user-name {
      font-size: 34rpx;
      font-weight: 700;
      color: #fff;
    }

    .user-company {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 4rpx;
    }

    .user-level {
      margin-top: 8rpx;

      .level-text {
        font-size: 20rpx;
        color: #F59E0B;
        background: rgba(255, 255, 255, 0.9);
        padding: 2rpx 12rpx;
        border-radius: 8rpx;
      }
    }
  }

  .settings-btn {
    .settings-icon {
      font-size: 40rpx;
      color: #fff;
    }
  }

  .user-stats {
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .stat-num {
        font-size: 36rpx;
        font-weight: 700;
        color: #fff;
      }

      .stat-label {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.85);
        margin-top: 4rpx;
      }
    }

    .stat-divider {
      width: 1rpx;
      height: 60rpx;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.msg-entry {
  margin: 20rpx 24rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .msg-left {
    display: flex;
    align-items: center;

    .msg-icon {
      font-size: 36rpx;
      margin-right: 16rpx;
    }

    .msg-title {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }
  }

  .msg-right {
    display: flex;
    align-items: center;

    .msg-badge {
      background: #EF4444;
      padding: 4rpx 12rpx;
      border-radius: 12rpx;
      margin-right: 12rpx;

      .badge-text {
        font-size: 20rpx;
        color: #fff;
      }
    }

    .msg-arrow {
      font-size: 28rpx;
      color: #9CA3AF;
    }
  }
}

.card-section {
  margin: 0 24rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border-bottom: 1rpx solid #f0f0f0;

    .card-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
    }

    .card-more {
      font-size: 24rpx;
      color: #9CA3AF;
    }
  }
}

.order-tabs {
  display: flex;
  padding: 24rpx 0;

  .order-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tab-icon {
      font-size: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-bottom: 4rpx;

      &.icon-pay { color: #fff; background: #F59E0B; }
      &.icon-ship { color: #fff; background: #3B82F6; }
      &.icon-receive { color: #fff; background: #10B981; }
      &.icon-done { color: #fff; background: #8B5CF6; }
    }

    .tab-text {
      font-size: 24rpx;
      color: #6B7280;
      margin-top: 8rpx;
    }
  }
}

.func-list {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx 0 8rpx;

  .func-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 25%;
    padding: 24rpx 8rpx;
    box-sizing: border-box;

    .func-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      background: rgba(37, 99, 235, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14rpx;
      color: #2563EB;
      font-size: 44rpx;
    }

    .func-text {
      font-size: 24rpx;
      color: #1f2937;
      text-align: center;
      line-height: 1.3;
    }
  }
}
</style>
