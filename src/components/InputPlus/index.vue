<template>
	<div v-if="disabled" class="textBox">
		<div class="text">{{ modelValue }}</div>
	</div>
	<el-input v-else v-model="value" />
</template>

<script setup lang="ts" name="divider">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});
const value = computed({
	get: () => props.modelValue,
	set: (value: string) => {
		emit('update:modelValue', value);
	},
});
</script>

<style scoped lang="scss">
.textBox {
	color: var(--el-text-color-regular);
	padding: 5px 0;
	.text {
		line-height: 22px;
	}
}
</style>
