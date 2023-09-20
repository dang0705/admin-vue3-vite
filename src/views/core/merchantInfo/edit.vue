<template>
	<merchantInfo-form />
</template>

<script setup lang="ts">
const merchantInfoForm = defineAsyncComponent(() => import('./components/form.vue'));
</script>

<style scoped lang="scss"></style>
