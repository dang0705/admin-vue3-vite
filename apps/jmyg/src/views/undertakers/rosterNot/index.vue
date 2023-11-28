<template>
  <div class="wrap">
    <Table-view
      :condition-forms="conditionForms"
      :columns="columns"
      :actions="actions"
      label-width="100"
      v-model="selectObjs"
      module="core/undertakerInfoNot">
      <template #top-bar>
        <el-button
          icon="folder-add"
          type="primary"
          :disabled="!selectObjs.length"
          @click="showDialog = true"
          v-auth="'hro_undertakerInfo_not_sp_add'">
          加入服务商
        </el-button>
      </template>
      <!-- 查看 -->
      <detail-dialog
        v-if="showDetailDialog"
        ref="detailDialogRef"
        @close="showDetailDialog = false" />
      <Dialog
        v-model="showDialog"
        v-model:form-data="dialogFormData"
        title="加入服务商"
        labelWidth="120"
        :forms="forms"
        :columns="24"
        :on-submit="DialogSubmit" />
    </Table-view>
  </div>
</template>

<script setup lang="ts">
import Array2Object from '@utils/array-2-object'
import conditionForms from '@jmyg/views/undertakers/rosterNot/configurations/condition-forms'
import getColumns from '@jmyg/views/undertakers/rosterNot/configurations/columns'
import { saveUndertakerSp } from '@jmyg/api/core/undertakerInfoNot'
const batchMap = Array2Object({ dic: ['gender', 'education'] })
const showDialog = ref(false)
const showDetailDialog = ref(false)
const selectObjs = ref([]) // 勾选的表格行
const detailDialogRef = ref()
const dialogFormData = ref({
  spId: ''
})
const columns = getColumns(batchMap)

const openDialog = (...arg: any[]) => {
  showDetailDialog.value = true
  nextTick(() => {
    setTimeout(() => {
      detailDialogRef.value?.openDialog(...arg)
    }, 200)
  })
}
// 引入组件
const DetailDialog = defineAsyncComponent(() => import('./detailDialog.vue'))

const actions = ({ id }: any) => [
  {
    label: '查看',
    auth: 'hro_undertakerInfo_not_sp_view',
    preview: true,
    action: {
      handler: openDialog,
      params: [id]
    }
  }
]

const forms = [
  {
    label: '服务商',
    control: 'el-select',
    key: 'spId',
    column: 20,
    options: {
      url: `core/spInfo/list`
    },
    props: {
      label: 'spName',
      value: 'id'
    }
  }
]

const DialogSubmit = async () => {
  await saveUndertakerSp(dialogFormData.value.spId, selectObjs.value)
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
