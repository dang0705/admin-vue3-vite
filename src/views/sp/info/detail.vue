<template>
	<spInfo-form />
</template>

<script setup lang="ts">
const spInfoForm = defineAsyncComponent(() => import('./components/formView.vue'));
</script>

<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
