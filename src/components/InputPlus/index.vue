<template>
	<div v-if="disabled"></div>
	<el-input v-else v-model="form.contactPhone" />
</template>

<script setup lang="ts" name="divider">
const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	// modelValue: {
	// 	type: Object,
	// 	default: () => ({}),
	// 	required: true,
	// },
});
</script>

<style scoped lang="scss">
.el-divider--horizontal {
	margin: 24px 0 30px;
	:deep(.el-divider__text) {
		font-family: PingFangSC-Medium;
		font-weight: 600;
		font-size: 16px;
		color: #000000;
	}
}
</style>
