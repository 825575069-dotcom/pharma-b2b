<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">评论管理</div></div>
    <div class="filter-bar">
      <el-form :inline="true" :model="filters">
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" value="normal" />
            <el-option label="被举报" value="reported" />
            <el-option label="已拉黑" value="blocked" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table :data="filteredData" style="width: 100%;">
        <el-table-column prop="user" label="评论用户" width="140" />
        <el-table-column prop="videoTitle" label="视频标题" min-width="200" />
        <el-table-column prop="content" label="评论内容" min-width="250" />
        <el-table-column prop="time" label="评论时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'normal' ? 'success' : row.status === 'reported' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'normal' ? '正常' : row.status === 'reported' ? '被举报' : '已拉黑' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="置顶" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.isTop" @change="handleTopChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleReply(row)">回复</el-button>
            <el-button v-if="row.status !== 'blocked'" type="warning" link size="small" @click="handleBlock(row)">拉黑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { comments } from '@/mock/mockVideos'

const tableData = ref([...comments])
const filters = reactive({ status: '' })

const filteredData = computed(() => {
  return tableData.value.filter(item => !filters.status || item.status === filters.status)
})

const handleTopChange = (row) => ElMessage.success(`「${row.content.slice(0, 10)}...」${row.isTop ? '已置顶' : '已取消置顶'}`)
const handleReply = (row) => ElMessage.info(`回复「${row.user}」的评论`)
const handleBlock = (row) => {
  ElMessageBox.confirm(`确认拉黑用户「${row.user}」吗？`, '提示', { type: 'warning' }).then(() => {
    row.status = 'blocked'
    ElMessage.success('已拉黑')
  }).catch(() => {})
}
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该评论吗？', '提示', { type: 'warning' }).then(() => {
    tableData.value = tableData.value.filter(i => i.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>
