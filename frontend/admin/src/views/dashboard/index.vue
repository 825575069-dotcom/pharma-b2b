<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">工作台</div>
      <div class="page-desc">欢迎回来，{{ userInfo.name }}（{{ userInfo.roleName }}）</div>
    </div>

    <!-- 关键指标卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6" v-for="card in kpiCards" :key="card.title">
        <div class="stat-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-title">{{ card.title }}</span>
            <el-icon class="kpi-icon" :style="{ background: card.bg, color: card.color }">
              <component :is="card.icon" />
            </el-icon>
          </div>
          <div class="kpi-value num-font">{{ card.value }}</div>
          <div class="kpi-bottom">
            <span :class="card.trend > 0 ? 'trend-up' : 'trend-down'">
              <el-icon><ArrowUp v-if="card.trend > 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(card.trend) }}%
            </span>
            <span class="kpi-compare">较昨日</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">近30天销售趋势</span>
            <el-radio-group v-model="trendType" size="small">
              <el-radio-button label="sales">销售额</el-radio-button>
              <el-radio-button label="orders">订单量</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="salesChartRef" style="height: 320px;"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">药品分类销售占比</span>
          </div>
          <div ref="pieChartRef" style="height: 320px;"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">业务员业绩排名</span>
          </div>
          <div ref="barChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">短视频播放/转化漏斗</span>
          </div>
          <div ref="funnelChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 待办事项 -->
    <div class="chart-card" style="margin-top: 20px;">
      <div class="chart-header">
        <span class="chart-title">待办事项</span>
        <el-tag type="danger" size="small">{{ todoItems.length }} 项待处理</el-tag>
      </div>
      <el-table :data="todoItems" style="width: 100%" :show-header="false">
        <el-table-column width="60">
          <template #default="{ row }">
            <el-tag :type="priorityType(row.priority)" size="small" effect="plain">
              {{ priorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="{ row }">
            <span style="cursor: pointer;" @click="handleTodoClick(row)">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="right">
          <template #default="{ row }">
            <span class="todo-time">{{ row.time }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { useUserStore } from '@/store/user'
import { dashboardData } from '@/mock/mockDashboard'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const todoItems = dashboardData.todoItems
const trendType = ref('sales')

const kpiCards = computed(() => {
  const d = dashboardData.kpi
  return [
    { title: '今日销售额', value: `¥${d.todaySales.toLocaleString()}`, trend: ((d.todaySales - d.yesterdaySales) / d.yesterdaySales * 100).toFixed(1), icon: 'Money', color: '#2563EB', bg: '#EFF6FF' },
    { title: '今日订单量', value: d.todayOrders, trend: ((d.todayOrders - d.yesterdayOrders) / d.yesterdayOrders * 100).toFixed(1), icon: 'Document', color: '#10B981', bg: '#ECFDF5' },
    { title: '新增客户', value: d.newCustomers, trend: ((d.newCustomers - d.yesterdayCustomers) / d.yesterdayCustomers * 100).toFixed(1), icon: 'UserFilled', color: '#F59E0B', bg: '#FFFBEB' },
    { title: '待处理事项', value: d.pendingItems, trend: 0, icon: 'Bell', color: '#EF4444', bg: '#FEF2F2' },
  ]
})

const salesChartRef = ref()
const pieChartRef = ref()
const barChartRef = ref()
const funnelChartRef = ref()
let salesChart, pieChart, barChart, funnelChart

const priorityType = (p) => p === 'urgent' ? 'danger' : p === 'high' ? 'warning' : 'info'
const priorityText = (p) => p === 'urgent' ? '紧急' : p === 'high' ? '高' : '中'

const handleTodoClick = (row) => {
  const routeMap = {
    video: '/videos/audit',
    authorization: '/authorization/list',
    withdrawal: '/finance/withdrawal',
    approval: '/marketing/approval',
    inventory: '/inventory/list',
    reconciliation: '/finance/reconciliation',
  }
  if (routeMap[row.type]) router.push(routeMap[row.type])
}

const initSalesChart = () => {
  if (!salesChartRef.value) return
  salesChart = echarts.init(salesChartRef.value)
  const trend = dashboardData.salesTrend
  const values = trendType.value === 'sales' 
    ? trend.values 
    : trend.values.map(v => Math.floor(v / 2500))
  salesChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: trend.dates, boundaryGap: false, axisLine: { lineStyle: { color: '#E5E7EB' } }, axisLabel: { color: '#9CA3AF', fontSize: 11 } },
    yAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#F3F4F6' } }, axisLabel: { color: '#9CA3AF', fontSize: 11 } },
    series: [{
      data: values,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#2563EB', width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(37,99,235,0.15)' }, { offset: 1, color: 'rgba(37,99,235,0)' }]) },
    }],
  })
}

const initPieChart = () => {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    legend: { bottom: 0, left: 'center', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12, color: '#6B7280' } },
    color: colors,
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: dashboardData.categorySales,
    }],
  })
}

const initBarChart = () => {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)
  const ranking = [...dashboardData.salesmanRanking].reverse()
  barChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLine: { show: false }, axisTick: { show: false }, splitLine: { lineStyle: { color: '#F3F4F6' } }, axisLabel: { color: '#9CA3AF', fontSize: 11 } },
    yAxis: { type: 'category', data: ranking.map(i => i.name), axisLine: { lineStyle: { color: '#E5E7EB' } }, axisLabel: { color: '#4B5563', fontSize: 12 } },
    series: [{
      data: ranking.map(i => i.value),
      type: 'bar',
      barWidth: 16,
      itemStyle: { borderRadius: [0, 4, 4, 0], color: '#2563EB' },
      label: { show: true, position: 'right', formatter: (p) => `¥${(p.value / 10000).toFixed(1)}万`, color: '#4B5563', fontSize: 11 },
    }],
  })
}

const initFunnelChart = () => {
  if (!funnelChartRef.value) return
  funnelChart = echarts.init(funnelChartRef.value)
  funnelChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: '10%',
      right: '10%',
      top: 10,
      bottom: 10,
      minSize: '30%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: { show: true, position: 'inside', fontSize: 12 },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
      data: dashboardData.videoFunnel,
      color: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
    }],
  })
}

watch(trendType, () => initSalesChart())

onMounted(() => {
  nextTick(() => {
    initSalesChart()
    initPieChart()
    initBarChart()
    initFunnelChart()
  })
  window.addEventListener('resize', () => {
    salesChart?.resize()
    pieChart?.resize()
    barChart?.resize()
    funnelChart?.resize()
  })
})
</script>

<style scoped lang="scss">
.kpi-row {
  .kpi-card {
    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .kpi-title {
        font-size: 13px;
        color: #6B7280;
      }

      .kpi-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 8px;
    }

    .kpi-bottom {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;

      .trend-up {
        color: #10B981;
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .trend-down {
        color: #EF4444;
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .kpi-compare {
        color: #9CA3AF;
      }
    }
  }
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .chart-title {
      font-size: 15px;
      font-weight: 600;
      color: #1F2937;
    }
  }
}

.todo-time {
  color: #9CA3AF;
  font-size: 12px;
}
</style>
