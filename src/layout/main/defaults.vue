<template>
  <el-container class="layout-container">
    <LayoutAside />
    <el-container class="layout-container-view h100">
      <el-scrollbar ref="layoutScrollbarRef" class="layout-backtop">
        <LayoutHeader />
        <LayoutMain ref="layoutMainRef" />
      </el-scrollbar>
    </el-container>
    <el-drawer v-model="tableDrawer.show">
      <Table-view v-bind="tableDrawer.props" v-model="tableSelections">
        <template
          v-for="{ headerSlot, prop } in tableSlots"
          #[`${prop}-header`]="{ row }">
          <TableSlot
            :slot-function="headerSlot"
            :selections="tableSelections"
            :row="row"
            :key="`${prop}-header`" />
        </template>
        <template v-for="{ slot, prop } in tableSlots" #[prop]="{ row }">
          <TableSlot
            :slot-function="slot"
            :selections="tableSelections"
            :row="row"
            :key="prop" />
        </template>
      </Table-view>
    </el-drawer>
    <el-drawer v-model="formDrawer.show">
      <Form-view v-bind="formDrawer.props"></Form-view>
    </el-drawer>
  </el-container>
</template>

<script setup lang="ts">
import { useThemeConfig } from '/@/stores/themeConfig'
import { NextLoading } from '/@/utils/loading'
defineOptions({ name: 'Layout-defaults' })
const tableDrawer = reactive({
  show: false,
  props: {},
  slots: []
})
const formDrawer = reactive({
  show: false,
  props: {},
  slots: []
})
const tableSelections = ref([])
const tableSlots = computed(() => [
  ...tableDrawer.slots,
  ...tableDrawer.props.columns.filter(({ slot = false }) => slot)
])
const tableHeaderSlots = computed(() =>
  tableDrawer.props.columns.filter(({ headerSlot = false }) => headerSlot)
)

const formSlots = computed(() => [
  ...formDrawer.slots,
  ...formDrawer.props.columns.filter(({ slot = false }) => slot)
])

$bus.on('open-form-drawer', (formProps: any = {}) => {
  formDrawer.show = true
  formDrawer.props = formProps.props
  formDrawer.slots = formProps.slots || []
})
$bus.on('open-table-drawer', (tableProps: any = {}) => {
  tableDrawer.show = true
  tableDrawer.props = tableProps.props
  tableDrawer.slots = tableProps.slots || []
})
// 引入组件
const LayoutAside = defineAsyncComponent(
  () => import('/@/layout/component/aside.vue')
)
const LayoutHeader = defineAsyncComponent(
  () => import('/@/layout/component/header.vue')
)
const LayoutMain = defineAsyncComponent(
  () => import('/@/layout/component/main.vue')
)

// 定义变量内容
const layoutScrollbarRef = ref<RefType>('')
const layoutMainRef = ref<InstanceType<typeof LayoutMain>>()
const route = useRoute()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 重置滚动条高度
const updateScrollbar = () => {
  // 更新父级 scrollbar
  layoutScrollbarRef.value.update()
  // 更新子级 scrollbar
  layoutMainRef.value!.layoutMainScrollbarRef.update()
}
// 重置滚动条高度，由于组件是异步引入的
const initScrollBarHeight = () => {
  nextTick(() => {
    setTimeout(() => {
      updateScrollbar()
      layoutScrollbarRef.value.wrapRef.scrollTop = 0
      layoutMainRef.value!.layoutMainScrollbarRef.wrapRef.scrollTop = 0
    }, 500)
  })
}
// 页面加载时
onMounted(() => {
  initScrollBarHeight()
  NextLoading.done(600)
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
