<template>
	<spInfo-form />
</template>

<script setup lang="ts" name="spEdit">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<style scoped lang="scss"></style>