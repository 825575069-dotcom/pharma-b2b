<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">商品详情</text>
        <view class="nav-right">
          <view class="nav-icon more-icon" @tap="showMore">
            <view class="more-dot" v-for="i in 3" :key="i"></view>
          </view>
          <view class="nav-icon scan-icon" @tap="scanCode">
            <view class="scan-circle"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- Tab 导航 -->
    <view class="tab-nav" :style="{ top: statusBarHeight + 44 + 'px' }">
      <view class="tab-item" :class="{ active: activeTab === 'product' }" @tap="activeTab = 'product'">
        <text>商品</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'detail' }" @tap="activeTab = 'detail'">
        <text>详情</text>
      </view>
      <view class="tab-item" :class="{ active: activeTab === 'recommend' }" @tap="activeTab = 'recommend'">
        <text>推荐</text>
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll" :style="{ paddingTop: statusBarHeight + 44 + 40 + 'px' }">
      <!-- 商品 Tab -->
      <view v-if="activeTab === 'product'">
        <!-- 商品轮播图 -->
        <view class="img-section">
          <swiper class="img-swiper" circular :current="currentImgIndex" @change="onSwiperChange" indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#2563EB">
            <swiper-item v-for="(img, idx) in product.images" :key="idx">
              <image class="img-item" :src="img" mode="aspectFill" />
            </swiper-item>
          </swiper>
          <!-- 功效标签 -->
          <view v-if="product.effectTags && product.effectTags.length" class="effect-tags">
            <text v-for="tag in product.effectTags" :key="tag" class="effect-tag">{{ tag }}</text>
          </view>
          <!-- 图片指示器 -->
          <view class="img-indicator">
            <text>{{ currentImgIndex + 1 }}/{{ product.images.length }}</text>
          </view>
        </view>

        <!-- 适应症 / 批准文号横幅 -->
        <view class="indication-banner">
          <view class="indication-left">
            <text class="indication-text">{{ product.indications }}</text>
          </view>
          <view class="approval-right">
            <text class="approval-label">国药准字</text>
            <text class="approval-number">{{ product.approvalNumber.replace('国药准字', '') }}</text>
          </view>
        </view>

        <!-- 价格与基本信息 -->
        <view class="info-section">
          <view class="price-row">
            <text class="price">¥{{ product.price.toFixed(2) }}</text>
            <text v-if="product.originPrice > product.price" class="origin-price">¥{{ product.originPrice.toFixed(2) }}</text>
            <text class="stock-status">库存有货</text>
          </view>
          <view class="product-title">
            <text>{{ product.name }}</text>
          </view>
          <view class="product-spec">
            <text>{{ product.spec }}</text>
          </view>
          <view v-if="product.tags && product.tags.length" class="product-tags">
            <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
        </view>

        <!-- 规格信息 -->
        <view class="spec-section">
          <view class="spec-row">
            <text class="spec-label">规格</text>
            <text class="spec-value">{{ product.spec }}</text>
          </view>
          <view class="spec-row">
            <text class="spec-label">厂家</text>
            <text class="spec-value">{{ product.manufacturer }}</text>
          </view>
          <view class="spec-row">
            <text class="spec-label">批准文号</text>
            <text class="spec-value">{{ product.approvalNumber }}</text>
          </view>
        </view>

        <!-- 关联促销活动 -->
        <view class="activity-section" v-if="relatedActivities.length > 0">
          <view class="section-title-row">
            <text class="section-title">关联活动</text>
          </view>
          <view v-for="act in relatedActivities" :key="act.id" class="activity-item">
            <view class="act-tag" :style="{ background: act.typeColor }">
              <text class="act-tag-text">{{ act.type }}</text>
            </view>
            <text class="act-title">{{ act.title }}</text>
            <text class="act-desc">{{ act.description }}</text>
          </view>
        </view>
      </view>

      <!-- 详情 Tab -->
      <view v-if="activeTab === 'detail'">
        <view class="detail-content-section">
          <view class="section-title">药品详情</view>
          <view class="detail-block">
            <text class="detail-block-title">适应症</text>
            <text class="detail-block-content">{{ product.indications }}</text>
          </view>
          <view class="detail-block">
            <text class="detail-block-title">用法用量</text>
            <text class="detail-block-content">{{ product.dosage }}</text>
          </view>
          <view class="detail-block">
            <text class="detail-block-title">不良反应</text>
            <text class="detail-block-content">{{ product.adverseReactions }}</text>
          </view>
          <view class="detail-block">
            <text class="detail-block-title">商品描述</text>
            <text class="detail-block-content">{{ product.description }}</text>
          </view>
        </view>
      </view>

      <!-- 推荐 Tab -->
      <view v-if="activeTab === 'recommend'">
        <view class="recommend-section">
          <view class="section-title">为你推荐</view>
          <view class="recommend-list">
            <view v-for="p in recommendProducts" :key="p.id" class="recommend-card" @tap="goProduct(p)">
              <image class="recommend-img" :src="p.image" mode="aspectFill" />
              <view class="recommend-info">
                <text class="recommend-name">{{ p.name }}</text>
                <text class="recommend-price">¥{{ p.price.toFixed(2) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 220rpx;"></view>
    </scroll-view>

    <!-- 返回首页悬浮按钮 -->
    <view class="float-home" @tap="goHome">
      <text class="float-home-text">返回首页</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bb-icon-item" @tap="contactService">
        <wx-icon name="service" size="36" />
        <text class="bb-icon-text">客服</text>
      </view>
      <view class="bb-icon-item" @tap="toggleCollect">
        <wx-icon name="star" size="36" :color="product.isCollected ? '#F59E0B' : '#6B7280'" />
        <text class="bb-icon-text">{{ product.isCollected ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="bb-icon-item cart-icon" @tap="goCart">
        <wx-icon name="cart" size="36" />
        <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
        <text class="bb-icon-text">采购车</text>
      </view>
      <view class="bb-btn add-cart-btn" @tap="addToCart">
        <text class="btn-text">加入采购车</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mockProducts } from '../../mock/mockProducts.js'
import { mockActivities } from '../../mock/mockActivities.js'
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store,
      product: {},
      activeTab: 'product',
      currentImgIndex: 0,
      activities: mockActivities,
      statusBarHeight: 0
    }
  },
  computed: {
    relatedActivities() {
      return this.activities.filter(a => a.productIds && a.productIds.includes(this.product.id))
    },
    recommendProducts() {
      return mockProducts.filter(p => p.id !== this.product.id).slice(0, 10)
    },
    cartCount() {
      return store.state.cart.reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  onLoad(options) {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 20
    const product = mockProducts.find(p => p.id === options.id)
    if (product) {
      this.product = { ...product }
    }
  },
  methods: {
    goBack() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goCart() {
      uni.switchTab({ url: '/pages/cart/index' })
    },
    goProduct(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    onSwiperChange(e) {
      this.currentImgIndex = e.detail.current
    },
    showMore() {
      uni.showActionSheet({
        itemList: ['分享商品', '收藏商品', '返回首页', '取消'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.shareProduct()
          } else if (res.tapIndex === 1) {
            this.toggleCollect()
          } else if (res.tapIndex === 2) {
            this.goHome()
          }
        }
      })
    },
    scanCode() {
      uni.showToast({ title: '扫一扫', icon: 'none' })
    },
    toggleCollect() {
      this.product.isCollected = !this.product.isCollected
      uni.showToast({
        title: this.product.isCollected ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
    },
    contactService() {
      uni.showToast({ title: '客服功能开发中', icon: 'none' })
    },
    addToCart() {
      store.addToCart(this.product, 1)
      uni.showToast({ title: '已加入采购车', icon: 'success' })
    },
    shareProduct() {
      uni.showToast({ title: '分享商品', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

/* 自定义导航栏 */
.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 16rpx;
  }

  .back-btn {
    position: absolute;
    left: 16rpx;
    top: 0;
    bottom: 0;
    width: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .back-icon {
    color: #1f2937;
    font-size: 44rpx;
    line-height: 1;
    font-weight: 400;
    -webkit-text-stroke: 1rpx rgba(128, 128, 128, 0.5);
  }

  .nav-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #1f2937;
  }

  .nav-right {
    position: absolute;
    right: 16rpx;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;

    &.more-icon {
      .more-dot {
        width: 6rpx;
        height: 6rpx;
        border-radius: 50%;
        background: #1f2937;
        margin: 0 1.5rpx;
      }
    }

    &.scan-icon {
      .scan-circle {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        border: 4rpx solid #1f2937;
      }
    }
  }
}

/* Tab 导航 */
.tab-nav {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #f0f0f0;

  .tab-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    padding: 0 40rpx;

    text {
      font-size: 28rpx;
      color: #6B7280;
    }

    &.active {
      text {
        color: #2563EB;
        font-weight: 600;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #2563EB;
        border-radius: 2rpx;
      }
    }
  }
}

.detail-scroll {
  box-sizing: border-box;
}

/* 商品轮播图 */
.img-section {
  position: relative;
  width: 100%;
  background: #fff;

  .img-swiper {
    height: 600rpx;
  }

  .img-item {
    width: 100%;
    height: 100%;
  }

  .effect-tags {
    position: absolute;
    top: 30rpx;
    left: 24rpx;
    right: 24rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .effect-tag {
      font-size: 24rpx;
      color: #fff;
      background: rgba(245, 158, 11, 0.85);
      padding: 8rpx 20rpx;
      border-radius: 28rpx;
    }
  }

  .img-indicator {
    position: absolute;
    bottom: 24rpx;
    right: 24rpx;
    background: rgba(0, 0, 0, 0.4);
    padding: 6rpx 16rpx;
    border-radius: 20rpx;

    text {
      font-size: 22rpx;
      color: #fff;
    }
  }
}

/* 适应症 / 批准文号横幅 */
.indication-banner {
  display: flex;
  background: linear-gradient(90deg, #F59E0B 0%, #F97316 100%);

  .indication-left {
    flex: 1;
    padding: 20rpx 24rpx;
    display: flex;
    align-items: center;

    .indication-text {
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;
      line-height: 1.4;
    }
  }

  .approval-right {
    width: 180rpx;
    background: #10B981;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16rpx;

    .approval-label {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.85);
    }

    .approval-number {
      font-size: 22rpx;
      color: #fff;
      font-weight: 600;
      margin-top: 4rpx;
    }
  }
}

/* 价格与基本信息 */
.info-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .price-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;

    .price {
      font-size: 48rpx;
      color: #EF4444;
      font-weight: 700;
    }

    .origin-price {
      font-size: 26rpx;
      color: #9CA3AF;
      text-decoration: line-through;
      margin-left: 12rpx;
    }

    .stock-status {
      font-size: 24rpx;
      color: #6B7280;
      margin-left: auto;
    }
  }

  .product-title {
    font-size: 32rpx;
    color: #1f2937;
    font-weight: 600;
    line-height: 1.4;
  }

  .product-spec {
    font-size: 26rpx;
    color: #6B7280;
    margin-top: 8rpx;
  }

  .product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16rpx;
    gap: 12rpx;

    .tag {
      font-size: 22rpx;
      color: #fff;
      padding: 6rpx 16rpx;
      border-radius: 8rpx;
      background: #2563EB;

      &:nth-child(2) { background: #10B981; }
      &:nth-child(3) { background: #F59E0B; }
      &:nth-child(4) { background: #EC4899; }
    }
  }
}

/* 规格信息 */
.spec-section {
  background: #fff;
  padding: 0 24rpx;
  margin-bottom: 16rpx;

  .spec-row {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .spec-label {
      width: 140rpx;
      font-size: 26rpx;
      color: #9CA3AF;
    }

    .spec-value {
      flex: 1;
      font-size: 26rpx;
      color: #1f2937;
    }
  }
}

/* 关联活动 */
.activity-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .section-title-row {
    margin-bottom: 16rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .activity-item {
    display: flex;
    align-items: center;
    padding: 16rpx;
    background: #f8f9ff;
    border-radius: 12rpx;
    margin-bottom: 12rpx;

    .act-tag {
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      margin-right: 12rpx;

      .act-tag-text {
        font-size: 22rpx;
        color: #fff;
      }
    }

    .act-title {
      flex: 1;
      font-size: 26rpx;
      color: #1f2937;
    }

    .act-desc {
      font-size: 22rpx;
      color: #6B7280;
      margin-left: 12rpx;
    }
  }
}

/* 详情 Tab */
.detail-content-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 24rpx;
  }

  .detail-block {
    margin-bottom: 24rpx;

    .detail-block-title {
      display: block;
      font-size: 30rpx;
      color: #1f2937;
      font-weight: 600;
      margin-bottom: 12rpx;
    }

    .detail-block-content {
      display: block;
      font-size: 26rpx;
      color: #6B7280;
      line-height: 1.8;
    }
  }
}

/* 推荐 Tab */
.recommend-section {
  background: #fff;
  padding: 24rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 24rpx;
  }

  .recommend-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }

  .recommend-card {
    width: 48.5%;
    background: #f8f9ff;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 20rpx;

    .recommend-img {
      width: 100%;
      height: 240rpx;
    }

    .recommend-info {
      padding: 16rpx;

      .recommend-name {
        display: block;
        font-size: 26rpx;
        color: #1f2937;
        line-height: 1.4;
        height: 72rpx;
        overflow: hidden;
      }

      .recommend-price {
        display: block;
        font-size: 30rpx;
        color: #EF4444;
        font-weight: 700;
        margin-top: 8rpx;
      }
    }
  }
}

/* 返回首页悬浮按钮 */
.float-home {
  position: fixed;
  left: 24rpx;
  bottom: 140rpx;
  z-index: 998;
  background: #2563EB;
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  box-shadow: 0 4rpx 16rpx rgba(37, 99, 235, 0.3);

  .float-home-text {
    font-size: 24rpx;
    color: #fff;
  }
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1001;

  .bb-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
    position: relative;

    .bb-icon-text {
      font-size: 20rpx;
      color: #6B7280;
      margin-top: 4rpx;
    }

    .cart-badge {
      position: absolute;
      top: -8rpx;
      right: -8rpx;
      min-width: 28rpx;
      height: 28rpx;
      background: #EF4444;
      color: #fff;
      font-size: 18rpx;
      border-radius: 14rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6rpx;
    }
  }

  .bb-btn {
    flex: 1;
    height: 72rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-cart-btn {
    background: #2563EB;

    .btn-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
