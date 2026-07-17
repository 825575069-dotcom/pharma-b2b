import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store/index.js'
import authStore from './store/auth.js'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.config.globalProperties.$auth = authStore
  return { app }
}
