<template>
  <div class="page-container">
    <div class="page-header"><div class="page-title">提成规则配置</div></div>
    
    <div class="rule-section">
      <div class="section-title">分品类提成比例</div>
      <el-table :data="rules.categoryRates" style="width: 100%;">
        <el-table-column prop="category" label="品类" width="140" />
        <el-table-column label="提成比例" width="200">
          <template #default="{ row }">
            <el-input-number v-model="row.rate" :min="row.minRate" :max="row.maxRate" :step="0.5" :precision="1" size="small" style="width: 140px;" />
            <span style="margin-left: 8px; color: #6B7280;">%</span>
          </template>
        </el-table-column>
        <el-table-column label="范围" width="180">
          <template #default="{ row }">{{ row.minRate }}% ~ {{ row.maxRate }}%</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="rule-section">
      <div class="section-title">月度阶梯提成</div>
      <el-table :data="rules.monthlyTiers" style="width: 100%;">
        <el-table-column prop="name" label="阶梯名称" width="120" />
        <el-table-column label="月销售额范围" width="200">
          <template #default="{ row }">¥{{ row.min.toLocaleString() }} ~ {{ row.max >= 99999999 ? '以上' : '¥' + row.max.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="提成加成" width="200">
          <template #default="{ row }">
            <el-input-number v-model="row.rate" :min="0" :max="10" :step="0.5" :precision="1" size="small" style="width: 140px;" />
            <span style="margin-left: 8px; color: #6B7280;">%</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="rule-section">
      <div class="section-title">特殊订单提成配置</div>
      <div class="rule-item">
        <div class="rule-info">
          <div class="rule-name">{{ rules.options.activityOrder.name }}</div>
          <div class="rule-desc">{{ rules.options.activityOrder.desc }}</div>
        </div>
        <div class="rule-config">
          <el-input-number v-model="rules.options.activityOrder.rate" :min="0" :max="10" :step="0.5" :precision="1" size="small" style="width: 100px; margin-right: 8px;" />
          <span style="margin-right: 8px; color: #6B7280;">%</span>
          <el-switch v-model="rules.options.activityOrder.enabled" />
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-info">
          <div class="rule-name">{{ rules.options.pointsOrder.name }}</div>
          <div class="rule-desc">{{ rules.options.pointsOrder.desc }}</div>
        </div>
        <div class="rule-config">
          <el-switch v-model="rules.options.pointsOrder.enabled" />
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-info">
          <div class="rule-name">{{ rules.options.settlementPeriod.name }}</div>
          <div class="rule-desc">{{ rules.options.settlementPeriod.desc }}</div>
        </div>
        <div class="rule-config">
          <el-select v-model="rules.options.settlementPeriod.value" size="small" style="width: 120px;">
            <el-option label="按月" value="monthly" />
            <el-option label="按周" value="weekly" />
            <el-option label="按季" value="quarterly" />
          </el-select>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <el-button type="primary" size="large" @click="ElMessage.success('提成规则已保存')">保存配置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { commissionRules } from '@/mock/mockSalesmen'

const rules = reactive(JSON.parse(JSON.stringify(commissionRules)))
</script>

<style scoped>
.rule-section { background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.section-title { font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #F3F4F6; }
.rule-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F9FAFB; }
.rule-item:last-child { border-bottom: none; }
.rule-info .rule-name { font-size: 14px; font-weight: 500; color: #1F2937; margin-bottom: 4px; }
.rule-info .rule-desc { font-size: 12px; color: #9CA3AF; }
.rule-config { display: flex; align-items: center; }
</style>
