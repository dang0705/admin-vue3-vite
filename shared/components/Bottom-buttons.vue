<script setup lang="ts">
defineOptions({
  name: 'BottomButtons'
})
defineProps({
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
  }
})
const emits = defineEmits(['click'])
const debounceOptions = { params: 'click' }
const exist = ref(true)

onActivated(() => (exist.value = true))
onDeactivated(() => (exist.value = false))
</script>

<template>
  <teleport to=".layout-main-scroll">
    <div
      v-if="exist"
      class="left-0 bottom-0 w-full flex justify-center items-center z-[50]"
      :class="position"
      style="
        height: 64px;
        background: #ffffff;
        box-shadow:
          0 -9px 28px 8px #0000000d,
          0 -6px 16px 0 #00000014,
          0 -3px 6px -4px #0000001f;
      ">
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
