<template>
	<div>
		<TableView :columns="tabType == 1 ? columns1 : columns2" module="core/settleBillRecord.ts" :condition-forms="conditionForms" labelWidth="120px">
			<template #tableTop>
				<Mytab style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></Mytab>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导入银行交易流水 </el-button>
				<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
			</template>
		</TableView>
	</div>
</template>

<script setup lang="ts" name="结算单">
import { delObjs, getObj, addObj } from '/@/api/core/settleBillRecord';
import { useMessage, useMessageBox } from '/@/hooks/message';
const Mytab = defineAsyncComponent(() => import('/@/components/FormTable/mytab.vue'));
const tabType = ref(1);
const columns1 = [
	{
		prop: 'spName',
		label: '服务商',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '支付通道',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '入账金额(元)',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '对方户名',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '对方银行账号',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '交易时间',
		minWidth: 200,
	},
	{
		prop: 'xxx',
		label: '状态',
		minWidth: 150,
	},
];
const columns2 = [
	{
		prop: 'spName',
		label: '服务商',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '支付通道',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '出账金额(元)',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '对方户名',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '对方银行账号',
		minWidth: 150,
	},
	{
		prop: 'xxx',
		label: '交易时间',
		minWidth: 200,
	},
];
const tabs = [
	{
		label: '入账',
		value: '',
		attributeVal: 1,
	},
	{
		label: '出账',
		value: '',
		attributeVal: 2,
	},
];
const conditionForms = [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'DateRange',
		key: 'payTime',
		label: '交易时间',
		props: {
			valueType: 'string',
		},
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const toggleTab = (item: object) => {
	tabType.value = item.attributeVal;
};
</script>
