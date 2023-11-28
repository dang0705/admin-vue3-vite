<template>
  <div class="textBox">
    <div class="text">{{ modelValue }}</div>
    <template v-for="(_, slot) in $slots">
      <slot :name="slot" />
    </template>
    <el-button @click="copyText(modelValue)" text type="primary">
      复制
    </el-button>
  </div>
</template>

<script setup lang="ts">
import commonFunction from '@utils/commonFunction'
defineOptions({ name: 'Input-copy' })
const { copyText } = commonFunction()
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
  display: flex;
  align-items: center;
  line-height: 22px;
  .text {
    line-height: 22px;
    word-break: break-all;
  }
}
</style>
