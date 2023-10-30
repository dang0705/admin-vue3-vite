<template>
	<div>
		<TableView
			ref="merchantAccountCapitalRef"
			:columns="indexThead"
			module="finance/merchantRecharge.ts"
			:staticQuery="staticQuery"
			:condition-forms="conditionForms"
			labelWidth="140px"
			downBlobFileUrl="/finance/merchantRecharge/export"
		>
			<template #top-bar>
				<el-button v-auth="'finance_merchantRefund_add'" @click="handleRe(2)" type="primary" class="ml10"> 申请退款 </el-button>
				<el-button v-auth="'finance_merchantRecharge_add'" @click="handleRe(1)" type="primary" class="ml10"> 发起充值 </el-button>
			</template>
			<template #tableTopTwo>
				<div class="total_wrapper">
					<div class="total_list">
						<div class="total_item">
							<div class="info">
								<div class="info_label">账户余额</div>
								<div class="price_box">
									<div class="price">{{ thousandthDivision({ number: form.totalAmount }) }}</div>
									<div class="unit">元</div>
								</div>
							</div>
						</div>
						<div class="total_item">
							<div class="info">
								<div class="info_label">冻结金额</div>
								<div class="price_box">
									<div class="price">{{ thousandthDivision({ number: form.freeze }) }}</div>
									<div class="unit">元</div>
								</div>
							</div>
						</div>
						<div class="total_item">
							<div class="info">
								<div class="info_label">可用余额</div>
								<div class="price_box">
									<div class="price">{{ thousandthDivision({ number: form.balance }) }}</div>
									<div class="unit">元</div>
								</div>
							</div>
						</div>
					</div>
					<div class="account_list">
						<div class="account_title">收款账户信息</div>
						<div class="account_item">
							<div class="label">收款开户行</div>
							<div class="value">{{ form.bankBranch }}</div>
							<el-button class="ml-auto" @click="copyText(form.bankBranch)" text type="primary"> 复制 </el-button>
						</div>
						<div class="account_item">
							<div class="label">收款账号</div>
							<div class="value">{{ form.bankAccountNumber }}</div>
							<el-button class="ml-auto" @click="copyText(form.bankAccountNumber)" text type="primary"> 复制 </el-button>
						</div>
						<div class="account_item">
							<div class="label">收款户名</div>
							<div class="value">{{ form.accountName }}</div>
							<el-button class="ml-auto" @click="copyText(form.accountName)" text type="primary"> 复制 </el-button>
						</div>
					</div>
				</div>
			</template>
			<template #actions="{ row }">
				<el-button v-auth="'finance_merchantRecharge_edit'" v-if="row.status != 30" @click="handleRevoke(row.id)" icon="view" text type="primary">
					撤销
				</el-button>
				<el-button v-auth="'finance_merchantAccountCapital_view_voucher'" @click="handleContractFile(row)" icon="view" text type="primary">
					查看转账凭证
				</el-button>
			</template>
			<Dialog
				vertical
				button-position="center"
				v-model="show"
				:title="reType == 1 ? '发起充值' : '申请退款'"
				:show-cancel="false"
				:forms="forms"
				:columns="24"
				v-model:form-data="dialogFormData"
				:on-cancel="onCancel"
				:on-submit="onSubmit"
			>
				<template #receiptAccountNumber="{ formData }">
					<el-form-item label="收款账号:" prop="receiptAccountNumber">
						<el-select
							@change="handleFilter(dialogFormData.receiptAccountNumber)"
							placeholder="请选择"
							class="w100"
							v-model="dialogFormData.receiptAccountNumber"
						>
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in receiptAccountOptions" />
						</el-select>
					</el-form-item>
				</template>
				<template #receiptAccountBank="{ formData }">
					<el-form-item label="收款账号:" prop="receiptAccountBank">
						<InputPlus disabled v-model="dialogFormData.receiptAccountBank"></InputPlus>
					</el-form-item>
				</template>
			</Dialog>
		</TableView>
		<!-- <DetailDialog ref="detailDialogRef" @refresh="getmerchantInfoData()" /> -->
	</div>
</template>

<script setup lang="ts" name="商户资金账户详情">
import { updateMerchantRechargeStatus } from '/@/api/finance/merchantRecharge';
import { getSelectReceiptAccount, addObj } from '/@/api/finance/merchantRefund';
import { getObj, queryPlatSpBalance } from '/@/api/finance/merchantAccountCapital';
import { useMessage, useMessageBox } from '/@/hooks/message';
import thousandthDivision from '/@/utils/thousandth-division';
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	status: string;
}
const batchMap = Array2Object({ dic: ['merchant_recharge_status'] });
const DetailDialog = defineAsyncComponent(() => import('./components/detailDialog.vue'));
import { addMerchantRecharge } from '/@/api/finance/merchantRecharge';
const route: any = useRoute();
const reType = ref(0);
const detailDialogRef = ref();
const importBillRef = ref();
const show = ref(false);
const merchantAccountCapitalRef = ref();
import commonFunction from '/@/utils/commonFunction';
const { copyText } = commonFunction();
const { proxy } = getCurrentInstance();
let dialogFormData = reactive({});
let forms = [];
const form1 = [
	{
		control: 'UploadFile',
		key: 'transferVouchers',
		label: '上传转账凭证',
		rules: [
			{
				required: true,
				message: '转账凭证不能为空',
				trigger: 'blur',
			},
		],
		props: {
			type: '60',
		},
	},
	{
		control: 'InputPlus',
		key: 'payingAccountName',
		label: '付款户名',
		rules: [
			{
				required: true,
				message: '付款户名不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingAccountNumber',
		label: '付款账号',
		rules: [
			{
				required: true,
				message: '付款账号不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingBankName',
		label: '开户行',
		rules: [
			{
				required: true,
				message: '开户行不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'InputPlus',
		key: 'payingAmount',
		label: '付款金额',
		rules: [
			{
				required: true,
				message: '付款金额不能为空',
				trigger: 'blur',
			},
		],
	},
];
const receiptAccountOptions = ref([]);
// const form2 = [];
// 定义变量内容
const router = useRouter();
const loading = ref(false);
// 提交表单数据
const form = reactive({
	bankBranch: '',
	merchantId: '',
	bankAccountNumber: '',
	accountName: '',
	totalAmount: 0,
	freeze: 0,
	balance: 0,
	merchantName: '',
});
const balanceInfo = reactive({});
const indexThead = [
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
		prop: 'serialNumber',
		label: '充值流水号',
		minWidth: 150,
	},
	{
		prop: 'amount',
		label: '充值金额(元)',
		minWidth: 150,
	},
	{
		prop: 'rechargeStartTime',
		label: '发起充值时间',
		minWidth: 150,
	},
	{
		prop: 'dealTime',
		label: '实际交易时间',
		minWidth: 150,
	},
	{
		prop: 'payingAccountName',
		label: '付款户名',
		minWidth: 150,
	},
	{
		prop: 'payingAccountNumber',
		label: '付款账号',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountName',
		label: '收款户名',
		minWidth: 150,
	},
	{
		prop: 'reciprocalAccountNumber',
		label: '收款账号',
		minWidth: 150,
	},
	{
		prop: 'updateTime',
		label: '更新时间',
		minWidth: 180,
	},
	{
		prop: 'status',
		label: '状态',
		minWidth: 150,
		value: ({ status }: BatchUploadRecordPage) => batchMap.value.merchant_recharge_status[status],
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 250,
	},
];
// 筛选表单
const conditionForms = [
	{
		control: 'DateRange',
		key: 'rechargeStartRange',
		label: '发起充值时间',
		props: {
			valueType: 'string',
		},
	},
];
const staticQuery = {
	accountId: route.query.id,
};

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

const handleFilter = (value) => {
	const obj = receiptAccountOptions.value.find((item) => {
		return item.value == value;
	});
	dialogFormData.receiptAccountBank = obj.receiptAccountBank;
};

const handleRe = async (type: number) => {
	reType.value = type;
	if (type === 1) {
		forms = form1;
	} else if (type === 2) {
		const res = await getSelectReceiptAccount({
			merchantId: form.merchantId,
		});
		receiptAccountOptions.value = res.data || [];
		receiptAccountOptions.value.forEach((item: any) => {
			item.label = item.receiptAccountNumber;
			item.value = item.receiptAccountNumber;
		});
		console.log('res', res);
		forms = [
			{
				control: 'InputPlus',
				key: 'totalAmount',
				label: '账户可用余额',
				value: thousandthDivision({ number: form.totalAmount }) + '元',
				props: {
					disabled: true,
				},
			},
			{
				control: 'InputPlus',
				key: 'receiptAmount',
				label: '申请退款金额',
				rules: [
					{
						required: true,
						message: '申请退款金额不能为空',
						trigger: 'blur',
					},
				],
				props: {
					type: 'number',
				},
			},
			{
				control: 'InputPlus',
				key: 'receiptAccountName',
				label: '收款户名',
				props: {
					disabled: true,
				},
				value: form.merchantName,
			},
			{
				control: 'el-select',
				key: 'receiptAccountNumber',
				label: '收款账号',
				rules: [
					{
						required: true,
						message: '收款账号不能为空',
						trigger: 'blur',
					},
				],
				// options: receiptAccountOptions.value,
				slot: true,
			},
			{
				control: 'InputPlus',
				key: 'receiptAccountBank',
				label: '开户行',
				props: {
					disabled: true,
				},
				slot: true,
			},
		];
	}
	show.value = true;
};
const handlePayBillRecord = (list = [], dialogType: number) => {};
const handleContractFile = (row: any) => {
	window.open(`${proxy.baseURL}/${row.transferVoucher}`);
};
const handleRevoke = async (id: string) => {
	try {
		await useMessageBox().confirm('您确定撤销吗？');
		await updateMerchantRechargeStatus(id);
		useMessage().success('撤销成功');
		merchantAccountCapitalRef.value.resetQuery();
	} catch (err: any) {}
};
// 提交授权数据
const onSubmit = async () => {
	if (reType.value === 1) {
		addMerchantRecharge({
			accountId: route.query.id,
			...dialogFormData,
		})
			.then((res: any) => {
				useMessage().success('充值成功');
				show.value = false;
				refreshDataList();
			})
			.finally(() => {
				loading.value = false;
			});
	} else if (reType.value === 2) {
		addObj({
			accountId: route.query.id,
			...dialogFormData,
		})
			.then((res: any) => {
				useMessage().success('申请退款成功');
				show.value = false;
				refreshDataList();
			})
			.finally(() => {
				loading.value = false;
			});
	}
};
const onCancel = () => {
	show.value = false;
};
const refreshDataList = () => {
	getmerchantInfoData();
	merchantAccountCapitalRef.value.resetQuery();
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
	// padding: 28px 0;
	// background: #fafafa;
	margin-bottom: 30px;
	display: flex;
}
.total_list {
	background: #fafafa;
	display: flex;
	flex: 1;
	margin-right: 36px;
	.total_item {
		width: 33.33%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(0, 0, 0, 0.5);
		min-width: 100px;
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
.account_title {
	font-size: 16px;
	font-weight: 700;
	margin-bottom: 12px;
}
.account_list {
	background: #fafafa;
	padding: 16px 24px;
	margin-left: auto;
}
.account_item {
	display: flex;
	align-items: center;
	.label {
		width: 100px;
	}
	.value {
		min-width: 150px;
	}
}
</style>
