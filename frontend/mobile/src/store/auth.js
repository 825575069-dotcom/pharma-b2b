import { reactive } from 'vue'

const TOKEN_KEY = 'pharma_token'
const USER_KEY = 'pharma_user'

function load(key, def) {
  try {
    const v = uni.getStorageSync(key)
    return v ? v : def
  } catch (e) {
    return def
  }
}

const state = reactive({
  token: load(TOKEN_KEY, ''),
  user: load(USER_KEY, null)
})

function persist() {
  try {
    uni.setStorageSync(TOKEN_KEY, state.token)
    uni.setStorageSync(USER_KEY, state.user)
  } catch (e) {}
}

const authStore = {
  state,
  get isLoggedIn() {
    return !!state.token
  },
  async login(phone, password) {
    const { request } = await import('../utils/request.js')
    const res = await request({ url: '/api/auth/login', method: 'POST', data: { phone, password } })
    if (res.code === 0) {
      state.token = res.data.token
      state.user = res.data.user
      persist()
    } else {
      throw new Error(res.message || '登录失败')
    }
    return res
  },
  async register(payload) {
    const { request } = await import('../utils/request.js')
    const res = await request({ url: '/api/auth/register', method: 'POST', data: payload })
    if (res.code === 0) {
      state.token = res.data.token
      state.user = res.data.user
      persist()
    } else {
      throw new Error(res.message || '注册失败')
    }
    return res
  },
  async fetchMe() {
    const { request } = await import('../utils/request.js')
    const res = await request({ url: '/api/auth/me', method: 'GET' })
    if (res.code === 0) {
      state.user = res.data.user
      persist()
      return res.data.user
    }
    throw new Error(res.message || '获取用户信息失败')
  },
  logout() {
    state.token = ''
    state.user = null
    try {
      uni.removeStorageSync(TOKEN_KEY)
      uni.removeStorageSync(USER_KEY)
    } catch (e) {}
  },
  // 跳转到登录页（价格/加购拦截时调用）
  goLogin() {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

export default authStore
