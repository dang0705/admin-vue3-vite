<template>
  <template v-for="val in chils">
    <el-sub-menu
      :index="val.path"
      :key="val.path"
      v-if="val.children && val.children.length > 0">
      <template #title>
        <SvgIcon :name="val.meta.icon" />
        <span>{{ other.setMenuI18n(val) }}</span>
      </template>
      <sub-item :chil="val.children" />
    </el-sub-menu>

    <template v-else>
      <el-menu-item
        :index="val.path"
        :key="val.path"
        @click="$router.push({ path: val.path, state: { refresh: 1 } })">
        <template
          v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
          <SvgIcon :name="val.meta.icon" />
          <span>{{ other.setMenuI18n(val) }}</span>
        </template>
        <template v-else>
          <a class="w100" @click.prevent="onALinkClick(val)">
            <SvgIcon :name="val.meta.icon" />
            {{ other.setMenuI18n(val) }}
          </a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import other from '@utils/other'
defineOptions({ name: 'navMenuSubItem' })
// 定义父组件传过来的值
const props = defineProps({
  // 菜单列表
  chil: {
    type: Array<RouteRecordRaw>,
    default: () => []
  }
})

// 获取父级菜单数据
const chils = computed(() => {
  return <RouteItems>props.chil
})
// 打开外部链接
const onALinkClick = (val: RouteItem) => {
  other.handleOpenLink(val)
}
</script>
