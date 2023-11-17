<template>
  <Table-view
    ref="accountCapitalWaterRef"
    :columns="columns"
    :down-blob-file-url="downFileUrl"
    :down-blob-file-name="downFileName"
    :condition-forms="conditionForms"
    module="finance/merchantAccountCapitalWater.ts"
    :getListFnName="getListFnName"
    :staticQuery="staticQuery"
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
    <!-- 伪代码 exportAuth -->
    <template #actions="{ row: {} }"></template>
  </Table-view>
</template>

<script setup lang="ts">
import { payChannel } from '/@/configuration/dynamic-control'

const tabType = ref('1')
const accountCapitalWaterRef = ref()
const staticQuery = computed(() => {
  return {
    isPlatform: tabType.value === '3' ? 1 : undefined
  }
})
const getListFnName = computed(() => {
  if (tabType.value === '1' || tabType.value === '3') {
    return 'fetchList'
  } else if (tabType.value === '2') {
    return 'spAccountCapitalWaterPage'
  }
})
const downFileUrl = computed(() => {
  if (tabType.value === '1') {
    return '/finance/merchantAccountCapitalWater/export'
  } else if (tabType.value === '2') {
    return '/finance/spAccountCapitalWater/export'
  } else if (tabType.value === '3') {
    return '/finance/merchantAccountCapitalWater/export'
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
    label: '交易流水号',
    'min-width': 160
  },
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 160
  },
  {
    prop: 'subAccountNum',
    label: '资金账户',
    'min-width': 160
  },
  {
    prop: 'amount',
    label: '交易金额（元）',
    'min-width': 160
  },
  {
    prop: 'afterBalance',
    label: '交易后余额（元）',
    'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间',
    'min-width': 160
  },
  {
    prop: 'capitalFlow',
    label: '收支标识',
    'min-width': 160
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 160
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    'min-width': 160
  }
]
const columns2 = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'waterNo',
    label: '交易流水号',
    'min-width': 160
  },
  {
    prop: 'spName',
    label: '服务商',
    'min-width': 160
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    'min-width': 160
  },
  {
    prop: 'amount',
    label: '交易金额（元）',
    'min-width': 160
  },
  {
    prop: 'afterBalance',
    label: '交易后余额（元）',
    'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间',
    'min-width': 160
  },
  {
    prop: 'capitalFlow',
    label: '收支标识',
    'min-width': 160
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },
  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 160
  }
]
const columns3 = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'waterNo',
    label: '交易流水号',
    'min-width': 160
  },
  {
    prop: 'paymentBankName',
    label: '支付通道',
    'min-width': 160
  },
  {
    prop: 'amount',
    label: '交易金额（元）',
    'min-width': 160
  },
  {
    prop: 'afterBalance',
    label: '交易后余额（元）',
    'min-width': 160
  },
  {
    prop: 'waterTime',
    label: '交易时间',
    'min-width': 160
  },
  {
    prop: 'capitalFlow',
    label: '收支标识',
    'min-width': 160
  },
  {
    prop: 'causeDesc',
    label: '类型',
    'min-width': 160
  },

  {
    prop: 'merchantName',
    label: '商户',
    'min-width': 160
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
    options: [
      // 伪代码
      {
        label: '充值',
        value: '1'
      },
      {
        label: '充值退款',
        value: '2'
      },
      {
        label: '任务支出',
        value: '3'
      },
      {
        label: '管理费支出',
        value: '4'
      },
      {
        label: '服务费支出',
        value: '5'
      }
    ]
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
  if (tabType.value === '1' || tabType.value === '2') {
    return conditionForms1
  } else if (tabType.value === '3') {
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
