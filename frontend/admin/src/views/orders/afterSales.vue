<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">售后处理</div></div>
    <div class="table-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待处理" name="pending">
          <el-table :data="pendingList" style="width: 100%;">
            <el-table-column prop="id" label="售后单号" width="80" />
            <el-table-column prop="orderId" label="订单号" width="140" />
            <el-table-column prop="customer" label="客户" min-width="140" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column prop="type" label="售后类型" width="100" />
            <el-table-column prop="reason" label="售后原因" min-width="180" />
            <el-table-column label="退款金额" width="100" align="right">
              <template #default="{ row }">¥{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间" width="140" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleProcess(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已处理" name="processed">
          <el-table :data="processedList" style="width: 100%;">
            <el-table-column prop="id" label="售后单号" width="80" />
            <el-table-column prop="orderId" label="订单号" width="140" />
            <el-table-column prop="customer" label="客户" min-width="140" />
            <el-table-column prop="type" label="类型" width="80" />
            <el-table-column prop="reason" label="原因" min-width="160" />
            <el-table-column label="金额" width="100" align="right">
              <template #default="{ row }">¥{{ row.amount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="结果" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'approved' ? 'success' : 'danger'" size="small">{{ row.status === 'approved' ? '同意' : '驳回' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="approveTime" label="处理时间" width="140" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="processVisible" title="售后处理" width="560px">
      <el-descriptions :column="1" border v-if="currentItem">
        <el-descriptions-item label="订单号">{{ currentItem.orderId }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentItem.customer }}</el-descriptions-item>
        <el-descriptions-item label="业务员">{{ currentItem.salesman }}</el-descriptions-item>
        <el-descriptions-item label="售后类型">{{ currentItem.type }}</el-descriptions-item>
        <el-descriptions-item label="退款金额">¥{{ currentItem.amount?.toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="申请原因">{{ currentItem.reason }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px;">
        <el-checkbox v-model="stockReturn">库存返还</el-checkbox>
        <el-checkbox v-model="pointsReturn">积分返还</el-checkbox>
        <el-checkbox v-model="commissionDeduct">业绩扣减</el-checkbox>
      </div>
      <div style="margin-top: 16px;">
        <el-input v-model="processRemark" type="textarea" :rows="3" placeholder="处理备注" />
      </div>
      <template #footer>
        <el-button @click="processVisible = false">取消</el-button>
        <el-button type="danger" @click="handleReject">驳回退款</el-button>
        <el-button type="primary" @click="handleApprove">同意退款</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { afterSalesList } from '@/mock/mockOrders'

const activeTab = ref('pending')
const processVisible = ref(false)
const currentItem = ref(null)
const stockReturn = ref(true)
const pointsReturn = ref(true)
const commissionDeduct = ref(true)
const processRemark = ref('')

const pendingList = computed(() => afterSalesList.filter(i => i.status === 'pending'))
const processedList = computed(() => afterSalesList.filter(i => i.status !== 'pending'))

const handleProcess = (row) => {
  currentItem.value = row
  stockReturn.value = true
  pointsReturn.value = true
  commissionDeduct.value = true
  processRemark.value = ''
  processVisible.value = true
}
const handleApprove = () => {
  currentItem.value.status = 'approved'
  currentItem.value.stockReturn = stockReturn.value
  currentItem.value.pointsReturn = pointsReturn.value
  currentItem.value.commissionDeduct = commissionDeduct.value
  processVisible.value = false
  ElMessage.success('已同意退款')
}
const handleReject = () => {
  if (!processRemark.value) { ElMessage.warning('请填写驳回原因'); return }
  currentItem.value.status = 'rejected'
  currentItem.value.rejectReason = processRemark.value
  processVisible.value = false
  ElMessage.success('已驳回退款')
}
</script>
