import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './styles/global.scss'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 恢复登录态：有 token 则拉取最新用户信息，失败则清退
import { useUserStore } from './stores/user'
const userStore = useUserStore()
if (userStore.token) {
  userStore.fetchMe().catch(() => userStore.logout())
}

app.mount('#app')
