<template>
  <Table-view
    ref="undertakerTaxRef"
    :staticQuery="staticQuery"
    :isShowTopBar="!isTaskDetail"
    :noPadding="isTaskDetail"
    :columns="columns"
    getListFnName="taxUndertakerTask"
    :condition-forms="isTaskDetail ? [] : conditionForms"
    module="tax/index.ts">
    <template #contractName="{ row }">
      <a
        v-auth="'taxSupervision_undertakerTask_down'"
        @click="handleContractFile(row)"
        href="javascript:;"
        class="hover:underline text-blue-400">
        {{ row.contractName }}
      </a>
    </template>
    <template #actions="{ row }">
      <el-button
        v-auth="'taxSupervision_undertakerTask_view'"
        icon="view"
        text
        type="primary"
        @click="detailDialogRef.openDialog(row.id)">
        查看
      </el-button>
    </template>
    <detail-dialog ref="detailDialogRef" @refresh="refreshDataList" />
  </Table-view>
</template>

<script setup lang="ts">
const DetailDialog = defineAsyncComponent(
  () => import('/@/views/task/undertaker/components/detailDialog.vue')
)
const { proxy } = getCurrentInstance()
const route: any = useRoute()
const undertakerTaxRef = ref()
const detailDialogRef = ref()
const staticQuery = computed(() => {
  return {
    spId: route.query.spId,
    merchantId: route.query.merchantId
  }
})
const columns = [
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 150
  },
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 150
  },
  {
    prop: 'taskName',
    label: '任务名称',
    'min-width': 180
  },
  {
    prop: 'undertakerName',
    label: '承接人',
    'min-width': 180
  },
  {
    prop: 'undertakerCard',
    label: '证件号码',
    'min-width': 180
  },
  {
    prop: 'contractName',
    label: '承揽电子协议',
    'min-width': 180,
    slot: true
  },
  {
    prop: 'taskMoney',
    label: '任务金额(元)',
    'min-width': 180
  },
  {
    prop: 'startTime',
    label: '开始日期',
    'min-width': 180
  },
  {
    prop: 'doneTime',
    label: '完成日期',
    'min-width': 180
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 120
  }
]
const isTaskDetail = computed(() => {
  return route.query.taskId ? true : false
})
const conditionForms = [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true },
    value: route.query.spId
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户',
    value: route.query.merchantId
  },
  {
    control: 'InputPlus',
    key: 'undertakerName',
    label: '承接人'
  },
  {
    control: 'InputPlus',
    key: 'undertakerCard',
    label: '证件号码'
  },
  {
    control: 'DateRange',
    key: 'queryTimeRange',
    label: '开始时间',
    props: {
      valueType: 'string'
    }
  }
]
const refreshDataList = () => {
  undertakerTaxRef.value.resetQuery()
}
const handleContractFile = (row: any) => {
  window.open(`${proxy.baseURL}/${row.contractFile}`)
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
