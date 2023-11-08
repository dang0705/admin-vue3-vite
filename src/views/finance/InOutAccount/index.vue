<template>
	<div>
		<TableView
			ref="InOutAccountRef"
			:columns="tabType == 1 ? columns1 : columns2"
			:module="tabType == 1 ? 'finance/merchantRecharge.ts' : 'finance/merchantRefund.ts'"
			:condition-forms="conditionForms"
			labelWidth="120px"
			:downBlobFileUrl="tabType == 1 ? '/finance/merchantRecharge/export' : '/finance/merchantRefund/export'"
			:downBlobFileName="tabType == 1 ? '入账.xlsx' : '出账.xlsx'"
			:exportAuth="tabType == 1 ? 'finance_merchantRecharge_export' : 'finance_merchantRefund_export'"
		>
			<template #tableTop>
				<TabView style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></TabView>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button
					v-auth="'finance_waterSpPaymentBank_import'"
					@click="inOutAccountAddFormsRef.openDialog()"
					style="margin-right: 24px"
					icon="Upload"
					type="primary"
				>
					批量导入银行交易流水
				</el-button>
			</template>
		</TableView>
		<uploadExcel
			@refreshDataList="refreshDataList"
			ref="inOutAccountAddFormsRef"
			guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
			upload-label="批量导入银行交易流水"
			upload-url="core/excel/importWaterSpPaymentBank"
			temp-url="/files/银行交易流水模版.xlsx"
			template-on-front
			title="批量导入银行交易流水"
			:forms="inOutAccountAddForms"
			submitButtonText="下一步"
		/>
	</div>
</template>

<script setup lang="ts">
const TabView = defineAsyncComponent(() => import('/src/components/Table-view/Tab-view.vue'));
import { payChannel } from '/@/configuration/dynamic-control';
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	status: string;
}
const batchMap = Array2Object({ dic: ['merchant_recharge_status'] });
const inOutAccountAddFormsRef = ref();
const tabType = ref(1);
const InOutAccountRef = ref();
const inOutAccountAddForms = [
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
const columns1 = ref([
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
	{
		prop: 'amount',
		label: '入账金额(元)',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountName',
		label: '对方户名',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountNumber',
		label: '对方银行账号',
		minWidth: 150,
	},
	{
		prop: 'dealTime',
		label: '交易时间',
		minWidth: 200,
	},
	{
		prop: 'status',
		label: '状态',
		minWidth: 150,
		value: ({ status }: BatchUploadRecordPage) => batchMap.value.merchant_recharge_status[status],
	},
]);
const columns2 = ref([
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
	{
		prop: 'amount',
		label: '出账金额(元)',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountName',
		label: '对方户名',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountNumber',
		label: '对方银行账号',
		minWidth: 150,
	},
	{
		prop: 'dealTime',
		label: '交易时间',
		minWidth: 200,
	},
]);
const tabs = ref([
	{
		label: '入账',
		value: '',
		attributeVal: 1,
	},
	{
		label: '出账',
		value: '',
		attributeVal: 2,
	},
]);
const conditionForms = [
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
];
const toggleTab = (item: object) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		InOutAccountRef?.value.resetQuery();
	});
};
const refreshDataList = () => {
	nextTick(() => {
		InOutAccountRef?.value.resetQuery();
	});
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
