<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="title">注册买家账号</h1>
      <p class="subtitle">注册后登录即可查看商品价格</p>

      <el-form :model="form" @submit.prevent>
        <el-form-item>
          <el-input v-model="form.phone" size="large" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" size="large" placeholder="请设置密码（至少 6 位）" show-password />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.confirm" type="password" size="large" placeholder="请再次输入密码" show-password @keyup.enter="onRegister" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.name" size="large" placeholder="联系人（选填）" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.company" size="large" placeholder="公司名称（选填）" />
        </el-form-item>
        <el-button type="primary" size="large" class="submit" :loading="loading" @click="onRegister">注 册</el-button>
      </el-form>

      <div class="tips">
        <span>已有账号？</span>
        <el-link type="primary" @click="goLogin">去登录</el-link>
      </div>
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
const form = reactive({ phone: '', password: '', confirm: '', name: '', company: '' })

async function onRegister() {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  if (!form.password || form.password.length < 6) {
    ElMessage.warning('密码至少 6 位')
    return
  }
  if (form.password !== form.confirm) {
    ElMessage.warning('两次密码不一致')
    return
  }
  loading.value = true
  try {
    await userStore.register({
      phone: form.phone,
      password: form.password,
      name: form.name,
      company: form.company
    })
    ElMessage.success('注册成功')
    router.replace('/')
  } catch (e) {
    ElMessage.error(e.message || '注册失败')
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
}
.register-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.title { font-size: 26px; font-weight: 700; margin: 0; }
.subtitle { color: #9CA3AF; margin: 8px 0 24px; font-size: 14px; }
.submit { width: 100%; margin-top: 8px; }
.tips { margin-top: 18px; text-align: center; font-size: 14px; color: #6B7280; }
</style>
