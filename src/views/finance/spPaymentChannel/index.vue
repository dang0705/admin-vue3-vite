<template>
  <Table-view
    ref="spPaymentChannelRef"
    :columns="columns"
    :condition-forms="conditionForms"
    module="core/spPaymentChannel">
    <template #top-bar="{ otherInfo }">
      <el-button
        icon="folder-add"
        type="primary"
        @click="formDialogRef.openDialog()"
        v-auth="'core_spPaymentChannel_add'">
        添加支付通道
      </el-button>
    </template>
    <template #actions="{ row }">
      <el-button
        v-auth="'core_spPaymentChannel_view'"
        icon="view"
        @click="formDialogRef.openDialog(row.id, true)"
        text
        type="primary">
        查看
      </el-button>
      <el-button
        icon="edit-pen"
        text
        type="primary"
        v-auth="'core_spPaymentChannel_edit'"
        @click="formDialogRef.openDialog(row.id)">
        编辑
      </el-button>
      <el-button
        icon="delete"
        text
        type="primary"
        v-auth="'core_spPaymentChannel_del'"
        @click="handleDelete([row.id])">
        删除
      </el-button>
    </template>
    <form-dialog ref="formDialogRef" @refresh="refreshDataList()" />
  </Table-view>
</template>

<script setup lang="ts">
import { delObjs } from '/@/api/core/spPaymentChannel'
import { useMessage, useMessageBox } from '/@/hooks/message'
const FormDialog = defineAsyncComponent(() => import('./form.vue'))
const formDialogRef = ref()
const spPaymentChannelRef = ref()
const columns = [
  {
    prop: 'channelName',
    label: '支付通道名称'
  },
  {
    prop: 'spName',
    label: '服务商'
  },
  {
    prop: 'mainAccount',
    label: '主账号',
    'min-width': 160
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  {
    prop: 'bankNameDesc',
    label: '账号类别',
    'min-width': 160
  },
  {
    prop: 'bankBranch',
    label: '开户行',
    'min-width': 160
  },
  // {
  //   prop: 'bankArea',
  //   label: '开户地',
  //   'min-width': 160
  // },
  {
    prop: 'channelStatusDesc',
    label: '状态'
  },
  {
    label: '操作',
    prop: 'actions',
    fixed: 'right',
    slot: true,
    'min-width': 150
  }
]
const conditionForms = [
  {
    control: 'SpSelect',
    key: 'spId',
    label: '服务商',
    props: { platform: true }
  }
]
const refreshDataList = () => {
  spPaymentChannelRef?.value.resetQuery()
}
// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除')
  } catch {
    return
  }
  try {
    await delObjs(ids)
    refreshDataList()
    useMessage().success('删除成功')
  } catch (err: any) {
    useMessage().error(err.msg)
  }
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
