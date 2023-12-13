<template>
  <iframe
    style="min-height: calc(100vh - 100px)"
    src="http://localhost:8888/#/bpm/task/my/index"
    frameborder="0"></iframe>
</template>

<script setup lang="ts">
const path = computed(() => {
  console.log('env.VITE_ADMIN_PROXY_PATH', env.VITE_ADMIN_PROXY_PATH)
  return env.VITE_ADMIN_PROXY_PATH
})
</script>

<style scoped></style>
