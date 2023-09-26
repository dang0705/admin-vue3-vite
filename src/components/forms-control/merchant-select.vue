<script setup lang="ts" name="MerchantSelect">
import { getMerchantInfoList } from '/@/api/core/merchantInfo';
const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
});
const options = ref([]);
const emit = defineEmits('update:modelValue');
const getOptions = async () => {
	const { data } = await getMerchantInfoList();
	options.value = data;
};
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
	<el-select :placeholder="$t('merchantInfo.inputMerchantNameTip')" clearable v-model="value">
		<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in options" />
	</el-select>
</template>
