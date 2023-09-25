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
	},
];
</script>

<template>
	<UploadExcel
		force-open
		upload-label="待签署用户名单"
		:forms="forms"
		temp-url="/files/合同批量签署模板.xlsx"
		template-on-front
		title="添加合同签署"
	/>
</template>

<style scoped lang="scss"></style>
