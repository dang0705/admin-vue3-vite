<template>
  <Table-view
    :columns="columns"
    exportAuth="core_merchantAccountCapital_export"
    :condition-forms="conditionForms"
    downBlobFileUrl="/finance/merchantAccountCapital/export"
    module="finance/merchantAccountCapital">
    <template #actions="{ row }">
      <el-button
        icon="view"
        text
        type="primary"
        v-auth="'core_merchantAccountCapital_view'"
        @click="handleDetail(row)">
        查看
      </el-button>
      <el-button
        icon="view"
        text
        type="primary"
        v-auth="'core_merchantAccountCapital_view_account'"
        @click="handleViewAccount(row)">
        查看收款账号
      </el-button>
    </template>
    <Dialog
      vertical
      v-model="accountShow"
      title="收款银行信息"
      submitButtonText="确认"
      :label-width="150"
      :forms="accountForms"
      :columns="20"
      width="500px"
      v-model:form-data="formData"
      :showBtn="false"></Dialog>
  </Table-view>
</template>

<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message'
import { payChannel } from '/@/configuration/dynamic-control'
import spPaymentChannel from '/@/api/core/spPaymentChannel'
const formData = reactive({})
const router = useRouter()
const columns = [
  {
    type: 'selection',
    width: '40'
  },
  {
    prop: 'subAccountNum',
    label: '资金账户'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'bankAccountNumber',
    label: '银行账号'
  },
  {
    prop: 'paymentBankName',
    label: '支付通道'
  },
  {
    prop: 'merchantName',
    label: '商户'
  },
  {
    prop: 'balance',
    label: '实时余额(元)'
  },
  {
    prop: 'statusDesc',
    label: '是否可用',
    'min-width': 80
  },
  {
    prop: 'updateTime',
    label: '更新时间'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 180
  }
]
const accountShow = ref(false)
const conditionForms = [
  {
    control: 'InputPlus',
    key: 'subAccountNum',
    label: '资金账户'
  },
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true }
  },
  {
    control: 'MerchantSelect',
    key: 'merchantId',
    label: '商户'
  },
  payChannel({ key: 'paymentBankId' })
  // {
  // 	control: 'el-select',
  // 	key: 'paymentBankId',
  // 	label: '支付通道',
  // },
]
const accountForms = [
  {
    control: 'InputCopy',
    key: 'bankBranch',
    label: '收款开户行',
    props: {
      disabled: true,
      copy: true
    }
  },
  {
    control: 'InputCopy',
    key: 'mainAccount',
    label: '收款账号',
    props: {
      disabled: true,
      copy: true
    }
  },
  {
    control: 'InputCopy',
    key: 'spName',
    label: '收款户名',
    props: {
      disabled: true,
      copy: true
    }
  }
]
const handleBtn = () => {
  useMessage().wraning('功能正在开发, 请等待~')
}
const handleViewAccount = (row) => {
  accountShow.value = true
  spPaymentChannel
    .getObj(row.paymentBankId)
    .then((res: any) => {
      Object.assign(formData, res.data)
    })
    .catch((err: any) => {})
    .finally(() => {})
}
const handleDetail = (row: any) => {
  router.push({
    path: '/finance/merchantAccountCapital/detail',
    query: {
      id: row.id
    },
    state: {
      refresh: 1
    }
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
