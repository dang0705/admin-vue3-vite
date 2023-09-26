<script setup lang="ts" name="YesOrNo">
import { useDict } from '/@/hooks/dict';
const { yes_no_type } = useDict('yes_no_type');

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
});
const emit = defineEmits('update:modelValue');

const value = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});
</script>

<template>
	<el-select :placeholder="placeholder" clearable v-model="value">
		<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in yes_no_type" />
	</el-select>
</template>
