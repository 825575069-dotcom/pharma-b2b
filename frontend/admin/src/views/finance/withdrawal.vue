<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">业务员提现审核</div></div>
    <div class="table-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待审核" name="pending">
          <el-table :data="pendingList" style="width: 100%;">
            <el-table-column prop="id" label="单号" width="80" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column prop="bank" label="开户银行" width="140" />
            <el-table-column prop="account" label="账号" width="140" />
            <el-table-column label="提现金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="账户余额" width="120" align="right">
              <template #default="{ row }">¥{{ row.balance.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="commissionDetail" label="提现说明" min-width="140" />
            <el-table-column prop="applyTime" label="申请时间" width="140" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleAudit(row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已通过" name="approved">
          <el-table :data="approvedList" style="width: 100%;">
            <el-table-column prop="id" label="单号" width="80" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column label="提现金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="approver" label="审核人" width="100" />
            <el-table-column prop="approveTime" label="审核时间" width="140" />
            <el-table-column prop="payTime" label="打款时间" width="140" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已驳回" name="rejected">
          <el-table :data="rejectedList" style="width: 100%;">
            <el-table-column prop="id" label="单号" width="80" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column label="提现金额" width="120" align="right">
              <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="rejectReason" label="驳回原因" min-width="200" />
            <el-table-column prop="approveTime" label="审核时间" width="140" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="auditVisible" title="提现审核" width="480px">
      <el-descriptions :column="1" border v-if="currentItem">
        <el-descriptions-item label="业务员">{{ currentItem.salesman }}</el-descriptions-item>
        <el-descriptions-item label="开户银行">{{ currentItem.bank }}</el-descriptions-item>
        <el-descriptions-item label="银行账号">{{ currentItem.account }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">¥{{ currentItem.amount?.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">¥{{ currentItem.balance?.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="提现说明">{{ currentItem.commissionDetail }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentItem.applyTime }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px;">
        <el-input v-model="rejectReason" type="textarea" :rows="2" placeholder="驳回原因（驳回时必填）" />
      </div>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
        <el-button type="primary" @click="handleApprove">通过并打款</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { withdrawalList } from '@/mock/mockFinance'

const activeTab = ref('pending')
const auditVisible = ref(false)
const currentItem = ref(null)
const rejectReason = ref('')

const pendingList = computed(() => withdrawalList.filter(i => i.status === 'pending'))
const approvedList = computed(() => withdrawalList.filter(i => i.status === 'approved'))
const rejectedList = computed(() => withdrawalList.filter(i => i.status === 'rejected'))

const handleAudit = (row) => { currentItem.value = row; rejectReason.value = ''; auditVisible.value = true }
const handleApprove = () => { currentItem.value.status = 'approved'; auditVisible.value = false; ElMessage.success('已通过并打款') }
const handleReject = () => {
  if (!rejectReason.value) { ElMessage.warning('请填写驳回原因'); return }
  currentItem.value.status = 'rejected'
  currentItem.value.rejectReason = rejectReason.value
  auditVisible.value = false
  ElMessage.success('已驳回')
}
</script>
