<template>
  <div class="h100" v-show="!isTagsViewCurrenFull">
    <el-aside class="layout-aside" :class="setCollapseStyle">
      <Logo v-if="setShowLogo" />
      <el-scrollbar
        class="flex-auto"
        ref="layoutAsideScrollbarRef"
        @mouseenter="onAsideEnterLeave(true)"
        @mouseleave="onAsideEnterLeave(false)">
        <Vertical :menuList="state.menuList" />
      </el-scrollbar>
    </el-aside>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  reactive,
  computed,
  watch,
  onBeforeMount,
  ref
} from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '@stores/index'
import { useRoutesList } from '@stores/routesList'
import { useThemeConfig } from '@stores/themeConfig'
import { useTagsViewRoutes } from '@stores/tagsViewRoutes'
import mittBus from '@utils/mitt'
import { useI18n } from 'vue-i18n'
import widthThrottle from '@configurations/width-throttle'
defineOptions({ name: 'Layout-aside' })
// 引入组件
const Logo = defineAsyncComponent(() => import('@layouts/logo/index.vue'))
const Vertical = defineAsyncComponent(
  () => import('@layouts/page-layouts/navMenu/vertical.vue')
)
const { locale } = useI18n()
// 定义变量内容
const layoutAsideScrollbarRef = ref()
const stores = useRoutesList()
const storesThemeConfig = useThemeConfig()
const storesTagsViewRoutes = useTagsViewRoutes()
const { routesList } = storeToRefs(stores)
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes)
const state = reactive<AsideState>({
  menuList: [],
  clientWidth: 0
})

// 设置菜单展开/收起时的宽度
const setCollapseStyle = computed(() => {
  const { layout, isCollapse, menuBar } = themeConfig.value
  const asideBrTheme = ['#FFFFFF', '#FFF', '#fff', '#ffffff']
  const asideBrColor = asideBrTheme.includes(menuBar)
    ? 'layout-el-aside-br-color'
    : ''
  // 判断是否是手机端
  if (state.clientWidth <= widthThrottle) {
    if (isCollapse) {
      document.body.setAttribute('class', 'el-popup-parent--hidden')
      const asideEle = document.querySelector(
        '.layout-container'
      ) as HTMLElement
      const modeDivs = document.createElement('div')
      modeDivs.setAttribute('class', 'layout-aside-mobile-mode')
      asideEle.appendChild(modeDivs)
      modeDivs.addEventListener('click', closeLayoutAsideMobileMode)
      return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open']
    } else {
      // 关闭弹窗
      closeLayoutAsideMobileMode()
      return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close']
    }
  } else {
    return [
      asideBrColor,
      layout === 'columns'
        ? isCollapse
          ? 'layout-aside-pc-1'
          : locale.value === 'en'
          ? 'layout-aside-pc-250'
          : 'layout-aside-pc-220'
        : isCollapse
        ? 'layout-aside-pc-64'
        : locale.value === 'en'
        ? 'layout-aside-pc-250'
        : 'layout-aside-pc-220'
    ]
  }
})
// 设置显示/隐藏 logo
const setShowLogo = computed(() => {
  let { layout, isShowLogo } = themeConfig.value
  return (
    (isShowLogo && layout === 'defaults') ||
    (isShowLogo && layout === 'columns')
  )
})
// 关闭移动端蒙版
const closeLayoutAsideMobileMode = () => {
  const el = document.querySelector('.layout-aside-mobile-mode')
  el?.setAttribute('style', 'animation: error-img-two 0.3s')
  setTimeout(() => {
    el?.parentNode?.removeChild(el)
  }, 300)
  const clientWidth = document.body.clientWidth
  if (clientWidth < widthThrottle) themeConfig.value.isCollapse = false

  document.body.setAttribute('class', '')
}
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
  if (themeConfig.value.layout === 'columns') return false
  state.menuList = filterRoutesFun(routesList.value)
}
// 路由过滤递归函数
const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
  return arr
    .filter((item: T) => !item.meta?.isHide)
    .map((item: T) => {
      item = Object.assign({}, item)
      if (item.children) item.children = filterRoutesFun(item.children)
      return item
    })
}
// 设置菜单导航是否固定（移动端）
const initMenuFixed = (clientWidth: number) => {
  state.clientWidth = clientWidth
}
// 鼠标移入、移出
const onAsideEnterLeave = (bool: Boolean) => {
  let { layout } = themeConfig.value
  if (layout !== 'columns') return false
  if (!bool) mittBus.emit('restoreDefault')
  stores.setColumnsMenuHover(bool)
}
// 页面加载前
onBeforeMount(() => {
  initMenuFixed(document.body.clientWidth)
  setFilterRoutes()
  // 此界面不需要取消监听(mittBus.off('setSendColumnsChildren))
  // 因为切换布局时有的监听需要使用，取消了监听，某些操作将不生效
  mittBus.on('setSendColumnsChildren', (res: MittMenu) => {
    state.menuList = res.children
  })
  mittBus.on('setSendClassicChildren', (res: MittMenu) => {
    let { layout, isClassicSplitMenu } = themeConfig.value
    if (layout === 'classic' && isClassicSplitMenu) {
      state.menuList = []
      state.menuList = res.children
    }
  })
  mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
    setFilterRoutes()
  })
  mittBus.on('layoutMobileResize', (res: LayoutMobileResize) => {
    initMenuFixed(res.clientWidth)
    closeLayoutAsideMobileMode()
  })
})
// 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
watch(themeConfig.value, (val) => {
  if (val.isShowLogoChange !== val.isShowLogo) {
    if (layoutAsideScrollbarRef.value) layoutAsideScrollbarRef.value.update()
  }
})
// 监听 pinia 值的变化，动态赋值给菜单中
watch(
  pinia.state,
  (val) => {
    let { layout, isClassicSplitMenu } = val.themeConfig.themeConfig
    if (layout === 'classic' && isClassicSplitMenu) return false
    setFilterRoutes()
  },
  {
    deep: true
  }
)
</script>
<style>
.el-menu {
  padding: 0 10px;
}
.el-sub-menu:not(.is-opened).is-active .el-sub-menu__title span {
  @apply text-primary;
}
.el-menu-item:hover,
.el-menu-item.is-active,
.el-menu-hover-bg-color,
.el-sub-menu:not(.is-opened):not(.is-active):hover .el-sub-menu__title {
  box-sizing: border-box;
  background-image: linear-gradient(
    90deg,
    #273045 0%,
    #4d5466 50%,
    #273045 100%
  ) !important;
  background-color: transparent !important;
  position: relative;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    left: 0;
    height: 1.5px;
    background-image: radial-gradient(circle, #fff, transparent);
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
}
</style>
