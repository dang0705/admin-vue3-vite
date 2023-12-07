<template>
  <Table-view
    :columns="columns"
    :actions="actions"
    drag
    no-pagination
    module="outsourcing/salaryPlanProject.ts">
    <template #top-bar="{ otherInfo }">
      <div>
        <el-form :model="form" label-width="120px" ref="dataFormRef">
          <el-row class="paddcus" :gutter="48">
            <el-col :span="12" class="mb20">
              <el-form-item
                label="薪资方案名称："
                prop="salaryPlanName"
                :rules="[
                  {
                    required: true,
                    message: '薪资方案名称不能为空',
                    trigger: 'blur'
                  }
                ]">
                <InputPlus maxlength="30" v-model="form.salaryPlanName" />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb20">
              <el-form-item label="方案备注：" prop="salaryPlaneRemark">
                <InputPlus
                  type="textarea"
                  show-word-limit
                  maxlength="500"
                  v-model="form.salaryPlaneRemark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button
          type="primary"
          @click="addSalaryPlan(otherInfo.records)"
          v-auth="''">
          添加项目
        </el-button>
        <el-button type="primary" @click="visible = true" v-auth="''">
          导出数据模板
        </el-button>
        <el-button type="primary" @click="visible = true" v-auth="''">
          方案试算
        </el-button>
      </div>
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
          <el-form-item
            label-width="0"
            prop="leve1"
            :rules="[
              {
                required: true,
                message: '项目名称一级不能为空',
                trigger: 'change'
              }
            ]">
            <el-select
              @change="dialogFormData.leve2 = ''"
              placeholder="一级分类"
              class="w100"
              clearable
              v-model="dialogFormData.leve1">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in industryLevel_option.leve1_option" />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="leve2"
            :rules="[
              {
                required: true,
                message: '项目名称二级不能为空',
                trigger: 'change'
              }
            ]"
            label-width="0"
            style="margin-left: 12px; flex-shrink: 1">
            <el-select
              @change="twoChange"
              placeholder="二级分类"
              class="w100"
              clearable
              v-model="dialogFormData.leve2">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in industryLevel_option.leve2_option" />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </Dialog>
  </Table-view>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import {
  addObj,
  saveSort,
  getList
} from '@jmyg/api/outsourcing/salaryPlanProject'
import closeTagView from '@utils/close-tag-view'
const $router = useRouter()
const route: any = useRoute()
const visible = ref(false)
const dataFormRef = ref()
const dialogFormData = ref({
  projectSource: '',
  projectType: '',
  leve1: '',
  leve2: ''
})
const form = reactive({
  salaryPlanId: '',
  salaryPlanName: '',
  salaryPlaneRemark: ''
})
const listValue = ref()
const industry = ref([])
const decimalList = [
  {
    label: '0',
    value: 0
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  },
  {
    label: '3',
    value: 3
  },
  {
    label: '4',
    value: 4
  },
  {
    label: '5',
    value: 5
  },
  {
    label: '6',
    value: 6
  },
  {
    label: '7',
    value: 7
  },
  {
    label: '8',
    value: 8
  }
]
onMounted(async () => {
  form.salaryPlanId = route.query.salaryPlanId
  form.salaryPlanName = route.query.salaryPlanName
  let res = await getList()
  industry.value = res.data
})

const columns = [
  {
    prop: 'projectName',
    label: '工资项目',
    'min-width': 120
  },
  {
    prop: 'projectSourceDesc',
    label: '项目来源',
    // value: ({ batchType }: BatchUploadRecordPage) => batchMap.value.batch_type[batchType],
    'min-width': 120
  },
  {
    prop: 'projectTypeDesc',
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
      label: '查看',
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
      label: '删除',
      action: {
        handler: del,
        save: false,
        params: [list]
      }
    },
    {
      auth: '',
      label: '修改公式'
    }
  ]
}

// 添加项目
const addSalaryPlan = async (list) => {
  console.log(list, 999)

  saveSort({ ...form, saveParams: list })
  visible.value = true
}

// 删除
const del = (list) => {
  console.log(list, 9999)
}

// 系统项项目名称数据树形处理
const industryLevel_option = computed(() => {
  let industryLevel_option = {
    leve1_option: [],
    leve2_option: []
  }
  industry.value.forEach((item: object) => {
    if (item.parentId === '0') {
      industryLevel_option.leve1_option.push(item)
    }
    if (
      dialogFormData.value.leve1 == item.parentId &&
      dialogFormData.value.leve1
    ) {
      industryLevel_option.leve2_option.push(item)
    }
  })
  return industryLevel_option
})

// 系统项项目名称二级筛选自动带入项目类型
const twoChange = (id) => {
  if (id) {
    dialogFormData.value.projectType = industry.value.filter(
      (item) => item.id === id
    )[0].type
  } else {
    dialogFormData.value.projectType = ''
  }
}

const forms = computed(() => [
  {
    control: 'el-select',
    key: 'projectSource',
    options: 'salary_plan_project_source',
    label: '项目来源',
    onChange: (value) => {
      dialogFormData.value = {}
      dialogFormData.value.projectSource = value
    },
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
    props: {
      disabled: dialogFormData.value.projectSource === '10'
    },
    rules: [{ required: true, message: '项目类型不能为空', trigger: 'change' }]
  },
  ...(dialogFormData.value.projectType === '10'
    ? [
        {
          control: 'el-select',
          key: 'carry_rule',
          options: 'carry_rule',
          label: '进位规则',
          rules: [
            { required: true, message: '进位规则不能为空', trigger: 'change' }
          ]
        },
        {
          control: 'el-select',
          key: 'decimal',
          options: decimalList,
          label: '保留小数位',
          rules: [
            { required: true, message: '保留小数位不能为空', trigger: 'change' }
          ]
        }
      ]
    : []),
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
const saveList = async (list) => {
  const valid = await dataFormRef.value.validate().catch(() => {})
  if (!valid) return false
  try {
    console.log(list, 'list')
    let res = await saveSort({ ...form, saveParams: list })
    closeTagView(route.meta.title as string)
    $router.push({
      path: '/merchant/salaryPlan/add',
      query: {
        salaryPlanId: form.salaryPlanId,
        salaryPlanName: form.salaryPlanName
      }
    })
    console.log(res, 99999)
  } catch (error) {
    console.log(error)
  }
}
// 发布
const releaseList = (list) => {
  console.log(list, 'list')
}

const onSubmit = async () => {
  try {
    let res = await addObj({ ...form, saveParam: dialogFormData.value })
    console.log(res, 9999)
  } catch (error) {
    console.log(error)
  }
}
</script>
