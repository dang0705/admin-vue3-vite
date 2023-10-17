<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/InvoiceNotAppliedFor.ts" labelWidth="100px">
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
		<template #actions="{ row: { id } }">
			<el-button icon="folder-add" text type="primary" @click="applyfor(id)"> 申请开票 </el-button>
			<el-button icon="folder-add" text type="primary"> 开票 </el-button>
		</template>
		<Dialog
			vertical
			button-position="center"
			v-model="applyShow"
			title="申请开票"
			submitButtonText="提交"
			width="80%"
			:label-width="160"
			:forms="forms"
			:columns="12"
			v-model:form-data="dialogFormData"
			:onSubmit="onSubmit"
		>
			<template #address>
				<el-form-item label="邮寄地址:" prop="address">
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
					<el-input v-model="dialogFormData.postAddress" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
				<el-form-item
					label="收件人:"
					prop="recipient"
					:rules="[{ required: dialogFormData.radioAddress === 0, message: '收件人不能为空', trigger: 'blur' }]"
				>
					<el-input v-model="dialogFormData.recipient" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
				<el-form-item
					label="收件人手机号:"
					prop="postPhone"
					:rules="[{ required: dialogFormData.radioAddress === 0, message: '收件人手机号不能为空', trigger: 'blur' }]"
				>
					<el-input v-model="dialogFormData.recipientMobile" :disabled="dialogFormData.radioAddress === 1" />
				</el-form-item>
			</template>
		</Dialog>
	</Table-view>
</template>

<script setup lang="ts" name="未申请发票">
import { getObj, applyInvoice } from '/@/api/finance/InvoiceNotAppliedFor';
const emit = defineEmits(['refresh']);

const columns = [
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
		prop: 'settleBillId',
		label: '账单编号',
		'min-width': 150,
	},
	{
		prop: 'settleBillName',
		label: '账单名称',
		'min-width': 150,
	},
	{
		prop: 'settleBillType',
		label: '结算单类型',
		'min-width': 150,
	},
	{
		prop: 'id',
		label: '结算单编号',
		'min-width': 150,
	},
	{
		prop: 'payTime',
		label: '结算完成时间',
		'min-width': 150,
	},
	{
		prop: 'serviceAmount',
		label: '可开票全额(元)',
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
		label: '充值时间',
		control: 'DateRange',
		key: 'payTime',
		props: {
			valueType: 'string',
		},
	},
	{
		label: '结算单类型',
		control: 'el-select',
		key: 'settleBillType',
		options: 'settle_bill_type',
	},
	{
		label: '账单编号',
		control: 'el-input',
		key: 'settleBillId',
	},
	{
		label: '账单名称',
		control: 'el-input',
		key: 'settleBillName',
	},
];

const forms = ref([
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
		key: 'socialCreditCode',
		label: '统一社会信用代码',

		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'email',
		label: '企业邮箱',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'address',
		label: '企业地址',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'phoneNumber',
		label: '企业电话',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'taxBankName',
		label: '开户行',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'taxBankNumber',
		label: '银行账号',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'id',
		label: '结算单编号',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: 'serviceAmount',
		label: '结算金额',
		props: {
			disabled: true,
		},
	},
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
	{
		slot: true,
		key: 'address',
	},
]);

const radioChange = () => {
	if (dialogFormData.value.radioAddress === 1) {
		dialogFormData.value.postAddress = addressInfo.value.postAddress;
		dialogFormData.value.recipient = addressInfo.value.recipient;
		dialogFormData.value.recipientMobile = addressInfo.value.recipientMobile;
	} else {
		dialogFormData.value.postAddress = '';
		dialogFormData.value.recipient = '';
		dialogFormData.value.recipientMobile = '';
	}
};

let dialogFormData = ref({
	radioAddress: 1,
	settleBillRecordId: '',
	postAddress: '',
	recipient: '',
	recipientMobile: '',
	postUsername: '',
	postPhone: '',
});

let addressInfo = ref({
	postAddress: '',
	recipient: '',
	recipientMobile: '',
});
const applyShow = ref(false);

const applyfor = async (id: string) => {
	applyShow.value = true;
	dialogFormData.value = (await getObj(id)).data;
	dialogFormData.value.radioAddress = 1;
	dialogFormData.value.settleBillRecordId = id;
	addressInfo.value.postAddress = dialogFormData.value.postAddress;
	addressInfo.value.recipient = dialogFormData.value.recipient;
	addressInfo.value.recipientMobile = dialogFormData.value.recipientMobile;
};

// 提交
const onSubmit = async () => {
	try {
		dialogFormData.value.postUsername = addressInfo.value.recipient;
		dialogFormData.value.postPhone = addressInfo.value.recipientMobile;
		await applyInvoice({ ...dialogFormData.value });
		applyShow.value = false;
		emit('refresh');
	} catch (err: any) {
	} finally {
	}
};
</script>
