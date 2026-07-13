<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">第三方接口配置</div></div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 新增接口</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="接口名称" min-width="160" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ typeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="provider" label="提供商" width="120" />
        <el-table-column prop="apiUrl" label="接口地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="apiKey" label="密钥" width="120" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最近测试" width="160">
          <template #default="{ row }">
            <div>{{ row.lastTest }}</div>
            <el-tag v-if="row.testResult === 'success'" type="success" size="small">成功</el-tag>
            <el-tag v-else-if="row.testResult === 'fail'" type="danger" size="small">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link size="small" @click="handleTest(row)">测试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="接口配置" width="520px">
      <el-form label-width="90px">
        <el-form-item label="接口名称"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="物流" value="logistics" />
            <el-option label="支付" value="payment" />
            <el-option label="短信" value="sms" />
            <el-option label="存储" value="storage" />
          </el-select>
        </el-form-item>
        <el-form-item label="提供商"><el-input v-model="formData.provider" /></el-form-item>
        <el-form-item label="接口地址"><el-input v-model="formData.apiUrl" /></el-form-item>
        <el-form-item label="API密钥"><el-input v-model="formData.apiKey" show-password /></el-form-item>
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
import { ElMessage } from 'element-plus'
import { apiConfigs } from '@/mock/mockUsers'

const tableData = ref([...apiConfigs])
const dialogVisible = ref(false)
const formData = reactive({ name: '', type: 'logistics', provider: '', apiUrl: '', apiKey: '' })

const typeText = (t) => ({ logistics: '物流', payment: '支付', sms: '短信', storage: '存储' }[t] || t)
const handleEdit = (row) => { Object.assign(formData, row); dialogVisible.value = true }
const handleTest = (row) => ElMessage.success(`「${row.name}」接口测试成功`)
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
