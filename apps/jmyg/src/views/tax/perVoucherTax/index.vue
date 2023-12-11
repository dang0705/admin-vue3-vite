<template>
  <Table-view
    :staticQuery="staticQuery"
    :columns="columns"
    getListFnName="taxSettleRecordItem"
    :condition-forms="conditionForms"
    module="tax/index">
    <template #actions="{ row }">
      <el-button
        v-auth="'taxSupervision_settleRecordItem_view'"
        icon="download"
        text
        type="primary"
        @click="handleContractFile(row.contractFile)">
        下载凭证
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import { downBlobFile } from '@utils/other'
const route: any = useRoute()
const columns = [
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'taskName',
    label: '任务名称'
  },
  {
    prop: 'undertakerName',
    label: '承接人',
    'min-width': 120
  },
  {
    prop: 'undertakerCard',
    label: '证件号码'
  },
  {
    prop: 'contractName',
    label: '承揽电子协议',
    'min-width': 150
  },
  {
    prop: 'paymentSuccessTime',
    label: '发放时间'
  },
  {
    prop: 'taskAmount',
    label: '任务承揽费(元)',
    'min-width': 150
  },
  {
    prop: 'taxWithheld',
    label: '代扣税款(元)',
    'min-width': 120
  },
  {
    prop: 'paidAmount',
    label: '实发金额(元)',
    'min-width': 120
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 100
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
    label: '发放时间',
    props: {
      valueType: 'string'
    }
  }
]
const handleContractFile = (contractFile: string) => {
  downBlobFile(`${contractFile}`, {})
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
