<script setup lang="ts">
import dateRangeDefaultProps from '@configurations/date-range-default-props'
import helpers from '@utils/helpers'
defineOptions({ name: 'Date-range' })
const props = defineProps({
  startP: {
    type: String,
    default: '开始'
  },
  endP: {
    type: String,
    default: '结束'
  },
  valueType: {
    type: String,
    default: 'array'
  },
  modelValue: {
    type: [String, Array],
    default: ''
  },
  datePickerProps: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue'])
const isArrayValue = computed(() => helpers.isArray(props.modelValue))
const value = computed({
  get() {
    return isArrayValue.value
      ? props.modelValue
      : (props.modelValue as string)?.split(',')
  },
  set(value: any) {
    emit(
      'update:modelValue',
      props.valueType === 'array' ? value : value?.join(',')
    )
  }
})
</script>

<template>
  <el-date-picker
    v-bind="{ ...dateRangeDefaultProps({ startP, endP }), ...props }"
    v-model="value" />
</template>
