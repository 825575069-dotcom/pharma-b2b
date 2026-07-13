<template>
  <view class="page">
    <view class="tip-bar">
      <text class="text-sm text-gray">点击选择视频，可多选后一键转发给客户</text>
    </view>

    <!-- 视频列表 -->
    <view class="video-list">
      <view v-for="v in videos" :key="v.id" class="video-card" @tap="toggleSelect(v.id)">
        <view class="video-cover">
          <image class="cover-img" :src="v.cover" mode="aspectFill" />
          <view class="play-icon"><wx-icon name="play" size="40" /></view>
          <view class="duration">{{ v.duration }}</view>
          <view v-if="selectedIds.includes(v.id)" class="check-mask">
            <view class="check-icon"><wx-icon name="check" size="24" /></view>
          </view>
        </view>
        <view class="video-info">
          <view class="video-title">{{ v.title }}</view>
          <view class="flex-between mt-10">
            <view class="tag tag-blue">{{ v.category }}</view>
            <text class="text-sm text-gray">{{ v.playCount }} 次播放</text>
          </view>
        </view>
      </view>
    </view>

    <view style="height:160rpx"></view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar safe-bottom">
      <view class="select-count">
        已选 <text class="text-primary text-bold">{{ selectedIds.length }}</text> 个视频
      </view>
      <view
        class="forward-btn"
        :class="{ disabled: selectedIds.length === 0 }"
        @tap="forwardVideos"
      >
        一键转发
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { videos } from '@/mock/mockVideos.js'

const selectedIds = ref([])

function toggleSelect(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function forwardVideos() {
  if (selectedIds.value.length === 0) return
  const selected = videos.filter(v => selectedIds.value.includes(v.id))
  const titles = selected.map(v => v.title).join('；')
  uni.setClipboardData({
    data: `【视频合集分享】${titles}`,
    success: () => {
      uni.showToast({ title: `${selectedIds.value.length}个视频已复制，可粘贴发送给客户`, icon: 'none', duration: 2500 })
      selectedIds.value = []
    }
  })
}
</script>

<style scoped>
.page { min-height: 100vh; }

.tip-bar { padding: 20rpx 24rpx; }

.video-list { padding: 0 24rpx; }
.video-card {
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}
.video-cover {
  position: relative;
  width: 100%;
  height: 360rpx;
}
.cover-img { width: 100%; height: 100%; }
.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  padding-left: 6rpx;
}
.duration {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.check-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(37,99,235,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-icon {
  width: 64rpx;
  height: 64rpx;
  background: #2563EB;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  border: 4rpx solid #fff;
}
.video-info { padding: 24rpx; }
.video-title { font-size: 28rpx; font-weight: 600; line-height: 1.5; }

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: #fff;
  border-top: 1rpx solid #E5E7EB;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}
.select-count { font-size: 28rpx; color: #4B5563; }
.forward-btn {
  background: #2563EB;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  padding: 20rpx 60rpx;
  border-radius: 48rpx;
}
.forward-btn.disabled {
  background: #D1D5DB;
}

.tag { display: inline-block; padding: 4rpx 16rpx; border-radius: 8rpx; font-size: 22rpx; }
.tag-blue { background: #DBEAFE; color: #2563EB; }
</style>
