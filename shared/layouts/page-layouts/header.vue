<template>
  <el-header
    class="layout-header sticky top-0 z-[10] bg-white"
    v-show="!isTagsViewCurrenFull">
    <NavBarsIndex />
  </el-header>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useTagsViewRoutes } from '@stores/tagsViewRoutes'
defineOptions({ name: 'Layout-header' })
// 引入组件
const NavBarsIndex = defineAsyncComponent(
  () => import('@layouts/page-layouts/navBars/index.vue')
)

// 定义变量内容
const storesTagsViewRoutes = useTagsViewRoutes()
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes)
</script>
