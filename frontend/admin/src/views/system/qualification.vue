<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">企业资质</div></div>
    <div class="info-section">
      <div class="section-title">企业基础信息</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ info.companyName }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">{{ info.unifiedCode }}</el-descriptions-item>
        <el-descriptions-item label="法定代表人">{{ info.legalPerson }}</el-descriptions-item>
        <el-descriptions-item label="注册资本">{{ info.registeredCapital }}</el-descriptions-item>
        <el-descriptions-item label="注册地址" :span="2">{{ info.registeredAddress }}</el-descriptions-item>
        <el-descriptions-item label="经营范围" :span="2">{{ info.businessScope }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="info-section">
      <div class="section-title">
        资质证件
        <el-button type="primary" size="small" @click="dialogVisible = true"><el-icon><Plus /></el-icon> 上传资质</el-button>
      </div>
      <el-table :data="info.qualifications" style="width: 100%;">
        <el-table-column prop="name" label="资质名称" min-width="200" />
        <el-table-column prop="licenseNo" label="证书编号" width="160" />
        <el-table-column prop="issueDate" label="发证日期" width="120" />
        <el-table-column prop="expiryDate" label="到期日期" width="120" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag type="success" size="small">有效</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button type="primary" link size="small">查看</el-button>
            <el-button type="warning" link size="small">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="上传资质" width="480px">
      <el-form label-width="100px">
        <el-form-item label="资质名称"><el-input placeholder="请输入资质名称" /></el-form-item>
        <el-form-item label="证书编号"><el-input placeholder="请输入证书编号" /></el-form-item>
        <el-form-item label="发证日期"><el-date-picker type="date" placeholder="选择日期" style="width: 100%" /></el-form-item>
        <el-form-item label="到期日期"><el-date-picker type="date" placeholder="选择日期" style="width: 100%" /></el-form-item>
        <el-form-item label="证件图片">
          <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false; ElMessage.success('资质上传成功')">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { enterpriseQualification } from '@/mock/mockUsers'

const info = enterpriseQualification
const dialogVisible = ref(false)
</script>

<style scoped>
.info-section { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.section-title { font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; }
</style>
