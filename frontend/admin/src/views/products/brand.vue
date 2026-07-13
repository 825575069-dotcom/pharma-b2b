<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">品牌管理</div></div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 新增品牌</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="品牌名称" min-width="200" />
        <el-table-column prop="count" label="关联商品数" width="120" align="center" />
        <el-table-column label="Logo" width="100">
          <template #default>
            <el-avatar :size="36" shape="square">Logo</el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="新增品牌" width="420px">
      <el-form :model="formData" label-width="80px">
        <el-form-item label="品牌名称"><el-input v-model="formData.name" placeholder="请输入品牌名称" /></el-form-item>
        <el-form-item label="品牌Logo">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
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
import { productBrands } from '@/mock/mockProducts'

const tableData = ref([...productBrands])
const dialogVisible = ref(false)
const formData = reactive({ name: '' })
const handleEdit = (row) => { formData.name = row.name; dialogVisible.value = true }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除品牌「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')).catch(() => {})
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; align-items: center; }
</style>
