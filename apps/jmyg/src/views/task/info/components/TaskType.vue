<template>
  <div class="flex items-center">
    <el-select
      :disabled="disabled"
      placeholder="一级分类"
      class="w100"
      v-model="taskTypeFirstValue">
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in task_typeLevel_option.task_typeLevel1_option" />
    </el-select>
    <el-select
      :disabled="disabled"
      style="margin-left: 10px"
      placeholder="二级分类"
      class="w100"
      v-model="taskTypeSecondValue">
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in task_typeLevel_option.task_typeLevel2_option" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TaskType' })
import { useDict } from '@hooks/dict'
const { task_type } = useDict('task_type')
const props = defineProps({
  taskTypeFirst: {
    type: String,
    default: ''
  },
  taskTypeSecond: {
    type: String,
    default: ''
  },
  // 控制是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:taskTypeFirst', 'update:taskTypeSecond'])

const task_typeLevel_option = computed(() => {
  let task_typeLevel_option = {
    task_typeLevel1_option: [],
    task_typeLevel2_option: []
  }
  emit('update:taskTypeSecond', '')
  task_type.value.forEach((item: any) => {
    if (!item.parentValue) {
      task_typeLevel_option.task_typeLevel1_option.push(item as never)
    }
    if (props.taskTypeFirst == item.parentValue && props.taskTypeFirst) {
      task_typeLevel_option.task_typeLevel2_option.push(item as never)
    }
  })
  return task_typeLevel_option
})

const taskTypeFirstValue = computed({
  get: () => {
    return props.taskTypeFirst
  },
  set: (val) => {
    if (!val) {
      emit('update:taskTypeSecond', '')
    }
    emit('update:taskTypeFirst', val)
  }
})

const taskTypeSecondValue = computed({
  get: () => {
    return props.taskTypeSecond
  },
  set: (val) => {
    emit('update:taskTypeSecond', val)
  }
})
</script>
