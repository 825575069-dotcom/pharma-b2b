<template>
  <div class="points-page">
    <div class="container">
      <!-- 积分概览 -->
      <div class="points-overview">
        <div class="overview-left">
          <div class="overview-label">我的可用积分</div>
          <div class="overview-number">{{ userStore.availablePoints }}</div>
          <div class="overview-info">
            <el-icon :size="14" color="#F59E0B"><AlarmClock /></el-icon>
            <span>{{ userStore.userInfo.pointsExpiring }}积分将于{{ userStore.userInfo.pointsExpiringDate }}过期</span>
          </div>
        </div>
        <div class="overview-right">
          <div class="overview-stat">
            <div class="stat-value">{{ mockPoints.yearEarned }}</div>
            <div class="stat-label">本年获得</div>
          </div>
          <div class="overview-stat">
            <div class="stat-value">{{ mockPoints.yearUsed }}</div>
            <div class="stat-label">本年消耗</div>
          </div>
        </div>
      </div>

      <!-- 积分商品列表 -->
      <div class="section-header">
        <h2 class="section-title">积分兑换好礼</h2>
        <div class="filter-tabs">
          <span class="filter-tab" :class="{ active: filterType === 'all' }" @click="filterType = 'all'">全部</span>
          <span class="filter-tab" :class="{ active: filterType === 'full' }" @click="filterType = 'full'">全额兑换</span>
          <span class="filter-tab" :class="{ active: filterType === 'mixed' }" @click="filterType = 'mixed'">积分+现金</span>
        </div>
      </div>

      <div class="points-product-grid">
        <div
          v-for="ptp in filteredPointsProducts"
          :key="ptp.id"
          class="pp-card"
        >
          <div class="pp-img">
            <el-image :src="ptp.image" fit="cover" style="width: 100%; height: 100%;">
              <template #error><div class="pp-img-fallback" :style="{ background: ptp.colorBg }"><el-icon :size="36" :color="ptp.colorText"><Goods /></el-icon></div></template>
            </el-image>
            <el-tag v-if="ptp.hot" type="danger" size="small" class="pp-hot">HOT</el-tag>
          </div>
          <div class="pp-body">
            <div class="pp-name text-ellipsis-2">{{ ptp.name }}</div>
            <div class="pp-spec">{{ ptp.spec }}</div>
            <div class="pp-stock">库存{{ ptp.stock }}件</div>
            <div class="pp-points-row">
              <span class="pp-points-num">{{ ptp.points }}</span>
              <span class="pp-points-label">积分</span>
              <span v-if="ptp.cash > 0" class="pp-cash">+¥{{ ptp.cash.toFixed(2) }}</span>
            </div>
            <el-button
              :type="userStore.availablePoints >= ptp.points ? 'primary' : 'info'"
              :disabled="userStore.availablePoints < ptp.points"
              size="small"
              round
              class="pp-btn"
              @click="handleExchange(ptp)"
            >
              {{ userStore.availablePoints >= ptp.points ? '立即兑换' : '积分不足' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AlarmClock, Goods } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { mockPoints } from '@/mock/mockPoints'

const userStore = useUserStore()

const filterType = ref('all')

const filteredPointsProducts = computed(() => {
  if (filterType.value === 'full') {
    return mockPoints.mallProducts.filter(p => p.type === '全额兑换')
  } else if (filterType.value === 'mixed') {
    return mockPoints.mallProducts.filter(p => p.type === '积分+现金')
  }
  return mockPoints.mallProducts
})

const handleExchange = (ptp) => {
  ElMessageBox.confirm(
    `确认兑换「${ptp.name}」？将消耗${ptp.points}积分${ptp.cash > 0 ? ` + ¥${ptp.cash.toFixed(2)}` : ''}`,
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
.points-page {
  padding: 20px 0 40px;
}

.points-overview {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  border-radius: 12px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  color: #FFFFFF;

  .overview-left {
    .overview-label {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 8px;
    }

    .overview-number {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .overview-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      opacity: 0.9;
    }
  }

  .overview-right {
    display: flex;
    gap: 48px;

    .overview-stat {
      text-align: center;

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        opacity: 0.8;
      }
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
  }

  .filter-tabs {
    display: flex;
    gap: 8px;
  }

  .filter-tab {
    padding: 4px 14px;
    border-radius: 4px;
    font-size: 13px;
    color: #6B7280;
    cursor: pointer;
    background: #FFFFFF;
    transition: all 0.2s;

    &:hover {
      color: #2563EB;
    }

    &.active {
      color: #FFFFFF;
      background: #2563EB;
    }
  }
}

.points-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.pp-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .pp-img {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .pp-hot {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  .pp-body {
    padding: 14px;
  }

  .pp-name {
    font-size: 14px;
    font-weight: 500;
    color: #1F2937;
    margin-bottom: 4px;
    line-height: 1.4;
    height: 40px;
  }

  .pp-spec {
    font-size: 12px;
    color: #9CA3AF;
    margin-bottom: 2px;
  }

  .pp-stock {
    font-size: 12px;
    color: #D1D5DB;
    margin-bottom: 8px;
  }

  .pp-points-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 10px;

    .pp-points-num {
      font-size: 18px;
      font-weight: 600;
      color: #F59E0B;
    }

    .pp-points-label {
      font-size: 12px;
      color: #9CA3AF;
    }

    .pp-cash {
      font-size: 13px;
      color: #6B7280;
      margin-left: 4px;
    }
  }

  .pp-btn {
    width: 100%;
  }
}
</style>
