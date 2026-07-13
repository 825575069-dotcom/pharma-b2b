<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">积分商城管理</div></div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="积分商品" name="products">
        <div class="table-container">
          <div class="table-header">
            <el-button type="primary" @click="drawerVisible = true"><el-icon><Plus /></el-icon> 新增积分商品</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%; margin-top: 16px;">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column label="图片" width="80">
              <template #default="{ row }">
                <el-image :src="row.image" fit="cover" style="width: 40px; height: 40px; border-radius: 4px;" :preview-src-list="[row.image]" preview-teleported />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="180" />
            <el-table-column prop="points" label="所需积分" width="100" align="right" />
            <el-table-column prop="stock" label="库存" width="100" align="right" />
            <el-table-column prop="exchangeCount" label="已兑换" width="100" align="right" />
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small">{{ row.status === 'on' ? '上架' : '下架' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="warning" link size="small" @click="handleToggle(row)">{{ row.status === 'on' ? '下架' : '上架' }}</el-button>
                <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="积分流水" name="flow">
        <div class="table-container">
          <div class="filter-bar" style="background: transparent; padding: 0 0 16px; box-shadow: none;">
            <el-form :inline="true">
              <el-form-item label="用户">
                <el-input placeholder="搜索用户" clearable style="width: 160px" />
              </el-form-item>
              <el-form-item label="类型">
                <el-select placeholder="全部" clearable style="width: 120px">
                  <el-option label="获取" value="earn" />
                  <el-option label="消耗" value="consume" />
                  <el-option label="过期" value="expire" />
                </el-select>
              </el-form-item>
              <el-form-item><el-button type="primary">查询</el-button></el-form-item>
              <el-form-item><el-button @click="ElMessage.success('导出成功')">导出</el-button></el-form-item>
            </el-form>
          </div>
          <el-table :data="pointsFlow" style="width: 100%;">
            <el-table-column prop="id" label="流水号" width="80" />
            <el-table-column prop="user" label="用户" width="140" />
            <el-table-column label="类型" width="80">
              <template #default="{ row }">
                <el-tag :type="row.type === 'earn' ? 'success' : row.type === 'consume' ? 'warning' : 'info'" size="small">
                  {{ row.type === 'earn' ? '获取' : row.type === 'consume' ? '消耗' : '过期' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="140" />
            <el-table-column label="积分变化" width="100" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.points > 0 ? '#10B981' : '#EF4444' }">{{ row.points > 0 ? '+' : '' }}{{ row.points }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="balance" label="剩余积分" width="100" align="right" />
            <el-table-column prop="time" label="时间" width="160" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-drawer v-model="drawerVisible" title="新增积分商品" size="440px" direction="rtl">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="商品名称"><el-input v-model="formData.name" /></el-form-item>
        <el-form-item label="所需积分"><el-input-number v-model="formData.points" :min="1" /></el-form-item>
        <el-form-item label="库存数量"><el-input-number v-model="formData.stock" :min="0" /></el-form-item>
        <el-form-item label="商品图片">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="drawerVisible = false; ElMessage.success('保存成功')">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pointsProducts, pointsFlow } from '@/mock/mockActivities'

const activeTab = ref('products')
const tableData = ref([...pointsProducts])
const drawerVisible = ref(false)
const formData = reactive({ name: '', points: 100, stock: 100 })

const handleEdit = (row) => ElMessage.info(`编辑「${row.name}」`)
const handleToggle = (row) => { row.status = row.status === 'on' ? 'off' : 'on'; ElMessage.success(row.status === 'on' ? '已上架' : '已下架') }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    tableData.value = tableData.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
</style>
