<template>
  <el-card class="!border-none" shadow="never" style="margin: 10px">
    <Form-view
      :showBtn="false"
      buttonPosition="center"
      :steps="stepsData"
      ref="infoRef"
      v-model="infoForm"
      :forms="conditionForm"
      vertical></Form-view>

    <!-- <BottomButtons @click="onSubmit" text="确认" :disabled="loading">
      <template #left>
        <el-button @click="resetFields">上一步</el-button>
      </template>
      <template #right>
        <el-button @click="resetFields">下一步</el-button>
      </template>
    </BottomButtons> -->
  </el-card>
</template>

<script setup lang="ts">
const stepsData = ref([
  '员工信息录入',
  '劳务/动合同上传',
  '参保信息完善',
  '完成后提交'
])

const infoForm = ref({
  id: '',
  spId: '',
  channelName: '',
  bankName: '',
  bankBranch: '',
  bankArea: '',
  interbankNumber: '',
  mainAccount: ''
})
const baseConditionForm = [
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
const contractConditionForm = [
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
  {
    control: 'InputPlus',
    key: 'channelName',
    label: '支付通道名称',
    column: 8,
    props: {
      placeholder: '请输入支付通道名称',
      maxlength: 30
    }
  },
  {
    control: 'el-select',
    options: 'bank_name',
    key: 'bankName',
    label: '账号类别',
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
const insuranceConditionForm = [
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
  {
    control: 'InputPlus',
    key: 'channelName',
    label: '支付通道名称',
    column: 8,
    props: {
      placeholder: '请输入支付通道名称',
      maxlength: 30
    }
  },
  {
    control: 'el-select',
    options: 'bank_name',
    key: 'bankName',
    label: '账号类别',
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
const conditionForm = ref([
  baseConditionForm,
  contractConditionForm,
  insuranceConditionForm
])
</script>
<style lang="scss" scoped></style>
