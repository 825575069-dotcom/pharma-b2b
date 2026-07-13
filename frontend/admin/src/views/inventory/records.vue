<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">出入库记录</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部" clearable style="width: 120px">
            <el-option label="入库" value="in" />
            <el-option label="出库" value="out" />
            <el-option label="盘点调整" value="adjust" />
          </el-select>
        </el-form-item>
        <el-form-item label="药品"><el-input v-model="filters.name" placeholder="搜索药品" clearable style="width: 160px" /></el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="filters.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 240px" />
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header"><el-button type="primary" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 手动录入</el-button></div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="记录编号" width="80" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'in' ? 'success' : row.type === 'out' ? 'danger' : 'warning'" size="small">{{ row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="药品名称" min-width="160" />
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column label="数量" width="100" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.qty > 0 ? '#10B981' : '#EF4444' }">{{ row.qty > 0 ? '+' : '' }}{{ row.qty }} {{ row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="relatedOrder" label="关联单号" width="140" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="remark" label="备注" min-width="160" />
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="手动录入记录" width="480px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="入库" value="in" />
            <el-option label="出库" value="out" />
            <el-option label="盘点调整" value="adjust" />
          </el-select>
        </el-form-item>
        <el-form-item label="药品">
          <el-select v-model="formData.sku" filterable placeholder="选择药品" style="width: 100%">
            <el-option v-for="p in inventoryList" :key="p.sku" :label="`${p.name} (${p.spec})`" :value="p.sku" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量"><el-input-number v-model="formData.qty" :min="1" style="width: 100%" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="formData.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; ElMessage.success('记录已录入')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { inventoryRecords, inventoryList } from '@/mock/mockInventory'

const tableData = ref([...inventoryRecords])
const dialogVisible = ref(false)
const filters = reactive({ type: '', name: '', dateRange: [] })
const formData = reactive({ type: 'in', sku: '', qty: 1, remark: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.type && item.type !== filters.type) return false
    if (filters.name && !item.name.includes(filters.name)) return false
    return true
  })
})
</script>

<style scoped>
.table-header { display: flex; justify-content: flex-end; }
</style>
