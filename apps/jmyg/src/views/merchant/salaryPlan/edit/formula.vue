<template>
  <Formula
    v-model="formula"
    :item-name="itemName"
    :salary-plan-version="salaryPlanVersion"
    :salary-plan-name="salaryPlanName"
    :salary-plan-id="salaryPlanId"
    :salary-plan-project-id="salaryPlanProjectId"
    @back="back" />
</template>
<script setup lang="ts">
import Formula from '@jmyg/views/merchant/salaryPlan/components/Formula.vue'
import { getObj } from '@jmyg/api/outsourcing/salaryPlanProject'
import closeTagView from '@utils/close-tag-view'
const $router = useRouter()
const formula = ref('')
const itemName = ref('')
const salaryPlanVersion = ref('')
const $route = useRoute()
const {
  salaryPlanProjectId = '',
  salaryPlanId = '',
  salaryPlanName = ''
} = $route.query

const back = () => {
  $router.push({
    path: '/merchant/salaryPlan/edit/index',
    query: { salaryPlanId, salaryPlanName, type: 'edit' },
    state: { refresh: 1 }
  })
  closeTagView($route.meta.title as string)
}
const getDetail = async () => {
  const {
    data: { formula: FORMULA, projectName, version }
  } = await getObj(salaryPlanProjectId)
  formula.value = FORMULA
  itemName.value = projectName
  salaryPlanVersion.value = version
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
