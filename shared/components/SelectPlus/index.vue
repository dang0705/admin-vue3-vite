<template>
  <div v-if="disabled" class="textBox">
    <div class="text">{{ modelValue }}</div>
  </div>
  <el-input v-else v-bind="$props" v-model="value">
    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </el-input>
</template>

<script setup lang="ts">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const value = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped lang="scss">
.textBox {
  color: var(--el-text-color-regular);
  padding: 5px 0;
  .text {
    line-height: 22px;
    word-break: break-all;
  }
}
</style>
