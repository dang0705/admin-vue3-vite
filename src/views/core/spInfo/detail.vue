<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="服务商详情">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<style scoped lang="scss">
</style>