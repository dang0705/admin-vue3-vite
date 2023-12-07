<template>
  <Table-view ref="waterSpPaymentBankRef" :columns="columns" label-width="110px" :exportAuth="tabType === '1'
      ? 'finance_waterSpPaymentBank_export'
      : tabType === '2'
        ? 'hro_waterBankCorporateLinkage_export'
        : ''
    " :condition-forms="conditionForms" :down-blob-file-url="tabType === '1'
      ? '/finance/waterSpPaymentBank/export'
      : tabType === '2'
        ? '/finance/waterBankCorporateLinkage/export'
        : ''
    " @get-tab-value="toggleTab" :tabs="tabs" :getListFnName="getListFnName" module="finance/waterSpPaymentBank">
    <!-- <template #loanType="{ formData }">
      <el-form-item label="出入账状态:" prop="loanType">
        <el-select
          @change="handleFilter(formData)"
          v-model="formData.loanType"
          placeholder="请选择"
          class="w100">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in loanTypeOptions" />
        </el-select>
      </el-form-item>
    </template> -->
    <template #top-bar="{ otherInfo }">
      <el-button v-if="tabType === '1'" v-auth="'finance_waterSpPaymentBank_import'"
        @click="addUnderTakerRef.openDialog()" icon="Upload" type="primary">
        批量导入银行交易流水
      </el-button>
    </template>
    <UploadExcel @refreshDataList="refreshDataList" ref="addUnderTakerRef" guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
      upload-label="批量导入银行交易流水" upload-url="core/excel/importWaterSpPaymentBank"
      temp-url="/files/BANK_TRANSACTION_FLOW_TEMPLATE.xlsx" download-name="银行交易流水模版" template-on-front title="批量导入银行交易流水"
      :forms="addUnderTakerForms" />
  </Table-view>
</template>

<script setup lang="ts">
import { payChannel } from '@configurations/dynamic-control'
import columns from './configurations/columns'
import conditionForms from './configurations/condition-forms'
const tabType = ref('1')
const waterSpPaymentBankRef = ref()
const addUnderTakerRef = ref()
const addUnderTakerForms = ref([
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
])
const getListFnName = computed(() => {
  let str = tabType.value === '1' ? 'fetchList' : tabType.value === '2' ? 'waterBankPage' : ''
  console.log('str', str);

  return str
})
const tabs = ref([
  {
    label: '手动维护',
    attributeVal: '1',
    auth: 'finance_waterSpPaymentBank_export',
  },
  {
    label: '银企直联',
    attributeVal: '2',
    auth: 'hro_waterBankCorporateLinkage_export',
  }
])
const refreshDataList = () => {
  nextTick(() => {
    waterSpPaymentBankRef?.value.resetQuery()
  })
}
const toggleTab = (attributeVal: string) => {
  tabType.value = attributeVal
  nextTick(() => {
    console.log('tabType.value', tabType.value);

    setTimeout(() => {
      waterSpPaymentBankRef?.value.resetQuery()
    }, 100);
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
