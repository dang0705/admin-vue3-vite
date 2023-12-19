<script setup lang="ts">
const formData = ref({})
const nestingData = ref({})
const forms = [
  {
    key: 'a.b.c',
    label: '嵌套'
  },
  {
    key: 'c',
    label: '不嵌套'
  }
]
</script>

<template>
  <FormView
    v-model="formData"
    v-model:nesting-data="nestingData"
    :forms="forms"
    nestingKey />
</template>
