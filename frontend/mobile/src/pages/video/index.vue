<template>
  <view class="page">
    <!-- 自定义导航栏 -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">短视频专区</text>
      </view>
    </view>
    <view :style="{ height: statusBarHeight + 44 + 'px' }"></view>

    <!-- 顶部分类标签 -->
    <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
      <view class="tab-list">
        <view 
          v-for="(tab, idx) in tabs" 
          :key="idx" 
          class="tab-item" 
          :class="{ active: currentTab === idx }"
          @tap="switchTab(idx)"
        >
          <text class="tab-text" :class="{ active: currentTab === idx }">{{ tab }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 视频列表 -->
    <scroll-view scroll-y class="video-list-scroll">
      <view class="video-grid">
        <view v-for="video in filteredVideos" :key="video.id" class="video-card" @tap="goPlay(video)">
          <view class="video-cover" style="position: relative; overflow: hidden;">
            <image :src="video.cover" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
            <view class="play-overlay">
              <text class="play-icon"><wx-icon name="play" size="40" /></text>
            </view>
            <view class="reward-badge">
              <text class="reward-text">+{{ video.reward }}积分</text>
            </view>
            <text class="video-duration">{{ video.duration }}</text>
          </view>
          <view class="video-info">
            <text class="video-title ellipsis-2">{{ video.title }}</text>
            <view class="video-meta">
              <text class="meta-text"><wx-icon name="play" size="20" /> {{ formatViews(video.views) }}</text>
              <text class="meta-text"><wx-icon name="pill" size="20" /> {{ video.productIds.length }}个药品</text>
            </view>
          </view>
        </view>
      </view>

      <view class="load-end">
        <text class="load-end-text">— 已经到底了 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mockVideos } from '../../mock/mockVideos.js'

export default {
  data() {
    return {
      statusBarHeight: 20,
      currentTab: 0,
      tabs: ['全部', '用药科普', '季节养生', '慢病管理', '药品对比', '营养保健', '日常保健', '抗过敏专题', '中医中药', '消化健康', '清热解毒'],
      videos: mockVideos
    }
  },
  computed: {
    filteredVideos() {
      if (this.currentTab === 0) return this.videos
      const cate = this.tabs[this.currentTab]
      return this.videos.filter(v => v.category === cate)
    }
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
  },
  methods: {
    formatViews(views) {
      if (views >= 10000) return (views / 10000).toFixed(1) + '万'
      return views.toString()
    },
    switchTab(idx) {
      this.currentTab = idx
    },
    goPlay(video) {
      uni.navigateTo({ url: `/pages/video/play?id=${video.id}` })
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
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .nav-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .nav-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #1f2937;
    }
  }
}

.tab-scroll {
  white-space: nowrap;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .tab-list {
    display: flex;
    flex-wrap: nowrap;
    padding: 0 12rpx;
  }

  .tab-item {
    display: inline-flex;
    flex-shrink: 0;
    padding: 20rpx 24rpx;

    .tab-text {
      font-size: 28rpx;
      color: #6B7280;
      white-space: nowrap;

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

.video-list-scroll {
  height: calc(100vh - 180rpx);
}

.video-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16rpx;

  .video-card {
    width: 48.5%;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 16rpx;
  }

  .video-cover {
    position: relative;
    width: 100%;
    height: 280rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .play-overlay {
      width: 72rpx;
      height: 72rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .play-icon {
        color: #fff;
        font-size: 32rpx;
        margin-left: 6rpx;
      }
    }

    .reward-badge {
      position: absolute;
      top: 12rpx;
      right: 12rpx;
      background: #F59E0B;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;

      .reward-text {
        font-size: 20rpx;
        color: #fff;
      }
    }

    .video-duration {
      position: absolute;
      bottom: 12rpx;
      right: 12rpx;
      font-size: 22rpx;
      color: #fff;
      background: rgba(0, 0, 0, 0.4);
      padding: 2rpx 10rpx;
      border-radius: 6rpx;
    }
  }

  .video-info {
    padding: 14rpx;

    .video-title {
      font-size: 26rpx;
      color: #1f2937;
      line-height: 1.4;
      height: 72rpx;
      overflow: hidden;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 8rpx;

      .meta-text {
        font-size: 20rpx;
        color: #9CA3AF;
      }
    }
  }
}

.load-end {
  padding: 30rpx 0;
  text-align: center;

  .load-end-text {
    font-size: 24rpx;
    color: #9CA3AF;
  }
}
</style>
