<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">账号登录</h1>
      <p class="subtitle">登录后查看商品价格</p>

      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.phone" size="large" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" size="large" placeholder="请输入密码" show-password @keyup.enter="onLogin" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit" :loading="loading" @click="onLogin">登 录</el-button>
      </el-form>

      <div class="tips">
        <span>还没有账号？</span>
        <el-link type="primary" @click="goRegister">立即注册</el-link>
      </div>
      <div class="demo-tip">演示账号：13800000000 / 123456</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ phone: '', password: '' })

async function onLogin() {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  if (!form.password) {
    ElMessage.warning('请输入密码')
    return
  }
  loading.value = true
  try {
    await userStore.login(form.phone, form.password)
    ElMessage.success('登录成功')
    const redirect = router.currentRoute.value.query.redirect || '/'
    router.replace(redirect)
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
}
.login-card {
  width: 380px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.title { font-size: 26px; font-weight: 700; margin: 0; }
.subtitle { color: #9CA3AF; margin: 8px 0 28px; font-size: 14px; }
.submit { width: 100%; margin-top: 8px; }
.tips { margin-top: 18px; text-align: center; font-size: 14px; color: #6B7280; }
.demo-tip { margin-top: 12px; text-align: center; font-size: 12px; color: #9CA3AF; }
</style>
