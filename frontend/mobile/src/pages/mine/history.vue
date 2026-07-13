<template>
  <view class="page">
    <scroll-view scroll-y class="history-scroll">
      <view v-for="video in historyVideos" :key="video.id" class="video-card" @tap="goPlay(video)">
        <view class="video-cover" style="position: relative; overflow: hidden;">
          <image :src="video.cover" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
          <view class="play-icon-wrap">
            <text class="play-icon"><wx-icon name="play" size="40" /></text>
          </view>
          <text class="video-duration">{{ video.duration }}</text>
        </view>
        <view class="video-info">
          <text class="video-title ellipsis-2">{{ video.title }}</text>
          <text class="video-category">{{ video.category }}</text>
          <view class="video-meta">
            <text class="meta-text"><wx-icon name="play" size="20" /> {{ formatViews(video.views) }}次播放</text>
            <text class="watch-time">观看于 {{ video.watchTime }}</text>
          </view>
        </view>
      </view>

      <view v-if="historyVideos.length === 0" class="empty">
        <text class="empty-icon"><wx-icon name="video" size="120" /></text>
        <text class="empty-text">暂无浏览记录</text>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mockVideos } from '../../mock/mockVideos.js'

export default {
  data() {
    return {
      videos: mockVideos
    }
  },
  computed: {
    historyVideos() {
      const times = ['2026-07-11 21:30', '2026-07-11 20:15', '2026-07-09 21:00', '2026-07-05 19:30', '2026-06-30 20:45']
      return this.videos.slice(0, 5).map((v, idx) => ({
        ...v,
        watchTime: times[idx] || '2026-07-01 12:00'
      }))
    }
  },
  methods: {
    formatViews(views) {
      if (views >= 10000) return (views / 10000).toFixed(1) + '万'
      return views.toString()
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

.history-scroll {
  height: 100vh;
}

.video-card {
  display: flex;
  background: #fff;
  margin: 12rpx 16rpx;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 16rpx;

  .video-cover {
    position: relative;
    width: 240rpx;
    height: 150rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .play-icon-wrap {
      width: 56rpx;
      height: 56rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .play-icon {
        color: #fff;
        font-size: 24rpx;
        margin-left: 4rpx;
      }
    }

    .video-duration {
      position: absolute;
      bottom: 6rpx;
      right: 6rpx;
      font-size: 18rpx;
      color: #fff;
      background: rgba(0, 0, 0, 0.4);
      padding: 2rpx 6rpx;
      border-radius: 4rpx;
    }
  }

  .video-info {
    flex: 1;
    margin-left: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .video-title {
      font-size: 26rpx;
      color: #1f2937;
      line-height: 1.4;
    }

    .video-category {
      font-size: 20rpx;
      color: #2563EB;
      background: #DBEAFE;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      align-self: flex-start;
    }

    .video-meta {
      .meta-text {
        font-size: 20rpx;
        color: #9CA3AF;
        margin-right: 12rpx;
      }

      .watch-time {
        font-size: 20rpx;
        color: #9CA3AF;
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
