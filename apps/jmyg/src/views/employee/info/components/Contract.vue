<template>
  <Form-view
    :showBtn="false"
    buttonPosition="center"
    :steps="stepsData"
    ref="infoRef"
    v-model="form"
    :forms="conditionForm"
    vertical></Form-view>
</template>

<script setup lang="ts">
const form = ref({
  id: '',
  spId: '',
  channelName: '',
  bankName: '',
  bankBranch: '',
  bankArea: '',
  interbankNumber: '',
  mainAccount: ''
})

const conditionForm = [
  {
    control: 'InputPlus',
    key: 'name',
    label: '姓名',
    column: 8,
    props: {
      placeholder: '请输入姓名',
      maxlength: 30
    }
  },
  {
    control: 'InputPlus',
    label: '证件类型',
    value: '身份证',
    column: 8,
    props: {
      disabled: true
    }
  },
  {
    control: 'InputPlus',
    key: 'idCode',
    label: '证件号码',
    column: 8,
    props: {
      placeholder: '请输入证件号码',
      maxlength: 30
    }
  },
  // {
  //   control: 'InputPlus',
  //   key: 'birthDay',
  //   label: '出生日期',
  //   column: 8,
  //   props: {
  //     disabled: true
  //   }
  // },
  // {
  //   control: 'InputPlus',
  //   key: 'age',
  //   label: '年龄(岁):',
  //   column: 8,
  //   props: {
  //     disabled: true
  //   }
  // },
  // {
  //   control: 'InputPlus',
  //   key: 'gender',
  //   label: '性别',
  //   column: 8,
  //   props: {
  //     disabled: true
  //   }
  // },
  {
    control: 'el-select',
    options: 'bank_name',
    key: 'bankName',
    label: '手机号码',
    columns: 8
  },
  {
    control: 'InputPlus',
    key: 'bankBranch',
    label: '开户行',
    column: 8,
    props: {
      placeholder: '请输入开户行',
      maxlength: 50
    }
  },
  {
    control: 'InputPlus',
    key: 'bankArea',
    label: '开户地',
    column: 8,
    props: {
      placeholder: '请输入开户地',
      maxlength: 100
    }
  }
]
</script>
<style lang="scss" scoped></style>
