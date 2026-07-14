<template>
  <view class="page">
    <!-- 积分余额展示 -->
    <view class="points-header">
      <view class="points-card">
        <text class="points-label">可用积分</text>
        <text class="points-num">{{ pointsData.total }}</text>
        <view class="points-expire">
          <text class="expire-text">{{ pointsData.expiring }}积分将于{{ pointsData.expiringDate }}过期</text>
        </view>
      </view>
    </view>

    <!-- 筛选 -->
    <view class="filter-bar">
      <view v-for="(tab, idx) in filterTabs" :key="idx" class="filter-item" :class="{ active: currentFilter === idx }" @tap="currentFilter = idx">
        <text class="filter-text" :class="{ active: currentFilter === idx }">{{ tab }}</text>
      </view>
    </view>

    <!-- 积分商品网格 -->
    <scroll-view scroll-y class="product-scroll">
      <view class="product-grid">
        <view v-for="product in filteredProducts" :key="product.id" class="product-card">
          <view class="product-img" style="position: relative;">
            <image :src="product.image" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
            <view v-if="product.hot" class="hot-tag">
              <text class="hot-text">HOT</text>
            </view>
          </view>
            <view class="product-info">
              <text class="product-name ellipsis-2">{{ product.name }}</text>
              <text class="product-spec">{{ product.spec }}</text>
              <view class="product-bottom">
                <view class="price-wrap">
                  <text class="points-price">{{ product.points }}积分</text>
                  <text v-if="product.cash > 0" class="cash-price">+¥{{ product.cash.toFixed(2) }}</text>
                </view>
                <text class="stock-text">库存{{ product.stock }}</text>
              </view>
              <view class="exchange-btn" @tap="goExchange(product)">
                <text class="exchange-text">立即兑换</text>
              </view>
            </view>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>

    <!-- 兑换确认弹窗 -->
    <view v-if="showExchange" class="popup-mask" @tap="showExchange = false">
      <view class="popup" @tap.stop>
        <text class="popup-title">确认兑换</text>
        <view class="popup-product">
          <image class="pp-img" :src="exchangeProduct.image" mode="aspectFill" />
          <view class="pp-info">
            <text class="pp-name">{{ exchangeProduct.name }}</text>
            <text class="pp-spec">{{ exchangeProduct.spec }}</text>
            <text class="pp-price">{{ exchangeProduct.points }}积分{{ exchangeProduct.cash > 0 ? ` +¥${exchangeProduct.cash.toFixed(2)}` : '' }}</text>
          </view>
        </view>
        <view class="popup-info">
          <text class="pi-label">当前积分</text>
          <text class="pi-value">{{ pointsData.total }}</text>
        </view>
        <view class="popup-info">
          <text class="pi-label">兑换后积分</text>
          <text class="pi-value">{{ pointsData.total - (exchangeProduct.points || 0) }}</text>
        </view>
        <view v-if="pointsData.total < (exchangeProduct.points || 0)" class="popup-warning">
          <text class="warning-text">积分不足，无法兑换</text>
        </view>
        <view class="popup-btns">
          <view class="popup-btn cancel" @tap="showExchange = false">
            <text class="btn-text">取消</text>
          </view>
          <view class="popup-btn confirm" :class="{ disabled: pointsData.total < (exchangeProduct.points || 0) }" @tap="confirmExchange">
            <text class="btn-text">确认兑换</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mockPoints } from '../../mock/mockPoints.js'

export default {
  data() {
    return {
      pointsData: mockPoints,
      currentFilter: 0,
      filterTabs: ['全部', '全额兑换', '积分+现金'],
      showExchange: false,
      exchangeProduct: {}
    }
  },
  computed: {
    filteredProducts() {
      if (this.currentFilter === 0) return this.pointsData.mallProducts
      const type = this.filterTabs[this.currentFilter]
      return this.pointsData.mallProducts.filter(p => p.type === type)
    }
  },
  methods: {
    goExchange(product) {
      this.exchangeProduct = product
      this.showExchange = true
    },
    confirmExchange() {
      if (this.pointsData.total < this.exchangeProduct.points) {
        uni.showToast({ title: '积分不足', icon: 'none' })
        return
      }
      this.pointsData.total -= this.exchangeProduct.points
      this.showExchange = false
      uni.showToast({ title: '兑换成功', icon: 'success' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.points-header {
  flex-shrink: 0;
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  padding: 40rpx 24rpx;

  .points-card {
    text-align: center;

    .points-label {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .points-num {
      font-size: 64rpx;
      font-weight: 700;
      color: #fff;
      margin-top: 8rpx;
    }

    .points-expire {
      margin-top: 12rpx;

      .expire-text {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.filter-bar {
  flex-shrink: 0;
  display: flex;
  background: #fff;
  padding: 16rpx 0;

  .filter-item {
    flex: 1;
    text-align: center;

    .filter-text {
      font-size: 26rpx;
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

.product-scroll {
  flex: 1;
  height: auto;
  min-height: 0;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx;

  .product-card {
    width: 48.5%;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 16rpx;
  }

  .product-img {
    position: relative;
    width: 100%;
    height: 260rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .product-img-text {
      font-size: 72rpx;
      font-weight: 700;
    }

    .hot-tag {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      background: #EF4444;
      padding: 4rpx 10rpx;
      border-radius: 6rpx;

      .hot-text {
        font-size: 18rpx;
        color: #fff;
      }
    }
  }

  .product-info {
    padding: 14rpx;
  }

  .product-name {
    font-size: 26rpx;
    color: #1f2937;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
  }

  .product-spec {
    font-size: 20rpx;
    color: #9CA3AF;
    margin-top: 4rpx;
  }

  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8rpx;

    .price-wrap {
      display: flex;
      flex-direction: column;

      .points-price {
        font-size: 28rpx;
        color: #F59E0B;
        font-weight: 700;
      }

      .cash-price {
        font-size: 20rpx;
        color: #6B7280;
      }
    }

    .stock-text {
      font-size: 20rpx;
      color: #9CA3AF;
    }
  }

  .exchange-btn {
    margin-top: 12rpx;
    background: #2563EB;
    padding: 10rpx 0;
    border-radius: 24rpx;
    text-align: center;

    .exchange-text {
      font-size: 24rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .popup {
    width: 600rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;

    .popup-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      display: block;
      margin-bottom: 24rpx;
    }

    .popup-product {
      display: flex;
      align-items: center;
      background: #f9fafb;
      border-radius: 12rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;

      .pp-img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .pp-img-text {
          font-size: 32rpx;
          font-weight: 700;
        }
      }

      .pp-info {
        flex: 1;
        margin-left: 16rpx;

        .pp-name {
          font-size: 28rpx;
          color: #1f2937;
        }

        .pp-spec {
          font-size: 22rpx;
          color: #9CA3AF;
          margin-top: 4rpx;
        }

        .pp-price {
          font-size: 26rpx;
          color: #F59E0B;
          font-weight: 600;
          margin-top: 6rpx;
        }
      }
    }

    .popup-info {
      display: flex;
      justify-content: space-between;
      padding: 12rpx 0;

      .pi-label {
        font-size: 26rpx;
        color: #6B7280;
      }

      .pi-value {
        font-size: 26rpx;
        color: #1f2937;
        font-weight: 600;
      }
    }

    .popup-warning {
      text-align: center;
      padding: 12rpx;

      .warning-text {
        font-size: 24rpx;
        color: #EF4444;
      }
    }

    .popup-btns {
      display: flex;
      gap: 16rpx;
      margin-top: 24rpx;

      .popup-btn {
        flex: 1;
        height: 76rpx;
        border-radius: 38rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &.cancel {
          background: #f3f4f6;

          .btn-text {
            font-size: 28rpx;
            color: #6B7280;
          }
        }

        &.confirm {
          background: #2563EB;

          &.disabled {
            background: #9CA3AF;
          }

          .btn-text {
            font-size: 28rpx;
            color: #fff;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
