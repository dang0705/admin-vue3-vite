<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    labelWidth="100px"
    getFullSelection
    v-model="selectObjs"
    module="outsourcing/socialInsurancePolicy.ts">
    <template #top-bar>
      <el-button type="primary" v-auth="'outsourcing_salaryPlan_add'">
        新增
      </el-button>
      <el-button
        :disabled="!selectObjs.length"
        type="primary"
        v-auth="'outsourcing_salaryPlan_add'">
        批量修改社保政策专员
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts" name="systemSocialInsurancePolicy">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import getActions from '@jmyg/views/outsourcing/socialInsurancePolicy/configurations/actions'
const selectObjs = ref([]) // 勾选的表格行

const actions = getActions()
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
