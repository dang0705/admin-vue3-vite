<template>
	<Table-view
		ref="waterSpPaymentBankRef"
		:columns="columns"
		label-width="110px"
		:exportAuth="tabType == 1 ? 'finance_merchantRecharge_export' : 'finance_merchantRefund_export'"
		:condition-forms="conditionForms"
		:persistent="persistent"
		module="finance/waterSpPaymentBank.ts"
	>
		<template #tableTop>
			<TabView style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></TabView>
		</template>
		<template #typeOfIncomingAndOutgoingAccounts="{ formData }">
			<el-form-item label="出入账状态:" prop="typeOfIncomingAndOutgoingAccounts">
				<el-select @change="handleFilter(formData)" v-model="formData.typeOfIncomingAndOutgoingAccounts" placeholder="请选择" class="w100">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in typeOfIncomingAndOutgoingOptions" />
				</el-select>
			</el-form-item>
		</template>
		<template #top-bar="{ otherInfo }">
			<el-button v-auth="'finance_waterSpPaymentBank_import'" @click="addUnderTakerRef.openDialog()" icon="Upload" type="primary">
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
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	status: string;
}
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
		label: '手动维护',
		value: '',
		attributeVal: 1,
	},
	{
		label: '银企直联',
		value: '',
		attributeVal: 2,
	},
]);
const columns = ref([
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
		value: ({ status }: BatchUploadRecordPage) => batchMap.value.water_sp_payment_bank_status[status],
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
		// :="true"

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
