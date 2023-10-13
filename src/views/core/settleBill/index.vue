<template>
	<div>
		<NewTable ref="NewTableRef" :columns="indexThead" module="core/settleBill.ts" isTab :condition-forms="conditionForms" labelWidth="120px">
			<template #actions="{ row }">
				<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="view(row)"> 查看 </el-button>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button
					style="margin-right: 24px"
					icon="Upload"
					type="primary"
					class="ml10"
					@click="importBillRef.openDialog(), (formInfo.taskList = []), (formInfo.spPaymentChannelList = [])"
				>
					导入结算
				</el-button>
				<div class="info_list">
					<div class="info_item" v-for="(item, index) in otherInfo.sumResp" :key="index">{{ item.label }}:{{ item.value }}元</div>
				</div>
			</template>
		</NewTable>
		<!-- 导入结算-->
		<uploadExcel
			ref="importBillRef"
			@refreshDataList="refreshDataList"
			guidance="在批量结算之前，请确认所有任务承接已完成交付，然后请下载《任务承接明细表模版》，按照参考格式填写并在本页面上传"
			upload-label="导入结算"
			upload-url="core/settleBill/import"
			temp-url="/files/任务承接明细表.xlsx"
			template-on-front
			title="导入结算"
			label-width="178px"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		>
			<template #merchantId="{ formData }">
				<el-form-item label="结算商户" prop="merchantId" :rules="[{ required: true, message: '结算商户不能为空', trigger: 'blur' }]">
					<el-select @change="getTaskList(formData)" clearable v-model="formData.merchantId">
						<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in formInfo.merchantList" />
					</el-select>
				</el-form-item>
			</template>
			<template #spId="{ formData }">
				<el-form-item label="服务商" prop="spId" :rules="[{ required: true, message: '服务商不能为空', trigger: 'blur' }]">
					<el-select @change="getTaskList(formData), getSpPaymentChannelListData(formData)" clearable v-model="formData.spId">
						<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in formInfo.spinfoList" />
					</el-select>
				</el-form-item>
			</template>
			<template #taskId="{ formData }">
				<el-form-item prop="taskId" label="结算任务" :rules="[{ required: true, message: '结算任务不能为空', trigger: 'blur' }]">
					<el-select placeholder="请选择" class="w100" clearable v-model="formData.taskId">
						<el-option :key="item.id" :label="item.taskName" :value="item.id" v-for="item in formInfo.taskList" />
					</el-select>
				</el-form-item>
			</template>
			<template #paymentBankId="{ formData }">
				<el-form-item prop="paymentBankId" label="支付通道" :rules="[{ required: true, message: '支付通道不能为空', trigger: 'blur' }]">
					<el-select placeholder="请选择" class="w100" clearable v-model="formData.paymentBankId">
						<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in formInfo.spPaymentChannelList" />
					</el-select>
				</el-form-item>
			</template>
			<template #platformBankId="{ formData }">
				<el-form-item prop="platformBankId" label="平台支付通道" :rules="[{ required: true, message: '平台支付通道不能为空', trigger: 'blur' }]">
					<el-select placeholder="请选择" class="w100" clearable v-model="formData.platformBankId">
						<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in formInfo.spPaymentChannelList" />
					</el-select>
				</el-form-item>
			</template>
		</uploadExcel>
	</div>
</template>

<script setup lang="ts" name="导入批次">
import { fetchList } from '/@/api/core/task';
import { getSpPaymentChannelList } from '/@/api/core/merchantInfo';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';

const ImportBill = defineAsyncComponent(() => import('./components/importBill.vue'));
const router = useRouter();
const importBillRef = ref();
const NewTableRef = ref();
const formInfo = reactive({
	taskList: [],
	spPaymentChannelList: [],
	merchantList: [],
	spinfoList: [],
});
const addUnderTakerForms = [
	{
		control: 'el-input',
		key: 'billName',
		label: '账单名称',
		rules: [
			{
				required: true,
				message: '账单名称不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '结算商户',
		slot: true,
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		slot: true,
	},
	{
		control: 'el-select',
		key: 'taskId',
		label: '结算任务',
		slot: true,
	},
	{
		control: 'el-select',
		key: 'paymentBankId',
		label: '支付通道',
		slot: true,
	},
	{
		control: 'el-select',
		key: 'platformBankId',
		label: '平台支付通道',
		slot: true,
	},
	{
		control: 'el-radio-group',
		key: 'isSendMsg',
		label: '是否发送结算成功短信',
		options: [
			{
				label: '是',
				value: 1,
			},
			{
				label: '否',
				value: 0,
			},
		],
		rules: [
			{
				required: true,
			},
		],
		value: 1,
	},
];
// 筛选表单
const conditionForms = [
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'el-input',
		key: 'id',
		label: '账单编号',
	},
	{
		control: 'el-input',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'taskNum',
		label: '任务编号',
		// options: formInfo.taskList,
	},
	{
		control: 'el-input',
		key: 'channelId',
		label: '支付通道',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '创建人',
	},
	{
		control: 'DateRange',
		key: 'billCreateTimeFromTo',
		label: '账单生成时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'DateRange',
		key: 'billSettleTimeFromTo',
		label: '账单发放时间',
		props: {
			valueType: 'string',
		},
	},
];
// 表头
const indexThead = [
	{
		prop: 'merchantName',
		label: '商户',
		width: 100,
	},
	{
		prop: 'spName',
		label: '服务商',
		width: 100,
	},
	{
		prop: 'id',
		label: '账单编号',
		width: 100,
	},
	{
		prop: 'billName',
		label: '账单名称',
		width: 100,
	},

	{
		prop: 'taskId',
		label: '任务编号',
		width: 160,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		width: 100,
	},
	{
		prop: 'taskAmountTotal',
		label: '任务金额(元)',
		width: 150,
	},
	{
		prop: 'serviceAmountTotal',
		label: '服务费(元)',
		width: 150,
	},
	{
		prop: 'xxx',
		label: '结算总金额(元)',
		width: 150,
	},
	{
		prop: 'taskUndertakerCount',
		label: '任务承接数量',
		width: 150,
	},
	{
		prop: 'createBillUser',
		label: '账单创建人',
		width: 200,
	},
	{
		prop: 'billCreateTime',
		label: '账单生成时间',
		width: 200,
	},
	{
		prop: 'billSettleTime',
		label: '账单发放时间',
		width: 200,
	},
	{
		prop: 'statusDesc',
		label: '状态',
		width: 200,
	},
	{
		prop: 'auditPostscript',
		label: '驳回原因',
		width: 200,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
	},
];
const view = (row: any) => {
	router.push({
		path: '/core/settleBill/detail',
		query: {
			id: row.id,
		},
	});
};
// 初始化表单数据
const getTaskList = (formData: any) => {
	fetchList({
		spId: formData.spId,
		merchantId: formData.merchantId,
	})
		.then((res: any) => {
			formInfo.taskList = res.data.list.records || [];
		})
		.finally(() => {});
};

const getSpPaymentChannelListData = (formData: any) => {
	getSpPaymentChannelList({
		spId: formData.spId,
	}).then((res: any) => {
		formInfo.spPaymentChannelList = res.data || [];
	});
};
const refreshDataList = () => {
	formInfo.taskList = [];
	formInfo.spPaymentChannelList = [];
	NewTableRef?.value.resetQuery();
};
// 获取数据
getMerchantInfoList().then((res: any) => {
	formInfo.merchantList = res.data || [];
	console.log('formInfo.merchantList', formInfo.merchantList);
});
getSpInfoList('').then((res: any) => {
	formInfo.spinfoList = res.data || [];
});
</script>

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
</style>
