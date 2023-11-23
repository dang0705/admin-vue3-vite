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
        ? 'core_settleBillTaskRecordItem_export'
        : 'core_settleBill_export'
    "
    downBlobFileUrl="/core/settleBillTaskRecordItem/export">
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
    <template #actions="{ row }">
      <el-button
        v-auth="`core_settleBillTaskRecordItem_edit`"
        type="text"
        @click="down(row.contractFile)">
        同步银行卡信息
      </el-button>
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
import Array2Object from '/@/utils/array-2-object'
const batchMap = Array2Object({
  dic: ['yes_no_type', 'settle_status', 'payment_status']
})
interface BatchUploadRecordPage {
  isSignServiceContract: number
  isBankFourEssentialFactor: number
  billStatus: number
  paymentStatus: number
}
const down = (download) => {
  window.open(`${BASE}/${download}`)
}
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
  let list = [] as Array
  columns.forEach((item: any) => {
    if (route.query.id) {
      if (item.prop !== 'billName' && item.prop !== 'billNumber') {
        list.push(item)
      }
    } else {
      if (item.prop === 'billName' || item.prop === 'billNumber') {
        list.push({
          ...item,
          slot: true
        })
      } else {
        list.push(item)
      }
    }
  })
  return list
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
