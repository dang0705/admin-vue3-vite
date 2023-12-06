<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <TabView
        style="padding-left: 20px"
        @get-value="toggleTab"
        :tabs="tabs"></TabView>
      <Form-view
        ref="queryRef"
        v-if="tabType === '1'"
        v-model="formData"
        :forms="conditionForms"
        :columns="12"
        disabled
        :showBtn="false"
        label-width="130px"></Form-view>
      <UndertakerTaxComponents
        ref="undertakerTaxComponentsRef"
        v-if="tabType === '2'"></UndertakerTaxComponents>
    </div>
  </div>
</template>

<script setup lang="ts" name="税务-任务详情">
import { getObj } from '@jmyg/api/core/task'
import { agreeList } from '@jmyg/api/core/merchantServiceAgreement'
const TabView = defineAsyncComponent(
  () => import('@components/Table-view/Tab-view.vue')
)
const UndertakerTaxComponents = defineAsyncComponent(
  () => import('@jmyg/views/tax/undertakerTax/index.vue')
)
const route: any = useRoute()
const tabType = ref('1')
const undertakerTaxComponentsRef = ref()
const agree_list = ref([])
const formData = reactive({
  merchantId: '',
  spId: '',
  workTimeRange: []
})
const tabs = ref([
  {
    label: '任务信息',
    attributeVal: '1'
  },
  {
    label: '承接列表',
    attributeVal: '2'
  }
])
// const conditionForms = ref([
//   {
//     control: 'MerchantSelect',
//     key: 'merchantId',
//     label: '商户',
//     title: '基本信息'
//   },
//   {
//     control: 'SpSelect',
//     key: 'spId',
//     label: '服务商'
//   },
//   {
//     control: 'el-select',
//     key: 'serviceContractId',
//     label: '服务协议'
//   },
//   {
//     control: 'InputPlus',
//     key: 'taskName',
//     label: '任务名称'
//   },
//   {
//     control: 'el-select',
//     key: 'taskTypeFirst',
//     label: '一级分类',
//     options: 'task_type'
//   },
//   {
//     control: 'el-select',
//     key: 'taskTypeSecond',
//     label: '二级分类',
//     options: 'task_type'
//   },
//   {
//     control: 'InputPlus',
//     key: 'userCount',
//     label: '需要人数'
//   },
//   {
//     control: 'InputPlus',
//     key: 'areaDescDatas',
//     label: '工作地区'
//   },
//   {
//     control: 'InputPlus',
//     key: 'address',
//     label: '任务地址'
//   },
//   {
//     control: 'InputPlus',
//     key: 'startTime',
//     label: '工作开始时间'
//   },
//   {
//     control: 'InputPlus',
//     key: 'endTime',
//     label: '工作结束时间'
//   },
//   {
//     control: 'InputPlus',
//     key: 'unitPrice',
//     label: '发包单价'
//   },
//   {
//     control: 'InputPlus',
//     key: 'count',
//     label: '发包数量'
//   },
//   {
//     control: 'el-select',
//     key: 'measuringUnit',
//     label: '计量单位',
//     options: 'task_unit'
//   },
//   {
//     control: 'InputPlus',
//     key: 'taskDesc',
//     label: '任务描述'
//   },
//   {
//     control: 'InputPlus',
//     key: 'businessMerchant',
//     label: '业务商户'
//   },
//   {
//     control: 'InputPlus',
//     key: 'businessPhone',
//     label: '业务商户手机号'
//   },
//   {
//     control: 'el-select',
//     key: 'requiredSex',
//     label: '性别要求',
//     title: '承揽要求',
//     options: 'gender_requirement'
//   },
//   {
//     control: 'InputPlus',
//     key: 'requiredAgeMin',
//     label: '年龄要求'
//   },
//   {
//     control: 'el-select',
//     key: 'educational',
//     label: '学历要求',
//     options: 'education'
//   },
//   {
//     control: 'el-select',
//     key: 'experience',
//     label: '经验要求',
//     options: 'experience'
//   },
//   {
//     control: 'InputPlus',
//     key: 'workFare',
//     label: '项目福利'
//   },
//   {
//     control: 'UploadFile',
//     key: 'workEnvironment',
//     label: '服务环境',
//     column: 24
//   }
// ])
const conditionForms = computed(() => {
  return [
    {
      control: 'MerchantSelect',
      key: 'merchantId',
      label: '商户',
      title: '基本信息'
    },
    {
      control: 'SpSelect',
      key: 'spId',
      label: '服务商'
    },
    {
      control: 'DateRange',
      key: 'workTimeRange',
      label: '任务时间',
      props: {
        disabled: true,
        teleported: false,
        // valueType: 'string',
        type: 'datetimerange',
        'start-placeholder': '任务开始时间',
        'end-placeholder': '任务结束时间'
      }
    },
    {
      control: 'el-select',
      key: 'serviceContractId',
      label: '服务协议',
      options: agree_list.value
    },
    {
      control: 'InputPlus',
      key: 'taskName',
      label: '任务名称'
    },
    {
      control: 'el-select',
      key: 'taskTypeFirst',
      label: '一级分类',
      options: 'task_type'
    },
    {
      control: 'el-select',
      key: 'taskTypeSecond',
      label: '二级分类',
      options: 'task_type'
    },
    {
      control: 'InputPlus',
      key: 'userCount',
      label: '需要人数'
    },
    {
      control: 'InputPlus',
      key: 'areaDescDatas',
      label: '任务地区'
    },
    {
      control: 'InputPlus',
      key: 'address',
      label: '任务地址'
    },
    {
      control: 'InputPlus',
      key: 'unitPrice',
      label: '发包单价'
    },
    {
      control: 'InputPlus',
      key: 'count',
      label: '发包数量'
    },
    {
      control: 'el-select',
      key: 'measuringUnit',
      label: '计量单位',
      options: 'task_unit'
    },
    {
      control: 'InputPlus',
      key: 'taskDesc',
      label: '任务描述'
    },
    {
      control: 'InputPlus',
      key: 'businessMerchant',
      label: '业务联系人'
    },
    {
      control: 'InputPlus',
      key: 'businessPhone',
      label: '联系人手机号'
    },
    {
      control: 'el-select',
      key: 'requiredSex',
      label: '性别要求',
      title: '承揽要求',
      options: 'gender_requirement'
    },
    {
      control: 'InputPlus',
      key: 'requiredAgeMin',
      label: '年龄要求'
    },
    {
      control: 'el-select',
      key: 'educational',
      label: '学历要求',
      options: 'education'
    },
    {
      control: 'el-select',
      key: 'experience',
      label: '经验要求',
      options: 'experience'
    },
    {
      control: 'InputPlus',
      key: 'workFare',
      label: '项目福利'
    },
    {
      control: 'UploadFile',
      key: 'workEnvironment',
      label: '服务环境',
      value: [],
      column: 24
    }
  ]
})
const toggleTab = (attributeVal: string) => {
  tabType.value = attributeVal
  if (tabType.value === '1') {
    gettaskData()
  }
}
// 初始化表单数据
const gettaskData = () => {
  getObj(route.query.taskId)
    .then((res: any) => {
      Object.assign(formData, res.data, res.data.taskRequireInfo)
      console.log('formData', formData)

      getAgreeList()
    })
    .finally(() => {})
}

// 获取协议列表
const getAgreeList = () => {
  // 获取数据
  agreeList({
    merchantId: formData.merchantId,
    spId: formData.spId,
    status: route.query.copy == 1 || !route.query.taskId ? 1 : undefined
  }).then((res: any) => {
    agree_list.value = res.data
      ? res.data.map((item) => {
          return {
            label: item.agreementName,
            value: item.agreementId
          }
        })
      : []
  })
}

onMounted(() => {
  gettaskData()
})
</script>
