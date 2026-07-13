<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">资金流水</div></div>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6"><div class="stat-card"><div class="stat-label">总收入</div><div class="stat-value num-font" style="color: #10B981;">¥{{ totalIncome.toLocaleString() }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">总支出</div><div class="stat-value num-font" style="color: #EF4444;">¥{{ totalExpense.toLocaleString() }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">应收账款</div><div class="stat-value num-font" style="color: #F59E0B;">¥{{ totalReceivable.toLocaleString() }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">净收入</div><div class="stat-value num-font">¥{{ (totalIncome - totalExpense).toLocaleString() }}</div></div></el-col>
    </el-row>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部" clearable style="width: 130px">
            <el-option label="订单收款" value="income" />
            <el-option label="业务员提现" value="expense" />
            <el-option label="账期应收" value="receivable" />
            <el-option label="积分兑换" value="points" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="filters.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button><el-button @click="ElMessage.success('导出成功')">导出</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="filteredData" style="width: 100%;">
        <el-table-column prop="id" label="流水号" width="80" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="flowType(row.type)" size="small">{{ row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="关联单号" width="140" />
        <el-table-column label="对方" min-width="140">
          <template #default="{ row }">{{ row.customer || row.payee }}</template>
        </el-table-column>
        <el-table-column label="金额" width="120" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'income' ? '#10B981' : row.type === 'expense' ? '#EF4444' : '#F59E0B' }">
              {{ row.type === 'income' ? '+' : row.type === 'expense' ? '-' : '' }}¥{{ row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="method" label="支付方式" width="100" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : 'warning'" size="small">{{ row.status === 'confirmed' ? '已确认' : '待确认' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { financeFlow } from '@/mock/mockFinance'

const tableData = ref([...financeFlow])
const filters = reactive({ type: '', dateRange: [] })

const filteredData = computed(() => {
  return tableData.value.filter(item => !filters.type || item.type === filters.type)
})

const totalIncome = computed(() => tableData.value.filter(i => i.type === 'income').reduce((s, i) => s + i.amount, 0))
const totalExpense = computed(() => tableData.value.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0))
const totalReceivable = computed(() => tableData.value.filter(i => i.type === 'receivable').reduce((s, i) => s + i.amount, 0))

const flowType = (t) => t === 'income' ? 'success' : t === 'expense' ? 'danger' : t === 'receivable' ? 'warning' : 'info'
</script>

<style scoped>
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #6B7280; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 600; color: #1F2937; }
</style>
