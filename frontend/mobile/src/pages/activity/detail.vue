<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px', background: activity.bannerColor || '#2563EB' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon" :style="{ color: activity.bannerText || '#fff' }">‹</text>
        </view>
        <text class="nav-title" :style="{ color: activity.bannerText || '#fff' }">活动详情</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 顶部活动信息卡 -->
    <view class="activity-header" :style="{ background: activity.bannerColor, paddingTop: (statusBarHeight + 44) + 'px' }">
      <view class="activity-tag" :style="{ background: activity.typeColor }">
        <text class="tag-text">{{ activity.type }}</text>
      </view>
      <text class="activity-title" :style="{ color: activity.bannerText }">{{ activity.title }}</text>
      <text class="activity-desc">{{ activity.description }}</text>
      <view class="activity-time">
        <text class="time-icon">⏱</text>
        <text class="time-text">{{ activity.startTime }} ~ {{ activity.endTime }}</text>
      </view>
    </view>

    <!-- 活动规则 -->
    <view class="rule-card">
      <text class="rule-title">活动规则</text>
      <text class="rule-text">{{ activity.rules }}</text>
    </view>

    <!-- 参与商品 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">参与商品</text>
        <text class="section-count">共 {{ activityProducts.length }} 款</text>
      </view>
      <view v-if="activityProducts.length === 0" class="empty-state">
        <text class="empty-text">暂无参与商品</text>
      </view>
      <view v-else class="product-list">
        <view v-for="product in activityProducts" :key="product.id" class="product-card" @tap="goProductDetail(product)">
          <view class="product-img" style="position: relative;">
            <image :src="product.image" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
            <view v-if="product.originPrice > product.price" class="product-discount-tag">
              <text class="discount-text">特价</text>
            </view>
          </view>
          <view class="product-info">
            <text class="product-name ellipsis-2">{{ product.name }} {{ product.spec }}</text>
            <text class="product-manufacturer ellipsis">{{ product.manufacturer }}</text>
            <view class="product-bottom">
              <view class="product-price-wrap">
                <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
                <text v-if="product.originPrice > product.price" class="product-origin">¥{{ product.originPrice.toFixed(2) }}</text>
              </view>
              <text class="product-sales">已售{{ product.sales }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mockActivities } from '../../mock/mockActivities.js'
import { mockProducts } from '../../mock/mockProducts.js'

export default {
  data() {
    return {
      activity: {},
      activityProducts: [],
      statusBarHeight: 20
    }
  },
  onLoad(options) {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20

    const activityId = options.id
    const act = mockActivities.find(item => item.id === activityId)
    if (act) {
      this.activity = act
      this.activityProducts = mockProducts.filter(p => act.productIds && act.productIds.includes(p.id))
    }
  },
  methods: {
    goBack() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goProductDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx;
    position: relative;
  }

  .back-btn {
    width: 70rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .back-icon {
    color: #fff;
    font-size: 52rpx;
    line-height: 1;
    font-weight: 300;
  }

  .nav-title {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    font-weight: 500;
  }

  .nav-right {
    width: 70rpx;
  }
}

.activity-header {
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .activity-tag {
    padding: 4rpx 16rpx;
    border-radius: 8rpx;
    margin-bottom: 16rpx;

    .tag-text {
      font-size: 22rpx;
      color: #fff;
    }
  }

  .activity-title {
    font-size: 40rpx;
    font-weight: 700;
    margin-bottom: 12rpx;
  }

  .activity-desc {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 20rpx;
  }

  .activity-time {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: rgba(0, 0, 0, 0.5);

    .time-icon {
      margin-right: 8rpx;
    }
  }
}

.rule-card {
  background: #fff;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;

  .rule-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #1f2937;
    display: block;
    margin-bottom: 12rpx;
  }

  .rule-text {
    font-size: 26rpx;
    color: #4B5563;
    line-height: 1.6;
  }
}

.section {
  margin: 20rpx;
  background: #fff;
  padding: 24rpx;
  border-radius: 16rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #1f2937;
  }

  .section-count {
    font-size: 24rpx;
    color: #9CA3AF;
  }
}

.empty-state {
  padding: 60rpx 0;
  text-align: center;

  .empty-text {
    font-size: 26rpx;
    color: #9CA3AF;
  }
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;

  .product-card {
    width: 48.5%;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }

  .product-img {
    position: relative;
    width: 100%;
    height: 300rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .product-img-text {
      font-size: 80rpx;
      font-weight: 700;
    }

    .product-discount-tag {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      background: #EF4444;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;

      .discount-text {
        font-size: 20rpx;
        color: #fff;
      }
    }
  }

  .product-info {
    padding: 16rpx;
  }

  .product-name {
    font-size: 28rpx;
    color: #1f2937;
    font-weight: 500;
    line-height: 1.4;
    overflow: hidden;
  }

  .product-manufacturer {
    font-size: 22rpx;
    color: #9CA3AF;
    margin-top: 6rpx;
  }

  .product-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: 10rpx;

    .product-price-wrap {
      display: flex;
      align-items: baseline;
    }

    .product-price {
      font-size: 32rpx;
      color: #EF4444;
      font-weight: 700;
    }

    .product-origin {
      font-size: 22rpx;
      color: #9CA3AF;
      text-decoration: line-through;
      margin-left: 8rpx;
    }

    .product-sales {
      font-size: 20rpx;
      color: #9CA3AF;
    }
  }
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
