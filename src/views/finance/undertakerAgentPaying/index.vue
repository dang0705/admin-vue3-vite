<template>
	<Table-view
		:columns="columns"
		:condition-forms="conditionForms"
		module="finance/undertakerAgentPaying.ts"
		label-width="150"
		is-tab
		down-blob-file-url="/finance/undertakerAgentPaying/export"
		down-blob-file-name="任务支付流水.xlsx"
	>
		<template #payStatus="{ row: { payStatus } }">
			{{ playStatusMapping['undertaker_agent_paying_pay_status'][payStatus] }}
		</template>
		<template #actions="{ row: {} }"></template>
	</Table-view>
</template>

<script setup lang="ts" name="任务支付流水">
// import { delObjs, getObj, addObj } from '/@/api/finance/undertakerAgentPaying';
import { payChannel } from '/@/configuration/dynamic-control';
import Array2Object from '/@/utils/array-2-object';
const playStatusMapping = Array2Object({ dic: ['undertaker_agent_paying_pay_status'] });
const columns = [
	{
		type: 'selection',
		key: 'selection',
		width: '40',
		fixed: 'left',
	},
	{
		prop: 'undertakerName',
		label: '承接人',
		'min-width': 150,
	},
	{
		prop: 'undertakerCard',
		label: '承接人证件号码',
		'min-width': 200,
	},
	{
		prop: 'undertakerBankName',
		label: '付款开户行',
		'min-width': 150,
	},
	{
		prop: 'sendBankName',
		label: '付款开户行',
		'min-width': 150,
	},
	{
		prop: 'undertakerBankNumber',
		label: '承接人银行卡号',
		'min-width': 200,
	},
	{
		prop: 'spName',
		label: '服务商名称',
		'min-width': 150,
	},
	{
		prop: 'paymentBankIdDesc',
		label: '支付通道',
		'min-width': 150,
	},
	{
		prop: 'sendBankName',
		label: '付款开户行',
		'min-width': 150,
	},
	{
		prop: 'sendAccountNumber',
		label: '付款账号',
		'min-width': 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'billName',
		label: '账单名称',
		'min-width': 150,
	},
	{
		prop: 'billId',
		label: '账单编号',
		'min-width': 200,
	},
	{
		prop: 'paySourceId',
		label: '任务结算明细编号',
		'min-width': 200,
	},

	{
		prop: 'taskUndertakerId',
		label: '任务承接编号',
		'min-width': 200,
	},
	{
		prop: 'taskAmount',
		label: '任务金额(元)',
		'min-width': 150,
	},
	{
		prop: 'taxWithheld',
		label: '代扣税款(元)',
		'min-width': 150,
	},
	{
		prop: 'paidAmount',
		label: '实发金额(元)',
		'min-width': 150,
	},

	{
		prop: 'paymentInitiationTime',
		label: '结算时间',
		'min-width': 180,
	},
	{
		prop: 'paymentSuccessTime',
		label: '支付时间',
		'min-width': 180,
	},
	{
		prop: 'payStatus',
		label: '支付状态',
		slot: true,
		'min-width': 150,
	},
	{
		prop: 'payCause',
		label: '支付失败原因',
		'min-width': 150,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
	},
];

const conditionForms = [
	{
		label: '承接人',
		control: 'el-input',
		key: 'undertakerName',
	},
	{
		label: '承接人证件号码',
		control: 'el-input',
		key: 'undertakerCard',
	},
	{
		label: '服务商',
		control: 'SpSelect',
		key: 'spId',
	},
	{
		label: '商户',
		control: 'MerchantSelect',
		key: 'merchantId',
	},
	{
		label: '账单名称',
		control: 'el-input',
		key: 'billName',
	},
	{
		label: '账单编号',
		control: 'el-input',
		key: 'billId',
	},
	{
		label: '任务结算明细编号',
		control: 'el-input',
		key: 'paySourceId',
	},
	{
		label: '结算时间',
		control: 'DateRange',
		key: 'paymentInitiationTime',
		props: {
			valueType: 'string',
		},
	},
	{
		label: '支付时间',
		control: 'DateRange',
		key: 'paymentSuccessTime',
	},
	payChannel(),
];
</script>
