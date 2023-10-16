<template>
	<TableView :columns="indexThead" module="core/batchUploadRecord.ts" :condition-forms="conditionForms">
		<template #batchType="{ row: { batchType } }">
			<span v-text="batchMap?.batch_type[batchType]" />
		</template>
		<template #batchState="{ row: { batchState } }">
			<span v-text="batchMap?.batch_status[batchState]" />
		</template>
		<template #actions="{ row: { id, batchType, batchState } }">
			<el-button icon="view" text type="primary" v-auth="'core_batchUploadRecord_view'" @click="view({ id, type: batchType, state: batchState })">
				查看
			</el-button>
		</template>
		<Dialog
			vertical
			button-position="center"
			v-model="show"
			disabled
			:title="`【 ${currentTitle} 】 导入详情`"
			v-bind="{ fullscreen: hasFail }"
			:show-cancel="false"
			:label-width="160"
			:forms="forms"
			:columns="24"
			v-model:form-data="dialogFormData"
		>
			<template #status v-if="hasFail">
				<el-form-item label="状态明细：">
					<ul class="flex">
						<li class="mr20">成功 <span v-text="dialogFormData.success" class="text-success" /> 条</li>
						<li>失败 <span v-text="dialogFormData.fail" class="text-error" /> 条</li>
					</ul>
				</el-form-item>
			</template>
			<template #after-forms v-if="hasFail">
				<ul class="flex justify-between">
					<li class="mb-[20px] text-lg font-bold">失败记录表</li>
					<li>
						<el-button @click="exportFile">导出</el-button>
					</li>
				</ul>
				<TableView :columns="failListHead" :params="failParams" module="core/batchUploadRecord.ts" get-list-fn-name="getFailList" />
			</template>
		</Dialog>
	</TableView>
</template>

<script setup lang="ts" name="导入批次">
import { getObj } from '/@/api/core/batchUploadRecord';
import Array2Object from '/@/utils/array-2-object';
import { downBlobFile } from '/@/utils/other';
// 筛选表单
const conditionForms = [
	{
		control: 'el-select',
		key: 'batchType',
		label: '批次类型',
		options: 'batch_type',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '创建时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'el-select',
		key: 'batchState',
		label: '状态',
		options: 'batch_status',
	},
	{
		control: 'el-input',
		key: 'createBy',
		label: '创建人',
	},
];

// 表头
const indexThead = [
	{
		prop: 'batchNumber',
		label: '批次编号',
		width: 200,
	},
	{
		prop: 'batchType',
		label: '批次类型',
		width: 200,
		slot: true,
	},
	{
		prop: 'createTime',
		label: '创建时间',
		width: 200,
	},
	{
		prop: 'doneTime',
		label: '完成时间',
		width: 200,
	},
	{
		prop: 'createBy',
		label: '创建人',
		width: 160,
	},
	{
		prop: 'batchState',
		label: '状态',
		width: 120,
		slot: true,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
	},
];

enum Type {
	'批量导入承接人' = '1',
	'批量上传身份证' = '2',
	'批量绑定银行卡' = '3',
	'批量电子签署' = '4',
	'批量指派承接人' = '5',
	'批量导入结算' = '6',
}

enum State {
	'进行中' = '101',
	'全部成功' = '102',
	'部分成功' = '103',
	'全部失败' = '104',
}

const failListHead = ref<any[]>([]);
const failFormStatic = [
	{
		title: '导入结果',
		control: 'el-select',
		label: '状态',
		key: 'batchState',
		options: 'batch_status',
	},
	{
		key: 'status',
		slot: true,
	},
];
const failListHeadStatic = [
	{
		prop: 'errorMessage',
		label: '失败原因',
	},
];
const forms = computed(() => {
	let form: any[];
	switch (currentType.value) {
		case Type['批量导入承接人']:
			currentTitle.value = '批量导入承接人';
			form = [
				{
					control: 'el-select',
					label: '是否存量用户',
					key: 'paramObject.isInventoryUser',
					title: '参数信息',
					options: [
						{
							label: '是',
							value: 1,
						},
						{
							label: '否',
							value: 0,
						},
					],
				},
				{
					control: 'DownloadFile',
					label: '任务承接明细表',
					key: 'paramObject.fileUrl',
					props: {
						text: '承接人信息表.xlsx',
					},
				},
				...failFormStatic,
			];
			failListHead.value = [
				{
					prop: 'undertakerName',
					label: '姓名',
				},
				{
					prop: 'undertakerCard',
					label: '身份证号',
				},
				{
					prop: 'undertakerPhone',
					label: '手机号',
				},
				...failListHeadStatic,
			];
			break;
		case Type['批量绑定银行卡']:
			currentTitle.value = '批量绑定银行卡';
			form = [
				{
					control: 'DownloadFile',
					label: '任务人银行卡信息表',
					key: 'paramObject.fileUrl',
					props: {
						text: '承接人银行卡号.xlsx',
					},
				},
				...failFormStatic,
			];
			failListHead.value = [
				{
					prop: 'undertakerName',
					label: '姓名',
				},
				{
					prop: 'undertakerCard',
					label: '身份证号',
				},
				{
					prop: 'undertakerCard',
					label: '银行卡号码',
				},
				{
					prop: 'undertakerCard',
					label: '开户行',
				},
				...failListHeadStatic,
			];
			break;
		case Type['批量电子签署']:
			currentTitle.value = '批量电子签署';
			form = [
				{
					control: 'SpSelect',
					label: '服务商',
					key: 'paramObject.spId',
				},
				{
					control: 'el-select',
					label: '合同模板',
					key: 'paramObject.contractTemplate',
					options: 'contract_template', // 此处走字典
				},
				...failFormStatic,
			];
			failListHead.value = [
				{
					prop: 'undertakerName',
					label: '姓名',
				},
				{
					prop: 'undertakerCard',
					label: '身份证号',
				},
				{
					prop: 'startTime',
					label: '合同开始时间',
				},
				{
					prop: 'endTime',
					label: '合同结束时间',
				},
				...failListHeadStatic,
			];
			break;
		case Type['批量指派承接人']:
			currentTitle.value = '批量指派承接人';
			form = [
				{
					title: '参数信息',
					label: '任务编码',
					key: 'paramObject.taskNumber',
					control: 'el-input',
				},
				{ label: '任务名称', key: 'paramObject.taskName', control: 'el-input' },
				{
					label: '承接人名单',
					key: 'paramObject.fileUrl',
					control: 'DownloadFile',
					props: {
						text: '指派承接人名单.xlsx',
					},
				},
				...failFormStatic,
			];
			failListHead.value = [
				{
					prop: 'undertakerName',
					label: '姓名',
				},
				{
					prop: 'undertakerCard',
					label: '身份证号',
				},
				{
					prop: 'undertakerPhone',
					label: '手机号',
				},
				...failListHeadStatic,
			];
			break;
		case Type['批量导入结算']:
			currentTitle.value = '批量导入结算';
			form = [
				{
					label: '账单名称',
					control: 'el-input',
					key: 'paramObject.billName',
				},
				{
					label: '计算商户',
					control: 'MerchantSelect',
					key: 'paramObject.merchantId',
				},
				{
					label: '服务商',
					control: 'SpSelect',
					key: 'paramObject.spId',
				},
				{
					label: '结算任务',
					control: '',
				},
			];
			break;
		default:
			form = [];
	}
	return form;
});
let currentId = ''; // 主键
const currentType = ref(''); // 批次类型
const currentState = ref(-1); // 批次状态
const currentTitle = ref('');
const show = ref(false);
let dialogFormData = ref({});

const hasFail = computed(() => currentState.value !== State['进行中'] && currentState.value !== State['全部成功']);
let failParams = {};
const view = async ({ id, type, state }) => {
	show.value = true;
	currentId = id;
	currentType.value = type;
	currentState.value = state;
	dialogFormData.value = (await getObj(id)).data;
	failParams = { batchId: currentId };
};

// 定义查询字典
const batchMap = computed(() => Array2Object({ dic: ['batch_status', 'batch_type'] }).value);

// 搜索变量
// 多选变量

const exportFile = async () => await downBlobFile('/core/batchFailDetails/export', failParams, `${currentTitle.value}-失败记录表.xlsx`);
</script>
