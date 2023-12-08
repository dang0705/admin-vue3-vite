<template>
  <Formula />
</template>
<script setup lang="ts">
import Formula from '@jmyg/views/merchant/salaryPlan/components/Formula.vue'
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
