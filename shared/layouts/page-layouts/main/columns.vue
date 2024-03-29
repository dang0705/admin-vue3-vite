<template>
  <el-container class="layout-container">
    <ColumnsAside />
    <el-container class="layout-columns-warp layout-container-view h100">
      <LayoutAside />
      <el-scrollbar ref="layoutScrollbarRef" class="layout-backtop">
        <LayoutHeader />
        <LayoutMain ref="layoutMainRef" />
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@stores/themeConfig'
defineOptions({ name: 'Layout-columns' })
// 引入组件
const LayoutAside = defineAsyncComponent(
  () => import('@layouts/page-layouts/aside.vue')
)
const LayoutHeader = defineAsyncComponent(
  () => import('@layouts/page-layouts/header.vue')
)
const LayoutMain = defineAsyncComponent(
  () => import('@layouts/page-layouts/main.vue')
)
const ColumnsAside = defineAsyncComponent(
  () => import('@layouts/page-layouts/columnsAside.vue')
)

// 定义变量内容
const layoutScrollbarRef = ref<RefType>('')
const layoutMainRef = ref<InstanceType<typeof LayoutMain>>()
const route = useRoute()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 重置滚动条高度
const updateScrollbar = () => {
  // 更新父级 scrollbar
  layoutScrollbarRef.value.update()
  // 更新子级 scrollbar
  layoutMainRef.value!.layoutMainScrollbarRef.update()
}
// 重置滚动条高度，由于组件是异步引入的
const initScrollBarHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      updateScrollbar()
      layoutScrollbarRef.value.wrapRef.scrollTop = 0
      layoutMainRef.value!.layoutMainScrollbarRef.wrapRef.scrollTop = 0
    }, 500)
  })
}
// 页面加载时
onMounted(() => {
  initScrollBarHeight()
})
// 监听路由的变化，切换界面时，滚动条置顶
watch(
  () => route.path,
  () => {
    initScrollBarHeight()
  }
)
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(
  themeConfig,
  () => {
    updateScrollbar()
  },
  {
    deep: true
  }
)
</script>
