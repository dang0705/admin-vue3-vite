<template>
	<div>
		<TableView
			ref="TableViewRef"
			:columns="tabType == 1 ? columns1 : columns2"
			:module="tabType == 1 ? 'finance/merchantRecharge.ts' : 'finance/merchantRefund.ts'"
			:condition-forms="conditionForms"
			labelWidth="120px"
		>
			<template #tableTop>
				<Mytab style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></Mytab>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button @click="batchAddTask" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导入银行交易流水 </el-button>
				<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
			</template>
		</TableView>
		<uploadExcel
			@refreshDataList="refreshDataList"
			ref="addUnderTakerRef"
			guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
			upload-label="批量导入银行交易流水"
			upload-url="core/excel/importWaterSpPaymentBank"
			temp-url="/files/银行交易流水模版.xlsx"
			template-on-front
			:params="params"
			title="批量导入银行交易流水"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		>
			<template #spId="{ formData }">
				<el-form-item label="服务商" prop="spId" :rules="[{ required: true, message: '服务商不能为空', trigger: 'blur' }]">
					<el-select @change="getSpPaymentChannelListData(formData)" clearable v-model="formData.spId">
						<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in formInfo.spinfoList" />
					</el-select>
				</el-form-item>
			</template>
			<template #channelId="{ formData }">
				<el-form-item prop="channelId" label="支付通道" :rules="[{ required: true, message: '支付通道不能为空', trigger: 'blur' }]">
					<el-select placeholder="请选择" class="w100" clearable v-model="formData.channelId">
						<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in formInfo.spPaymentChannelList" />
					</el-select>
				</el-form-item>
			</template>
		</uploadExcel>
	</div>
</template>

<script setup lang="ts" name="结算单">
import { delObjs, getObj, addObj } from '/@/api/core/settleBillRecord';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getSpPaymentChannelList, getSpInfoList } from '/@/api/core/merchantInfo';
const Mytab = defineAsyncComponent(() => import('/@/components/FormTable/mytab.vue'));
const addUnderTakerRef = ref();
const params = ref({});
const tabType = ref(1);
const TableViewRef = ref();
const formInfo = reactive({
	spPaymentChannelList: [],
	spinfoList: [],
});
const addUnderTakerForms = [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		slot: true,
	},
	{
		control: 'el-select',
		key: 'channelId',
		label: '支付通道',
		slot: true,
	},
];
const columns1 = [
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
	},
];
const columns2 = [
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
];
const tabs = [
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
];
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
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const toggleTab = (item: object) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		TableViewRef?.value.resetQuery();
	});
};

const refreshDataList = () => {
	formInfo.spPaymentChannelList = [];
	nextTick(() => {
		TableViewRef?.value.resetQuery();
	});
};
const batchAddTask = (row: any) => {
	// params.value.taskId = row.id;
	addUnderTakerRef.value.openDialog(row);
};
const getSpPaymentChannelListData = (formData: any) => {
	getSpPaymentChannelList({
		spId: formData.spId,
	}).then((res: any) => {
		formInfo.spPaymentChannelList = res.data || [];
	});
};
getSpInfoList('').then((res: any) => {
	formInfo.spinfoList = res.data || [];
});
</script>
