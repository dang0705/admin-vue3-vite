<template>
  <Table-view
    ref="accountCapitalWaterRef"
    :columns="columns"
    :down-blob-file-url="downFileUrl"
    :condition-forms="conditionForms"
    module="finance/merchantAccountCapitalWater"
    :getListFnName="getListFnName"
    label-width="120px"
    @get-tab-value="toggleTab"
    :tabs="tabs"
    :exportAuth="
      tabType === '1'
        ? 'finance_merchantAccountCapitalWater_batch_export'
        : tabType === '2'
        ? 'finance_spAccountCapitalWater_batch_export'
        : tabType === '3'
        ? 'finance_platAccountCapitalWater_batch_export'
        : ''
    ">
    <template #subAccountNum="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/finance/merchantAccountCapital/detail',
          query: {
            id: row.accountId
          },
          state: 1
        }">
        {{ row.subAccountNum }}
      </router-link>
    </template>
    <!-- 伪代码 exportAuth -->
    <template #actions="{ row: {} }"></template>
  </Table-view>
</template>

<script setup lang="ts">
import { payChannel } from '@configurations/dynamic-control'

const tabType = ref('1')
const accountCapitalWaterRef = ref()
// const staticQuery = computed(() => {
//   return {
//     isPlatform: tabType.value === '3' ? 1 : undefined
//   }
// })
const getListFnName = computed(() => {
  if (tabType.value === '1') {
    return 'fetchList'
  } else if (tabType.value === '2') {
    return 'spAccountCapitalWaterPage'
  } else if (tabType.value === '3') {
    return 'spAccountCapitalWaterPlatform'
  }
})
const downFileUrl = computed(() => {
  if (tabType.value === '1') {
    return '/finance/merchantAccountCapitalWater/export'
  } else if (tabType.value === '2') {
    return '/finance/spAccountCapitalWater/export'
  } else if (tabType.value === '3') {
    return '/finance/spAccountCapitalWater/export'
  }
})
const downFileName = computed(() => {
  if (tabType.value === '1') {
    return '商户资金账户.xlsx'
  } else if (tabType.value === '2') {
    return '服务商余额账户.xlsx'
  } else if (tabType.value === '3') {
    return '平台余额账户.xlsx'
  }
})
const tabs = ref([
  {
    label: '商户资金账户',
    attributeVal: '1'
  },
  {
    label: '服务商余额账户',
    attributeVal: '2'
  },
  {
    label: '平台余额账户',
    attributeVal: '3'
  }
])
// 商户资金账户
const columns1 = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'waterNo',
    label: '交易流水号'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'subAccountNum',
    label: '资金账户',
    'min-width': 120,
    slot: true
  },
  {
    prop: 'amount',
    label: '交易金额(元)'
  },
  {
    prop: 'overBalance',
    label: '交易后余额(元)'
    // 'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间'
  },
  {
    prop: 'capitalFlow',
    label: '收支标识'
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  }
]
const columns2 = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'waterNo',
    label: '交易流水号'
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
    prop: 'amount',
    label: '交易金额(元)'
  },
  {
    prop: 'overBalance',
    label: '交易后余额(元)',
    'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间'
  },
  {
    prop: 'capitalFlow',
    label: '收支标识'
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },
  {
    prop: 'merchantName',
    label: '商户'
  }
]
const columns3 = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'waterNo',
    label: '交易流水号'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'amount',
    label: '交易金额(元)'
  },
  {
    prop: 'overBalance',
    label: '交易后余额(元)',
    'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间'
  },
  {
    prop: 'capitalFlow',
    label: '收支标识'
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },

  {
    prop: 'merchantName',
    label: '商户'
  }
]
const columns = computed(() => {
  if (tabType.value === '1') {
    return columns1
  } else if (tabType.value === '2') {
    return columns2
  } else if (tabType.value === '3') {
    return columns3
  }
})
const conditionForms1 = [
  {
    control: 'InputPlus',
    key: 'waterNo',
    label: '交易流水号'
  },
  {
    control: 'el-select',
    key: 'capitalFlow',
    label: '收支标识',
    options: [
      {
        label: '111',
        value: 'in'
      },
      {
        label: '支出',
        value: 'out'
      }
    ]
  },
  {
    control: 'el-select',
    key: 'cause',
    label: '类型',
    options: 'fund_occurrence_cause'
    // options: [
    //   // 伪代码
    //   {
    //     label: '充值',
    //     value: '1'
    //   },
    //   {
    //     label: '充值退款',
    //     value: '2'
    //   },
    //   {
    //     label: '任务支出',
    //     value: '3'
    //   },
    //   {
    //     label: '管理费支出',
    //     value: '4'
    //   },
    //   {
    //     label: '服务费支出',
    //     value: '5'
    //   }
    // ]
  },
  {
    control: 'DateRange',
    key: 'waterTimeRange',
    label: '交易时间',
    props: {
      valueType: 'string'
    }
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: {
      platform: true
    }
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },

  payChannel()
]
const conditionForms2 = [
  {
    control: 'InputPlus',
    key: 'waterNo',
    label: '交易流水号'
  },
  {
    control: 'DateRange',
    key: 'waterTimeRange',
    label: '交易时间',
    props: {
      valueType: 'string'
    }
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  payChannel()
]
const conditionForms = computed(() => {
  if (tabType.value === '1') {
    return conditionForms1
  } else if (tabType.value === '3' || tabType.value === '2') {
    return conditionForms2
  }
})

const toggleTab = (attributeVal: string) => {
  tabType.value = attributeVal
  nextTick(() => {
    accountCapitalWaterRef?.value.resetQuery()
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