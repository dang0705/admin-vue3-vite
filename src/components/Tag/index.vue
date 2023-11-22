<template>
  <div class="tag_box" :style="{ 'background': colorObj?.bgc }">
    <div class="tag_text" :style="{ 'color': colorObj?.color }">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Tag' })
const props = defineProps({
  type: {
    type: [String, Number],
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})
const colorArrs = [
  {
    label: '颜色一',
    value: '1',
    bgc: 'rgba(238, 238, 238, 1)',
    color: 'rgba(0,0,0, 0.4)'
  },
  {
    label: '颜色二',
    value: '2',
    bgc: 'rgba(82, 196, 27, 0.1)',
    color: 'rgba(82, 196, 27, 1)'
  },
  {
    label: '颜色三',
    value: '3',
    bgc: 'rgba(24, 144, 255, 0.1)',
    color: 'rgba(24, 144, 255, 1)'
  },
  {
    label: '颜色四',
    value: '4',
    bgc: 'rgba(255, 83, 84, 0.1)',
    color: 'rgba(255, 83, 84, 1)'
  },
  {
    label: '颜色五',
    value: '5',
    bgc: 'rgba(251, 173, 20, 0.1)',
    color: 'rgba(251, 173, 20, 1)'
  }
]
const colorObj = computed(() => {
  let obj = colorArrs.find((item) => item.value === props.type)
  return obj
})
</script>

<style scoped lang="scss">
.tag_box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  width: fit-content;
  border-radius: 2px;
  .tag_text {
    font-size: 12px;
    font-weight: bold;
  }
}
</style>
