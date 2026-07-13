<template>
  <view class="page">
    <!-- 周期切换 -->
    <view class="period-bar">
      <view
        v-for="p in periods"
        :key="p.value"
        class="period-item"
        :class="{ active: activePeriod === p.value }"
        @tap="activePeriod = p.value"
      >
        {{ p.label }}
      </view>
    </view>

    <!-- 核心数据 -->
    <view class="section">
      <view class="card stats-card">
        <view class="stats-grid">
          <view class="stat-item">
            <view class="stat-value text-primary">¥{{ formatNum(stats.performance) }}</view>
            <view class="stat-label">成交总额</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ stats.orderCount }}</view>
            <view class="stat-label">订单数</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-success">¥{{ formatNum(stats.estimatedCommission) }}</view>
            <view class="stat-label">预估提成</view>
          </view>
          <view class="stat-item">
            <view class="stat-value text-warning">¥{{ formatNum(stats.withdrawnAmount) }}</view>
            <view class="stat-label">已提现</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 业绩趋势图 -->
    <view class="section">
      <view class="card">
        <view class="card-title">业绩趋势</view>
        <view class="chart-container">
          <view v-for="(item, idx) in trendData" :key="idx" class="chart-bar-wrapper">
            <view class="chart-bar-col">
              <view
                class="chart-bar"
                :style="{ height: getBarHeight(item.value) + 'rpx' }"
              >
                <text v-if="item.value > 0" class="bar-value">{{ formatNum(item.value) }}</text>
              </view>
            </view>
            <view class="chart-label">{{ item.month }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 业务员排名 -->
    <view class="section">
      <view class="card">
        <view class="card-title">业务员排名</view>
        <view class="ranking-list">
          <view
            v-for="item in rankings"
            :key="item.rank"
            class="ranking-item"
            :class="{ 'ranking-me': item.isMe }"
          >
            <view class="rank-num" :class="getRankClass(item.rank)">{{ item.rank }}</view>
            <view class="flex-1">
              <view class="flex items-center">
                <text class="text-md text-bold">{{ item.name }}</text>
                <view v-if="item.isMe" class="tag tag-blue ml-10">我</view>
              </view>
              <view class="text-sm text-gray">{{ item.region }}</view>
            </view>
            <view class="text-md text-primary text-bold">¥{{ formatNum(item.performance) }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 提成明细 -->
    <view class="section">
      <view class="card-title-row">
        <text class="card-title">提成明细</text>
      </view>
      <view v-for="item in commissionList" :key="item.id" class="card commission-card">
        <view class="flex-between mb-10">
          <text class="text-sm text-gray">{{ item.orderNo }}</text>
          <view class="tag" :class="item.status === 'settled' ? 'tag-green' : 'tag-orange'">
            {{ item.statusText }}
          </view>
        </view>
        <view class="text-md text-bold mb-10">{{ item.customerName }}</view>
        <view class="flex-between">
          <view>
            <text class="text-sm text-gray">订单金额</text>
            <text class="text-md ml-10">¥{{ formatMoney(item.amount) }}</text>
          </view>
          <view>
            <text class="text-sm text-gray">提成比例</text>
            <text class="text-md ml-10">{{ (item.commissionRate * 100).toFixed(1) }}%</text>
          </view>
          <view>
            <text class="text-sm text-gray">提成</text>
            <text class="text-md text-success text-bold ml-10">¥{{ formatMoney(item.commission) }}</text>
          </view>
        </view>
        <view class="text-sm text-gray mt-10">{{ item.date }}</view>
      </view>
    </view>

    <view style="height:120rpx"></view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { performanceStats, performanceTrend, commissionDetails, salesRanking } from '@/mock/mockPerformance.js'

const periods = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' }
]

const activePeriod = ref('month')
const trendData = performanceTrend
const rankings = salesRanking
const commissionList = commissionDetails

const stats = computed(() => performanceStats[activePeriod.value])

const maxTrendValue = Math.max(...performanceTrend.map(t => t.value))

function getBarHeight(val) {
  if (val === 0) return 4
  return Math.max(4, (val / maxTrendValue) * 240)
}

function formatNum(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function formatMoney(num) {
  return num.toFixed(2)
}

function getRankClass(rank) {
  if (rank === 1) return 'rank-1'
  if (rank === 2) return 'rank-2'
  if (rank === 3) return 'rank-3'
  return ''
}
</script>

<style scoped>
.page { min-height: 100vh; }

.period-bar {
  display: flex;
  background: #fff;
  padding: 16rpx 24rpx;
  gap: 16rpx;
}
.period-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 48rpx;
  font-size: 28rpx;
  color: #4B5563;
  background: #F3F4F6;
}
.period-item.active {
  background: #2563EB;
  color: #fff;
  font-weight: 600;
}

.section { padding: 0 24rpx; margin-top: 20rpx; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }
.card-title { font-size: 30rpx; font-weight: 600; margin-bottom: 24rpx; }
.card-title-row { padding: 0 4rpx; margin-bottom: 16rpx; }

.stats-card { box-shadow: 0 4rpx 20rpx rgba(37,99,235,0.08); }
.stats-grid { display: flex; flex-wrap: wrap; }
.stat-item { width: 50%; padding: 16rpx 0; }
.stat-value { font-size: 36rpx; font-weight: 700; margin-bottom: 8rpx; }
.stat-label { font-size: 24rpx; color: #9CA3AF; }

.chart-container {
  display: flex;
  align-items: flex-end;
  height: 300rpx;
  padding: 20rpx 0;
  gap: 8rpx;
  overflow-x: auto;
}
.chart-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 60rpx;
}
.chart-bar-col {
  height: 260rpx;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}
.chart-bar {
  width: 80%;
  max-width: 48rpx;
  background: linear-gradient(180deg, #60A5FA, #2563EB);
  border-radius: 8rpx 8rpx 0 0;
  position: relative;
  min-height: 4rpx;
}
.bar-value {
  position: absolute;
  top: -36rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18rpx;
  color: #6B7280;
  white-space: nowrap;
}
.chart-label { font-size: 20rpx; color: #9CA3AF; margin-top: 8rpx; }

.ranking-list { display: flex; flex-direction: column; gap: 20rpx; }
.ranking-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #F9FAFB;
  border-radius: 16rpx;
}
.ranking-item.ranking-me {
  background: #DBEAFE;
  border: 2rpx solid #2563EB;
}
.rank-num {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  background: #F3F4F6;
  color: #6B7280;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.rank-1 { background: #FEF3C7; color: #F59E0B; }
.rank-2 { background: #F3F4F6; color: #6B7280; }
.rank-3 { background: #FED7AA; color: #EA580C; }

.commission-card { margin-bottom: 20rpx; }

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
</style>
