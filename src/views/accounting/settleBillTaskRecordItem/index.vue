<template>
  <TableView
    :actions="actions"
    :columns="newColumns"
    module="core/settleBillTaskRecordItem.ts"
    :condition-forms="forms"
    :staticQuery="staticQuery"
    labelWidth="140px"
    :exportAuth="
      route.query.id
        ? 'core_settleBill_export'
        : 'core_settleBillTaskRecordItem_export'
    "
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
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </TableView>
</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import actions from './configurations/tabel-actions'
const route: any = useRoute()
const forms = computed(() => {
  if (!route.query.id) {
    return conditionForms
  } else {
    return [
      {
        control: 'InputPlus',
        key: 'undertakerName',
        label: '承接人'
      },
      {
        control: 'InputPlus',
        key: 'undertakerCard',
        label: '承接人证件号码'
      }
    ]
  }
})
const newColumns = computed(() => {
  return columns.map((item) => {
    if (
      route.query.id &&
      (item.prop === 'billName' || item.prop === 'billNumber')
    ) {
      return {
        ...item,
        slot: false
      }
    } else {
      return item
    }
  })
})
const staticQuery = {
  settleBillId: route.query.id
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
