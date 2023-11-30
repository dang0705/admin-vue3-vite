<template>
  <Table-view
    :condition-forms="conditionForms"
    :columns="columns"
    :actions="actions"
    label-width="140"
    module="core/platformSp">
    <template #statusDesc="{ row }">
      <Tag :type="getType(row.status)" :text="row.statusDesc"></Tag>
    </template>
    <template #top-bar="{ otherInfo }">
      <el-button
        type="primary"
        :disabled="otherInfo.records.length > 0"
        @click="$router.push({ path: '/sp/platform/add' })"
        v-auth="'core_platformSp_add'">
        +添加服务商
      </el-button>
    </template>
    <template
      #hasPaymentChannel="{ row: { hasPaymentChannel, statusDesc, id } }">
      <div v-if="hasPaymentChannel === '1'">是</div>
      <div v-else-if="hasPaymentChannel === '0' && statusDesc === '停用'">
        否
      </div>
      <el-button v-else text type="primary" @click="openDialog(id)">
        否，立即前往开通
      </el-button>
    </template>
    <Dialog
      title="添加支付通道"
      v-model="visible"
      v-model:form-data="form"
      force-update
      :close-on-click-modal="false"
      :forms="forms"
      :on-submit="onSubmit"
      :columns="12"
      :labelWidth="140"
      vertical
      draggable
      width="600px"
      ref="dataFormRef"
      submit-button-text="确认"
      button-position="center" />
  </Table-view>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import { spPaymentChannel } from '@jmyg/api/core/spInfo'
import { useMessage } from '@hooks/message'
import { rule } from '@utils/validate'
const conditionForms = [
  {
    label: '服务商名称',
    key: 'spName',
    control: 'el-input'
  }
]
const { sp_status } = useDict('sp_status')
const getType = (status: string) => {
  return sp_status.value.find((item) => item.value === status).color
}
const columns = [
  {
    label: '服务商名称',
    prop: 'spName',
    minWidth: '200'
  },
  {
    label: '社会统一信用代码',
    prop: 'socialCreditCode',
    minWidth: 200
  },
  {
    label: '法定代表人',
    prop: 'legalPersonName',
    minWidth: 180
  },
  {
    label: '法人手机号',
    prop: 'legalPersonMobile',
    minWidth: 180
  },
  {
    label: '是否已开通支付通道',
    prop: 'hasPaymentChannel',
    slot: true,
    minWidth: 180
  },
  {
    label: '操作',
    slot: true,
    prop: 'actions',
    fixed: 'right',
    minWidth: 200
  }
]
const actions = ({ id, status }) => {
  return [
    {
      auth: 'core_platformSp_view',
      label: '查看',
      to: {
        path: '/sp/platform/detail',
        query: {
          id,
          see: 1
        }
      }
    },
    {
      auth: 'core_platformSp_edit',
      label: '编辑',
      to: {
        path: '/sp/platform/edit',
        query: { id }
      }
    }
  ]
}

const visible = ref(false)

const forms = ref([
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商:',
    rules: [
      { required: true, message: '服务商名称不能为空', trigger: 'change' }
    ],
    props: {
      disabled: true,
      platform: true
    }
  },
  {
    control: 'InputPlus',
    key: 'channelName',
    label: '支付通道名称:',
    props: {
      placeholder: '请输入支付通道名称'
    },
    rules: [
      { required: true, message: '支付通道名称不能为空', trigger: 'blur' }
    ]
  },
  {
    control: 'el-select',
    options: 'bank_name',
    forceOptions: true,
    key: 'bankName',
    label: '账号类别:',
    rules: [{ required: true, message: '账号类别不能为空', trigger: 'change' }]
  },
  // {
  // 	control: 'InputPlus',
  // 	key: 'bankNumber',
  // 	label: '网关地址:',
  // 	props: {
  // 		placeholder: '请输入网关地址',
  // 	},
  // 	rules: [{ required: true, message: '网关地址不能为空', trigger: 'blur' }],
  // },
  {
    control: 'InputPlus',
    key: 'bankBranch',
    label: '开户行:',
    props: {
      placeholder: '请输入开户行'
    },
    rules: [{ required: true, message: '开户行不能为空', trigger: 'blur' }]
  },
  {
    control: 'InputPlus',
    key: 'bankArea',
    label: '开户地:',
    props: {
      placeholder: '请输入开户地'
    },
    rules: [{ required: true, message: '开户地不能为空', trigger: 'blur' }]
  },
  {
    control: 'InputPlus',
    key: 'interbankNumber',
    label: '开户行联行号:',
    props: {
      placeholder: '请输入开户行联行号'
    },
    rules: [
      { required: true, message: '开户行联行号不能为空', trigger: 'blur' },
      {
        validator: rule.interbank,
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'mainAccount',
    label: '主账号:',
    props: {
      placeholder: '请输入主账号'
    },
    rules: [{ required: true, message: '主账号不能为空', trigger: 'blur' }]
  }
])
const form = ref({
  id: '',
  spId: ''
})
const openDialog = (id: string) => {
  visible.value = true
  nextTick(() => {
    form.value.id = id
    form.value.spId = id
  })
}
const onSubmit = async () => {
  try {
    await spPaymentChannel({ ...form.value })
    useMessage().success('开通成功')
  } catch (err: any) {
    console.log(err)
  }
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
