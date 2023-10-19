<script setup lang="ts">
import { NextLoading } from '/@/utils/loading';
NextLoading.done();
const forms = [
	{
		control: 'el-radio-group',
		title: {
			html: '标题一定要大',
			style: {
				textAlign: 'center',
			},
		},
		key: 'radio1',
		label: '单选一',
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
		key: 'radio2',
		label: '单选二',
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
		label: '单选一对应的动态控件',
		key: 'text',
		rules: [
			{
				required: true,
				trigger: 'blur',
			},
		],
		show: { by: 'radio1', fn: ({ radio1 }) => radio1 },
	},
	{
		control: 'el-select',
		label: '单选二对应的动态控件',
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
		show: {
			by: 'radio2',
			fn: ({ radio2 }) => radio2,
		},
		rules: [
			{
				required: true,
				trigger: 'change',
			},
		],
	},
];
const formData = ref({});
const valid = ref(false);
</script>

<template>
	<Form-view vertical :forms="forms" v-model="formData" :columns="24" label-width="200" debug @get-validation="valid = $event" />
	<div>表单校验是否通过：{{ valid ? '是' : '否' }}</div>
</template>

<style scoped lang="scss"></style>
