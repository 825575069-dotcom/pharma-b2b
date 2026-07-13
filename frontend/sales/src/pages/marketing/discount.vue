<template>
  <view class="page">
    <!-- 选择客户 -->
    <view class="section">
      <view class="card">
        <view class="card-title">选择客户</view>
        <picker :range="customerNames" @change="onCustomerChange" :value="customerIndex">
          <view class="picker-value">
            <text v-if="selectedCustomer">{{ selectedCustomer.name }}</text>
            <text v-else class="text-gray">请选择客户</text>
            <text class="arrow-down">▾</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 选择商品 -->
    <view class="section">
      <view class="card">
        <view class="card-title">选择商品</view>
        <view class="search-input mb-20">
          <text class="search-icon"><wx-icon name="search-white" size="32" /></text>
          <input v-model="productKeyword" placeholder="搜索商品" class="input" />
        </view>
        <view class="product-list">
          <view v-for="p in filteredProducts" :key="p.id" class="product-item" @tap="toggleProduct(p)">
            <view class="product-check" :class="{ checked: selectedProductIds.includes(p.id) }">
              <text v-if="selectedProductIds.includes(p.id)"><wx-icon name="check" size="24" /></text>
            </view>
            <view class="flex-1">
              <view class="product-name">{{ p.name }}</view>
              <view class="text-sm text-gray">{{ p.manufacturer }} · ¥{{ p.price.toFixed(2) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠信息 -->
    <view class="section" v-if="selectedProduct">
      <view class="card">
        <view class="card-title">优惠信息</view>
        <view class="info-row">
          <text class="info-label">商品原价</text>
          <text class="info-value">¥{{ selectedProduct.price.toFixed(2) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">优惠折扣</text>
          <view class="discount-input">
            <input v-model="discountRate" type="digit" placeholder="如8.5" />
            <text class="text-sm text-gray ml-10">折</text>
          </view>
        </view>
        <view class="info-row">
          <text class="info-label">优惠后价格</text>
          <text class="info-value text-primary text-bold">¥{{ discountPrice }}</text>
        </view>
      </view>
    </view>

    <!-- 申请理由 -->
    <view class="section">
      <view class="card">
        <view class="card-title">申请理由</view>
        <textarea
          v-model="reason"
          placeholder="请填写优惠申请理由，如客户类型、采购量、竞品价格等"
          class="reason-input"
          maxlength="200"
        />
        <view class="text-sm text-gray" style="text-align:right">{{ reason.length }}/200</view>
      </view>
    </view>

    <view style="height:140rpx"></view>

    <!-- 提交按钮 -->
    <view class="bottom-bar safe-bottom">
      <view class="submit-btn" @tap="submit">提交申请</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { customers } from '@/mock/mockCustomers.js'
import { products } from '@/mock/mockProducts.js'

const customerNames = customers.map(c => c.name)
const customerIndex = ref(0)
const selectedCustomer = ref(null)
const productKeyword = ref('')
const selectedProductIds = ref([])
const discountRate = ref('')
const reason = ref('')

const filteredProducts = computed(() => {
  if (!productKeyword.value) return products
  const kw = productKeyword.value.toLowerCase()
  return products.filter(p => p.name.toLowerCase().includes(kw))
})

const selectedProduct = computed(() => {
  return products.find(p => p.id === selectedProductIds.value[0])
})

const discountPrice = computed(() => {
  if (!selectedProduct.value || !discountRate.value) return '0.00'
  const rate = parseFloat(discountRate.value) / 10
  return (selectedProduct.value.price * rate).toFixed(2)
})

function onCustomerChange(e) {
  customerIndex.value = e.detail.value
  selectedCustomer.value = customers[e.detail.value]
}

function toggleProduct(p) {
  const idx = selectedProductIds.value.indexOf(p.id)
  if (idx > -1) {
    selectedProductIds.value.splice(idx, 1)
  } else {
    selectedProductIds.value = [p.id] // 单选模式
  }
}

function submit() {
  if (!selectedCustomer.value) {
    uni.showToast({ title: '请选择客户', icon: 'none' })
    return
  }
  if (selectedProductIds.value.length === 0) {
    uni.showToast({ title: '请选择商品', icon: 'none' })
    return
  }
  if (!discountRate.value) {
    uni.showToast({ title: '请输入优惠折扣', icon: 'none' })
    return
  }
  if (!reason.value.trim()) {
    uni.showToast({ title: '请填写申请理由', icon: 'none' })
    return
  }
  uni.showToast({ title: '优惠申请已提交，等待审核', icon: 'none', duration: 2000 })
  setTimeout(() => uni.navigateBack(), 2000)
}
</script>

<style scoped>
.page { min-height: 100vh; padding-bottom: 140rpx; }

.section { padding: 0 24rpx; margin-top: 20rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; }
.card-title { font-size: 30rpx; font-weight: 600; margin-bottom: 24rpx; }

.picker-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #F9FAFB;
  border-radius: 16rpx;
  font-size: 28rpx;
}
.arrow-down { color: #9CA3AF; }

.search-input {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 48rpx;
  padding: 16rpx 28rpx;
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.input { flex: 1; font-size: 28rpx; }

.product-list { max-height: 600rpx; overflow-y: auto; }
.product-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #F3F4F6;
}
.product-item:last-child { border-bottom: none; }
.product-check {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #D1D5DB;
  border-radius: 50%;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
  flex-shrink: 0;
}
.product-check.checked {
  background: #2563EB;
  border-color: #2563EB;
}
.product-name { font-size: 28rpx; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 28rpx; color: #9CA3AF; }
.info-value { font-size: 28rpx; }
.discount-input {
  display: flex;
  align-items: center;
  background: #F9FAFB;
  border-radius: 12rpx;
  padding: 12rpx 20rpx;
}
.discount-input input {
  width: 120rpx;
  text-align: right;
  font-size: 28rpx;
}

.reason-input {
  width: 100%;
  min-height: 160rpx;
  padding: 20rpx;
  background: #F9FAFB;
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #E5E7EB;
}
.submit-btn {
  background: #2563EB;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 48rpx;
}
</style>
