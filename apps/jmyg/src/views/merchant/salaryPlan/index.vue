<template>
  <Table-view
    :columns="columns"
    :condition-forms="conditions"
    :actions="actions"
    module="outsourcing/salaryPlan.ts">
    <template #top-bar>
      <el-button
        type="primary"
        @click="$router.push({ path: '/merchant/salaryPlan/add' })"
        v-auth="''">
        新增
      </el-button>
    </template>
  </Table-view>
</template>

<script setup lang="ts">
import conditions from './configurations/conditions'
import columns from './configurations/columns'
import actions from './configurations/actions'
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
