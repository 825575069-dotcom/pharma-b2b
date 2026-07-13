<template>
  <view class="page">
    <scroll-view scroll-y class="addr-scroll">
      <view v-for="addr in addresses" :key="addr.id" class="addr-card">
        <view class="addr-info">
          <view class="addr-top">
            <text class="addr-name">{{ addr.name }}</text>
            <text class="addr-phone">{{ addr.phone }}</text>
            <view v-if="addr.isDefault" class="addr-tag">
              <text class="tag-text">默认</text>
            </view>
            <view v-if="addr.label && !addr.isDefault" class="addr-tag other">
              <text class="tag-text">{{ addr.label }}</text>
            </view>
          </view>
          <text class="addr-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</text>
        </view>
        <view class="addr-actions">
          <view class="action-item" @tap="editAddress(addr)">
            <text class="action-text">编辑</text>
          </view>
          <view class="action-item" @tap="deleteAddress(addr)">
            <text class="action-text delete">删除</text>
          </view>
          <view v-if="!addr.isDefault" class="action-item" @tap="setDefault(addr)">
            <text class="action-text">设为默认</text>
          </view>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部新增按钮 -->
    <view class="bottom-bar">
      <view class="add-btn" @tap="addAddress">
        <text class="add-text">+ 新增收货地址</text>
      </view>
    </view>
  </view>
</template>

<script>
import { store } from '../../store/index.js'

export default {
  data() {
    return {
      store
    }
  },
  computed: {
    addresses() {
      return this.store.state.user.address
    }
  },
  methods: {
    editAddress(addr) {
      uni.showToast({ title: '编辑地址功能开发中', icon: 'none' })
    },
    deleteAddress(addr) {
      uni.showModal({
        title: '删除地址',
        content: '确定要删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            const idx = this.addresses.findIndex(a => a.id === addr.id)
            if (idx > -1) this.addresses.splice(idx, 1)
            uni.showToast({ title: '已删除', icon: 'success' })
          }
        }
      })
    },
    setDefault(addr) {
      this.addresses.forEach(a => {
        a.isDefault = a.id === addr.id
        a.label = a.id === addr.id ? '默认' : a.label
      })
      uni.showToast({ title: '已设为默认', icon: 'success' })
    },
    addAddress() {
      uni.showToast({ title: '新增地址功能开发中', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.addr-scroll {
  height: calc(100vh - 110rpx);
}

.addr-card {
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;

  .addr-info {
    .addr-top {
      display: flex;
      align-items: center;

      .addr-name {
        font-size: 30rpx;
        color: #1f2937;
        font-weight: 600;
      }

      .addr-phone {
        font-size: 26rpx;
        color: #6B7280;
        margin-left: 16rpx;
      }

      .addr-tag {
        background: #2563EB;
        padding: 2rpx 10rpx;
        border-radius: 6rpx;
        margin-left: 12rpx;

        &.other {
          background: #f3f4f6;

          .tag-text {
            color: #6B7280;
          }
        }

        .tag-text {
          font-size: 18rpx;
          color: #fff;
        }
      }
    }

    .addr-detail {
      font-size: 24rpx;
      color: #6B7280;
      margin-top: 8rpx;
    }
  }

  .addr-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f5f5f5;

    .action-item {
      margin-left: 24rpx;

      .action-text {
        font-size: 24rpx;
        color: #2563EB;

        &.delete {
          color: #EF4444;
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .add-btn {
    flex: 1;
    height: 76rpx;
    background: #2563EB;
    border-radius: 38rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .add-text {
      font-size: 30rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
