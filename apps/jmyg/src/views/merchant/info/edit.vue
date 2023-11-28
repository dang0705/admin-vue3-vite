<template>
  <merchantInfo-form />
</template>

<script setup lang="ts">
const MerchantInfoForm = defineAsyncComponent(
  () => import('./components/form.vue')
)
</script>

<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
