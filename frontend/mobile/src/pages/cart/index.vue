<template>
  <view class="page">
    <!-- 购物车列表 -->
    <scroll-view scroll-y class="cart-scroll" v-if="store.state.cart.length > 0">
      <view v-for="(item, idx) in store.state.cart" :key="idx" class="cart-item">
        <!-- 选择框 -->
        <view class="check-box" @tap="store.toggleSelect(item.productId)">
          <view class="check-circle" :class="{ checked: item.selected }">
            <text v-if="item.selected" class="check-icon"><wx-icon name="check" size="24" /></text>
          </view>
        </view>

        <!-- 商品图 -->
        <image class="item-img" :src="item.image" mode="aspectFill" />

        <!-- 商品信息 -->
        <view class="item-info">
          <text class="item-name ellipsis">{{ item.name }}</text>
          <text class="item-spec">{{ item.spec }}</text>
          <view class="item-bottom">
            <text class="item-price">¥{{ item.price.toFixed(2) }}</text>
            <view class="qty-control">
              <view class="qty-btn" @tap="changeQty(item, -1)">
                <text class="qty-btn-text">-</text>
              </view>
              <text class="qty-num">{{ item.quantity }}</text>
              <view class="qty-btn" @tap="changeQty(item, 1)">
                <text class="qty-btn-text">+</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 删除按钮 -->
        <view class="item-delete" @tap="deleteItem(item.productId)">
          <text class="delete-text">删除</text>
        </view>
      </view>

      <!-- 积分抵扣选项 -->
      <view class="points-deduct">
        <view class="pd-left">
          <text class="pd-title">积分抵扣</text>
          <text class="pd-desc">可用{{ store.state.user.points }}积分抵扣¥{{ pointsDeduct.toFixed(2) }}</text>
        </view>
        <switch :checked="usePoints" @change="togglePoints" color="#2563EB" />
      </view>

      <!-- 优惠明细 -->
      <view class="discount-info">
        <view class="di-row">
          <text class="di-label">商品总额</text>
          <text class="di-value">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
        <view class="di-row">
          <text class="di-label">满减优惠</text>
          <text class="di-value text-danger">-¥{{ discountAmount.toFixed(2) }}</text>
        </view>
        <view class="di-row">
          <text class="di-label">积分抵扣</text>
          <text class="di-value text-danger">-¥{{ usePoints ? pointsDeduct.toFixed(2) : '0.00' }}</text>
        </view>
        <view class="di-row total">
          <text class="di-label">应付金额</text>
          <text class="di-total">¥{{ finalAmount.toFixed(2) }}</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="store.state.cart.length > 0">
      <view class="bb-left" @tap="toggleAll">
        <view class="check-circle" :class="{ checked: allSelected }">
          <text v-if="allSelected" class="check-icon"><wx-icon name="check" size="24" /></text>
        </view>
        <text class="bb-all-text">全选</text>
      </view>
      <view class="bb-center">
        <text class="bb-label">合计:</text>
        <text class="bb-total">¥{{ finalAmount.toFixed(2) }}</text>
      </view>
      <view class="bb-btn" :class="{ disabled: selectedCount === 0 }" @tap="goCheckout">
        <text class="bb-btn-text">结算({{ selectedCount }})</text>
      </view>
    </view>

    <!-- 空购物车 -->
    <view class="empty-cart" v-if="store.state.cart.length === 0">
      <text class="empty-icon"><wx-icon name="cart" size="120" /></text>
      <text class="empty-text">购物车空空如也</text>
      <view class="empty-btn" @tap="goShopping">
        <text class="empty-btn-text">去逛逛</text>
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
      usePoints: false
    }
  },
  computed: {
    selectedItems() {
      return store.getSelectedItems()
    },
    selectedCount() {
      return this.selectedItems.length
    },
    allSelected() {
      return store.state.cart.length > 0 && store.state.cart.every(item => item.selected)
    },
    totalAmount() {
      return this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    discountAmount() {
      if (this.totalAmount >= 200) return 30
      return 0
    },
    pointsDeduct() {
      return Math.min(this.store.state.user.points / 100, this.totalAmount)
    },
    finalAmount() {
      let amount = this.totalAmount - this.discountAmount
      if (this.usePoints) amount -= this.pointsDeduct
      return Math.max(0, amount)
    }
  },
  methods: {
    changeQty(item, delta) {
      const newQty = item.quantity + delta
      if (newQty < 1) {
        uni.showModal({
          title: '提示',
          content: '确定要删除该商品吗？',
          success: (res) => {
            if (res.confirm) store.removeFromCart(item.productId)
          }
        })
        return
      }
      store.updateCartQuantity(item.productId, newQty)
    },
    deleteItem(productId) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) store.removeFromCart(productId)
        }
      })
    },
    togglePoints(e) {
      this.usePoints = e.detail.value
    },
    toggleAll() {
      store.toggleSelectAll(!this.allSelected)
    },
    goCheckout() {
      if (this.selectedCount === 0) {
        uni.showToast({ title: '请选择商品', icon: 'none' })
        return
      }
      uni.navigateTo({ url: `/pages/order/checkout?usePoints=${this.usePoints}&pointsDeduct=${this.usePoints ? this.pointsDeduct : 0}` })
    },
    goShopping() {
      uni.switchTab({ url: '/pages/index/index' })
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
  padding-bottom: env(safe-area-inset-bottom);
}

.cart-scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;

  .check-box {
    margin-right: 16rpx;
  }

  .check-circle {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 2rpx solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;

    &.checked {
      background: #2563EB;
      border-color: #2563EB;
    }

    .check-icon {
      color: #fff;
      font-size: 24rpx;
    }
  }

  .item-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .item-img-text {
      font-size: 48rpx;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.3);
    }
  }

  .item-info {
    flex: 1;
    margin-left: 16rpx;

    .item-name {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .item-spec {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .item-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12rpx;

      .item-price {
        font-size: 32rpx;
        color: #EF4444;
        font-weight: 700;
      }

      .qty-control {
        display: flex;
        align-items: center;

        .qty-btn {
          width: 48rpx;
          height: 48rpx;
          background: #f3f4f6;
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          .qty-btn-text {
            font-size: 28rpx;
            color: #6B7280;
          }
        }

        .qty-num {
          font-size: 28rpx;
          color: #1f2937;
          width: 60rpx;
          text-align: center;
        }
      }
    }
  }

  .item-delete {
    position: absolute;
    top: 16rpx;
    right: 16rpx;

    .delete-text {
      font-size: 22rpx;
      color: #EF4444;
    }
  }
}

.points-deduct {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;

  .pd-left {
    .pd-title {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .pd-desc {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }
  }
}

.discount-info {
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;

  .di-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 0;

    .di-label {
      font-size: 26rpx;
      color: #6B7280;
    }

    .di-value {
      font-size: 26rpx;
      color: #1f2937;
    }

    &.total {
      border-top: 1rpx solid #f0f0f0;
      margin-top: 8rpx;
      padding-top: 16rpx;

      .di-label {
        font-size: 28rpx;
        color: #1f2937;
        font-weight: 500;
      }

      .di-total {
        font-size: 36rpx;
        color: #EF4444;
        font-weight: 700;
      }
    }
  }
}

.bottom-bar {
  flex-shrink: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .bb-left {
    display: flex;
    align-items: center;

    .check-circle {
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      border: 2rpx solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12rpx;

      &.checked {
        background: #2563EB;
        border-color: #2563EB;
      }

      .check-icon {
        color: #fff;
        font-size: 24rpx;
      }
    }

    .bb-all-text {
      font-size: 26rpx;
      color: #6B7280;
    }
  }

  .bb-center {
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
    padding: 0 48rpx;
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

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .empty-icon {
    font-size: 120rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #9CA3AF;
    margin-top: 20rpx;
  }

  .empty-btn {
    margin-top: 30rpx;
    background: #2563EB;
    padding: 16rpx 48rpx;
    border-radius: 36rpx;

    .empty-btn-text {
      font-size: 28rpx;
      color: #fff;
    }
  }
}
</style>
