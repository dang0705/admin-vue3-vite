<template>
  <div
    class="layout-logo !h-auto flex-col"
    v-if="setShowLogo"
    @click="onThemeConfigChange">
    <!--		<span>{{ themeConfig.globalTitle }}</span>-->
    <img :src="logo" class="w-[120px] my-[20px] menu-logo" />
    <hr class="w-full" style="color: #f4f7fe; opacity: 0.14" />
  </div>
  <div
    class="layout-logo flex justify-center items-center"
    v-else
    @click="onThemeConfigChange">
    <img :src="logoMini" class="layout-logo-size-img w-[20px]" />
  </div>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@stores/themeConfig'
import logo from '@/assets/menu-logo.webp'
import logoMini from '@/assets/logo-mini.webp'
import widthThrottle from '@configurations/width-throttle'
defineOptions({ name: 'layoutLogo' })
// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
  let { isCollapse, layout } = themeConfig.value
  return (
    !isCollapse ||
    layout === 'classic' ||
    document.body.clientWidth < widthThrottle
  )
})
// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
  if (themeConfig.value.layout === 'transverse') return false
  themeConfig.value.isCollapse = !themeConfig.value.isCollapse
}
</script>

<style scoped lang="scss">
.layout-logo {
  width: 220px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
  color: var(--el-color-primary);
  font-size: 16px;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  span {
    white-space: nowrap;
    display: inline-block;
    font-size: 21.5px;
    font-weight: 700;
    white-space: nowrap;
  }
  &:hover {
    span {
      color: var(--color-primary-light-2);
    }
  }
}
.layout-logo {
  width: 100%;
  height: 50px;
  display: flex;
  cursor: pointer;
  animation: logoAnimation 0.3s ease-in-out;
  &-img {
    width: 20px;
    margin: auto;
  }
  &:hover {
    img {
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}
</style>
