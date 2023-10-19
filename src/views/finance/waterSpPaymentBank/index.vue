<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/waterSpPaymentBank.ts">
		<template #actions="{ row: {} }"> </template>
	</Table-view>
</template>

<script setup lang="ts" name="systemWaterSpPaymentBank">
import { delObjs, getObj, addObj } from '/@/api/finance/waterSpPaymentBank';

const columns = [
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		'min-width': 150,
	},
	// {
	// 	prop: 'id',
	// 	label: '银行流水号',
	// 	'min-width': 150,
	// },

	// {
	// 	prop: 'loanType',
	// 	label: '借贷类型',
	// 	'min-width': 150,
	// },
	{
		prop: 'amount',
		label: '入账金额(元)',
		'min-width': 150,
	},
	{
		prop: 'reciprocalAccountName',
		label: '对方户名',
		'min-width': 150,
	},
	{
		prop: 'reciprocalAccountNumber',
		label: '对方银行账号',
		'min-width': 150,
	},
	{
		prop: 'dealTime',
		label: '交易时间',
		'min-width': 150,
	},
	// {
	// 	prop: 'reciprocalBank',
	// 	label: '对方开户行',
	// 	'min-width': 150,
	// },
	// {
	// 	prop: 'dealPostscript',
	// 	label: '附言',
	// 	'min-width': 150,
	// },
	{
		prop: 'status',
		label: '状态',
		'min-width': 150,
	},
	// {
	// 	label: '操作',
	// 	prop: 'actions',
	// 	fixed: 'right',
	// 	slot: true,
	// },
];

const conditionForms = [];
</script>
