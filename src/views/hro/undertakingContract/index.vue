<template>
	<div>
		<Table-View
			:columns="columns"
			:condition-forms="conditionForms"
			:actions="actions"
			action-body="合同"
			module="hro/undertakingContract.ts"
			label-width="140"
		>
			<template #top-bar>
				<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakingContract_add'">
					手动上传合同
				</el-button>
				<el-button icon="folder-add" type="primary" v-auth="'hro_undertakingContract_export'" @click="batchElectronicSignRef.openDialog()">
					批量电子签署
				</el-button>
			</template>
			<form-dialog ref="formDialogRef" />
			<uploadExcel
				:forms="batchElectronicSignForms"
				ref="batchElectronicSignRef"
				guidance="请按照导入模版填写承接人信息，承接人必须在18岁到70岁范围内。"
				main-label="待签署用户名单"
				upload-url="core/undertakingContract/contractBatchSigning"
				temp-url="/files/合同批量签署模板.xlsx"
				template-on-front
				title="添加合同签署"
				submitButtonText="下一步"
			/>
		</Table-View>
	</div>
</template>

<script setup lang="ts" name="合同签署">
import { termination } from '/@/api/hro/undertakingContract';
import { useI18n } from 'vue-i18n';
import Array2Object, { valueAsLabel } from '/@/utils/array-2-object';

// 定义查询字典
const contractMap = Array2Object({ dic: ['contract_type', 'contract_status'] });

const { t } = useI18n();
const input = 'el-input';
const columns = [
	{ label: '姓名', prop: 'undertakerName', width: '100' },
	{ label: '证件号码', prop: 'undertakerCard', width: '180' },
	{ label: '手机号码', prop: 'undertakerPhone', width: '120' },
	{ label: '合同名称', prop: 'contractName', width: '200' },
	{ label: '签约编号', prop: 'contractNumber', width: '210' },
	{ label: '发起签约时间', prop: 'createTime', width: '180' },
	{ label: '合同开始时间', prop: 'startTime', width: '180' },
	{ label: '合同结束时间', prop: 'endTime', width: '180' },
	{ label: '合同终止时间', prop: 'contractEndTime', width: '180' },
	{
		label: '合同类型',
		prop: 'contractType',
		width: '100',
		value: ({ contractType }) => contractMap.value.contract_type[contractType],
	},
	{ label: '签约服务商', prop: 'spName', width: '140' },
	{
		label: '签约状态',
		prop: 'state',
		width: '140',
		value: ({ state }) => contractMap.value.contract_status[state],
	},
	{
		label: '操作',
		prop: 'actions',
		slot: true,
		width: '150',
		fixed: 'right',
	},
];

const labelMapping = valueAsLabel(contractMap.value.contract_status);
const actions = ({ id, state, contractFile }: any) => {
	const auth = (auth: string) => `hro_undertakingContract_${auth}`;
	return [
		{
			label: '查看',
			preview: {
				url: contractFile,
			},
			auth: auth('view'),
			show: () => state !== labelMapping['待签署'],
		},
		{
			label: '终止',
			auth: auth('termination'),
			show: () => state !== labelMapping['已终止'],
			confirm: true,
			action: {
				handler: termination,
				params: { id },
			},
		},
		{
			label: '删除',
			auth: auth('del'),
			type: 'delete',
			show: () => ['已终止', '已失效'].includes(contractMap.value.contract_status[state]),
		},
	];
};
const i18 = (str = '', key = 'label') => ({ [key]: t(`undertakingContract.${str}`) });
// 筛选条件控件与数据
const conditionForms = [
	{
		control: input,
		key: 'undertakerName',
		...i18('name'),
	},
	{
		control: input,
		key: 'undertakerCard',
		...i18('undertakerCard'),
	},
	{
		control: input,
		key: 'undertakerPhone',
		...i18('undertakerPhone'),
	},
	{
		control: input,
		key: 'contractNumber',
		...i18('contractNumber'),
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '签约服务商',
	},
	{
		control: 'el-select',
		key: 'contractType',
		label: '合同类型',
		options: 'contract_type',
	},
	{
		control: 'el-select',
		key: 'state',
		label: '合同状态',
		options: 'contract_status',
	},
];
// 合同类型、状态枚举
const batchElectronicSignRef = ref();
// 批量电子签署控件与数据
const batchElectronicSignForms = [
	{
		control: 'SpSelect',
		label: '服务商',
		key: 'spId',
		rules: [
			{
				required: true,
				message: '服务商必填',
			},
		],
	},
	{
		control: 'el-select',
		label: '合同模板',
		key: 'contractTemplate',
		options: 'contract_template', // 此处走字典
		rules: [
			{
				required: true,
				message: '合同模板必填',
			},
		],
	},
];
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义变量内容
const formDialogRef = ref();
</script>
