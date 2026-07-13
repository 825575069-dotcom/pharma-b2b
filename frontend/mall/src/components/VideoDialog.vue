<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    fullscreen
    class="video-dialog"
    :with-header="false"
    append-to-body
  >
    <div v-if="video" class="video-container">
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="visible = false">
        <el-icon :size="20"><Close /></el-icon>
      </div>

      <div class="video-layout">
        <!-- 左侧：视频播放区 -->
        <div class="video-left">
          <div class="player-area">
            <img :src="video.cover" alt="" class="player-bg-img" />
            <div class="player-content">
              <el-icon :size="64" color="#FFFFFF" class="play-icon-large" @click="togglePlay">
                <VideoPlay v-if="!isPlaying" />
                <VideoPause v-else />
              </el-icon>
              <div class="player-info">
                <div class="player-title">{{ video.title }}</div>
                <div class="player-meta">
                  <span>{{ video.category }}</span>
                  <span class="divider">·</span>
                  <span>{{ video.duration }}</span>
                  <span class="divider">·</span>
                  <span>{{ formatViews(video.views) }}次播放</span>
                </div>
              </div>
            </div>
            <!-- 播放进度条 -->
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="comment-section">
            <div class="comment-header">
              <span class="comment-title">评论 ({{ video.comments.length }})</span>
              <div class="comment-actions">
                <span class="like-action" @click="toggleLike">
                  <el-icon :size="16" :color="isLiked ? '#EF4444' : '#9CA3AF'"><Star /></el-icon>
                  {{ likeCount }}
                </span>
              </div>
            </div>
            <div class="comment-list">
              <div v-for="comment in video.comments" :key="comment.id" class="comment-item">
                <div class="comment-avatar">
                  <img v-if="comment.avatar" :src="comment.avatar" alt="" class="comment-avatar-img" />
                  <el-icon v-else :size="20" color="#6B7280"><User /></el-icon>
                </div>
                <div class="comment-body">
                  <div class="comment-user">{{ comment.user }}</div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-time">{{ comment.time }}</div>
                </div>
              </div>
            </div>
            <div class="comment-input">
              <el-input v-model="commentText" placeholder="发表评论..." size="default">
                <template #append>
                  <el-button @click="sendComment" :disabled="!commentText.trim()">发表</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>

        <!-- 右侧：绑定药品 + 推荐 -->
        <div class="video-right">
          <!-- 绑定药品列表 -->
          <div class="bound-section">
            <div class="right-title">
              <el-icon :size="16"><Box /></el-icon>
              绑定药品 ({{ boundProducts.length }})
            </div>
            <div class="bound-list">
              <div v-for="p in boundProducts" :key="p.id" class="bound-item">
                <div class="bound-img">
                  <img :src="p.image" alt="" />
                </div>
                <div class="bound-info">
                  <div class="bound-name text-ellipsis">{{ p.name }}</div>
                  <div class="bound-spec">{{ p.spec }}</div>
                  <div class="bound-price">¥{{ p.price.toFixed(2) }}</div>
                </div>
                <div class="bound-actions">
                  <el-button size="small" type="primary" plain round @click="addToCart(p)">
                    <el-icon><ShoppingCart /></el-icon>
                    加入购物车
                  </el-button>
                  <el-button size="small" text @click="viewProduct(p)">详情</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 同分类推荐 -->
          <div class="recommend-section">
            <div class="right-title">
              <el-icon :size="16"><VideoCamera /></el-icon>
              相关视频推荐
            </div>
            <div class="recommend-list">
              <div
                v-for="rv in recommendVideos"
                :key="rv.id"
                class="recommend-item"
                @click="switchVideo(rv.id)"
              >
                <div class="rv-cover">
                  <img :src="rv.cover" alt="" />
                </div>
                <div class="rv-info">
                  <div class="rv-title text-ellipsis-2">{{ rv.title }}</div>
                  <div class="rv-meta">
                    <span>{{ formatViews(rv.views) }}次播放</span>
                    <span class="rv-reward">+{{ rv.reward }}积分</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 积分奖励弹窗 -->
      <el-dialog
        v-model="rewardVisible"
        :show-close="false"
        width="320px"
        class="reward-dialog"
        append-to-body
        center
      >
        <div class="reward-content">
          <div class="reward-icon">
            <el-icon :size="48" color="#F59E0B"><GoldMedal /></el-icon>
          </div>
          <div class="reward-title">恭喜获得积分</div>
          <div class="reward-points">+{{ video.reward }}</div>
          <div class="reward-desc">观看视频「{{ video.title }}」获得奖励</div>
          <el-button type="primary" round @click="rewardVisible = false">太棒了</el-button>
        </div>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, VideoPlay, VideoPause, Star, User, Box, ShoppingCart, VideoCamera, GoldMedal } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { mockVideos } from '@/mock/mockVideos'
import { mockProducts } from '@/mock/mockProducts'

const globalStore = useGlobalStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.videoDialogVisible,
  set: (val) => { if (!val) globalStore.closeVideoDialog() }
})

const isPlaying = ref(false)
const progress = ref(0)
const isLiked = ref(false)
const likeCount = ref(0)
const commentText = ref('')
const rewardVisible = ref(false)
let playTimer = null

const video = computed(() => {
  if (!globalStore.currentVideoId) return null
  return mockVideos.find(v => v.id === globalStore.currentVideoId)
})

const boundProducts = computed(() => {
  if (!video.value) return []
  return mockProducts.filter(p => video.value.productIds.includes(p.id))
})

const recommendVideos = computed(() => {
  if (!video.value) return []
  return mockVideos.filter(v => v.id !== video.value.id && v.category === video.value.category).slice(0, 4)
})

watch(visible, (val) => {
  if (val) {
    isPlaying.value = false
    progress.value = 0
    isLiked.value = false
    likeCount.value = video.value ? video.value.likes : 0
    commentText.value = ''
    rewardVisible.value = false
    // 记录浏览历史
    if (video.value) {
      userStore.addVideoHistory(video.value.id)
    }
  } else {
    stopPlay()
  }
})

const togglePlay = () => {
  if (isPlaying.value) {
    stopPlay()
  } else {
    startPlay()
  }
}

const startPlay = () => {
  isPlaying.value = true
  playTimer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      progress.value = 100
      stopPlay()
      onPlayEnd()
    }
  }, 200)
}

const stopPlay = () => {
  isPlaying.value = false
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

const onPlayEnd = () => {
  // 播放完成获得积分
  if (video.value && !video.value.watched) {
    video.value.watched = true
    userStore.addPoints(video.value.reward)
    rewardVisible.value = true
  }
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

const sendComment = () => {
  if (commentText.value.trim()) {
    ElMessage.success('评论发表成功')
    commentText.value = ''
  }
}

const addToCart = (product) => {
  cartStore.addItem(product, 1)
  ElMessage.success(`已添加「${product.name}」到购物车`)
}

const viewProduct = (product) => {
  visible.value = false
  setTimeout(() => {
    globalStore.openProductDrawer(product.id)
  }, 300)
}

const switchVideo = (videoId) => {
  stopPlay()
  globalStore.closeVideoDialog()
  setTimeout(() => {
    globalStore.openVideoDialog(videoId)
  }, 200)
}

const formatViews = (views) => {
  if (views >= 10000) return (views / 10000).toFixed(1) + '万'
  return views.toString()
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
  height: 100vh;
  background: #1F2937;
  overflow: hidden;
}

.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #FFFFFF;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.video-layout {
  display: flex;
  height: 100vh;
}

.video-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.player-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 400px;
  overflow: hidden;

  .player-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .player-content {
    text-align: center;
    z-index: 1;

    .play-icon-large {
      cursor: pointer;
      transition: transform 0.2s;
      margin-bottom: 16px;

      &:hover {
        transform: scale(1.1);
      }
    }

    .player-info {
      .player-title {
        font-size: 18px;
        font-weight: 600;
        color: #FFFFFF;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }

      .player-meta {
        font-size: 13px;
        color: #FFFFFF;
        opacity: 0.9;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

        .divider {
          margin: 0 6px;
          color: #D1D5DB;
        }
      }
    }
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);

    .progress-fill {
      height: 100%;
      background: #2563EB;
      transition: width 0.2s linear;
    }
  }
}

.comment-section {
  background: #FFFFFF;
  height: 300px;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;

  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    .comment-title {
      font-size: 14px;
      font-weight: 600;
      color: #1F2937;
    }

    .like-action {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #6B7280;
      cursor: pointer;
    }
  }

  .comment-list {
    flex: 1;
    overflow-y: auto;
  }

  .comment-item {
    display: flex;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #F3F4F6;

    .comment-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #F3F4F6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;

      .comment-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .comment-body {
      flex: 1;

      .comment-user {
        font-size: 13px;
        font-weight: 500;
        color: #2563EB;
        margin-bottom: 2px;
      }

      .comment-text {
        font-size: 13px;
        color: #4B5563;
        margin-bottom: 2px;
      }

      .comment-time {
        font-size: 12px;
        color: #9CA3AF;
      }
    }
  }

  .comment-input {
    margin-top: 12px;
  }
}

.video-right {
  width: 360px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.right-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  padding: 16px 20px 10px;
}

.bound-section {
  border-bottom: 1px solid #F3F4F6;
}

.bound-list {
  padding: 0 20px 16px;
}

.bound-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #F9FAFB;

  &:last-child {
    border-bottom: none;
  }

  .bound-img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .bound-info {
    flex: 1;
    min-width: 0;

    .bound-name {
      font-size: 13px;
      font-weight: 500;
      color: #1F2937;
      margin-bottom: 2px;
    }

    .bound-spec {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 2px;
    }

    .bound-price {
      font-size: 14px;
      font-weight: 600;
      color: #EF4444;
    }
  }

  .bound-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }
}

.recommend-section {
  flex: 1;
}

.recommend-list {
  padding: 0 20px 16px;
}

.recommend-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: #F9FAFB;
  }

  .rv-cover {
    width: 80px;
    height: 50px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .rv-info {
    flex: 1;
    min-width: 0;

    .rv-title {
      font-size: 13px;
      color: #4B5563;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .rv-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #9CA3AF;

      .rv-reward {
        color: #F59E0B;
      }
    }
  }
}

:deep(.reward-dialog) {
  .el-dialog__body {
    padding: 0;
  }
}

.reward-content {
  text-align: center;
  padding: 32px 24px;

  .reward-icon {
    margin-bottom: 16px;
  }

  .reward-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 8px;
  }

  .reward-points {
    font-size: 42px;
    font-weight: 700;
    color: #F59E0B;
    margin-bottom: 8px;
  }

  .reward-desc {
    font-size: 13px;
    color: #6B7280;
    margin-bottom: 20px;
  }

  .el-button {
    min-width: 120px;
  }
}
</style>
