<template>
  <el-config-provider :size="getGlobalComponentSize" :locale="getGlobalI18n">
    <router-view v-show="setLockScreen" />
    <LockScreen v-if="themeConfig.isLockScreen" />
    <Setings ref="settingRef" v-show="themeConfig.lockScreenTime > 1" />
    <CloseFull v-if="!themeConfig.isLockScreen" />
  </el-config-provider>
</template>

<script setup lang="ts">
defineOptions({
  name: 'app'
})
import { useI18n } from 'vue-i18n'
import { useTagsViewRoutes } from '@stores/tagsViewRoutes'
import { useThemeConfig } from '@stores/themeConfig'
import other from '@utils/other'
import { Local, Session } from '@utils/storage'
import mittBus from '@utils/mitt'
import setIntroduction from '@utils/setIconfont'
import { ElLoading } from 'element-plus'
import isWindows from '@configurations/is-windows'
import Cookies from '@configurations/cookie'
import { useTokenStore } from '@stores/token'

// 存储token 信息
const token = Session.get('access_token')
if(!token) {
  const { accessToken, refreshToken } = storeToRefs(useTokenStore())
  const cookies = Cookies.get();
  accessToken.value = cookies.accesstoken;
  refreshToken.value = cookies.refreshtoken;
  Session.set('access_token', cookies.accesstoken)
  Session.set('refresh_token', cookies.refreshtoken)
  // 后续cookies写入原始登陆url后，也要记录到当前Session和store中
}

const fontSize = { small: '', big: '' }
fontSize.small = isWindows ? '12px' : '14px'
fontSize.big = isWindows ? '14px' : '16px'
document.documentElement.style.setProperty(
  '--el-font-size-base',
  fontSize.small
)
document.documentElement.style.setProperty(
  '--el-font-size-medium',
  fontSize.big
)
let loadingInstance: any = null
$bus.on('on-action-loading', () => {
  loadingInstance = ElLoading.service({ background: 'transparent' })
})
$bus.on('off-action-loading', () => {
  loadingInstance && loadingInstance.close()
})
// 引入组件
const LockScreen = defineAsyncComponent(
  () => import('@components/lockScreen/index.vue')
)
const Setings = defineAsyncComponent(
  () => import('@layouts/page-layouts/navBars/breadcrumb/setings.vue')
)
const CloseFull = defineAsyncComponent(
  () => import('@layouts/page-layouts/navBars/breadcrumb/closeFull.vue')
)

// 定义变量内容
const { messages, locale } = useI18n()
const settingRef = ref()
const route = useRoute()
const stores = useTagsViewRoutes()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 设置锁屏时组件显示隐藏
const setLockScreen = computed(() => {
  // 防止锁屏后，刷新出现不相关界面
  // https://gitee.com/lyt-top/vue-next-admin/issues/I6AF8P
  return themeConfig.value.isLockScreen
    ? themeConfig.value.lockScreenTime > 1
    : themeConfig.value.lockScreenTime >= 0
})

// 获取全局组件大小
const getGlobalComponentSize = computed(() => {
  return other.globalComponentSize()
})
// 获取全局 i18n
const getGlobalI18n = computed(() => {
  return messages.value[locale.value]
})
// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
  // 设置批量第三方 icon 图标
  setIntroduction.cssCdn()
  // 设置批量第三方 js
  setIntroduction.jsCdn()
})

// 页面加载时
onMounted(() => {
  nextTick(() => {
    // 监听布局配'置弹窗点击打开
    mittBus.on('openSetingsDrawer', () => {
      settingRef.value.openDrawer()
    })
    // 获取缓存中的布局配置
    if (Local.get('themeConfig')) {
      storesThemeConfig.setThemeConfig({
        themeConfig: Local.get('themeConfig')
      })
      document.documentElement.style.cssText = Local.get('themeConfigStyle')
    }
    // 获取缓存中的全屏配置
    if (Session.get('isTagsViewCurrenFull')) {
      stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'))
    }
  })
})
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
  mittBus.off('openSetingsDrawer', () => {})
})
// 监听路由的变化，设置网站标题
watch(
  () => route.path,
  () => {
    other.useTitle()
  },
  {
    deep: true
  }
)
</script>
