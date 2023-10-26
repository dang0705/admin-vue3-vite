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

		<Dialog
			vertical
			button-position="center"
			v-model="show"
			title="发起退款"
			:show-cancel="false"
			:forms="forms"
			:columns="24"
			v-model:form-data="dialogFormData"
			:on-cancel="
				() => {
					show.value = false;
				}
			"
			:on-submit="onSubmit"
		>
			<template #receiptAccountNumber>
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
			<template #receiptAccountBank>
				<el-form-item label="收款账号:" prop="receiptAccountBank">
					<InputPlus disabled v-model="dialogFormData.receiptAccountBank"></InputPlus>
				</el-form-item>
			</template>
		</Dialog>
	</Table-view>
</template>

<script setup lang="ts" name="systemMerchantRefund">
import { delObjs, getObj, addExecuteRefund } from '/@/api/finance/merchantRefund';
import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['refund_status'] });
const FormAudit = defineAsyncComponent(() => import('./components/audit.vue'));
import { useMessage, useMessageBox } from '/@/hooks/message';
import thousandthDivision from '/@/utils/thousandth-division';
const show = ref(false);
const loading = ref(false);
const router = useRouter();
let dialogFormData = reactive({
	id: '',
});
let forms = [];
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
		case 'tui':
			dialogFormData.id = row.id;
			show.value = true;
			forms = [
				{
					control: 'el-select',
					key: 'operateMode',
					label: '操作方式',
					rules: [
						{
							required: true,
							message: '操作方式不能为空',
							trigger: 'blur',
						},
					],
					options: [
						{
							label: '线下退款',
							value: '1',
						},
						{
							label: '线上退款',
							value: '2',
						},
					],
				},
				{
					control: 'UploadFile',
					key: 'transferVouchers',
					label: '上传转账凭证',
					rules: [
						{
							required: true,
							message: '上传转账凭证不能为空',
							trigger: 'blur',
						},
					],
					props: {
						type: '60',
					},
				},
				{
					control: 'InputPlus',
					key: 'receiptAccountName',
					label: '对方户名',
					props: {
						disabled: true,
					},
					value: row.receiptAccountName,
				},
				{
					control: 'InputPlus',
					key: 'receiptAccountBank',
					label: '对方开户行',
					props: {
						disabled: true,
					},
					value: row.receiptAccountBank,
				},
				{
					control: 'InputPlus',
					key: 'receiptAccountNumber',
					label: '对方银行账号',
					props: {
						disabled: true,
					},
					value: row.receiptAccountNumber,
				},
				{
					control: 'InputPlus',
					key: 'receiptAmount',
					label: '退款金额',
					value: thousandthDivision({ number: row.receiptAmount }) + '元',
					props: {
						disabled: true,
					},
				},
			];
			break;
		case 'exam':
			formAuditDialogRef?.value.openDialog(row.id);
			break;
	}
};

// 提交授权数据
const onSubmit = async () => {
	addExecuteRefund({
		...dialogFormData,
	})
		.then((res: any) => {
			useMessage().success('退款成功');
			show.value = false;
			refreshDataList();
		})
		.finally(() => {
			loading.value = false;
		});
};

const refreshDataList = () => {
	merchantRefundRef?.value.resetQuery();
};
</script>
