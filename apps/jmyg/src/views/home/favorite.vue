<template>
  <el-row :gutter="10" v-if="comparedFavorite.length > 0">
    <el-col
      class="shortcutCard"
      v-bind="{ xl: 6, lg: 8, sm: 12 }"
      :key="shortcut.id"
      v-for="shortcut in comparedFavorite">
      <SvgIcon
        name="ele-Close"
        :size="12"
        class="shortcutCardClose"
        @click="handleCloseFavorite(shortcut)" />
      <shortcutCard
        :icon="shortcut.meta?.icon"
        :label="shortcut.name"
        @click="handleRoute(shortcut.path)" />
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useTagsViewRoutes } from '@stores/tagsViewRoutes'
import shortcutCard from '@components/ShortcutCard/index.vue'
defineOptions({ name: 'SysFavoriteDashboard' })
/**
 * 获取路由对象的实例。
 */
const router = useRouter()

/**
 * 获取 tagsView 路由列表 store 对象的实例。
 */
const storesTagsViewRoutes = useTagsViewRoutes()
const { comparedFavorite } = storeToRefs(storesTagsViewRoutes) // 将 tagView 路由列表转换为 Ref 对象

/**
 * 点击跳转链接触发事件的回调函数。
 * @param path - 需要跳转的路径。
 */
const handleRoute = (path: string) => {
  router.push(path) // 跳转到指定路由页面
}

/**
 * 关闭收藏路由的事件回调函数。
 * @param item - 需要删除的路由信息。
 */
const handleCloseFavorite = (item: any) => {
  storesTagsViewRoutes.delFavoriteRoutes(item) // 从收藏路由列表中删除指定路由
}
</script>

<style lang="scss" scoped>
.shortcutCard {
  position: relative;
  .shortcutCardClose {
    position: absolute;
    top: 0;
    right: 30%;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
    color: #6d6b6b;
  }
}
</style>
