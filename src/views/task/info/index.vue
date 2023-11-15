<template>
  <TableView
    isTab
    :columns="columns"
    module="core/task.ts"
    :condition-forms="conditionForms"
    :actions="computedActions"
    labelWidth="120px">
    <template #top-bar="{ otherInfo }">
      <el-button
        icon="folder-add"
        type="primary"
        class="ml10"
        @click="openTask('add')"
        v-auth="'core_task_add'">
        新 增
      </el-button>
    </template>
    <template #TaskType="{ formData }">
      <el-form-item label="任务类型：">
        <TaskType
          v-model:taskTypeFirst="formData.taskTypeFirst"
          v-model:taskTypeSecond="formData.taskTypeSecond" />
      </el-form-item>
    </template>
    <Appoint
      ref="appointRef"
      list-url="/core/undertakerTask/getAssignUndertaker"
      save-url="/core/undertakerTask/determineAssignUndertaker" />
    <uploadExcel
      ref="addUnderTakerRef"
      guidance="请先确保待指派的承接人已录入系统且已签署任务的承接服务商，然后按照导入模版填写承接人信息。"
      upload-label="待签署用户名单"
      upload-url="core/undertakerTask/batchAppointUndertaker"
      temp-url="/files/批量导入承接人模板.xlsx"
      template-on-front
      :params="params"
      title="批量指派承接人" />
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
