<template>
  <image
    class="wx-icon"
    :src="src"
    :style="iconStyle"
    mode="aspectFit"
    @click="$emit('tap')"
  />
</template>

<script>
export default {
  name: 'WxIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [String, Number], default: 40 },
    width: { type: [String, Number], default: null },
    height: { type: [String, Number], default: null }
  },
  emits: ['tap'],
  computed: {
    src() {
      return `/static/icons/${this.name}.png`
    },
    iconStyle() {
      const s = Number(this.size) || 40
      const w = this.width ? Number(this.width) : s
      const h = this.height ? Number(this.height) : s
      const toPx = (val) => {
        const num = Number(val)
        return isNaN(num) ? val : uni.upx2px(num) + 'px'
      }
      return {
        width: toPx(w),
        height: toPx(h),
        display: 'inline-block',
        verticalAlign: 'middle'
      }
    }
  }
}
</script>

<style scoped>
.wx-icon {
  flex-shrink: 0;
}
</style>
