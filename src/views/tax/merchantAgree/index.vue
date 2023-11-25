<template>
  <Table-view
    :staticQuery="staticQuery"
    :columns="columns"
    getListFnName="taxSupervisionAgreement"
    :condition-forms="conditionForms"
    module="tax/index">
    <template #actions="{ row }">
      <el-button
        v-auth="'taxSupervision_agreement_down'"
        icon="download"
        text
        type="primary"
        @click="handleContractFile(row)">
        下载
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message'
import { payChannel } from '/@/configuration/dynamic-control'
const { proxy } = getCurrentInstance()
const router = useRouter()
const route: any = useRoute()
const form = reactive({})
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
    prop: 'agreementName',
    label: '合同协议',
    'min-width': 180
  },
  {
    prop: 'endTime',
    label: '合同到期',
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
  }
]
const handleContractFile = (row: any) => {
  window.open(`${proxy.baseURL}/${row.uploadAttachment}`)
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
