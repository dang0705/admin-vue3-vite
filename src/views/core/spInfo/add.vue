<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="添加服务商">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>
