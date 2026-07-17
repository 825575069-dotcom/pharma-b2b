import { useUserStore } from '@/stores/user'

// 统一请求封装：base 为相对路径 /api，由 nginx 反代到后端 :3000
// 自动携带 Authorization；遇 401 清登录态并跳登录页
export async function request({ url, method = 'GET', data, headers = {} }) {
  const userStore = useUserStore()
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(userStore.token ? { Authorization: 'Bearer ' + userStore.token } : {}),
    ...headers
  }
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: data ? JSON.stringify(data) : undefined
  })
  if (res.status === 401) {
    userStore.logout()
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('未登录或登录已失效')
  }
  return res.json()
}

export default request
