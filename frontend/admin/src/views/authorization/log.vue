<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">授权日志</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="操作类型">
          <el-select v-model="filters.action" placeholder="全部" clearable style="width: 120px">
            <el-option label="新增" value="新增" />
            <el-option label="变更" value="变更" />
            <el-option label="作废" value="作废" />
          </el-select>
        </el-form-item>
        <el-form-item label="被授权方"><el-input v-model="filters.party" placeholder="搜索" clearable style="width: 160px" /></el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="filteredData" style="width: 100%;">
        <el-table-column prop="id" label="日志编号" width="80" />
        <el-table-column label="操作类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.action === '新增' ? 'success' : row.action === '变更' ? 'warning' : 'danger'" size="small">{{ row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authorizedParty" label="被授权方" min-width="160" />
        <el-table-column prop="detail" label="操作详情" min-width="280" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="time" label="操作时间" width="160" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { authorizationLogs } from '@/mock/mockUsers'

const tableData = ref([...authorizationLogs])
const filters = reactive({ action: '', party: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.action && item.action !== filters.action) return false
    if (filters.party && !item.authorizedParty.includes(filters.party)) return false
    return true
  })
})
</script>
