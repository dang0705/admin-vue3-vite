<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/invoiceRecord.ts" is-tab>
		<template #actions> </template>
	</Table-view>
</template>

<script setup lang="ts" name="发票记录">
import { delObjs, getObj, addObj } from '/@/api/finance/invoiceRecord';

const columns = [
	{
		prop: 'id',
		label: '申请编号',
		'min-width': 150,
	},
	{
		prop: 'settleBillRecordId',
		label: '结算单编号',
		'min-width': 150,
	},
	{
		prop: 'createTime',
		label: '申请时间',
		'min-width': 150,
	},
	{
		prop: 'invoicingAmount',
		label: '开票金额',
		'min-width': 150,
	},
	{
		prop: 'billingType',
		label: '发票类型',
		'min-width': 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'status',
		label: '发票状态',
		'min-width': 150,
	},
	{
		prop: 'reason',
		label: '原因',
		'min-width': 150,
	},

	{
		prop: 'invoicingCategories',
		label: '开票类目',
		'min-width': 150,
	},
	{
		prop: 'postOrderNumber',
		label: '快递单号',
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
		label: '申请编号',
		control: 'el-input',
		key: 'settleBillRecordId',
	},
	{
		label: '发票类型',
		control: 'el-select',
		key: 'billingType',
	},
	{
		label: '申请时间',
		control: 'DateRange',
		key: '',
	},
	{
		label: '商户',
		control: 'MerchantSelect',
		key: 'merchantName',
	},
	{
		label: '服务商',
		control: 'SpSelect',
		key: '',
	},
	{
		label: '发票状态',
		control: 'el-select',
		key: 'status',
	},
];
</script>
