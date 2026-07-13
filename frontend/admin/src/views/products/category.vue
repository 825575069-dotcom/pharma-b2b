<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">商品分类</div>
    </div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd(null)"><el-icon><Plus /></el-icon> 新增分类</el-button>
      </div>
      <el-table :data="tableData" row-key="id" default-expand-all style="width: 100%; margin-top: 16px;">
        <el-table-column prop="name" label="分类名称" min-width="200" />
        <el-table-column label="子分类数" width="120">
          <template #default="{ row }">{{ row.children?.length || 0 }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdd(row)">新增子分类</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingRow ? '编辑分类' : '新增分类'" width="420px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item v-if="parentName" label="上级分类">
          <el-input :model-value="parentName" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; ElMessage.success('保存成功')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productCategories } from '@/mock/mockProducts'

const tableData = ref([...productCategories])
const dialogVisible = ref(false)
const editingRow = ref(null)
const parentName = ref('')
const formData = reactive({ name: '' })

const handleAdd = (parent) => {
  editingRow.value = null
  parentName.value = parent?.name || ''
  formData.name = ''
  dialogVisible.value = true
}
const handleEdit = (row) => {
  editingRow.value = row
  parentName.value = ''
  formData.name = row.name
  dialogVisible.value = true
}
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除分类「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; align-items: center; }
</style>
