<template>
  <view class="page">
    <!-- 可提现金额 -->
    <view class="header">
      <view class="text-sm" style="color:rgba(255,255,255,0.8)">可提现金额（元）</view>
      <view class="amount">{{ info.withdrawableAmount.toFixed(2) }}</view>
      <view class="flex mt-20">
        <view class="mr-40">
          <text class="text-sm" style="color:rgba(255,255,255,0.7)">冻结金额</text>
          <view class="text-md" style="color:#fff">¥{{ info.frozenAmount.toFixed(2) }}</view>
        </view>
        <view>
          <text class="text-sm" style="color:rgba(255,255,255,0.7)">累计已提现</text>
          <view class="text-md" style="color:#fff">¥{{ info.totalWithdrawn.toFixed(2) }}</view>
        </view>
      </view>
      <view class="withdraw-btn" @tap="showModal = true">立即提现</view>
    </view>

    <!-- 提现记录 -->
    <view class="section">
      <view class="card-title-row">
        <text class="section-title">提现记录</text>
      </view>

      <view v-for="item in withdrawals" :key="item.id" class="card">
        <view class="flex-between mb-10">
          <text class="text-lg text-bold text-primary">¥{{ item.amount.toFixed(2) }}</text>
          <view class="tag" :class="getStatusClass(item.status)">{{ item.statusText }}</view>
        </view>
        <view class="info-row">
          <text class="text-sm text-gray">提现账户</text>
          <text class="text-sm">{{ item.account }}</text>
        </view>
        <view class="info-row">
          <text class="text-sm text-gray">申请时间</text>
          <text class="text-sm">{{ item.applyTime }}</text>
        </view>
        <view v-if="item.reviewTime" class="info-row">
          <text class="text-sm text-gray">审核时间</text>
          <text class="text-sm">{{ item.reviewTime }}</text>
        </view>
        <view v-if="item.rejectReason" class="reject-box">
          <text class="text-sm text-danger">驳回原因：{{ item.rejectReason }}</text>
        </view>
      </view>

      <view v-if="withdrawals.length === 0" class="empty">
        <text class="text-gray">暂无提现记录</text>
      </view>
    </view>

    <view style="height:120rpx"></view>

    <!-- 提现弹窗 -->
    <view v-if="showModal" class="modal-mask" @tap="showModal = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-title">提现申请</view>
        <view class="modal-body">
          <view class="modal-field">
            <text class="field-label">可提现金额</text>
            <text class="text-primary text-bold">¥{{ info.withdrawableAmount.toFixed(2) }}</text>
          </view>
          <view class="modal-field">
            <text class="field-label">提现金额</text>
            <input v-model="withdrawAmount" type="digit" placeholder="请输入提现金额" class="field-input" />
          </view>
          <view class="modal-field">
            <text class="field-label">提现账户</text>
            <picker :range="accounts" @change="onAccountChange" :value="accountIndex">
              <view class="picker-display">
                <text>{{ accounts[accountIndex] }}</text>
                <text class="text-gray">▾</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="modal-actions">
          <view class="modal-cancel" @tap="showModal = false">取消</view>
          <view class="modal-confirm" @tap="confirmWithdraw">确认提现</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { salesmanInfo } from '@/mock/mockSalesman.js'
import { withdrawals } from '@/mock/mockWithdrawals.js'

const info = ref(salesmanInfo)
const showModal = ref(false)
const withdrawAmount = ref('')
const accountIndex = ref(0)
const accounts = ['招商银行(6225****8866)', '建设银行(6217****2255)']

function getStatusClass(status) {
  const map = { pending: 'tag-orange', approved: 'tag-green', rejected: 'tag-red' }
  return map[status] || 'tag-gray'
}

function onAccountChange(e) {
  accountIndex.value = e.detail.value
}

function confirmWithdraw() {
  const amount = parseFloat(withdrawAmount.value)
  if (!amount || amount <= 0) {
    uni.showToast({ title: '请输入有效金额', icon: 'none' })
    return
  }
  if (amount > info.value.withdrawableAmount) {
    uni.showToast({ title: '提现金额超过可提现额度', icon: 'none' })
    return
  }
  uni.showToast({ title: '提现申请已提交，等待审核', icon: 'none', duration: 2000 })
  showModal.value = false
  withdrawAmount.value = ''
}
</script>

<style scoped>
.page { min-height: 100vh; }

.header {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  padding: 40rpx 30rpx 60rpx;
  text-align: center;
}
.amount {
  font-size: 72rpx;
  font-weight: 700;
  color: #fff;
  margin: 16rpx 0;
}
.withdraw-btn {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: #fff;
  padding: 16rpx 80rpx;
  border-radius: 48rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: 2rpx solid rgba(255,255,255,0.4);
  margin-top: 30rpx;
}

.section { padding: 0 24rpx; margin-top: 20rpx; }
.section:first-of-type { margin-top: -30rpx; }
.card-title-row { margin-bottom: 16rpx; }
.section-title { font-size: 32rpx; font-weight: 600; }
.card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 20rpx; }

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}
.reject-box {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #FEE2E2;
  border-radius: 12rpx;
}
.empty { text-align: center; padding: 60rpx 0; }

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
}
.modal-content {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 40rpx 30rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}
.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30rpx;
}
.modal-body { display: flex; flex-direction: column; gap: 24rpx; }
.modal-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.field-label { font-size: 28rpx; color: #4B5563; }
.field-input {
  flex: 1;
  text-align: right;
  font-size: 32rpx;
  font-weight: 600;
  color: #2563EB;
}
.picker-display {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
}
.modal-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}
.modal-cancel {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 48rpx;
  background: #F3F4F6;
  color: #4B5563;
  font-size: 30rpx;
}
.modal-confirm {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  border-radius: 48rpx;
  background: #2563EB;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }
</style>
