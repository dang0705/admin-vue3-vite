<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/waterSpPaymentBank.ts">
		<template #actions="{ row: {} }"> </template>
		<template #status="{ row: { status } }">
			<span v-text="batchMap?.water_sp_payment_bank_status[status]" />
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="银行流水">
import { delObjs, getObj, addObj } from '/@/api/finance/waterSpPaymentBank';
import Array2Object from '/@/utils/array-2-object';

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
	{
		prop: 'status',
		label: '状态',
		'min-width': 150,
		slot: true,
	},
];

const batchMap = computed(() => Array2Object({ dic: ['water_sp_payment_bank_status'] }).value);
const conditionForms = [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'DateRange',
		key: 'dealTimeRange',
		label: '交易时间',
		props: {
			valueType: 'string',
		},
	},
];
</script>
