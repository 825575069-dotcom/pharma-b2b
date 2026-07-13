<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">库存总览</div></div>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6"><div class="stat-card"><div class="stat-label">总SKU数</div><div class="stat-value num-font">{{ totalSku }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">正常</div><div class="stat-value num-font" style="color: #10B981;">{{ normalCount }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">预警</div><div class="stat-value num-font" style="color: #F59E0B;">{{ warningCount }}</div></div></el-col>
      <el-col :span="6"><div class="stat-card"><div class="stat-label">缺货</div><div class="stat-value num-font" style="color: #EF4444;">{{ outCount }}</div></div></el-col>
    </el-row>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="药品名称"><el-input v-model="filters.name" placeholder="搜索药品" clearable style="width: 160px" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="normal" />
            <el-option label="预警" value="warning" />
            <el-option label="缺货" value="out" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="filters.warehouse" placeholder="全部" clearable style="width: 120px">
            <el-option label="A区" value="A" />
            <el-option label="B区" value="B" />
            <el-option label="C区" value="C" />
            <el-option label="D区" value="D" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header"><el-button @click="ElMessage.success('导出成功')">导出报表</el-button></div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column prop="name" label="药品名称" min-width="160" />
        <el-table-column prop="spec" label="规格" width="140" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="当前库存" width="100" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.stock === 0 ? '#EF4444' : row.stock < row.threshold ? '#F59E0B' : '#1F2937' }">{{ row.stock }} {{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="预警阈值" width="100" align="right" />
        <el-table-column prop="warehouse" label="库位" width="100" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '缺货' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUpdate" label="最后更新" width="140" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { inventoryList } from '@/mock/mockInventory'

const tableData = ref([...inventoryList])
const filters = reactive({ name: '', status: '', warehouse: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.name && !item.name.includes(filters.name)) return false
    if (filters.status && item.status !== filters.status) return false
    if (filters.warehouse && !item.warehouse.startsWith(filters.warehouse)) return false
    return true
  })
})

const totalSku = computed(() => tableData.value.length)
const normalCount = computed(() => tableData.value.filter(i => i.status === 'normal').length)
const warningCount = computed(() => tableData.value.filter(i => i.status === 'warning').length)
const outCount = computed(() => tableData.value.filter(i => i.status === 'out').length)
</script>

<style scoped>
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #6B7280; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 600; color: #1F2937; }
.table-header { display: flex; justify-content: flex-end; }
</style>
