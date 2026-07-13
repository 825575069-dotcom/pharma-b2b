<template>
  <el-dialog
    v-model="visible"
    title="确认订单"
    width="680px"
    class="checkout-dialog"
    :close-on-click-modal="false"
  >
    <div class="checkout-content">
      <!-- 收货地址 -->
      <div class="checkout-section">
        <div class="section-header">
          <span class="section-title">收货地址</span>
        </div>
        <div class="address-list">
          <div
            v-for="addr in userStore.userInfo.address"
            :key="addr.id"
            class="address-card"
            :class="{ active: selectedAddressId === addr.id }"
            @click="selectedAddressId = addr.id"
          >
            <div class="address-tag" v-if="addr.isDefault">默认</div>
            <div class="address-info">
              <div class="address-name">{{ addr.name }} {{ addr.phone }}</div>
              <div class="address-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</div>
            </div>
            <el-icon v-if="selectedAddressId === addr.id" class="check-icon" color="#2563EB"><CircleCheck /></el-icon>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="checkout-section">
        <div class="section-header">
          <span class="section-title">支付方式</span>
        </div>
        <div class="pay-methods">
          <div
            v-for="method in payMethods"
            :key="method.value"
            class="pay-card"
            :class="{ active: selectedPayMethod === method.value }"
            @click="selectedPayMethod = method.value"
          >
            <el-icon :size="20"><component :is="method.icon" /></el-icon>
            <span>{{ method.label }}</span>
          </div>
        </div>

        <!-- 账期额度 -->
        <div v-if="selectedPayMethod === 'credit'" class="credit-info" :class="{ exceeded: creditExceeded }">
          <div class="credit-row">
            <span>可用额度</span>
            <span class="credit-amount">¥{{ (userStore.userInfo.creditAvailable).toLocaleString() }}</span>
          </div>
          <div class="credit-bar">
            <div class="credit-bar-fill" :style="{ width: creditPercent + '%' }"></div>
          </div>
          <div class="credit-detail">
            总额度 ¥{{ userStore.userInfo.creditLimit.toLocaleString() }} · 已用 ¥{{ userStore.userInfo.creditUsed.toLocaleString() }}
          </div>
          <div v-if="creditExceeded" class="credit-warning">
            <el-icon><WarningFilled /></el-icon>
            订单金额超出可用账期额度，请选择其他支付方式
          </div>
        </div>
      </div>

      <!-- 订单明细 -->
      <div class="checkout-section">
        <div class="section-header">
          <span class="section-title">订单明细</span>
        </div>
        <div class="order-items">
          <div v-for="item in cartStore.checkedItems" :key="item.productId" class="order-item">
            <div class="oi-img">
              <img :src="item.image" alt="" />
            </div>
            <div class="oi-info">
              <div class="oi-name text-ellipsis">{{ item.name }}</div>
              <div class="oi-spec">{{ item.spec }}</div>
            </div>
            <div class="oi-quantity">x{{ item.quantity }}</div>
            <div class="oi-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- 优惠明细 -->
      <div class="checkout-section">
        <div class="section-header">
          <span class="section-title">费用明细</span>
        </div>
        <div class="fee-detail">
          <div class="fee-row">
            <span>商品总额</span>
            <span>¥{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.discountAmount > 0" class="fee-row discount">
            <span>满减优惠</span>
            <span>-¥{{ cartStore.discountAmount.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.pointsDeduct > 0" class="fee-row discount">
            <span>积分抵扣({{ cartStore.pointsToUse }}积分)</span>
            <span>-¥{{ cartStore.pointsDeduct.toFixed(2) }}</span>
          </div>
          <div class="fee-row total">
            <span>应付金额</span>
            <span class="total-price">¥{{ cartStore.finalTotal.toFixed(2) }}</span>
          </div>
          <div class="fee-row points-earn">
            <span>预计获得积分</span>
            <span class="points-value">+{{ Math.floor(cartStore.finalTotal) }}积分</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="creditExceeded"
          @click="handleSubmitOrder"
        >
          提交订单 · ¥{{ cartStore.finalTotal.toFixed(2) }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, Box, WarningFilled, Wallet, Money, Promotion, CreditCard } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'

const globalStore = useGlobalStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.checkoutDialogVisible,
  set: (val) => { if (!val) globalStore.closeCheckout() }
})

const selectedAddressId = ref(userStore.userInfo.address[0].id)
const selectedPayMethod = ref('online')

const payMethods = [
  { value: 'online', label: '线上支付', icon: 'Wallet' },
  { value: 'transfer', label: '对公转账', icon: 'Money' },
  { value: 'proxy', label: '找人代付', icon: 'Promotion' },
  { value: 'credit', label: '账期赊购', icon: 'CreditCard' }
]

const creditExceeded = computed(() => {
  if (selectedPayMethod.value !== 'credit') return false
  return cartStore.finalTotal > userStore.userInfo.creditAvailable
})

const creditPercent = computed(() => {
  if (selectedPayMethod.value !== 'credit') return 0
  const totalUsed = userStore.userInfo.creditUsed + cartStore.finalTotal
  return Math.min(100, (totalUsed / userStore.userInfo.creditLimit) * 100)
})

const handleSubmitOrder = () => {
  if (creditExceeded.value) {
    ElMessage.warning('订单金额超出可用账期额度')
    return
  }

  ElMessage.success('订单提交成功！')

  // 模拟获得积分
  const earnedPoints = Math.floor(cartStore.finalTotal)
  userStore.addPoints(earnedPoints)

  // 清空已选商品
  cartStore.clearChecked()

  // 关闭弹窗
  visible.value = false

  // 打开个人中心
  setTimeout(() => {
    globalStore.openUserCenter()
  }, 300)
}
</script>

<style lang="scss" scoped>
.checkout-content {
  max-height: 60vh;
  overflow-y: auto;
}

.checkout-section {
  margin-bottom: 24px;

  .section-header {
    margin-bottom: 12px;

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: #1F2937;
      position: relative;
      padding-left: 10px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 14px;
        background: #2563EB;
        border-radius: 2px;
      }
    }
  }
}

.address-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.address-card {
  flex: 1;
  min-width: 240px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;

  &.active {
    border-color: #2563EB;
  }

  .address-tag {
    position: absolute;
    top: -1px;
    right: 8px;
    background: #2563EB;
    color: #FFFFFF;
    font-size: 11px;
    padding: 1px 8px;
    border-radius: 0 0 4px 4px;
  }

  .address-name {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 4px;
  }

  .address-detail {
    font-size: 12px;
    color: #6B7280;
    line-height: 1.5;
  }

  .check-icon {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
}

.pay-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.pay-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  color: #6B7280;

  &.active {
    border-color: #2563EB;
    color: #2563EB;
    background: #DBEAFE;
  }
}

.credit-info {
  margin-top: 12px;
  padding: 14px;
  background: #F9FAFB;
  border-radius: 8px;

  &.exceeded {
    background: #FEF2F2;
  }

  .credit-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    color: #4B5563;

    .credit-amount {
      font-weight: 600;
      color: #2563EB;
    }
  }

  .credit-bar {
    height: 6px;
    background: #E5E7EB;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;

    .credit-bar-fill {
      height: 100%;
      background: #2563EB;
      border-radius: 3px;
      transition: width 0.3s;
    }
  }

  .credit-detail {
    font-size: 12px;
    color: #9CA3AF;
  }

  .credit-warning {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 12px;
    color: #EF4444;
  }
}

.order-items {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;

  &:last-child {
    border-bottom: none;
  }

  .oi-img {
    width: 40px;
    height: 40px;
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

  .oi-info {
    flex: 1;
    min-width: 0;

    .oi-name {
      font-size: 13px;
      color: #1F2937;
      margin-bottom: 2px;
    }

    .oi-spec {
      font-size: 12px;
      color: #9CA3AF;
    }
  }

  .oi-quantity {
    font-size: 13px;
    color: #6B7280;
  }

  .oi-price {
    font-size: 14px;
    font-weight: 500;
    color: #EF4444;
    min-width: 70px;
    text-align: right;
  }
}

.fee-detail {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 12px 16px;

  .fee-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    color: #6B7280;

    &.discount {
      color: #10B981;
    }

    &.total {
      padding-top: 12px;
      margin-top: 4px;
      border-top: 1px solid #E5E7EB;
      font-size: 15px;
      font-weight: 600;
      color: #1F2937;

      .total-price {
        font-size: 20px;
        color: #EF4444;
      }
    }

    &.points-earn {
      font-size: 12px;
      color: #F59E0B;

      .points-value {
        font-weight: 500;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .el-button--primary {
    min-width: 180px;
  }
}
</style>
