<template>
  <TableView
    :actions="actions"
    :columns="columns"
    module="core/settleBillTaskRecordItem.ts"
    :condition-forms="conditionForms"
    labelWidth="140px"
    exportAuth="core_settleBillTaskRecordItem_export"
    downBlobFileUrl="xxx">
    <template #billName="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/accounting/settleBill/detail',
          query: {
            id: row.settleBillId
          },
          state: 1
        }">
        {{ row.billName }}
      </router-link>
    </template>
    <template #billNumber="{ row }">
      <router-link
        class="hover:underline text-blue-400"
        :to="{
          path: '/accounting/settleBill/detail',
          query: {
            id: row.settleBillId
          },
          state: 1
        }">
        {{ row.billNumber }}
      </router-link>
    </template>
  </TableView>
</template>

<script setup lang="ts">
import { useMessage, useMessageBox } from '/@/hooks/message'
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import actions from './configurations/tabel-actions'
const handleBtn = () => {
  useMessage().wraning('功能正在开发, 请等待~')
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
