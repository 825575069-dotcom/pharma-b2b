<template>
  <view class="page">
    <!-- 顶部导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">快捷采购</text>
        <view class="nav-right">
          <view class="nav-icon more-icon" @tap="showMoreMenu">
            <view class="more-dot"></view>
            <view class="more-dot"></view>
            <view class="more-dot"></view>
          </view>
          <view class="nav-icon scan-icon" @tap="scanCode">
            <view class="scan-circle"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索栏 + 筛选/一键加购 -->
    <view class="search-filter-row" :style="{ top: statusBarHeight + 44 + 'px' }">
      <view class="search-bar" @tap="goSearch">
        <view class="search-placeholder">商品名/通用名/厂家/品牌/批准文号</view>
        <wx-icon class="search-icon" name="search" size="28" />
      </view>
      <view class="filter-btn" @tap="showFilter">
        <view class="filter-icon-wrap">
          <view class="filter-funnel"></view>
        </view>
        <text class="filter-text">筛选</text>
      </view>
      <view class="add-cart-btn" @tap="oneClickAdd">
        <wx-icon name="cart" size="28" />
        <text class="add-cart-text">一键加购</text>
      </view>
    </view>

    <!-- 标签筛选 -->
    <view class="tab-bar" :style="{ top: statusBarHeight + 44 + 48 + 'px' }">
      <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
        <view class="tab-list">
          <view v-for="(tab, idx) in tabs" :key="idx" class="tab-item" :class="{ active: currentTab === idx }" @tap="changeTab(idx)">
            <text class="tab-text" :class="{ active: currentTab === idx }">{{ tab.label }}</text>
            <view v-if="currentTab === idx" class="tab-line"></view>
          </view>
        </view>
      </scroll-view>
      <view class="grid-btn" :class="{ active: viewMode === 'grid' }" @tap="toggleViewMode">
        <view class="grid-icon">
          <template v-if="viewMode === 'list'">
            <view class="grid-square" v-for="i in 4" :key="i"></view>
          </template>
          <template v-else>
            <view class="list-line" v-for="i in 3" :key="i"></view>
          </template>
        </view>
      </view>
    </view>

    <view class="body" :style="{ paddingTop: topBarHeight + 'px' }">
      <!-- 排序栏 -->
      <view class="sort-bar" :style="{ top: topBarHeight - 40 + 'px' }">
        <view class="sort-item" :class="{ active: currentSort === 'default' }" @tap="changeSort('default')">
          <text>默认</text>
          <text class="sort-arrow" :class="{ active: currentSort === 'default' }">▼</text>
        </view>
        <view class="sort-item" :class="{ active: currentSort === 'sales' }" @tap="changeSort('sales')">
          <text>销量</text>
        </view>
        <view class="sort-item" :class="{ active: currentSort === 'category' }" @tap="showCategorySelect">
          <text>选择分类</text>
          <text class="sort-arrow" :class="{ active: currentSort === 'category' }">▼</text>
        </view>
      </view>

      <!-- 商品列表 -->
      <scroll-view scroll-y class="product-scroll" :style="{ height: scrollViewHeight }" @scrolltolower="loadMore">
        <view class="product-list" :class="{ 'grid-view': viewMode === 'grid' }">
          <view v-for="product in filteredProducts" :key="product.id" class="product-card">
            <image class="product-img" :src="product.image" mode="aspectFill" />
            <view class="product-info">
              <view class="product-main" @tap="goDetail(product)">
                <text class="product-name">{{ product.name }} {{ product.spec }}</text>
                <text class="product-manufacturer">{{ product.manufacturer }}</text>
                <view class="product-meta">
                  <text class="meta-text">效期: {{ product.validity }}</text>
                  <text class="meta-text">终端价: {{ product.terminalPrice.toFixed(2) }}</text>
                  <text class="meta-text">件包装: {{ product.packaging }}</text>
                </view>
                <view v-if="product.tags && product.tags.length" class="product-tags">
                  <text v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</text>
                </view>
                <text v-if="product.warningText" class="warning-text">{{ product.warningText }}</text>
                <text v-else-if="product.promoText" class="promo-text">{{ product.promoText }}</text>
              </view>
              <view class="product-bottom">
                <view class="price-wrap" @tap="goDetail(product)">
                  <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
                  <text class="product-unit">/{{ product.unit }}</text>
                </view>
                <view class="action-btns">
                  <view class="add-btn" @tap.stop="addToCart(product)">
                    <wx-icon name="cart" size="28" />
                  </view>
                  <view class="more-btn" @tap.stop="showMoreActions(product)">
                    <text class="more-dots">...</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="filteredProducts.length === 0" class="empty">
          <text class="empty-text">暂无商品</text>
        </view>

        <view style="height: 120rpx;"></view>
      </scroll-view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="cart-wrap" @tap="goCart">
        <view class="cart-icon">
          <wx-icon name="cart" size="44" />
          <text v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</text>
        </view>
        <view class="total-wrap">
          <text class="total-label">合计:</text>
          <text class="total-price">¥{{ cartTotal.toFixed(2) }}</text>
        </view>
      </view>
      <view class="checkout-btn" :class="{ disabled: cartCount === 0 }" @tap="goCheckout">
        <text class="checkout-text">前往结算</text>
      </view>
    </view>

    <!-- 筛选弹窗 -->
    <view v-if="showFilterPanel" class="filter-popup" @tap="closeFilter">
      <view class="filter-content" @tap.stop>
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="filter-close" @tap="closeFilter">×</text>
        </view>
        <view class="filter-body">
          <view class="filter-group">
            <text class="filter-label">渠道</text>
            <view class="filter-options">
              <text v-for="opt in channelOptions" :key="opt" class="filter-option" :class="{ active: selectedChannel === opt }" @tap="selectedChannel = opt">{{ opt }}</text>
            </view>
          </view>
          <view class="filter-group">
            <text class="filter-label">价格区间</text>
            <view class="filter-options">
              <text v-for="opt in priceOptions" :key="opt" class="filter-option" :class="{ active: selectedPrice === opt }" @tap="selectedPrice = opt">{{ opt }}</text>
            </view>
          </view>
        </view>
        <view class="filter-footer">
          <view class="filter-reset" @tap="resetFilter">
            <text>重置</text>
          </view>
          <view class="filter-confirm" @tap="confirmFilter">
            <text>确定</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分类选择弹窗 -->
    <view v-if="showCategoryPanel" class="category-popup" @tap="closeCategory">
      <view class="category-content" @tap.stop>
        <view class="category-header">
          <text class="category-title">选择分类</text>
          <text class="category-close" @tap="closeCategory">×</text>
        </view>
        <view class="category-list">
          <text v-for="cat in categories" :key="cat" class="category-option" :class="{ active: selectedCategory === cat }" @tap="selectCategory(cat)">{{ cat }}</text>
        </view>
      </view>
    </view>

    <!-- 更多操作弹窗 -->
    <view v-if="showMorePanel" class="more-popup" @tap="closeMore">
      <view class="more-content" @tap.stop>
        <view class="more-option" @tap="collectCurrent">
          <text>{{ currentProduct && currentProduct.isCollected ? '取消收藏' : '加入收藏' }}</text>
        </view>
        <view class="more-option" @tap="shareCurrent">
          <text>分享商品</text>
        </view>
        <view class="more-option cancel" @tap="closeMore">
          <text>取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'
import { mockQuickProducts } from '../../mock/mockQuickProducts.js'

export default {
  data() {
    return {
      store,
      statusBarHeight: 20,
      products: mockQuickProducts,
      tabs: [
        { label: '全部', key: 'all' },
        { label: '近期已购', key: 'recent' },
        { label: '未购(0)', key: 'unpurchased' },
        { label: '收藏(0)', key: 'collected' }
      ],
      currentTab: 0,
      currentSort: 'default',
      sortDirection: -1,
      viewMode: 'list',
      showFilterPanel: false,
      showCategoryPanel: false,
      showMorePanel: false,
      selectedChannel: '全部',
      selectedPrice: '全部',
      selectedCategory: '全部',
      currentProduct: null,
      channelOptions: ['全部', '诊所渠道', '药店渠道', '医院渠道'],
      priceOptions: ['全部', '0-10元', '10-20元', '20-50元', '50元以上'],
      categories: ['全部', '抗生素类', '解热镇痛', '心脑血管', '清热解毒', '消化系统', '维生素类', '感冒用药', '滋补类']
    }
  },
  computed: {
    filteredProducts() {
      let list = [...this.products]
      const tabKey = this.tabs[this.currentTab].key
      if (tabKey === 'recent') list = list.filter(p => p.isRecent)
      else if (tabKey === 'unpurchased') list = list.filter(p => !p.isPurchased)
      else if (tabKey === 'collected') list = list.filter(p => p.isCollected)

      if (this.selectedCategory !== '全部') {
        list = list.filter(p => p.tags && p.tags.includes(this.selectedCategory))
      }

      if (this.currentSort === 'sales') {
        list.sort((a, b) => this.sortDirection > 0 ? a.sales - b.sales : b.sales - a.sales)
      }

      return list
    },
    cartCount() {
      return store.state.cart.reduce((sum, item) => sum + item.quantity, 0)
    },
    cartTotal() {
      return store.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    topBarHeight() {
      // statusBar + 44px nav + 96rpx search row + 88rpx tab + 80rpx sort
      return this.statusBarHeight + 44 + 48 + 44 + 40
    },
    scrollViewHeight() {
      const bottomBarHeight = 50 // 100rpx
      return `calc(100vh - ${this.topBarHeight + bottomBarHeight}px)`
    }
  },
  onLoad() {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 20
    this.updateTabCounts()
  },
  onShow() {
    this.updateTabCounts()
  },
  methods: {
    updateTabCounts() {
      this.tabs[2].label = `未购(${this.products.filter(p => !p.isPurchased).length})`
      this.tabs[3].label = `收藏(${this.products.filter(p => p.isCollected).length})`
    },
    changeTab(idx) {
      this.currentTab = idx
    },
    changeSort(key) {
      if (this.currentSort === key && key === 'sales') {
        this.sortDirection = -this.sortDirection
      } else if (this.currentSort === 'default') {
        this.sortDirection = -this.sortDirection
      } else {
        this.currentSort = key
      }
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'
      uni.showToast({ title: this.viewMode === 'list' ? '切换为列表' : '切换为网格', icon: 'none' })
    },
    showFilter() {
      this.showFilterPanel = true
    },
    closeFilter() {
      this.showFilterPanel = false
    },
    resetFilter() {
      this.selectedChannel = '全部'
      this.selectedPrice = '全部'
    },
    confirmFilter() {
      this.closeFilter()
      uni.showToast({ title: '筛选已应用', icon: 'none' })
    },
    showCategorySelect() {
      this.showCategoryPanel = true
    },
    closeCategory() {
      this.showCategoryPanel = false
    },
    selectCategory(cat) {
      this.selectedCategory = cat
      this.closeCategory()
      this.currentSort = 'category'
    },
    showMoreMenu() {
      uni.showToast({ title: '更多菜单', icon: 'none' })
    },
    scanCode() {
      uni.showToast({ title: '扫一扫', icon: 'none' })
    },
    showMoreActions(product) {
      this.currentProduct = product
      this.showMorePanel = true
    },
    closeMore() {
      this.showMorePanel = false
    },
    collectCurrent() {
      if (this.currentProduct) {
        this.currentProduct.isCollected = !this.currentProduct.isCollected
        this.updateTabCounts()
        uni.showToast({ title: this.currentProduct.isCollected ? '已收藏' : '已取消收藏', icon: 'none' })
      }
      this.closeMore()
    },
    shareCurrent() {
      uni.showToast({ title: '分享商品', icon: 'none' })
      this.closeMore()
    },
    addToCart(product) {
      store.addToCart(product, 1)
      uni.showToast({ title: '已加入采购车', icon: 'success' })
    },
    oneClickAdd() {
      this.filteredProducts.forEach(p => store.addToCart(p, 1))
      uni.showToast({ title: '已将全部商品加入采购车', icon: 'success' })
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index?from=quick' })
    },
    goDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    goCart() {
      uni.switchTab({ url: '/pages/cart/index' })
    },
    goCheckout() {
      if (this.cartCount === 0) {
        uni.showToast({ title: '采购车为空', icon: 'none' })
        return
      }
      uni.switchTab({ url: '/pages/cart/index' })
    },
    loadMore() {
      uni.showToast({ title: '已加载全部', icon: 'none' })
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
  z-index: 100;
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

.search-filter-row {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  height: 96rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .search-bar {
    flex: 1;
    height: 72rpx;
    background: #F3F4F6;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;

    .search-placeholder {
      flex: 1;
      font-size: 26rpx;
      color: #9CA3AF;
      margin-right: 12rpx;
      line-height: 72rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .search-icon {
      opacity: 0.55;
      flex-shrink: 0;
    }
  }

  .filter-btn,
  .add-cart-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;
    height: 72rpx;

    .filter-text,
    .add-cart-text {
      font-size: 22rpx;
      color: #6B7280;
      margin-top: 4rpx;
    }
  }

  .filter-btn {
    .filter-icon-wrap {
      width: 28rpx;
      height: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .filter-funnel {
        width: 0;
        height: 0;
        border-left: 10rpx solid transparent;
        border-right: 10rpx solid transparent;
        border-top: 12rpx solid #6B7280;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: -12rpx;
          left: -6rpx;
          width: 12rpx;
          height: 6rpx;
          background: #6B7280;
        }
      }
    }
  }
}

.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 98;
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f0f0f0;

  .tab-scroll {
    flex: 1;
    height: 88rpx;
  }

  .tab-list {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 16rpx;
  }

  .tab-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    height: 88rpx;

    .tab-text {
      font-size: 28rpx;
      color: #6B7280;

      &.active {
        color: #2563EB;
        font-weight: 600;
      }
    }

    .tab-line {
      position: absolute;
      bottom: 10rpx;
      left: 24rpx;
      right: 24rpx;
      height: 4rpx;
      background: #2563EB;
      border-radius: 2rpx;
    }
  }

  .grid-btn {
    width: 80rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      .grid-icon {
        .grid-square {
          background: #2563EB;
        }
        .list-line {
          background: #2563EB;
        }
      }
    }

    .grid-icon {
      width: 32rpx;
      height: 32rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      flex-direction: column;

      .grid-square {
        width: 13rpx;
        height: 13rpx;
        background: #6B7280;
        border-radius: 2rpx;
      }

      .list-line {
        width: 32rpx;
        height: 5rpx;
        background: #6B7280;
        border-radius: 3rpx;
      }
    }
  }
}

.body {
  box-sizing: border-box;
}

.sort-bar {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 97;
  height: 80rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .sort-item {
    display: flex;
    align-items: center;
    margin-right: 40rpx;

    text {
      font-size: 26rpx;
      color: #6B7280;
    }

    .sort-arrow {
      font-size: 18rpx;
      color: #6B7280;
      margin-left: 4rpx;

      &.active {
        color: #2563EB;
      }
    }

    &.active {
      text {
        color: #2563EB;
        font-weight: 600;
      }
    }
  }
}

.product-scroll {
  background: #f5f6fa;
}

.product-list {
  padding: 16rpx 24rpx;

  &.grid-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;

    .product-card {
      width: calc(50% - 8rpx);
      flex-direction: column;
      padding: 16rpx;
      margin-bottom: 16rpx;

      .product-img {
        width: 100%;
        height: 240rpx;
        margin-right: 0;
        margin-bottom: 16rpx;
      }

      .product-info {
        flex: 1;
        min-width: 0;
        margin-left: 0;
        width: 100%;
      }

      .product-name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .product-manufacturer {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-meta {
        .meta-text {
          margin-right: 12rpx;
        }
      }
    }
  }
}

.product-card {
  display: flex;
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .product-img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
    margin-right: 20rpx;
    background: #f5f6fa;
  }

  .product-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-main {
    flex: 1;
  }

  .product-name {
    display: block;
    font-size: 28rpx;
    color: #1f2937;
    font-weight: 600;
    line-height: 1.4;
  }

  .product-manufacturer {
    display: block;
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 8rpx;
  }

  .product-meta {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8rpx;

    .meta-text {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-right: 16rpx;
    }
  }

  .product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10rpx;

    .product-tag {
      font-size: 20rpx;
      color: #2563EB;
      background: #DBEAFE;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      margin-right: 8rpx;
      margin-bottom: 4rpx;
    }
  }

  .warning-text {
    display: inline-block;
    font-size: 20rpx;
    color: #EF4444;
    background: #FEF2F2;
    padding: 4rpx 10rpx;
    border-radius: 4rpx;
    margin-top: 8rpx;
  }

  .promo-text {
    font-size: 20rpx;
    color: #EF4444;
    line-height: 1.4;
    margin-top: 8rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12rpx;

    .price-wrap {
      display: flex;
      align-items: baseline;
    }

    .product-price {
      font-size: 34rpx;
      color: #EF4444;
      font-weight: 700;
    }

    .product-unit {
      font-size: 22rpx;
      color: #EF4444;
      margin-left: 2rpx;
    }

    .action-btns {
      display: flex;
      align-items: center;
    }

    .add-btn {
      width: 56rpx;
      height: 56rpx;
      background: #2563EB;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .more-btn {
      width: 56rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8rpx;

      .more-dots {
        font-size: 36rpx;
        color: #6B7280;
        line-height: 1;
        letter-spacing: 2rpx;
      }
    }
  }
}

.empty {
  padding: 120rpx 0;
  text-align: center;

  .empty-text {
    font-size: 28rpx;
    color: #9CA3AF;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  z-index: 100;

  .cart-wrap {
    display: flex;
    align-items: center;
  }

  .cart-icon {
    position: relative;
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .cart-badge {
      position: absolute;
      top: -4rpx;
      right: -8rpx;
      min-width: 32rpx;
      height: 32rpx;
      background: #EF4444;
      color: #fff;
      font-size: 20rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }

  .total-wrap {
    margin-left: 20rpx;
    display: flex;
    align-items: baseline;

    .total-label {
      font-size: 26rpx;
      color: #1f2937;
    }

    .total-price {
      font-size: 36rpx;
      color: #EF4444;
      font-weight: 700;
      margin-left: 8rpx;
    }
  }

  .checkout-btn {
    background: #2563EB;
    padding: 0 40rpx;
    height: 72rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .checkout-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }

    &.disabled {
      background: #D1D5DB;
    }
  }
}

.filter-popup,
.category-popup,
.more-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.filter-content,
.category-content,
.more-content {
  width: 100%;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 24rpx;
}

.filter-header,
.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .filter-title,
  .category-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
  }

  .filter-close,
  .category-close {
    font-size: 40rpx;
    color: #9CA3AF;
  }
}

.filter-group {
  margin-bottom: 24rpx;

  .filter-label {
    font-size: 28rpx;
    color: #1f2937;
    font-weight: 600;
    display: block;
    margin-bottom: 16rpx;
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .filter-option {
    font-size: 24rpx;
    color: #6B7280;
    background: #F3F4F6;
    padding: 10rpx 24rpx;
    border-radius: 28rpx;

    &.active {
      color: #2563EB;
      background: #DBEAFE;
    }
  }
}

.filter-footer {
  display: flex;
  gap: 20rpx;
  margin-top: 32rpx;

  .filter-reset,
  .filter-confirm {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filter-reset {
    background: #F3F4F6;

    text {
      font-size: 28rpx;
      color: #6B7280;
    }
  }

  .filter-confirm {
    background: #2563EB;

    text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.category-list {
  max-height: 600rpx;

  .category-option {
    display: block;
    font-size: 28rpx;
    color: #4B5563;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    text-align: center;

    &.active {
      color: #2563EB;
      font-weight: 600;
    }
  }
}

.more-option {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;

  text {
    font-size: 30rpx;
    color: #1f2937;
  }

  &.cancel {
    border-bottom: none;

    text {
      color: #9CA3AF;
    }
  }
}
</style>
