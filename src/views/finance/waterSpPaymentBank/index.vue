<template>
	<Table-view
		ref="TableViewRef"
		:columns="columns"
		label-width="110px"
		:exportAuth="tabType == 1 ? 'finance_merchantRecharge_export' : 'finance_merchantRefund_export'"
		:condition-forms="conditionForms"
		module="finance/waterSpPaymentBank.ts"
	>
		<template #actions="{ row: {} }"> </template>
		<template #status="{ row: { status } }">
			<span v-text="batchMap?.water_sp_payment_bank_status[status]" />
		</template>
		<template #tableTop>
			<Mytab style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></Mytab>
		</template>
		<template #top-bar="{ otherInfo }">
			<el-button
				v-auth="'finance_waterSpPaymentBank_import'"
				@click="batchAddTask"
				style="margin-right: 24px"
				icon="Upload"
				type="primary"
				class="ml10"
			>
				批量导入银行交易流水
			</el-button>
		</template>
		<uploadExcel
			@refreshDataList="refreshDataList"
			ref="addUnderTakerRef"
			guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
			upload-label="批量导入银行交易流水"
			upload-url="core/excel/importWaterSpPaymentBank"
			temp-url="/files/银行交易流水模版.xlsx"
			template-on-front
			title="批量导入银行交易流水"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		/>
	</Table-view>
</template>

<script setup lang="ts" name="银行流水">
import { delObjs, getObj, addObj } from '/@/api/finance/waterSpPaymentBank';
import Array2Object from '/@/utils/array-2-object';
import { payChannel } from '/@/configuration/dynamic-control';
const Mytab = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
const tabType = ref(1);
const TableViewRef = ref();
const addUnderTakerForms = [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: {
			platform: true,
		},
		rules: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	},
	payChannel({ key: 'channelId', rules: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }] }),
];
const addUnderTakerRef = ref();
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

const batchAddTask = (row: any) => {
	// params.value.taskId = row.id;
	addUnderTakerRef.value.openDialog(row);
};
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
const refreshDataList = () => {
	nextTick(() => {
		TableViewRef?.value.resetQuery();
	});
};
const toggleTab = (item: any) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		TableViewRef?.value.resetQuery();
	});
};
</script>
