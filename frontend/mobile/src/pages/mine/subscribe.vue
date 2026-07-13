<template>
  <view class="page">
    <scroll-view scroll-y class="sub-scroll">
      <view v-for="item in subscribeList" :key="item.productId" class="sub-card">
        <image class="sub-img" :src="item.image" mode="aspectFill" />
        <view class="sub-info">
          <text class="sub-name">{{ item.name }}</text>
          <text class="sub-spec">{{ item.spec }}</text>
          <view class="sub-status">
            <view class="status-tag" :style="{ background: item.inStock ? '#D1FAE5' : '#FEE2E2' }">
              <text class="status-text" :style="{ color: item.inStock ? '#10B981' : '#EF4444' }">{{ item.inStock ? '已到货' : '缺货中' }}</text>
            </view>
            <text class="sub-time">订阅于 {{ item.subscribeTime }}</text>
          </view>
          <view v-if="item.inStock" class="stock-info">
            <text class="stock-text">当前库存: {{ item.stock }}件</text>
            <view class="buy-btn" @tap="goBuy(item)">
              <text class="buy-text">去采购</text>
            </view>
          </view>
        </view>
        <view class="sub-cancel" @tap="cancelSubscribe(item)">
          <text class="cancel-icon"><wx-icon name="trash" size="28" /></text>
        </view>
      </view>

      <view v-if="subscribeList.length === 0" class="empty">
        <text class="empty-icon"><wx-icon name="bell" size="120" /></text>
        <text class="empty-text">暂无缺货订阅</text>
        <text class="empty-desc">商品缺货时可订阅，到货后将第一时间通知您</text>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mockProducts } from '../../mock/mockProducts.js'

export default {
  data() {
    return {
      subscribeList: []
    }
  },
  onLoad() {
    // 模拟订阅数据
    const products = mockProducts
    this.subscribeList = [
      { ...products.find(p => p.id === 'P0013'), inStock: true, stock: 2800, subscribeTime: '2026-07-08', colorBg: '#FEE2E2', colorText: '#EF4444', image: '/static/images/products/P0013.png' },
      { ...products.find(p => p.id === 'P0015'), inStock: false, stock: 0, subscribeTime: '2026-07-05', colorBg: '#E0E7FF', colorText: '#6366F1', image: '/static/images/products/P0015.png' }
    ].filter(Boolean)
  },
  methods: {
    goBuy(item) {
      uni.navigateTo({ url: `/pages/product/detail?id=${item.id}` })
    },
    cancelSubscribe(item) {
      uni.showModal({
        title: '取消订阅',
        content: '确定要取消该商品的到货通知吗？',
        success: (res) => {
          if (res.confirm) {
            const idx = this.subscribeList.findIndex(s => s.productId === item.productId || s.id === item.id)
            if (idx > -1) this.subscribeList.splice(idx, 1)
            uni.showToast({ title: '已取消订阅', icon: 'success' })
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

.sub-scroll {
  height: 100vh;
}

.sub-card {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 12rpx 16rpx;
  border-radius: 16rpx;
  padding: 20rpx;
  position: relative;

  .sub-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .sub-img-text {
      font-size: 44rpx;
      font-weight: 700;
    }
  }

  .sub-info {
    flex: 1;
    margin-left: 16rpx;

    .sub-name {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .sub-spec {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .sub-status {
      display: flex;
      align-items: center;
      margin-top: 8rpx;

      .status-tag {
        padding: 2rpx 10rpx;
        border-radius: 6rpx;
        margin-right: 12rpx;

        .status-text {
          font-size: 20rpx;
          font-weight: 600;
        }
      }

      .sub-time {
        font-size: 20rpx;
        color: #9CA3AF;
      }
    }

    .stock-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12rpx;

      .stock-text {
        font-size: 22rpx;
        color: #10B981;
      }

      .buy-btn {
        background: #2563EB;
        padding: 6rpx 20rpx;
        border-radius: 20rpx;

        .buy-text {
          font-size: 22rpx;
          color: #fff;
        }
      }
    }
  }

  .sub-cancel {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .cancel-icon {
      font-size: 24rpx;
      color: #9CA3AF;
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

  .empty-desc {
    font-size: 22rpx;
    color: #9CA3AF;
    margin-top: 8rpx;
  }
}
</style>
