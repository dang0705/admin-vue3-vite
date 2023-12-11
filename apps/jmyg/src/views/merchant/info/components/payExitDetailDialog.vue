<template>
  <Dialog
    v-model="visible"
    v-model:formData="formData"
    title="账户详细信息"
    :disabled="!!formData.id"
    :forms="forms"
    :columns="24"
    :label-width="140"
    :on-submit="onSubmit"
    :showCancel="false"
    submitButtonText="复制信息"
    vertical></Dialog>
</template>

<script setup lang="ts">
import { getMerchantSubAccountDetail } from '@jmyg/api/core/merchantInfo'
import commonFunction from '@utils/commonFunction'
const { copyText } = commonFunction()
defineOptions({ name: 'payExitDetailDialog' })
// 定义变量内容
const dataFormRef = ref()
const visible = ref(false)
// 提交表单数据
const formData = reactive({
  id: '',
  merchantName: '',
  spName: '',
  mainAccount: '',
  bankBranch: ''
})
const forms = [
  {
    control: 'InputPlus',
    key: 'merchantName',
    label: '商户名称'
  },
  {
    control: 'InputPlus',
    key: 'spName',
    label: '收款户名'
  },
  {
    control: 'InputPlus',
    key: 'mainAccount',
    label: '收款账号'
  },
  {
    control: 'InputPlus',
    key: 'bankBranch',
    label: '收款开户行'
  }
]
// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  formData.id = ''
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })

  // 获取undertakerInfo信息
  if (id) {
    formData.id = id
    getundertakerInfoData(id)
  }
}
// 提交
const onSubmit = () => {
  const text =
    '商户名称:' +
    formData.merchantName +
    '\n' +
    '收款户名:' +
    formData.spName +
    '\n' +
    '收款账号:' +
    formData.mainAccount +
    '\n' +
    '收款开户行:' +
    formData.bankBranch
  copyText(text)
}
// 初始化表单数据
const getundertakerInfoData = (id: string) => {
  // 获取数据
  getMerchantSubAccountDetail(id)
    .then((res: any) => {
      Object.assign(formData, res.data)
    })
    .finally(() => {})
}

// 暴露变量
defineExpose({
  openDialog
})
</script>
