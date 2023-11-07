<template>
	<Table-view
		:columns="columns"
		:condition-forms="conditionForms"
		module="finance/InvoiceNotAppliedFor.ts"
		labelWidth="100px"
		downBlobFileUrl="/finance/invoiceRecord/export"
		downBlobFileName="未申请发票.xlsx"
		exportAuth="finance_invoiceRecordNot_export"
	>
		<template #actions="{ row: { id } }">
			<el-button icon="folder-add" text type="primary" @click="applyfor(id, 'applyfor')" v-auth="'finance_invoiceRecordNot_applyfor'">
				申请开票
			</el-button>
			<el-button icon="folder-add" text type="primary" @click="applyfor(id, 'open')" v-auth="'finance_invoiceRecordNot_open'"> 开票 </el-button>
		</template>
		<Dialog
			vertical
			button-position="center"
			v-model="applyShow"
			:title="financeType === 'applyfor' ? '申请开票' : '开具发票'"
			submitButtonText="提交"
			width="80%"
			:label-width="160"
			:forms="forms"
			:columns="12"
			v-model:form-data="dialogFormData"
			:onSubmit="onSubmit"
		>
			<template #address>
				<el-form-item label="邮寄地址:" prop="address" v-if="financeType === 'applyfor'">
					<el-radio-group v-model="dialogFormData.radioAddress" class="ml-4" @change="radioChange">
						<el-radio :label="1" size="large">默认邮寄地址</el-radio>
						<el-radio :label="0" size="large">手动填写</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					label="邮寄地址:"
					prop="postAddress"
					:rules="[{ required: dialogFormData.radioAddress === 0, message: '邮寄地址不能为空', trigger: 'blur' }]"
				>
					<InputPlus v-model="dialogFormData.postAddress" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
				<el-form-item
					label="收件人:"
					prop="postUsername"
					:rules="[{ required: dialogFormData.radioAddress === 0, message: '收件人不能为空', trigger: 'blur' }]"
				>
					<InputPlus v-model="dialogFormData.postUsername" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
				<el-form-item
					label="收件人手机号:"
					prop="postPhone"
					:rules="[{ required: dialogFormData.radioAddress === 0, message: '收件人手机号不能为空', trigger: 'blur' }]"
				>
					<InputPlus v-model="dialogFormData.postPhone" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
			</template>
		</Dialog>
	</Table-view>
</template>

<script setup lang="ts">
import { getObj, applyInvoice, saveInvoice } from '/@/api/finance/InvoiceNotAppliedFor';
const financeType = ref(); // 进入方式 applyfor申请 open开票

const columns = [
	{
		type: 'selection',
		width: '40',
	},
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'billNumber',
		label: '账单编号',
		'min-width': 175,
	},
	{
		prop: 'settleBillName',
		label: '账单名称',
		'min-width': 150,
	},
	{
		prop: 'settleBillTypeDesc',
		label: '结算单类型',
		'min-width': 120,
	},
	{
		prop: 'id',
		label: '结算单编号',
		'min-width': 175,
	},
	{
		prop: 'payTime',
		label: '结算完成时间',
		'min-width': 170,
	},
	{
		prop: 'serviceAmount',
		label: '可开票全额(元)',
		'min-width': 120,
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
		label: '商户',
		control: 'MerchantSelect',
		key: 'merchantId',
	},
	{
		label: '服务商',
		control: 'SpSelect',
		key: 'spId',
		props: {
			platform: true,
		},
	},
	{
		label: '充值时间',
		control: 'DateRange',
		key: 'payTimeFromTo',
		props: {
			valueType: 'string',
		},
	},
	{
		label: '结算单类型',
		control: 'el-select',
		key: 'billType',
		options: 'settle_bill_type',
	},
	{
		label: '账单编号',
		control: 'InputPlus',
		key: 'billNumber',
	},
	{
		label: '账单名称',
		control: 'InputPlus',
		key: 'billName',
	},
];

const forms = computed(() => [
	{
		control: 'InputPlus',
		key: 'merchantName',
		label: '开票抬头',
		column: 24,
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'unifiedSocialCreditIdentifier',
		label: '统一社会信用代码',

		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'enterpriseMailbox',
		label: '企业邮箱',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'enterpriseAddress',
		label: '企业地址',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'enterprisePhone',
		label: '企业电话',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'bankName',
		label: '开户行',
		props: {
			disabled: true,
		},
	},
	{
		control: 'InputPlus',
		key: 'bankNo',
		label: '银行账号',
		props: {
			disabled: true,
		},
	},
	...(financeType.value === 'applyfor'
		? [
				{
					control: 'InputPlus',
					key: 'settleBillRecordId',
					label: '结算单编号',
					props: {
						disabled: true,
					},
				},
				{
					control: 'InputPlus',
					key: 'serviceAmount',
					label: '结算金额',
					props: {
						disabled: true,
					},
				},
		  ]
		: [
				{
					control: 'InputPlus',
					key: 'invoiceNumber',
					label: '发票编号',
					rules: [{ required: true, message: '发票编号不能为空', trigger: 'blur' }],
				},
				{
					control: 'InputPlus',
					key: 'serviceAmount',
					label: '开票金额',
					props: {
						disabled: true,
					},
				},
		  ]),
	{
		control: 'el-select',
		key: 'billingType',
		label: '开票类型',
		options: 'invoice_type',
		rules: [{ required: true, message: '开票类型不能为空', trigger: 'change' }],
	},
	{
		control: 'el-select',
		key: 'invoicingCategories',
		label: '开票类目',
		options: 'invoice_category',
		rules: [{ required: true, message: '开票类目不能为空', trigger: 'change' }],
	},
	...(financeType.value === 'open'
		? [
				{
					control: 'UploadFile',
					key: 'invoiceFiles',
					label: '发票图片',
					column: 24,
					props: {
						type: '60',
					},
					rules: [{ type: 'array', required: true, message: '发票图片不能为空', trigger: 'change' }],
				},
		  ]
		: []),
	{
		slot: true,
		key: 'address',
		column: 24,
	},
	...(financeType.value === 'open'
		? [
				{
					control: 'el-select',
					key: 'postType',
					label: '快递公司',
					options: 'express_company',
					rules: [{ required: true, message: '快递公司不能为空', trigger: 'change' }],
				},
				{
					control: 'InputPlus',
					key: 'postOrderNumber',
					label: '快递单号',
					rules: [{ required: true, message: '快递单号不能为空', trigger: 'blur' }],
				},
		  ]
		: []),
]);

const radioChange = () => {
	if (dialogFormData.value.radioAddress === 1) {
		dialogFormData.value.postAddress = addressInfo.value.postAddress;
		dialogFormData.value.postUsername = addressInfo.value.postUsername;
		dialogFormData.value.postPhone = addressInfo.value.postPhone;
	} else {
		dialogFormData.value.postAddress = '';
		dialogFormData.value.postUsername = '';
		dialogFormData.value.postPhone = '';
	}
};

let dialogFormData = ref({
	id: '',
	radioAddress: 1,
	billNumber: '',
	settleBillRecordId: '',
	postAddress: '',
	postUsername: '',
	postPhone: '',
	invoiceTitle: '',
	merchantName: '',
	serviceAmount: '',
});

let addressInfo = ref({
	postAddress: '',
	postUsername: '',
	postPhone: '',
});
const applyShow = ref(false);

const applyfor = async (id: string, type: string) => {
	financeType.value = type;
	applyShow.value = true;
	dialogFormData.value = (await getObj(id)).data;
	dialogFormData.value.radioAddress = 1;
	dialogFormData.value.serviceAmount = dialogFormData.value.serviceAmount + '元';
	dialogFormData.value.invoiceTitle = dialogFormData.value.merchantName;
	addressInfo.value.postAddress = dialogFormData.value.postAddress;
	addressInfo.value.postUsername = dialogFormData.value.postUsername;
	addressInfo.value.postPhone = dialogFormData.value.postPhone;
};

// 提交
const onSubmit = async (refresh: any) => {
	try {
		financeType.value === 'applyfor' ? await applyInvoice({ ...dialogFormData.value }) : await saveInvoice({ ...dialogFormData.value });
		applyShow.value = false;
		refresh();
	} catch (err: any) {
	} finally {
	}
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
