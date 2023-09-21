<template>
	<el-divider>{{ title }}</el-divider>
</template>

<script setup lang="ts" name="divider">
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
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
