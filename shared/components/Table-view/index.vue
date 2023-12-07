<template>
  <div :class="{ 'layout-padding': !noPadding }">
    <div
      :class="{
        'layout-padding-auto': !noPadding,
        'layout-padding-view': !noPadding,
        '!border-none': !border
      }">
      <slot
        name="tableTop"
        v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }" />
      <Tab-view
        v-if="isTab && newTabs.length"
        :model-value="tabValue"
        :tabs="newTabs"
        @get-value="handleTabClick">
        <template v-for="(_, slot) in $slots" #[slot]>
          <slot :name="slot" :refresh="resetQuery" />
        </template>
      </Tab-view>
      <div
        :class="[
          'w-full',
          'relative',
          'z-[3]',
          {
            'mb-[10px]': isShowTopBar
              ? hasTopBarSlot ||
                (downBlobFileUrl && userInfos.permissionMap[exportAuth])
              : false
          }
        ]">
        <ul
          :class="['flex', 'relative', 'w-full', 'mt-[10px]']"
          v-if="conditionForms.length">
          <li v-show="showSearch" :class="['flex-grow', 'mr-[30px]']">
            <Form-view
              v-model="state.queryForm"
              :label-width="labelWidth"
              :forms="conditionForms"
              :on-submit="getDataList"
              :on-cancel="resetQuery"
              :validation="false"
              :buttons-icon="['Search', 'Refresh']"
              submit-button-text="查询"
              cancel-button-text="重置">
              <template v-for="(_, slot) in $slots" #[slot]>
                <slot
                  :name="slot"
                  v-bind="{
                    form: conditionForms,
                    formData: state.queryForm
                  }" />
              </template>
            </Form-view>
          </li>
          <li style="right: -10px" :class="['absolute']">
            <el-tooltip
              class="item"
              effect="dark"
              :content="showSearch ? '隐藏搜索' : '显示搜索'"
              placement="top">
              <el-button
                style="
                  width: 32px;
                  height: 32px;
                  border: 1px solid #e7e7e7;
                  border-radius: 2px;
                "
                :icon="showSearch ? 'ArrowUp' : 'ArrowDown'"
                @click="showSearch = !showSearch" />
            </el-tooltip>
          </li>
        </ul>
        <slot
          name="tableTopTwo"
          v-bind="{
            refresh: resetQuery,
            otherInfo: state.otherInfo
          }" />
        <div
          v-if="
            (downBlobFileUrl && userInfos.permissionMap[exportAuth]) ||
            (hasTopBarSlot && isShowTopBar)
          "
          style="line-height: 0"
          :class="['top-bar', 'flex', 'items-center', 'justify-between']">
          <div class="flex items-center flex-grow flex-wrap">
            <el-button
              v-if="downBlobFileUrl && userInfos.permissionMap[exportAuth]"
              v-debounce="getExcel"
              icon="download"
              type="primary"
              class="export">
              批量导出
            </el-button>
            <div class="flex items-center flex-1 top-bar-extra-buttons">
              <slot
                name="top-bar"
                v-bind="{
                  refresh: resetQuery,
                  otherInfo: state.otherInfo,
                  query: state.queryForm,
                  selectObjs: selectObjs,
                  downParams: downParams
                }" />
            </div>
          </div>
        </div>
      </div>
      <el-skeleton :loading="state.loading">
        <template #default>
          <el-table
            id="tableRef"
            v-bind="props"
            :class="['table-view', { 'no-border': !border }]"
            :data="tableData.length > 0 ? tableData : state.dataList"
            :cell-style="tableStyle.cellStyle"
            :show-header="header"
            :row-key="selectMainKey"
            :header-cell-style="tableStyle.headerCellStyle"
            @selection-change="onSelectionChange">
            <el-table-column type="index" width="50" fixed="left" v-if="drag">
              <template #header>
                <el-tooltip content="序号" placement="top">#</el-tooltip>
              </template>
              <template #default="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="" width="50" v-if="drag">
              <template #header>
                <el-icon>
                  <el-tooltip content="拖动排序" placement="top">
                    <WarningFilled />
                  </el-tooltip>
                </el-icon>
              </template>
              <template #default>
                <div class="move" style="cursor: move">
                  <el-icon>
                    <Sort />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
            <template #empty v-if="hasEmptySlot">
              <slot name="empty" />
            </template>
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :formatter="tableCellFormatter"
              v-bind="{
                showOverflowTooltip: !(
                  column.showOverflowTooltip || column.label === '操作'
                ),
                ...column
                // ...(column.label === '操作' ? { renderHeader } : null),
              }"
              :minWidth="getTableColumnWidth(column)">
              <template
                v-if="column.headerSlot"
                #header="{ $index, column: headerColumn }">
                <slot :name="`${column.prop}-header`" :refresh="resetQuery">
                  <TableSlot
                    has-data
                    :list="state.dataList"
                    :slot-function="column.headerSlot"
                    :selections="selectObjs"
                    :row="column"
                    :column="headerColumn"
                    :index="$index"
                    :confirm="confirm"
                    :refresh="resetQuery" />
                </slot>
              </template>
              <template
                v-if="column.slot || column.value || column.options"
                v-slot="{ row }">
                <slot
                  :name="column.prop"
                  :row="row"
                  :list="state.dataList"
                  :confirm="confirm"
                  :refresh="resetQuery">
                  <template v-if="column.value">
                    {{ column.value(row) }}
                  </template>
                  <template v-if="column.options">
                    <Tag
                      :type="row[column.prop + '_obj']?.type"
                      :text="row[column.prop + '_obj']?.text" />
                  </template>
                  <TableSlot
                    v-else-if="helpers.isFunction(column.slot)"
                    has-data
                    :slot-function="column.slot"
                    :selections="selectObjs"
                    :row="row"
                    :confirm="confirm"
                    :refresh="resetQuery" />
                </slot>
                <TableActions
                  v-if="column.prop === 'actions'"
                  :row="row"
                  :list="state.dataList"
                  :action-body="actionBody"
                  :del-fn-name="delObj"
                  :actionsOrigin="actions"
                  :main-key="selectMainKey"
                  :handlers="apis[`/src/api/${module}`]"
                  @get-dialog-data="getDialogData" />
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="!noPagination"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            v-bind="state.pagination" />
          <slot name="bottomActions" :list="state.dataList"></slot>
        </template>
      </el-skeleton>
    </div>
    <slot />
    <Dialog
      v-model="showDialog"
      v-model:form-data="dialogFormData"
      append-to-body
      v-bind="_dialog"
      :columns="24"
      :on-submit="onDialogSubmit" />
  </div>
</template>

<script setup lang="ts">
import tableViewProps from './props'
import TableActions from '@components/Table-view/Table-actions.vue'
import apis from '@jmyg/api'
import helpers from '@utils/helpers'
import getTableColumnWidth from './utils/get-column-width'
import tableCellFormatter from './utils/format-amount-cells'
import useExportExcel from './utils/export-excel'
import useConfirm from './utils/confirm'
import { BasicTableProps, useTable } from '@hooks/table'
import { useUserInfo } from '@stores/userInfo'
defineOptions({ name: 'TableView', inheritAttrs: false })
const $route = useRoute()
const { userInfos } = storeToRefs(useUserInfo())
const TabView = defineAsyncComponent(() => import('./Tab-view.vue'))

const emit = defineEmits(['update:modelValue', 'get-tab-value'])
const props = defineProps(tableViewProps)
const showDialog = ref(false)
const _dialog = ref({})
const dialogFormData = ref({})

const slots = useSlots()
const hasEmptySlot = !!slots.empty
const hasTopBarSlot = !!slots['top-bar']

const module = computed(() =>
  props.module?.includes('.') && props.module?.split('.')[1] !== ''
    ? props.module
    : `${props.module}.ts`
)
const onDialogSubmit = async () => {
  const action = _dialog.value.action?.handler
  action &&
    (await action({
      ...dialogFormData.value,
      ...(_dialog.value.action?.params || {})
    }))
  const { useMessage } = await import('@hooks/message')
  useMessage().success(_dialog.value.successText)
}
const getDialogData = async (dialog: any) => {
  showDialog.value = true
  _dialog.value = dialog
  if (dialog.edit) {
    const { name, params } = dialog.edit
    const edit = apis[`/src/api/${module.value}`][name || 'getObj']
    edit && (dialogFormData.value = (await edit(params)).data)
  }
}
const newTabs = computed(() => state.countResp || props.tabs)

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList: any = computed(() =>
  props.module ? apis[`/src/api/${module.value}`][props.getListFnName] : null
)
const delObj: any = computed(
  () => apis[`/src/api/${module.value}`][props.delFnName]
)

const showSearch = ref(true)
const state: BasicTableProps = reactive<BasicTableProps>({
  drag: props.drag,
  pageList: fetchList,
  ...(props.tableData?.length ? { dataList: props.tableData } : {}),
  ...(props.staticQuery || Object.keys($route.query).length
    ? {
        queryForm: {
          ...props.staticQuery,
          ...$route.query
        }
      }
    : {}),
  ...(props.size ? { pagination: { size: props.size } } : {}),
  tabsAuth: props.tabsAuth as string[],
  createdIsNeed: history.state.tabValue ? false : props.createdIsNeed,
  columns: props.columns
})

const {
  currentChangeHandle,
  sizeChangeHandle,
  tableStyle,
  getDataList,
  downBlobFile,
  renderHeader
} = useTable(state)

const confirm = useConfirm(getDataList)
const watchParams = () =>
  watch(
    () => props.params,
    (value) => {
      value &&
        Object.keys(value).length &&
        Object.keys(value)?.every((key) => value[key] !== undefined) &&
        getDataList(true, value)
    },
    {
      immediate: !state.createdIsNeed
    }
  )
const paramsWatcher = watchParams()

onUnmounted(paramsWatcher)

const selectObjs = ref([]) as any

watch(
  () => props.columns,
  (columns) => {
    columns?.length && (state.columns = columns)
  },
  {
    immediate: true
  }
)

const downParams = computed(() =>
  Object.assign(state.queryForm, props.params, {
    ids: props.getFullSelection
      ? selectObjs.value.map(
          ({ [props.selectMainKey]: id }: Record<string, string>) => id
        )
      : selectObjs
  })
)
const getExcel = useExportExcel({
  downBlobFile,
  downBlobFileUrl: props.downBlobFileUrl,
  downParams,
  downBlobFileName: props.downBlobFileName
})
/**
 * 选择表格行
 * @param item  {Array}  选中每行的集合
 */
const onSelectionChange = (item: []) => {
  selectObjs.value = props.getFullSelection
    ? item
    : item.map(({ [props.selectMainKey]: id }: Record<string, string>) => id)
  emit('update:modelValue', selectObjs.value)
}
//清空搜索条件;
const resetQuery = () => {
  selectObjs.value = []
  state.queryForm = {
    ids: [],
    ...props.staticQuery,
    ...$route.query,
    ...(newTabs.value?.length && newTabs.value[0].attributeName
      ? { [newTabs.value[0].attributeName]: tabValue.value }
      : {})
  }
  getDataList()
}

// 前端删除列表一项
const delListItem = (id) => {
  state.dataList = state.dataList?.filter((item) => item.id !== id)
}

provide('delListItem', delListItem)
provide('refresh', resetQuery)
provide('getList', getDataList)

const tabValue = ref('')
const getListByTab = (key: string, value: string) => {
  Object.assign(state.queryForm, { [key]: value })
  emit('get-tab-value', value)
  if (!props.tabs.length) {
    getDataList()
  }
}
const handleTabClick = (value: string) => {
  tabValue.value = value
  getListByTab(newTabs.value?.[0]?.attributeName, value)
}

const catchHistoryTabState = () => {
  if (!history.state.tabKey && !history.state.tabValue) return
  const { tabKey, tabValue: val } = history.state
  getListByTab(tabKey as string, val)
  tabValue.value = val
  history.state.tabKey = history.state.tabValue = null
}
onMounted(catchHistoryTabState)
// 暴露变量
defineExpose({
  resetQuery,
  delListItem
})
// 接受外部强刷页面的钩子
$refreshList(resetQuery, catchHistoryTabState)
</script>
<style>
@import './index.css';
</style>
