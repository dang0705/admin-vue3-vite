<template>
  <Table-view
    :staticQuery="staticQuery"
    :columns="columns"
    getListFnName="taxMerchantRecharge"
    :condition-forms="conditionForms"
    module="tax/index">
    <template #actions="{ row }">
      <el-button
        v-auth="'taxSupervision_merchantRecharge_down'"
        icon="download"
        v-if="row.transferVoucher"
        text
        type="primary"
        @click="handleContractFile(row.transferVoucher)">
        下载凭证
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import { downBlobFile } from '@utils/other'
const route: any = useRoute()
const staticQuery = computed(() => {
  return {
    spId: route.query.spId,
    merchantId: route.query.merchantId
  }
})
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
    prop: 'serialNumber',
    label: '充值交易号',
    'min-width': 180
  },
  {
    prop: 'rechargeMode',
    label: '充值方式',
    'min-width': 180
  },
  {
    prop: 'payingAmount',
    label: '充值金额(元)'
  },
  {
    prop: 'rechargeStartTime',
    label: '充值时间'
  },
  // 伪代码, 暂不知该字段
  {
    prop: 'xxx',
    label: '备注',
    'min-width': 180
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 100
  }
]
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
    label: '充值时间',
    props: {
      valueType: 'string'
    }
  }
]
const handleContractFile = (transferVoucher: string) => {
  downBlobFile(`${transferVoucher}`, {})
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
