import { defineStore } from 'pinia'
import { mockUser } from '@/mock/mockUser'
import { mockMessages } from '@/mock/mockMessages'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: { ...mockUser },
    messages: [...mockMessages],
    collectedProductIds: ['P0003', 'P0009', 'P0012'],
    browseVideoHistory: ['V001', 'V003', 'V005', 'V010'],
    stockSubscription: [
      { productId: 'P0013', productName: '头孢克肟分散片', spec: '0.1g*6片/盒', subscribed: true, time: '2026-07-05' },
      { productId: 'P0016', productName: '阿托伐他汀钙片', spec: '20mg*7片/盒', subscribed: true, time: '2026-07-03' }
    ]
  }),
  getters: {
    unreadCount: (state) => state.messages.filter(m => !m.read).length,
    urgentCount: (state) => state.messages.filter(m => !m.read && m.urgent).length,
    availablePoints: (state) => state.userInfo.points
  },
  actions: {
    readMessage(id) {
      const msg = this.messages.find(m => m.id === id)
      if (msg) msg.read = true
    },
    readAllMessages() {
      this.messages.forEach(m => { m.read = true })
    },
    toggleCollect(productId) {
      const idx = this.collectedProductIds.indexOf(productId)
      if (idx > -1) {
        this.collectedProductIds.splice(idx, 1)
      } else {
        this.collectedProductIds.push(productId)
      }
    },
    isCollected(productId) {
      return this.collectedProductIds.includes(productId)
    },
    addVideoHistory(videoId) {
      const idx = this.browseVideoHistory.indexOf(videoId)
      if (idx > -1) {
        this.browseVideoHistory.splice(idx, 1)
      }
      this.browseVideoHistory.unshift(videoId)
    },
    toggleStockSubscription(productId, productName, spec) {
      const existing = this.stockSubscription.find(s => s.productId === productId)
      if (existing) {
        existing.subscribed = !existing.subscribed
      } else {
        this.stockSubscription.push({
          productId,
          productName,
          spec,
          subscribed: true,
          time: new Date().toISOString().slice(0, 10)
        })
      }
    },
    addPoints(amount) {
      this.userInfo.points += amount
    },
    deductPoints(amount) {
      this.userInfo.points -= amount
    }
  }
})
