<template>
  <div class="el-menu-horizontal-warp">
    <el-scrollbar
      @wheel.native.prevent="onElMenuHorizontalScroll"
      ref="elMenuHorizontalScrollRef">
      <el-menu
        router
        :default-active="state.defaultActive"
        :ellipsis="false"
        background-color="transparent"
        mode="horizontal">
        <template v-for="val in menuLists">
          <el-sub-menu
            :index="val.path"
            v-if="val.children && val.children.length > 0"
            :key="val.path">
            <template #title>
              <SvgIcon :name="val.meta.icon" />
              <span>{{ other.setMenuI18n(val) }}</span>
            </template>
            <SubItem :chil="val.children" />
          </el-sub-menu>
          <template v-else>
            <el-menu-item :index="val.path" :key="val.path">
              <template
                #title
                v-if="
                  !val.meta.isLink || (val.meta.isLink && val.meta.isIframe)
                ">
                <SvgIcon :name="val.meta.icon" />
                {{ other.setMenuI18n(val) }}
              </template>
              <template #title v-else>
                <a class="w100" @click.prevent="onALinkClick(val)">
                  <SvgIcon :name="val.meta.icon" />
                  {{ other.setMenuI18n(val) }}
                </a>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { useRoutesList } from '@stores/routesList'
import { useThemeConfig } from '@stores/themeConfig'
import other from '@utils/other'
import mittBus from '@utils/mitt'
defineOptions({ name: 'navMenuHorizontal' })
// 引入组件
const SubItem = defineAsyncComponent(
  () => import('@layouts/page-layouts/navMenu/subItem.vue')
)

// 定义父组件传过来的值
const props = defineProps({
  // 菜单列表
  menuList: {
    type: Array<RouteRecordRaw>,
    default: () => []
  }
})

// 定义变量内容
const elMenuHorizontalScrollRef = ref()
const stores = useRoutesList()
const storesThemeConfig = useThemeConfig()
const { routesList } = storeToRefs(stores)
const { themeConfig } = storeToRefs(storesThemeConfig)
const route = useRoute()
const state = reactive({
  defaultActive: '' as string | undefined
})

// 获取父级菜单数据
const menuLists = computed(() => {
  return <RouteItems>props.menuList
})
// 设置横向滚动条可以鼠标滚轮滚动
const onElMenuHorizontalScroll = (e: WheelEventType) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft =
    elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft + eventDelta / 4
}
// 初始化数据，页面刷新时，滚动条滚动到对应位置
const initElMenuOffsetLeft = () => {
  nextTick(() => {
    let els = <HTMLElement>(
      document.querySelector('.el-menu.el-menu--horizontal li.is-active')
    )
    if (!els) return false
    elMenuHorizontalScrollRef.value.$refs.wrapRef.scrollLeft = els.offsetLeft
  })
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
// 传送当前子级数据到菜单中
const setSendClassicChildren = (path: string) => {
  let currentData: MittMenu = { children: [] }
  if (!state.defaultActive) {
    const route = searchParent(routesList.value, path as string) as any
    state.defaultActive = route!.path
  }
  filterRoutesFun(routesList.value).map((v, k) => {
    if (v.path === state.defaultActive) {
      v['k'] = k
      currentData['item'] = { ...v }
      currentData['children'] = [{ ...v }]
      if (v.children) currentData['children'] = v.children
    }
  })
  return currentData
}
// 设置页面当前路由高亮
const setCurrentRouterHighlight = (currentRoute: RouteToFrom) => {
  const { path, meta } = currentRoute
  const route = searchParent(routesList.value, path as string) as any
  if (themeConfig.value.layout === 'classic') {
    if (route) {
      state.defaultActive = route!.path
    } else {
      state.defaultActive = `/${path?.split('/')[1]}`
    }
  } else {
    const pathSplit = meta?.isDynamic
      ? meta.isDynamicPath!.split('/')
      : path!.split('/')
    if (pathSplit.length >= 4 && meta?.isHide)
      state.defaultActive = pathSplit.splice(0, 3).join('/')
    else state.defaultActive = path
  }
}

// 使用递归查询对应的父级路由
const searchParent = (routesList: any, path: string) => {
  let route = undefined
  routesList.forEach((item) => {
    if (item.path === path) {
      route = item
      return
    }
    if (item.children && searchParent(item.children, path)) {
      route = item
      return
    }
  })
  return route
}

// 打开外部链接
const onALinkClick = (val: RouteItem) => {
  other.handleOpenLink(val)
}
// 页面加载前
onBeforeMount(() => {
  setCurrentRouterHighlight(route)
})
// 页面加载时
onMounted(() => {
  initElMenuOffsetLeft()
})
// 路由更新时
onBeforeRouteUpdate((to) => {
  setCurrentRouterHighlight(to)
  // 修复经典布局开启切割菜单时，点击tagsView后左侧导航菜单数据不变的问题
  let { layout, isClassicSplitMenu } = themeConfig.value
  if (layout === 'classic' && isClassicSplitMenu) {
    mittBus.emit('setSendClassicChildren', setSendClassicChildren(to.path))
  }
})
</script>

<style scoped lang="scss">
.el-menu-horizontal-warp {
  flex: 1;
  overflow: hidden;
  margin-right: 30px;
  :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
  }
  :deep(a) {
    width: 100%;
  }
  .el-menu.el-menu--horizontal {
    display: flex;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
