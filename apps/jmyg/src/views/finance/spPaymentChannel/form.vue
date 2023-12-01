<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    draggable
    width="600px">
    <form-view
      :disabled="self_disabled"
      ref="dataFormRef"
      v-model="form"
      :forms="conditionForms"
      :on-submit="onSubmit"
      :onCancel="() => (visible = false)"
      :submit-button-text="self_disabled ? '关闭' : '确认'"
      :showCancel="self_disabled ? false : true"
      :columns="20"
      vertical
      :labelWidth="160" />
  </el-dialog>
</template>

<script setup lang="ts" name="SpInfoDialog">
import { useMessage } from '@hooks/message'
import { getObj, addObj, putObj } from '@jmyg/api/core/spPaymentChannel'
import { rule } from '@utils/validate'
// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
const title = ref('')
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  spId: '',
  channelName: '',
  bankName: '',
  bankBranch: '',
  bankArea: '',
  interbankNumber: '',
  mainAccount: ''
})
const self_disabled = ref(false)

const conditionForms = ref([
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: {
      platform: true
    }
  },
  {
    control: 'InputPlus',
    key: 'channelName',
    label: '支付通道名称',
    props: {
      placeholder: '请输入支付通道名称',
      maxlength: 30
    }
    // validator: ['phone', 'emai']
    // rules: [
    //   { required: true, message: '支付通道名称不能为空', trigger: 'blur' }
    // ]
  },
  {
    control: 'el-select',
    options: 'bank_name',
    key: 'bankName',
    label: '账号类别'
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
    label: '开户行',
    props: {
      placeholder: '请输入开户行',
      maxlength: 50
    }
  },
  {
    control: 'InputPlus',
    key: 'bankArea',
    label: '开户地',
    props: {
      placeholder: '请输入开户地',
      maxlength: 100
    }
  },
  {
    control: 'InputPlus',
    key: 'interbankNumber',
    label: '开户行联行号',
    required: false,
    props: {
      placeholder: '请输入开户行联行号',
      maxlength: 12
    },
    rules: [
      {
        validator: rule.interbank,
        trigger: 'blur'
      }
    ]
  },
  {
    control: 'InputPlus',
    key: 'mainAccount',
    label: '主账号',
    props: {
      placeholder: '请输入主账号',
      maxlength: 30
    }
  }
])

// 打开弹窗
const openDialog = (id: string, disabled: boolean) => {
  if (id) {
    if (disabled) {
      title.value = '查看支付通道'
    } else {
      title.value = '编辑支付通道'
    }
  } else {
    title.value = '添加支付通道'
  }
  self_disabled.value = disabled || false
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.reset()
  })

  // 获取spPaymentChannel信息
  if (id) {
    form.id = id
    getspPaymentChannelData(id)
  }
}
// 初始化表单数据
const getspPaymentChannelData = (id: string) => {
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  })
}
// 提交
const onSubmit = async () => {
  if (self_disabled.value) {
    visible.value = false
    return
  }
  try {
    form.id ? await putObj(form) : await addObj(form)
    useMessage().success(form.id ? '修改成功' : '添加成功')
    visible.value = false
  } finally {
    console.log(1)
  }
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
