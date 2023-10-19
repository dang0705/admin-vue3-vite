<template>
	<Table-view ref="TableViewRef" :columns="columns" label-width="110px" :condition-forms="conditionForms" module="finance/waterSpPaymentBank.ts">
		<template #actions="{ row: {} }"> </template>
		<template #status="{ row: { status } }">
			<span v-text="batchMap?.water_sp_payment_bank_status[status]" />
		</template>
		<template #tableTop>
			<Mytab style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></Mytab>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="银行流水">
import { delObjs, getObj, addObj } from '/@/api/finance/waterSpPaymentBank';
import Array2Object from '/@/utils/array-2-object';
const Mytab = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
const tabType = ref(1);
const TableViewRef = ref();
const tabs = [
	{
		label: '手动维护',
		value: '',
		attributeVal: 1,
	},
	{
		label: '银企直联',
		value: '',
		attributeVal: 2,
	},
];
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
	// {
	// 	control: 'el-select',
	// 	key: 'xxx',
	// 	label: '出入账状态',
	// },
];
const toggleTab = (item: any) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		TableViewRef?.value.resetQuery();
	});
};
</script>
