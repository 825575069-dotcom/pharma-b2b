<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">业务员档案</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="姓名"><el-input v-model="filters.name" placeholder="请输入姓名" clearable style="width: 160px" /></el-form-item>
        <el-form-item label="区域"><el-input v-model="filters.area" placeholder="请输入区域" clearable style="width: 140px" /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增业务员</el-button>
          <el-button @click="ElMessage.success('导出成功')">导出</el-button>
        </div>
      </div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="工号" width="80" />
        <el-table-column label="姓名" width="100">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 8px;">
              <el-avatar :size="28" :src="row.avatar" />
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="130" />
        <el-table-column prop="area" label="负责区域" width="140" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }"><el-tag size="small">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="customerCount" label="客户数" width="80" align="center" />
        <el-table-column label="本月业绩" width="120" align="right">
          <template #default="{ row }">¥{{ row.monthSales.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="本月提成" width="100" align="right">
          <template #default="{ row }">¥{{ row.monthCommission.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="joinDate" label="入职日期" width="120" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '在职' : '离职' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link size="small" @click="handleViewDetail(row)">业绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer v-model="drawerVisible" :title="editingRow ? '编辑业务员' : '新增业务员'" size="480px" direction="rtl">
      <el-form :model="formData" label-width="90px">
        <el-form-item label="姓名"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="formData.phone" /></el-form-item>
        <el-form-item label="负责区域"><el-input v-model="formData.area" /></el-form-item>
        <el-form-item label="级别">
          <el-select v-model="formData.level" style="width: 100%">
            <el-option label="高级业务员" value="高级业务员" />
            <el-option label="中级业务员" value="中级业务员" />
            <el-option label="初级业务员" value="初级业务员" />
            <el-option label="实习业务员" value="实习业务员" />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="formData.joinDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="drawerVisible = false; ElMessage.success('保存成功')">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { salesmen } from '@/mock/mockSalesmen'

const tableData = ref([...salesmen])
const drawerVisible = ref(false)
const editingRow = ref(null)
const filters = reactive({ name: '', area: '', status: '' })
const formData = reactive({ name: '', phone: '', area: '', level: '', joinDate: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.name && !item.name.includes(filters.name)) return false
    if (filters.area && !item.area.includes(filters.area)) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const handleAdd = () => {
  editingRow.value = null
  Object.keys(formData).forEach(k => formData[k] = '')
  drawerVisible.value = true
}
const handleEdit = (row) => {
  editingRow.value = row
  Object.assign(formData, { name: row.name, phone: row.phone, area: row.area, level: row.level, joinDate: row.joinDate })
  drawerVisible.value = true
}
const handleViewDetail = (row) => ElMessage.info(`查看「${row.name}」业绩详情`)
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
