<template>
  <addSalary-form />
</template>

<script setup lang="ts">
const addSalaryForm = defineAsyncComponent(
  () => import('../components/forms.vue')
)
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
