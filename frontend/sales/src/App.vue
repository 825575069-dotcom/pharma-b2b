<script>
export default {
  onLaunch() {
    console.log('业务员工作台启动')
  }
}
</script>

<style>
/* 全局样式 */
:root {
  --primary: #2563EB;
  --primary-light: #DBEAFE;
  --primary-dark: #1D4ED8;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --text-1: #111827;
  --text-2: #4B5563;
  --text-3: #9CA3AF;
  --bg-page: #F5F6FA;
  --bg-card: #FFFFFF;
  --border: #E5E7EB;
}

page {
  background-color: #F5F6FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.5;
}

/* 通用卡片 */
.card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

/* flex 工具类 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-around { display: flex; align-items: center; justify-content: space-around; }
.flex-wrap { display: flex; flex-wrap: wrap; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* 文字 */
.text-primary { color: #2563EB; }
.text-success { color: #10B981; }
.text-warning { color: #F59E0B; }
.text-danger { color: #EF4444; }
.text-gray { color: #9CA3AF; }
.text-bold { font-weight: 600; }
.text-sm { font-size: 24rpx; }
.text-md { font-size: 28rpx; }
.text-lg { font-size: 32rpx; }
.text-xl { font-size: 36rpx; }
.text-2xl { font-size: 48rpx; }

/* 间距 */
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

/* 标签 */
.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  line-height: 1.5;
}
.tag-blue { background: #DBEAFE; color: #2563EB; }
.tag-green { background: #D1FAE5; color: #10B981; }
.tag-orange { background: #FEF3C7; color: #F59E0B; }
.tag-red { background: #FEE2E2; color: #EF4444; }
.tag-gray { background: #F3F4F6; color: #6B7280; }

/* 按钮 */
.btn-primary {
  background: #2563EB;
  color: #FFFFFF;
  border: none;
  border-radius: 48rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-outline {
  background: transparent;
  color: #2563EB;
  border: 2rpx solid #2563EB;
  border-radius: 48rpx;
  padding: 18rpx 38rpx;
  font-size: 28rpx;
  text-align: center;
}

/* 分割线 */
.divider {
  height: 1rpx;
  background: #E5E7EB;
  margin: 20rpx 0;
}

/* 安全区 */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
