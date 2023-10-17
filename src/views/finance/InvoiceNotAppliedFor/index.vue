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
		>
		</Dialog>
	</Table-view>
</template>

<script setup lang="ts" name="未申请发票">
import { delObjs, getObj, addObj } from '/@/api/finance/InvoiceNotAppliedFor';

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
		options: 'settleBillType',
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
		label: '开票抬头:',
		columns: 24,
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '统一社会信用代码:',

		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '企业邮箱:',

		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '企业地址:',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '企业电话:',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '开户行:',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '银行账号:',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '结算单编号:',
		props: {
			disabled: true,
		},
	},
	{
		control: 'el-input',
		key: '',
		label: '结算金额:',
		props: {
			disabled: true,
		},
	},
]);

let dialogFormData = ref({});
const applyShow = ref(false);

const applyfor = async (id: string) => {
	applyShow.value = true;
	dialogFormData.value = (await getObj(id)).data;
};
</script>
