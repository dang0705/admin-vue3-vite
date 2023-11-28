<template>
  <Table-view
    :staticQuery="staticQuery"
    :columns="columns"
    :actions="actions"
    :condition-forms="conditionForms"
    module="tax/index"
    getListFnName="taxUndertakingContract" />
</template>

<script setup lang="ts">
const { proxy } = getCurrentInstance()
const route: any = useRoute()
const columns = [
  {
    prop: 'spName',
    label: '服务商'
  },
  // {
  // 	prop: 'merchantName',
  // 	label: '商户',
  // 	'min-width': 150,
  // },
  {
    prop: 'undertakerName',
    label: '姓名',
    'min-width': 180
  },
  {
    prop: 'undertakerIdCard',
    label: '身份证号',
    'min-width': 180
  },
  {
    prop: 'startTime',
    label: '签署日期',
    'min-width': 180
  },
  {
    prop: 'endTime',
    label: '到期日期',
    'min-width': 180
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 90
  }
]
const actions = ({ contractFile }: any) => [
  {
    label: '下载',
    download: contractFile,
    auth: 'taxSupervision_undertakingContract_down'
  }
]
const staticQuery = computed(() => {
  return {
    spId: route.query.spId,
    merchantId: route.query.merchantId
  }
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
    control: 'DateRange',
    key: 'queryTimeRange',
    label: '签署时间',
    props: {
      valueType: 'string'
    }
  },
  {
    control: 'InputPlus',
    key: 'undertakerName',
    label: '姓名'
  },
  {
    control: 'InputPlus',
    key: 'undertakerIdCard',
    label: '身份证号'
  }
]
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
