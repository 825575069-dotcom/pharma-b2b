<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">客户分配管理</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="客户"><el-input v-model="filters.customer" placeholder="搜索客户" clearable style="width: 160px" /></el-form-item>
        <el-form-item label="业务员">
          <el-select v-model="filters.salesman" placeholder="全部" clearable style="width: 140px">
            <el-option v-for="s in salesmen" :key="s.id" :label="s.name" :value="s.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="已分配" value="active" />
            <el-option label="未分配" value="unassigned" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button type="primary" @click="handleBatchAssign" :disabled="!selectedRows.length"><el-icon><Connection /></el-icon> 批量分配</el-button>
          <el-button @click="handleBatchTransfer" :disabled="!selectedRows.length">批量转移</el-button>
        </div>
      </div>
      <el-table :data="filteredData" @selection-change="handleSelectionChange" style="width: 100%; margin-top: 16px;">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="customer" label="客户名称" min-width="160" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="area" label="区域" width="100" />
        <el-table-column label="分配状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'warning'" size="small">{{ row.status === 'active' ? '已分配' : '未分配' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="salesman" label="当前业务员" width="100">
          <template #default="{ row }">{{ row.salesman || '-' }}</template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" width="80" align="center" />
        <el-table-column label="本月金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.monthAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAssign(row)">{{ row.salesman ? '转移' : '分配' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="assignVisible" :title="assignTitle" width="440px">
      <el-form label-width="100px">
        <el-form-item label="客户">
          <span>{{ assignCustomers }}</span>
        </el-form-item>
        <el-form-item label="分配业务员">
          <el-select v-model="selectedSalesman" placeholder="请选择业务员" style="width: 100%">
            <el-option v-for="s in salesmen" :key="s.id" :label="`${s.name}（${s.area}）`" :value="s.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { customerAssignments } from '@/mock/mockSalesmen'
import { salesmen } from '@/mock/mockSalesmen'

const tableData = ref([...customerAssignments])
const selectedRows = ref([])
const assignVisible = ref(false)
const selectedSalesman = ref('')
const isBatch = ref(false)
const filters = reactive({ customer: '', salesman: '', status: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.customer && !item.customer.includes(filters.customer)) return false
    if (filters.salesman && item.salesman !== filters.salesman) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const assignTitle = computed(() => isBatch.value ? '批量分配客户' : '分配客户')
const assignCustomers = computed(() => {
  if (isBatch.value) return selectedRows.value.map(r => r.customer).join('、')
  return selectedRows.value[0]?.customer || ''
})

const handleSelectionChange = (val) => { selectedRows.value = val }
const handleAssign = (row) => {
  isBatch.value = false
  selectedRows.value = [row]
  selectedSalesman.value = ''
  assignVisible.value = true
}
const handleBatchAssign = () => {
  isBatch.value = true
  selectedSalesman.value = ''
  assignVisible.value = true
}
const handleBatchTransfer = () => {
  isBatch.value = true
  selectedSalesman.value = ''
  assignVisible.value = true
}
const handleConfirmAssign = () => {
  if (!selectedSalesman.value) { ElMessage.warning('请选择业务员'); return }
  const salesman = salesmen.find(s => s.id === selectedSalesman.value)
  selectedRows.value.forEach(r => { r.salesman = salesman.name; r.salesmanId = salesman.id; r.status = 'active' })
  assignVisible.value = false
  ElMessage.success(`已成功分配 ${selectedRows.value.length} 个客户给${salesman.name}`)
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
