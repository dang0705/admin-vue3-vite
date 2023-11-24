<template>
  <TableView
    :columns="newColumns"
    :condition-forms="forms"
    :actions="actions"
    :staticQuery="staticQuery"
    :exportAuth="
      route.query.id
        ? 'core_settleBillTaskRecordItem_export'
        : 'core_settleBill_export'
    "
    labelWidth="140px"
    module="core/settleBillTaskRecordItem"
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
        v-auth="`core_settleBill_agree`"
        type="text"
        v-if="row.contractFile"
        @click="down(row.contractFile)">
        查看关联协议
      </el-button>
      <el-button
        v-auth="`core_settleBillTaskRecordItem_edit`"
        v-if="row.paymentStatus === '40'"
        type="text"
        @click="asyncUpdate(row)">
        同步银行卡信息
      </el-button>
    </template>
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
    <Dialog
      vertical
      disabled
      v-model="accountShow"
      title="同步银行卡信息"
      submitButtonText="确认"
      :label-width="150"
      :forms="accountForms"
      :columns="20"
      :on-submit="onSubmit"
      width="500px"></Dialog>
  </TableView>
</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import {
  queryUnderTakerBankCard,
  updateUnderTakerBankCard
} from '/@/api/core/settleBillTaskRecordItem'
const down = (download) => {
  window.open(`${BASE}/${download}`)
}
const id = ref('')
const route: any = useRoute()
const accountShow = ref(false)
const accountForms = ref([] as Array)
const asyncUpdate = async (row) => {
  id.value = row.id
  const res = await queryUnderTakerBankCard({
    id: id.value
  })
  let text = res.data || ''
  accountForms.value = [
    {
      label: '',
      control: 'FetchTips',
      labelWidth: '0px',
      props: {
        customMessage: `确定要将该笔结算明细的收款银行卡信息更新为${text}吗？`,
        style: {
          'text-align': 'center',
          'font-size': '12px'
        }
      }
    }
  ]
  accountShow.value = true
}
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
const onSubmit = async (id) => {
  const params = {
    id: id.value
  }
  await updateUnderTakerBankCard(params)
  accountShow.value = true
}
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
