<template>
  <el-drawer
    v-model="visible"
    title=""
    direction="rtl"
    size="520px"
    :show-close="false"
    :with-header="false"
    class="product-drawer"
  >
    <div v-if="product" class="drawer-content">
      <!-- 关闭按钮 -->
      <div class="close-btn" @click="visible = false">
        <el-icon :size="20"><Close /></el-icon>
      </div>

      <!-- 图片轮播 -->
      <div class="product-images">
        <el-carousel height="360px" :autoplay="false" indicator-position="outside" arrow="hover">
          <el-carousel-item v-for="(img, idx) in product.images" :key="idx">
            <div class="image-item">
              <img :src="img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 商品信息 -->
      <div class="product-info">
        <div class="product-header">
          <div class="product-tags-row">
            <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="plain" round>{{ tag }}</el-tag>
          </div>
          <h2 class="product-name">{{ product.name }}</h2>
          <div class="product-spec">{{ product.spec }}</div>
        </div>

        <div class="price-section">
          <div class="price-row">
            <span v-if="userStore.isLoggedIn" class="current-price">¥{{ product.price.toFixed(2) }}</span>
            <span v-else class="current-price price-mask" @click="userStore.goLogin()">登录后查看</span>
            <span v-if="userStore.isLoggedIn && product.originPrice > product.price" class="origin-price">¥{{ product.originPrice.toFixed(2) }}</span>
          </div>
          <div class="sales-stock">
            <span>已售{{ product.sales }}</span>
            <span class="divider">|</span>
            <span :class="{ 'stock-low': product.stock < 100 }">库存{{ product.stock }}{{ product.stock < 100 ? '（偏低）' : '' }}</span>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">厂家</span>
            <span class="info-value">{{ product.manufacturer }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">批准文号</span>
            <span class="info-value">{{ product.approvalNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">分类</span>
            <span class="info-value">{{ product.category }}</span>
          </div>
        </div>

        <!-- 关联活动 -->
        <div v-if="relatedActivities.length > 0" class="related-section">
          <div class="section-title-small">关联促销活动</div>
          <div class="activity-tags">
            <div v-for="act in relatedActivities" :key="act.id" class="act-tag" :style="{ background: act.bannerColor, color: act.typeColor }">
              <el-icon :size="12"><Discount /></el-icon>
              {{ act.title }}
            </div>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-section">
          <span class="quantity-label">数量</span>
          <el-input-number v-model="quantity" :min="1" :max="Math.min(product.stock, 999)" size="default" />
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button size="large" @click="handleAddToCart" class="cart-btn">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
          <el-button size="large" type="primary" @click="handleBuyNow" class="buy-btn">
            立即购买
          </el-button>
        </div>

        <!-- 药品详情 -->
        <div class="detail-section">
          <div class="section-title-small">药品详情</div>
          <div class="detail-list">
            <div class="detail-item">
              <div class="detail-label">适应症</div>
              <div class="detail-content">{{ product.indications }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">用法用量</div>
              <div class="detail-content">{{ product.dosage }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">不良反应</div>
              <div class="detail-content">{{ product.adverseReactions }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">药品描述</div>
              <div class="detail-content">{{ product.description }}</div>
            </div>
          </div>
        </div>

        <!-- 关联短视频 -->
        <div v-if="relatedVideos.length > 0" class="video-section">
          <div class="section-title-small">关联短视频推荐</div>
          <div class="related-videos">
            <div
              v-for="v in relatedVideos"
              :key="v.id"
              class="rv-card"
              @click="openVideo(v.id)"
            >
              <div class="rv-cover">
                <img :src="v.cover" alt="" />
              </div>
              <div class="rv-title text-ellipsis-2">{{ v.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Box, Discount, ShoppingCart, VideoPlay } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { mockProducts } from '@/mock/mockProducts'
import { mockActivities } from '@/mock/mockActivities'
import { mockVideos } from '@/mock/mockVideos'

const globalStore = useGlobalStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.productDrawerVisible,
  set: (val) => { if (!val) globalStore.closeProductDrawer() }
})

const quantity = ref(1)

const product = computed(() => {
  if (!globalStore.currentProductId) return null
  return mockProducts.find(p => p.id === globalStore.currentProductId)
})

const relatedActivities = computed(() => {
  if (!product.value) return []
  return mockActivities.filter(a => a.productIds.includes(product.value.id))
})

const relatedVideos = computed(() => {
  if (!product.value) return []
  return mockVideos.filter(v => v.productIds.includes(product.value.id)).slice(0, 4)
})

watch(visible, (val) => {
  if (val) quantity.value = 1
})

const handleAddToCart = () => {
  cartStore.addItem(product.value, quantity.value)
  ElMessage.success(`已添加${quantity.value}个「${product.value.name}」到购物车`)
  cartStore.toggleDrawer(true)
}

const handleBuyNow = () => {
  cartStore.addItem(product.value, quantity.value)
  visible.value = false
  setTimeout(() => {
    globalStore.openCheckout()
  }, 300)
}

const openVideo = (videoId) => {
  visible.value = false
  setTimeout(() => {
    globalStore.openVideoDialog(videoId)
  }, 300)
}
</script>

<style lang="scss" scoped>
.drawer-content {
  position: relative;
  height: 100%;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6B7280;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    color: #2563EB;
  }
}

.product-images {
  .image-item {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.product-info {
  padding: 20px;
}

.product-header {
  margin-bottom: 16px;

  .product-tags-row {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  }

  .product-name {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 6px;
  }

  .product-spec {
    font-size: 14px;
    color: #6B7280;
  }
}

.price-section {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;

    .current-price {
      font-size: 28px;
      font-weight: 700;
      color: #EF4444;
    }

    .origin-price {
      font-size: 14px;
      color: #D1D5DB;
      text-decoration: line-through;
    }
  }

  .sales-stock {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #9CA3AF;

    .divider {
      color: #E5E7EB;
    }

    .stock-low {
      color: #F59E0B;
    }
  }
}

.info-list {
  margin-bottom: 16px;

  .info-item {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #F3F4F6;

    .info-label {
      width: 70px;
      font-size: 13px;
      color: #9CA3AF;
      flex-shrink: 0;
    }

    .info-value {
      font-size: 13px;
      color: #4B5563;
    }
  }
}

.related-section {
  margin-bottom: 16px;
}

.section-title-small {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 10px;
}

.activity-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .act-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  .quantity-label {
    font-size: 14px;
    color: #6B7280;
  }
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  .el-button {
    flex: 1;
    border-radius: 8px;
  }

  .cart-btn {
    background: #DBEAFE;
    border-color: #DBEAFE;
    color: #2563EB;

    &:hover {
      background: #BFDBFE;
      border-color: #BFDBFE;
    }
  }
}

.detail-section {
  margin-bottom: 24px;

  .detail-list {
    background: #F9FAFB;
    border-radius: 8px;
    padding: 16px;
  }

  .detail-item {
    margin-bottom: 14px;

    &:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-size: 13px;
      font-weight: 500;
      color: #2563EB;
      margin-bottom: 4px;
    }

    .detail-content {
      font-size: 13px;
      color: #4B5563;
      line-height: 1.6;
    }
  }
}

.video-section {
  .related-videos {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .rv-card {
    background: #F9FAFB;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .rv-cover {
      height: 80px;
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

    .rv-title {
      padding: 8px;
      font-size: 12px;
      color: #4B5563;
      line-height: 1.4;
      height: 36px;
    }
  }
}
</style>
