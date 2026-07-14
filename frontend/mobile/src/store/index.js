import { reactive } from 'vue'
import { mockProducts } from '../mock/mockProducts.js'
import { mockUser } from '../mock/mockUser.js'
import { mockMessages } from '../mock/mockMessages.js'

const state = reactive({
  user: mockUser,
  cart: [],
  messages: mockMessages,
  products: mockProducts,
  unreadCount: mockMessages.filter(m => !m.read).length
})

// 购物车操作
function addToCart(product, quantity = 1) {
  const existing = state.cart.find(item => item.productId === product.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    state.cart.push({
      productId: product.id,
      name: product.name,
      spec: product.spec,
      price: product.price,
      quantity,
      colorBg: product.colorBg,
      image: product.image,
      selected: true,
      maxStock: product.stock
    })
  }
}

function addSkuToCart(product, sku, quantity = 1) {
  const cartId = sku && sku.id ? sku.id : product.id
  const existing = state.cart.find(item => item.productId === cartId)
  if (existing) {
    existing.quantity += quantity
    return
  }
  state.cart.push({
    productId: cartId,
    skuId: sku && sku.id ? sku.id : null,
    name: product.name,
    spec: sku && sku.spec ? sku.spec : product.spec,
    price: sku && sku.price ? sku.price : product.price,
    quantity,
    colorBg: product.colorBg,
    image: product.image,
    selected: true,
    maxStock: sku && sku.stock ? sku.stock : product.stock
  })
}

function removeFromCart(productId) {
  const idx = state.cart.findIndex(item => item.productId === productId)
  if (idx > -1) state.cart.splice(idx, 1)
}

function updateCartQuantity(productId, quantity) {
  const item = state.cart.find(item => item.productId === productId)
  if (item) item.quantity = Math.max(1, quantity)
}

function toggleSelect(productId) {
  const item = state.cart.find(item => item.productId === productId)
  if (item) item.selected = !item.selected
}

function toggleSelectAll(selected) {
  state.cart.forEach(item => { item.selected = selected })
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0)
}

function getSelectedItems() {
  return state.cart.filter(item => item.selected)
}

function getSelectedTotal() {
  return getSelectedItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

// 消息操作
function markMessageRead(id) {
  const msg = state.messages.find(m => m.id === id)
  if (msg && !msg.read) {
    msg.read = true
    state.unreadCount = state.messages.filter(m => !m.read).length
  }
}

function markAllRead() {
  state.messages.forEach(m => { m.read = true })
  state.unreadCount = 0
}

// 收藏操作
function toggleCollect(productId) {
  const product = state.products.find(p => p.id === productId)
  if (product) {
    product.isCollected = !product.isCollected
    if (product.isCollected) {
      state.user.collectCount++
    } else {
      state.user.collectCount--
    }
  }
}

const store = {
  state,
  addToCart,
  addSkuToCart,
  removeFromCart,
  updateCartQuantity,
  toggleSelect,
  toggleSelectAll,
  getCartCount,
  getSelectedItems,
  getSelectedTotal,
  markMessageRead,
  markAllRead,
  toggleCollect
}

export default {
  install(app) {
    app.config.globalProperties.$store = store
  }
}

export { store }
