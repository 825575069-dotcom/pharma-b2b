<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">视频管理</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="标题">
          <el-input v-model="filters.title" placeholder="请输入视频标题" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filters.category" placeholder="全部分类" clearable style="width: 140px">
            <el-option v-for="c in videoCategories" :key="c.id" :label="c.name" :value="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div>
          <el-button type="primary" @click="uploadVisible = true"><el-icon><Upload /></el-icon> 上传视频</el-button>
          <el-button @click="handleExport">导出报表</el-button>
        </div>
      </div>
      <el-table :data="filteredData" style="width: 100%; margin-top: 16px;">
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" style="width: 60px; height: 40px; border-radius: 4px;" :preview-src-list="[row.cover]" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="绑定药品" width="200">
          <template #default="{ row }">
            <el-tag v-for="p in row.bindProducts" :key="p" size="small" style="margin-right: 4px;">{{ p }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="80" />
        <el-table-column prop="views" label="播放量" width="100" align="right" />
        <el-table-column prop="likes" label="点赞" width="80" align="right" />
        <el-table-column prop="comments" label="评论" width="80" align="right" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publisher" label="发布者" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="140" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 上传视频抽屉 -->
    <el-drawer v-model="uploadVisible" title="上传视频" size="520px" direction="rtl">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="视频标题"><el-input v-model="formData.title" placeholder="请输入视频标题" /></el-form-item>
        <el-form-item label="视频分类">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in videoCategories" :key="c.id" :label="c.name" :value="c.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频文件">
          <el-upload action="#" :auto-upload="false" :limit="1">
            <el-button type="primary"><el-icon><Upload /></el-icon> 选择视频文件</el-button>
            <template #tip><div style="color: #9CA3AF; font-size: 12px;">支持 MP4、MOV 格式，最大 500MB</div></template>
          </el-upload>
        </el-form-item>
        <el-form-item label="绑定药品">
          <el-select v-model="formData.bindProducts" multiple filterable placeholder="请选择关联药品" style="width: 100%">
            <el-option v-for="p in products" :key="p.id" :label="p.name" :value="p.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="观看积分"><el-input-number v-model="formData.watchPoints" :min="0" :max="20" /></el-form-item>
        <el-form-item label="展示权重"><el-slider v-model="formData.weight" :min="0" :max="100" style="width: 100%" /></el-form-item>
        <el-form-item label="上架时间">
          <el-date-picker v-model="formData.publishTime" type="datetime" placeholder="选择上架时间" style="width: 100%" />
        </el-form-item>
        <el-form-item label="下架时间">
          <el-date-picker v-model="formData.unpublishTime" type="datetime" placeholder="选择下架时间" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">提交审核</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { videos, videoCategories } from '@/mock/mockVideos'
import { products } from '@/mock/mockProducts'

const tableData = ref([...videos])
const uploadVisible = ref(false)
const filters = reactive({ title: '', category: '', status: '' })

const formData = reactive({ title: '', category: '', bindProducts: [], watchPoints: 5, weight: 80, publishTime: '', unpublishTime: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (filters.title && !item.title.includes(filters.title)) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.status && item.status !== filters.status) return false
    return true
  })
})

const statusType = (s) => s === 'approved' ? 'success' : s === 'pending' ? 'warning' : 'danger'
const statusText = (s) => s === 'approved' ? '已通过' : s === 'pending' ? '待审核' : '已驳回'

const handleSearch = () => {}
const handleReset = () => { Object.keys(filters).forEach(k => filters[k] = '') }
const handleEdit = (row) => { ElMessage.info(`编辑「${row.title}」`) }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除视频「${row.title}」吗？`, '提示', { type: 'warning' }).then(() => {
    tableData.value = tableData.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
const handleExport = () => ElMessage.success('报表导出成功')
const handleUpload = () => { uploadVisible.value = false; ElMessage.success('视频已提交审核') }
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
.video-cover { width: 60px; height: 40px; background: #F3F4F6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 20px; }
</style>
