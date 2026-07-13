<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">缺货订阅</div></div>
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="product" label="药品名称" min-width="160" />
        <el-table-column prop="sku" label="SKU编号" width="140" />
        <el-table-column prop="subscribers" label="订阅人数" width="100" align="center" />
        <el-table-column prop="notifyType" label="通知方式" width="140" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'waiting' ? 'warning' : 'success'" size="small">
              {{ row.status === 'waiting' ? '等待通知' : '已通知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button v-if="row.status === 'waiting'" type="primary" link size="small" @click="handleNotify(row)">通知</el-button>
            <el-button type="info" link size="small" @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { subscriptions } from '@/mock/mockProducts'

const tableData = ref([...subscriptions])
const handleNotify = (row) => { ElMessage.success(`已通知 ${row.subscribers} 位订阅用户`) }
const handleView = (row) => { ElMessage.info(`查看「${row.product}」订阅详情`) }
</script>
