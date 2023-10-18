<template>
	<div>
		<TableView
			ref="TableViewRef"
			:columns="indexThead"
			module="finance/merchantRecharge.ts"
			:staticQuery="staticQuery"
			:condition-forms="conditionForms"
			labelWidth="140px"
			downBlobFileUrl="/finance/merchantRecharge/export"
		>
			<template #status="{ row: { status } }">
				<span v-text="batchMap?.merchant_recharge_status[status]" />
			</template>
			<template #tableTop="{ otherInfo }">
				<div class="total_wrapper">
					<div class="total_list">
						<div class="total_item">
							<div class="info">
								<div class="info_label">账户余额</div>
								<div class="price_box">
									<div class="price">{{ form.totalAmount || '0.00' }}</div>
									<div class="unit">元</div>
								</div>
							</div>
						</div>
						<div class="total_item">
							<div class="info">
								<div class="info_label">冻结金额</div>
								<div class="price_box">
									<div class="price">{{ form.freeze || '0.00' }}</div>
									<div class="unit">元</div>
								</div>
							</div>
						</div>
						<div class="total_item">
							<div class="info">
								<div class="info_label">可用余额</div>
								<div class="price_box">
									<div class="price">{{ form.balance || '0.00' }}</div>
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
				<el-button v-if="row.status != 30" @click="handleRevoke(row.id)" icon="view" text type="primary"> 撤销 </el-button>
				<el-button @click="handleContractFile(row)" icon="view" text type="primary"> 查看转账凭证 </el-button>
			</template>
		</TableView>
	</div>
</template>

<script setup lang="ts" name="账单详情">
// src\api\finance\merchantAccountCapital.ts
import { addObj, putObj, payBillRecord } from '/@/api/core/settleBill';
import { updateMerchantRechargeStatus } from '/@/api/finance/merchantRecharge';
import { getObj, queryPlatSpBalance } from '/@/api/finance/merchantAccountCapital';
import { useMessage, useMessageBox } from '/@/hooks/message';
import Array2Object from '/@/utils/array-2-object';
const route: any = useRoute();
const detailDialogRef = ref();
const importBillRef = ref();
const TableViewRef = ref();
import commonFunction from '/@/utils/commonFunction';
const { copyText } = commonFunction();
const { proxy } = getCurrentInstance();

// 定义变量内容
const router = useRouter();
const loading = ref(false);
// 提交表单数据
const form = reactive({});
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
		label: '充值金额（元）',
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
		minWidth: 150,
	},
	{
		prop: 'status',
		label: '状态',
		minWidth: 150,
		slot: true,
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
			console.log('form-1', form);
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
const handleContractFile = (row) => {
	window.open(`${proxy.baseURL}/${row.transferVoucher}`);
};
const handleRevoke = async (id) => {
	try {
		await useMessageBox().confirm('您确定撤销吗？');
		await updateMerchantRechargeStatus(id);
		useMessage().success('撤销成功');
		TableViewRef.value.resetQuery();
	} catch (err: any) {}
};

const refreshDataList = () => {
	getmerchantInfoData();
	TableViewRef.value.resetQuery();
};

const batchMap = computed(() => Array2Object({ dic: ['merchant_recharge_status'] }).value);
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
