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
				validator: (value: number) => value !== undefined,
				trigger: 'change',
			},
		],
		value: 1,
	},
	{
		control: 'el-radio-group',
		key: 'test',
		label: '是否',
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
				validator: (value: number) => value !== undefined,
				trigger: 'change',
			},
		],
		value: 1,
	},
	{
		control: 'el-input',
		label: '输入框',
		key: 'text',
		showBy: 'isInventoryUser',
		rules: [
			{
				required: true,
				trigger: 'blur',
			},
		],
		show: ({ isInventoryUser }) => isInventoryUser,
	},
	{
		control: 'el-select',
		label: '下拉',
		key: 'select',
		options: [
			{
				label: '选项一',
				value: 1,
			},
			{
				label: '选项一',
				value: 2,
			},
		],
		showBy: 'test',
		show: ({ test }) => test,
		rules: [
			{
				required: true,
				trigger: 'change',
			},
		],
	},
];
const formData = ref({});
</script>

<template>
	<Form-view :forms="forms" v-model="formData" />
</template>

<style scoped lang="scss"></style>
