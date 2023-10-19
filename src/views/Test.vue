<script setup lang="ts">
import { NextLoading } from '/@/utils/loading';
NextLoading.done();
const forms = [
	{
		control: 'el-radio-group',
		key: 'isInventoryUser',
		label: '是否存量用户',
		options: [
			{
				label: '是',
				value: 1,
			},
			{
				label: '否',
				value: 0,
			},
		],
		rules: [
			{
				required: true,
				// validator: (value: number) => value !== undefined,
			},
		],
		value: 1,
		onChange: (val, formData) => {
			console.log(val, formData);
		},
	},
	{
		control: 'el-input',
		key: 'text',
		label: '文本框',
		showBy: 'isInventoryUser',
		show: ({ isInventoryUser }) => isInventoryUser,
	},
];
const formData = reactive({});
</script>

<template>
	<Form-view :forms="forms" v-model="formData" />
</template>

<style scoped lang="scss"></style>
