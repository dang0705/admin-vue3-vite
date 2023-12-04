<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    :params="{ salaryPlanId: '1' }"
    sort-drag
    no-pagination
    module="outsourcing/salaryPlanProject.ts">
    <template #top-bar>
      <el-button type="primary" @click="visible = true" v-auth="''">
        添加项目
      </el-button>
    </template>
    <Dialog
      vertical
      v-model="visible"
      title="添加工资项目"
      :label-width="150"
      :show-cancel="false"
      :forms="forms"
      :columns="20"
      v-model:form-data="dialogFormData"
      :on-cancel="onCancel"
      :on-submit="onSubmit"
      submit-button-text="提交"
      button-position="center" />
  </Table-view>
</template>

<script setup lang="ts">
const visible = ref(false)
const dialogFormData = ref({})
const columns = [
  {
    prop: 'projectName',
    label: '工资项目',
    'min-width': 120
  },
  {
    prop: 'projectSource',
    label: '项目来源',
    // value: ({ batchType }: BatchUploadRecordPage) => batchMap.value.batch_type[batchType],
    'min-width': 120
  },
  {
    prop: 'projectType',
    label: '项目类型',
    'min-width': 160
  },
  {
    prop: 'isShow',
    label: '薪资表是否展示',
    value: (value: string) => (value ? '是' : '否'),
    'min-width': 160
  },
  {
    prop: 'isPayslip',
    label: '工资条是否展示',
    value: (value: string) => (value ? '是' : '否'),
    'min-width': 160
  },
  {
    prop: 'formula',
    label: '计算公式',
    'min-width': 200
  },
  {
    label: '操作',
    slot: true,
    prop: 'actions',
    fixed: 'right',
    minWidth: 200
  }
]

const actions = () => {
  return [
    {
      auth: '',
      label: '删除'
    },
    {
      auth: '',
      label: '编辑'
    },
    {
      auth: '',
      label: '修改公式'
    }
  ]
}

const forms = ref([
  {
    control: 'el-select',
    key: 'projectSource',
    options: 'salary_plan_project_source',
    forceOptions: true,
    label: '项目来源:',
    rules: [{ required: true, message: '项目来源不能为空', trigger: 'change' }]
  },
  {
    control: 'InputPlus',
    key: 'projectName',
    label: '项目名称:',
    rules: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }]
  },
  {
    control: 'el-select',
    key: 'projectType',
    forceOptions: true,
    options: 'salary_plan_project_type',
    label: '项目类型:',
    rules: [{ required: true, message: '项目类型不能为空', trigger: 'change' }]
  },
  {
    control: 'el-select',
    key: 'salaryShow',
    options: 'yes_no_type',
    label: '薪资表是否展示:',
    rules: [
      { required: true, message: '薪资表是否展示不能为空', trigger: 'change' }
    ]
  },
  {
    control: 'el-select',
    key: 'payslipShow',
    options: 'yes_no_type',
    label: '工资条是否展示:',
    rules: [
      { required: true, message: '工资条是否展示不能为空', trigger: 'change' }
    ]
  },
  {
    control: 'InputPlus',
    key: 'desc',
    label: '备注',
    props: {
      type: 'textarea',
      maxlength: '500',
      showWordLimit: true
    },
    required: false
  }
])

const onSubmit = () => {
  console.log(222)
}
</script>
