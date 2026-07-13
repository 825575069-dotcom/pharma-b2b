<template>
  <view class="page">
    <scroll-view scroll-y class="collect-scroll">
      <view v-for="product in collectedProducts" :key="product.id" class="product-card" @tap="goDetail(product)">
        <image class="product-img" :src="product.image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }} {{ product.spec }}</text>
          <text class="product-manufacturer">{{ product.manufacturer }}</text>
          <view class="product-tags">
            <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="product-tag">{{ tag }}</text>
          </view>
          <view class="product-bottom">
            <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
            <view class="cancel-btn" @tap.stop="cancelCollect(product)">
              <text class="cancel-text">取消收藏</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="collectedProducts.length === 0" class="empty">
        <text class="empty-icon"><wx-icon name="star" size="120" /></text>
        <text class="empty-text">暂无收藏商品</text>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mockProducts } from '../../mock/mockProducts.js'
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store,
      products: mockProducts
    }
  },
  computed: {
    collectedProducts() {
      return this.products.filter(p => p.isCollected)
    }
  },
  methods: {
    goDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    cancelCollect(product) {
      store.toggleCollect(product.id)
      uni.showToast({ title: '已取消收藏', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.collect-scroll {
  height: 100vh;
}

.product-card {
  display: flex;
  background: #fff;
  margin: 12rpx 16rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .product-img {
    width: 180rpx;
    height: 180rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .product-img-text {
      font-size: 56rpx;
      font-weight: 700;
    }
  }

  .product-info {
    flex: 1;
    padding: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .product-name {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
      line-height: 1.4;
    }

    .product-manufacturer {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .product-tags {
      display: flex;
      margin-top: 4rpx;

      .product-tag {
        font-size: 18rpx;
        color: #2563EB;
        background: #DBEAFE;
        padding: 2rpx 8rpx;
        border-radius: 4rpx;
        margin-right: 6rpx;
      }
    }

    .product-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .product-price {
        font-size: 32rpx;
        color: #EF4444;
        font-weight: 700;
      }

      .cancel-btn {
        border: 1rpx solid #d1d5db;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;

        .cancel-text {
          font-size: 22rpx;
          color: #6B7280;
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
