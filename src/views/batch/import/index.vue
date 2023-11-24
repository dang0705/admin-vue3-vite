<template>
  <TableView
    :columns="columns"
    :actions="actions"
    :condition-forms="conditionForms"
    module="core/batchUploadRecord">
    <Dialog
      v-model="show"
      disabled
      vertical
      :save="false"
      :title="`【 ${currentTitle} 】 导入详情`"
      :label-width="dialogFormLabelWidth"
      :forms="forms"
      :columns="24"
      v-model:form-data="dialogFormData">
      <template #status>
        <el-form-item label="状态明细：">
          <ul class="flex">
            <li class="mr20">
              成功
              <span v-text="dialogFormData.success" class="text-success" />
              条
            </li>
            <li v-if="hasFail">
              失败
              <span v-text="dialogFormData.fail" class="text-error" />
              条
            </li>
          </ul>
        </el-form-item>
      </template>
      <template #after-forms v-if="hasFail">
        <TableView
          no-padding
          :columns="failListColumns"
          :params="failParams"
          export-auth="core_batchUploadRecord_export"
          down-blob-file-url="/core/batchFailDetails/export"
          module="core/batchUploadRecord"
          get-list-fn-name="getFailList" />
      </template>
    </Dialog>
  </TableView>
</template>

<script setup lang="ts">
import { getObj } from '/@/api/core/batchUploadRecord'
import { State } from '/@/views/batch/import/configurations/enums'
import columns from '/@/views/batch/import/configurations/columns'
import conditionForms from '/@/views/batch/import/configurations/condition-forms'
import dynamicForms from '/@/views/batch/import/configurations/dynamic-forms'

const dialogFormLabelWidth = ref(160)
const failListColumns = ref<any[]>([])
const actions = ({ id, batchType, batchState }: any) => [
  {
    label: '查看',
    auth: 'core_batchUploadRecord_view',
    preview: true,
    action: {
      handler: view,
      params: {
        id,
        type: batchType,
        state: batchState
      }
    }
  }
]

let currentId = '' // 主键
const currentType = ref('') // 批次类型
const currentState = ref('') // 批次状态
const currentTitle = ref('')
const show = ref(false)
let dialogFormData = ref({})

const hasFail = computed(
  () =>
    currentState.value !== State['进行中'] &&
    currentState.value !== State['全部成功']
)
const forms = dynamicForms({
  dialogFormLabelWidth,
  currentType,
  currentTitle,
  failListColumns,
  hasFail
})
let failParams = {}
const view = async ({ id, type, state }: any) => {
  failParams = {}
  show.value = true
  currentId = id
  currentType.value = type
  currentState.value = state
  dialogFormData.value = (await getObj(id)).data
  failParams = { batchId: currentId }
}
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
