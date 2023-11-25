<!-- :getListFnName="" -->
<template>
  <TableView
    :columns="columns"
    :condition-forms="conditionForms"
    :tabs-auth="[
      'core_settleBillRecord_task_view',
      'core_settleBillRecord_sp_view'
    ]"
    :exportAuth="
      tabType === '20' //  '20' means 20
        ? 'core_settleBillRecord_task_export'
        : tabType === '10'
          ? 'core_settleBillRecord_sp_export'
          : ''
    "
    :downBlobFileUrl="
      tabType === '20'
        ? '/core/settleBillRecord/exportTaskSettleBillRecord'
        : tabType === '10'
          ? '/core/settleBillRecord/exportServiceSettleBillRecord'
          : ''
    "
    labelWidth="120px"
    module="core/settleBillRecord"
    @get-tab-value="tabType = $event">
    <template #settleBillName="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/accounting/settleBill/detail',
          query: {
            id: row.settleBillId
          },
          state: 1
        }">
        {{ row.settleBillName }}
      </router-link>
    </template>
    <template #billNumber="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/accounting/settleBill/detail',
          query: {
            id: row.settleBillId
          },
          state: 1
        }">
        {{ row.billNumber }}
      </router-link>
    </template>
  </TableView>
</template>

<script setup lang="ts">
import { payChannel } from '/@/configuration/dynamic-control'
const router = useRouter()
const tabType = ref('20')
const columns = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'taskName',
    label: '任务名称'
  },
  {
    prop: 'taskNo',
    label: '任务编号'
  },
  {
    prop: 'settleBillName',
    label: '账单名称',
    slot: true
  },
  {
    prop: 'billNumber',
    label: '账单编号',
    slot: true
  },
  {
    prop: 'billRecordNum',
    label: '结算单编号'
  },
  {
    prop: 'serviceAmount',
    label: '结算金额(元)'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'payTime',
    label: '付款时间'
  },
  {
    prop: 'status',
    label: '结算状态',
    options: 'settle_status'
  }
  // {
  // 	label: '操作',
  // 	prop: 'actions',
  // 	fixed: 'right',
  // 	slot: true,
  // },
]
const conditionForms = [
  {
    control: 'InputPlus',
    key: 'taskName',
    label: '任务名称'
  },
  {
    control: 'InputPlus',
    key: 'taskNo',
    label: '任务编号'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商'
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  {
    control: 'InputPlus',
    key: 'billName',
    label: '账单名称'
  },
  {
    control: 'InputPlus',
    key: 'billNumber',
    label: '账单编号'
  },
  {
    control: 'InputPlus',
    key: 'recordNum',
    label: '结算单编号'
  },
  {
    control: 'DateRange',
    key: 'payTimeFromTo',
    label: '付款时间',
    props: {
      valueType: 'string'
    }
  },
  {
    control: 'el-select',
    key: 'billStatus',
    label: '结算状态',
    options: 'settle_status'
  },
  payChannel({ key: 'paymentBankId' })
  // {
  // 	control: 'el-select',
  // 	key: 'paymentBankId',
  // 	label: '支付通道',
  // },
]
// const getTab = (type) => {
//   tabType.value = type
// }
// const handleBtn = () => {
//   useMessage().wraning('功能正在开发, 请等待~')
// }
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
