<!-- downBlobFileUrl="/finance/dutyPaidDetails/export"
downBlobFileName="完税明细.xlsx" -->
<template>
  <div>
    <TableView
      :condition-forms="conditionForms"
      :columns="columns"
      action-body="账单"
      getListFnName="dutyPaidDetailsPage"
      module="tax/index"
      :staticQuery="staticQuery"
      labelWidth="120px">
      <template #tableTop="{ otherInfo }">
        <Form-view
          :otherInfo="otherInfo"
          class="mt-1"
          label-width="130px"
          disabled
          :showBtn="false"
          v-model="form"
          :forms="topInfoForms" />
      </template>
    </TableView>
  </div>
</template>
<script setup lang="ts">
import { dutyPaidDetail } from '/@/api/tax/index'
import conditionForms from './configurations/condition-forms-detail'
import columns from './configurations/columns-detail'
const route: any = useRoute()
const topInfoForms = [
  {
    control: 'InputPlus',
    key: 'spName',
    label: '服务商'
  },
  {
    control: 'InputPlus',
    key: 'dutyPaidMonth',
    label: '纳税月份'
  },
  {
    control: 'InputPlus',
    key: 'numberPeople',
    label: '完税人数'
  },
  {
    control: 'InputPlus',
    key: 'totalAmount',
    label: '完税金额'
  },
  {
    control: 'InputPlus',
    key: 'createTime',
    label: '生成时间'
  }
]
const staticQuery = {
  dutyPaidId: route.query.id
}
const form = reactive({
  id: ''
})
// 初始化表单数据
const getDutyPaidDetail = (id: string) => {
  dutyPaidDetail(id)
    .then((res: any) => {
      Object.assign(form, res.data)
      console.log('form', form)
    })
    .finally(() => {})
}

onMounted(() => {
  if (route.query.id) {
    getDutyPaidDetail(route.query.id as string)
  }
})
// dutyPaidDetail
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
// dutyPaidId
</script>
