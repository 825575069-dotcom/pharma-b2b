<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">商品分类</text>
        <view class="nav-right"></view>
      </view>
    </view>
    <view class="layout">
      <!-- 左侧分类列表 -->
      <scroll-view scroll-y class="cate-left">
        <view 
          v-for="(cat, idx) in categories" 
          :key="idx" 
          class="cate-item" 
          :class="{ active: currentCate === idx }"
          @tap="selectCate(idx)"
        >
          <text class="cate-name" :class="{ active: currentCate === idx }">{{ cat }}</text>
          <view v-if="currentCate === idx" class="cate-bar"></view>
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view scroll-y class="cate-right">
        <!-- 排序栏 -->
        <view class="sort-bar">
          <view v-for="(item, idx) in sortList" :key="idx" class="sort-item" @tap="changeSort(idx)">
            <text :class="{ 'sort-active': currentSort === idx }">{{ item.label }}</text>
            <view v-if="idx > 0" class="sort-arrows">
              <text class="arrow-up" :class="{ 'arrow-active': currentSort === idx && sortDirection > 0 }">▲</text>
              <text class="arrow-down" :class="{ 'arrow-active': currentSort === idx && sortDirection < 0 }">▼</text>
            </view>
          </view>
        </view>

        <!-- 商品网格 -->
        <view class="product-grid">
          <view v-for="product in filteredProducts" :key="product.id" class="product-card" @tap="goDetail(product)">
            <image class="product-img" :src="product.image" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name ellipsis-2">{{ product.name }} {{ product.spec }}</text>
              <text class="product-manufacturer">{{ product.manufacturer }}</text>
              <view class="product-tags">
                <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="product-tag">{{ tag }}</text>
              </view>
              <view class="product-bottom">
                <text v-if="$auth.isLoggedIn" class="product-price">¥{{ product.price.toFixed(2) }}</text>
                <text v-else class="product-price price-mask" @tap="$auth.goLogin()">登录后查看</text>
                <text class="product-sales">售{{ product.sales }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="filteredProducts.length === 0" class="empty">
          <text class="empty-text">该分类暂无商品</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mockProducts } from '../../mock/mockProducts.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      currentCate: 0,
      currentSort: 0,
      sortDirection: -1,
      categories: ['全部', '抗生素类', '解热镇痛', '心脑血管', '清热解毒', '消化系统', '维生素类', '感冒用药', '滋补类', '抗过敏', '呼吸系统', '肝胆用药'],
      sortList: [
        { label: '综合', key: 'default' },
        { label: '价格', key: 'price' },
        { label: '销量', key: 'sales' }
      ],
      products: mockProducts
    }
  },
  computed: {
    filteredProducts() {
      let list = [...this.products]
      const cate = this.categories[this.currentCate]
      if (cate !== '全部') {
        list = list.filter(p => p.category === cate)
      }
      const sortKey = this.sortList[this.currentSort].key
      const dir = this.sortDirection
      if (sortKey === 'price') {
        list.sort((a, b) => dir > 0 ? a.price - b.price : b.price - a.price)
      } else if (sortKey === 'sales') {
        list.sort((a, b) => dir > 0 ? a.sales - b.sales : b.sales - a.sales)
      }
      return list
    }
  },
  onLoad(options) {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 20
    if (options.cate) {
      const cateName = decodeURIComponent(options.cate)
      const idx = this.categories.indexOf(cateName)
      if (idx > -1) {
        this.currentCate = idx
      }
    }
    if (options.activityId) {
      uni.showToast({ title: '查看活动商品', icon: 'none' })
    }
  },
  methods: {
    goBack() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    selectCate(idx) {
      this.currentCate = idx
    },
    changeSort(idx) {
      if (this.currentSort === idx && idx > 0) {
        this.sortDirection = -this.sortDirection
      } else {
        this.currentSort = idx
        this.sortDirection = -1
      }
    },
    goDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}

.custom-nav {
  background: #fff;
  flex-shrink: 0;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12rpx;
  }

  .back-btn {
    width: 88rpx;
    height: 88rpx;
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
    color: #1f2937;
    font-size: 34rpx;
    font-weight: 500;
  }

  .nav-right {
    width: 88rpx;
  }
}

.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.cate-left {
  width: 180rpx;
  height: 100%;
  background: #f0f1f5;

  .cate-item {
    position: relative;
    height: 110rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .cate-name {
      font-size: 26rpx;
      color: #6B7280;

      &.active {
        color: #2563EB;
        font-weight: 600;
      }
    }

    .cate-bar {
      position: absolute;
      left: 0;
      width: 6rpx;
      height: 36rpx;
      background: #2563EB;
      border-radius: 0 3rpx 3rpx 0;
    }
  }
}

.cate-right {
  flex: 1;
  height: 100%;
  padding: 0 16rpx;
}

.sort-bar {
  display: flex;
  height: 80rpx;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  margin: 16rpx 0;

  .sort-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 26rpx;
      color: #6B7280;
    }

    .sort-active {
      color: #2563EB;
      font-weight: 600;
    }
  }

  .sort-arrows {
    display: flex;
    flex-direction: column;
    margin-left: 6rpx;
    line-height: 1;

    .arrow-up,
    .arrow-down {
      font-size: 14rpx;
      color: #d1d5db;
      line-height: 1;

      &.arrow-active {
        color: #2563EB;
      }
    }

    .arrow-up {
      margin-bottom: 2rpx;
    }
  }
}

.product-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 20rpx;

  .product-card {
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    display: flex;
    align-items: stretch;
  }

  .product-img {
    width: 200rpx;
    height: 200rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-info {
    flex: 1;
    padding: 16rpx 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .product-name {
    font-size: 26rpx;
    color: #1f2937;
    font-weight: 500;
    line-height: 1.4;
  }

  .product-manufacturer {
    font-size: 20rpx;
    color: #9CA3AF;
    margin-top: 6rpx;
  }

  .product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 6rpx;

    .product-tag {
      font-size: 18rpx;
      color: #2563EB;
      background: #DBEAFE;
      padding: 2rpx 6rpx;
      border-radius: 4rpx;
      margin-right: 4rpx;
    }
  }

  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8rpx;

    .product-price {
      font-size: 30rpx;
      color: #EF4444;
      font-weight: 700;
    }

    .product-sales {
      font-size: 20rpx;
      color: #9CA3AF;
    }
  }
}

.empty {
  padding: 100rpx 0;
  text-align: center;

  .empty-text {
    font-size: 28rpx;
    color: #9CA3AF;
  }
}
</style>
