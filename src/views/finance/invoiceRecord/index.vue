<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/invoiceRecord.ts">
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
		<template #actions="{ row: { id, status } }">
			<el-button icon="view" text type="primary" @click="applyfor(id, 'see')">查看</el-button>
			<el-button icon="edit" text type="primary" v-if="status === '20'" @click="applyfor(id, 'cancel')">作废</el-button>
			<el-button icon="edit" text type="primary" v-if="status === '10'" @click="applyfor(id, 'open')">开票</el-button>
			<el-button icon="edit" text type="primary" v-if="status === '10'" @click="applyfor(id, 'reject')">驳回</el-button>
		</template>
		<Dialog
			vertical
			button-position="center"
			v-model="applyShow"
			:title="financeType === 'see' ? '查看发票' : '开具发票'"
			submitButtonText="提交"
			width="80%"
			:label-width="160"
			:forms="forms"
			:columns="12"
			:showBtn="financeType !== 'see'"
			v-model:form-data="dialogFormData"
			:onSubmit="onSubmit"
		>
			<template #address>
				<el-form-item label="邮寄地址:" prop="address" v-if="false">
					<el-radio-group v-model="dialogFormData.radioAddress" class="ml-4" @change="radioChange">
						<el-radio :label="1" size="large">默认邮寄地址</el-radio>
						<el-radio :label="0" size="large">手动填写</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮寄地址:" prop="postAddress">
					<el-input v-model="dialogFormData.postAddress" disabled />
				</el-form-item>
				<el-form-item label="收件人:" prop="postUsername">
					<el-input v-model="dialogFormData.postUsername" disabled />
				</el-form-item>
				<el-form-item label="收件人手机号:" prop="postPhone">
					<el-input v-model="dialogFormData.postPhone" disabled />
				</el-form-item>
			</template>
		</Dialog>
		<Dialog
			vertical
			button-position="center"
			v-model="rejectShow"
			:title="financeType === 'cancel' ? '发票作废' : '发票驳回'"
			submitButtonText="确认"
			:label-width="120"
			:forms="rejectForms"
			:columns="24"
			v-model:form-data="rejectFormData"
			:onSubmit="onSubmit"
		>
			<template #rejectTitle>
				<div class="text-[20px] text-center">您确定要{{ financeType === 'cancel' ? '作废' : '驳回' }}本发票吗？</div>
			</template>
		</Dialog>
	</Table-view>
</template>

<script setup lang="ts" name="发票记录">
import { getObj, rejectInvoice, cancelInvoice } from '/@/api/finance/invoiceRecord';
import { saveInvoice } from '/@/api/finance/InvoiceNotAppliedFor';
const financeType = ref(); // 进入方式 see查看 open开票 cancel作废 reject驳回

const columns = [
	{
		prop: 'id',
		label: '申请编号',
		'min-width': 150,
	},
	{
		prop: 'settleBillRecordId',
		label: '结算单编号',
		'min-width': 150,
	},
	{
		prop: 'createTime',
		label: '申请时间',
		'min-width': 150,
	},
	{
		prop: 'invoicingAmount',
		label: '开票金额',
		'min-width': 150,
	},
	{
		prop: 'billingTypeDesc',
		label: '发票类型',
		'min-width': 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'statusDesc',
		label: '发票状态',
		'min-width': 150,
	},
	{
		prop: 'reason',
		label: '原因',
		'min-width': 150,
	},

	{
		prop: 'invoicingCategoriesDesc',
		label: '开票类目',
		'min-width': 150,
	},
	{
		prop: 'postOrderNumber',
		label: '快递单号',
		'min-width': 150,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		minWidth: 200,
	},
];

const conditionForms = [
	{
		label: '申请编号',
		control: 'el-input',
		key: 'idNum',
	},
	{
		label: '发票类型',
		control: 'el-select',
		key: 'billingType',
		options: 'invoice_type',
	},
	{
		label: '申请时间',
		control: 'DateRange',
		key: 'createTimeFromTo',
	},
	{
		label: '商户',
		control: 'MerchantSelect',
		key: 'merchantId',
	},
	{
		label: '服务商',
		control: 'SpSelect',
		key: 'spId',
	},
	{
		label: '发票状态',
		control: 'el-select',
		key: 'invoiceStatus',
		options: 'invoice_status',
	},
];

const forms = computed(() => [
	{
		control: 'el-input',
		key: 'merchantName',
		label: '开票抬头',
		column: 24,
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'unifiedSocialCreditIdentifier',
		label: '统一社会信用代码',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'enterpriseMailbox',
		label: '企业邮箱',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'enterpriseAddress',
		label: '企业地址',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'enterprisePhone',
		label: '企业电话',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'bankName',
		label: '开户行',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'bankNo',
		label: '银行账号',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-select',
		key: 'billingType',
		label: '开票类型',
		options: 'invoice_type',
		props: {
			disabled: financeType.value === 'see',
		},
		rules: [{ required: financeType.value === 'open', message: '开票类型不能为空', trigger: 'change' }],
	},
	{
		control: 'el-select',
		key: 'invoicingCategories',
		label: '开票类目',
		options: 'invoice_category',
		props: {
			disabled: financeType.value === 'see',
		},
		rules: [{ required: financeType.value === 'open', message: '开票类目不能为空', trigger: 'change' }],
	},
	{
		control: 'el-input',
		key: 'invoiceNumber',
		label: '发票编号',
		props: {
			disabled: financeType.value === 'see',
		},
		rules: [{ required: financeType.value === 'open', message: '发票编号不能为空', trigger: 'blur' }],
	},
	{
		control: 'el-input',
		key: 'invoicingAmount',
		label: '开票金额',
		props: {
			disabled: true,
		},
	},
	{
		control: 'UploadFile',
		key: 'invoiceFiles',
		label: '发票图片',
		column: 24,
		props: {
			type: '60',
			disabled: financeType.value === 'see',
		},
		rules: [{ type: 'array', required: financeType.value === 'open', message: '发票图片不能为空', trigger: 'change' }],
	},
	{
		slot: true,
		key: 'address',
		column: 24,
	},
	{
		control: 'el-select',
		key: 'postType',
		label: '快递公司',
		options: 'express_company',
		props: {
			disabled: financeType.value === 'see',
		},
		rules: [{ required: financeType.value === 'open', message: '快递公司不能为空', trigger: 'change' }],
	},
	{
		control: 'el-input',
		key: 'postOrderNumber',
		label: '快递单号',
		props: {
			disabled: financeType.value === 'see',
		},
		rules: [{ required: financeType.value === 'open', message: '快递单号不能为空', trigger: 'blur' }],
	},
]);

const rejectForms = computed(() => [
	{
		slot: true,
		key: 'rejectTitle',
		column: 24,
	},
	{
		control: 'el-input',
		key: 'reason',
		label: financeType.value === 'cancel' ? '作废原因' : '驳回原因',
		props: {
			type: 'textarea',
		},
		rules: [{ required: true, message: financeType.value === 'cancel' ? '作废原因' : '驳回原因' + '不能为空', trigger: 'blur' }],
	},
]);

const applyShow = ref(false);
let dialogFormData = ref({
	radioAddress: 1,
	settleBillRecordId: '',
	invoiceFiles: [],
	invoiceTitle: '',
	merchantName: '',
});

const rejectShow = ref(false);
let rejectFormData = ref({
	id: '',
});

const applyfor = async (id: string, type: string) => {
	financeType.value = type;
	if (type === 'see' || type === 'open') {
		applyShow.value = true;
		dialogFormData.value = (await getObj(id)).data;
		dialogFormData.value.radioAddress = 1;
		dialogFormData.value.invoiceTitle = dialogFormData.value.merchantName;
		dialogFormData.value.id = id;
	} else {
		rejectShow.value = true;
		rejectFormData.value.id = id;
	}
};

// 提交
const onSubmit = async (refresh: any) => {
	try {
		if (financeType.value === 'open') {
			await saveInvoice({ ...dialogFormData.value });
			applyShow.value = false;
		} else if (financeType.value === 'cancel') {
			await cancelInvoice({ ...rejectFormData.value });
			rejectShow.value = false;
		} else {
			await rejectInvoice({ ...rejectFormData.value });
			rejectShow.value = false;
		}
		refresh();
	} catch (err: any) {
	} finally {
	}
};
</script>
