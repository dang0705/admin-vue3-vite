<template>
  <Table-view
    :columns="columns"
    :actions="actions"
    :condition-forms="conditionForms"
    getListFnName="getRefundPage"
    module="finance/merchantRefund">
    <template #subAccountNum="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/finance/merchantAccountCapital/detail',
          query: {
            id: row.accountId
          },
          state: 1
        }">
        {{ row.subAccountNum }}
      </router-link>
    </template>
  </Table-view>
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
