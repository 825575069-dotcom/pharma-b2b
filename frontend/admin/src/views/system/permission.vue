<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">权限管理</div></div>
    <div class="table-container">
      <div class="table-header">
        <el-button type="primary" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 新增角色</el-button>
      </div>
      <el-table :data="roles" style="width: 100%; margin-top: 16px;">
        <el-table-column prop="name" label="角色名称" width="140" />
        <el-table-column prop="desc" label="描述" min-width="240" />
        <el-table-column label="权限数" width="100" align="center">
          <template #default="{ row }">{{ roleMenuMap[row.key]?.length || 0 }} 项</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleConfig(row)">配置权限</el-button>
            <el-button type="info" link size="small" @click="handleViewMatrix(row)">权限矩阵</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 权限配置弹窗 -->
    <el-dialog v-model="configVisible" :title="`配置权限 - ${currentRole?.name || ''}`" width="700px">
      <el-table :data="permissionMatrix" style="width: 100%;" default-expand-all row-key="module">
        <el-table-column prop="module" label="功能模块" width="160" />
        <el-table-column label="权限项">
          <template #default="{ row: module }">
            <div v-for="perm in module.permissions" :key="perm.key" class="perm-item">
              <el-checkbox :model-value="currentRole ? roleMenuMap[currentRole.key]?.some(m => m.includes(perm.key.split(':')[0])) : false">
                {{ perm.name }}
              </el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="configVisible = false">取消</el-button>
        <el-button type="primary" @click="configVisible = false; ElMessage.success('权限配置已保存')">保存</el-button>
      </template>
    </el-dialog>

    <!-- 权限矩阵弹窗 -->
    <el-dialog v-model="matrixVisible" title="权限矩阵" width="900px">
      <el-table :data="permissionMatrix" style="width: 100%;" default-expand-all row-key="module">
        <el-table-column prop="module" label="功能模块" width="120" />
        <el-table-column prop="name" label="权限项" width="160">
          <template #default="{ row: module }">
            <div v-for="p in module.permissions" :key="p.key" style="padding: 4px 0;">{{ p.name }}</div>
          </template>
        </el-table-column>
        <el-table-column v-for="role in roles" :key="role.key" :label="role.name" width="80" align="center">
          <template #default="{ row: module }">
            <div v-for="p in module.permissions" :key="p.key" style="padding: 4px 0;">
              <el-icon v-if="p.roles.includes(role.key)" style="color: #10B981;"><Check /></el-icon>
              <el-icon v-else style="color: #D1D5DB;"><Close /></el-icon>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { roles, roleMenuMap, permissionMatrix } from '@/mock/mockPermissions'

const dialogVisible = ref(false)
const configVisible = ref(false)
const matrixVisible = ref(false)
const currentRole = ref(null)

const handleConfig = (role) => { currentRole.value = role; configVisible.value = true }
const handleViewMatrix = (role) => { matrixVisible.value = true }
</script>

<style scoped>
.table-header { display: flex; justify-content: space-between; }
.perm-item { padding: 4px 0; }
</style>
