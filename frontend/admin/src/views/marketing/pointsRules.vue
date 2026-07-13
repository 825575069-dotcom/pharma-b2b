<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">积分规则配置</div></div>
    
    <div class="rule-section">
      <div class="section-title">积分获取规则</div>
      <div class="rule-list">
        <div v-for="rule in rules.earn" :key="rule.key" class="rule-item">
          <div class="rule-info">
            <div class="rule-name">{{ rule.name }}</div>
            <div class="rule-desc">{{ rule.desc }}</div>
          </div>
          <div class="rule-config">
            <el-input-number v-if="rule.rate" v-model="rule.rate" :min="0" :max="10" :step="0.5" size="small" style="width: 100px; margin-right: 8px;" />
            <el-input-number v-if="rule.points" v-model="rule.points" :min="0" :max="100" size="small" style="width: 100px; margin-right: 8px;" />
            <el-switch v-model="rule.enabled" />
          </div>
        </div>
      </div>
    </div>

    <div class="rule-section">
      <div class="section-title">积分消耗规则</div>
      <div class="rule-list">
        <div v-for="rule in rules.consume" :key="rule.key" class="rule-item">
          <div class="rule-info">
            <div class="rule-name">{{ rule.name }}</div>
            <div class="rule-desc">{{ rule.desc }}</div>
          </div>
          <div class="rule-config">
            <el-input-number v-if="rule.rate" v-model="rule.rate" :min="1" :max="1000" size="small" style="width: 100px; margin-right: 8px;" />
            <el-switch v-model="rule.enabled" />
          </div>
        </div>
      </div>
    </div>

    <div class="rule-section">
      <div class="section-title">积分过期与限额</div>
      <div class="rule-list">
        <div class="rule-item">
          <div class="rule-info">
            <div class="rule-name">{{ rules.expire.name }}</div>
            <div class="rule-desc">{{ rules.expire.desc }}</div>
          </div>
          <div class="rule-config">
            <el-input-number v-model="rules.expire.days" :min="30" :max="9999" size="small" style="width: 120px; margin-right: 8px;" />
            <span style="margin-right: 8px; color: #6B7280;">天</span>
            <el-switch v-model="rules.expire.enabled" />
          </div>
        </div>
        <div class="rule-item">
          <div class="rule-info">
            <div class="rule-name">{{ rules.dailyLimit.name }}</div>
            <div class="rule-desc">{{ rules.dailyLimit.desc }}</div>
          </div>
          <div class="rule-config">
            <el-input-number v-model="rules.dailyLimit.limit" :min="0" :max="9999" size="small" style="width: 120px; margin-right: 8px;" />
            <span style="margin-right: 8px; color: #6B7280;">积分/天</span>
            <el-switch v-model="rules.dailyLimit.enabled" />
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <el-button type="primary" size="large" @click="handleSave">保存配置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { pointsRules } from '@/mock/mockActivities'

const rules = reactive(JSON.parse(JSON.stringify(pointsRules)))

const handleSave = () => ElMessage.success('积分规则配置已保存')
</script>

<style scoped>
.rule-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}
.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F9FAFB;
}
.rule-item:last-child { border-bottom: none; }
.rule-info .rule-name { font-size: 14px; font-weight: 500; color: #1F2937; margin-bottom: 4px; }
.rule-info .rule-desc { font-size: 12px; color: #9CA3AF; }
.rule-config { display: flex; align-items: center; }
</style>
