<template>
	<div class="layout-padding cache overflow-auto">
		<div class="layout-padding-auto layout-padding-view">
			<task-form />
		</div>
	</div>
</template>

<script setup lang="ts" name="克隆任务">
const taskForm = defineAsyncComponent(() => import('./components/form.vue'));
</script>

<style scoped lang="scss"></style>
