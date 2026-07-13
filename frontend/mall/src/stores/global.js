import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // 全局弹窗控制
    productDrawerVisible: false,
    currentProductId: null,
    videoDialogVisible: false,
    currentVideoId: null,
    checkoutDialogVisible: false,
    userCenterDrawerVisible: false,
    pointsMallDialogVisible: false,
    messageDrawerVisible: false,
    searchKeyword: ''
  }),
  actions: {
    openProductDrawer(productId) {
      this.currentProductId = productId
      this.productDrawerVisible = true
    },
    closeProductDrawer() {
      this.productDrawerVisible = false
    },
    openVideoDialog(videoId) {
      this.currentVideoId = videoId
      this.videoDialogVisible = true
    },
    closeVideoDialog() {
      this.videoDialogVisible = false
    },
    openCheckout() {
      this.checkoutDialogVisible = true
    },
    closeCheckout() {
      this.checkoutDialogVisible = false
    },
    openUserCenter() {
      this.userCenterDrawerVisible = true
    },
    closeUserCenter() {
      this.userCenterDrawerVisible = false
    },
    openPointsMall() {
      this.pointsMallDialogVisible = true
    },
    closePointsMall() {
      this.pointsMallDialogVisible = false
    },
    openMessageDrawer() {
      this.messageDrawerVisible = true
    },
    closeMessageDrawer() {
      this.messageDrawerVisible = false
    },
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword
    }
  }
})
