<template>
  <view class="page">
    <scroll-view scroll-y class="detail-scroll">
      <!-- 订单状态 -->
      <view class="status-section" :style="{ background: order.statusColor }">
        <text class="status-text">{{ order.status }}</text>
        <text class="status-desc" v-if="order.status === '待收货'">商品已发出，请耐心等待</text>
        <text class="status-desc" v-else-if="order.status === '已完成'">订单已完成，感谢您的惠顾</text>
        <text class="status-desc" v-else-if="order.status === '已取消'">取消原因：{{ order.cancelReason || '用户主动取消' }}</text>
        <text class="status-desc" v-else-if="order.status === '待付款'">请尽快完成付款</text>
        <text class="status-desc" v-else-if="order.status === '待发货'">商家正在备货中</text>
      </view>

      <!-- 物流轨迹 -->
      <view v-if="order.logistics" class="section">
        <view class="section-header">
          <text class="section-title">物流信息</text>
          <text class="logistics-company">{{ order.logistics.company }} {{ order.logistics.trackingNo }}</text>
        </view>
        <view class="logistics-timeline">
          <view v-for="(trace, idx) in order.logistics.traces" :key="idx" class="timeline-item">
            <view class="timeline-dot" :class="{ first: idx === 0 }"></view>
            <view class="timeline-line" v-if="idx < order.logistics.traces.length - 1"></view>
            <view class="timeline-content">
              <text class="trace-content">{{ trace.content }}</text>
              <text class="trace-time">{{ trace.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 商品明细 -->
      <view class="section">
        <text class="section-title">商品明细</text>
        <view v-for="item in order.items" :key="item.productId" class="order-item">
          <image class="oi-img" :src="item.image" mode="aspectFill" />
          <view class="oi-info">
            <text class="oi-name">{{ item.name }}</text>
            <text class="oi-spec">{{ item.spec }}</text>
          </view>
          <view class="oi-right">
            <text class="oi-price">¥{{ item.price.toFixed(2) }}</text>
            <text class="oi-qty">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>

      <!-- 费用明细 -->
      <view class="section">
        <text class="section-title">费用明细</text>
        <view class="fee-row">
          <text class="fee-label">商品总额</text>
          <text class="fee-value">¥{{ (order.totalPrice + order.discountAmount).toFixed(2) }}</text>
        </view>
        <view class="fee-row" v-if="order.discountAmount > 0">
          <text class="fee-label">优惠减免</text>
          <text class="fee-value text-danger">-¥{{ order.discountAmount.toFixed(2) }}</text>
        </view>
        <view class="fee-row" v-if="order.pointsUsed > 0">
          <text class="fee-label">积分抵扣</text>
          <text class="fee-value text-danger">-{{ order.pointsUsed }}积分</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">运费</text>
          <text class="fee-value">¥0.00</text>
        </view>
        <view class="fee-row total">
          <text class="fee-label">实付金额</text>
          <text class="fee-total" v-if="order.type === '积分兑换'">{{ order.pointsUsed }}积分</text>
          <text class="fee-total" v-else>¥{{ order.totalPrice.toFixed(2) }}</text>
        </view>
        <view class="fee-row" v-if="order.pointsEarned > 0">
          <text class="fee-label">获得积分</text>
          <text class="fee-value text-success">+{{ order.pointsEarned }}</text>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="section">
        <text class="section-title">订单信息</text>
        <view class="info-row">
          <text class="info-label">订单编号</text>
          <text class="info-value">{{ order.id }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">订单类型</text>
          <text class="info-value">{{ order.type }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">下单时间</text>
          <text class="info-value">{{ order.createTime }}</text>
        </view>
        <view class="info-row" v-if="order.payTime">
          <text class="info-label">支付时间</text>
          <text class="info-value">{{ order.payTime }}</text>
        </view>
        <view class="info-row" v-if="order.payMethod">
          <text class="info-label">支付方式</text>
          <text class="info-value">{{ order.payMethod }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">收货地址</text>
          <text class="info-value" style="flex: 1; text-align: right;">{{ order.address }}</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" v-if="order.status">
      <view v-if="order.status === '待付款'" class="bb-btn outline" @tap="cancelOrder">
        <text class="btn-text">取消订单</text>
      </view>
      <view v-if="order.status === '待付款'" class="bb-btn primary" @tap="payOrder">
        <text class="btn-text">去付款</text>
      </view>
      <view v-if="order.status === '待收货'" class="bb-btn primary" @tap="confirmReceive">
        <text class="btn-text">确认收货</text>
      </view>
      <view v-if="order.status === '已完成'" class="bb-btn outline" @tap="goAfterSale">
        <text class="btn-text">申请售后</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mockOrders } from '../../mock/mockOrders.js'

export default {
  data() {
    return {
      order: {}
    }
  },
  onLoad(options) {
    const order = mockOrders.find(o => o.id === options.id)
    if (order) {
      this.order = order
      uni.setNavigationBarTitle({ title: '订单详情' })
    }
  },
  methods: {
    cancelOrder() {
      uni.showModal({
        title: '取消订单',
        content: '确定要取消该订单吗？',
        success: (res) => {
          if (res.confirm) {
            this.order.status = '已取消'
            this.order.statusColor = '#9CA3AF'
            uni.showToast({ title: '已取消', icon: 'success' })
          }
        }
      })
    },
    payOrder() {
      uni.showToast({ title: '跳转支付...', icon: 'none' })
    },
    confirmReceive() {
      uni.showModal({
        title: '确认收货',
        content: '确认已收到商品？',
        success: (res) => {
          if (res.confirm) {
            this.order.status = '已完成'
            this.order.statusColor = '#10B981'
            uni.showToast({ title: '确认成功', icon: 'success' })
          }
        }
      })
    },
    goAfterSale() {
      uni.navigateTo({ url: `/pages/order/aftersale?orderId=${this.order.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.detail-scroll {
  height: calc(100vh - 110rpx);
}

.status-section {
  padding: 40rpx 24rpx;
  display: flex;
  flex-direction: column;

  .status-text {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
  }

  .status-desc {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 8rpx;
  }
}

.section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16rpx;
    display: block;
  }
}

.logistics-timeline {
  padding-left: 8rpx;

  .timeline-item {
    position: relative;
    padding-left: 32rpx;
    padding-bottom: 24rpx;

    &:last-child {
      padding-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: 0;
      top: 8rpx;
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: #d1d5db;

      &.first {
        background: #2563EB;
      }
    }

    .timeline-line {
      position: absolute;
      left: 7rpx;
      top: 28rpx;
      width: 2rpx;
      height: 100%;
      background: #e5e7eb;
    }

    .timeline-content {
      .trace-content {
        font-size: 26rpx;
        color: #1f2937;
      }

      .trace-time {
        font-size: 22rpx;
        color: #9CA3AF;
        margin-top: 4rpx;
        display: block;
      }
    }
  }
}

.logistics-company {
  font-size: 22rpx;
  color: #9CA3AF;
}

.order-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

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

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;

  .fee-label {
    font-size: 26rpx;
    color: #6B7280;
  }

  .fee-value {
    font-size: 26rpx;
    color: #1f2937;
  }

  &.total {
    border-top: 1rpx solid #f0f0f0;
    margin-top: 8rpx;
    padding-top: 16rpx;

    .fee-label {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .fee-total {
      font-size: 36rpx;
      color: #EF4444;
      font-weight: 700;
    }
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;

  .info-label {
    font-size: 26rpx;
    color: #9CA3AF;
  }

  .info-value {
    font-size: 26rpx;
    color: #1f2937;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24rpx;
  gap: 16rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .bb-btn {
    padding: 0 36rpx;
    height: 72rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.primary {
      background: #2563EB;
    }

    &.outline {
      border: 1rpx solid #d1d5db;
    }

    .btn-text {
      font-size: 26rpx;
      color: #2563EB;
    }

    &.primary .btn-text {
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
