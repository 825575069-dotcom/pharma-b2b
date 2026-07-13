<template>
  <view class="page">
    <!-- 步骤指示器 -->
    <view class="steps-bar">
      <view v-for="(s, idx) in steps" :key="idx" class="step-item">
        <view class="step-circle" :class="{ active: step >= idx, done: step > idx }">
          <text v-if="step > idx"><wx-icon name="check" size="24" /></text>
          <text v-else>{{ idx + 1 }}</text>
        </view>
        <view class="step-label" :class="{ active: step >= idx }">{{ s }}</view>
        <view v-if="idx < steps.length - 1" class="step-line" :class="{ done: step > idx }"></view>
      </view>
    </view>

    <!-- 步骤1：选择客户 -->
    <view v-if="step === 0" class="step-content">
      <view class="card">
        <view class="card-title">选择客户</view>
        <view class="search-input mb-20">
          <text class="search-icon"><wx-icon name="search-white" size="32" /></text>
          <input v-model="customerKeyword" placeholder="搜索客户" class="input" />
        </view>
        <view class="customer-list">
          <view
            v-for="c in filteredCustomers"
            :key="c.id"
            class="select-item"
            :class="{ selected: selectedCustomer?.id === c.id }"
            @tap="selectCustomer(c)"
          >
            <view class="flex items-center flex-1">
              <view class="customer-avatar">{{ c.name.charAt(0) }}</view>
              <view class="ml-20">
                <view class="text-md text-bold">{{ c.name }}</view>
                <view class="text-sm text-gray">{{ c.contact }} · 剩余额度¥{{ formatMoney(c.creditLimit - c.usedCredit) }}</view>
              </view>
            </view>
            <view v-if="selectedCustomer?.id === c.id" class="check-icon"><wx-icon name="check" size="24" /></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 步骤2：选择商品 -->
    <view v-if="step === 1" class="step-content">
      <view class="card">
        <view class="card-title">添加商品</view>
        <view class="search-input mb-20">
          <text class="search-icon"><wx-icon name="search-white" size="32" /></text>
          <input v-model="productKeyword" placeholder="搜索商品" class="input" />
        </view>
        <scroll-view scroll-x class="cat-bar">
          <view
            v-for="cat in categories"
            :key="cat"
            class="cat-item"
            :class="{ active: activeCat === cat }"
            @tap="activeCat = cat"
          >{{ cat }}</view>
        </scroll-view>
        <view class="product-list">
          <view v-for="p in filteredProducts" :key="p.id" class="product-item">
            <image class="product-img" :src="p.image" mode="aspectFill" />
            <view class="flex-1 ml-20">
              <view class="product-name">{{ p.name }}</view>
              <view class="text-sm text-gray">{{ p.manufacturer }}</view>
              <view class="flex-between mt-10">
                <text class="text-primary text-bold">¥{{ p.price.toFixed(2) }}</text>
                <view class="add-btn" @tap="addToCart(p)">+ 添加</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 已选商品 -->
      <view v-if="cart.length > 0" class="card">
        <view class="card-title">已选商品（{{ cart.length }}）</view>
        <view v-for="(item, idx) in cart" :key="idx" class="cart-item">
          <view class="flex-1">
            <view class="text-sm text-bold">{{ item.name }}</view>
            <view class="text-sm text-gray">¥{{ item.price.toFixed(2) }}</view>
          </view>
          <view class="qty-control">
            <view class="qty-btn" @tap="changeQty(idx, -1)">-</view>
            <text class="qty-num">{{ item.qty }}</text>
            <view class="qty-btn" @tap="changeQty(idx, 1)">+</view>
          </view>
          <view class="remove-btn" @tap="removeItem(idx)">删除</view>
        </view>
      </view>
    </view>

    <!-- 步骤3：确认订单 -->
    <view v-if="step === 2" class="step-content">
      <view class="card">
        <view class="card-title">订单信息</view>
        <view class="info-row">
          <text class="info-label">客户</text>
          <text class="info-value text-bold">{{ selectedCustomer?.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">联系人</text>
          <text class="info-value">{{ selectedCustomer?.contact }} {{ selectedCustomer?.phone }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">收货地址</text>
          <text class="info-value" style="flex:1;text-align:right">{{ selectedCustomer?.address }}</text>
        </view>
      </view>

      <view class="card">
        <view class="card-title">商品明细</view>
        <view v-for="(item, idx) in cart" :key="idx" class="order-item">
          <view class="flex-1">
            <view class="text-sm">{{ item.name }}</view>
            <view class="text-sm text-gray mt-10">¥{{ item.price.toFixed(2) }} × {{ item.qty }}</view>
          </view>
          <text class="text-md text-bold">¥{{ (item.price * item.qty).toFixed(2) }}</text>
        </view>
      </view>

      <view class="card">
        <view class="card-title">费用明细</view>
        <view class="info-row">
          <text class="info-label">商品总额</text>
          <text class="info-value">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">优惠减免</text>
          <text class="info-value text-success">-¥0.00</text>
        </view>
        <view class="info-row">
          <text class="info-label">运费</text>
          <text class="info-value text-success">免运费</text>
        </view>
        <view class="divider"></view>
        <view class="flex-between">
          <text class="text-md text-bold">应付金额</text>
          <text class="text-2xl text-primary text-bold">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <!-- 步骤4：选择支付方式 -->
    <view v-if="step === 3" class="step-content">
      <view class="card">
        <view class="card-title">选择支付方式</view>
        <view
          v-for="pay in paymentMethods"
          :key="pay.value"
          class="pay-item"
          :class="{ selected: selectedPay === pay.value }"
          @tap="selectedPay = pay.value"
        >
          <text class="pay-icon"><wx-icon :name="pay.icon" size="36" /></text>
          <text class="flex-1 text-md">{{ pay.label }}</text>
          <view class="radio" :class="{ checked: selectedPay === pay.value }"></view>
        </view>
      </view>

      <view class="card">
        <view class="info-row">
          <text class="info-label">客户</text>
          <text class="info-value">{{ selectedCustomer?.name }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">商品数</text>
          <text class="info-value">{{ cart.length }} 种</text>
        </view>
        <view class="info-row">
          <text class="info-label">应付金额</text>
          <text class="text-xl text-primary text-bold">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <view style="height:140rpx"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom">
      <view v-if="step > 0" class="btn-back" @tap="step--">上一步</view>
      <view v-if="step < 3" class="btn-next" :class="{ disabled: !canNext }" @tap="nextStep">下一步</view>
      <view v-else class="btn-submit" @tap="submitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { customers } from '@/mock/mockCustomers.js'
import { products, productCategories } from '@/mock/mockProducts.js'

const steps = ['选客户', '选商品', '确认', '支付']
const step = ref(0)

// 客户
const customerKeyword = ref('')
const selectedCustomer = ref(null)

const filteredCustomers = computed(() => {
  if (!customerKeyword.value) return customers
  const kw = customerKeyword.value.toLowerCase()
  return customers.filter(c => c.name.toLowerCase().includes(kw) || c.contact.toLowerCase().includes(kw))
})

function selectCustomer(c) {
  selectedCustomer.value = c
}

// 商品
const productKeyword = ref('')
const activeCat = ref('全部')
const categories = productCategories
const cart = ref([])

const filteredProducts = computed(() => {
  let list = products
  if (activeCat.value !== '全部') {
    list = list.filter(p => p.category === activeCat.value)
  }
  if (productKeyword.value) {
    const kw = productKeyword.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(kw))
  }
  return list
})

function addToCart(p) {
  const existing = cart.value.find(i => i.id === p.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ id: p.id, name: p.name, price: p.price, qty: 1 })
  }
}

function changeQty(idx, delta) {
  cart.value[idx].qty += delta
  if (cart.value[idx].qty <= 0) {
    cart.value.splice(idx, 1)
  }
}

function removeItem(idx) {
  cart.value.splice(idx, 1)
}

// 合计
const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

// 支付
const selectedPay = ref('balance')
const paymentMethods = [
  { value: 'balance', label: '余额支付', icon: 'money' },
  { value: 'bank', label: '银行转账', icon: 'bank' },
  { value: 'credit', label: '账期支付', icon: 'clipboard' },
  { value: 'wechat', label: '微信支付', icon: 'money' }
]

// 步骤控制
const canNext = computed(() => {
  if (step.value === 0) return !!selectedCustomer.value
  if (step.value === 1) return cart.value.length > 0
  return true
})

function nextStep() {
  if (!canNext.value) return
  step.value++
}

function submitOrder() {
  uni.showModal({
    title: '确认提交订单',
    content: `客户：${selectedCustomer.value.name}\n金额：¥${totalAmount.value.toFixed(2)}\n支付方式：${paymentMethods.find(p => p.value === selectedPay.value).label}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '代客下单成功！订单已提交', icon: 'none', duration: 2000 })
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }
    }
  })
}

function formatMoney(num) {
  return (num || 0).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const customerId = currentPage.options?.customerId || currentPage.$page?.options?.customerId
  if (customerId) {
    const found = customers.find(c => c.id === customerId)
    if (found) {
      selectedCustomer.value = found
      step.value = 1 // 跳过选客户步骤
    }
  }
})
</script>

<style scoped>
.page { min-height: 100vh; padding-bottom: 140rpx; }

.steps-bar {
  display: flex;
  align-items: center;
  padding: 30rpx 24rpx;
  background: #fff;
}
.step-item {
  display: flex;
  align-items: center;
  flex: 1;
}
.step-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  background: #F3F4F6;
  color: #9CA3AF;
  flex-shrink: 0;
}
.step-circle.active {
  background: #2563EB;
  color: #fff;
}
.step-circle.done {
  background: #10B981;
  color: #fff;
}
.step-label {
  font-size: 24rpx;
  color: #9CA3AF;
  margin-left: 12rpx;
  white-space: nowrap;
}
.step-label.active { color: #2563EB; font-weight: 600; }
.step-line {
  flex: 1;
  height: 4rpx;
  background: #E5E7EB;
  margin: 0 12rpx;
}
.step-line.done { background: #10B981; }

.step-content { padding: 20rpx 24rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }
.card-title { font-size: 30rpx; font-weight: 600; margin-bottom: 24rpx; }

.search-input {
  display: flex;
  align-items: center;
  background: #F3F4F6;
  border-radius: 48rpx;
  padding: 16rpx 28rpx;
}
.search-icon { font-size: 28rpx; margin-right: 12rpx; }
.input { flex: 1; font-size: 28rpx; }

.customer-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #DBEAFE;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
}

.select-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  border: 2rpx solid transparent;
  background: #F9FAFB;
}
.select-item.selected {
  border-color: #2563EB;
  background: #EFF6FF;
}
.check-icon {
  width: 40rpx;
  height: 40rpx;
  background: #2563EB;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.cat-bar { white-space: nowrap; margin-bottom: 16rpx; }
.cat-item {
  display: inline-block;
  padding: 10rpx 24rpx;
  margin-right: 12rpx;
  border-radius: 48rpx;
  font-size: 24rpx;
  color: #4B5563;
  background: #F3F4F6;
}
.cat-item.active { background: #2563EB; color: #fff; }

.product-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.product-item:last-child { border-bottom: none; }
.product-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.product-name { font-size: 26rpx; font-weight: 600; line-height: 1.4; }
.add-btn {
  background: #2563EB;
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 48rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.cart-item:last-child { border-bottom: none; }
.qty-control {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 0 20rpx;
}
.qty-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #4B5563;
}
.qty-num { font-size: 28rpx; font-weight: 600; min-width: 40rpx; text-align: center; }
.remove-btn { font-size: 24rpx; color: #EF4444; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
}
.info-label { font-size: 28rpx; color: #9CA3AF; }
.info-value { font-size: 28rpx; }

.order-item {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}
.order-item:last-child { border-bottom: none; }
.divider { height: 1rpx; background: #E5E7EB; margin: 16rpx 0; }

.pay-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  border: 2rpx solid transparent;
  background: #F9FAFB;
}
.pay-item.selected { border-color: #2563EB; background: #EFF6FF; }
.pay-icon { font-size: 36rpx; margin-right: 20rpx; }
.radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 4rpx solid #D1D5DB;
}
.radio.checked {
  border-color: #2563EB;
  background: #2563EB;
  position: relative;
}
.radio.checked::after {
  content: '<wx-icon name="check" size="24" />';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 24rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #E5E7EB;
}
.btn-back {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 48rpx;
  background: #F3F4F6;
  color: #4B5563;
  font-size: 30rpx;
}
.btn-next, .btn-submit {
  flex: 2;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 48rpx;
  background: #2563EB;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}
.btn-next.disabled { background: #D1D5DB; }
</style>
