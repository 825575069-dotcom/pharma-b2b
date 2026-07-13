<template>
  <el-drawer
    v-model="visible"
    title="购物车"
    direction="rtl"
    size="420px"
    class="cart-drawer"
  >
    <div class="cart-content">
      <!-- 商品列表 -->
      <div v-if="cartStore.items.length > 0" class="cart-list">
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="cart-item"
        >
          <el-checkbox v-model="item.checked" @change="cartStore.toggleCheck(item.productId)" />
          <div class="item-img">
            <img :src="item.image" alt="" />
          </div>
          <div class="item-info">
            <div class="item-name text-ellipsis">{{ item.name }}</div>
            <div class="item-spec">{{ item.spec }}</div>
            <div class="item-bottom">
              <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
              <span class="item-origin">¥{{ item.originPrice.toFixed(2) }}</span>
              <el-input-number
                v-model="item.quantity"
                :min="1"
                :max="999"
                size="small"
                @change="cartStore.updateQuantity(item.productId, $event)"
              />
            </div>
          </div>
          <el-icon class="item-delete" @click="cartStore.removeItem(item.productId)"><Delete /></el-icon>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <el-icon class="empty-icon"><ShoppingCart /></el-icon>
        <div class="empty-text">购物车还是空的，快去采购吧</div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <template #footer>
      <div v-if="cartStore.items.length > 0" class="cart-footer">
        <div class="footer-top">
          <el-checkbox
            :model-value="cartStore.items.every(i => i.checked)"
            @change="cartStore.toggleCheckAll($event)"
          >全选</el-checkbox>
          <span class="footer-count">共{{ cartStore.checkedCount }}件</span>
        </div>

        <!-- 积分抵扣 -->
        <div class="points-deduct">
          <el-checkbox v-model="usePoints" @change="cartStore.togglePoints($event)">
            <span class="points-label">积分抵扣</span>
          </el-checkbox>
          <span v-if="usePoints" class="points-info">
            使用{{ cartStore.pointsToUse }}积分抵扣¥{{ cartStore.pointsDeduct.toFixed(2) }}
          </span>
        </div>

        <!-- 优惠明细 -->
        <div class="discount-detail">
          <div class="detail-row">
            <span>商品总额</span>
            <span>¥{{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.discountAmount > 0" class="detail-row discount">
            <span>满减优惠</span>
            <span>-¥{{ cartStore.discountAmount.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.pointsDeduct > 0" class="detail-row discount">
            <span>积分抵扣</span>
            <span>-¥{{ cartStore.pointsDeduct.toFixed(2) }}</span>
          </div>
          <div class="detail-row saved">
            <span>已节省</span>
            <span>¥{{ cartStore.savedAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 合计 + 结算 -->
        <div class="footer-bottom">
          <div class="total-section">
            <span class="total-label">合计：</span>
            <span class="total-price">¥{{ cartStore.finalTotal.toFixed(2) }}</span>
          </div>
          <el-button
            type="primary"
            size="large"
            :disabled="cartStore.checkedCount === 0"
            @click="handleCheckout"
            class="checkout-btn"
          >
            去结算 ({{ cartStore.checkedCount }})
          </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Box, Delete, ShoppingCart } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useCartStore } from '@/stores/cart'

const globalStore = useGlobalStore()
const cartStore = useCartStore()

const visible = computed({
  get: () => cartStore.drawerVisible,
  set: (val) => cartStore.toggleDrawer(val)
})

const usePoints = ref(false)

const handleCheckout = () => {
  cartStore.toggleDrawer(false)
  setTimeout(() => {
    globalStore.openCheckout()
  }, 200)
}
</script>

<style lang="scss" scoped>
.cart-content {
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
}

.cart-list {
  padding: 12px 0;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;

  .item-img {
    width: 56px;
    height: 56px;
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

  .item-info {
    flex: 1;
    min-width: 0;

    .item-name {
      font-size: 14px;
      font-weight: 500;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .item-spec {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 6px;
    }

    .item-bottom {
      display: flex;
      align-items: center;
      gap: 6px;

      .item-price {
        font-size: 15px;
        font-weight: 600;
        color: #EF4444;
      }

      .item-origin {
        font-size: 12px;
        color: #D1D5DB;
        text-decoration: line-through;
      }

      :deep(.el-input-number) {
        margin-left: auto;
        width: 100px;
      }
    }
  }

  .item-delete {
    cursor: pointer;
    color: #D1D5DB;
    flex-shrink: 0;
    margin-top: 4px;

    &:hover {
      color: #EF4444;
    }
  }
}

.cart-footer {
  padding: 16px 20px;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .footer-count {
    font-size: 13px;
    color: #6B7280;
  }
}

.points-deduct {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
  margin-bottom: 8px;

  .points-label {
    font-size: 13px;
    color: #4B5563;
  }

  .points-info {
    font-size: 12px;
    color: #F59E0B;
  }
}

.discount-detail {
  margin-bottom: 12px;

  .detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
    color: #6B7280;

    &.discount {
      color: #10B981;
    }

    &.saved {
      color: #F59E0B;
      font-weight: 500;
    }
  }
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #F3F4F6;

  .total-section {
    .total-label {
      font-size: 14px;
      color: #6B7280;
    }

    .total-price {
      font-size: 22px;
      font-weight: 700;
      color: #EF4444;
    }
  }

  .checkout-btn {
    min-width: 140px;
    border-radius: 8px;
  }
}
</style>
