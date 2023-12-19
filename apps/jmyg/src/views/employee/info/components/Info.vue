<template>
  <div class="layout-padding">
    <Form-view
      v-if="!id || (id && loaded)"
      v-model="formData"
      v-model:page="page"
      :use-bottom-button="useBottomButton"
      :steps="steps"
      :pagination-with-save="false"
      :next="canNext"
      :forms="forms"
      :columns="12"
      :on-submit="submit"
      vertical
      class="layout-padding-view px-[5vw] py-[24px]" />
  </div>
</template>

<script setup lang="ts">
import employeeBasic from '@jmyg/views/employee/info/configurations/add/employee-basic'
import uploadContract from '@jmyg/views/employee/info/configurations/add/upload-contract'
import insurance from '@jmyg/views/employee/info/configurations/add/social-insurance'
import closeTagView from '@utils/close-tag-view'
import {
  addObj as add,
  putObj as edit,
  getStep,
  getEmployeeAllInfo,
  contract,
  insurance as saveInsurance
} from '@jmyg/api/outsourcing/employeeInfo'

const useBottomButton = ref(true)
const tempContract = async (params: any) => {
  await contract(params)
}
const $route = useRoute()
const $router = useRouter()
const { id } = $route.query
const canNext = computed(
  () => !!(id || ($route.name.includes('添加') && page.value))
)

const stepRequests = [
  $route.name?.includes('编辑') && id ? edit : add,
  // contract,
  tempContract,
  saveInsurance
]
const page = ref(0)
const steps = ['员工信息录入', '劳动/劳务合同上传', '参保信息完善']
const loaded = ref(false)
let contractInfo = {}
let insurenceData = null
watch(
  () => page.value,
  (page) => {
    insurenceData = page === 2 ? {} : null
  },
  {
    immediate: true
  }
)

watchEffect(async () => {
  if (id) {
    try {
      loaded.value = false
      const [
        {
          data: { employeeStepStatus: step, onDutyStatus }
        },
        {
          data: { employeeContractList }
        }
      ] = await Promise.all([getStep({ id }), getEmployeeAllInfo({ id })])
      page.value = +step - 1
      contractInfo = employeeContractList
    } catch (e) {
    } finally {
      loaded.value = true
    }
  }
})

const forms = [employeeBasic, uploadContract, insurance]
const formData = ref(
  __isDev
    ? {
        // page1
        name: '张三',
        idCode: '310102198703102825',
        birthDate: '1987-03-10',
        age: 36,
        gender: '1',
        phone: '13333333333',
        email: '11@163.com',
        wechat: 'aabb',
        educationRequirement: '5',
        graduationSchool: '清华大学',
        major: '计算机',
        graduationTime: '2010-09-01',
        emergencyContactName: '李四',
        emergencyContactPhone: '13333333333',
        liveAreaDatas: '310000,310100,310101',
        liveAddress: '南蕰藻路',
        registeredAreaDatas: '310000,310100,310101',
        registeredAddress: '南蕰藻路',
        accumulationFundAccount: '5566',
        socialInsuranceAccount: '7788',
        salaryOpenBank: '18',
        salaryBankNum: '33333333',
        spId: '1727895501274783745',
        onDutyStatus: '2',
        companyId: '1723944990188449794',
        dept: '开发',
        post: '前端',
        employmentTime: '2023-09-01',
        employmentForms: '1',
        idPortrait: [
          'docs/sys-file/jmyg-hro-sit?fileName=1736640558218940418&fileType=jpg&fileSize=103898&originalName=43cb6b41629149169693749e8314e2c2.jpg'
        ],
        idNationalEmblem: [
          'docs/sys-file/jmyg-hro-sit?fileName=1736640599176318977&fileType=jpg&fileSize=103898&originalName=43cb6b41629149169693749e8314e2c2.jpg'
        ],
        selfieFile: [
          'docs/sys-file/jmyg-hro-sit?fileName=1736641050219188225&fileType=png&fileSize=6650&originalName=avatar.png'
        ],
        // page2
        contractTemplate: 'JMYG-1',
        startEndTime: ['2023-09-10', '2025-09-09'],
        contractType: '1',
        contractFile: [
          'docs/sys-file/jmyg-hro-sit?fileName=1736658497370394626&fileType=png&fileSize=1087&originalName=%E8%AF%81%E4%B9%A6%E9%AA%8C%E7%9C%9F%402x.png'
        ]
      }
    : {}
)
const submit = async () => {
  const businessId = {
    contract: {
      employeeContractId: contractInfo?.id || ''
    }
  }
  const { data } = await stepRequests[page.value]({
    ...formData.value,
    ...(id
      ? {
          id,
          ...((page as unknown as number) === 1 ? businessId.contract : {})
        }
      : {}),
    operateStep: '2'
  })
  if ($route.name?.includes('添加') && !page.value) {
    closeTagView($route.name as string)
    $router.replace({ path: '/employee/info/edit', query: { id: data } })
  }
}
</script>
