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
          <slot :name="slot" />
        </template>
      </Tab-view>
      <div class="mb8 w-full">
        <Form-view
          v-if="conditionForms.length"
          v-model="state.queryForm"
          v-show="showSearch"
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
              v-bind="{ form: conditionForms, formData: state.queryForm }" />
          </template>
        </Form-view>
        <slot
          name="tableTopTwo"
          v-bind="{ refresh: resetQuery, otherInfo: state.otherInfo }" />
        <div
          v-if="isShowTopBar"
          class="top-bar h-8 my-[10px] flex items-center justify-between">
          <div class="flex items-center flex-grow flex-wrap">
            <el-button
              v-if="downBlobFileUrl"
              v-debounce="exportExcel"
              icon="download"
              type="primary"
              v-auth="exportAuth">
              批量导出
            </el-button>
            <slot
              name="top-bar"
              v-bind="{
                refresh: resetQuery,
                otherInfo: state.otherInfo,
                query: state.queryForm,
                selectObjs: selectObjs
              }" />
          </div>
          <right-toolbar
            v-if="conditionForms.length"
            v-model:showSearch="showSearch"
            style="float: right"
            @queryTable="getDataList" />
        </div>
      </div>
      <el-skeleton :loading="state.loading">
        <template #default>
          <el-table
            size="small"
            :border="false"
            :data="tableData.length > 0 ? tableData : state.dataList"
            :cell-style="tableStyle.cellStyle"
            :header-cell-style="
              header
                ? tableStyle.headerCellStyle
                : { headerCellStyle: { background: 'transparent', height: 0 } }
            "
            @selection-change="onSelectionChange">
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
              }">
              <template v-if="column.headerSlot" #header>
                <slot :name="`${column.prop}-header`" :refresh="resetQuery" />
              </template>
              <template v-if="column.slot || column.value" v-slot="{ row }">
                <slot
                  :name="column.prop"
                  :row="row"
                  :list="state.dataList"
                  :confirm="confirm"
                  :refresh="resetQuery">
                  <template v-if="column.value">
                    {{ column.value(row) }}
                  </template>
                  <TableSlot
                    v-else-if="helpers.isFunction(column.slot)"
                    :slot-function="column.slot"
                    :selections="selectObjs"
                    :row="row"
                    :confirm="confirm"
                    :refresh="resetQuery" />
                </slot>
                <TableActions
                  v-if="column.prop === 'actions' && actions.length"
                  :row="row"
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
        </template>
      </el-skeleton>
    </div>
    <slot />
    <Dialog
      v-model="showDialog"
      v-model:form-data="dialogFormData"
      v-bind="_dialog"
      :columns="24"
      :on-submit="onDialogSubmit" />
  </div>
</template>

<script setup lang="ts">
import { BasicTableProps, useTable } from '/@/hooks/table'
import tableViewProps from './props'
import thousandthDivision from '/@/utils/thousandth-division'
import TableActions from '/@/components/Table-view/Table-actions.vue'
import apis from '/@/api'
import helpers from '/@/utils/helpers'
defineOptions({ name: 'TableView' })

const TabView = defineAsyncComponent(() => import('./Tab-view.vue'))
const emit = defineEmits(['update:modelValue', 'get-tab-value'])
const props = defineProps(tableViewProps)
const showDialog = ref(false)
const _dialog = ref({})
const dialogFormData = ref({})

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
  const { useMessage } = await import('/@/hooks/message')
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

const newTabs = computed(() => {
  return state.countResp || props.tabs
})

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList: any = computed(
  () => apis[`/src/api/${module.value}`][props.getListFnName]
)
const delObj: any = computed(
  () => apis[`/src/api/${module.value}`][props.delFnName]
)

const showSearch = ref(true)
const params = computed(() => props.params)
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: fetchList,
  ...(props.staticQuery
    ? {
        queryForm: {
          ...props.staticQuery
        }
      }
    : {}),
  ...(props.size ? { pagination: { size: props.size } } : {}),
  tabsAuth: props.tabsAuth as string[],
  createdIsNeed: history.state.tabValue ? false : props.createdIsNeed
})
const {
  currentChangeHandle,
  sizeChangeHandle,
  tableStyle,
  getDataList,
  downBlobFile,
  renderHeader
} = useTable(state, params.value ? params : null)

const selectObjs = ref([]) as any

// 导出excel
const exportExcel = () => {
  downBlobFile(
    props.downBlobFileUrl,
    Object.assign(state.queryForm, props.params, {
      ids: props.getFullSelection
        ? selectObjs.value.map(
            ({ [props.selectMainKey]: id }: Record<string, string>) => id
          )
        : selectObjs
    }),
    props.downBlobFileName
  )
}
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
  state.queryForm = {
    ...props.staticQuery,
    ...(newTabs.value?.length && newTabs.value[0].attributeName
      ? { [newTabs.value[0].attributeName]: tabValue.value }
      : {})
  }
  selectObjs.value = []
  getDataList()
}

provide('refresh', resetQuery)

const tableCellFormatter = (row, column, cellValue) => {
  if (column.label?.includes('(元)')) {
    return cellValue >= 0 && cellValue
      ? `￥${thousandthDivision({ number: cellValue })}`
      : '--'
  }
  return cellValue
}
/**
 * @description  确认弹框
 * @param confirm {string}    确认文案
 * @param success {string}    成功文案
 * @param fn      {function}  实际操作方法
 * @param params  {object}    参数
 */
const confirm = async ({
  text: { confirm, success },
  handler: { fn, params }
}) => {
  const { useMessage, useMessageBox } = await import('/@/hooks/message')
  try {
    await useMessageBox().confirm(confirm)
  } catch {
    return
  }
  try {
    await fn(params)
    getDataList()
    useMessage().success(success)
  } catch (err: any) {}
}
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
  resetQuery
})

// 接受外部强刷页面的钩子
$refreshList(resetQuery, catchHistoryTabState)
</script>
<style>
.el-table .cell {
  position: relative;
}
</style>
