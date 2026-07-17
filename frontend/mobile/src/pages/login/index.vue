<template>
  <view class="login-page">
    <view class="header">
      <text class="title">账号登录</text>
      <text class="subtitle">登录后查看商品价格</text>
    </view>

    <view class="form">
      <view class="field">
        <text class="label">手机号</text>
        <input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="safe-password" password placeholder="请输入密码" />
      </view>

      <button class="submit" :loading="loading" @click="onLogin">登 录</button>

      <view class="tips">
        <text>还没有账号？</text>
        <text class="link" @click="goRegister">立即注册</text>
      </view>
      <view class="demo-tip">演示账号：13800000000 / 123456</view>
    </view>
  </view>
</template>

<script>
import authStore from '../../store/auth.js'
import store from '../../store/index.js'

export default {
  name: 'LoginPage',
  data() {
    return { phone: '', password: '', loading: false }
  },
  methods: {
    async onLogin() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      }
      if (!this.password) {
        return uni.showToast({ title: '请输入密码', icon: 'none' })
      }
      this.loading = true
      try {
        await authStore.login(this.phone, this.password)
        store.state.user = authStore.state.user
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length > 1) uni.navigateBack()
          else uni.switchTab({ url: '/pages/mine/index' })
        }, 600)
      } catch (e) {
        uni.showToast({ title: e.message || '登录失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    goRegister() {
      uni.navigateTo({ url: '/pages/register/index' })
    }
  }
}
</script>

<style scoped>
.login-page { padding: 120rpx 48rpx; min-height: 100vh; background: #f5f6fa; }
.header { margin-bottom: 60rpx; }
.title { font-size: 48rpx; font-weight: 700; display: block; }
.subtitle { font-size: 28rpx; color: #9CA3AF; margin-top: 12rpx; display: block; }
.field { background: #fff; border-radius: 16rpx; padding: 28rpx 28rpx; margin-bottom: 24rpx; }
.label { font-size: 24rpx; color: #9CA3AF; display: block; margin-bottom: 10rpx; }
.input { font-size: 32rpx; height: 56rpx; }
.submit { margin-top: 30rpx; background: #2563EB; color: #fff; border-radius: 16rpx; font-size: 32rpx; }
.tips { margin-top: 40rpx; text-align: center; font-size: 26rpx; color: #6B7280; }
.link { color: #2563EB; margin-left: 8rpx; }
.demo-tip { margin-top: 20rpx; text-align: center; font-size: 24rpx; color: #9CA3AF; }
</style>
