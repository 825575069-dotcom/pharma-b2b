<template>
  <el-dialog
    v-model="visible"
    title=""
    width="920px"
    :show-close="false"
    :with-header="false"
    class="points-mall-dialog"
    append-to-body
  >
    <div class="pm-content">
      <!-- 头部 -->
      <div class="pm-header">
        <div class="pm-title-area">
          <h2 class="pm-title">积分商城</h2>
          <span class="pm-subtitle">积分兑好礼，越兑越开心</span>
        </div>
        <div class="pm-points">
          <div class="pm-points-label">可用积分</div>
          <div class="pm-points-value">{{ userStore.availablePoints }}</div>
        </div>
        <div class="pm-close" @click="visible = false">
          <el-icon :size="18"><Close /></el-icon>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="pm-filter">
        <div class="filter-tabs">
          <span class="filter-tab" :class="{ active: filterType === 'all' }" @click="filterType = 'all'">全部</span>
          <span class="filter-tab" :class="{ active: filterType === 'full' }" @click="filterType = 'full'">全额兑换</span>
          <span class="filter-tab" :class="{ active: filterType === 'mixed' }" @click="filterType = 'mixed'">积分+现金</span>
        </div>
        <div class="pm-expire-tip">
          <el-icon :size="14" color="#F59E0B"><AlarmClock /></el-icon>
          <span>{{ userStore.userInfo.pointsExpiring }}积分将于{{ userStore.userInfo.pointsExpiringDate }}过期</span>
        </div>
      </div>

      <!-- 商品网格 -->
      <div class="pm-grid">
        <div
          v-for="ptp in filteredProducts"
          :key="ptp.id"
          class="pm-card"
        >
          <div class="pm-card-img">
            <el-image :src="ptp.image" fit="cover" style="width: 100%; height: 100%;">
              <template #error><div class="pm-img-fallback" :style="{ background: ptp.colorBg }"><el-icon :size="36" :color="ptp.colorText"><Goods /></el-icon></div></template>
            </el-image>
            <el-tag v-if="ptp.hot" type="danger" size="small" class="pm-hot">HOT</el-tag>
            <div class="pm-type-tag" :style="{ background: ptp.colorText, color: '#FFFFFF' }">{{ ptp.type }}</div>
          </div>
          <div class="pm-card-body">
            <div class="pm-card-name text-ellipsis-2">{{ ptp.name }}</div>
            <div class="pm-card-spec">{{ ptp.spec }}</div>
            <div class="pm-card-stock">库存{{ ptp.stock }}件</div>
            <div class="pm-card-points">
              <span class="pm-points-num">{{ ptp.points }}</span>
              <span class="pm-points-label">积分</span>
              <span v-if="ptp.cash > 0" class="pm-cash">+¥{{ ptp.cash.toFixed(2) }}</span>
            </div>
            <el-button
              :type="userStore.availablePoints >= ptp.points ? 'primary' : 'info'"
              :disabled="userStore.availablePoints < ptp.points"
              size="small"
              round
              class="pm-exchange-btn"
              @click="handleExchange(ptp)"
            >
              {{ userStore.availablePoints >= ptp.points ? '立即兑换' : '积分不足' }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Goods /></el-icon>
        <div class="empty-text">该分类下暂无商品</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, AlarmClock, Goods } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'
import { mockPoints } from '@/mock/mockPoints'

const globalStore = useGlobalStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.pointsMallDialogVisible,
  set: (val) => { if (!val) globalStore.closePointsMall() }
})

const filterType = ref('all')

const filteredProducts = computed(() => {
  if (filterType.value === 'full') {
    return mockPoints.mallProducts.filter(p => p.type === '全额兑换')
  } else if (filterType.value === 'mixed') {
    return mockPoints.mallProducts.filter(p => p.type === '积分+现金')
  }
  return mockPoints.mallProducts
})

const handleExchange = (ptp) => {
  ElMessageBox.confirm(
    `确认兑换「${ptp.name}」？\n将消耗${ptp.points}积分${ptp.cash > 0 ? ` + ¥${ptp.cash.toFixed(2)}` : ''}`,
    '兑换确认',
    {
      confirmButtonText: '确认兑换',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    userStore.deductPoints(ptp.points)
    ElMessage.success('兑换成功！商品将尽快为您发货')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.pm-content {
  padding: 24px;
}

.pm-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .pm-title-area {
    flex: 1;

    .pm-title {
      font-size: 22px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .pm-subtitle {
      font-size: 13px;
      color: #9CA3AF;
    }
  }

  .pm-points {
    text-align: center;
    background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
    padding: 12px 24px;
    border-radius: 10px;

    .pm-points-label {
      font-size: 12px;
      color: #92400E;
    }

    .pm-points-value {
      font-size: 28px;
      font-weight: 700;
      color: #F59E0B;
    }
  }

  .pm-close {
    margin-left: 16px;
    cursor: pointer;
    color: #9CA3AF;

    &:hover {
      color: #2563EB;
    }
  }
}

.pm-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .filter-tabs {
    display: flex;
    gap: 8px;
  }

  .filter-tab {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    color: #6B7280;
    cursor: pointer;
    background: #F3F4F6;
    transition: all 0.2s;

    &:hover {
      color: #2563EB;
    }

    &.active {
      color: #FFFFFF;
      background: #2563EB;
    }
  }

  .pm-expire-tip {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #F59E0B;
  }
}

.pm-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.pm-card {
  background: #FFFFFF;
  border: 1px solid #F3F4F6;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .pm-card-img {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .pm-hot {
      position: absolute;
      top: 8px;
      right: 8px;
    }

    .pm-type-tag {
      position: absolute;
      bottom: 8px;
      left: 8px;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 3px;
    }
  }

  .pm-card-body {
    padding: 12px;
  }

  .pm-card-name {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 4px;
    line-height: 1.4;
    height: 40px;
  }

  .pm-card-spec {
    font-size: 12px;
    color: #9CA3AF;
    margin-bottom: 2px;
  }

  .pm-card-stock {
    font-size: 12px;
    color: #D1D5DB;
    margin-bottom: 8px;
  }

  .pm-card-points {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 10px;

    .pm-points-num {
      font-size: 18px;
      font-weight: 600;
      color: #F59E0B;
    }

    .pm-points-label {
      font-size: 12px;
      color: #9CA3AF;
    }

    .pm-cash {
      font-size: 13px;
      color: #6B7280;
      margin-left: 4px;
    }
  }

  .pm-exchange-btn {
    width: 100%;
  }
}
</style>
