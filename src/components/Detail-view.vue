<script setup lang="ts">
import { useRoute } from 'vue-router';

const props = defineProps({
	url: {
		type: String,
		default: '',
	},
	validate: {
		type: Boolean,
		default: false,
	},
});

const isNew = ref((() => !useRoute().params.id)());
</script>

<template></template>

<style scoped lang="scss"></style>
