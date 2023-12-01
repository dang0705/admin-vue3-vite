<template>
  <div class="top-right-btn" :style="style">
    <el-row>
      <slot />
      <!-- 搜索框控制 -->
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
        v-if="search">
        <el-button
          style="
            width: 32px;
            height: 32px;
            border: 1px solid #e7e7e7;
            border-radius: 100px 0 0 100px;
          "
          :icon="showSearch ? 'ArrowUp' : 'ArrowDown'"
          @click="toggleSearch" />
      </el-tooltip>
    </el-row>
  </div>
</template>

<script setup>
defineOptions({ name: 'Right-toolbar' })
/**
 * 通过 defineProps 函数定义组件 props
 */
const props = defineProps({
  /**
   * 是否显示搜索框
   */
  showSearch: {
    type: Boolean,
    default: true
  },
  /**
   * 是否导出
   */
  export: {
    type: [String, Boolean],
    default: null
  },
  /**
   * 是否显示搜索框
   */
  search: {
    type: Boolean,
    default: true
  },
  /**
   * 列表项之间的间距
   */
  gutter: {
    type: Number,
    default: 10
  }
})

const emits = defineEmits(['update:showSearch', 'queryTable', 'exportExcel'])

const style = computed(() => {
  const ret = {}
  // 如果props中有传入gutter属性，则计算出marginRight
  if (props.gutter) {
    // ret.marginRight = `${props.gutter / 2}px`;
  }
  return ret // 返回计算后的样式对象
})

// 搜索
const toggleSearch = () => {
  emits('update:showSearch', !props.showSearch)
}
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
  border-radius: 50%;
  display: block;
  margin-left: 0;
}

:deep(.el-transfer__button:first-child) {
  margin-bottom: 10px;
}

.my-el-transfer {
  text-align: center;
}
</style>
