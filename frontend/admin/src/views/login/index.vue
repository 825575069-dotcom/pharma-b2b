<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-header">
        <img src="/favicon.svg" alt="logo" />
        <h1>医药B2B私域一体化平台</h1>
        <p>管理后台</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" size="large" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large" prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-button type="primary" size="large" class="login-btn" @click="handleLogin">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref()
const form = reactive({ username: 'admin', password: '123456' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      router.push('/dashboard')
    }
  })
}
</script>

<style scoped lang="scss">
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1E293B 0%, #334155 100%);

  .login-box {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      img {
        width: 56px;
        height: 56px;
      }

      h1 {
        font-size: 20px;
        font-weight: 600;
        color: #1F2937;
        margin: 16px 0 4px;
      }

      p {
        font-size: 14px;
        color: #6B7280;
      }
    }

    .login-btn {
      width: 100%;
      margin-top: 8px;
    }
  }
}
</style>
