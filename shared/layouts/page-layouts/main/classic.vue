<template>
  <el-container class="layout-container flex-center">
    <LayoutHeader />
    <el-container class="layout-mian-height-50">
      <LayoutAside />
      <div class="flex-center layout-backtop">
        <LayoutTagsView v-if="isTagsview" />
        <LayoutMain ref="layoutMainRef" />
      </div>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@stores/themeConfig'
defineOptions({ name: 'layoutClassic' })
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
const LayoutTagsView = defineAsyncComponent(
  () => import('@layouts/page-layouts/navBars/tagsView/tagsView.vue')
)

// 定义变量内容
const layoutMainRef = ref<InstanceType<typeof LayoutMain>>()
const route = useRoute()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 判断是否显示 tasgview
const isTagsview = computed(() => {
  return themeConfig.value.isTagsview
})
// 重置滚动条高度，更新子级 scrollbar
const updateScrollbar = () => {
  layoutMainRef.value?.layoutMainScrollbarRef.update()
}
// 重置滚动条高度，由于组件是异步引入的
const initScrollBarHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      updateScrollbar()
      // '!' not null 断言操作符，不执行运行时检查
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
