<script setup lang="ts">
defineOptions({ name: 'FetchTips' })
const props = defineProps({
  texts: {
    type: Array,
    default: () => []
  },
  handler: {
    type: Function,
    default: () => {}
  },
  params: {
    type: Object,
    default: () => {}
  },
  customStyle: {
    type: Object,
    default: () => {
      return {
        'text-align': 'center',
        'font-size': '12px'
      }
    }
  },
  // 自定义的message
  customMessage: {
    type: String,
    default: ''
  }
})
const message = ref('')
const fetchRequest = async () => {
  const res = await props.handler(props.params)
  let text = res.data || ''
  message.value = props.texts[0] + text + props.texts[1]
}
watch(
  () => props.handler,
  () => {
    fetchRequest()
  }
)
</script>

<template>
  <div class="w-[100%]">
    <div class="w-[100%]" :style="customStyle">
      {{ customMessage || message }}
    </div>
  </div>
</template>
