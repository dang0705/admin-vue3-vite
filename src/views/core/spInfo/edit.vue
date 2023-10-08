<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="编辑服务商">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<style scoped lang="scss"></style>
