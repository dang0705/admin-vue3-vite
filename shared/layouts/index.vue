<template>
  <component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@stores/themeConfig'
import { Local } from '@utils/storage'
import mittBus from '@utils/mitt'
import widthThrottle from '@configurations/width-throttle'

defineOptions({ name: 'Layout' })
// 引入组件
const layouts: any = {
  defaults: defineAsyncComponent(
    () => import('@layouts/page-layouts/main/defaults.vue')
  ),
  classic: defineAsyncComponent(
    () => import('@layouts/page-layouts/main/classic.vue')
  ),
  transverse: defineAsyncComponent(
    () => import('@layouts/page-layouts/main/transverse.vue')
  ),
  columns: defineAsyncComponent(
    () => import('@layouts/page-layouts/main/columns.vue')
  )
}

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
  if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout)
  const clientWidth = document.body.clientWidth
  if (clientWidth < widthThrottle) {
    themeConfig.value.isCollapse = false
    mittBus.emit('layoutMobileResize', {
      layout: 'defaults',
      clientWidth
    })
  } else {
    mittBus.emit('layoutMobileResize', {
      layout: Local.get('oldLayout')
        ? Local.get('oldLayout')
        : themeConfig.value.layout,
      clientWidth
    })
  }
}
// 页面加载前
onBeforeMount(() => {
  onLayoutResize()
  window.addEventListener('resize', onLayoutResize)
})
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', onLayoutResize)
})
</script>
