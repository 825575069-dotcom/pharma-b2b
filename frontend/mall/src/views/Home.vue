<template>
  <div class="home-page">
    <!-- 品牌轮播区 -->
    <section class="banner-section">
      <div class="container">
        <el-carousel height="340px" :interval="5000" arrow="hover" class="banner-carousel">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <div class="banner-item" :style="{ background: banner.bg }">
              <img v-if="banner.image" :src="banner.image" class="banner-bg-img" />
              <div class="banner-content">
                <div class="banner-tag" :style="{ color: banner.textColor }">{{ banner.tag }}</div>
                <h2 class="banner-title" :style="{ color: banner.textColor }">{{ banner.title }}</h2>
                <p class="banner-desc" :style="{ color: banner.textColor, opacity: 0.8 }">{{ banner.desc }}</p>
                <el-button :style="{ background: banner.textColor, borderColor: banner.textColor }" size="large" round @click="onBannerClick(banner)">
                  {{ banner.buttonText }}
                </el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- 活动专区 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">活动专区</h2>
          <span class="section-subtitle">精选优惠，限时抢购</span>
        </div>
        <div class="activity-grid">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-card"
            :style="{ borderTopColor: activity.typeColor }"
            @click="onActivityClick(activity)"
          >
            <div class="activity-tag" :style="{ background: activity.bannerColor, color: activity.typeColor }">
              {{ activity.type }}
            </div>
            <div class="activity-body">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <p class="activity-desc">{{ activity.description }}</p>
              <div class="activity-footer">
                <span class="activity-time">{{ activity.startTime }} ~ {{ activity.endTime }}</span>
                <el-icon :color="activity.typeColor"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快捷采购区 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">快捷采购</h2>
          <span class="section-subtitle">常用药品一键采购</span>
        </div>
        <div class="quick-grid">
          <div
            v-for="product in quickProducts"
            :key="product.id"
            class="quick-card"
            @click="globalStore.openProductDrawer(product.id)"
          >
            <div class="quick-img">
              <img :src="product.image" alt="" />
            </div>
            <div class="quick-info">
              <div class="quick-name text-ellipsis">{{ product.name }}</div>
              <div class="quick-spec text-ellipsis">{{ product.spec }}</div>
              <div class="quick-price-row">
                <span v-if="userStore.isLoggedIn" class="quick-price">¥{{ product.price.toFixed(2) }}</span>
                <span v-else class="quick-price price-mask" @click="userStore.goLogin()">登录后查看</span>
                <span v-if="userStore.isLoggedIn && product.originPrice > product.price" class="quick-origin">¥{{ product.originPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 短视频专区 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">短视频专区</h2>
          <span class="section-subtitle">用药科普 · 观看赢积分</span>
        </div>
        <div class="video-scroll">
          <div
            v-for="video in videos"
            :key="video.id"
            class="video-card"
            @click="globalStore.openVideoDialog(video.id)"
          >
            <div class="video-cover">
              <img :src="video.cover" alt="" class="video-cover-img" />
              <el-icon :size="40" color="#FFFFFF" class="play-icon"><VideoPlay /></el-icon>
              <span class="video-duration">{{ video.duration }}</span>
              <div class="video-reward">
                <el-icon :size="12"><GoldMedal /></el-icon>
                +{{ video.reward }}积分
              </div>
            </div>
            <div class="video-info">
              <div class="video-title text-ellipsis-2">{{ video.title }}</div>
              <div class="video-meta">
                <span class="video-category">{{ video.category }}</span>
                <span class="video-views">
                  <el-icon :size="12"><View /></el-icon>
                  {{ formatViews(video.views) }}
                </span>
              </div>
              <div class="video-products">
                <el-icon :size="12" color="#9CA3AF"><Link /></el-icon>
                <span>{{ video.productIds.length }}个药品</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 积分商城入口 -->
    <section class="section points-section">
      <div class="container">
        <div class="points-entry">
          <div class="points-left">
            <div class="points-header">
              <h2 class="section-title">积分商城</h2>
              <el-tag type="warning" size="small" effect="plain">积分秒兑好礼</el-tag>
            </div>
            <div class="points-balance">
              <span class="points-label">可用积分</span>
              <span class="points-number">{{ userStore.availablePoints }}</span>
            </div>
            <div class="points-expire">
              <el-icon :size="14" color="#F59E0B"><AlarmClock /></el-icon>
              <span>{{ userStore.userInfo.pointsExpiring }}积分将于{{ userStore.userInfo.pointsExpiringDate }}过期</span>
            </div>
            <el-button type="primary" round @click="globalStore.openPointsMall()">
              进入积分商城
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
          <div class="points-right">
            <div class="points-product-grid">
              <div
                v-for="ptp in hotPointsProducts"
                :key="ptp.id"
                class="points-product-card"
                @click="globalStore.openPointsMall()"
              >
                <div class="pp-img">
                  <el-image :src="ptp.image" fit="cover" style="width: 100%; height: 100%;">
                    <template #error><div class="pp-img-fallback" :style="{ background: ptp.colorBg }"><el-icon :size="28" :color="ptp.colorText"><Goods /></el-icon></div></template>
                  </el-image>
                  <el-tag v-if="ptp.hot" type="danger" size="small" class="pp-hot">HOT</el-tag>
                </div>
                <div class="pp-name text-ellipsis">{{ ptp.name }}</div>
                <div class="pp-points">
                  <span class="pp-points-num">{{ ptp.points }}</span>
                  <span class="pp-points-label">积分</span>
                  <span v-if="userStore.isLoggedIn && ptp.cash > 0" class="pp-cash">+¥{{ ptp.cash.toFixed(2) }}</span>
                  <span v-else-if="!userStore.isLoggedIn" class="pp-cash price-mask" @click="userStore.goLogin()">登录后查看</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Box, VideoPlay, View, Link, GoldMedal, AlarmClock, Goods, Discount, Sell, Present, Money, FirstAidKit, Bell } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'
import { mockProducts } from '@/mock/mockProducts'
import { mockVideos } from '@/mock/mockVideos'
import { mockActivities } from '@/mock/mockActivities'
import { mockPoints } from '@/mock/mockPoints'

const router = useRouter()
const globalStore = useGlobalStore()
const userStore = useUserStore()

const banners = [
  {
    id: 1,
    tag: '夏季促销',
    title: '清热解毒类药品满200减30',
    desc: '板蓝根、连花清瘟、蓝芩口服液等全系参与',
    buttonText: '立即采购',
    bg: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
    textColor: '#2563EB',
    image: '/static/images/banners/banner1.png',
    icon: 'Discount'
  },
  {
    id: 2,
    tag: '新品上线',
    title: '短视频专区上线，看视频赚积分',
    desc: '专业药师用药科普，看视频可获得5-20积分奖励',
    buttonText: '去看看',
    bg: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
    textColor: '#10B981',
    image: '/static/images/banners/banner2.png',
    icon: 'VideoPlay'
  },
  {
    id: 3,
    tag: '积分兑换',
    title: '积分商城好礼不断',
    desc: '体温计、血压计、筋膜枪等实用好物等你来兑',
    buttonText: '兑换好礼',
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
    textColor: '#F59E0B',
    image: '/static/images/banners/banner3.png',
    icon: 'Gift'
  }
]

const activities = mockActivities.slice(0, 6)
const quickProducts = mockProducts.slice(0, 10)
const videos = mockVideos.slice(0, 8)
const hotPointsProducts = mockPoints.mallProducts.filter(p => p.hot).slice(0, 4)

const formatViews = (views) => {
  if (views >= 10000) return (views / 10000).toFixed(1) + '万'
  return views.toString()
}

const onBannerClick = (banner) => {
  if (banner.id === 2) {
    const videoSection = document.querySelector('.video-scroll')
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' })
  } else if (banner.id === 3) {
    globalStore.openPointsMall()
  } else {
    router.push('/category')
  }
}

const onActivityClick = (activity) => {
  router.push({ path: '/category', query: { activityId: activity.id } })
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 40px;
}

.banner-section {
  padding: 20px 0;

  .banner-carousel {
    border-radius: 12px;
    overflow: hidden;
  }
}

.banner-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  .banner-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .banner-content {
    z-index: 1;
  }

  .banner-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.5);
    margin-bottom: 12px;
  }

  .banner-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .banner-desc {
    font-size: 14px;
    margin-bottom: 20px;
  }
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
  }

  .section-subtitle {
    font-size: 13px;
    color: #9CA3AF;
  }
}

// 活动专区
.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.activity-card {
  background: #FFFFFF;
  border-radius: 8px;
  border-top: 3px solid;
  padding: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .activity-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .activity-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 6px;
  }

  .activity-desc {
    font-size: 13px;
    color: #6B7280;
    margin-bottom: 12px;
  }

  .activity-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .activity-time {
      font-size: 12px;
      color: #9CA3AF;
    }
  }
}

// 快捷采购
.quick-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.quick-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .quick-img {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .quick-info {
    padding: 12px;
  }

  .quick-name {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 4px;
  }

  .quick-spec {
    font-size: 12px;
    color: #9CA3AF;
    margin-bottom: 8px;
  }

  .quick-price-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .quick-price {
    font-size: 16px;
    font-weight: 600;
    color: #EF4444;
  }

  .quick-origin {
    font-size: 12px;
    color: #D1D5DB;
    text-decoration: line-through;
  }
}

// 短视频
.video-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }
}

.video-card {
  flex-shrink: 0;
  width: 240px;
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .video-cover {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    .video-cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
    }

    .play-icon {
      transition: transform 0.2s;
    }

    &:hover .play-icon {
      transform: scale(1.15);
    }

    .video-duration {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: #FFFFFF;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .video-reward {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(245, 158, 11, 0.9);
      color: #FFFFFF;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .video-info {
    padding: 10px 12px;
  }

  .video-title {
    font-size: 13px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 8px;
    line-height: 1.4;
    height: 36px;
  }

  .video-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;

    .video-category {
      font-size: 12px;
      color: #2563EB;
      background: #DBEAFE;
      padding: 1px 6px;
      border-radius: 3px;
    }

    .video-views {
      font-size: 12px;
      color: #9CA3AF;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }

  .video-products {
    font-size: 12px;
    color: #9CA3AF;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

// 积分商城入口
.points-section {
  margin-bottom: 0;
}

.points-entry {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 32px;
}

.points-left {
  flex-shrink: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .points-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .points-balance {
    display: flex;
    align-items: baseline;
    gap: 8px;

    .points-label {
      font-size: 14px;
      color: #6B7280;
    }

    .points-number {
      font-size: 32px;
      font-weight: 700;
      color: #F59E0B;
    }
  }

  .points-expire {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #F59E0B;
    margin-bottom: 8px;
  }
}

.points-right {
  flex: 1;
}

.points-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.points-product-card {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .pp-img {
    height: 80px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    position: relative;
  }

  .pp-hot {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  .pp-name {
    font-size: 13px;
    color: #1F2937;
    margin-bottom: 4px;
  }

  .pp-points {
    display: flex;
    align-items: baseline;
    gap: 2px;

    .pp-points-num {
      font-size: 15px;
      font-weight: 600;
      color: #F59E0B;
    }

    .pp-points-label {
      font-size: 11px;
      color: #9CA3AF;
    }

    .pp-cash {
      font-size: 11px;
      color: #6B7280;
      margin-left: 4px;
    }
  }
}
</style>
