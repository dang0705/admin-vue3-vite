<script setup lang="ts">
import { UploadExcel } from '/@/components';
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
	},
];
</script>

<template>
	<UploadExcel
		force-open
		guidance="请按照导入模版填写承接人信息，承接人必须在18岁到70岁范围内。"
		upload-label="待签署用户名单"
		upload-url="core/undertakerInfo/import"
		temp-url="/files/合同批量签署模板.xlsx"
		template-on-front
		title="批量导入承接人"
		:forms="forms"
	/>
</template>

<style scoped lang="scss"></style>
