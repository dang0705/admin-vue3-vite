<template>
  <div class="layout-padding w-100 overflow-auto form-view">
    <div
      class="layout-padding-auto layout-padding-view"
      style="background-color: transparent">
      <spInfo-form />
    </div>
  </div>
</template>

<script setup lang="ts">
const spInfoForm = defineAsyncComponent(
  () => import('./components/formView.vue')
)
</script>

<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
