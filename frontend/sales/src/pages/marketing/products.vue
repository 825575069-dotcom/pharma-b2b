<template>
  <view class="page">
    <!-- 搜索框 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon"><wx-icon name="search-white" size="32" /></text>
        <input v-model="keyword" placeholder="搜索商品名称" class="input" />
      </view>
    </view>

    <!-- 分类筛选 -->
    <scroll-view scroll-x class="category-bar">
      <view
        v-for="cat in categories"
        :key="cat"
        class="cat-item"
        :class="{ active: activeCategory === cat }"
        @tap="activeCategory = cat"
      >
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 商品列表 -->
    <view class="product-list">
      <view v-for="p in filteredProducts" :key="p.id" class="product-card">
        <image class="product-img" :src="p.image" mode="aspectFill" />
        <view class="product-info">
          <view class="product-name">{{ p.name }}</view>
          <view class="text-sm text-gray mt-10">{{ p.manufacturer }} · {{ p.spec }}</view>
          <view class="flex-between mt-20">
            <text class="product-price">¥{{ p.price.toFixed(2) }}</text>
            <view class="share-btn" @tap="shareProduct(p)">分享</view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="filteredProducts.length === 0" class="empty">
      <text class="text-gray">暂无匹配商品</text>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { products, productCategories } from '@/mock/mockProducts.js'

const keyword = ref('')
const activeCategory = ref('全部')
const categories = productCategories

const filteredProducts = computed(() => {
  let list = products
  if (activeCategory.value !== '全部') {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(kw) || p.manufacturer.toLowerCase().includes(kw))
  }
  return list
})

function shareProduct(p) {
  uni.setClipboardData({
    data: `【${p.name}】 厂家：${p.manufacturer} 规格：${p.spec} 价格：¥${p.price.toFixed(2)}`,
    success: () => {
      uni.showToast({ title: '商品信息已复制，可粘贴发送给客户', icon: 'none', duration: 2500 })
    }
  })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.search-bar { padding: 20rpx 24rpx; background: #fff; }
.search-input {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 48rpx;
  padding: 16rpx 28rpx;
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.input { flex: 1; font-size: 28rpx; }

.category-bar {
  white-space: nowrap;
  padding: 16rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #E5E7EB;
}
.cat-item {
  display: inline-block;
  padding: 12rpx 28rpx;
  margin-right: 16rpx;
  border-radius: 48rpx;
  font-size: 26rpx;
  color: #4B5563;
  background: #F3F4F6;
}
.cat-item.active { background: #2563EB; color: #fff; }

.product-list { padding: 20rpx 24rpx; }
.product-card {
  display: flex;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}
.product-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}
.product-info { flex: 1; margin-left: 24rpx; display: flex; flex-direction: column; justify-content: space-between; }
.product-name { font-size: 28rpx; font-weight: 600; line-height: 1.4; }
.product-price { font-size: 34rpx; font-weight: 700; color: #EF4444; }
.share-btn {
  background: #2563EB;
  color: #fff;
  font-size: 24rpx;
  padding: 12rpx 32rpx;
  border-radius: 48rpx;
}

.empty { text-align: center; padding: 80rpx 0; }
</style>
