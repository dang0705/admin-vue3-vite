<template>
  <div v-if="disabled" class="textBox">
    <div class="text">{{ modelValue }}</div>
    <div v-if="$slots && $slots.length > 0">
      <template v-for="(_, slot) in $slots">
        <slot :name="slot" />
      </template>
    </div>
    <div v-if="modelValue && unit">
      {{ unit }}
    </div>
  </div>

  <el-input
    v-else
    v-bind="$props"
    v-model="value"
    :maxlength="myLength"
    :showWordLimit="showWordLimit">
    <template v-if="append" #append>{{ append }}</template>
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </el-input>
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
  append: {
    type: String,
    default: ''
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [String, Number],
    default: 0
  },
  type: {
    type: String,
    default: 'text'
  }
})
const myLength = computed(() => {
  if (props.maxlength !== 0) {
    return props.maxlength
  } else {
    if (props.type === 'textarea') {
      return 500
    } else {
      return 100
    }
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
</style>
