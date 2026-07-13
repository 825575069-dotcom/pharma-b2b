<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="search-box">
          <wx-icon class="search-icon" name="search" size="26" />
          <input
            ref="searchInput"
            v-model="keyword"
            class="search-input"
            type="text"
            confirm-type="search"
            :focus="autoFocus"
            placeholder="商品通用名/厂家/品牌"
            placeholder-class="input-placeholder"
            @confirm="doSearch"
          />
          <view v-if="keyword" class="clear-btn" @tap="clearKeyword">
            <text class="clear-icon">×</text>
          </view>
        </view>
        <text class="search-btn" @tap="doSearch">搜索</text>
      </view>
    </view>

    <view class="body" :style="{ paddingTop: statusBarHeight + 44 + 'px' }">
      <!-- 未搜索时展示推荐和历史 -->
      <view v-if="!hasSearched" class="search-panel">
        <!-- 搜索历史 -->
        <view v-if="history.length > 0" class="panel-section">
          <view class="section-title-bar">
            <text class="section-title">历史搜索</text>
            <view class="delete-btn" @tap="clearHistory">
              <wx-icon name="trash" size="28" />
            </view>
          </view>
          <view class="tag-list">
            <text v-for="(item, idx) in history" :key="idx" class="tag" @tap="useKeyword(item)">{{ item }}</text>
          </view>
        </view>

        <!-- 推荐搜索 -->
        <view class="panel-section">
          <view class="section-title-bar">
            <text class="section-title">推荐搜索</text>
          </view>
          <view class="tag-list">
            <text v-for="(item, idx) in hotKeywords" :key="idx" class="tag hot" @tap="useKeyword(item)">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果 -->
      <view v-else class="result-panel">
        <view class="result-count">
          <text class="result-text">共找到 <text class="count-num">{{ resultList.length }}</text> 个商品</text>
        </view>
        <scroll-view scroll-y class="result-scroll" :style="{ height: `calc(100vh - ${statusBarHeight + 44 + 76}rpx)` }">
          <view class="product-list">
            <view v-for="product in resultList" :key="product.id" class="product-card" @tap="goDetail(product)">
              <image class="product-img" :src="product.image" mode="aspectFill" />
              <view class="product-info">
                <text class="product-name ellipsis-2">{{ product.name }} {{ product.spec }}</text>
                <text class="product-manufacturer">{{ product.manufacturer }}</text>
                <view class="product-tags">
                  <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="product-tag">{{ tag }}</text>
                </view>
                <view class="product-bottom">
                  <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
                  <text class="product-sales">售{{ product.sales }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="resultList.length === 0" class="empty">
            <view class="empty-icon">
              <wx-icon name="search" size="60" />
            </view>
            <text class="empty-title">未找到相关商品</text>
            <text class="empty-desc">换个关键词试试吧</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { mockProducts } from '../../mock/mockProducts.js'

const HISTORY_KEY = 'search_history'
const MAX_HISTORY = 10

export default {
  data() {
    return {
      statusBarHeight: 20,
      keyword: '',
      hasSearched: false,
      autoFocus: true,
      history: [],
      hotKeywords: ['阿莫西林', '布洛芬', '连花清瘟', '维生素C', '感冒灵', '板蓝根', '丹参', '头孢'],
      resultList: [],
      fromPage: '',
      backUrl: ''
    }
  },
  onLoad(options) {
    this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 20
    this.loadHistory()

    // 记录来源页，确保返回时回到正确的页面
    if (options && options.from) {
      this.fromPage = options.from
      const map = {
        quick: '/pages/quick/index',
        index: '/pages/index/index',
        mall: '/pages/mall/channel'
      }
      this.backUrl = map[options.from] || ''
    }
  },
  methods: {
    loadHistory() {
      try {
        const list = uni.getStorageSync(HISTORY_KEY)
        if (list && Array.isArray(list)) {
          this.history = list
        }
      } catch (e) {
        this.history = []
      }
    },
    saveHistory() {
      try {
        uni.setStorageSync(HISTORY_KEY, this.history)
      } catch (e) {}
    },
    addHistory(keyword) {
      if (!keyword || !keyword.trim()) return
      const word = keyword.trim()
      let list = this.history.filter(item => item !== word)
      list.unshift(word)
      if (list.length > MAX_HISTORY) {
        list = list.slice(0, MAX_HISTORY)
      }
      this.history = list
      this.saveHistory()
    },
    clearHistory() {
      uni.showModal({
        title: '提示',
        content: '确定清空搜索历史吗？',
        success: (res) => {
          if (res.confirm) {
            this.history = []
            this.saveHistory()
          }
        }
      })
    },
    clearKeyword() {
      this.keyword = ''
      this.hasSearched = false
      this.resultList = []
    },
    useKeyword(word) {
      this.keyword = word
      this.doSearch()
    },
    doSearch() {
      const word = this.keyword.trim()
      if (!word) {
        uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
        return
      }
      this.addHistory(word)
      this.hasSearched = true

      const lower = word.toLowerCase()
      this.resultList = mockProducts.filter(p => {
        return (
          p.name.toLowerCase().includes(lower) ||
          p.manufacturer.toLowerCase().includes(lower) ||
          p.spec.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          p.tags.some(tag => tag.toLowerCase().includes(lower))
        )
      })
    },
    goDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    goBack() {
      // 如果从指定页面进入，返回到该页面（避免 H5 iframe 中 navigateBack 跳到首页）
      if (this.backUrl) {
        const isTabBar = this.backUrl === '/pages/quick/index' || this.backUrl === '/pages/index/index'
        if (isTabBar) {
          uni.switchTab({ url: this.backUrl })
        } else {
          uni.redirectTo({ url: this.backUrl })
        }
        return
      }

      uni.navigateBack()
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
  border-bottom: 1rpx solid #f0f0f0;

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 12rpx;
  }

  .back-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      color: #1f2937;
      font-size: 44rpx;
      line-height: 1;
      font-weight: 400;
    }
  }

  .search-box {
    flex: 1;
    height: 64rpx;
    background: #F3F4F6;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    margin: 0 16rpx;

    .search-icon {
      margin-right: 10rpx;
      opacity: 0.55;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      height: 64rpx;
      font-size: 26rpx;
      color: #1f2937;
      border: none;
      background: transparent;
      outline: none;
    }

    .input-placeholder {
      color: #9CA3AF;
      font-size: 26rpx;
    }

    .clear-btn {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8rpx;
      flex-shrink: 0;

      .clear-icon {
        font-size: 28rpx;
        color: #9CA3AF;
        line-height: 1;
      }
    }
  }

  .search-btn {
    font-size: 28rpx;
    color: #2563EB;
    font-weight: 500;
    padding: 0 12rpx;
  }
}

.body {
  min-height: 100vh;
  box-sizing: border-box;
}

.search-panel {
  background: #fff;
  padding: 24rpx;
  min-height: 100vh;
}

.panel-section {
  margin-bottom: 32rpx;

  .section-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
    }

    .delete-btn {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.55;
    }
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .tag {
      padding: 10rpx 24rpx;
      background: #F3F4F6;
      border-radius: 28rpx;
      font-size: 26rpx;
      color: #4B5563;

      &.hot {
        background: #EFF6FF;
        color: #2563EB;
      }

      &:active {
        opacity: 0.7;
      }
    }
  }
}

.result-panel {
  .result-count {
    padding: 20rpx 24rpx;
    background: #f5f6fa;

    .result-text {
      font-size: 24rpx;
      color: #6B7280;
    }

    .count-num {
      color: #2563EB;
      font-weight: 600;
    }
  }

  .result-scroll {
    background: #f5f6fa;
  }
}

.product-list {
  padding: 16rpx 24rpx;
}

.product-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .product-img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    background: #f5f6fa;
    flex-shrink: 0;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  .product-name {
    font-size: 28rpx;
    color: #1f2937;
    font-weight: 500;
    line-height: 1.4;
  }

  .product-manufacturer {
    font-size: 24rpx;
    color: #6B7280;
    margin-top: 8rpx;
  }

  .product-tags {
    display: flex;
    gap: 8rpx;
    margin-top: 10rpx;

    .product-tag {
      font-size: 20rpx;
      color: #2563EB;
      background: #EFF6FF;
      padding: 2rpx 10rpx;
      border-radius: 6rpx;
    }
  }

  .product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12rpx;

    .product-price {
      font-size: 32rpx;
      color: #EF4444;
      font-weight: 700;
    }

    .product-sales {
      font-size: 22rpx;
      color: #9CA3AF;
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 24rpx;

  .empty-icon {
    opacity: 0.25;
  }

  .empty-title {
    font-size: 30rpx;
    color: #4B5563;
    margin-top: 24rpx;
  }

  .empty-desc {
    font-size: 26rpx;
    color: #9CA3AF;
    margin-top: 8rpx;
  }
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
