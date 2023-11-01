<template>
	<div>
		<TabView style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></TabView>
		<Table-view
			ref="waterSpPaymentBankRef"
			:columns="columns"
			label-width="110px"
			:exportAuth="tabType == 1 ? 'finance_merchantRecharge_export' : 'finance_merchantRefund_export'"
			:condition-forms="conditionForms"
			:staticQuery="staticQuery"
			module="finance/waterSpPaymentBank.ts"
		>
		</Table-view>
	</div>
</template>

<script setup lang="ts" name="银行流水">
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	status: string;
}
const staticQuery = {
	typeOfIncomingAndOutgoingAccounts: 10,
};
const batchMap = Array2Object({ dic: ['water_sp_payment_bank_status'] });
import { payChannel } from '/@/configuration/dynamic-control';
const tabType = ref(1);
const waterSpPaymentBankRef = ref();
const persistent = ref([
	{
		key: 'typeOfIncomingAndOutgoingAccounts',
		value: 10,
	},
]);
const typeOfIncomingAndOutgoingOptions = [
	{
		label: '入账',
		value: 10,
	},
	{
		label: '出账',
		value: 20,
	},
];
const addUnderTakerRef = ref();
const addUnderTakerForms = ref([
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: {
			platform: true,
		},
		rules: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	},
	payChannel({
		key: 'channelId',
		rules: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }],
	}),
]);
const tabs = ref([
	{
		label: '任务信息',
		value: '',
		attributeVal: 1,
	},
	{
		label: '承接列表',
		value: '',
		attributeVal: 2,
	},
]);
const columns = ref([
	//
	// 任务名称
	// 承接人
	// 证件号码
	// 承揽电子协议
	// 开始日期
	// 完成日期
	// 发放凭证
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
	{
		prop: 'xxx',
		label: 'xxx',
		'min-width': 150,
	},
]);
const conditionForms = ref([
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: {
			platform: true,
		},
	},
	{
		control: 'DateRange',
		key: 'dealTimeRange',
		label: '交易时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'el-select',
		key: 'typeOfIncomingAndOutgoingAccounts',
		label: '出入账状态',
		slot: true,
		options: [
			{
				label: '入账',
				value: 10,
			},
			{
				label: '出账',
				value: 20,
			},
		],
		value: 10,
		// props: {
		//   disabled: true
		// }
	},
]);
const refreshDataList = () => {
	nextTick(() => {
		waterSpPaymentBankRef?.value.resetQuery();
	});
};
const handleFilter = (form: any) => {
	console.log(123, form);
	if (!form.typeOfIncomingAndOutgoingAccounts) {
		form.typeOfIncomingAndOutgoingAccounts = 10;
	}
};
const toggleTab = (item: any) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		waterSpPaymentBankRef?.value.resetQuery();
	});
};
</script>
