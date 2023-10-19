<template>
	<div class="layout-padding cache overflow-auto">
		<div class="layout-padding-view">
			<merchantInfo-form />
		</div>
	</div>
</template>

<script setup lang="ts" name="添加商户">
const merchantInfoForm = defineAsyncComponent(() => import('./components/form.vue'));
</script>
