<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">订单总览</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="订单号">
          <el-input v-model="filters.id" placeholder="请输入订单号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="filters.customer" placeholder="请输入客户名" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部类型" clearable style="width: 130px">
            <el-option v-for="t in orderTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option v-for="s in orderStatus" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button @click="ElMessage.success('导出成功')">导出报表</el-button>
        </div>
      </div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;" @row-click="handleRowClick">
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }"><el-tag size="small" :type="row.type === 'normal' ? '' : row.type === 'points' ? 'warning' : row.type === 'after_sale' ? 'danger' : 'info'">{{ row.typeName }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="customer" label="客户" min-width="140" />
        <el-table-column prop="salesman" label="业务员" width="100" />
        <el-table-column label="金额" width="100" align="right">
          <template #default="{ row }">
            <span v-if="row.amount > 0">¥{{ row.amount.toLocaleString() }}</span>
            <span v-else style="color: #F59E0B;">{{ row.pointsCost }}积分</span>
          </template>
        </el-table-column>
        <el-table-column prop="items" label="商品数" width="80" align="center" />
        <el-table-column prop="createTime" label="下单时间" width="140" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="orderStatusType(row.status)" size="small">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click.stop="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 订单详情抽屉 -->
    <el-drawer v-model="detailVisible" title="订单详情" size="640px" direction="rtl">
      <template v-if="currentOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="订单类型">{{ currentOrder.typeName }}</el-descriptions-item>
          <el-descriptions-item label="订单状态"><el-tag size="small" :type="orderStatusType(currentOrder.status)">{{ currentOrder.statusName }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ currentOrder.createTime }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ currentOrder.customer }}</el-descriptions-item>
          <el-descriptions-item label="业务员">{{ currentOrder.salesman }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payMethod || '-' }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ currentOrder.payTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物流信息" :span="2">{{ currentOrder.logistics || '-' }}</el-descriptions-item>
        </el-descriptions>
        
        <div style="margin-top: 20px;">
          <div style="font-weight: 600; margin-bottom: 12px;">商品明细</div>
          <el-table :data="orderItemsData" style="width: 100%;">
            <el-table-column prop="product" label="商品" min-width="160" />
            <el-table-column prop="spec" label="规格" width="140" />
            <el-table-column label="单价" width="80" align="right">
              <template #default="{ row }">{{ row.price > 0 ? '¥' + row.price : row.pointsCost + '积分' }}</template>
            </el-table-column>
            <el-table-column prop="qty" label="数量" width="80" align="right" />
            <el-table-column label="小计" width="100" align="right">
              <template #default="{ row }">¥{{ row.total.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </div>

        <div style="margin-top: 20px;">
          <div style="font-weight: 600; margin-bottom: 12px;">操作日志</div>
          <el-timeline>
            <el-timeline-item timestamp="2026-07-12 10:30" type="primary">订单创建</el-timeline-item>
            <el-timeline-item v-if="currentOrder.payTime" :timestamp="currentOrder.payTime" type="success">买家付款</el-timeline-item>
            <el-timeline-item v-if="currentOrder.shipTime" :timestamp="currentOrder.shipTime" type="primary">商家发货</el-timeline-item>
            <el-timeline-item v-if="currentOrder.completeTime" :timestamp="currentOrder.completeTime" type="success">交易完成</el-timeline-item>
            <el-timeline-item v-if="currentOrder.cancelTime" :timestamp="currentOrder.cancelTime" type="info">订单取消：{{ currentOrder.cancelReason }}</el-timeline-item>
          </el-timeline>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { orders, orderTypes, orderStatus, orderItems } from '@/mock/mockOrders'

const tableData = ref([...orders])
const detailVisible = ref(false)
const currentOrder = ref(null)
const filters = reactive({ id: '', customer: '', type: '', status: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.id && !item.id.includes(filters.id)) return false
    if (filters.customer && !item.customer.includes(filters.customer)) return false
    if (filters.type && item.type !== filters.type) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const orderStatusType = (s) => {
  const map = { pending: 'warning', paid: '', shipped: '', completed: 'success', after_sale: 'danger', cancelled: 'info' }
  return map[s] || ''
}

const orderItemsData = computed(() => currentOrder.value ? orderItems.filter(i => i.orderId === currentOrder.value.id) : [])

const handleRowClick = (row) => handleDetail(row)
const handleDetail = (row) => { currentOrder.value = row; detailVisible.value = true }
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
