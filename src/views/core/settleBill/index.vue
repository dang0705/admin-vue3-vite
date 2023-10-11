<template>
	<NewTable :columns="indexThead" module="core/settleBill.ts" isTab :condition-forms="conditionForms" labelWidth="120px">
		<template #batchType="{ row: { batchType } }">
			<span v-text="batchMap?.batch_type[batchType]" />
		</template>
		<template #batchState="{ row: { batchState } }">
			<span v-text="batchMap?.batch_status[batchState]" />
		</template>
		<template #actions="{ row: { id, batchType, batchState } }">
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="view({ id, type: batchType, state: batchState })">
				查看
			</el-button>
		</template>
		<template #top-bar="{ otherInfo }">
			<!-- {{ otherInfo.sumResp }} -->
			<div class="info_list">
				<div class="info_item" v-for="(item, index) in otherInfo.sumResp" :key="index">{{ item.label }}:{{ item.value }}元</div>
			</div>
			<!-- 结算总金额: {{state.otherInfo}} 元          任务总金额: {{state.otherInfo.}}元   -->
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
				<NewTable :columns="failListHead" :params="failParams" module="core/settleBill.ts" get-list-fn-name="getFailList" />
			</template>
		</Dialog>
	</NewTable>
</template>

<script setup lang="ts" name="导入批次">
import { getObj } from '/@/api/core/settleBill';
import Array2Object from '/@/utils/array-2-object';
import { downBlobFile } from '/@/utils/other';
// 筛选表单
const conditionForms = [
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		control: 'el-input',
		key: 'id',
		label: '账单编号',
	},
	{
		control: 'el-input',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'taskId',
		label: '任务编号',
	},
	{
		control: 'el-input',
		key: 'channelId',
		label: '支付通道',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '创建人',
	},
	{
		control: 'DateRange',
		key: 'billCreateTimeFromTo',
		label: '账单生成时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'DateRange',
		key: 'billSettleTimeFromTo',
		label: '账单发放时间',
		props: {
			valueType: 'string',
		},
	},
];

// 表头
const indexThead = [
	{
		prop: 'merchantName',
		label: '商户',
		width: 100,
	},
	{
		prop: 'spName',
		label: '服务商',
		width: 100,
	},
	{
		prop: 'id',
		label: '账单编号',
		width: 100,
	},
	{
		prop: 'billName',
		label: '账单名称',
		width: 100,
	},

	{
		prop: 'taskId',
		label: '任务编号',
		width: 160,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		width: 100,
	},
	{
		prop: 'taskAmountTotal',
		label: '任务金额(元)',
		width: 100,
	},
	{
		prop: 'serviceAmountTotal',
		label: '服务费(元)',
		width: 100,
	},
	{
		prop: 'xxx',
		label: '结算总金额(元)',
		width: 100,
	},
	{
		prop: 'taskUndertakerCount',
		label: '任务承接数量',
		width: 100,
	},
	{
		prop: 'createBillUser',
		label: '账单创建人',
		width: 200,
	},
	{
		prop: 'billCreateTime',
		label: '账单生成时间',
		width: 200,
	},
	{
		prop: 'billSettleTime',
		label: '账单发放时间',
		width: 200,
	},
	{
		prop: 'statusDesc',
		label: '状态',
		width: 200,
	},
	{
		prop: 'auditPostscript',
		label: '驳回原因',
		width: 200,
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
					key: 'paramObject.xxx',
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
		default:
			form = [];
	}
	return form;
});
let currentId = ''; // 主键
const currentType = ref(-1); // 批次类型
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

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
</style>
