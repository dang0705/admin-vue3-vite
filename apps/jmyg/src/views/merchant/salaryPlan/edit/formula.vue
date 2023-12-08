<template>
  <Formula
    v-model="formula"
    :item-name="itemName"
    :salary-plan-id="salaryPlanId"
    :salary-plan-project-id="salaryPlanProjectId" />
</template>
<script setup lang="ts">
import Formula from '@jmyg/views/merchant/salaryPlan/components/Formula.vue'
const formula = 'SUM(基础工资,考勤奖)'
const itemName = '未打卡扣款='
const salaryPlanId = 666
const salaryPlanProjectId = 666011
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
