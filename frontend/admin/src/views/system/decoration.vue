<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">分类商城装修</div>
      <div class="page-actions">
        <el-button @click="resetDefault">恢复默认</el-button>
        <el-button type="primary" @click="saveConfig">保存配置并预览</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="main-row">
      <!-- 左侧商城列表 -->
      <el-col :span="5">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">商城列表</span>
            <el-button type="primary" link @click="addChannel">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
          <div class="channel-list">
            <div
              v-for="c in channels"
              :key="c.id"
              class="channel-item"
              :class="{ active: currentChannel.id === c.id }"
              @click="selectChannel(c)"
            >
              <div class="channel-color" :style="{ background: c.themeColor }"></div>
              <div class="channel-info">
                <div class="channel-name">{{ c.name }}</div>
                <div class="channel-tag">{{ c.tag }}</div>
              </div>
              <el-button type="danger" link @click.stop="removeChannel(c)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 中间配置 -->
      <el-col :span="9">
        <div class="panel config-panel">
          <div class="panel-header">
            <span class="panel-title">商城配置</span>
          </div>

          <el-form label-width="90px" class="base-form">
            <el-form-item label="商城名称">
              <el-input v-model="currentChannel.name" placeholder="如：诊所供货" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="currentChannel.tag" placeholder="如：基层诊所专属" />
            </el-form-item>
            <el-form-item label="主题色">
              <div class="color-picker-group">
                <div
                  v-for="color in themeColors"
                  :key="color.value"
                  class="color-item"
                  :class="{ active: currentChannel.themeColor === color.value }"
                  @click="setThemeColor(color.value)"
                >
                  <div class="color-block" :style="{ background: color.value }"></div>
                  <span>{{ color.name }}</span>
                </div>
              </div>
            </el-form-item>
          </el-form>

          <div class="module-section">
            <div class="module-section-header">
              <span class="panel-title">模块列表</span>
              <el-dropdown @command="addModule">
                <el-button type="primary" size="small">
                  <el-icon><Plus /></el-icon> 添加模块
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="banner">轮播图</el-dropdown-item>
                    <el-dropdown-item command="notice">公告通知</el-dropdown-item>
                    <el-dropdown-item command="category-grid">分类网格</el-dropdown-item>
                    <el-dropdown-item command="product-list">商品列表</el-dropdown-item>
                    <el-dropdown-item command="activity">活动专区</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div v-for="(module, idx) in currentChannel.modules" :key="idx" class="module-card">
              <div class="module-card-header">
                <span class="module-name">{{ moduleTypeLabel(module.type) }}</span>
                <div class="module-actions">
                  <el-button link size="small" @click="moveModule(idx, -1)">
                    <el-icon><ArrowUp /></el-icon>
                  </el-button>
                  <el-button link size="small" @click="moveModule(idx, 1)">
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <el-button type="danger" link size="small" @click="removeModule(idx)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>

              <div class="module-card-body">
                <!-- banner 模块 -->
                <template v-if="module.type === 'banner'">
                  <div v-for="(item, bIdx) in module.list" :key="bIdx" class="form-row banner-row">
                    <el-input v-model="item.title" placeholder="标题" size="small" />
                    <el-input v-model="item.desc" placeholder="描述" size="small" />
                    <el-input v-model="item.bg" placeholder="背景色" size="small" />
                    <el-button type="danger" link size="small" @click="removeBanner(idx, bIdx)">删除</el-button>
                  </div>
                  <el-button link size="small" @click="addBanner(idx)">+ 添加轮播</el-button>
                </template>

                <!-- notice 模块 -->
                <template v-else-if="module.type === 'notice'">
                  <el-input v-model="module.text" type="textarea" :rows="2" placeholder="公告内容" />
                </template>

                <!-- category-grid 模块 -->
                <template v-else-if="module.type === 'category-grid'">
                  <el-input v-model="module.title" placeholder="分类标题" size="small" class="mb-2" />
                  <div v-for="(cat, cIdx) in module.categories" :key="cIdx" class="form-row category-row">
                    <el-input v-model="cat.name" placeholder="分类名" size="small" />
                    <el-input v-model="cat.icon" placeholder="图标/emoji" size="small" />
                    <el-input v-model="cat.bg" placeholder="背景色" size="small" />
                    <el-button type="danger" link size="small" @click="removeCategory(idx, cIdx)">删除</el-button>
                  </div>
                  <el-button link size="small" @click="addCategory(idx)">+ 添加分类</el-button>
                </template>

                <!-- product-list 模块 -->
                <template v-else-if="module.type === 'product-list'">
                  <el-input v-model="module.title" placeholder="标题" size="small" class="mb-2" />
                  <el-select v-model="module.layout" size="small" class="mb-2" style="width: 100%">
                    <el-option label="双列网格" value="grid" />
                  </el-select>
                  <div v-for="(p, pIdx) in module.products" :key="pIdx" class="form-row product-row">
                    <el-input v-model="p.name" placeholder="商品名" size="small" />
                    <el-input v-model="p.spec" placeholder="规格" size="small" />
                    <el-input v-model="p.manufacturer" placeholder="厂家" size="small" />
                    <el-input-number v-model="p.price" :min="0" :precision="2" :step="1" size="small" />
                    <el-button type="danger" link size="small" @click="removeProduct(idx, pIdx)">删除</el-button>
                  </div>
                  <el-button link size="small" @click="addProduct(idx)">+ 添加商品</el-button>
                </template>

                <!-- activity 模块 -->
                <template v-else-if="module.type === 'activity'">
                  <el-input v-model="module.title" placeholder="标题" size="small" class="mb-2" />
                  <div v-for="(act, aIdx) in module.list" :key="aIdx" class="form-row activity-row">
                    <el-input v-model="act.title" placeholder="活动名" size="small" />
                    <el-input v-model="act.desc" placeholder="描述" size="small" />
                    <el-input v-model="act.type" placeholder="标签" size="small" />
                    <el-input v-model="act.bg" placeholder="背景色" size="small" />
                    <el-button type="danger" link size="small" @click="removeActivity(idx, aIdx)">删除</el-button>
                  </div>
                  <el-button link size="small" @click="addActivity(idx)">+ 添加活动</el-button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧预览 -->
      <el-col :span="10">
        <div class="panel preview-panel">
          <div class="panel-header">
            <span class="panel-title">手机预览</span>
            <el-button link @click="refreshPreview">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
          </div>
          <div class="phone-preview">
            <div class="phone-frame">
              <iframe
                ref="previewFrame"
                :src="previewUrl"
                frameborder="0"
                class="preview-iframe"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              ></iframe>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockMallChannels } from '@/mock/mockMallChannels.js'

const STORAGE_KEY = 'pharma_mall_channels'

const themeColors = [
  { name: '商务蓝', value: '#2563EB' },
  { name: '医药绿', value: '#10B981' },
  { name: '活力橙', value: '#F59E0B' },
  { name: '典雅紫', value: '#8B5CF6' },
  { name: '热情红', value: '#EF4444' },
  { name: '沉稳灰', value: '#64748B' },
]

const gradientMap = {
  '#2563EB': 'linear-gradient(180deg, #2563EB 0%, #3B82F6 100%)',
  '#10B981': 'linear-gradient(180deg, #10B981 0%, #34D399 100%)',
  '#F59E0B': 'linear-gradient(180deg, #F59E0B 0%, #FBBF24 100%)',
  '#8B5CF6': 'linear-gradient(180deg, #8B5CF6 0%, #A78BFA 100%)',
  '#EF4444': 'linear-gradient(180deg, #EF4444 0%, #F87171 100%)',
  '#64748B': 'linear-gradient(180deg, #64748B 0%, #94A3B8 100%)',
}

// 从 localStorage 读取或初始化
const saved = localStorage.getItem(STORAGE_KEY)
const channels = reactive(saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(mockMallChannels)))

const currentChannel = ref(channels[0])
const previewTimestamp = ref(Date.now())
const previewFrame = ref(null)

const previewUrl = computed(() => {
  return `http://localhost:5174/#/pages/mall/channel?id=${currentChannel.value.id}&t=${previewTimestamp.value}`
})

function moduleTypeLabel(type) {
  const map = {
    banner: '轮播图',
    notice: '公告通知',
    'category-grid': '分类网格',
    'product-list': '商品列表',
    activity: '活动专区'
  }
  return map[type] || type
}

function selectChannel(c) {
  currentChannel.value = c
}

function addChannel() {
  const id = 'mall_' + Date.now()
  const newChannel = {
    id,
    name: '新建商城',
    tag: '自定义商城',
    icon: 'shop',
    themeColor: '#2563EB',
    themeGradient: gradientMap['#2563EB'],
    textColor: '#FFFFFF',
    modules: []
  }
  channels.push(newChannel)
  currentChannel.value = newChannel
}

function removeChannel(c) {
  ElMessageBox.confirm(`确定删除商城「${c.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = channels.indexOf(c)
    if (idx > -1) {
      channels.splice(idx, 1)
      currentChannel.value = channels[0] || null
      ElMessage.success('已删除')
    }
  })
}

function setThemeColor(color) {
  currentChannel.value.themeColor = color
  currentChannel.value.themeGradient = gradientMap[color] || `linear-gradient(180deg, ${color} 0%, ${color} 100%)`
}

function addModule(type) {
  const base = { type }
  if (type === 'banner') {
    base.list = [{ title: '新轮播', desc: '描述文案', bg: 'linear-gradient(135deg, #2563EB, #60A5FA)', text: '#FFFFFF', image: '' }]
  } else if (type === 'notice') {
    base.text = '公告内容'
  } else if (type === 'category-grid') {
    base.title = '分类标题'
    base.categories = [{ name: '分类1', icon: 'pill', bg: '#DBEAFE' }]
  } else if (type === 'product-list') {
    base.title = '商品列表'
    base.layout = 'grid'
    base.products = [{ id: 'P' + Date.now(), name: '商品名称', spec: '规格', manufacturer: '厂家', price: 0, sales: 0, image: '' }]
  } else if (type === 'activity') {
    base.title = '活动专区'
    base.list = [{ title: '活动名称', desc: '活动描述', bg: '#DBEAFE', text: '#1D4ED8', type: '满减' }]
  }
  currentChannel.value.modules.push(base)
}

function removeModule(idx) {
  currentChannel.value.modules.splice(idx, 1)
}

function moveModule(idx, direction) {
  const modules = currentChannel.value.modules
  const target = idx + direction
  if (target < 0 || target >= modules.length) return
  const temp = modules[idx]
  modules[idx] = modules[target]
  modules[target] = temp
}

function addBanner(moduleIdx) {
  currentChannel.value.modules[moduleIdx].list.push({ title: '新轮播', desc: '描述文案', bg: 'linear-gradient(135deg, #2563EB, #60A5FA)', text: '#FFFFFF', image: '' })
}

function removeBanner(moduleIdx, bannerIdx) {
  currentChannel.value.modules[moduleIdx].list.splice(bannerIdx, 1)
}

function addCategory(moduleIdx) {
  currentChannel.value.modules[moduleIdx].categories.push({ name: '新分类', icon: 'pill', bg: '#DBEAFE' })
}

function removeCategory(moduleIdx, catIdx) {
  currentChannel.value.modules[moduleIdx].categories.splice(catIdx, 1)
}

function addProduct(moduleIdx) {
  currentChannel.value.modules[moduleIdx].products.push({ id: 'P' + Date.now(), name: '新商品', spec: '规格', manufacturer: '厂家', price: 0, sales: 0, image: '' })
}

function removeProduct(moduleIdx, prodIdx) {
  currentChannel.value.modules[moduleIdx].products.splice(prodIdx, 1)
}

function addActivity(moduleIdx) {
  currentChannel.value.modules[moduleIdx].list.push({ title: '新活动', desc: '描述', bg: '#DBEAFE', text: '#1D4ED8', type: '满减' })
}

function removeActivity(moduleIdx, actIdx) {
  currentChannel.value.modules[moduleIdx].list.splice(actIdx, 1)
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
  // 通过 postMessage 把配置推送给预览 iframe，iframe 接收后写入 localStorage 再刷新
  const iframe = previewFrame.value
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { type: 'mallChannelsPreview', channels: JSON.parse(JSON.stringify(channels)) },
      '*'
    )
  }
  setTimeout(() => {
    refreshPreview()
  }, 300)
  ElMessage.success('配置已保存，预览已刷新')
}

function refreshPreview() {
  previewTimestamp.value = Date.now()
  nextTick(() => {
    if (previewFrame.value) {
      previewFrame.value.contentWindow.location.reload()
    }
  })
}

function resetDefault() {
  ElMessageBox.confirm('确定恢复默认配置吗？当前修改将丢失。', '提示', { type: 'warning' }).then(() => {
    const defaults = JSON.parse(JSON.stringify(mockMallChannels))
    channels.splice(0, channels.length, ...defaults)
    currentChannel.value = channels[0]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels))
    refreshPreview()
    ElMessage.success('已恢复默认')
  })
}
</script>

<style scoped lang="scss">
.page-container {
  padding: 24px;
  background: #f5f6fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
  }

  .page-actions {
    display: flex;
    gap: 12px;
  }
}

.main-row {
  align-items: flex-start;
}

.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 16px;
  min-height: calc(100vh - 160px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;

  .panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
  }
}

.channel-list {
  .channel-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 8px;

    &:hover {
      background: #F9FAFB;
    }

    &.active {
      background: #EFF6FF;
    }

    .channel-color {
      width: 12px;
      height: 40px;
      border-radius: 6px;
      margin-right: 12px;
    }

    .channel-info {
      flex: 1;

      .channel-name {
        font-size: 14px;
        font-weight: 600;
        color: #1F2937;
      }

      .channel-tag {
        font-size: 12px;
        color: #6B7280;
        margin-top: 2px;
      }
    }
  }
}

.base-form {
  margin-bottom: 20px;
}

.color-picker-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  border: 2px solid transparent;
  transition: border-color 0.2s;

  &.active {
    border-color: #2563EB;
  }

  .color-block {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  span {
    font-size: 12px;
    color: #6B7280;
  }
}

.module-section {
  .module-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}

.module-card {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;

  .module-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #F9FAFB;
    border-bottom: 1px solid #E5E7EB;

    .module-name {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .module-actions {
      display: flex;
      gap: 4px;
    }
  }

  .module-card-body {
    padding: 16px;
  }
}

.form-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;

  .el-input {
    flex: 1;
  }

  .el-input-number {
    width: 120px;
    flex-shrink: 0;
  }
}

.mb-2 {
  margin-bottom: 8px;
}

.preview-panel {
  display: flex;
  flex-direction: column;
}

.phone-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.phone-frame {
  width: 320px;
  height: 680px;
  border: 12px solid #1F2937;
  border-radius: 36px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
