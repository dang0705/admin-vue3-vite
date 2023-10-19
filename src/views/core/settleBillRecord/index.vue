<template>
	<TableView :columns="columns" isTab module="core/settleBillRecord.ts" :condition-forms="conditionForms" labelWidth="120px">
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
	</TableView>
</template>

<script setup lang="ts" name="结算单">
import { delObjs, getObj, addObj } from '/@/api/core/settleBillRecord';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { payChannel } from '/@/configuration/dynamic-control';

const columns = [
	{
		prop: 'taskName',
		label: '任务名称',
		minWidth: 150,
	},
	{
		prop: 'taskId',
		label: '任务编号',
		minWidth: 150,
	},
	{
		prop: 'settleBillId',
		label: '账单id',
		minWidth: 150,
	},
	{
		prop: 'settleBillName',
		label: '账单名称',
		minWidth: 150,
	},
	{
		prop: 'id',
		label: '结算单编号',
		minWidth: 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		minWidth: 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		minWidth: 150,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		minWidth: 150,
	},
	// {
	// 	prop: 'bankAccountNumberRecipient',
	// 	label: '收款方银行账号',
	// 	minWidth: 150,
	// },
	// {
	// 	prop: 'accountNameRecipient',
	// 	label: '收款方户名',
	// 	minWidth: 150,
	// },
	{
		prop: 'serviceAmount',
		label: '结算金额(元)',
		minWidth: 150,
	},
	{
		prop: 'payTime',
		label: '付款时间',
		minWidth: 200,
	},
	{
		prop: 'statusDesc',
		label: '结算状态',
		minWidth: 150,
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
		key: 'payTimeFromTo',
		label: '付款时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'el-select',
		key: 'status',
		label: '结算状态',
		options: 'invoice_status', // 伪代码
	},
	payChannel({ key: 'paymentBankId' }),
	// {
	// 	control: 'el-select',
	// 	key: 'paymentBankId',
	// 	label: '支付通道',
	// },
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
</script>
