<template>
	<TableView
		ref="settleBillDetailRef"
		:columns="indexThead"
		module="core/settleBill.ts"
		getListFnName="taskRecordItem"
		:staticQuery="staticQuery"
		isTab
		:condition-forms="conditionForms"
		labelWidth="140px"
	>
		<template #tableTop="{ otherInfo }">
			<Form-view :otherInfo="otherInfo" class="mt-1" label-width="130px" disabled :showBtn="false" v-model="form" :forms="topInfoForms" />
			<div class="total_wrapper">
				<div class="total_list">
					<div class="total_item">
						<img src="/src/assets/images/total_1.png" class="icon" alt="" />
						<div class="info">
							<div class="price_box">
								<div class="price">{{ thousandthDivision({ number: form.billAmountTotal }) }}</div>
								<div class="unit">元</div>
							</div>
							<div class="info_label">结算总金额</div>
						</div>
					</div>
					<div class="total_item">
						<img src="/src/assets/images/total_3.png" class="icon" alt="" />
						<div class="info">
							<div class="price_box">
								<div class="price">{{ thousandthDivision({ number: form.taskAmountTotal }) }}</div>
								<div class="unit">元</div>
							</div>
							<div class="info_label">任务金额</div>
						</div>
					</div>
					<div class="total_item">
						<img src="/src/assets/images/total_6.png" class="icon" alt="" />
						<div class="info">
							<div class="price_box">
								<div class="price">{{ thousandthDivision({ number: form.managementAmountTotal }) }}</div>
								<div class="unit">元</div>
							</div>
							<div class="info_label">管理费</div>
						</div>
					</div>
					<div class="total_item">
						<img src="/src/assets/images/total_4.png" class="icon" alt="" />
						<div class="info">
							<div class="price_box">
								<div class="price">{{ form.serviceAmountTotal || '0.00' }}</div>
								<div class="unit">元</div>
							</div>
							<div class="info_label">服务费</div>
						</div>
					</div>
				</div>
			</div>
			<TableView
				noPagination
				style="margin-bottom: 28px"
				noPadding
				:tableData="form.serviceBillRecord"
				:columns="newIndexThead"
				module="core/settleBill.ts"
				:createdIsNeed="false"
				labelWidth="120px"
			>
				<template #actions="{ row }">
					<el-button @click="detailDialogRef.openDialog(form.id, 4, 1)" icon="view" text type="primary"> 查看收款账号 </el-button>
					<el-button @click="handleAccountCapitalDetail(1)" icon="view" text type="primary"> 查看资金账户 </el-button>
				</template>
				<template #top-bar="{ otherInfo }">
					<h2 style="font-size: 16px; margin-right: 20px">服务结算单</h2>
					<div class="info_list">
						<div class="info_item">资金账户可用余额: {{ balanceInfo.platBalance }}元</div>
						{{
							isNeedRecharge.service &&
							(form.status == 40 || form.status == 50) &&
							form.serviceBillRecord[0]?.status == 40 &&
							form.serviceBillRecord[0]?.serviceAmount - balanceInfo.platBalance > 0
								? `需要充值: ${form.serviceBillRecord[0]?.serviceAmount - balanceInfo.platBalance}元`
								: '无需充值'
						}}
					</div>
					<div class="flex items-center ml-auto">
						<el-button
							v-auth="'core_settleBill_s_recharge'"
							@click="detailDialogRef.openDialog(form.id, 3, 1)"
							style="margin-right: 24px; margin-left: auto !important"
							type="primary"
							class="ml10"
						>
							充值
						</el-button>
						<el-button
							v-auth="'core_settleBill_s_pay'"
							:disabled="
								!((form.status == 40 || form.status == 50) && form.serviceBillRecord[0]?.status == 40) ||
								form.serviceBillRecord[0]?.serviceAmount - balanceInfo.platBalance > 0
							"
							@click="handlePayBillRecord(form.serviceBillRecord, 1)"
							style="margin-right: 24px"
							type="primary"
							class="ml10"
						>
							付款
						</el-button>
					</div>
				</template>
			</TableView>
			<TableView
				noPagination
				style="margin-bottom: 28px"
				noPadding
				:tableData="form.taskBillRecord"
				:columns="newIndexThead"
				module="core/settleBill.ts"
				:createdIsNeed="false"
				labelWidth="120px"
			>
				<template #actions="{ row }">
					<el-button @click="detailDialogRef.openDialog(form.id, 4, 2)" icon="view" text type="primary"> 查看收款账号 </el-button>
					<el-button @click="handleAccountCapitalDetail(2)" icon="view" text type="primary"> 查看资金账户 </el-button>
				</template>
				<template #top-bar="{ otherInfo }">
					<h2 style="font-size: 16px; margin-right: 20px">任务结算单</h2>
					<div class="info_list">
						<div class="info_item">资金账户可用余额: {{ balanceInfo.spBalance }}元</div>
						<div class="info_item">
							{{
								isNeedRecharge.task &&
								(form.status == 40 || form.status == 50) &&
								form.taskBillRecord[0]?.status == 40 &&
								((payInFull && form.taskBillRecord[0]?.serviceAmount - balanceInfo.spBalance > 0) ||
									(!payInFull && form.taskBillRecord[0]?.taskAmount - balanceInfo.spBalance > 0))
									? `需要充值: ${form.taskBillRecord[0]?.serviceAmount - balanceInfo.spBalance}元`
									: '无需充值'
							}}
						</div>
					</div>
					<el-radio-group v-model="payInFull" class="ml-4">
						<el-radio :label="true" size="large">全额付款</el-radio>
						<el-radio :label="false" size="large">只付任务承揽费</el-radio>
					</el-radio-group>
					<div class="flex items-center ml-auto">
						<el-button
							v-auth="'core_settleBill_t_recharge'"
							@click="detailDialogRef.openDialog(form.id, 3, 2)"
							style="margin-right: 24px; margin-left: auto !important"
							type="primary"
							class="ml10"
						>
							充值
						</el-button>
						<el-button
							v-auth="'core_settleBill_t_pay'"
							:disabled="
								!((form.status == 40 || form.status == 50) && form.taskBillRecord[0]?.status == 40) ||
								(payInFull && form.taskBillRecord[0]?.serviceAmount - balanceInfo.spBalance > 0) ||
								(!payInFull && form.taskBillRecord[0]?.taskAmount - balanceInfo.spBalance > 0)
							"
							@click="handlePayBillRecord(form.taskBillRecord, 2)"
							style="margin-right: 24px"
							type="primary"
							class="ml10"
						>
							付款
						</el-button>
					</div>
				</template>
			</TableView>
		</template>
		<template #actions="{ row }">
			<el-button v-auth="'core_settleBill_agree'" @click="handleContractFile(row)" icon="view" text type="primary"> 查看关联协议 </el-button>
			<el-button v-auth="'core_settleBill_pay'" @click="handleBtn" icon="view" text type="primary"> 查看支付凭证 </el-button>
		</template>
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" v-auth="'core_settleBill_export'" style="margin-right: 24px" icon="download" type="primary" class="ml10">
				批量导出
			</el-button>
			<!-- <el-button @click="importBillRef.openDialog()" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 添加结算明细 </el-button> -->
		</template>
		<DetailDialog ref="detailDialogRef" @refresh="getmerchantInfoData()" :payInFull="payInFull" />
		<uploadExcel
			ref="importBillRef"
			@refreshDataList="refreshDataList"
			guidance="在导入结算单之前，请确认与结算单相关的任务承接已完成交付，然后请下载《任务承接明细表模版》，按照参考格式填写并在本页面上传"
			upload-label="导入结算"
			upload-url="core/settleBill/import"
			temp-url="/files/任务承接明细表.xlsx"
			template-on-front
			title="导入结算"
			label-width="178px"
			submitButtonText="下一步"
		/>
	</TableView>
</template>

<script setup lang="ts" name="账单详情">
import { getObj, addObj, putObj, payBillRecord } from '/src/api/core/settleBill';
import { queryPlatSpBalance } from '/src/api/finance/merchantAccountCapital';
import Array2Object from '/src/utils/array-2-object';
const batchMap = Array2Object({ dic: ['yes_no_type', 'settle_status', 'payment_status'] });
import thousandthDivision from '/src/utils/thousandth-division';
import { useMessage, useMessageBox } from '/src/hooks/message';
const DetailDialog = defineAsyncComponent(() => import('./components/detailDialog.vue'));
const route: any = useRoute();
const detailDialogRef = ref();
const importBillRef = ref();
const settleBillDetailRef = ref();
const { proxy } = getCurrentInstance();
interface BatchUploadRecordPage {
	isSignServiceContract: number;
	isBankFourEssentialFactor: number;
	billStatus: number;
	paymentStatus: number;
}
export interface BillRecordOptions {
	serviceAmount: number;
	accountId: string;
	status: string;
}
const payInFull = ref(true);

const isNeedRecharge = computed(() => {
	return {
		service: form.serviceBillRecord[0]?.serviceAmount > balanceInfo['platBalance'],
		task: form.taskBillRecord[0]?.serviceAmount > balanceInfo['platBalance'],
	};
});
const router = useRouter();
const loading = ref(false);
const form = reactive({
	serviceBillRecord: [
		{
			serviceAmount: 0,
			accountId: '',
			status: '',
		},
	],
	taskBillRecord: [
		{
			serviceAmount: 0,
			accountId: '',
			status: '',
		},
	],
	id: '',
	merchantId: '',
	spSubAccountNum: '',
	platSubAccountNum: '',
});
const balanceInfo = reactive({
	platBalance: 0,
	spBalance: 0,
});
const topInfoForms = [
	{
		control: 'InputPlus',
		key: 'billNumber',
		label: '账单编号',
	},
	{
		control: 'InputPlus',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'InputPlus',
		key: 'spName',
		label: '服务商',
	},
	{
		control: 'InputPlus',
		key: 'merchantName',
		label: '商户',
	},
	{
		control: 'InputPlus',
		key: 'taskNo',
		label: '任务编号',
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'InputPlus',
		key: 'taskUndertakerCount',
		label: '任务承接数量',
	},
	{
		control: 'InputPlus',
		key: 'paymentBankName',
		label: '支付通道',
	},
	{
		control: 'InputPlus',
		key: 'platformBankName',
		label: '平台支付通道',
	},
	{
		control: 'InputPlus',
		key: 'billCreateTime',
		label: '生成时间',
	},
	{
		control: 'InputPlus',
		key: 'feeCalculationMethodDesc',
		label: '管理费计算方式',
	},
	{
		control: 'InputPlus',
		key: 'createBillUser',
		label: '创建人',
	},
];
// 筛选表单
const conditionForms = [
	{
		control: 'InputPlus',
		key: 'id',
		label: '承接人',
	},
	{
		control: 'InputPlus',
		key: 'billName',
		label: '承接人证件号码',
	},
];
const indexThead = [
	{
		prop: 'undertakerName',
		label: '承接人',
		minWidth: 100,
	},
	{
		prop: 'undertakerCard',
		label: '承接人证件号码',
		minWidth: 150,
	},
	{
		prop: 'undertakerPhone',
		label: '承接人手机号码',
		minWidth: 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		minWidth: 100,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		minWidth: 100,
	},
	{
		prop: 'merchantName',
		label: '商户',
		minWidth: 100,
	},
	{
		prop: 'taskName',
		label: '任务名称',
		minWidth: 100,
	},
	{
		prop: 'taskUndertakerId',
		label: '任务承接编号',
		minWidth: 150,
	},
	{
		prop: 'taskNo',
		label: '任务编号',
		minWidth: 100,
	},
	{
		prop: 'undertakerBankName',
		label: '承接人开户行',
		minWidth: 150,
	},
	{
		prop: 'undertakerBankNumber',
		label: '承接人银行卡号',
		minWidth: 150,
	},
	{
		prop: 'taskAmount',
		label: '任务金额(元)',
		minWidth: 120,
	},
	{
		prop: 'taxWithheld',
		label: '代扣税款(元)',
		minWidth: 120,
	},
	{
		prop: 'paidAmount',
		label: '实发金额(元)',
		minWidth: 120,
	},
	{
		prop: 'commissionAmount',
		label: '管理费(元)',
		minWidth: 120,
	},
	{
		prop: 'undertaderStartTime',
		label: '承接开始时间',
		minWidth: 150,
	},
	{
		prop: 'undertaderEndTime',
		label: '承接结束时间',
		minWidth: 150,
	},
	{
		prop: 'id',
		label: '任务结算明细编号',
		minWidth: 150,
	},
	{
		prop: 'billSettleTime',
		label: '付款时间',
		minWidth: 150,
	},
	{
		prop: 'isSignServiceContract',
		label: '是否签署协议',
		value: ({ isSignServiceContract }: BatchUploadRecordPage) => batchMap.value.yes_no_type[isSignServiceContract],
		minWidth: 150,
	},
	{
		prop: 'isBankFourEssentialFactor',
		label: '是否银行四要素校验',
		value: ({ isBankFourEssentialFactor }: BatchUploadRecordPage) => batchMap.value.yes_no_type[isBankFourEssentialFactor],
		minWidth: 150,
	},
	{
		prop: 'billStatus',
		label: '结算状态',
		value: ({ billStatus }: BatchUploadRecordPage) => batchMap.value.settle_status[billStatus],
		minWidth: 100,
	},
	{
		prop: 'billSettleTime',
		label: '支付时间',
		minWidth: 100,
	},
	{
		prop: 'paymentStatus',
		label: '支付状态',
		value: ({ paymentStatus }: BatchUploadRecordPage) => batchMap.value.payment_status[paymentStatus],
		minWidth: 100,
	},
	{
		prop: 'failureReason',
		label: '支付失败原因',
		minWidth: 150,
	},
	// {
	// 	prop: 'failureReason',
	// 	label: '收款银行卡更新备注',
	// 	minWidth: 150,
	// },
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 300,
	},
];
const staticQuery = {
	settleBillId: route.query.id,
};
const newIndexThead = [
	{
		prop: 'settleBillName',
		label: '账单名称',
		minWidth: 100,
	},
	{
		prop: 'billNumber',
		label: '账单编号',
		minWidth: 100,
	},
	{
		prop: 'billRecordNum',
		label: '结算单编号',
		minWidth: 100,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		minWidth: 100,
	},
	{
		prop: 'bankAccountNumberRecipient',
		label: '收款方银行账号',
		minWidth: 100,
	},
	{
		prop: 'accountNameRecipient',
		label: '收款方户名',
		minWidth: 100,
	},
	{
		prop: 'serviceAmount',
		label: '结算金额(元)',
		minWidth: 120,
	},
	{
		prop: 'payTime',
		label: '付款时间',
		minWidth: 100,
	},
	{
		prop: 'statusDesc',
		label: '结算状态',
		minWidth: 100,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 300,
	},
];
const view = (row: any) => {
	console.log(1111, row);
	router.push({
		path: '/core/settleBill/detail',
		query: {
			id: row.id,
		},
	});
};
const handleAccountCapitalDetail = (type: number) => {
	router.push({
		path: '/finance/merchantAccountCapital/detail',
		query: {
			id: type == 1 ? form.serviceBillRecord[0]?.accountId : form.taskBillRecord[0]?.accountId,
		},
		state: {
			refresh: 1,
		},
	});
};
// 初始化表单数据
const getmerchantInfoData = () => {
	// 获取数据
	loading.value = true;
	getObj(route.query.id)
		.then((res: any) => {
			Object.assign(form, res.data);
			getQueryBalance();
		})
		.finally(() => {
			loading.value = false;
		});
};
const getQueryBalance = () => {
	queryPlatSpBalance({
		merchantId: form.merchantId,
		spSubAccountNum: form.spSubAccountNum,
		platSubAccountNum: form.platSubAccountNum,
	})
		.then((res: any) => {
			Object.assign(balanceInfo, res.data);
		})
		.finally(() => {});
};

if (route.query.id) {
	getmerchantInfoData();
}

const handlePayBillRecord = (list = [], billType: number) => {
	detailDialogRef.value?.openDialog(form.id, 1, billType);
};
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const handleContractFile = (row) => {
	console.log('proxy.baseURL', proxy.baseURL);
	window.open(`${proxy.baseURL}/${row.contractFile}`);
};

const refreshDataList = () => {
	getmerchantInfoData();
	settleBillDetailRef.value.resetQuery();
};
$refreshList(getmerchantInfoData);
</script>

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
.total_wrapper {
	padding: 28px 0;
	background: #fafafa;
	margin-bottom: 30px;
	.total_list {
		display: flex;
		.total_item {
			width: 25%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: rgba(0, 0, 0, 0.5);
		}
		.icon {
			width: 38px;
			height: 37px;
			margin-right: 15px;
		}
		.price_box {
			font-size: 30px;
		}
		.price {
			color: rgba(0, 0, 0, 0.8);
			display: inline-block;
		}
		.unit {
			font-size: 14px;
			vertical-align: baseline;
			display: inline-block;
		}
		.info_label {
			font-size: 14px;
		}
	}
}
</style>
