<template>
  <el-dialog
    title="添加支付通道"
    v-model="visible"
    :close-on-click-modal="false"
    draggable
    width="60%">
    <form-view
      v-if="visible"
      ref="dataFormRef"
      v-model="form"
      :forms="conditionForms"
      :on-submit="onSubmit"
      :onCancel="() => (visible = false)"
      submit-button-text="确认"
      :columns="12"
      vertical
      :labelWidth="140"
      button-position="center" />
  </el-dialog>
</template>

<script setup lang="ts">
import { useMessage } from '@hooks/message'
import { spPaymentChannel } from '@jmyg/api/core/spInfo'
import { rule } from '@utils/validate'
defineOptions({ name: 'SpInfoDialog' })
const emit = defineEmits(['refresh'])

// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const loading = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  spId: '',
  channelName: '',
  bankName: '',
  // bankNumber: '',
  bankBranch: '',
  bankArea: '',
  interbankNumber: '',
  mainAccount: ''
})

const conditionForms = ref([
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商:',
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
    }
  },
  {
    control: 'el-select',
    options: 'bank_name',
    forceOptions: true,
    key: 'bankName',
    label: '账号类别:'
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
    }
  },
  {
    control: 'InputPlus',
    key: 'bankArea',
    label: '开户地:',
    props: {
      placeholder: '请输入开户地'
    }
  },
  {
    control: 'InputPlus',
    key: 'interbankNumber',
    label: '开户行联行号:',
    props: {
      placeholder: '请输入开户行联行号'
    },
    validator: 'interbank'
  },
  {
    control: 'InputPlus',
    key: 'mainAccount',
    label: '主账号:',
    props: {
      placeholder: '请输入主账号'
    }
  }
])

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.reset()
    form.id = id
    form.spId = id
  })
}

// 提交
const onSubmit = async () => {
  try {
    loading.value = true
    await spPaymentChannel(form)
    useMessage().success('开启成功')
    visible.value = false
    emit('refresh')
  } finally {
    loading.value = false
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
