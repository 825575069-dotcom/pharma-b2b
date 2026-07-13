<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">全局数据看板</div>
      <el-tag type="danger" size="small">仅老板可见</el-tag>
    </div>

    <!-- 平台总经营指标 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in kpiCards" :key="card.title">
        <div class="stat-card">
          <div class="kpi-label">{{ card.title }}</div>
          <div class="kpi-value num-font">{{ card.value }}</div>
          <div class="kpi-extra">{{ card.extra }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 业务员排名图表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">业务员业绩排名</div>
          <div ref="barChartRef" style="height: 320px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">客户分层报表</div>
          <el-table :data="customerTiers" style="width: 100%; margin-top: 12px;">
            <el-table-column prop="tier" label="客户层级" width="100" />
            <el-table-column prop="count" label="客户数" width="80" align="right" />
            <el-table-column label="占比" width="80" align="right">
              <template #default="{ row }">{{ row.percent }}%</template>
            </el-table-column>
            <el-table-column label="总金额" width="140" align="right">
              <template #default="{ row }">¥{{ (row.totalAmount / 10000).toFixed(1) }}万</template>
            </el-table-column>
            <el-table-column label="留存率" width="80" align="right">
              <template #default="{ row }">{{ row.retentionRate }}%</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 商品营销报表 & 财务总报表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">药品分类销售占比</div>
          <div ref="pieChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">财务总报表</div>
          <el-table :data="financeReport" style="width: 100%; margin-top: 12px;">
            <el-table-column prop="item" label="项目" width="140" />
            <el-table-column label="金额" width="140" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="占比" width="80" align="right">
              <template #default="{ row }">{{ row.percent }}%</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { dashboardData } from '@/mock/mockDashboard'
import { salesmen, customerTiers } from '@/mock/mockSalesmen'

const barChartRef = ref()
const pieChartRef = ref()

const kpi = dashboardData.globalKpi
const kpiCards = [
  { title: '总销售额', value: `¥${(kpi.totalSales / 10000).toFixed(1)}万`, extra: `月增长 ${kpi.monthlyGrowthRate}%` },
  { title: '总订单量', value: kpi.totalOrders.toLocaleString(), extra: `客单价 ¥${kpi.avgOrderValue}` },
  { title: '总客户数', value: kpi.totalCustomers, extra: `留存率 ${kpi.customerRetentionRate}%` },
  { title: '总商品数', value: kpi.totalProducts, extra: `业务员 ${kpi.totalSalesmen}人` },
]

const financeReport = [
  { item: '订单收款', amount: 128654000, percent: 85.2 },
  { item: '积分兑换', amount: 8560000, percent: 5.7 },
  { item: '业务员提现', amount: 9870000, percent: 6.5 },
  { item: '账期应收', amount: 4020000, percent: 2.6 },
]

onMounted(() => {
  nextTick(() => {
    if (barChartRef.value) {
      const ranking = [...dashboardData.salesmanRanking].reverse()
      echarts.init(barChartRef.value).setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '10%', bottom: '3%', containLabel: true },
        xAxis: { type: 'value', splitLine: { lineStyle: { color: '#F3F4F6' } }, axisLabel: { color: '#9CA3AF' } },
        yAxis: { type: 'category', data: ranking.map(i => i.name), axisLabel: { color: '#4B5563' } },
        series: [{ data: ranking.map(i => i.value), type: 'bar', barWidth: 16, itemStyle: { borderRadius: [0, 4, 4, 0], color: '#2563EB' }, label: { show: true, position: 'right', formatter: (p) => `¥${(p.value / 10000).toFixed(1)}万`, fontSize: 11 } }],
      })
    }
    if (pieChartRef.value) {
      echarts.init(pieChartRef.value).setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        color: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
        series: [{ type: 'pie', radius: ['40%', '65%'], data: dashboardData.categorySales, itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }, label: { formatter: '{b}: {d}%' } }],
      })
    }
  })
})
</script>

<style scoped>
.stat-card { text-align: center; }
.kpi-label { font-size: 13px; color: #6B7280; margin-bottom: 8px; }
.kpi-value { font-size: 24px; font-weight: 600; color: #1F2937; }
.kpi-extra { font-size: 12px; color: #9CA3AF; margin-top: 4px; }
.chart-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.chart-title { font-size: 15px; font-weight: 600; color: #1F2937; margin-bottom: 16px; }
</style>
