<template>
  <el-cascader
    ref="chinaArea"
    :options="optionsData"
    :props="cascaderProps"
    v-model="selectedOptions"
    @change="handleChange" />
</template>
<script setup lang="ts">
import {
  provinceAndCityData,
  provinceAndCityDataPlus,
  regionData,
  regionDataPlus
} from '@utils/chinaArea'
defineOptions({ name: 'China-area' })
const emit = defineEmits(['update:modelValue', 'change'])
const optionsData = ref()
const chinaArea = ref()
const props = defineProps({
  // 当前的值
  modelValue: String,
  // 类型 (二级联动，三级联动)
  type: {
    type: Number,
    default: 3
  },
  plus: {
    type: Boolean,
    default: false
  }
})
const cascaderProps = {
  expandTrigger: 'hover' as const
}
const getCheckedNodes = (bool: boolean) => {
  return chinaArea.value.getCheckedNodes(bool)
}
const selectedOptions = computed({
  get: () => {
    return props.modelValue?.split(',')
  },
  set: (val) => {
    emit('update:modelValue', val?.join(','))
  }
})

const handleChange = (value: String[]) => {
  emit('change', value.join(','))
}

onMounted(() => {
  const { plus, type } = props
  if (plus) {
    optionsData.value = type === 2 ? provinceAndCityDataPlus : regionDataPlus
  } else {
    optionsData.value = type === 2 ? provinceAndCityData : regionData
  }
})
// 暴露变量
defineExpose({
  getCheckedNodes
})
</script>
