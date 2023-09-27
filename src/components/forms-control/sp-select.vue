<script setup lang="ts" name="SpSelect">
import { useSpStore } from '/@/stores/sp';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	// 控制是否显示平台服务商
	platform: {
		type: Boolean,
		default: false,
	},
});
const options = ref([]);
const emit = defineEmits('update:modelValue');
const getOptions = async () => (options.value = await useSpStore().getSp(props.platform ? 'platform' : ''));

getOptions();

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
	<el-select clearable v-model="value">
		<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in options" />
	</el-select>
</template>
