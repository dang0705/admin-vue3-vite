<template>
	<NewTable :columns="columns" isTab module="core/settleBillRecord.ts" :condition-forms="conditionForms" labelWidth="120px">
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
	</NewTable>
</template>

<script setup lang="ts" name="systemSettleBillRecord">
import { delObjs, getObj, addObj } from '/@/api/core/settleBillRecord';
import { useMessage, useMessageBox } from '/@/hooks/message';

const columns = [
	{
		prop: 'taskName',
		label: '任务名称',
		width: 150,
	},
	{
		prop: 'taskId',
		label: '任务编号',
		width: 150,
	},
	{
		prop: 'settleBillId',
		label: '账单id',
		width: 150,
	},
	{
		prop: 'settleBillName',
		label: '账单名称',
		width: 150,
	},
	{
		prop: 'id',
		label: '结算单编号',
		width: 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		width: 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		width: 150,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		width: 150,
	},
	// {
	// 	prop: 'bankAccountNumberRecipient',
	// 	label: '收款方银行账号',
	// 	width: 150,
	// },
	// {
	// 	prop: 'accountNameRecipient',
	// 	label: '收款方户名',
	// 	width: 150,
	// },
	{
		prop: 'serviceAmount',
		label: '结算金额(元)',
		width: 150,
	},
	{
		prop: 'payTime',
		label: '付款时间',
		width: 200,
	},
	{
		prop: 'statusDesc',
		label: '结算状态',
		width: 150,
	},
	// {
	// 	label: '操作',
	// 	prop: 'actions',
	// 	fixed: 'right',
	// 	slot: true,
	// },
];

const conditionForms = [
	{
		control: 'el-input',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'el-input',
		key: 'taskId',
		label: '任务编号',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'el-input',
		key: 'settleBillName',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'settleBillId',
		label: '账单编号',
	},
	{
		control: 'el-input',
		key: 'id',
		label: '结算单编号',
	},
	{
		control: 'DateRange',
		key: 'payTime',
		label: '付款时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'el-select',
		key: 'status',
		label: '结算状态',
	},
	{
		control: 'el-select',
		key: 'channelId',
		label: '支付通道',
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
</script>
