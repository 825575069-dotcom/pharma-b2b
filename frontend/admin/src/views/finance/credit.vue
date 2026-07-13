<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">账期管理</div></div>
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="8"><div class="stat-card"><div class="stat-label">总授信额度</div><div class="stat-value num-font">¥{{ totalCredit.toLocaleString() }}</div></div></el-col>
      <el-col :span="8"><div class="stat-card"><div class="stat-label">已用额度</div><div class="stat-value num-font" style="color: #F59E0B;">¥{{ usedCredit.toLocaleString() }}</div></div></el-col>
      <el-col :span="8"><div class="stat-card"><div class="stat-label">逾期金额</div><div class="stat-value num-font" style="color: #EF4444;">¥{{ overdueAmount.toLocaleString() }}</div></div></el-col>
    </el-row>
    <div class="table-container">
      <div class="table-header"><el-button @click="dialogVisible = true"><el-icon><Plus /></el-icon> 回款登记</el-button></div>
      <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="customer" label="客户" min-width="160" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column label="授信额度" width="120" align="right">
          <template #default="{ row }">¥{{ row.totalCredit.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="已用额度" width="120" align="right">
          <template #default="{ row }">¥{{ row.usedCredit.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="可用额度" width="120" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.availableCredit < 0 ? '#EF4444' : '#10B981' }">¥{{ row.availableCredit.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creditPeriod" label="账期(天)" width="90" align="center" />
        <el-table-column label="逾期金额" width="120" align="right">
          <template #default="{ row }">
            <span :style="{ color: row.overdueAmount > 0 ? '#EF4444' : '#9CA3AF' }">{{ row.overdueAmount > 0 ? '¥' + row.overdueAmount.toLocaleString() : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'warning' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : row.status === 'warning' ? '预警' : '逾期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRepay(row)">回款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="回款登记" width="440px">
      <el-form label-width="80px">
        <el-form-item label="客户">
          <el-select v-model="repayForm.customer" placeholder="请选择客户" style="width: 100%">
            <el-option v-for="c in tableData" :key="c.id" :label="c.customer" :value="c.customer" />
          </el-select>
        </el-form-item>
        <el-form-item label="回款金额"><el-input-number v-model="repayForm.amount" :min="0" style="width: 100%" /></el-form-item>
        <el-form-item label="收款方式">
          <el-select v-model="repayForm.method" style="width: 100%">
            <el-option label="对公转账" value="对公转账" />
            <el-option label="微信支付" value="微信支付" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="repayForm.remark" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; ElMessage.success('回款登记成功')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { creditList } from '@/mock/mockFinance'

const tableData = ref([...creditList])
const dialogVisible = ref(false)
const repayForm = reactive({ customer: '', amount: 0, method: '对公转账', remark: '' })

const totalCredit = computed(() => tableData.value.reduce((s, i) => s + i.totalCredit, 0))
const usedCredit = computed(() => tableData.value.reduce((s, i) => s + i.usedCredit, 0))
const overdueAmount = computed(() => tableData.value.reduce((s, i) => s + i.overdueAmount, 0))

const handleRepay = (row) => { repayForm.customer = row.customer; repayForm.amount = row.overdueAmount || 0; dialogVisible.value = true }
</script>

<style scoped>
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #6B7280; margin-bottom: 8px; }
.stat-value { font-size: 24px; font-weight: 600; color: #1F2937; }
.table-header { display: flex; justify-content: flex-end; }
</style>
