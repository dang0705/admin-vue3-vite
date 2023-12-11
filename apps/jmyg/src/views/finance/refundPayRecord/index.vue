<template>
  <Table-view
    :columns="columns"
    :actions="actions"
    :condition-forms="conditionForms"
    getListFnName="refundRecordPayPage"
    module="finance/merchantRefund" />
</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import actions from './configurations/tabel-actions'
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
