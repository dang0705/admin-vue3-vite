<template>
  <div class="layout-padding">
    <Form-view
      v-model="formData"
      :page="page"
      :pagination-with-save="false"
      :forms="forms"
      :columns="12"
      :on-submit="submit"
      vertical
      class="layout-padding-view layout-padding" />
  </div>
</template>

<script setup lang="ts">
import employeeBasic from '@jmyg/views/employee/info/configurations/add/employee-basic'
import uploadContract from '@jmyg/views/employee/info/configurations/add/upload-contract'
import insurance from '@jmyg/views/employee/info/configurations/add/socialInsurance'
import {
  addObj as info,
  getStep,
  contract,
  insurance as saveInsurance
} from '@jmyg/api/outsourcing/employeeInfo'

const stepRequets = [info, getStep, saveInsurance]
const $route = useRoute()
const page = ref(3)

watch(
  () => $route.query.id,
  async (id) => {
    if (id) {
      const {
        data: { employeeStepStatus: step, onDutyStatus }
      } = await getStep({ id })
      page.value = +step
    }
  },
  { immediate: true }
)

const forms = [employeeBasic, uploadContract, insurance]
const formData = ref(
  __isDev
    ? {
        name: '张三',
        idCode: '310102198703102850',
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
        idPortrait: ['http://sssss'],
        idNationalEmblem: ['http://sssss'],
        selfieFile: ['http://sssss'],
        // page2
        contractTemplate: 'JMYG-1',
        time: ['2023-09-10', '2025-09-09'],
        contractType: '1'
      }
    : {}
)
const insuranceFormFata = ref({})
const submit = async () => {
  stepRequets[page.value - 1]({ ...formData.value, operateStep: '2' })
}
</script>
