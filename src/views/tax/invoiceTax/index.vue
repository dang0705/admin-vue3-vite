<template>
  <Table-view
    :staticQuery="staticQuery"
    :columns="columns"
    getListFnName="taxMerchantInvoice"
    :condition-forms="conditionForms"
    module="tax/index.ts">
    <template #actions="{ row }">
      <el-button
        v-auth="'taxSupervision_merchantInvoice_down'"
        icon="download"
        text
        type="primary"
        @click="handleContractFile(row)">
        下载凭证
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
const { proxy } = getCurrentInstance()
const route: any = useRoute()
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
    prop: 'invoicingCategoriesDesc',
    label: '发票类目',
    'min-width': 180
  },
  {
    prop: 'invoicingAmount',
    label: '发票金额(元)',
    'min-width': 180
  },
  {
    prop: 'updateTime',
    label: '开票时间',
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
    label: '开票时间',
    props: {
      valueType: 'string'
    }
  }
]
const handleContractFile = (row: any) => {
  window.open(`${proxy.baseURL}/${row.invoiceFilePath}`)
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
