<template>
  <Info />
</template>

<script setup lang="ts">
import Info from './components/Info.vue'
</script>

<script lang="ts">
export default {
  created() {
    this.$options.name = this.$route.meta.title
  }
}
</script>
