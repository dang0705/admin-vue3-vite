<template>
  <TableView
    :columns="columns"
    module="core/task"
    :condition-forms="conditionForms"
    :actions="computedActions"
    labelWidth="120px">
    <!-- <template #top-bar="{ otherInfo }">
      <el-button
        icon="folder-add"
        type="primary"
        class="ml10"
        @click="openTask('add')"
        v-auth="'core_task_add'">
        新 增
      </el-button>
    </template> -->
    <template #TaskType="{ formData }">
      <el-form-item label="任务类型：">
        <TaskType
          v-model:taskTypeFirst="formData.taskTypeFirst"
          v-model:taskTypeSecond="formData.taskTypeSecond" />
      </el-form-item>
    </template>
    <Appoint
      ref="appointRef"
      dialogWidth="1000px"
      list-url="/core/undertakerTask/getAssignUndertaker"
      save-url="/core/undertakerTask/determineAssignUndertaker" />
    <Upload-excel
      ref="addUnderTakerRef"
      upload-label="待签署用户名单"
      upload-url="core/undertakerTask/batchAppointUndertaker"
      guidance="请先确保待指派的承接人已录入系统且已签署任务的承接服务商，然后按照导入模版填写承接人信息。"
      template-on-front
      no-divider
      noBorder="none"
      bgColor="#F3F3F3"
      hoverBg="#fff7f3"
      temp-url="/files/BATCH_ASSIGN_TAKEOVER_TEMPLATE.xlsx"
      download-name="批量指派承接人模板"
      :params="params"
      title="批量指派承接人">
      <template #excel-body>
        <img
          class="w-[48px] h-[48px] mx-auto"
          src="../../../assets/uploadImg/file.webp" />
      </template>
    </Upload-excel>
  </TableView>
</template>

<script setup lang="ts">
const TaskType = defineAsyncComponent(() => import('./components/TaskType.vue'))
const Appoint = defineAsyncComponent(() => import('./components/appoint.vue'))

const router = useRouter()
import columns from './configurations/columns'
import conditionForms from './configurations/condition-forms'
import actions from './configurations/actions'

const appointRef = ref()
const addUnderTakerRef = ref()
const params = ref({
  // taskId: '',
})
const computedActions = computed(() => {
  return actions({
    appointRef,
    addUnderTakerRef,
    callback: (row: any) => {
      params.value.taskId = row.id
    }
  })
})
// 新增/编辑/详情
const openTask = (type: string, id: number) => {
  switch (type) {
    case 'add':
      router.push({
        path: '/task/info/add',
        state: {
          refresh: 1
        }
      })
      break
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
