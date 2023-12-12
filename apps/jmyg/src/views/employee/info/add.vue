<template>
  <!-- <div class="layout-padding cache overflow-auto">
    <div class="layout-padding-auto layout-padding-view"> -->
  <div class="h-fit absolute">
    <addForm />
  </div>
  <!-- </div>
  </div> -->
</template>

<script setup lang="ts">
const addForm = defineAsyncComponent(() => import('./components/form.vue'))
</script>
<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
