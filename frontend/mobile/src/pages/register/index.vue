<template>
  <view class="register-page">
    <view class="header">
      <text class="title">注册买家账号</text>
      <text class="subtitle">注册后登录即可查看商品价格</text>
    </view>

    <view class="form">
      <view class="field">
        <text class="label">手机号</text>
        <input class="input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="field">
        <text class="label">密码（至少 6 位）</text>
        <input class="input" v-model="password" type="safe-password" password placeholder="请设置密码" />
      </view>
      <view class="field">
        <text class="label">确认密码</text>
        <input class="input" v-model="confirm" type="safe-password" password placeholder="请再次输入密码" />
      </view>
      <view class="field">
        <text class="label">联系人（选填）</text>
        <input class="input" v-model="name" placeholder="请输入联系人姓名" />
      </view>
      <view class="field">
        <text class="label">公司名称（选填）</text>
        <input class="input" v-model="company" placeholder="请输入公司名称" />
      </view>

      <button class="submit" :loading="loading" @click="onRegister">注 册</button>
      <view class="tips">
        <text>已有账号？</text>
        <text class="link" @click="goLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import authStore from '../../store/auth.js'
import store from '../../store/index.js'

export default {
  name: 'RegisterPage',
  data() {
    return { phone: '', password: '', confirm: '', name: '', company: '', loading: false }
  },
  methods: {
    async onRegister() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
      }
      if (!this.password || this.password.length < 6) {
        return uni.showToast({ title: '密码至少 6 位', icon: 'none' })
      }
      if (this.password !== this.confirm) {
        return uni.showToast({ title: '两次密码不一致', icon: 'none' })
      }
      this.loading = true
      try {
        await authStore.register({ phone: this.phone, password: this.password, name: this.name, company: this.company })
        store.state.user = authStore.state.user
        uni.showToast({ title: '注册成功', icon: 'success' })
        setTimeout(() => {
          const pages = getCurrentPages()
          if (pages.length > 1) uni.navigateBack()
          else uni.switchTab({ url: '/pages/mine/index' })
        }, 600)
      } catch (e) {
        uni.showToast({ title: e.message || '注册失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/login/index' })
    }
  }
}
</script>

<style scoped>
.register-page { padding: 120rpx 48rpx; min-height: 100vh; background: #f5f6fa; }
.header { margin-bottom: 50rpx; }
.title { font-size: 48rpx; font-weight: 700; display: block; }
.subtitle { font-size: 28rpx; color: #9CA3AF; margin-top: 12rpx; display: block; }
.field { background: #fff; border-radius: 16rpx; padding: 24rpx 28rpx; margin-bottom: 20rpx; }
.label { font-size: 24rpx; color: #9CA3AF; display: block; margin-bottom: 10rpx; }
.input { font-size: 32rpx; height: 56rpx; }
.submit { margin-top: 20rpx; background: #2563EB; color: #fff; border-radius: 16rpx; font-size: 32rpx; }
.tips { margin-top: 36rpx; text-align: center; font-size: 26rpx; color: #6B7280; }
.link { color: #2563EB; margin-left: 8rpx; }
</style>
