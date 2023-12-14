<template>
  <Table-view
    ref="tableViewRef"
    :columns="columns"
    :actions="actions"
    drag
    no-pagination
    module="outsourcing/salaryPlanProject.ts">
    <template #tableTop>
      <FormView
        ref="FormViewRef"
        v-model="form"
        label-width="120px"
        :showBtn="false"
        :forms="titleForms"/>
    </template>
    <template #top-bar="{ otherInfo, dialog,dialogFormData, list }">
      <el-button
        type="primary"
        @click="addSalaryPlan(otherInfo.records)"
        v-if="
          route.query.type == 'add' ||
          route.query.type == 'edit' ||
          versionInfo?.effectType == 2
        "
        v-auth="'outsourcing_salaryPlanProject_add'">
        添加项目
      </el-button>
      <el-button
        type="primary"
        v-auth="'outsourcing_salaryPlanProject_export_data'">
        导出数据模板
      </el-button>
      <el-button
        type="primary"
        v-auth="''"
        @click="trialOfThePlan(dialog, list,dialogFormData,versionInfo.versionId,route.query.salaryPlanId)">
        方案试算
      </el-button>
    </template>
    <template #table-bottom="{ list }">
      <Bottom-buttons>
        <template #left>
          <el-button type="primary" @click="$router.go(-1)" v-auth="''">
            返回
          </el-button>
        </template>
        <el-button
          type="primary"
          v-debounce:[getSaveOptions(list)]="saveList"
          :disabled="
            (route.query.type === 'see' || route.query.type === 'addVersion') &&
            versionInfo?.effectType != 2
          "
          v-auth="'outsourcing_salaryPlanProject_save'">
          保存
        </el-button>
        <template #right>
          <el-button
            type="primary"
            v-debounce:[getReleaseOptions(list)]="saveList"
            v-if="route.query.type == 'add' || route.query.type == 'edit'"
            v-auth="'outsourcing_salaryPlan_edit_release'">
            发布
          </el-button>
        </template>
      </Bottom-buttons>
    </template>
    <Dialog
      vertical
      v-model="visible"
      :title="dialogTitle"
      :label-width="150"
      :show-cancel="false"
      :showBtn="!disabled"
      :forms="forms"
      :columns="18"
      :save="false"
      v-model:form-data="dialogFormData"
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
              :disabled="disabled || dialogFormData.defaultItem == '1'"
              v-model="dialogFormData.leve1">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in industryLevel_option.leve1_option"/>
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
              :disabled="disabled || dialogFormData.defaultItem == '1'"
              v-model="dialogFormData.leve2">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in industryLevel_option.leve2_option"/>
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </Dialog>
  </Table-view>
</template>

<script setup lang="tsx">
import {
  addObj,
  saveSort,
  getList,
  getObj,
  putObj,
  releaseObj,
  getVersionObj
} from '@jmyg/api/outsourcing/salaryPlanProject'
import closeTagView from '@utils/close-tag-view'
import BottomButtons from '@components/Bottom-buttons.vue'
import trialOfThePlan from '@jmyg/views/merchant/salaryPlan/configurations/trial-of-the-plan'
// import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
const $router = useRouter()
const route: any = useRoute()
const visible = ref(false)
const tableViewRef = ref()
const FormViewRef = ref()
const versionInfo = ref()
const disabled = ref(false)
const id = ref(null)
const getSaveOptions = (list: string) => ({params: [list, 'save']})
const getReleaseOptions = (list: string) => ({params: [list, 'release']})

const dialogTitle = ref('添加工资项目')
const dialogFormData = ref({
  projectSource: '',
  projectType: '',
  leve1: '',
  leve2: '',
  projectCheck: true,
})
const form = reactive({
  salaryPlanId: '',
  salaryPlanName: '',
  salaryPlanRemark: ''
})
const listValue = ref()
const industry = ref([])
const decimalList = [
  {
    label: '0',
    value: '0'
  },
  {
    label: '1',
    value: '1'
  },
  {
    label: '2',
    value: '2'
  },
  {
    label: '3',
    value: '3'
  },
  {
    label: '4',
    value: '4'
  },
  {
    label: '5',
    value: '5'
  },
  {
    label: '6',
    value: '6'
  },
  {
    label: '7',
    value: '7'
  },
  {
    label: '8',
    value: '8'
  }
]
onMounted(async () => {
  form.salaryPlanId = route.query.salaryPlanId
  form.salaryPlanName = route.query.salaryPlanName
  let res = await getList()
  industry.value = res.data
  let Version = await getVersionObj(route.query.salaryPlanId)
  Object.assign(form, Version.data)
  versionInfo.value = Version.data.salaryPlanVersionList.filter(
    (item) => item.effectType == 1
  )[0]
})

const versionChange = (value) => {
  versionInfo.value = form.salaryPlanVersionList.filter(
    (item) => item.version == value
  )[0]
  tableViewRef.value?.getDataList(true, {
    versionId: versionInfo.value.versionId
  })
}
// 头部版本信息配置
const titleForms = computed(() => [
  {
    control: 'InputPlus',
    key: 'salaryPlanName',
    label: '薪资方案名称',
    column: 12,
    props: {
      maxlength: '30',
      disabled: route.query.type === 'see' || route.query.type === 'addVersion'
    }
  },
  ...(route.query.type === 'see' || route.query.type === 'addVersion'
    ? [
      {
        control: 'el-select',
        key: 'version',
        label: '版本',
        options: form.salaryPlanVersionList,
        required: false,
        value: versionInfo.value?.version,
        change: (value) => versionChange(value),
        props: {
          clearable: false,
          label: 'version',
          value: 'version'
        }
      }
    ]
    : [{props: {disabled: true}}]),
  {
    control: 'InputPlus',
    key: 'salaryPlanRemark',
    label: '方案备注',
    column: 12,
    required: false,
    props: {
      type: 'textarea',
      maxlength: '500',
      showWordLimit: true,
      disabled: route.query.type === 'see' || route.query.type === 'addVersion'
    }
  },
  ...(route.query.type === 'see' || route.query.type === 'addVersion'
    ? [
        {
          control: 'elDatePicker',
          key: 'effectTime',
          label: '生效日期',
          value: versionInfo.value?.effectTime == null ? '' : versionInfo.value?.effectTime,
          title: '版本信息',
          required: false,
          props: {
            valueFormat: 'YYYY-MM-DD',
            disabled: versionInfo.value?.effectType != 2
          }
        },
        {
          control: 'InputPlus',
          key: 'invalidTime',
          label: '失效日期',
          value: versionInfo.value?.invalidTime == null ? '' : versionInfo.value?.invalidTime,
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'updateName',
          label: '更新人',
          value: versionInfo.value?.updateName,
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'updateTime',
          label: '更新时间',
          value: versionInfo.value?.updateTime,
          props: {
            disabled: true
          }
        },
        {
          control: 'InputPlus',
          key: 'versionRemark',
          label: '备注',
          required: false,
          value: versionInfo.value?.versionRemark,
          column: 24,
          props: {
            type: 'textarea',
            maxlength: '500',
            showWordLimit: true,
            disabled: versionInfo.value?.effectType != 2
          }
        },
    ]
    : [])
])

const columns = [
  {
    prop: 'projectName',
    label: '工资项目',
    'min-width': 120
  },
  {
    prop: 'grouping',
    label: '分组',
    'min-width': 80
  },
  {
    prop: 'projectSourceDesc',
    label: '项目来源',
    // value: ({ batchType }: BatchUploadRecordPage) => batchMap.value.batch_type[batchType],
    'min-width': 80
  },
  {
    prop: 'defaultItem',
    label: '是否默认项',
    value: (value: string) => (value.defaultItem == '1' ? '是' : '否'),
    'min-width': 80
  },
  {
    prop: 'projectTypeDesc',
    label: '项目类型',
    'min-width': 80
  },
  {
    prop: 'displayName',
    label: '显示名称',
    'min-width': 80
  },
  {
    prop: 'salaryShow',
    label: '薪资表是否展示',
    value: (value: string) => (value.salaryShow == '1' ? '是' : '否'),
    'min-width': 100
  },
  {
    prop: 'payslipShow',
    label: '工资条是否展示',
    value: (value: string) => (value.payslipShow == '1' ? '是' : '否'),
    'min-width': 100
  },
  {
    prop: 'formula',
    label: '计算公式',
    'min-width': 200
  },
  {
    prop: 'salaryPlanProjectDesc',
    label: '备注',
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
      auth: 'outsourcing_salaryPlanProject_view_info',
      label: '查看',
      action: {
        handler: view,
        save: false,
        params: row
      }
    },
    {
      auth: 'outsourcing_salaryPlanProject_edit',
      label: '编辑',
      show: () =>
        route.query.type == 'add' ||
        route.query.type == 'edit' ||
        versionInfo.value?.effectType == 2,
      action: {
        handler: edit,
        save: false,
        params: {row, list}
      }
    },
    {
      auth: 'outsourcing_salaryPlanProject_del',
      label: '删除',
      icon: 'icon_a-shanchu1',
      confirm: {
        ask: '您确定将此方案项删除吗？'
      },
      show: () =>
        row.defaultItem != '1'&&
        (route.query.type == 'add' ||
        route.query.type == 'edit' ||
        versionInfo.value?.effectType == 2),
      action: {
        handler: del,
        save: false,
        params: {row, list}
      }
    },
    {
      auth: 'outsourcing_salaryPlanProject_edit_formula',
      label: '修改公式',
      show: () =>
        row.projectSource === '30' &&
        (route.query.type == 'add' ||
          route.query.type == 'edit' ||
          versionInfo.value?.effectType == 2),
      action: {
        handler: goFormula,
        save: false,
        params: {
          salaryPlanId: form.salaryPlanId,
          salaryPlanName: form.salaryPlanName,
          salaryPlanProjectId: row.id
        }
      }
    }
  ]
}

// 添加项目
const addSalaryPlan = async (list) => {
  listValue.value = list
  disabled.value = false
  id.value = null
  dialogTitle.value = '添加工资项目'
  visible.value = true
}

// 查看
const view = async (row) => {
  visible.value = true
  disabled.value = true
  dialogTitle.value = row.defaultItem == '1' ? '默认项详情' : '工资项目详情'
  try {
    let res = await getObj(row.id)
    dialogFormData.value = {...res.data}
  } catch (error) {
    console.log(error)
  }
}

// 编辑
const edit = async ({row, list}) => {
  listValue.value = list
  disabled.value = false
  id.value = row.id
  visible.value = true
  dialogTitle.value = row.defaultItem == '1' ? '修改默认项' : '修改工资项目'
  try {
    let res = await getObj(row.id)
    dialogFormData.value = {...res.data}
  } catch (error) {
    console.log(error)
  }
}

// 删除
const del = ({row, list}) => {
  tableViewRef?.value.delListItem(row.id)
}

// 修改公式
const goFormula = ({salaryPlanProjectId}) => {
  $router.push({
    path: `/merchant/salaryPlan/${
      route.name.includes('查看') ? 'view' : 'edit'
    }/formula`,
    query: {
      salaryPlanName: form.salaryPlanName,
      salaryPlanProjectId,
      salaryPlanId: form.salaryPlanId
    }
  })
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
    let arr = industry.value.filter(
      (item) => item.id === id
    )[0]
    dialogFormData.value.projectType = arr.type
    if (dialogFormData.value.projectCheck) {
      let name1 = industry.value.filter(
        (item) => item.id === dialogFormData.value.leve1
      )[0].name
      dialogFormData.value.displayName = name1 + '-' + arr.name
    }
  } else {
    dialogFormData.value.projectType = ''
    dialogFormData.value.displayName = ''
  }
}

// 显示名称显示逻辑
const projectCheckChange = () => {
  if (dialogFormData.value.projectCheck) {
    if (dialogFormData.value.projectSource === '10' && dialogFormData.value.leve2 != '' && dialogFormData.value.leve2 != null) {
      let name1 = industry.value.filter(
        (item) => item.id === dialogFormData.value.leve1
      )[0].name
      let name2 = industry.value.filter(
        (item) => item.id === dialogFormData.value.leve2
      )[0].name
      dialogFormData.value.displayName = name1 + '-' + name2
    }else {
      dialogFormData.value.displayName = dialogFormData.value.projectName
    }
  }
}
// Dialog配置项
const forms = computed(() => [
  {
    control: 'el-select',
    key: 'projectSource',
    options: 'salary_plan_project_source',
    label: '项目来源',
    props: {
      disabled: disabled.value || dialogFormData.value.defaultItem == '1'
    },
    change: (value) => {
      dialogFormData.value = {}
      dialogFormData.value.projectSource = value
      dialogFormData.value.projectCheck = true
    }
  },
  ...(dialogFormData.value.projectSource == '10'
    ? [
      {
        key: 'projectNameS',
        slot: true,
        labelWidth: '0',
        required: false
      }
    ]
    : [
        {
          control: 'InputPlus',
          key: 'projectName',
          label: '项目名称',
          props: {
            disabled: disabled.value || dialogFormData.value.defaultItem == '1',
            maxlength: '20'
          }
        }
    ]),
  {
    control: 'el-select',
    key: 'projectType',
    options: 'salary_plan_project_type',
    label: '项目类型',
    props: {
      disabled: dialogFormData.value.projectSource === '10' || disabled.value || dialogFormData.value.defaultItem == '1'
    }
  },
  {
    control: 'InputPlus',
    key: 'displayName',
    label: '显示名称',
    props: {
      disabled: disabled.value || dialogFormData.value.projectCheck,
      maxlength: '20'
    }
  },
  {
    key: 'projectCheck',
    column: 4,
    labelWidth: '0',
    slot: ({row}: any) => <el-checkbox class="!text-default" disabled={disabled.value} v-model={row.projectCheck} change={projectCheckChange()} label="与项目名称一致"/>
  },
  ...(dialogFormData.value.projectSource === '30'
    ? [
      {
        control: 'el-select',
        key: 'carryRule',
        options: 'carry_rule',
        label: '进位规则',
        props: {
          disabled: disabled.value
        }
      },
      {
        control: 'el-select',
        key: 'decimalPlaces',
        options: decimalList,
        label: '保留小数位',
        props: {
          disabled: disabled.value
        }
      }
    ]
    : []),
  {
    control: 'el-select',
    key: 'salaryShow',
    options: 'yes_no_type',
    label: '薪资表是否展示',
    value: '1',
    props: {
      disabled: disabled.value
    }
  },
  {
    control: 'el-select',
    key: 'payslipShow',
    options: 'yes_no_type',
    label: '工资条是否展示',
    value: '1',
    props: {
      disabled: disabled.value
    }
  },
  {
    control: 'InputPlus',
    key: 'grouping',
    label: '分组',
    props: {
      maxlength: '20',
      disabled: disabled.value
    },
    required: false
  },
  {
    control: 'InputPlus',
    key: 'salaryPlanProjectDesc',
    label: '备注',
    props: {
      type: 'textarea',
      maxlength: '500',
      showWordLimit: true,
      disabled: disabled.value
    },
    required: false
  }
])

// 保存 发布
const saveList = async (list, type) => {
  // const valid = await tableViewRef.value.validate().catch(() => {})
  // if (!valid) return false
  try {
    if (type === 'save') {
      await saveSort({
        ...form,
        modify: '1',
        saveParams: list,
        versionParam: {
          versionId: versionInfo.value.versionId,
          effectTime: form.effectTime,
          versionRemark: form.versionRemark
        }
      })
      if (form.salaryPlanName != route.query.salaryPlanName) {
        closeTagView(route.meta.title as string)
        $router.push({
          path: '/merchant/salaryPlan/add',
          query: {
            salaryPlanId: form.salaryPlanId,
            salaryPlanName: form.salaryPlanName
          }
        })
      }
      if (route.query.type === 'see' || route.query.type === 'addVersion') {
        closeTagView(route.meta.title as string)
        $router.push({
          path: '/merchant/salaryPlan/index',
          state: {
            refresh: 1
          }
        })
      }
    } else {
      await releaseObj({
        ...form,
        modify: '1',
        saveParams: list,
        versionParam: {
          versionId: versionInfo.value.versionId,
          effectTime: form.effectTime,
          versionRemark: form.versionRemark
        }
      })
      closeTagView(route.meta.title as string)
      $router.push({
        path: '/merchant/salaryPlan/index',
        state: {
          refresh: 1
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// 提交
const onSubmit = async () => {
  try {
    await saveSort({
      ...form,
      modify: '0',
      saveParams: listValue.value,
      versionParam: {
        versionId: versionInfo.value?.versionId,
        effectTime: form.effectTime,
        versionRemark: form.versionRemark
      }
    })
    id.value == null
      ? await addObj({
        ...form,
        modify: '0',
        param: dialogFormData.value,
        versionParam: {
          versionId: versionInfo.value.versionId,
          effectTime: form.effectTime,
          versionRemark: form.versionRemark
        }
      })
      : await putObj({
        ...form,
        modify: '0',
        param: {...dialogFormData.value,id: id.value},
        versionParam: {
          versionId: versionInfo.value.versionId,
          effectTime: form.effectTime,
          versionRemark: form.versionRemark
        }
      })
    tableViewRef.value?.getDataList(true, {
      versionId: versionInfo.value.versionId
    })
  } catch (error) {
    console.log(error)
  }
}
</script>
