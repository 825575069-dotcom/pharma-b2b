<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">促销活动管理</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="活动名称">
          <el-input v-model="filters.name" placeholder="请输入活动名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部类型" clearable style="width: 140px">
            <el-option v-for="t in activityTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="进行中" value="active" />
            <el-option label="未开始" value="pending" />
            <el-option label="已结束" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button type="primary" @click="drawerVisible = true"><el-icon><Plus /></el-icon> 新建活动</el-button>
          <el-button @click="ElMessage.success('导出成功')">导出报表</el-button>
        </div>
      </div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="活动编号" width="130" />
        <el-table-column prop="name" label="活动名称" min-width="200" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.typeName }}</el-tag></template>
        </el-table-column>
        <el-table-column label="周期" width="180">
          <template #default="{ row }">{{ row.start }} ~ {{ row.end }}</template>
        </el-table-column>
        <el-table-column prop="target" label="客户范围" width="100" />
        <el-table-column prop="participants" label="参与人数" width="100" align="right" />
        <el-table-column label="成交总额" width="120" align="right">
          <template #default="{ row }">¥{{ row.totalAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="优惠成本" width="100" align="right">
          <template #default="{ row }">¥{{ row.discountCost.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="ROI" width="70" align="right">
          <template #default="{ row }">{{ row.roi || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">
              {{ row.status === 'active' ? '进行中' : row.status === 'pending' ? '未开始' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link size="small" @click="handleReport(row)">报表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" title="新建活动" size="520px" direction="rtl">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="活动名称"><el-input v-model="formData.name" placeholder="请输入活动名称" /></el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%">
            <el-option v-for="t in activityTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动周期">
          <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
        </el-form-item>
        <el-form-item label="参与商品">
          <el-select v-model="formData.products" multiple filterable placeholder="请选择商品" style="width: 100%">
            <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户范围">
          <el-select v-model="formData.target" placeholder="请选择" style="width: 100%">
            <el-option label="全部客户" value="全部客户" />
            <el-option label="VIP客户" value="VIP客户" />
            <el-option label="新客户" value="新客户" />
          </el-select>
        </el-form-item>
        <el-form-item label="限购数量"><el-input-number v-model="formData.limit" :min="0" /></el-form-item>
        <el-form-item label="活动库存"><el-input-number v-model="formData.stock" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="drawerVisible = false; ElMessage.success('活动创建成功')">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { activities, activityTypes } from '@/mock/mockActivities'
import { products } from '@/mock/mockProducts'

const tableData = ref([...activities])
const drawerVisible = ref(false)
const filters = reactive({ name: '', type: '', status: '' })
const formData = reactive({ name: '', type: '', dateRange: [], products: [], target: '', limit: 0, stock: 0 })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.name && !item.name.includes(filters.name)) return false
    if (filters.type && item.type !== filters.type) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const handleEdit = (row) => ElMessage.info(`编辑「${row.name}」`)
const handleReport = (row) => ElMessage.info(`查看「${row.name}」数据报表`)
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
