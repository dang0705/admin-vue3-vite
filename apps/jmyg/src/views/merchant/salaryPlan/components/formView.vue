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
    <template #bottomActions="{ list }">
      <div class="flex items-center justify-center mt-[50px]">
        <el-button type="primary" @click="$router.go(-1)" v-auth="''">
          返回
        </el-button>
        <el-button type="primary" @click="saveList(list)" v-auth="''">
          保存
        </el-button>
        <el-button type="primary" @click="releaseList(list)" v-auth="''">
          发布
        </el-button>
      </div>
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
      button-position="center">
      <template #projectNameS>
        <el-col :span="24" class="formBox" style="padding-right: 0">
          <div style="min-width: 145px" class="com_label text-[12px] require">
            <span>项目名称：</span>
          </div>
          <el-form-item label-width="0" prop="industryLevel1">
            <el-select
              @change="dialogFormData.industryLevel2 = ''"
              placeholder="一级分类"
              class="w100"
              clearable
              v-model="dialogFormData.industryLevel1">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in industryLevel_option.industryLevel1_option" />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="industryLevel2"
            label-width="0"
            style="margin-left: 12px; flex-shrink: 1">
            <el-select
              @change="twoC(e)"
              placeholder="二级分类"
              class="w100"
              clearable
              v-model="dialogFormData.industryLevel2">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
                v-for="item in industryLevel_option.industryLevel2_option" />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </Dialog>
  </Table-view>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
const route: any = useRoute()
const visible = ref(false)
const dialogFormData = ref({
  projectSource: '',
  industryLevel1: '',
  industryLevel2: ''
})
const listValue = ref()
const { industry } = useDict('industry')
onMounted(() => {
  listValue.value = {
    id: route.query.id,
    salaryPlanName: route.query.salaryPlanName
  }
  console.log(route.query.id, route.query.salaryPlanName)
})

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

const actions = (row, list) => {
  return [
    {
      auth: '',
      label: '删除',
      action: {
        handler: del,
        save: false,
        params: [list]
      }
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

const del = (list) => {
  console.log(list, 9999)
}

const industryLevel_option = computed(() => {
  let industryLevel_option = {
    industryLevel1_option: [],
    industryLevel2_option: []
  }
  industry.value.forEach((item: object) => {
    if (!item.parentValue) {
      industryLevel_option.industryLevel1_option.push(item)
    }
    if (
      dialogFormData.value.industryLevel1 == item.parentValue &&
      dialogFormData.value.industryLevel1
    ) {
      industryLevel_option.industryLevel2_option.push(item)
    }
  })
  return industryLevel_option
})

const twoC = (e) => {
  console.log(e, 6666)
}

const forms = computed(() => [
  {
    control: 'el-select',
    key: 'projectSource',
    options: 'salary_plan_project_source',
    label: '项目来源',
    rules: [{ required: true, message: '项目来源不能为空', trigger: 'change' }]
  },
  ...(dialogFormData.value.projectSource === '10'
    ? [
        {
          key: 'projectNameS',
          slot: true
        }
      ]
    : [
        {
          control: 'InputPlus',
          key: 'projectName',
          label: '项目名称',
          rules: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ]
        }
      ]),
  {
    control: 'el-select',
    key: 'projectType',
    options: 'salary_plan_project_type',
    label: '项目类型',
    rules: [{ required: true, message: '项目类型不能为空', trigger: 'change' }]
  },
  {
    control: 'el-select',
    key: 'salaryShow',
    options: 'yes_no_type',
    label: '薪资表是否展示',
    rules: [
      { required: true, message: '薪资表是否展示不能为空', trigger: 'change' }
    ]
  },
  {
    control: 'el-select',
    key: 'payslipShow',
    options: 'yes_no_type',
    label: '工资条是否展示',
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

// 保存
const saveList = (list) => {
  console.log(list, 'list')
}
// 发布
const releaseList = (list) => {
  console.log(list, 'list')
}

const onSubmit = () => {
  console.log(dialogFormData.value, 222)
  console.log(tableVlue.value, 999)
}
</script>
