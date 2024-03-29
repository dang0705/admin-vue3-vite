<template>
  <Table-View
    :columns="columns"
    :condition-forms="conditionForms"
    :actions="actions(contractMap, valueAsLabel(contractMap.contract_status))"
    action-body="合同"
    module="hro/undertakingContract.ts"
    label-width="140">
    <template #state="{ row }">
      <Tag
        :type="getType(row.state)?.color"
        :text="getType(row.state)?.label" />
    </template>
    <template #top-bar>
      <el-button
        icon="folder-add"
        type="primary"
        @click="formDialogRef.openDialog()"
        v-auth="'hro_undertakingContract_add'">
        手动上传合同
      </el-button>
      <el-button
        icon="folder-add"
        type="primary"
        v-auth="'hro_undertakingContract_export'"
        @click="batchElectronicSignRef.openDialog()">
        批量电子签署
      </el-button>
    </template>
    <form-dialog ref="formDialogRef" />
    <Upload-excel
      :forms="batchElectronicSignForms"
      ref="batchElectronicSignRef"
      main-label="待签署用户名单"
      upload-url="core/undertakingContract/contractBatchSigning"
      guidance="请按照导入模版填写承接人信息，承接人必须在16岁到65岁范围内。"
      temp-url="/files/CONTRACT_BATCH_SIGNING_TEMPLATE.xlsx"
      download-name="合同批量签署模板"
      template-on-front
      noDivider
      noBorder="none"
      hoverBg="#fff7f3"
      bgColor="#F3F3F3"
      labelWidth="120"
      title="添加合同签署" />
  </Table-View>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import Array2Object, { valueAsLabel } from '@utils/array-2-object'
import actions from '@jmyg/views/undertakers/contract/configuration/actions'
import conditionForms from '@jmyg/views/undertakers/contract/configuration/condition-forms'
import getColumns from '@jmyg/views/undertakers/contract/configuration/columns'
// 定义查询字典
const contractMap = Array2Object({ dic: ['contract_type', 'contract_status'] })

// vue 3.3+ new feature  https://blog.vuejs.org/posts/vue-3-3#experimental-features
const { contract_status } = useDict('contract_status')
const getType = (state: string) => {
  return contract_status.value.find((item) => item.value === state)
}
const columns = getColumns(contractMap)
// 合同类型、状态枚举
const batchElectronicSignRef = ref()
// 批量电子签署控件与数据
const batchElectronicSignForms = [
  {
    control: 'SpSelect',
    label: '服务商',
    key: 'spId'
  },
  {
    control: 'el-select',
    label: '合同模板',
    key: 'contractTemplate',
    options: 'contract_template' // 此处走字典
  }
]
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'))
// 定义变量内容
const formDialogRef = ref()
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
