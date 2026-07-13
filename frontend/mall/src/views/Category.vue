<template>
  <div class="category-page">
    <div class="container">
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-left">
          <div class="filter-group">
            <span class="filter-label">分类：</span>
            <div class="filter-tags">
              <span
                v-for="cat in categories"
                :key="cat"
                class="filter-tag"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >{{ cat }}</span>
            </div>
          </div>
          <div class="filter-group">
            <span class="filter-label">排序：</span>
            <div class="filter-tags">
              <span
                v-for="sort in sortOptions"
                :key="sort.value"
                class="filter-tag"
                :class="{ active: selectedSort === sort.value }"
                @click="selectedSort = sort.value"
              >{{ sort.label }}</span>
            </div>
          </div>
        </div>
        <div class="filter-right">
          <span class="result-count">共 {{ filteredProducts.length }} 个商品</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-if="filteredProducts.length > 0" class="product-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="globalStore.openProductDrawer(product.id)"
        >
          <div class="product-img">
            <img :src="product.image" alt="" />
            <div v-if="product.originPrice > product.price" class="product-discount-tag">优惠</div>
          </div>
          <div class="product-body">
            <div class="product-name text-ellipsis-2">{{ product.name }}</div>
            <div class="product-spec">{{ product.spec }}</div>
            <div class="product-manufacturer text-ellipsis">{{ product.manufacturer }}</div>
            <div class="product-tags">
              <el-tag v-for="tag in product.tags" :key="tag" size="small" effect="plain" round>{{ tag }}</el-tag>
            </div>
            <div class="product-footer">
              <div class="product-price-row">
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
                <span v-if="product.originPrice > product.price" class="product-origin">¥{{ product.originPrice.toFixed(2) }}</span>
              </div>
              <div class="product-sales">已售{{ product.sales }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-icon class="empty-icon"><Box /></el-icon>
        <div class="empty-text">没有找到相关商品，换个关键词试试吧</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Box } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { mockProducts } from '@/mock/mockProducts'
import { mockActivities } from '@/mock/mockActivities'

const route = useRoute()
const globalStore = useGlobalStore()

const categories = ['全部', '抗生素类', '解热镇痛', '心脑血管', '清热解毒', '维生素类', '消化系统', '感冒用药', '滋补类', '呼吸系统', '肝胆用药', '抗过敏']
const sortOptions = [
  { label: '综合', value: 'default' },
  { label: '价格从低到高', value: 'priceAsc' },
  { label: '价格从高到低', value: 'priceDesc' },
  { label: '销量优先', value: 'sales' }
]

const selectedCategory = ref('全部')
const selectedSort = ref('default')

const keyword = computed(() => route.query.keyword || globalStore.searchKeyword || '')
const activityId = computed(() => route.query.activityId || '')

const filteredProducts = computed(() => {
  let result = [...mockProducts]

  // 活动筛选
  if (activityId.value) {
    const activity = mockActivities.find(a => a.id === activityId.value)
    if (activity) {
      result = result.filter(p => activity.productIds.includes(p.id))
    }
  }

  // 关键词筛选
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.manufacturer.toLowerCase().includes(kw) ||
      p.approvalNumber.toLowerCase().includes(kw)
    )
  }

  // 分类筛选
  if (selectedCategory.value !== '全部') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // 排序
  switch (selectedSort.value) {
    case 'priceAsc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'sales':
      result.sort((a, b) => b.sales - a.sales)
      break
  }

  return result
})
</script>

<style lang="scss" scoped>
.category-page {
  padding: 20px 0 40px;
}

.filter-bar {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  .filter-left {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .filter-label {
    font-size: 13px;
    color: #6B7280;
    flex-shrink: 0;
    line-height: 28px;
  }

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-tag {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 13px;
    color: #4B5563;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #2563EB;
      background: #DBEAFE;
    }

    &.active {
      color: #FFFFFF;
      background: #2563EB;
    }
  }

  .filter-right {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #F3F4F6;

    .result-count {
      font-size: 13px;
      color: #9CA3AF;
    }
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.product-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .product-img {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-discount-tag {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #EF4444;
      color: #FFFFFF;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 3px;
    }
  }

  .product-body {
    padding: 14px;
  }

  .product-name {
    font-size: 15px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 6px;
    line-height: 1.4;
    height: 42px;
  }

  .product-spec {
    font-size: 12px;
    color: #9CA3AF;
    margin-bottom: 4px;
  }

  .product-manufacturer {
    font-size: 12px;
    color: #6B7280;
    margin-bottom: 8px;
  }

  .product-tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 8px;
    min-height: 22px;
  }

  .product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .product-price-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .product-price {
      font-size: 18px;
      font-weight: 600;
      color: #EF4444;
    }

    .product-origin {
      font-size: 12px;
      color: #D1D5DB;
      text-decoration: line-through;
    }

    .product-sales {
      font-size: 12px;
      color: #9CA3AF;
    }
  }
}
</style>
