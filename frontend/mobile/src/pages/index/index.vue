<template>
  <view class="page">
    <!-- 蓝色头部区域 -->
    <view class="home-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <!-- 自定义导航栏 -->
      <view class="header-nav">
        <view class="nav-left"></view>
        <text class="nav-title">{{ mallConfig.platformName }}</text>
        <view class="nav-menu" @tap="goMessage">
          <view class="menu-dot"></view>
          <view class="menu-dot"></view>
        </view>
      </view>

      <!-- 搜索栏 -->
      <view class="header-search" @tap="goSearch">
        <wx-icon class="search-icon" name="search" size="26" />
        <text class="search-placeholder">商品通用名/厂家/品牌</text>
        <view class="search-scan">
          <text class="scan-icon">☐</text>
        </view>
      </view>

      <!-- 分类商城入口 -->
      <scroll-view scroll-x class="function-scroll" show-scrollbar="false">
        <view class="function-list">
          <view
            v-for="(item, idx) in mallChannels"
            :key="idx"
            class="function-item"
            :class="{ active: currentMall && currentMall.id === item.id }"
            :style="{ background: item.themeColor }"
            @tap="selectMall(item)"
          >
            <text class="function-text">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view scroll-y class="page-scroll" @scroll="onScroll" @scrolltolower="loadMore">
      <!-- 默认首页内容 -->
      <view v-if="!currentMall" class="home-content">
        <!-- 品牌轮播图 -->
      <view class="banner-wrap">
        <swiper class="banner-swiper" circular autoplay :interval="4000" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#ffffff">
          <swiper-item v-for="(item, idx) in banners" :key="idx">
            <view class="banner-item" :style="{ background: item.bg }" @tap="goCategoryPage">
              <image class="banner-image" :src="item.image" mode="aspectFill" />
              <view class="banner-text-wrap">
                <text class="banner-title" :style="{ color: item.text }">{{ item.title }}</text>
                <text class="banner-desc" :style="{ color: item.text }">{{ item.desc }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 快捷功能网格 -->
      <view class="section">
        <view class="quick-grid">
          <view v-for="(cat, idx) in quickEntries" :key="idx" class="quick-item" @tap="goQuickEntry(cat)">
            <view class="quick-icon" :style="{ background: cat.bg }">
              <image class="quick-icon-img" :src="`/static/icons/${cat.icon}.png`" mode="aspectFit" />
            </view>
            <text class="quick-text">{{ cat.name }}</text>
          </view>
        </view>
      </view>

      <!-- 活动专区：卡片横向滑动 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">活动专区</text>
          <text class="section-more" @tap="goActivities">更多 ></text>
        </view>
        <scroll-view scroll-x class="activity-scroll" show-scrollbar="false">
          <view class="activity-list">
            <view v-for="act in activities" :key="act.id" class="activity-card" :style="{ background: act.bannerColor }" @tap="goActivityDetail(act)">
              <view class="activity-tag" :style="{ background: act.typeColor }">{{ act.type }}</view>
              <text class="activity-card-title" :style="{ color: act.bannerText }">{{ act.title }}</text>
              <text class="activity-card-desc" :style="{ color: act.bannerText }">{{ act.description }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 短视频专区 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">短视频专区</text>
          <text class="section-more" @tap="goVideoList">更多 ></text>
        </view>
        <scroll-view scroll-x class="video-scroll" show-scrollbar="false">
          <view class="video-list">
            <view v-for="video in videos.slice(0, 6)" :key="video.id" class="video-card" @tap="goVideoPlay(video)">
              <view class="video-cover" style="position: relative; overflow: hidden;">
                <image :src="video.cover" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
                <view style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                  <view class="video-play-icon">
                    <text class="play-text"><wx-icon name="play" size="40" /></text>
                  </view>
                  <view class="video-reward-tag">
                    <text class="reward-text">+{{ video.reward }}积分</text>
                  </view>
                  <text class="video-duration">{{ video.duration }}</text>
                </view>
              </view>
              <text class="video-title ellipsis-2">{{ video.title }}</text>
              <view class="video-info">
                <text class="video-views"><wx-icon name="play" size="20" /> {{ formatViews(video.views) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 积分商城入口 -->
      <view class="section">
        <view class="points-entry" @tap="goPoints">
          <view class="points-info">
            <text class="points-label">我的积分</text>
            <text class="points-num">{{ store.state.user.points }}</text>
          </view>
          <view class="points-products">
            <view v-for="p in pointsProducts.slice(0, 3)" :key="p.id" class="points-product-mini">
              <image class="pp-mini-img" :src="p.image" mode="aspectFill" />
              <text class="pp-mini-points">{{ p.points }}积分</text>
            </view>
          </view>
          <text class="points-arrow">去兑换 ></text>
        </view>
      </view>

      <!-- 商品推荐列表 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">为你推荐</text>
          <view class="view-toggle" @tap="toggleViewMode">
            <view class="toggle-icon">
              <template v-if="viewMode === 'list'">
                <view class="grid-square" v-for="i in 4" :key="i"></view>
              </template>
              <template v-else>
                <view class="list-line" v-for="i in 3" :key="i"></view>
              </template>
            </view>
          </view>
        </view>
        <view class="product-list" :class="{ 'grid-view': viewMode === 'grid' }">
          <view v-for="product in recommendProducts" :key="product.id" class="product-card" @tap="goProductDetail(product)">
            <image class="product-img" :src="product.image" mode="aspectFill" />
            <view class="product-info">
              <view class="product-main">
                <text class="product-name">{{ product.name }} {{ product.spec }}</text>
                <text class="product-manufacturer">{{ product.manufacturer }}</text>
                <view v-if="product.tags && product.tags.length" class="product-tags">
                  <text v-for="tag in product.tags" :key="tag" class="product-tag">{{ tag }}</text>
                </view>
              </view>
              <view class="product-bottom">
                <view class="price-wrap">
                  <text class="product-price">¥{{ product.price.toFixed(2) }}</text>
                  <text v-if="product.originPrice > product.price" class="product-origin">¥{{ product.originPrice.toFixed(2) }}</text>
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
      </view>
      </view>

      <view class="load-more" v-if="!currentMall">
        <text class="load-more-text">— 已经到底了 —</text>
      </view>

      <!-- 子商城内容 -->
      <view v-else class="mall-content">
        <view class="mall-fab-back" @tap="clearMall">
          <text class="fab-back-icon">‹</text>
        </view>
        <mall-channel-content
          :channel="currentMall"
          @goCategory="goCategory"
          @goProductDetail="goProductDetail"
          @goMoreProducts="goCategoryPage"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'
import MallChannelContent from '../../components/mall-channel-content.vue'
import { mockMallConfig } from '../../mock/mockMallConfig.js'
import { mockMallChannels } from '../../mock/mockMallChannels.js'
import { mockActivities } from '../../mock/mockActivities.js'
import { mockVideos } from '../../mock/mockVideos.js'
import { mockProducts } from '../../mock/mockProducts.js'
import { mockPoints } from '../../mock/mockPoints.js'

export default {
  components: { MallChannelContent },
  data() {
    return {
      store,
      mallConfig: mockMallConfig,
      statusBarHeight: 20,
      scrolled: false,
      viewMode: 'list',
      currentMall: null,
      banners: mockMallConfig.banners,
      activities: mockActivities,
      videos: mockVideos,
      pointsProducts: mockPoints.mallProducts,
      mallChannels: mockMallChannels,
      quickEntries: [
        { name: '快捷采购', icon: 'cart', emoji: '🛒', bg: 'linear-gradient(135deg, #60A5FA, #3B82F6)', path: '/pages/quick/index' },
        { name: '我的收藏', icon: 'star', emoji: '⭐', bg: 'linear-gradient(135deg, #F87171, #EF4444)', path: '/pages/mine/collect' },
        { name: '集采拼团', icon: 'people', emoji: '👥', bg: 'linear-gradient(135deg, #FBBF24, #F59E0B)', path: '/pages/category/index' },
        { name: '商品快讯', icon: 'bell', emoji: '🔔', bg: 'linear-gradient(135deg, #34D399, #10B981)', path: '/pages/category/index' },
        { name: '采购车', icon: 'cart', emoji: '🛒', bg: 'linear-gradient(135deg, #A78BFA, #8B5CF6)', path: '/pages/cart/index' }
      ]
    }
  },
  computed: {
    recommendProducts() {
      return [...mockProducts].sort((a, b) => b.sales - a.sales).slice(0, 10)
    }
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    onScroll(e) {
      this.scrolled = e.detail.scrollTop > 8
    },
    formatViews(views) {
      if (views >= 10000) return (views / 10000).toFixed(1) + '万'
      return views.toString()
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    goCategoryPage() {
      uni.navigateTo({ url: '/pages/category/index' })
    },
    goMallChannel(item) {
      uni.navigateTo({ url: `/pages/mall/channel?id=${item.id}` })
    },
    selectMall(item) {
      if (this.currentMall && this.currentMall.id === item.id) {
        this.currentMall = null
      } else {
        this.currentMall = item
      }
    },
    clearMall() {
      this.currentMall = null
    },
    goQuickEntry(cat) {
      if (cat.path === '/pages/quick/index' || cat.path === '/pages/cart/index' || cat.path === '/pages/video/index') {
        uni.switchTab({ url: cat.path })
      } else if (cat.path) {
        uni.navigateTo({ url: cat.path })
      } else {
        uni.showToast({ title: cat.name, icon: 'none' })
      }
    },
    goMessage() {
      uni.navigateTo({ url: '/pages/message/index' })
    },
    goActivities() {
      uni.showToast({ title: '更多活动', icon: 'none' })
    },
    goActivity(act) {
      uni.navigateTo({ url: `/pages/category/index?activityId=${act.id}` })
    },
    goActivityDetail(act) {
      uni.navigateTo({ url: `/pages/activity/detail?id=${act.id}` })
    },
    goCategory(cat) {
      uni.navigateTo({ url: `/pages/category/index?cate=${encodeURIComponent(cat.name)}` })
    },
    goVideoList() {
      uni.switchTab({ url: '/pages/video/index' })
    },
    goVideoPlay(video) {
      uni.navigateTo({ url: `/pages/video/play?id=${video.id}` })
    },
    goPoints() {
      uni.navigateTo({ url: '/pages/points/index' })
    },
    goProductDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    loadMore() {
      uni.showToast({ title: '已加载全部', icon: 'none' })
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'grid' : 'list'
      uni.showToast({ title: this.viewMode === 'list' ? '切换为列表' : '切换为网格', icon: 'none' })
    },
    addToCart(product) {
      store.addToCart(product, 1)
      uni.showToast({ title: '已加入采购车', icon: 'success' })
    },
    showMoreActions(product) {
      const opts = ['加入收藏', '分享商品', '取消']
      uni.showActionSheet({
        itemList: opts,
        success: (res) => {
          if (res.tapIndex === 0) {
            product.isCollected = true
            uni.showToast({ title: '已收藏', icon: 'success' })
          } else if (res.tapIndex === 1) {
            uni.showToast({ title: '分享商品', icon: 'none' })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: calc(100vh - 100rpx);
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.home-header {
  flex-shrink: 0;
  background: linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%);
  border-radius: 0 0 24rpx 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.2);

  .header-nav {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24rpx;

    .nav-left {
      width: 88rpx;
    }

    .nav-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #fff;
      letter-spacing: 1rpx;
    }

    .nav-menu {
      width: 88rpx;
      height: 48rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.35);
      border-radius: 28rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;

      .menu-dot {
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .header-search {
    height: 72rpx;
    background: #fff;
    border-radius: 36rpx;
    margin: 8rpx 24rpx 0;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

    .search-icon {
      margin-right: 10rpx;
      opacity: 0.6;
      flex-shrink: 0;
    }

    .search-placeholder {
      flex: 1;
      font-size: 26rpx;
      color: #9CA3AF;
    }

    .search-scan {
      width: 48rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      flex-shrink: 0;

      .scan-icon {
        font-size: 32rpx;
        color: #6B7280;
        line-height: 1;
      }
    }
  }

  .function-scroll {
    height: 72rpx;
    margin-top: 8rpx;

    .function-list {
      display: flex;
      align-items: center;
      height: 72rpx;
      padding: 0 12rpx;
    }

    .function-item {
      flex-shrink: 0;
      padding: 0 14rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 28rpx;
      margin: 0 8rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
      transition: transform 0.15s ease, opacity 0.15s ease;

      .function-text {
        font-size: 26rpx;
        color: #fff;
        font-weight: 500;
      }

      &:active {
        opacity: 0.85;
        transform: scale(0.96);
      }

      &.active {
        box-shadow: 0 0 0 4rpx rgba(255, 255, 255, 0.45), 0 6rpx 16rpx rgba(0, 0, 0, 0.12);
        transform: scale(1.04);
      }
    }
  }
}

.page-scroll {
  flex: 1;
  height: 100%;
  min-height: 0;
  background: #f5f6fa;
}

.banner-wrap {
  padding: 20rpx 24rpx;

  .banner-swiper {
    height: 280rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }

  .banner-item {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    position: relative;
    overflow: hidden;
  }

  .banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .banner-text-wrap {
    display: flex;
    flex-direction: column;
  }

  .banner-title {
    font-size: 40rpx;
    font-weight: 700;
  }

  .banner-desc {
    font-size: 26rpx;
    margin-top: 12rpx;
    opacity: 0.9;
  }
}

.section {
  margin-top: 20rpx;
  background: #fff;
  padding: 24rpx;

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

  .section-more {
    font-size: 26rpx;
    color: #9CA3AF;
  }

  .view-toggle {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F3F4F6;
    border-radius: 12rpx;

    .toggle-icon {
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

.activity-scroll {
  white-space: nowrap;

  .activity-list {
    display: flex;
    padding-bottom: 10rpx;
  }

  .activity-card {
    display: inline-flex;
    flex-direction: column;
    width: 375rpx;
    height: 220rpx;
    margin-right: 20rpx;
    border-radius: 16rpx;
    padding: 24rpx;
    position: relative;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    flex-shrink: 0;
    min-width: 375rpx;

    .activity-tag {
      align-self: flex-start;
      font-size: 20rpx;
      color: #fff;
      padding: 4rpx 10rpx;
      border-radius: 8rpx;
      margin-bottom: 16rpx;
    }

    .activity-card-title {
      font-size: 30rpx;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 10rpx;
      height: 78rpx;
      overflow: hidden;
    }

    .activity-card-desc {
      font-size: 22rpx;
      opacity: 0.8;
      line-height: 1.4;
      height: 60rpx;
      overflow: hidden;
    }
  }
}

.quick-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 8rpx 0;

  .quick-item {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16rpx;

    .quick-icon {
      width: 92rpx;
      height: 92rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.08);

      .quick-icon-img {
        width: 48rpx;
        height: 48rpx;
        filter: brightness(0) invert(1);
      }
    }

    .quick-text {
      font-size: 24rpx;
      color: #374151;
      font-weight: 500;
    }
  }
}

.video-scroll {
  white-space: nowrap;

  .video-list {
    display: flex;
    padding-bottom: 10rpx;
  }

  .video-card {
    display: inline-flex;
    flex-direction: column;
    width: 300rpx;
    margin-right: 20rpx;
  }

  .video-cover {
    position: relative;
    width: 300rpx;
    height: 200rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-play-icon {
    width: 64rpx;
    height: 64rpx;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .play-text {
      color: #fff;
      font-size: 28rpx;
      margin-left: 4rpx;
    }
  }

  .video-reward-tag {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: #F59E0B;
    padding: 4rpx 10rpx;
    border-radius: 8rpx;

    .reward-text {
      font-size: 20rpx;
      color: #fff;
    }
  }

  .video-duration {
    position: absolute;
    bottom: 8rpx;
    right: 8rpx;
    font-size: 20rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    padding: 2rpx 8rpx;
    border-radius: 4rpx;
  }

  .video-title {
    font-size: 26rpx;
    color: #1f2937;
    margin-top: 10rpx;
    line-height: 1.4;
    height: 72rpx;
    overflow: hidden;
  }

  .video-info {
    .video-views {
      font-size: 22rpx;
      color: #9CA3AF;
    }
  }
}

.points-entry {
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;

  .points-info {
    display: flex;
    flex-direction: column;
    margin-right: 24rpx;

    .points-label {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }

    .points-num {
      font-size: 44rpx;
      font-weight: 700;
      color: #fff;
    }
  }

  .points-products {
    flex: 1;
    display: flex;
    gap: 12rpx;

    .points-product-mini {
      display: flex;
      flex-direction: column;
      align-items: center;

      .pp-mini-img {
        width: 72rpx;
        height: 72rpx;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .pp-mini-icon {
          font-size: 32rpx;
          font-weight: 600;
        }
      }

      .pp-mini-points {
        font-size: 18rpx;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 4rpx;
      }
    }
  }

  .points-arrow {
    font-size: 24rpx;
    color: #fff;
  }
}

.product-list {
  padding: 0;

  .product-card {
    display: flex;
    background: #fff;
    border-radius: 12rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  }

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

    .product-origin {
      font-size: 22rpx;
      color: #9CA3AF;
      text-decoration: line-through;
      margin-left: 8rpx;
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
    }

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
  }
}

.load-more {
  padding: 30rpx 0;
  text-align: center;

  .load-more-text {
    font-size: 24rpx;
    color: #9CA3AF;
  }
}

.mall-content {
  padding-top: var(--status-bar-height);

  .mall-fab-back {
    position: fixed;
    left: 20rpx;
    top: calc(var(--status-bar-height) + 20rpx);
    z-index: 50;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    .fab-back-icon {
      font-size: 44rpx;
      line-height: 1;
      margin-top: -4rpx;
    }
  }
}
</style>
