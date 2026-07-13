import { defineStore } from 'pinia'
import { mockActivities } from '@/mock/mockActivities'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [
      { productId: 'P0001', name: '阿莫西林胶囊', spec: '0.25g*24粒/盒', price: 18.50, originPrice: 22.00, quantity: 10, checked: true, colorBg: '#DBEAFE', image: '/static/images/products/P0001.png', manufacturer: '华北制药股份有限公司' },
      { productId: 'P0004', name: '连花清瘟胶囊', spec: '0.35g*24粒/盒', price: 14.80, originPrice: 18.00, quantity: 5, checked: true, colorBg: '#FEE2E2', image: '/static/images/products/P0004.png', manufacturer: '石家庄以岭药业股份有限公司' },
      { productId: 'P0007', name: '板蓝根颗粒', spec: '10g*20袋/包', price: 12.80, originPrice: 15.00, quantity: 5, checked: true, colorBg: '#FEF3C7', image: '/static/images/products/P0007.png', manufacturer: '广州白云山和记黄埔中药有限公司' }
    ],
    activities: [...mockActivities],
    usePoints: false,
    pointsToUse: 0,
    pointsRate: 100, // 100积分=1元
    drawerVisible: false
  }),
  getters: {
    totalCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    checkedItems: (state) => state.items.filter(i => i.checked),
    checkedCount: (state) => state.items.filter(i => i.checked).reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.filter(i => i.checked).reduce((sum, item) => sum + item.price * item.quantity, 0),
    originTotal: (state) => state.items.filter(i => i.checked).reduce((sum, item) => sum + item.originPrice * item.quantity, 0),
    discountAmount() {
      const sub = this.subtotal
      let discount = 0
      // 满减活动
      if (sub >= 200) {
        discount += Math.floor(sub / 200) * 30
      }
      return discount
    },
    pointsDeduct() {
      if (this.usePoints && this.pointsToUse > 0) {
        return Math.floor(this.pointsToUse / this.pointsRate)
      }
      return 0
    },
    finalTotal() {
      const result = this.subtotal - this.discountAmount - this.pointsDeduct
      return Math.max(0, Math.round(result * 100) / 100)
    },
    savedAmount() {
      const originDiff = this.originTotal - this.subtotal
      return Math.round((originDiff + this.discountAmount + this.pointsDeduct) * 100) / 100
    }
  },
  actions: {
    addItem(product, quantity = 1) {
      const existing = this.items.find(i => i.productId === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          productId: product.id,
          name: product.name,
          spec: product.spec,
          price: product.price,
          originPrice: product.originPrice,
          quantity,
          checked: true,
          colorBg: product.colorBg,
          image: product.image,
          manufacturer: product.manufacturer
        })
      }
    },
    removeItem(productId) {
      const idx = this.items.findIndex(i => i.productId === productId)
      if (idx > -1) this.items.splice(idx, 1)
    },
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.productId === productId)
      if (item) item.quantity = Math.max(1, quantity)
    },
    toggleCheck(productId) {
      const item = this.items.find(i => i.productId === productId)
      if (item) item.checked = !item.checked
    },
    toggleCheckAll(checked) {
      this.items.forEach(i => { i.checked = checked })
    },
    clearChecked() {
      this.items = this.items.filter(i => !i.checked)
    },
    toggleDrawer(visible) {
      this.drawerVisible = typeof visible === 'boolean' ? visible : !this.drawerVisible
    },
    togglePoints(usePoints) {
      this.usePoints = usePoints
      if (usePoints) {
        // 自动使用最大可用积分
        const maxDeduct = Math.floor(this.subtotal * this.pointsRate)
        this.pointsToUse = Math.min(8650, maxDeduct)
      } else {
        this.pointsToUse = 0
      }
    }
  }
})
