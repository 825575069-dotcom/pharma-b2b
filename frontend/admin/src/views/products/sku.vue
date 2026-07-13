<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">药品SKU管理</div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="药品名称">
          <el-input v-model="filters.name" placeholder="请输入药品名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="全部分类" clearable style="width: 160px">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="filters.brand" placeholder="全部品牌" clearable style="width: 140px">
            <el-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="已上架" value="on" />
            <el-option label="已下架" value="off" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon> 新增药品</el-button>
          <el-button @click="handleBatchShelf('on')">批量上架</el-button>
          <el-button @click="handleBatchShelf('off')">批量下架</el-button>
          <el-button @click="handleExport">导出报表</el-button>
        </div>
      </div>
      <el-table :data="filteredData" @selection-change="handleSelectionChange" style="width: 100%; margin-top: 16px;">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="SKU编号" width="140" />
        <el-table-column label="图片" width="80">
          <template #default="{ row }">
            <el-image :src="row.image" fit="cover" style="width: 40px; height: 40px; border-radius: 4px;" :preview-src-list="[row.image]" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="药品名称" min-width="140" />
        <el-table-column prop="spec" label="规格" width="140" />
        <el-table-column prop="factory" label="厂家" width="100" />
        <el-table-column prop="approval" label="批准文号" width="160" />
        <el-table-column prop="category" label="分类" width="140" />
        <el-table-column prop="price" label="价格" width="80" align="right">
          <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="库存状态" width="100">
          <template #default="{ row }">
            <el-tag :type="stockType(row.stockStatus)" size="small">{{ stockText(row.stockStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上下架" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="on" inactive-value="off" @change="handleStatusChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredData.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 新增/编辑抽屉 -->
    <el-drawer v-model="drawerVisible" :title="editingRow ? '编辑药品' : '新增药品'" size="500px" direction="rtl">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入药品名称" />
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="formData.spec" placeholder="如：0.25g*24粒/盒" />
        </el-form-item>
        <el-form-item label="生产厂家" prop="factory">
          <el-input v-model="formData.factory" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="批准文号" prop="approval">
          <el-input v-model="formData.approval" placeholder="请输入批准文号" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-cascader v-model="formData.categoryArr" :options="categoryOptions" placeholder="请选择分类" style="width: 100%" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="formData.brand" placeholder="请选择品牌" style="width: 100%">
            <el-option v-for="b in brands" :key="b.id" :label="b.name" :value="b.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存阈值" prop="threshold">
          <el-input-number v-model="formData.threshold" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="药品图片">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { products, productCategories, productBrands } from '@/mock/mockProducts'

const categories = productCategories
const brands = productBrands
const tableData = ref([...products])
const selectedRows = ref([])
const drawerVisible = ref(false)
const editingRow = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

const filters = reactive({ name: '', category: '', brand: '', status: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.name && !item.name.includes(filters.name)) return false
    if (filters.category && !item.category.includes(filters.category)) return false
    if (filters.brand && item.brand !== filters.brand) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const categoryOptions = categories.map(c => ({
  value: c.name,
  label: c.name,
  children: c.children?.map(ch => ({ value: ch.name, label: ch.name })) || [],
}))

const formData = reactive({ name: '', spec: '', factory: '', approval: '', categoryArr: [], brand: '', price: 0, stock: 0, threshold: 500 })
const formRules = {
  name: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
  spec: [{ required: true, message: '请输入规格', trigger: 'blur' }],
  factory: [{ required: true, message: '请输入生产厂家', trigger: 'blur' }],
  approval: [{ required: true, message: '请输入批准文号', trigger: 'blur' }],
  brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
}

const stockType = (s) => s === 'normal' ? 'success' : s === 'warning' ? 'warning' : 'danger'
const stockText = (s) => s === 'normal' ? '正常' : s === 'warning' ? '预警' : '缺货'

const handleSearch = () => {}
const handleReset = () => { Object.keys(filters).forEach(k => filters[k] = '') }
const handleSelectionChange = (val) => { selectedRows.value = val }

const handleAdd = () => {
  editingRow.value = null
  Object.keys(formData).forEach(k => { formData[k] = k === 'price' || k === 'stock' || k === 'threshold' ? 0 : (k === 'categoryArr' ? [] : '') })
  drawerVisible.value = true
}

const handleEdit = (row) => {
  editingRow.value = row
  Object.assign(formData, { name: row.name, spec: row.spec, factory: row.factory, approval: row.approval, brand: row.brand, price: row.price, stock: row.stock, threshold: 500, categoryArr: row.category.split('/') })
  drawerVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除药品「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    tableData.value = tableData.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleStatusChange = (row) => {
  ElMessage.success(`「${row.name}」已${row.status === 'on' ? '上架' : '下架'}`)
}

const handleBatchShelf = (status) => {
  if (!selectedRows.value.length) { ElMessage.warning('请先选择药品'); return }
  selectedRows.value.forEach(r => r.status = status)
  ElMessage.success(`已批量${status === 'on' ? '上架' : '下架'} ${selectedRows.value.length} 个药品`)
}

const handleExport = () => { ElMessage.success('报表导出成功（含水印）') }

const handleSubmit = () => {
  drawerVisible.value = false
  ElMessage.success(editingRow.value ? '编辑成功' : '新增成功')
}
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; align-items: center; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
