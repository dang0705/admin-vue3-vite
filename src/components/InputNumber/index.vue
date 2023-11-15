<template>
  <div v-if="disabled" class="textBox">
    <div class="text">{{ modelValue || '--' }}</div>
    <div v-if="$slots && $slots.length > 0">
      <template v-for="(_, slot) in $slots">
        <slot :name="slot" />
      </template>
    </div>
    <div v-if="modelValue && unit">
      {{ unit }}
    </div>
  </div>
  <div v-else class="flex w-[100%]">
    <el-input-number
      class="flex-1"
      :max="max"
      :controls="controls"
      v-bind="$props"
      v-model="value"></el-input-number>
    <div class="com_group__append group__append" v-if="unit">
      {{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Input-plus' })
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  unit: {
    type: String,
    default: ''
  },
  controls: {
    type: Boolean,
    default: false
  },
  max: {
    type: [String, Number],
    default: 1000000000
  },
  min: {
    type: [String, Number],
    default: 0
  }
})
const value = computed({
  get: () => props.modelValue as string,
  set: (value: string) => {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="scss">
.textBox {
  color: var(--el-text-color-regular);
  padding: 5px 0;
  display: flex;
  align-items: center;
  line-height: 22px;
  .text {
    line-height: 22px;
    word-break: break-all;
  }
}
.com_group__append {
  background-color: var(--el-fill-color-light);
  color: var(--el-color-info);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  border-radius: var(--el-input-border-radius);
  padding: 0 20px;
  white-space: nowrap;
  min-width: 54px;
}
.group__append {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow:
    0 1px 0 0 var(--el-border-color) inset,
    0 -1px 0 0 var(--el-border-color) inset,
    -1px 0 0 0 var(--el-border-color) inset;
}
</style>
