<template>
	<Table-view
		ref="merchantRefundRef"
		:columns="columns"
		isTab
		:condition-forms="conditionForms"
		getListFnName="getRefundPage"
		module="finance/merchantRefund.ts"
	>
		<template #actions="{ row }">
			<el-button v-if="row.status == 10" icon="view" text type="primary" v-auth="'core_settleBill_audit'" @click="handleAction('exam', row)">
				退款审核
			</el-button>
			<el-button
				v-if="row.status == 30 || row.status == 50"
				icon="view"
				text
				type="primary"
				v-auth="'core_settleBill_submit'"
				@click="handleAction('tui', row)"
			>
				发起退款
			</el-button>
			<el-button v-if="row.status == 40" icon="view" text type="primary" v-auth="'core_settleBill_down'" @click="handleContractFile(row)">
				查看转款凭证
			</el-button>
		</template>
		<form-audit
			ref="formAuditDialogRef"
			formId="billId"
			getUrl="/finance/merchantRefund/"
			putUrl="/finance/merchantRefund/auditRefund"
			@refresh="refreshDataList()"
		/>
	</Table-view>
</template>

<script setup lang="ts" name="systemMerchantRefund">
import { delObjs, getObj, addObj } from '/@/api/finance/merchantRefund';
import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['refund_status'] });
const FormAudit = defineAsyncComponent(() => import('./components/audit.vue'));
const router = useRouter();
interface BatchUploadRecordPage {
	status: number;
}
const formAuditDialogRef = ref();
const merchantRefundRef = ref();

const columns = [
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 160,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 160,
	},
	{
		prop: 'subAccountNum',
		label: '资金账户',
		'min-width': 160,
	},
	{
		prop: 'receiptAmount',
		label: '退款金额',
		'min-width': 160,
	},
	{
		prop: 'status',
		label: '状态',
		'min-width': 160,
		value: ({ status }: BatchUploadRecordPage) => batchMap.value.refund_status[status],
	},
	{
		prop: 'auditPostscript',
		label: '驳回原因',
		'min-width': 160,
	},
	{
		prop: 'receiptAccountName',
		label: '对方户名',
		'min-width': 160,
	},
	{
		prop: 'receiptAccountNumber',
		label: '对方银行账号',
		'min-width': 160,
	},
	{
		prop: 'updateTime',
		label: '更新时间',
		'min-width': 160,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 150,
	},
];

const conditionForms = [
	{
		control: 'InputPlus',
		key: 'subAccountNum',
		label: '子账户',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: { platform: true },
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'el-select',
		key: 'status',
		label: '状态',
		options: 'refund_status',
	},
];

const handleAction = async (type: string, row: any) => {
	switch (type) {
		case 'view':
			router.push({
				path: '/core/settleBill/detail',
				query: {
					id: row.id,
				},
				state: {
					refresh: 1,
				},
			});
			break;
		case 'exam':
			formAuditDialogRef?.value.openDialog(row.id);
			break;
	}
};

const refreshDataList = () => {
	merchantRefundRef?.value.resetQuery();
};
</script>
