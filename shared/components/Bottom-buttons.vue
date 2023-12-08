<script setup lang="ts">
import { nextTick } from 'vue'

defineOptions({
  name: 'BottomButtons'
})
const height = '64px'
const props = defineProps({
  text: {
    type: String,
    default: '保存'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'relative'
  },
  to: {
    type: String,
    default: '.layout-backtop'
  }
})
const emits = defineEmits(['click'])
const debounceOptions = { params: 'click' }
const exist = ref(true)
const setWrapperPadding = async (size: string | number) => {
  await nextTick()
  document.querySelector(props.to).style.paddingBottom = size
}

onMounted(() => setWrapperPadding(height))
onActivated(() => {
  exist.value = true
  setWrapperPadding(height)
})
onDeactivated(() => {
  exist.value = false
  setWrapperPadding(0)
})
</script>

<template>
  <teleport :to="to">
    <div
      v-if="exist"
      id="bottom-button"
      class="left-0 bottom-0 w-full flex justify-center items-center z-[50]"
      :class="position"
      style="
        background: #ffffff;
        box-shadow:
          0 -9px 28px 8px #0000000d,
          0 -6px 16px 0 #00000014,
          0 -3px 6px -4px #0000001f;
      "
      :style="{ height }">
      <slot name="left" />
      <el-button
        type="primary"
        v-debounce:[debounceOptions]="emits"
        :disabled="disabled">
        {{ text }}
      </el-button>
      <slot name="right" />
    </div>
  </teleport>
</template>
