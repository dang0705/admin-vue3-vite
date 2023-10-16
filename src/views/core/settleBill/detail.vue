<template>
	<div>
		<NewTable
			:columns="indexThead"
			module="core/settleBill.ts"
			getListFnName="taskRecordItem"
			:queryForm="queryForm"
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
									<div class="price">{{ form.billAmountTotal || '0.00' }}</div>
									<div class="unit">元</div>
								</div>
								<div class="info_label">结算总金额</div>
							</div>
						</div>
						<div class="total_item">
							<img src="/src/assets/images/total_3.png" class="icon" alt="" />
							<div class="info">
								<div class="price_box">
									<div class="price">{{ form.taskAmountTotal || '0.00' }}</div>
									<div class="unit">元</div>
								</div>
								<div class="info_label">任务金额</div>
							</div>
						</div>
						<div class="total_item">
							<img src="/src/assets/images/total_6.png" class="icon" alt="" />
							<div class="info">
								<div class="price_box">
									<div class="price">{{ form.managementAmountTotal || '0.00' }}</div>
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
				<NewTable
					noPagination
					style="margin-bottom: 28px"
					ref="NewTableRef"
					noPadding
					:tableData="form.serviceBillRecord"
					:columns="newIndexThead"
					module="core/settleBill.ts"
					:createdIsNeed="false"
					labelWidth="120px"
				>
					<template #actions="{ row }">
						<el-button @click="handleBtn" icon="view" text type="primary"> 查看收款账号 </el-button>
						<el-button @click="handleBtn" icon="view" text type="primary"> 查看资金账户 </el-button>
					</template>
					<template #top-bar="{ otherInfo }">
						<h2 style="font-size: 16px; margin-right: 20px">服务结算单</h2>
						<div class="info_list">
							<div class="info_item">资金账户可用余额: {{ form.serviceAmountTotal }}元</div>
							<div class="info_item">{{ form.serviceAmountTotal > 0 ? `需要充值: XXX元` : '无需充值' }}</div>
						</div>
						<el-button
							@click="detailDialogRef.openDialog(form.id, 3)"
							style="margin-right: 24px; margin-left: auto !important"
							type="primary"
							class="ml10"
						>
							充值
						</el-button>
						<el-button
							:disabled="!((form.status == 40 || form.status == 50) && form.serviceBillRecord[0].status == 40)"
							@click="handlePayBillRecord(form.serviceBillRecord, 1)"
							style="margin-right: 24px"
							type="primary"
							class="ml10"
						>
							付款
						</el-button>
					</template>
				</NewTable>
				<NewTable
					noPagination
					style="margin-bottom: 28px"
					ref="NewTableRef"
					noPadding
					:tableData="form.taskBillRecord"
					:columns="newIndexThead"
					module="core/settleBill.ts"
					:createdIsNeed="false"
					labelWidth="120px"
				>
					<template #actions="{ row }">
						<el-button @click="handleBtn" icon="view" text type="primary"> 查看收款账号 </el-button>
						<el-button @click="handleBtn" icon="view" text type="primary"> 查看资金账户 </el-button>
					</template>
					<template #top-bar="{ otherInfo }">
						<h2 style="font-size: 16px; margin-right: 20px">任务结算单</h2>
						<div class="info_list">
							<div class="info_item">资金账户可用余额: {{ form.taskAmountTotal }}元</div>
							<div class="info_item">{{ form.taskAmountTotal > 0 ? `需要充值: XXX元` : '无需充值' }}</div>
						</div>
						<el-button
							@click="detailDialogRef.openDialog(form.id, 3)"
							style="margin-right: 24px; margin-left: auto !important"
							type="primary"
							class="ml10"
						>
							充值
						</el-button>
						<el-button
							:disabled="!((form.status == 40 || form.status == 50) && form.taskBillRecord[0].status == 40)"
							@click="handlePayBillRecord(form.taskBillRecord, 2)"
							style="margin-right: 24px"
							type="primary"
							class="ml10"
						>
							付款
						</el-button>
					</template>
				</NewTable>
			</template>
			<template #actions="{ row }">
				<el-button @click="handleBtn" icon="view" text type="primary"> 查看关联协议 </el-button>
				<el-button @click="handleBtn" icon="view" text type="primary"> 查看支付凭证 </el-button>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
				<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 添加结算明细 </el-button>
			</template>
		</NewTable>
		<DetailDialog ref="detailDialogRef" @refresh="getmerchantInfoData()" />
	</div>
</template>

<script setup lang="ts" name="账单详情">
import { getObj, addObj, putObj, payBillRecord } from '/@/api/core/settleBill';
import { useMessage, useMessageBox } from '/@/hooks/message';
const DetailDialog = defineAsyncComponent(() => import('./components/detailDialog.vue'));

const route: any = useRoute();
const detailDialogRef = ref();

// 定义变量内容
const router = useRouter();
const loading = ref(false);
// 提交表单数据
const form = reactive({
	serviceBillRecord: [],
	taskBillRecord: [],
	id: '',
});

const topInfoForms = [
	{
		control: 'MerchantSelect',
		key: 'id',
		label: '账单编号',
	},
	{
		control: 'SpSelect',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'spName',
		label: '服务商',
	},
	{
		control: 'el-input',
		key: 'merchantName',
		label: '商户',
	},
	{
		control: 'el-input',
		key: 'taskId',
		label: '任务编号',
	},
	{
		control: 'el-input',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'el-input',
		key: 'taskUndertakerCount',
		label: '任务承接数量',
	},
	{
		control: 'el-input',
		key: 'paymentBankName',
		label: '支付通道',
	},
	{
		control: 'el-input',
		key: 'platformBankName',
		label: '平台支付通道',
	},
	{
		control: 'el-input',
		key: 'billCreateTime',
		label: '生成时间',
	},
	{
		control: 'el-input',
		key: 'feeCalculationMethodDesc',
		label: '管理费计算方式',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '创建人',
	},
];
// 筛选表单
const conditionForms = [
	{
		control: 'el-input',
		key: 'id',
		label: '承接人',
	},
	{
		control: 'el-input',
		key: 'billName',
		label: '承接人证件号码',
	},
];
const indexThead = [
	{
		prop: 'undertakerName',
		label: '承接人',
		width: 100,
	},
	{
		prop: 'undertakerCard',
		label: '承接人证件号码',
		width: 150,
	},
	{
		prop: 'undertakerPhone',
		label: '承接人手机号码',
		width: 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		width: 100,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		width: 100,
	},
	{
		prop: 'merchantName',
		label: '商户',
		width: 100,
	},
	{
		prop: 'taskName',
		label: '任务名称',
		width: 100,
	},
	{
		prop: 'taskUndertakerId',
		label: '任务承接编号',
		width: 150,
	},
	{
		prop: 'taskId',
		label: '任务编号',
		width: 100,
	},
	{
		prop: 'undertakerBankName',
		label: '承接人开户行',
		width: 150,
	},
	{
		prop: 'undertakerBankNumber',
		label: '承接人银行卡号',
		width: 150,
	},
	{
		prop: 'taskAmount',
		label: '任务金额(元)',
		width: 150,
	},
	{
		prop: 'taxWithheld',
		label: '代扣税款(元)',
		width: 150,
	},
	{
		prop: 'paidAmount',
		label: '实发金额(元)',
		width: 150,
	},
	{
		prop: 'commissionAmount',
		label: '管理费(元)',
		width: 150,
	},
	{
		prop: 'undertaderStartTime',
		label: '承接开始时间',
		width: 150,
	},
	{
		prop: 'undertaderEndTime',
		label: '承接结束时间',
		width: 150,
	},
	{
		prop: 'id',
		label: '任务结算明细编号',
		width: 150,
	},
	{
		prop: 'billSettleTime',
		label: '付款时间', // 伪代码
		width: 150,
	},
	{
		prop: 'isSignServiceContract',
		label: '是否签署协议',
		width: 150,
	},
	{
		prop: 'isBankFourEssentialFactor',
		label: '是否银行四要素校验',
		width: 150,
	},
	{
		prop: 'billStatus',
		label: '结算状态',
		width: 100,
	},
	{
		prop: 'billSettleTime',
		label: '支付时间',
		width: 100,
	},
	{
		prop: 'paymentStatus',
		label: '支付状态',
		width: 100,
	},
	{
		prop: 'failureReason',
		label: '支付失败原因',
		width: 150,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		width: 300,
	},
];
const queryForm = {
	settleBillId: route.query.id,
};
const newIndexThead = [
	{
		prop: 'settleBillName',
		label: '账单名称',
		width: 100,
	},
	{
		prop: 'settleBillId',
		label: '账单编号',
		width: 100,
	},
	{
		prop: 'id',
		label: '结算单编号',
		width: 100,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		width: 100,
	},
	{
		prop: 'bankAccountNumberRecipient',
		label: '收款方银行账号',
		width: 100,
	},
	{
		prop: 'accountNameRecipient',
		label: '收款方户名',
		width: 100,
	},
	{
		prop: 'serviceAmount',
		label: '结算金额(元)',
		width: 100,
	},
	{
		prop: 'payTime',
		label: '付款时间',
		width: 100,
	},
	{
		prop: 'statusDesc',
		label: '结算状态',
		width: 100,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		width: 300,
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

// 初始化表单数据
const getmerchantInfoData = () => {
	// 获取数据
	loading.value = true;
	getObj(route.query.id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};
if (route.query.id) {
	getmerchantInfoData();
}

const handlePayBillRecord = (list = [], dialogType: number) => {
	detailDialogRef.value?.openDialog(form.id, 1, dialogType);
};
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};

const refreshDataList = () => {
	getmerchantInfoData();
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
}
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
</style>
