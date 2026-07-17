import authStore from '../store/auth.js'

// 统一请求封装：base 为相对路径 /api，由 nginx 反代到后端 :3000
// 自动携带 Authorization；遇 401 清登录态并跳登录页
export function request({ url, method = 'GET', data, header = {} }) {
  const token = authStore.state.token
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
    ...header
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method,
      data,
      header: headers,
      success: (res) => {
        if (res.statusCode === 401) {
          authStore.logout()
          uni.showToast({ title: '登录已失效，请重新登录', icon: 'none' })
          uni.navigateTo({ url: '/pages/login/index' })
          return reject(new Error('未登录或登录已失效'))
        }
        resolve(res.data)
      },
      fail: (err) => reject(err)
    })
  })
}

export default request
