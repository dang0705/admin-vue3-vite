<template>
  <merchantInfo-form />
</template>

<script setup lang="ts">
defineOptions({ name: '添加商户' })
const MerchantInfoForm = defineAsyncComponent(
  () => import('./components/form.vue')
)
</script>
