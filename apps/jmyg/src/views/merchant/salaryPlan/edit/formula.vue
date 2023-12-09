<template>
  <Formula
    v-model="formula"
    :item-name="itemName"
    :salary-plan-name="salaryPlanName"
    :salary-plan-id="salaryPlanId"
    :salary-plan-project-id="salaryPlanProjectId" />
</template>
<script setup lang="ts">
import Formula from '@jmyg/views/merchant/salaryPlan/components/Formula.vue'
import { getObj } from '@jmyg/api/outsourcing/salaryPlanProject'
const {
  query: { salaryPlanProjectId, salaryPlanId }
} = useRoute()
const formula = ref('')
const itemName = ref('')
const salaryPlanName = ref('')

const getDetail = async () => {
  const {
    data: { formula: FORMULA, projectName, salaryPlanName: SALARY_PLAN_NAME }
  } = await getObj(salaryPlanProjectId)
  formula.value = FORMULA
  itemName.value = projectName
  salaryPlanName.value = SALARY_PLAN_NAME
}
getDetail()
// const salaryPlanProjectId = 666011
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
