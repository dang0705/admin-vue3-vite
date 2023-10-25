<script setup lang="ts">
import { NextLoading } from '/@/utils/loading';
NextLoading.done();
const formsPagination = [
	[
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
			value: 0,
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
				by: 'radio1',
				fn: ({ radio1 }) => radio1,
			},
			rules: [
				{
					required: true,
					trigger: 'change',
				},
			],
		},
	],
	[
		{
			control: 'el-radio-group',
			key: 'radio2',
			label: '第二页单选一',
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
			key: 'page2Text',
			label: '文本框',
			show: {
				by: 'radio2',
				fn: ({ radio2 }) => radio2,
			},
		},
	],
];
const forms = [
	[
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
			value: 0,
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
				by: 'radio1',
				fn: ({ radio1 }) => radio1,
			},
			rules: [
				{
					required: true,
					trigger: 'change',
				},
			],
		},
	],
];
const formData = ref({});
const valid = ref(false);
const page = ref(0);
</script>

<template>
	<Form-view
		vertical
		step-dir="vertical"
		:forms="formsPagination"
		:step-space="200"
		v-model="formData"
		:columns="24"
		label-width="200"
		debug
		@get-validation="valid = $event"
		@get-page="page = $event"
	/>
	<div>表单校验是否通过：{{ valid ? '是' : '否' }}</div>
</template>

<style scoped lang="scss"></style>
