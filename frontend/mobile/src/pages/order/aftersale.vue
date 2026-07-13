<template>
  <view class="page">
    <scroll-view scroll-y class="form-scroll">
      <!-- 选择退款商品 -->
      <view class="section">
        <text class="section-title">选择退款商品</text>
        <view v-for="item in order.items" :key="item.productId" class="refund-item" @tap="toggleItem(item.productId)">
          <view class="check-circle" :class="{ checked: selectedItems.includes(item.productId) }">
            <text v-if="selectedItems.includes(item.productId)" class="check-icon"><wx-icon name="check" size="24" /></text>
          </view>
          <image class="ri-img" :src="item.image" mode="aspectFill" />
          <view class="ri-info">
            <text class="ri-name">{{ item.name }}</text>
            <text class="ri-spec">{{ item.spec }}</text>
            <text class="ri-price">¥{{ item.price.toFixed(2) }} x{{ item.quantity }}</text>
          </view>
        </view>
      </view>

      <!-- 退款原因 -->
      <view class="section">
        <text class="section-title">退款原因</text>
        <view v-for="(reason, idx) in reasons" :key="idx" class="reason-item" @tap="selectReason(idx)">
          <view class="radio" :class="{ checked: selectedReason === idx }">
            <view v-if="selectedReason === idx" class="radio-dot"></view>
          </view>
          <text class="reason-text">{{ reason }}</text>
        </view>
      </view>

      <!-- 退款说明 -->
      <view class="section">
        <text class="section-title">退款说明</text>
        <textarea class="refund-textarea" placeholder="请输入退款说明（选填）" v-model="description" maxlength="200" />
        <text class="char-count">{{ description.length }}/200</text>
      </view>

      <!-- 退款金额 -->
      <view class="section">
        <view class="amount-row">
          <text class="amount-label">退款金额</text>
          <text class="amount-value">¥{{ refundAmount.toFixed(2) }}</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部提交 -->
    <view class="bottom-bar">
      <view class="bb-btn" @tap="submitRefund">
        <text class="btn-text">提交申请</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mockOrders } from '../../mock/mockOrders.js'

export default {
  data() {
    return {
      order: {},
      selectedItems: [],
      selectedReason: -1,
      description: '',
      reasons: [
        '商品质量问题',
        '商品过期/临期',
        '发错/漏发商品',
        '商品包装破损',
        '不想要了',
        '其他原因'
      ]
    }
  },
  computed: {
    refundAmount() {
      return this.order.items?.filter(i => this.selectedItems.includes(i.productId)).reduce((sum, i) => sum + i.price * i.quantity, 0) || 0
    }
  },
  onLoad(options) {
    const order = mockOrders.find(o => o.id === options.orderId)
    if (order) {
      this.order = order
    }
  },
  methods: {
    toggleItem(productId) {
      const idx = this.selectedItems.indexOf(productId)
      if (idx > -1) {
        this.selectedItems.splice(idx, 1)
      } else {
        this.selectedItems.push(productId)
      }
    },
    selectReason(idx) {
      this.selectedReason = idx
    },
    submitRefund() {
      if (this.selectedItems.length === 0) {
        uni.showToast({ title: '请选择退款商品', icon: 'none' })
        return
      }
      if (this.selectedReason === -1) {
        uni.showToast({ title: '请选择退款原因', icon: 'none' })
        return
      }
      uni.showModal({
        title: '确认提交',
        content: `退款金额¥${this.refundAmount.toFixed(2)}，确认提交售后申请？`,
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '提交成功', icon: 'success' })
            setTimeout(() => uni.redirectTo({ url: '/pages/order/list' }), 1500)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.form-scroll {
  height: calc(100vh - 110rpx);
}

.section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16rpx;
    display: block;
  }
}

.refund-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .check-circle {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;

    &.checked {
      background: #2563EB;
      border-color: #2563EB;
    }

    .check-icon {
      color: #fff;
      font-size: 22rpx;
    }
  }

  .ri-img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .ri-img-text {
      font-size: 32rpx;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  .ri-info {
    flex: 1;
    margin-left: 16rpx;

    .ri-name {
      font-size: 26rpx;
      color: #1f2937;
    }

    .ri-spec {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .ri-price {
      font-size: 24rpx;
      color: #EF4444;
      margin-top: 4rpx;
    }
  }
}

.reason-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .radio {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 2rpx solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;

    &.checked {
      border-color: #2563EB;
    }

    .radio-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background: #2563EB;
    }
  }

  .reason-text {
    font-size: 28rpx;
    color: #1f2937;
  }
}

.refund-textarea {
  width: 100%;
  height: 200rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.char-count {
  text-align: right;
  font-size: 22rpx;
  color: #9CA3AF;
  margin-top: 8rpx;
  display: block;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .amount-label {
    font-size: 28rpx;
    color: #1f2937;
  }

  .amount-value {
    font-size: 40rpx;
    color: #EF4444;
    font-weight: 700;
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
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .bb-btn {
    flex: 1;
    height: 76rpx;
    background: #2563EB;
    border-radius: 38rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-text {
      font-size: 30rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
