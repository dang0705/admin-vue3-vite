<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="spSee">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<style scoped lang="scss">
</style>