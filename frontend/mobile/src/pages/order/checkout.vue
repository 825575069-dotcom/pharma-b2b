<template>
  <view class="page">
    <scroll-view scroll-y class="checkout-scroll">
      <!-- 收货地址选择 -->
      <view class="address-section" @tap="showAddressPicker = !showAddressPicker">
        <view v-if="selectedAddress" class="address-card">
          <view class="addr-top">
            <text class="addr-name">{{ selectedAddress.name }}</text>
            <text class="addr-phone">{{ selectedAddress.phone }}</text>
            <view class="addr-tag" v-if="selectedAddress.isDefault">
              <text class="tag-text">默认</text>
            </view>
          </view>
          <text class="addr-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.district }}{{ selectedAddress.detail }}</text>
        </view>
        <view v-else class="no-address">
          <text class="no-addr-text">请选择收货地址</text>
        </view>
        <text class="addr-arrow"><wx-icon name="arrow" size="28" /></text>
      </view>

      <!-- 地址选择弹窗 -->
      <view v-if="showAddressPicker" class="addr-picker-mask" @tap="showAddressPicker = false">
        <view class="addr-picker" @tap.stop>
          <view class="picker-header">
            <text class="picker-title">选择收货地址</text>
          </view>
          <view v-for="addr in store.state.user.address" :key="addr.id" class="picker-item" @tap="selectAddress(addr)">
            <view class="pi-info">
              <view class="pi-top">
                <text class="pi-name">{{ addr.name }}</text>
                <text class="pi-phone">{{ addr.phone }}</text>
                <view v-if="addr.isDefault" class="pi-tag">
                  <text class="pi-tag-text">默认</text>
                </view>
              </view>
              <text class="pi-addr">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 支付方式选择 -->
      <view class="section">
        <text class="section-title">支付方式</text>
        <view v-for="(method, idx) in payMethods" :key="idx" class="pay-item" @tap="selectPayMethod(idx)">
          <view class="pay-radio" :class="{ checked: selectedPayMethod === idx }">
            <view v-if="selectedPayMethod === idx" class="radio-dot"></view>
          </view>
          <text class="pay-icon"><wx-icon :name="method.icon" size="36" /></text>
          <view class="pay-info">
            <text class="pay-name">{{ method.name }}</text>
            <text class="pay-desc">{{ method.desc }}</text>
          </view>
          <text v-if="method.extra" class="pay-extra" :class="{ warning: method.warning }">{{ method.extra }}</text>
        </view>
      </view>

      <!-- 账期额度提示 -->
      <view v-if="selectedPayMethod === 3" class="credit-warning">
        <text class="warning-icon"><wx-icon name="warning" size="32" /></text>
        <view class="warning-info">
          <text class="warning-text">当前账期可用额度: ¥{{ formatNum(store.state.user.creditAvailable) }}</text>
          <text class="warning-desc" v-if="totalAmount > store.state.user.creditAvailable">超出可用额度，无法使用账期赊购</text>
        </view>
      </view>

      <!-- 订单明细 -->
      <view class="section">
        <text class="section-title">商品明细</text>
        <view v-for="item in cartItems" :key="item.productId" class="order-item">
          <image class="oi-img" :src="item.image" mode="aspectFill" />
          <view class="oi-info">
            <text class="oi-name ellipsis">{{ item.name }}</text>
            <text class="oi-spec">{{ item.spec }}</text>
            <view class="oi-bottom">
              <text class="oi-price">¥{{ item.price.toFixed(2) }}</text>
              <text class="oi-qty">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 费用明细 -->
      <view class="section">
        <text class="section-title">费用明细</text>
        <view class="fee-row">
          <text class="fee-label">商品总额</text>
          <text class="fee-value">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">满减优惠</text>
          <text class="fee-value text-danger">-¥{{ discountAmount.toFixed(2) }}</text>
        </view>
        <view class="fee-row" v-if="pointsDeduct > 0">
          <text class="fee-label">积分抵扣</text>
          <text class="fee-value text-danger">-¥{{ pointsDeduct.toFixed(2) }}</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">运费</text>
          <text class="fee-value">¥0.00</text>
        </view>
        <view class="fee-row total">
          <text class="fee-label">应付金额</text>
          <text class="fee-total">¥{{ finalAmount.toFixed(2) }}</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="bottom-bar">
      <view class="bb-left">
        <text class="bb-label">合计:</text>
        <text class="bb-total">¥{{ finalAmount.toFixed(2) }}</text>
      </view>
      <view class="bb-btn" :class="{ disabled: !canSubmit }" @tap="submitOrder">
        <text class="bb-btn-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store,
      showAddressPicker: false,
      selectedAddress: null,
      selectedPayMethod: 0,
      pointsDeduct: 0,
      payMethods: [
        { name: '线上支付', desc: '微信/支付宝扫码支付', icon: 'money', extra: '' },
        { name: '对公转账', desc: '银行转账，需上传凭证', icon: 'bank', extra: '' },
        { name: '找人代付', desc: '分享给微信好友代为付款', icon: 'people', extra: '' },
        { name: '账期赊购', desc: '先发货后付款，需有可用额度', icon: 'calendar', extra: '', warning: false }
      ]
    }
  },
  computed: {
    cartItems() {
      const items = store.getSelectedItems()
      if (items.length === 0) {
        // 如果购物车没有选中项，显示全部
        return store.state.cart
      }
      return items
    },
    totalAmount() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    discountAmount() {
      if (this.totalAmount >= 200) return 30
      return 0
    },
    finalAmount() {
      return Math.max(0, this.totalAmount - this.discountAmount - this.pointsDeduct)
    },
    canSubmit() {
      if (this.selectedPayMethod === 3 && this.finalAmount > this.store.state.user.creditAvailable) {
        return false
      }
      return this.cartItems.length > 0 && this.selectedAddress
    }
  },
  onLoad(options) {
    this.selectedAddress = this.store.state.user.address.find(a => a.isDefault) || this.store.state.user.address[0]
    if (options.usePoints === 'true') {
      this.pointsDeduct = parseFloat(options.pointsDeduct) || 0
    }
    // Update pay method extra
    this.payMethods[3].extra = `额度¥${this.formatNum(this.store.state.user.creditAvailable)}`
  },
  methods: {
    formatNum(num) {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    selectAddress(addr) {
      this.selectedAddress = addr
      this.showAddressPicker = false
    },
    selectPayMethod(idx) {
      this.selectedPayMethod = idx
    },
    submitOrder() {
      if (!this.canSubmit) {
        uni.showToast({ title: '请检查订单信息', icon: 'none' })
        return
      }
      uni.showModal({
        title: '确认提交',
        content: `提交订单，应付¥${this.finalAmount.toFixed(2)}？`,
        success: (res) => {
          if (res.confirm) {
            // 清空已选购物车
            const items = [...this.cartItems]
            items.forEach(item => store.removeFromCart(item.productId))
            uni.showToast({ title: '订单提交成功', icon: 'success' })
            setTimeout(() => {
              uni.redirectTo({ url: '/pages/order/list' })
            }, 1500)
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

.checkout-scroll {
  height: calc(100vh - 110rpx);
}

.address-section {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .address-card {
    flex: 1;

    .addr-top {
      display: flex;
      align-items: center;

      .addr-name {
        font-size: 30rpx;
        color: #1f2937;
        font-weight: 600;
      }

      .addr-phone {
        font-size: 26rpx;
        color: #6B7280;
        margin-left: 16rpx;
      }

      .addr-tag {
        background: #2563EB;
        padding: 2rpx 10rpx;
        border-radius: 6rpx;
        margin-left: 12rpx;

        .tag-text {
          font-size: 18rpx;
          color: #fff;
        }
      }
    }

    .addr-detail {
      font-size: 24rpx;
      color: #6B7280;
      margin-top: 8rpx;
    }
  }

  .no-address {
    flex: 1;

    .no-addr-text {
      font-size: 28rpx;
      color: #9CA3AF;
    }
  }

  .addr-arrow {
    font-size: 40rpx;
    color: #9CA3AF;
    margin-left: 16rpx;
  }
}

.addr-picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;

  .addr-picker {
    width: 100%;
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 24rpx;
    padding-bottom: env(safe-area-inset-bottom);

    .picker-header {
      text-align: center;
      margin-bottom: 20rpx;

      .picker-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #1f2937;
      }
    }

    .picker-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .pi-top {
        display: flex;
        align-items: center;

        .pi-name {
          font-size: 28rpx;
          color: #1f2937;
          font-weight: 600;
        }

        .pi-phone {
          font-size: 26rpx;
          color: #6B7280;
          margin-left: 16rpx;
        }

        .pi-tag {
          background: #2563EB;
          padding: 2rpx 10rpx;
          border-radius: 6rpx;
          margin-left: 12rpx;

          .pi-tag-text {
            font-size: 18rpx;
            color: #fff;
          }
        }
      }

      .pi-addr {
        font-size: 24rpx;
        color: #6B7280;
        margin-top: 6rpx;
      }
    }
  }
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

.pay-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .pay-radio {
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

  .pay-icon {
    font-size: 36rpx;
    margin-right: 16rpx;
  }

  .pay-info {
    flex: 1;

    .pay-name {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .pay-desc {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }
  }

  .pay-extra {
    font-size: 22rpx;
    color: #6B7280;

    &.warning {
      color: #EF4444;
    }
  }
}

.credit-warning {
  display: flex;
  align-items: center;
  background: #FEF3C7;
  padding: 20rpx 24rpx;
  margin: 0 0 16rpx;
  border-radius: 12rpx;
  margin-left: 24rpx;
  margin-right: 24rpx;

  .warning-icon {
    font-size: 32rpx;
    color: #F59E0B;
    margin-right: 12rpx;
  }

  .warning-info {
    flex: 1;

    .warning-text {
      font-size: 24rpx;
      color: #92400E;
    }

    .warning-desc {
      font-size: 22rpx;
      color: #EF4444;
      margin-top: 4rpx;
    }
  }
}

.order-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .oi-img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .oi-img-text {
      font-size: 36rpx;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  .oi-info {
    flex: 1;
    margin-left: 16rpx;

    .oi-name {
      font-size: 28rpx;
      color: #1f2937;
    }

    .oi-spec {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .oi-bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 8rpx;

      .oi-price {
        font-size: 28rpx;
        color: #EF4444;
        font-weight: 600;
      }

      .oi-qty {
        font-size: 24rpx;
        color: #6B7280;
      }
    }
  }
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 0;

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
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .bb-left {
    flex: 1;
    text-align: right;
    margin-right: 24rpx;

    .bb-label {
      font-size: 26rpx;
      color: #6B7280;
    }

    .bb-total {
      font-size: 36rpx;
      color: #EF4444;
      font-weight: 700;
    }
  }

  .bb-btn {
    background: #2563EB;
    padding: 0 56rpx;
    height: 72rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.disabled {
      background: #9CA3AF;
    }

    .bb-btn-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
