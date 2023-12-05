<template>
  <div>
    <TableView
    ref="tableViewRef"
    :columns="newColumns"
    :condition-forms="forms"
    :actions="actions"
    :staticQuery="staticQuery"
    exportAuth="core_settleBillTaskRecordItem_export"

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
      <span
        v-auth="`core_settleBill_agree`"
        :class="['cursor-pointer', 'mr-[12px]']"
        v-if="row.contractFile"
        style="color: rgba(0, 0, 0, 0.65); font-size: var(--el-font-size-base)"
        @click.passive="down(row.contractFile)">
        <i class="iconfont icon_chakan !text-default"></i>
        <span class="ml-1 hover:underline">查看关联协议</span>
      </span>
      <!-- <slot> -->
        <span
        v-auth="`core_settleBillTaskRecordItem_edit`"
        v-if="row.paymentStatus === '40'"
        :class="['cursor-pointer']"
        style="color: #ff5a00; font-size: var(--el-font-size-base)"
        @click.passive="asyncUpdate(row)">
        <i class="iconfont icon_tongbu !text-default"></i>
        <span class="ml-1 hover:underline">同步银行卡信息</span>
      </span>
      <!-- </slot> -->

    </template>
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>

  </TableView>
  <Dialog
      vertical
      disabled
      v-model="accountShow"
      title="同步银行卡信息"
      submitButtonText="确认"
      :label-width="150"
      :forms="accountForms"
      :columns="24"
      :on-submit="onSubmit"
      width="500px"></Dialog>
  </div>

</template>

<script setup lang="ts">
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
import { previewFile } from '@utils/other'
import {
  queryUnderTakerBankCard,
  updateUnderTakerBankCard
} from '@jmyg/api/core/settleBillTaskRecordItem'
const down = (download: string) => {
  previewFile({
    url: download
  })
}
const tableViewRef = ref()
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
  console.log('accountShow.value', accountShow.value);

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
const onSubmit = async () => {
  const params = {
    id: id.value
  }
  await updateUnderTakerBankCard(params)
  accountShow.value = false
  tableViewRef?.value.resetQuery()
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
