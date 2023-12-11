<template>
  <Table-view
    noPadding
    :columns="columns"
    :condition-forms="conditionForms"
    label-width="120px"
    ref="spAgreeRef"
    :staticQuery="staticQuery"
    module="core/merchantServiceAgreement">
    <template #statusDesc="{ row }">
      <Tag :type="getType(row.status)" :text="row.statusDesc"></Tag>
    </template>
    <template #top-bar>
      <el-button
        icon="folder-add"
        type="primary"
        @click="formDialogRef.openDialog()"
        v-auth="'core_merchantServiceAgreement_add'">
        新 增
      </el-button>
    </template>
    <template #actions="{ row }">
      <el-button
        v-auth="'core_merchantServiceAgreement_view'"
        icon="view"
        @click="formDialogRef.openDialog(row.id, 'view')"
        text
        type="primary">
        查看
      </el-button>
      <el-button
        icon="edit-pen"
        text
        type="primary"
        v-auth="'core_merchantServiceAgreement_edit'"
        @click="formDialogRef.openDialog(row.id)">
        编辑
      </el-button>
    </template>
    <form-dialog ref="formDialogRef" @refresh="refreshDataList" />
  </Table-view>
</template>

<script setup lang="ts">
import { useDict } from '@hooks/dict'
import conditionForms from './configurations/condition-forms'
import columns from './configurations/columns'
// import actions from './configurations/tabel-actions'
const FormDialog = defineAsyncComponent(
  () => import('../components/spAgree_form.vue')
)
const { agreement_status } = useDict('agreement_status')
const getType = (status: string) => {
  return agreement_status.value.find((item) => item.value === status).color
}
const route: any = useRoute()
const formDialogRef = ref()
const spAgreeRef = ref()
const staticQuery = {
  merchantId: route.query.id
}
const refreshDataList = () => {
  spAgreeRef.value.resetQuery()
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
