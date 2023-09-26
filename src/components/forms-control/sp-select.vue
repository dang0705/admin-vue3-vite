<script setup lang="ts" name="SpSelect">
import { getSpInfoList } from '/@/api/core/merchantInfo';
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
const getOptions = async () => {
	const { data } = await getSpInfoList(props.platform ? 'platform' : '');
	options.value = data;
};
getOptions();

const value = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modeValue', value);
	},
});
</script>

<template>
	<el-select :placeholder="$t('merchantInfo.inputSpListTip')" clearable v-model="value">
		<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in options" />
	</el-select>
</template>

<style scoped lang="scss"></style>
