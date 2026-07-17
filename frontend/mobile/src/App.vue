<script>
import authStore from './store/auth.js'
import store from './store/index.js'

export default {
  onLaunch() {
    console.log('App Launch - 医药B2B商城')

    // 恢复登录态：有 token 则拉取最新用户信息，失败则清退
    if (authStore.state.token) {
      authStore.fetchMe()
        .then(() => { store.state.user = authStore.state.user })
        .catch(() => { authStore.logout() })
    }

    // #ifdef H5
    // 全局拦截 navigateBack，防止 H5 iframe 环境下历史栈异常跳错页面
    const _navigateBack = uni.navigateBack
    uni.navigateBack = function(opts = {}) {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        _navigateBack({
          delta: opts.delta || 1,
          fail() {
            uni.switchTab({ url: '/pages/index/index' })
          }
        })
      } else {
        uni.switchTab({ url: '/pages/index/index' })
      }
    }

    // popstate 兜底：如果浏览器历史回退导致 URL 异常，强制回首页
    window.addEventListener('popstate', function() {
      setTimeout(function() {
        if (!window.location.hash || window.location.hash === '#/') {
          return
        }
        var hash = window.location.hash
        var validPages = [
          '#/pages/index/index', '#/pages/category/index', '#/pages/video/index',
          '#/pages/cart/index', '#/pages/mine/index', '#/pages/activity/detail',
          '#/pages/product/detail', '#/pages/video/play', '#/pages/order/checkout',
          '#/pages/order/list', '#/pages/order/detail', '#/pages/order/aftersale',
          '#/pages/points/index', '#/pages/message/index', '#/pages/mine/address',
          '#/pages/mine/collect', '#/pages/mine/history', '#/pages/mine/subscribe',
          '#/pages/points/detail'
        ]
        var isValid = false
        for (var i = 0; i < validPages.length; i++) {
          if (hash.indexOf(validPages[i]) === 0) {
            isValid = true
            break
          }
        }
        if (!isValid) {
          uni.switchTab({ url: '/pages/index/index' })
        }
      }, 50)
    })
    // #endif
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f5f6fa;
  color: #1f2937;
  font-size: 28rpx;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

/* 通用样式 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-around { display: flex; align-items: center; justify-content: space-around; }
.flex-1 { flex: 1; }
.flex-wrap { flex-wrap: wrap; }

.text-primary { color: #2563EB; }
.text-success { color: #10B981; }
.text-warning { color: #F59E0B; }
.text-danger { color: #EF4444; }
.text-gray { color: #9CA3AF; }
.text-white { color: #ffffff; }

.bg-primary { background-color: #2563EB; }
.bg-white { background-color: #ffffff; }

.font-bold { font-weight: 600; }
.font-sm { font-size: 24rpx; }
.font-md { font-size: 28rpx; }
.font-lg { font-size: 32rpx; }
.font-xl { font-size: 36rpx; }
.font-xxl { font-size: 44rpx; }

.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }
.ml-10 { margin-left: 10rpx; }
.ml-20 { margin-left: 20rpx; }
.mr-10 { margin-right: 10rpx; }
.mr-20 { margin-right: 20rpx; }
.p-20 { padding: 20rpx; }
.p-30 { padding: 30rpx; }
.px-20 { padding-left: 20rpx; padding-right: 20rpx; }
.px-30 { padding-left: 30rpx; padding-right: 30rpx; }
.py-20 { padding-top: 20rpx; padding-bottom: 20rpx; }
.py-30 { padding-top: 30rpx; padding-bottom: 30rpx; }

.rounded { border-radius: 12rpx; }
.rounded-lg { border-radius: 20rpx; }
.rounded-full { border-radius: 50%; }

.shadow { box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.06); }

/* 隐藏滚动条 */
::-webkit-scrollbar { display: none; }

/* 单行省略 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行省略 */
.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 未登录时价格脱敏 */
.price-mask {
  color: #9CA3AF !important;
  font-weight: 400 !important;
  font-size: 24rpx;
  background: #f0f1f5;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}
</style>
