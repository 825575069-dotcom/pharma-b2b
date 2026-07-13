<template>
  <view class="page">
    <!-- 视频播放区域 -->
    <view class="video-player" :style="{ paddingTop: statusBarHeight + 'px' }">
      <video
        v-if="video.videoUrl"
        class="player-video"
        :src="video.videoUrl"
        :poster="video.cover"
        :controls="true"
        :show-center-play-btn="true"
        :show-play-btn="true"
        :show-fullscreen-btn="true"
        object-fit="cover"
        @play="onVideoPlay"
        @pause="onVideoPause"
        @ended="onVideoEnded"
        @timeupdate="onTimeUpdate"
        style="width: 100%; height: 100%;"
      ></video>
      <image v-else :src="video.cover" mode="aspectFill" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5;" />
      <view class="player-back" @tap="goBack">
        <text class="back-icon"><wx-icon name="back" size="36" /></text>
      </view>
      <view class="player-area">
        <view class="play-button" @tap="togglePlay">
          <text class="play-icon">{{ isPlaying ? '<wx-icon name="pause" size="40" />' : '<wx-icon name="play" size="40" />' }}</text>
        </view>
        <text class="video-title-overlay">{{ video.title }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progress + '%' }"></view>
        </view>
        <view class="progress-info">
          <text class="time-text">{{ currentTime }}</text>
          <text class="time-text">/{{ video.duration }}</text>
        </view>
      </view>
      <view class="player-share" @tap="shareVideo">
        <text class="share-icon"><wx-icon name="share" size="32" /></text>
        <text class="share-label">分享</text>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll">
      <!-- 视频信息 -->
      <view class="video-info-section">
        <text class="video-title">{{ video.title }}</text>
        <view class="video-meta">
          <text class="meta-item"><wx-icon name="play" size="20" /> {{ formatViews(video.views) }}次播放</text>
          <text class="meta-item"><wx-icon name="heart" size="20" /> {{ formatViews(video.likes) }}点赞</text>
          <view class="reward-tag">
            <text class="reward-text">观看奖励+{{ video.reward }}积分</text>
          </view>
        </view>
      </view>

      <!-- 绑定药品列表 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">绑定药品 ({{ bindedProducts.length }})</text>
          <text class="section-action" @tap="addAllToCart">全部加购</text>
        </view>
        <view v-for="product in bindedProducts" :key="product.id" class="product-item">
          <image class="p-img" :src="product.image" mode="aspectFill" />
          <view class="p-info">
            <text class="p-name ellipsis">{{ product.name }}</text>
            <text class="p-spec">{{ product.spec }}</text>
            <text class="p-price">¥{{ product.price.toFixed(2) }}</text>
          </view>
          <view class="p-cart-btn" @tap="addToCart(product)">
            <text class="cart-btn-text">加入购物车</text>
          </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">评论 ({{ comments.length }})</text>
        </view>
        <view v-for="comment in comments" :key="comment.id" class="comment-item">
          <view class="comment-avatar" :style="{ background: getAvatarColor(comment.user) }">
            <text class="avatar-text">{{ comment.user.charAt(0) }}</text>
          </view>
          <view class="comment-body">
            <text class="comment-user">{{ comment.user }}</text>
            <text class="comment-content">{{ comment.content }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
        </view>
        <view v-if="comments.length === 0" class="empty-comments">
          <text class="empty-text">暂无评论，快来抢沙发吧</text>
        </view>
      </view>

      <!-- 推荐视频 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">相关推荐</text>
        </view>
        <view class="recommend-list">
          <view v-for="v in recommendVideos" :key="v.id" class="recommend-item" @tap="goVideo(v)">
            <view class="r-cover" style="position: relative; overflow: hidden;">
              <image :src="v.cover" mode="aspectFill" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;" />
              <text class="r-duration">{{ v.duration }}</text>
            </view>
            <view class="r-info">
              <text class="r-title ellipsis-2">{{ v.title }}</text>
              <text class="r-views"><wx-icon name="play" size="20" /> {{ formatViews(v.views) }}次播放</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 120rpx;"></view>
    </scroll-view>

    <!-- 底部评论输入 -->
    <view class="comment-bar">
      <input class="comment-input" placeholder="写评论..." v-model="commentText" confirm-type="send" @confirm="submitComment" />
      <view class="comment-send" @tap="submitComment">
        <text class="send-text">发送</text>
      </view>
    </view>

    <!-- 积分奖励弹窗 -->
    <view v-if="showReward" class="reward-popup-mask" @tap="closeReward">
      <view class="reward-popup" @tap.stop>
        <text class="reward-emoji"><wx-icon name="gift" size="80" /></text>
        <text class="reward-title">恭喜获得积分</text>
        <text class="reward-points">+{{ video.reward }} 积分</text>
        <text class="reward-desc">观看视频完成，积分已到账</text>
        <view class="reward-btn" @tap="closeReward">
          <text class="reward-btn-text">太好了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mockVideos } from '../../mock/mockVideos.js'
import { mockProducts } from '../../mock/mockProducts.js'
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store,
      statusBarHeight: 20,
      video: {},
      isPlaying: false,
      progress: 0,
      currentTime: '00:00',
      comments: [],
      commentText: '',
      showReward: false,
      playTimer: null
    }
  },
  computed: {
    bindedProducts() {
      return mockProducts.filter(p => this.video.productIds?.includes(p.id))
    },
    recommendVideos() {
      return mockVideos.filter(v => v.id !== this.video.id && v.category === this.video.category).slice(0, 4)
    }
  },
  onLoad(options) {
    const sysInfo = uni.getSystemInfoSync()
    this.statusBarHeight = sysInfo.statusBarHeight || 20
    const video = mockVideos.find(v => v.id === options.id)
    if (video) {
      this.video = video
      this.comments = [...video.comments]
    }
  },
  onUnload() {
    if (this.playTimer) clearInterval(this.playTimer)
  },
  methods: {
    formatViews(views) {
      if (views >= 10000) return (views / 10000).toFixed(1) + '万'
      return views.toString()
    },
    getAvatarColor(name) {
      const colors = ['#DBEAFE', '#D1FAE5', '#FEF3C7', '#FCE7F3', '#E0E7FF']
      return colors[name.charCodeAt(0) % colors.length]
    },
    togglePlay() {
      this.isPlaying = !this.isPlaying
    },
    onVideoPlay() {
      this.isPlaying = true
    },
    onVideoPause() {
      this.isPlaying = false
    },
    onVideoEnded() {
      this.isPlaying = false
      this.progress = 100
      this.onPlayEnd()
    },
    onTimeUpdate(e) {
      const { currentTime, duration } = e.detail
      if (duration > 0) {
        this.progress = Math.min(100, (currentTime / duration) * 100)
        this.currentTime = this.formatTime(currentTime)
      }
    },
    parseDuration(dur) {
      const [m, s] = dur.split(':')
      return parseInt(m) * 60 + parseInt(s)
    },
    formatTime(sec) {
      const m = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    onPlayEnd() {
      if (!this.video.watched) {
        this.showReward = true
        this.video.watched = true
      }
    },
    closeReward() {
      this.showReward = false
    },
    addToCart(product) {
      store.addToCart(product, 1)
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    },
    addAllToCart() {
      this.bindedProducts.forEach(p => store.addToCart(p, 1))
      uni.showToast({ title: '已全部加入购物车', icon: 'success' })
    },
    submitComment() {
      if (!this.commentText.trim()) {
        uni.showToast({ title: '请输入评论内容', icon: 'none' })
        return
      }
      this.comments.unshift({
        id: 'C' + Date.now(),
        user: '我',
        content: this.commentText,
        time: '刚刚'
      })
      this.commentText = ''
      uni.showToast({ title: '评论成功', icon: 'success' })
    },
    shareVideo() {
      uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        title: this.video.title,
        summary: this.video.description,
        success: () => uni.showToast({ title: '分享成功', icon: 'success' }),
        fail: () => uni.showToast({ title: '分享功能需要在微信环境使用', icon: 'none' })
      })
    },
    goVideo(v) {
      uni.redirectTo({ url: `/pages/video/play?id=${v.id}` })
    },
    goBack() {
      uni.switchTab({ url: '/pages/video/index' })
    }
  },
  onShareAppMessage() {
    return {
      title: this.video.title,
      path: `/pages/video/play?id=${this.video.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.video-player {
  position: relative;
  height: 520rpx;
  background: #1f2937;

  .player-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .player-back {
    position: absolute;
    top: var(--status-bar-height);
    left: 16rpx;
    height: 88rpx;
    display: flex;
    align-items: center;

    .back-icon {
      font-size: 48rpx;
      color: #fff;
    }
  }

  .player-area {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .play-button {
      width: 100rpx;
      height: 100rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .play-icon {
        font-size: 48rpx;
        color: #fff;
      }
    }

    .video-title-overlay {
      position: absolute;
      bottom: 80rpx;
      left: 24rpx;
      right: 24rpx;
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }

    .progress-bar {
      position: absolute;
      bottom: 40rpx;
      left: 24rpx;
      right: 24rpx;
      height: 4rpx;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2rpx;

      .progress-fill {
        height: 100%;
        background: #2563EB;
        border-radius: 2rpx;
        transition: width 0.2s;
      }
    }

    .progress-info {
      position: absolute;
      bottom: 16rpx;
      left: 24rpx;
      right: 24rpx;
      display: flex;
      justify-content: space-between;

      .time-text {
        font-size: 20rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .player-share {
    position: absolute;
    top: var(--status-bar-height);
    right: 24rpx;
    height: 88rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .share-icon {
      font-size: 32rpx;
      color: #fff;
    }

    .share-label {
      font-size: 20rpx;
      color: #fff;
    }
  }
}

.content-scroll {
  height: calc(100vh - 520rpx - 100rpx);
}

.video-info-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .video-title {
    font-size: 32rpx;
    color: #1f2937;
    font-weight: 600;
    line-height: 1.5;
  }

  .video-meta {
    display: flex;
    align-items: center;
    margin-top: 16rpx;
    flex-wrap: wrap;

    .meta-item {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-right: 20rpx;
    }

    .reward-tag {
      background: #FEF3C7;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;

      .reward-text {
        font-size: 20rpx;
        color: #F59E0B;
        font-weight: 600;
      }
    }
  }
}

.section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2937;
    }

    .section-action {
      font-size: 24rpx;
      color: #2563EB;
    }
  }
}

.product-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .p-img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .p-img-text {
      font-size: 36rpx;
      font-weight: 700;
    }
  }

  .p-info {
    flex: 1;
    margin-left: 16rpx;

    .p-name {
      font-size: 28rpx;
      color: #1f2937;
      font-weight: 500;
    }

    .p-spec {
      font-size: 22rpx;
      color: #9CA3AF;
      margin-top: 4rpx;
    }

    .p-price {
      font-size: 30rpx;
      color: #EF4444;
      font-weight: 700;
      margin-top: 6rpx;
    }
  }

  .p-cart-btn {
    background: #2563EB;
    padding: 10rpx 20rpx;
    border-radius: 24rpx;

    .cart-btn-text {
      font-size: 22rpx;
      color: #fff;
    }
  }
}

.comment-item {
  display: flex;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .comment-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-text {
      font-size: 28rpx;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .comment-body {
    flex: 1;
    margin-left: 16rpx;

    .comment-user {
      font-size: 26rpx;
      color: #6B7280;
      font-weight: 500;
    }

    .comment-content {
      font-size: 28rpx;
      color: #1f2937;
      margin-top: 6rpx;
    }

    .comment-time {
      font-size: 20rpx;
      color: #9CA3AF;
      margin-top: 6rpx;
    }
  }
}

.empty-comments {
  padding: 40rpx 0;
  text-align: center;

  .empty-text {
    font-size: 26rpx;
    color: #9CA3AF;
  }
}

.recommend-list {
  .recommend-item {
    display: flex;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .r-cover {
      position: relative;
      width: 200rpx;
      height: 130rpx;
      border-radius: 10rpx;

      .r-duration {
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

    .r-info {
      flex: 1;
      margin-left: 16rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .r-title {
        font-size: 26rpx;
        color: #1f2937;
        line-height: 1.4;
      }

      .r-views {
        font-size: 20rpx;
        color: #9CA3AF;
      }
    }
  }
}

.comment-bar {
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

  .comment-input {
    flex: 1;
    height: 64rpx;
    background: #f3f4f6;
    border-radius: 32rpx;
    padding: 0 24rpx;
    font-size: 26rpx;
  }

  .comment-send {
    margin-left: 16rpx;
    background: #2563EB;
    padding: 0 28rpx;
    height: 64rpx;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .send-text {
      font-size: 26rpx;
      color: #fff;
    }
  }
}

.reward-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .reward-popup {
    width: 560rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 48rpx 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .reward-emoji {
      font-size: 80rpx;
    }

    .reward-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #1f2937;
      margin-top: 16rpx;
    }

    .reward-points {
      font-size: 56rpx;
      font-weight: 700;
      color: #F59E0B;
      margin-top: 16rpx;
    }

    .reward-desc {
      font-size: 24rpx;
      color: #9CA3AF;
      margin-top: 12rpx;
    }

    .reward-btn {
      margin-top: 32rpx;
      background: #2563EB;
      padding: 0 80rpx;
      height: 76rpx;
      border-radius: 38rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .reward-btn-text {
        font-size: 30rpx;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
</style>
