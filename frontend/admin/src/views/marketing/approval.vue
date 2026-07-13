<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">定向优惠审批</div></div>
    <div class="table-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待审批" name="pending">
          <el-table :data="pendingList" style="width: 100%;">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="salesman" label="申请业务员" width="100" />
            <el-table-column prop="customer" label="客户" width="140" />
            <el-table-column prop="activityType" label="优惠类型" width="100" />
            <el-table-column prop="description" label="优惠描述" min-width="200" />
            <el-table-column prop="products" label="参与商品" min-width="180" />
            <el-table-column prop="applyTime" label="申请时间" width="140" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleAudit(row)">审批</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已通过" name="approved">
          <el-table :data="approvedList" style="width: 100%;">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column prop="customer" label="客户" width="140" />
            <el-table-column prop="description" label="优惠描述" min-width="200" />
            <el-table-column prop="approver" label="审批人" width="100" />
            <el-table-column prop="approveTime" label="审批时间" width="140" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已驳回" name="rejected">
          <el-table :data="rejectedList" style="width: 100%;">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="salesman" label="业务员" width="100" />
            <el-table-column prop="customer" label="客户" width="140" />
            <el-table-column prop="description" label="优惠描述" min-width="200" />
            <el-table-column prop="rejectReason" label="驳回原因" min-width="200" />
            <el-table-column prop="approveTime" label="审批时间" width="140" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog v-model="auditVisible" title="定向优惠审批" width="500px">
      <el-descriptions :column="1" border v-if="currentItem">
        <el-descriptions-item label="申请业务员">{{ currentItem.salesman }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentItem.customer }}</el-descriptions-item>
        <el-descriptions-item label="优惠类型">{{ currentItem.activityType }}</el-descriptions-item>
        <el-descriptions-item label="优惠描述">{{ currentItem.description }}</el-descriptions-item>
        <el-descriptions-item label="参与商品">{{ currentItem.products }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentItem.applyTime }}</el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 20px;">
        <el-input v-model="auditOpinion" type="textarea" :rows="3" placeholder="审批意见（驳回时必填）" />
      </div>
      <template #footer>
        <el-button @click="auditVisible = false">取消</el-button>
        <el-button type="danger" @click="handleReject">驳回</el-button>
        <el-button type="primary" @click="handleApprove">通过</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { approvalList } from '@/mock/mockActivities'

const activeTab = ref('pending')
const auditVisible = ref(false)
const currentItem = ref(null)
const auditOpinion = ref('')

const pendingList = computed(() => approvalList.filter(i => i.status === 'pending'))
const approvedList = computed(() => approvalList.filter(i => i.status === 'approved'))
const rejectedList = computed(() => approvalList.filter(i => i.status === 'rejected'))

const handleAudit = (row) => { currentItem.value = row; auditOpinion.value = ''; auditVisible.value = true }
const handleApprove = () => { currentItem.value.status = 'approved'; auditVisible.value = false; ElMessage.success('审批通过') }
const handleReject = () => {
  if (!auditOpinion.value) { ElMessage.warning('请填写驳回原因'); return }
  currentItem.value.status = 'rejected'
  currentItem.value.rejectReason = auditOpinion.value
  auditVisible.value = false
  ElMessage.success('已驳回')
}
</script>
