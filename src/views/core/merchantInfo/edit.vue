<template>
	<div class="layout-padding cache overflow-auto">
		<merchantInfo-form />
	</div>
</template>

<script setup lang="ts" name="merchantEdit">
const merchantInfoForm = defineAsyncComponent(() => import('./components/form.vue'));
</script>

<style scoped lang="scss"></style>
