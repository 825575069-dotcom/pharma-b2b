<template>
  <el-drawer
    v-model="visible"
    title="消息通知"
    direction="rtl"
    size="420px"
    class="message-drawer"
  >
    <div class="msg-content">
      <div class="msg-header-bar">
        <span class="msg-count">{{ unreadCount }}条未读 · 共{{ userStore.messages.length }}条</span>
        <el-button text type="primary" size="small" @click="userStore.readAllMessages()">全部已读</el-button>
      </div>

      <div class="msg-list">
        <div
          v-for="msg in userStore.messages"
          :key="msg.id"
          class="msg-item"
          :class="{ unread: !msg.read }"
          @click="userStore.readMessage(msg.id)"
        >
          <div class="msg-icon" :style="{ background: msg.typeColor + '20', color: msg.typeColor }">
            <el-icon :size="18"><component :is="msg.icon" /></el-icon>
          </div>
          <div class="msg-body">
            <div class="msg-title-row">
              <span class="msg-title">{{ msg.title }}</span>
              <el-tag v-if="msg.urgent && !msg.read" type="danger" size="small">紧急</el-tag>
              <el-tag v-else size="small" effect="plain" round :style="{ color: msg.typeColor, borderColor: msg.typeColor + '40' }">{{ msg.type }}</el-tag>
            </div>
            <div class="msg-text">{{ msg.content }}</div>
            <div class="msg-time">{{ msg.time }}</div>
          </div>
          <div v-if="!msg.read" class="msg-dot"></div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { useUserStore } from '@/stores/user'

const globalStore = useGlobalStore()
const userStore = useUserStore()

const visible = computed({
  get: () => globalStore.messageDrawerVisible,
  set: (val) => { if (!val) globalStore.closeMessageDrawer() }
})

const unreadCount = computed(() => userStore.unreadCount)
</script>

<style lang="scss" scoped>
.msg-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.msg-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 12px;
  border-bottom: 1px solid #F3F4F6;

  .msg-count {
    font-size: 13px;
    color: #6B7280;
  }
}

.msg-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.msg-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #F3F4F6;
  cursor: pointer;
  position: relative;

  &:hover {
    background: #F9FAFB;
    margin: 0 -8px;
    padding: 16px 8px;
    border-radius: 8px;
  }

  &.unread {
    .msg-title {
      font-weight: 600;
    }
  }

  .msg-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .msg-body {
    flex: 1;

    .msg-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;

      .msg-title {
        font-size: 14px;
        color: #1F2937;
      }
    }

    .msg-text {
      font-size: 13px;
      color: #6B7280;
      line-height: 1.5;
      margin-bottom: 6px;
    }

    .msg-time {
      font-size: 12px;
      color: #9CA3AF;
    }
  }

  .msg-dot {
    position: absolute;
    top: 20px;
    right: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #EF4444;
  }
}
</style>
