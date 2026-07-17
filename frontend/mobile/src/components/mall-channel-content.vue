<template>
  <view class="mall-channel-content" v-if="channel && channel.modules">
    <!-- 动态渲染模块 -->
    <view v-for="(module, idx) in channel.modules" :key="idx" class="module-wrap">
      <!-- 轮播图模块 -->
      <view v-if="module.type === 'banner'" class="banner-module" :style="{ background: channel.themeGradient || channel.themeColor }">
        <swiper class="banner-swiper" circular autoplay :interval="4000" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#ffffff">
          <swiper-item v-for="(item, bIdx) in module.list" :key="bIdx">
            <view class="banner-item" :style="{ background: item.bg }">
              <image class="banner-image" :src="item.image" mode="aspectFill" />
              <view class="banner-text-wrap">
                <text class="banner-title" :style="{ color: item.text }">{{ item.title }}</text>
                <text class="banner-desc" :style="{ color: item.text }">{{ item.desc }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- 公告模块 -->
      <view v-else-if="module.type === 'notice'" class="notice-module">
        <view class="notice-icon" :style="{ background: channel.themeColor }">
          <text class="notice-icon-text">!</text>
        </view>
        <text class="notice-text">{{ module.text }}</text>
      </view>

      <!-- 分类网格模块 -->
      <view v-else-if="module.type === 'category-grid'" class="section-card">
        <text v-if="module.title" class="module-title">{{ module.title }}</text>
        <view class="category-grid">
          <view v-for="(cat, cIdx) in module.categories" :key="cIdx" class="category-item" @tap="goCategory(cat)">
            <view class="category-icon" :style="{ background: cat.bg }">
              <text v-if="cat.icon && cat.icon.length <= 2" class="category-emoji">{{ cat.icon }}</text>
              <wx-icon v-else :name="cat.icon" size="40" />
            </view>
            <text class="category-text">{{ cat.name }}</text>
          </view>
        </view>
      </view>

      <!-- 商品列表模块 -->
      <view v-else-if="module.type === 'product-list'" class="section-card">
        <view class="module-header">
          <text class="module-title">{{ module.title }}</text>
          <text class="module-more" @tap="goMoreProducts">更多 ></text>
        </view>
        <view v-if="module.layout === 'grid'" class="product-grid">
          <view v-for="product in module.products" :key="product.id" class="product-card" @tap="goProductDetail(product)">
            <view class="product-img-wrap">
              <image class="product-img" :src="product.image" mode="aspectFill" />
            </view>
            <view class="product-info">
              <text class="product-name ellipsis-2">{{ product.name }} {{ product.spec }}</text>
              <text class="product-manufacturer ellipsis">{{ product.manufacturer }}</text>
              <view class="product-tags">
                <text v-for="tag in product.tags.slice(0, 2)" :key="tag" class="product-tag">{{ tag }}</text>
              </view>
              <view class="product-bottom">
                <text v-if="$auth.isLoggedIn" class="product-price">¥{{ product.price.toFixed(2) }}</text>
                <text v-else class="product-price price-mask" @tap="$auth.goLogin()">登录后查看</text>
                <text class="product-sales">已售{{ product.sales }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 活动模块 -->
      <view v-else-if="module.type === 'activity'" class="section-card">
        <view class="module-header">
          <text class="module-title">{{ module.title }}</text>
          <text class="module-more">更多 ></text>
        </view>
        <scroll-view scroll-x class="activity-scroll" show-scrollbar="false">
          <view class="activity-list">
            <view v-for="(act, aIdx) in module.list" :key="aIdx" class="activity-card" :style="{ background: act.bg }">
              <text class="activity-tag" :style="{ background: act.text, color: '#fff' }">{{ act.type }}</text>
              <text class="activity-title" :style="{ color: act.text }">{{ act.title }}</text>
              <text class="activity-desc" :style="{ color: act.text }">{{ act.desc }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="load-more">
      <text class="load-more-text">— 已经到底了 —</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MallChannelContent',
  props: {
    channel: {
      type: Object,
      default: () => null
    }
  },
  methods: {
    goCategory(cat) {
      this.$emit('goCategory', cat)
    },
    goProductDetail(product) {
      this.$emit('goProductDetail', product)
    },
    goMoreProducts() {
      this.$emit('goMoreProducts')
    }
  }
}
</script>

<style lang="scss" scoped>
.mall-channel-content {
  width: 100%;
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

    .product-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8rpx;

      .product-tag {
        font-size: 18rpx;
        color: #2563EB;
        background: #DBEAFE;
        padding: 2rpx 8rpx;
        border-radius: 6rpx;
        margin-right: 8rpx;
        margin-bottom: 4rpx;
      }
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
