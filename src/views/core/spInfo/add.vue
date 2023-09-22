<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="spAdd">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<style scoped lang="scss"></style>