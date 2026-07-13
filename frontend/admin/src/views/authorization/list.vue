<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">药品流向授权列表</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="被授权方"><el-input v-model="filters.party" placeholder="搜索企业/个人" clearable style="width: 180px" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 130px">
            <el-option label="有效" value="active" />
            <el-option label="即将到期" value="expiring" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增授权</el-button>
      </div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="授权编号" width="100" />
        <el-table-column prop="authorizedParty" label="被授权方" min-width="160" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }"><el-tag size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column label="授权品类" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="cat in row.categories" :key="cat" size="small" style="margin-right: 4px; margin-bottom: 4px;">{{ cat }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'active' ? '有效' : row.status === 'expiring' ? `即将到期(${row.daysLeft}天)` : '已过期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status !== 'expired'" type="warning" link size="small" @click="handleRenew(row)">续期</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" :title="editingRow ? '编辑授权' : '新增授权'" size="480px" direction="rtl">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="授权类型">
          <el-radio-group v-model="formData.type">
            <el-radio label="企业">企业</el-radio>
            <el-radio label="个人">个人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="被授权方">
          <el-input v-model="formData.authorizedParty" :placeholder="formData.type === '企业' ? '请输入企业名称' : '请输入个人姓名'" />
        </el-form-item>
        <el-form-item label="授权品类">
          <el-checkbox-group v-model="formData.categories">
            <el-checkbox v-for="c in categories" :key="c" :label="c">{{ c }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="drawerVisible = false; ElMessage.success('授权保存成功')">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { authorizationList } from '@/mock/mockUsers'

const tableData = ref([...authorizationList])
const drawerVisible = ref(false)
const editingRow = ref(null)
const filters = reactive({ party: '', status: '' })
const categories = ['处方药', '非处方药', '中药材', '保健品', '医疗器械', '耗材']
const formData = reactive({ type: '企业', authorizedParty: '', categories: [], dateRange: [] })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.party && !item.authorizedParty.includes(filters.party)) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const handleAdd = () => {
  editingRow.value = null
  Object.assign(formData, { type: '企业', authorizedParty: '', categories: [], dateRange: [] })
  drawerVisible.value = true
}
const handleEdit = (row) => {
  editingRow.value = row
  Object.assign(formData, { type: row.type, authorizedParty: row.authorizedParty, categories: [...row.categories], dateRange: [row.startDate, row.endDate] })
  drawerVisible.value = true
}
const handleRenew = (row) => ElMessage.success(`「${row.authorizedParty}」授权续期已提交`)
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
