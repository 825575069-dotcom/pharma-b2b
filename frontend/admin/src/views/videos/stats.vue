<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">视频数据统计</div></div>
    <el-row :gutter="20">
      <el-col :span="6"><div class="stat-card"><div class="stat-label">总播放量</div><div class="stat-value num-font">58,600</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">加购转化率</div><div class="stat-value num-font">6.2%</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">评论总数</div><div class="stat-value num-font">708</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">积分发放总量</div><div class="stat-value num-font">285,600</div></div></el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-title">近30天播放量趋势</div>
          <div ref="viewsChartRef" style="height: 320px;"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-title">转化漏斗</div>
          <div ref="funnelChartRef" style="height: 320px;"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">积分发放分布</div>
          <div ref="pointsChartRef" style="height: 280px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">热门视频排行</div>
          <el-table :data="videoStats.hotVideos" style="width: 100%; margin-top: 12px;">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="title" label="视频标题" min-width="200" />
            <el-table-column prop="views" label="播放量" width="100" align="right" />
            <el-table-column label="转化率" width="80" align="right">
              <template #default="{ row }">{{ row.conversion }}%</template>
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
import { videoStats } from '@/mock/mockVideos'

const viewsChartRef = ref()
const funnelChartRef = ref()
const pointsChartRef = ref()

onMounted(() => {
  nextTick(() => {
    if (viewsChartRef.value) {
      echarts.init(viewsChartRef.value).setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: videoStats.viewsTrend.dates, boundaryGap: false, axisLabel: { color: '#9CA3AF', fontSize: 11 } },
        yAxis: { type: 'value', splitLine: { lineStyle: { color: '#F3F4F6' } }, axisLabel: { color: '#9CA3AF' } },
        series: [{ data: videoStats.viewsTrend.values, type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#2563EB' }, areaStyle: { color: 'rgba(37,99,235,0.1)' } }],
      })
    }
    if (funnelChartRef.value) {
      echarts.init(funnelChartRef.value).setOption({
        tooltip: { trigger: 'item' },
        series: [{ type: 'funnel', left: '10%', right: '10%', data: videoStats.conversionFunnel, color: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'], label: { fontSize: 12 }, itemStyle: { borderColor: '#fff', borderWidth: 1 } }],
      })
    }
    if (pointsChartRef.value) {
      const p = videoStats.pointsIssued
      echarts.init(pointsChartRef.value).setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [{ type: 'pie', radius: ['40%', '65%'], data: [
          { name: '观看视频', value: p.videoWatch },
          { name: '订单评价', value: p.orderReview },
          { name: '每日签到', value: p.dailyCheckin },
          { name: '拉新奖励', value: p.referral },
        ], itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 }, label: { formatter: '{b}: {c}' } }],
        color: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
      })
    }
  })
})
</script>

<style scoped>
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #6B7280; margin-bottom: 8px; }
.stat-value { font-size: 26px; font-weight: 600; color: #1F2937; }
.chart-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.chart-title { font-size: 15px; font-weight: 600; color: #1F2937; margin-bottom: 16px; }
</style>
