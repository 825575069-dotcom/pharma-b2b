<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">全局参数配置</div></div>
    
    <div class="param-section">
      <div class="section-title">积分参数</div>
      <div class="param-list">
        <div v-for="(val, key) in params.points" :key="key" class="param-item">
          <div class="param-info">
            <div class="param-name">{{ val.name }}</div>
            <div class="param-desc">{{ val.desc }}</div>
          </div>
          <div class="param-input">
            <el-input-number v-if="typeof val.value === 'number'" v-model="val.value" :min="0" size="small" style="width: 140px;" />
          </div>
        </div>
      </div>
    </div>

    <div class="param-section">
      <div class="section-title">提成参数</div>
      <div class="param-list">
        <div v-for="(val, key) in params.commission" :key="key" class="param-item">
          <div class="param-info">
            <div class="param-name">{{ val.name }}</div>
            <div class="param-desc">{{ val.desc }}</div>
          </div>
          <div class="param-input">
            <el-select v-if="val.options" v-model="val.value" size="small" style="width: 140px;">
              <el-option v-for="opt in val.options" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <div class="param-section">
      <div class="section-title">到期提醒</div>
      <div class="param-list">
        <div v-for="(val, key) in params.reminders" :key="key" class="param-item">
          <div class="param-info">
            <div class="param-name">{{ val.name }}</div>
            <div class="param-desc">{{ val.desc }}</div>
          </div>
          <div class="param-input">
            <el-input-number v-if="typeof val.value === 'number'" v-model="val.value" :min="1" size="small" style="width: 100px; margin-right: 8px;" />
            <span v-if="typeof val.value === 'number'" style="margin-right: 8px; color: #6B7280; font-size: 13px;">天</span>
            <el-switch v-if="val.enabled !== undefined" v-model="val.enabled" />
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <el-button type="primary" size="large" @click="ElMessage.success('全局参数已保存')">保存配置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { globalParams } from '@/mock/mockUsers'

const params = reactive(JSON.parse(JSON.stringify(globalParams)))
</script>

<style scoped>
.param-section { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.section-title { font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #F3F4F6; }
.param-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F9FAFB; }
.param-item:last-child { border-bottom: none; }
.param-info .param-name { font-size: 14px; font-weight: 500; color: #1F2937; margin-bottom: 4px; }
.param-info .param-desc { font-size: 12px; color: #9CA3AF; }
.param-input { display: flex; align-items: center; }
</style>
