<template>
  <TableView
    ref="InOutAccountRef"
    :columns="columns"
    :condition-forms="conditionForms"
    :actions="actions"
    module="finance/merchantRecharge.ts"
    labelWidth="120px"
    exportAuth="finance_merchantRecharge_export"
    downBlobFileUrl="/finance/merchantRecharge/export">
    <uploadExcel
      @refreshDataList="refreshDataList"
      ref="inOutAccountAddFormsRef"
      guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
      upload-label="批量导入银行交易流水"
      upload-url="core/excel/importWaterSpPaymentBank"
      download-name="银行交易流水模版"
      temp-url="/files/BANK_TRANSACTION_FLOW_TEMPLATE.xlsx"
      template-on-front
      title="批量导入银行交易流水"
      :forms="inOutAccountAddForms" />
  </TableView>
</template>

<script setup lang="ts">
import { payChannel } from '/@/configuration/dynamic-control'
import columns from './configurations/columns'
import conditionForms from './configurations/condition-forms'
import actions from './configurations/actions'
const inOutAccountAddFormsRef = ref()
const InOutAccountRef = ref()
const inOutAccountAddForms = [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: {
      platform: true
    },
    rules: [{ required: true, message: '服务商不能为空', trigger: 'blur' }]
  },
  payChannel({
    key: 'channelId',
    rules: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }]
  })
]
const refreshDataList = () => {
  nextTick(() => {
    InOutAccountRef?.value.resetQuery()
  })
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
