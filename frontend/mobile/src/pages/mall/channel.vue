<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px', background: channel.themeGradient }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="nav-center">
          <text class="nav-title">{{ channel.name }}</text>
          <text v-if="channel.tag" class="nav-tag">{{ channel.tag }}</text>
        </view>
        <view class="nav-right" @tap="goSearch">
          <wx-icon name="search-white" size="28" />
        </view>
      </view>
    </view>

    <!-- 占位 -->
    <view :style="{ height: statusBarHeight + 44 + 'px' }"></view>

    <scroll-view scroll-y class="page-scroll" :style="{ height: `calc(100vh - ${statusBarHeight + 44}px)` }" @scrolltolower="loadMore">
      <mall-channel-content
        :channel="channel"
        @goCategory="goCategory"
        @goProductDetail="goProductDetail"
        @goMoreProducts="goMoreProducts"
      />
    </scroll-view>
  </view>
</template>

<script>
import { getMallChannelById, mockMallChannels } from '../../mock/mockMallChannels.js'

export default {
  data() {
    return {
      statusBarHeight: 20,
      channelId: '',
      channel: {
        name: '',
        themeColor: '#2563EB',
        themeGradient: 'linear-gradient(180deg, #2563EB 0%, #3B82F6 100%)',
        textColor: '#FFFFFF',
        modules: []
      }
    }
  },
  onLoad(options) {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
    this.loadChannel(options.id || 'clinic')
  },
  onShow() {
    this.refreshFromRoute()
  },
  mounted() {
    this.refreshFromRoute()
    // #ifdef H5
    // 监听后台装修配置通过 postMessage 推送的实时预览数据
    window.addEventListener('message', this.onPreviewMessage)
    // #endif
  },
  beforeDestroy() {
    // #ifdef H5
    window.removeEventListener('message', this.onPreviewMessage)
    // #endif
  },
  methods: {
    loadChannel(id) {
      if (this.channelId === id) return
      this.channelId = id
      // #ifdef H5
      // 优先读取后台装修配置的本地缓存（预览模式）
      try {
        const saved = localStorage.getItem('pharma_mall_channels')
        if (saved) {
          const channels = JSON.parse(saved)
          const savedChannel = channels.find(c => c.id === id)
          if (savedChannel) {
            this.channel = savedChannel
            return
          }
        }
      } catch (e) {}
      // #endif
      this.channel = getMallChannelById(id)
    },
    refreshFromRoute() {
      // #ifdef H5
      const hash = window.location.hash || ''
      const match = hash.match(/[?&]id=([^&#]+)/)
      this.loadChannel(match ? decodeURIComponent(match[1]) : 'clinic')
      // #endif
      // #ifndef H5
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.options) {
        this.loadChannel(currentPage.options.id || 'clinic')
      }
      // #endif
    },
    onPreviewMessage(event) {
      // #ifdef H5
      const data = event.data
      if (data && data.type === 'mallChannelsPreview' && Array.isArray(data.channels)) {
        try {
          localStorage.setItem('pharma_mall_channels', JSON.stringify(data.channels))
          const savedChannel = data.channels.find(c => c.id === this.channelId)
          if (savedChannel) {
            this.channel = savedChannel
          }
        } catch (e) {}
      }
      // #endif
    },
    goBack() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    goCategory(cat) {
      uni.navigateTo({ url: `/pages/category/index?cate=${encodeURIComponent(cat.name)}` })
    },
    goProductDetail(product) {
      uni.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
    },
    goMoreProducts() {
      uni.navigateTo({ url: '/pages/category/index' })
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
    color: #fff;
    font-size: 44rpx;
    line-height: 1;
    font-weight: 400;
    -webkit-text-stroke: 1rpx rgba(128, 128, 128, 0.5);
  }

  .nav-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .nav-title {
    color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    line-height: 1.2;
  }

  .nav-tag {
    color: rgba(255, 255, 255, 0.85);
    font-size: 20rpx;
    margin-top: 2rpx;
    line-height: 1.2;
  }

  .nav-right {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.page-scroll {
  background: #f5f6fa;
}

.module-wrap {
  margin-bottom: 20rpx;
}

.banner-module {
  padding: 24rpx;

  .banner-swiper {
    height: 260rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }

  .banner-item {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
    overflow: hidden;
  }

  .banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.08;
  }

  .banner-text-wrap {
    position: relative;
    z-index: 2;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }

  .banner-title {
    font-size: 40rpx;
    font-weight: 700;
    margin-bottom: 12rpx;
  }

  .banner-desc {
    font-size: 26rpx;
    opacity: 0.95;
  }
}

.notice-module {
  margin: 0 24rpx 20rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 18rpx 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);

  .notice-icon {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14rpx;
    flex-shrink: 0;

    .notice-icon-text {
      color: #fff;
      font-size: 24rpx;
      font-weight: 700;
      line-height: 1;
    }
  }

  .notice-text {
    flex: 1;
    font-size: 26rpx;
    color: #4B5563;
  }
}

.section-card {
  margin: 0 24rpx 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.module-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1F2937;
}

.module-more {
  font-size: 24rpx;
  color: #9CA3AF;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;

  .category-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;

    .category-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10rpx;

      .category-emoji {
        font-size: 42rpx;
        line-height: 1;
      }
    }

    .category-text {
      font-size: 24rpx;
      color: #4B5563;
    }
  }
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0 -10rpx;

  .product-card {
    width: calc(50% - 20rpx);
    margin: 0 10rpx 20rpx;
    background: #F9FAFB;
    border-radius: 16rpx;
    overflow: hidden;

    .product-img-wrap {
      width: 100%;
      height: 220rpx;
      background: #F3F4F6;
      position: relative;
      overflow: hidden;
    }

    .product-img {
      width: 100%;
      height: 100%;
    }

    .product-info {
      padding: 16rpx;
    }

    .product-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #1F2937;
      line-height: 1.4;
    }

    .product-manufacturer {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 6rpx;
    }

    .product-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12rpx;

      .product-price {
        font-size: 30rpx;
        font-weight: 700;
        color: #EF4444;
      }

      .product-sales {
        font-size: 20rpx;
        color: #9CA3AF;
      }
    }
  }
}

.activity-scroll {
  .activity-list {
    display: flex;
    padding: 4rpx 0;
  }

  .activity-card {
    flex-shrink: 0;
    width: 320rpx;
    height: 180rpx;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-right: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .activity-tag {
      align-self: flex-start;
      font-size: 20rpx;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      margin-bottom: 12rpx;
    }

    .activity-title {
      font-size: 28rpx;
      font-weight: 700;
      margin-bottom: 8rpx;
    }

    .activity-desc {
      font-size: 22rpx;
      opacity: 0.9;
    }
  }
}

.load-more {
  text-align: center;
  padding: 40rpx 0;

  .load-more-text {
    font-size: 24rpx;
    color: #9CA3AF;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
