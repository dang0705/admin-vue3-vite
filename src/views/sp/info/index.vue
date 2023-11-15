<template>
  <Table-view
    :condition-forms="conditionForms"
    :columns="columns"
    :actions="actions"
    label-width="140"
    module="core/spInfo">
    <template #top-bar>
      <el-button
        type="primary"
        class="ml10"
        @click="$router.push({ path: '/sp/info/add' })"
        v-auth="'core_spInfo_add'">
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
      width="60%"
      ref="dataFormRef"
      submit-button-text="确认"
      button-position="center" />
  </Table-view>
</template>

<script setup lang="ts">
import { spPaymentChannel } from '/@/api/core/spInfo'
import { useMessage } from '/@/hooks/message'
import { rule } from '/@/utils/validate'
const conditionForms = [
  {
    label: '服务商名称',
    key: 'spName',
    control: 'el-input'
  },
  {
    label: '状态',
    key: 'status',
    options: 'sp_status',
    control: 'el-select'
  }
]

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
    minWidth: 200
  },
  {
    label: '法人手机号',
    prop: 'legalPersonMobile',
    minWidth: 250
  },
  {
    label: '状态',
    prop: 'statusDesc',
    minWidth: 80
  },
  {
    label: '是否已开通支付通道',
    prop: 'hasPaymentChannel',
    slot: true,
    minWidth: 300
  },
  {
    label: '操作',
    slot: true,
    prop: 'actions',
    fixed: 'right',
    minWidth: 300
  }
]
const actions = ({ id, status }) => {
  return [
    {
      auth: 'core_spInfo_view',
      label: '查看',
      to: {
        path: '/sp/info/detail',
        query: {
          id,
          see: 1
        }
      }
    },
    {
      auth: 'core_spInfo_edit',
      label: '编辑',
      to: {
        path: '/sp/info/edit',
        query: { id }
      }
    },
    {
      auth: 'core_spInfo_switchStatus',
      label: status === '1' ? '停用' : '启用',
      body: '服务商',
      confirm: true,
      action: {
        handler: 'switchStatus',
        params: { id, status: status === '1' ? '0' : '1' }
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
      disabled: true
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
