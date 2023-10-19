<template>
	<TableView :columns="columns" isTab module="core/settleBillTaskRecordItem.ts" :condition-forms="conditionForms" labelWidth="140px">
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="handleContractFile(row)"> 查看关联协议 </el-button>
			<!-- v-if="row.paymentStatus == 30" -->
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="handleBtn('toSubmit', row)"> 查看支付凭证 </el-button>
		</template>
		<!-- <template #isBankFourEssentialFactor="{ row: { isBankFourEssentialFactor } }">
			<span v-text="batchMap?.yes_no_type[isBankFourEssentialFactor]" />
		</template>
		<template #isSignServiceContract="{ row: { isSignServiceContract } }">
			<span v-text="batchMap?.yes_no_type[isSignServiceContract]" />
		</template> -->
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
	</TableView>
</template>

<script setup lang="ts" name="任务结算明细">
import { delObjs, getObj, addObj } from '/@/api/core/settleBillTaskRecordItem';
const batchMap = Array2Object({ dic: ['yes_no_type', 'settle_status', 'undertaker_agent_paying_pay_status'] });
const { proxy } = getCurrentInstance();
import { useMessage, useMessageBox } from '/@/hooks/message';
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	isSignServiceContract: number;
	isBankFourEssentialFactor: number;
	billStatus: number;
	paymentStatus: number;
}
const columns = [
	{
		prop: 'undertakerName',
		label: '承接人-姓名',
		minWidth: 150,
	},
	{
		prop: 'undertakerCard',
		label: '承接人身份证号',
		minWidth: 150,
	},
	{
		prop: 'undertakerPhone',
		label: '承接人手机号码',
		minWidth: 150,
	},
	// {
	// 	prop: 'undertakerBankName',
	// 	label: '承接人开户行',
	// 	minWidth: 150,
	// },
	// {
	// 	prop: 'undertakerBankNumber',
	// 	label: '承接人银行卡号',
	// 	minWidth: 150,
	// },
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
		prop: 'merchantName',
		label: '商户',
		minWidth: 150,
	},

	{
		prop: 'taskName',
		label: '任务名称',
		minWidth: 150,
	},
	{
		prop: 'taskUndertakerId',
		label: '任务承接编号',
		minWidth: 150,
	},
	{
		prop: 'taskId',
		label: '任务编号',
		minWidth: 150,
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
		minWidth: 150,
	},
	{
		prop: 'taxWithheld',
		label: '代扣税款(元)',
		minWidth: 150,
	},
	{
		prop: 'paidAmount',
		label: '实发金额(元)',
		minWidth: 150,
	},
	{
		prop: 'commissionAmount',
		label: '管理费(元)',
		minWidth: 150,
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
		prop: 'paymentSuccessTime',
		label: '支付时间',
		minWidth: 150,
	},
	{
		prop: 'paymentStatus',
		label: '支付状态',
		value: ({ paymentStatus }: BatchUploadRecordPage) => batchMap.value.undertaker_agent_paying_pay_status[paymentStatus],
		minWidth: 150,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 300,
	},
];

const conditionForms = [
	{
		control: 'el-input',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'el-input',
		key: 'undertakerCard',
		label: '承接人证件号码',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'el-input',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'settleBillId',
		label: '账单编号',
	},
	{
		control: 'el-input',
		key: 'billTaskRecordId',
		label: '任务结算明细编号',
	},
	{
		control: 'DateRange',
		key: 'billSettleTimeFromTo',
		label: '付款时间',
		props: {
			valueType: 'string',
		},
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const handleContractFile = (row) => {
	window.open(`${proxy.baseURL}/${row.contractFile}`);
};
//
</script>
