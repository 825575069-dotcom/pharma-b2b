<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">对公对账</div></div>
    <div class="table-container">
      <div class="table-header">
        <el-button @click="ElMessage.success('导出成功')">导出报表</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="对账编号" width="80" />
        <el-table-column prop="orderId" label="订单号" width="140" />
        <el-table-column prop="customer" label="客户" min-width="140" />
        <el-table-column label="订单金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.orderAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="到账金额" width="120" align="right">
          <template #default="{ row }">¥{{ row.receivedAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="差异" width="100" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.difference < 0 ? '#EF4444' : row.difference > 0 ? '#10B981' : '#9CA3AF' }">
              {{ row.difference !== 0 ? '¥' + row.difference.toFixed(2) : '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="diffDesc" label="差异说明" min-width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'matched' ? 'success' : row.status === 'diff' ? 'danger' : 'warning'" size="small">
              {{ row.status === 'matched' ? '已平账' : row.status === 'diff' ? '有差异' : '待处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.auditStatus" :type="row.auditStatus === 'approved' ? 'success' : 'warning'" size="small">
              {{ row.auditStatus === 'approved' ? '已审核' : '待审核' }}
            </el-tag>
            <span v-else style="color: #9CA3AF;">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'diff' || row.status === 'pending'" type="primary" link size="small" @click="handleRegister(row)">登记差异</el-button>
            <el-button v-else type="info" link size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="差异登记" width="480px">
      <el-descriptions :column="1" border v-if="currentItem">
        <el-descriptions-item label="订单号">{{ currentItem.orderId }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentItem.customer }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ currentItem.orderAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="到账金额">¥{{ currentItem.receivedAmount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="差异金额">¥{{ currentItem.difference?.toFixed(2) }}</el-descriptions-item>
      </el-descriptions>
      <el-form style="margin-top: 16px;" label-width="80px">
        <el-form-item label="差异说明">
          <el-input v-model="diffDesc" type="textarea" :rows="2" placeholder="请描述差异原因" />
        </el-form-item>
        <el-form-item label="上传凭证">
          <el-upload action="#" :auto-upload="false" :limit="3">
            <el-button><el-icon><Upload /></el-icon> 选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; ElMessage.success('差异已登记，等待审核')">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { reconciliationList } from '@/mock/mockFinance'

const tableData = ref([...reconciliationList])
const dialogVisible = ref(false)
const currentItem = ref(null)
const diffDesc = ref('')

const handleRegister = (row) => { currentItem.value = row; diffDesc.value = row.diffDesc || ''; dialogVisible.value = true }
const handleView = (row) => ElMessage.info(`查看对账单 ${row.id}`)
</script>

<style scoped>
.table-header { display: flex; justify-content: flex-end; }
</style>
