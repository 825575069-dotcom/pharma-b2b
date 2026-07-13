<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">消息模板管理</div></div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 新增模板</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="模板名称" width="160" />
        <el-table-column prop="type" label="通知方式" width="140" />
        <el-table-column prop="trigger" label="触发条件" width="140" />
        <el-table-column prop="content" label="模板内容" min-width="280" show-overflow-tooltip />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="编辑消息模板" width="560px">
      <el-form label-width="100px">
        <el-form-item label="模板名称"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item label="通知方式">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="站内信" value="站内信" />
            <el-option label="站内信+短信" value="站内信+短信" />
            <el-option label="站内信+推送" value="站内信+推送" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发条件"><el-input v-model="formData.trigger" /></el-form-item>
        <el-form-item label="模板内容">
          <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="使用{变量名}格式引用变量" />
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
import { messageTemplates } from '@/mock/mockUsers'

const tableData = ref([...messageTemplates])
const dialogVisible = ref(false)
const formData = reactive({ name: '', type: '站内信', trigger: '', content: '' })

const handleEdit = (row) => { Object.assign(formData, row); dialogVisible.value = true }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除模板「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    tableData.value = tableData.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
