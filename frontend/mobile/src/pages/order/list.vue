<template>
  <view class="page">
    <!-- 标签筛选 -->
    <view class="tab-bar">
      <view v-for="(tab, idx) in typeTabs" :key="idx" class="tab-item" :class="{ active: currentType === idx }" @tap="switchType(idx)">
        <text class="tab-text" :class="{ active: currentType === idx }">{{ tab }}</text>
      </view>
    </view>

    <!-- 状态筛选 -->
    <scroll-view scroll-x class="status-scroll" show-scrollbar="false">
      <view class="status-list">
        <view v-for="(s, idx) in statusList" :key="idx" class="status-item" :class="{ active: currentStatus === idx }" @tap="switchStatus(idx)">
          <text class="status-text" :class="{ active: currentStatus === idx }">{{ s }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-scroll">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card" @tap="goDetail(order)">
        <view class="order-header">
          <text class="order-id">{{ order.id }}</text>
          <text class="order-status" :style="{ color: order.statusColor }">{{ order.status }}</text>
        </view>
        <view v-for="item in order.items" :key="item.productId" class="order-item">
          <image class="oi-img" :src="item.image" mode="aspectFill" />
          <view class="oi-info">
            <text class="oi-name ellipsis">{{ item.name }}</text>
            <text class="oi-spec">{{ item.spec }}</text>
          </view>
          <view class="oi-right">
            <text class="oi-price">¥{{ item.price.toFixed(2) }}</text>
            <text class="oi-qty">x{{ item.quantity }}</text>
          </view>
        </view>
        <view class="order-footer">
          <view class="order-total">
            <text class="total-label">共{{ order.items.length }}件商品 合计:</text>
            <text class="total-amount" v-if="order.type === '积分兑换'">{{ order.pointsUsed }}积分</text>
            <text class="total-amount" v-else>¥{{ order.totalPrice.toFixed(2) }}</text>
          </view>
          <view class="order-actions">
            <view v-if="order.status === '待付款'" class="action-btn primary" @tap.stop="payOrder(order)">
              <text class="action-text">去付款</text>
            </view>
            <view v-if="order.status === '待收货'" class="action-btn primary" @tap.stop="confirmReceive(order)">
              <text class="action-text">确认收货</text>
            </view>
            <view v-if="order.status === '待付款'" class="action-btn outline" @tap.stop="cancelOrder(order)">
              <text class="action-text">取消</text>
            </view>
            <view v-if="order.status === '已完成'" class="action-btn outline" @tap.stop="goAfterSale(order)">
              <text class="action-text">申请售后</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="filteredOrders.length === 0" class="empty">
        <text class="empty-icon"><wx-icon name="clipboard" size="120" /></text>
        <text class="empty-text">暂无相关订单</text>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mockOrders } from '../../mock/mockOrders.js'

export default {
  data() {
    return {
      currentType: 0,
      currentStatus: 0,
      typeTabs: ['全部', '采购订单', '积分兑换'],
      statusList: ['全部', '待付款', '待发货', '待收货', '已完成', '已取消'],
      orders: mockOrders
    }
  },
  computed: {
    filteredOrders() {
      let list = [...this.orders]
      const type = this.typeTabs[this.currentType]
      if (type !== '全部') {
        list = list.filter(o => o.type === type)
      }
      const status = this.statusList[this.currentStatus]
      if (status !== '全部') {
        list = list.filter(o => o.status === status)
      }
      return list
    }
  },
  onLoad(options) {
    if (options.status) {
      const idx = this.statusList.indexOf(options.status)
      if (idx > 0) this.currentStatus = idx
    }
  },
  methods: {
    switchType(idx) {
      this.currentType = idx
    },
    switchStatus(idx) {
      this.currentStatus = idx
    },
    goDetail(order) {
      uni.navigateTo({ url: `/pages/order/detail?id=${order.id}` })
    },
    payOrder(order) {
      uni.showToast({ title: '跳转支付...', icon: 'none' })
    },
    confirmReceive(order) {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品？',
        success: (res) => {
          if (res.confirm) {
            order.status = '已完成'
            order.statusColor = '#10B981'
            uni.showToast({ title: '确认成功', icon: 'success' })
          }
        }
      })
    },
    cancelOrder(order) {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            order.status = '已取消'
            order.statusColor = '#9CA3AF'
            uni.showToast({ title: '已取消', icon: 'success' })
          }
        }
      })
    },
    goAfterSale(order) {
      uni.navigateTo({ url: `/pages/order/aftersale?orderId=${order.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 44px - 100rpx);
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.tab-bar {
  flex-shrink: 0;
  display: flex;
  background: #fff;
  height: 88rpx;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .tab-text {
      font-size: 28rpx;
      color: #6B7280;

      &.active {
        color: #2563EB;
        font-weight: 600;
      }
    }

    &.active {
      border-bottom: 4rpx solid #2563EB;
    }
  }
}

.status-scroll {
  flex-shrink: 0;
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  .status-list {
    display: flex;
    padding: 0 16rpx;
  }

  .status-item {
    display: inline-flex;
    padding: 10rpx 24rpx;
    margin-right: 12rpx;
    background: #f3f4f6;
    border-radius: 24rpx;

    &.active {
      background: #DBEAFE;
    }

    .status-text {
      font-size: 24rpx;
      color: #6B7280;

      &.active {
        color: #2563EB;
        font-weight: 600;
      }
    }
  }
}

.order-scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.order-card {
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .order-id {
      font-size: 24rpx;
      color: #9CA3AF;
    }

    .order-status {
      font-size: 26rpx;
      font-weight: 600;
    }
  }

  .order-item {
    display: flex;
    padding: 16rpx 24rpx;

    .oi-img {
      width: 80rpx;
      height: 80rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .oi-img-text {
        font-size: 32rpx;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.3);
      }
    }

    .oi-info {
      flex: 1;
      margin-left: 16rpx;

      .oi-name {
        font-size: 26rpx;
        color: #1f2937;
      }

      .oi-spec {
        font-size: 22rpx;
        color: #9CA3AF;
        margin-top: 4rpx;
      }
    }

    .oi-right {
      text-align: right;

      .oi-price {
        font-size: 26rpx;
        color: #1f2937;
      }

      .oi-qty {
        font-size: 22rpx;
        color: #9CA3AF;
      }
    }
  }

  .order-footer {
    padding: 16rpx 24rpx;
    border-top: 1rpx solid #f5f5f5;

    .order-total {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .total-label {
        font-size: 24rpx;
        color: #6B7280;
      }

      .total-amount {
        font-size: 30rpx;
        color: #EF4444;
        font-weight: 700;
        margin-left: 8rpx;
      }
    }

    .order-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16rpx;

      .action-btn {
        padding: 10rpx 24rpx;
        border-radius: 24rpx;
        margin-left: 12rpx;

        &.primary {
          background: #2563EB;

          .action-text {
            font-size: 24rpx;
            color: #fff;
          }
        }

        &.outline {
          border: 1rpx solid #d1d5db;

          .action-text {
            font-size: 24rpx;
            color: #6B7280;
          }
        }
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
