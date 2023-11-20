<template>
  <div class="layout-navbars-breadcrumb-index">
    <Logo v-if="setIsShowLogo" />
    <Breadcrumb />
    <Horizontal :menuList="state.menuList" v-if="isLayoutTransverse" />
    <User>
      <template #top-slot-1>
        <div @click="qrCode">
          <SvgIcon name="iconfont icon_yaoqingma" />
        </div>
      </template>
    </User>
  </div>
  <el-dialog v-model="showQrCode" width="30%">
    <template #header>二维码下载</template>
    <el-form v-model="qrCodeForm" class="px-[60px]">
      <el-form-item label="请选择服务商：" prop="id">
        <SpSelect v-model="qrCodeForm.id" />
      </el-form-item>
    </el-form>
    <div class="flex justify-center flex-col items-center mt-6 h-[200px]">
      <img
        v-show="qrCodeUrl && qrCodeUrl !== '1'"
        class="w-[200px]"
        :src="qrCodeUrl" />
      <span v-if="!qrCodeUrl">选择服务商后，可查看二维码</span>
    </div>
    <template #footer>
      <el-button type="primary" :disabled="!qrCodeUrl">
        <component :is="qrCodeUrl ? 'a' : 'span'" :href="qrCodeUrl" download>
          下载二维码
        </component>
      </el-button>
      <el-button @click="showQrCode = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="layoutBreadcrumbIndex">
import { useRoutesList } from '/@/stores/routesList'
import { useThemeConfig } from '/@/stores/themeConfig'
import spInfo from '/@/api/core/spInfo'
import mittBus from '/@/utils/mitt'
import baseUrl from '/@/configuration/base-url'

// 引入组件
const Breadcrumb = defineAsyncComponent(
  () => import('/@/layout/navBars/breadcrumb/breadcrumb.vue')
)
const User = defineAsyncComponent(
  () => import('/@/layout/navBars/breadcrumb/user.vue')
)
const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'))
const Horizontal = defineAsyncComponent(
  () => import('/@/layout/navMenu/horizontal.vue')
)

// 定义变量内容
const stores = useRoutesList()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const { routesList } = storeToRefs(stores)
const route = useRoute()
const state = reactive({
  menuList: [] as RouteItems
})
const qrCodeForm = ref({ id: '' })
const showQrCode = ref(false)
const qrCodeUrl = ref('')
const qrCode = async () => {
  showQrCode.value = true
}
watch(
  () => showQrCode.value,
  (showQrcode) =>
    !showQrcode && (qrCodeForm.value = { id: '' }) && (qrCodeUrl.value = '')
)
watch(
  () => qrCodeForm.value.id,
  async (id) => {
    if (!id) return
    qrCodeUrl.value = '1'
    try {
      const { data } = await $http.post(spInfo.qrCode, { id })
      qrCodeUrl.value = `${HOST}${baseUrl}/${data}`
    } catch (e) {
      console.log(e)
    }
  }
)

// 设置 logo 显示/隐藏
const setIsShowLogo = computed(() => {
  let { isShowLogo, layout } = themeConfig.value
  return (
    (isShowLogo && layout === 'classic') ||
    (isShowLogo && layout === 'transverse')
  )
})
// 设置是否显示横向导航菜单
const isLayoutTransverse = computed(() => {
  let { layout, isClassicSplitMenu } = themeConfig.value
  return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic')
})
// 设置/过滤路由（非静态路由/是否显示在菜单中）
const setFilterRoutes = () => {
  let { layout, isClassicSplitMenu } = themeConfig.value
  if (layout === 'classic' && isClassicSplitMenu) {
    state.menuList = delClassicChildren(filterRoutesFun(routesList.value))
    const resData = setSendClassicChildren(route.path)
    mittBus.emit('setSendClassicChildren', resData)
  } else {
    state.menuList = filterRoutesFun(routesList.value)
  }
}
// 设置了分割菜单时，删除底下 children
const delClassicChildren = <T extends ChilType>(arr: T[]): T[] => {
  arr.map((v: T) => {
    if (v.children) delete v.children
  })
  return arr
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
  const currentPathSplit = path.split('/')
  let currentData: MittMenu = { children: [] }
  filterRoutesFun(routesList.value).map((v: RouteItem, k: number) => {
    if (v.path === `/${currentPathSplit[1]}`) {
      v['k'] = k
      currentData['item'] = { ...v }
      currentData['children'] = [{ ...v }]
      if (v.children) currentData['children'] = v.children
    }
  })
  return currentData
}
// 页面加载时
onMounted(() => {
  setFilterRoutes()
  mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
    setFilterRoutes()
  })
})
// 页面卸载时
onUnmounted(() => {
  mittBus.off('getBreadcrumbIndexSetFilterRoutes', () => {})
})
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
  height: 50px;
  display: flex;
  align-items: center;
  background: var(--next-bg-topBar);
  border-bottom: 1px solid var(--next-border-color-light);
}
</style>
