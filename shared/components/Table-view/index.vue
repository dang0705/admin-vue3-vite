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
              v-debounce="exportExcel"
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
            v-bind="{ ...props, ...$attrs }"
            :class="['table-view', { 'no-border': !border }]"
            :data="tableData.length > 0 ? tableData : state.dataList"
            :cell-style="tableStyle.cellStyle"
            :show-header="header"
            :row-key="selectMainKey"
            :header-cell-style="tableStyle.headerCellStyle"
            @selection-change="onSelectionChange">
            <el-table-column
              type="index"
              width="50"
              fixed="left"
              v-if="sortDrag">
              <template #header>
                <el-tooltip content="序号" placement="top">#</el-tooltip>
              </template>
              <template #default="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="" width="50" v-if="sortDrag">
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
import { BasicTableProps, useTable } from '@hooks/table'
import tableViewProps from './props'
import thousandthDivision from '@utils/thousandth-division'
import TableActions from '@components/Table-view/Table-actions.vue'
import apis from '@jmyg/api'
import helpers from '@utils/helpers'
import { useUserInfo } from '@stores/userInfo'
import tableColumnsWidth from '@configurations/tableColumnsWidth'
const { userInfos } = storeToRefs(useUserInfo())

defineOptions({ name: 'TableView', inheritAttrs: false })

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

const getTableColumnWidth = (column) => {
  const { minWidth, label } = column
  if (minWidth || column['min-width']) {
    return minWidth || column['min-width']
  }
  if (!minWidth && !label) {
    return
  }
  if (label.includes('手机号')) {
    return tableColumnsWidth['phone']
  } else if (label === '商户') {
    return tableColumnsWidth['merchantName']
  } else if (label === '服务商') {
    return tableColumnsWidth['spList']
  } else if (
    label.includes('姓名') ||
    label.includes('联系人') ||
    label.includes('创建人') ||
    label.includes('承接人姓名') ||
    label.includes('收款户名') ||
    label === '承接人'
  ) {
    return tableColumnsWidth['userName']
  } else if (label.includes('时间')) {
    return tableColumnsWidth['time']
  } else if (label.includes('代码') || label.includes('快递单号')) {
    return tableColumnsWidth['code']
  } else if (label.includes('身份证') || label.includes('证件号')) {
    return tableColumnsWidth['card']
  } else if (label.includes('性别')) {
    return tableColumnsWidth['sex']
  } else if (label.includes('年龄')) {
    return tableColumnsWidth['age']
  } else if (label.includes('学历')) {
    return tableColumnsWidth['education']
  } else if (label.includes('开户行') || label.includes('账号类别')) {
    return tableColumnsWidth['bankName']
  } else if (
    label.includes('银行卡号') ||
    label === '承接人银行卡号' ||
    label.includes('银行账号') ||
    label.includes('服务商银行账号')
  ) {
    return tableColumnsWidth['bankNumber']
  } else if (label.includes('状态')) {
    return tableColumnsWidth['status']
  } else if (label.includes('编号')) {
    return '180px'
  } else if (
    label.includes('任务名称') ||
    label.includes('账单名称') ||
    label.includes('服务协议名称')
  ) {
    return '150px'
  } else if (
    label.includes('是否存在生效协议') ||
    label.includes('是否银行四要素校验') ||
    label.includes('是否银行四要素验证')
  ) {
    return '138px'
  } else if (
    label.includes('任务承揽费(元)') ||
    label.includes('管理费(元)') ||
    label.includes('服务费(元)') ||
    label.includes('金额(元)') ||
    label.includes('税款(元)') ||
    label.includes('余额(元)')
  ) {
    return '120px'
  } else if (label.includes('支付通道')) {
    return '110px'
  } else if (label.includes('资金账户')) {
    return '100px'
  } else if (label.includes('流水号')) {
    return '160px'
  }
}

const newTabs = computed(() => state.countResp || props.tabs)

/**
 * 得到以传入的参数作为具体路径中指定的文件内的具体方法
 */
const fetchList: any = computed(() =>
  props.tableData.length
    ? null
    : apis[`/src/api/${module.value}`][props.getListFnName]
)
const delObj: any = computed(
  () => apis[`/src/api/${module.value}`][props.delFnName]
)

const showSearch = ref(true)
const params = computed(() => props.params)
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: fetchList,
  ...(props.tableData.length ? { dataList: props.tableData } : {}),
  ...(props.staticQuery
    ? {
        queryForm: {
          ...props.staticQuery
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
} = useTable(state, params.value ? params : null)

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
// 导出excel
const exportExcel = async () => {
  const { useMessageBox } = await import('@hooks/message')
  try {
    await useMessageBox().confirm('确定批量导出数据？')
  } catch {
    return
  }
  downBlobFile(
    props.downBlobFileUrl,
    downParams.value,
    props.downBlobFileName,
    true
  )
}
const downParams = computed(() =>
  Object.assign(state.queryForm, props.params, {
    ids: props.getFullSelection
      ? selectObjs.value.map(
          ({ [props.selectMainKey]: id }: Record<string, string>) => id
        )
      : selectObjs
  })
)
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
    ...(newTabs.value?.length && newTabs.value[0].attributeName
      ? { [newTabs.value[0].attributeName]: tabValue.value }
      : {})
  }
  getDataList()
}

provide('refresh', resetQuery)
provide('getList', getDataList)

const tableCellFormatter = (row, column, cellValue) => {
  if (column.label?.includes('(元)')) {
    return cellValue !== null && cellValue !== undefined
      ? `￥${thousandthDivision({ number: cellValue })}`
      : '-'
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
  const { useMessage, useMessageBox } = await import('@hooks/message')
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
.top-bar .export + .top-bar-extra-buttons .el-button:first-child {
  margin-left: 10px;
}
.top-bar-extra-buttons .el-button:not(:first-child) {
  margin-left: 10px;
}
.table-view.no-border .el-table__inner-wrapper::before {
  background-color: unset;
}
</style>
