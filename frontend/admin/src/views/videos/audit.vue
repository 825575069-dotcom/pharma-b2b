<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">视频审核</div></div>
    <div class="table-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="待审核" name="pending">
          <el-table :data="pendingList" style="width: 100%;">
            <el-table-column label="封面" width="100">
              <template #default="{ row }">
                <el-image :src="row.cover" fit="cover" style="width: 60px; height: 40px; border-radius: 4px;" :preview-src-list="[row.cover]" preview-teleported />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="duration" label="时长" width="80" />
            <el-table-column label="绑定药品" min-width="200">
              <template #default="{ row }">
                <el-tag v-for="p in row.bindProducts" :key="p" size="small" style="margin-right: 4px;">{{ p }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="publisher" label="发布者" width="100" />
            <el-table-column prop="createTime" label="提交时间" width="140" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleAudit(row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已通过" name="approved">
          <el-table :data="approvedList" style="width: 100%;">
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="views" label="播放量" width="100" align="right" />
            <el-table-column prop="createTime" label="审核时间" width="140" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已驳回" name="rejected">
          <el-table :data="rejectedList" style="width: 100%;">
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="rejectReason" label="驳回原因" min-width="200" />
            <el-table-column prop="createTime" label="提交时间" width="140" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 审核弹窗 -->
    <el-dialog v-model="auditVisible" title="视频审核" width="600px">
      <div v-if="currentVideo" class="audit-content">
        <div class="video-preview">
          <el-icon style="font-size: 48px; color: #9CA3AF;"><VideoPlay /></el-icon>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题">{{ currentVideo.title }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ currentVideo.category }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ currentVideo.duration }}</el-descriptions-item>
          <el-descriptions-item label="发布者">{{ currentVideo.publisher }}</el-descriptions-item>
          <el-descriptions-item label="绑定药品" :span="2">
            <el-tag v-for="p in currentVideo.bindProducts" :key="p" size="small" style="margin-right: 4px;">{{ p }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="观看积分">{{ currentVideo.watchPoints }}</el-descriptions-item>
          <el-descriptions-item label="展示权重">{{ currentVideo.weight }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="margin-top: 20px;">
        <el-input v-model="rejectReason" type="textarea" :rows="3" placeholder="驳回请填写理由（通过可留空）" />
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
import { videos } from '@/mock/mockVideos'

const activeTab = ref('pending')
const auditVisible = ref(false)
const currentVideo = ref(null)
const rejectReason = ref('')

const pendingList = computed(() => videos.filter(v => v.status === 'pending'))
const approvedList = computed(() => videos.filter(v => v.status === 'approved'))
const rejectedList = computed(() => videos.filter(v => v.status === 'rejected'))

const handleAudit = (row) => {
  currentVideo.value = row
  rejectReason.value = ''
  auditVisible.value = true
}
const handleApprove = () => {
  currentVideo.value.status = 'approved'
  auditVisible.value = false
  ElMessage.success('视频审核通过')
}
const handleReject = () => {
  if (!rejectReason.value) { ElMessage.warning('请填写驳回理由'); return }
  currentVideo.value.status = 'rejected'
  currentVideo.value.rejectReason = rejectReason.value
  auditVisible.value = false
  ElMessage.success('已驳回该视频')
}
</script>

<style scoped>
.video-cover { width: 60px; height: 40px; background: #F3F4F6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 20px; }
.video-preview { width: 100%; height: 200px; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
</style>
