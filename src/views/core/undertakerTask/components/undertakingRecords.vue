<template>
	<Table-view
		ref="undertakingRecordsRef"
		:columns="columns"
		exportAuth="hro_undertakerTask_export"
		:condition-forms="route.query.taskId ? conditionForms_task : conditionForms"
		:params="params"
		module="core/undertakerTask.ts"
	>
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" v-auth="'hro_undertakerTask_view'" @click="detailDialogRef.openDialog(row.id)">查看</el-button>
			<el-button @click="handleBtn" v-if="row.state == 10" icon="edit-pen" text type="primary" v-auth="'hro_undertakerTask_review'">审核</el-button>
		</template>
		<detail-dialog ref="detailDialogRef" @refresh="refreshDataList" />
	</Table-view>
</template>

<script setup lang="ts" name="承接记录">
import { useMessage, useMessageBox } from '/@/hooks/message';
const route = useRoute();
import Array2Object from '/@/utils/array-2-object';
interface BatchUploadRecordPage {
	state: string;
	isSign: string;
	isBankFourEssentialFactor: string;
}
const params = {
	taskId: route.query.taskId,
};
const batchMap = Array2Object({ dic: ['undertaking_status', 'yes_no_type'] });
const DetailDialog = defineAsyncComponent(() => import('./detailDialog.vue'));
const detailDialogRef = ref();
const undertakingRecordsRef = ref();
const conditionForms_task = [
	{
		control: 'InputPlus',
		key: 'undertakerNumber',
		label: '承接编号',
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '生成时间',
	},
];
const conditionForms = [
	{
		control: 'InputPlus',
		key: 'undertakerNumber',
		label: '承接编号',
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '生成时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'InputPlus',
		key: 'taskNumber',
		label: '任务编号',
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
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
];
const columns = [
	{
		prop: 'undertakerNumber',
		label: '承接编号',
		'min-width': 150,
	},
	{
		prop: 'undertakerName',
		label: '承接人',
		'min-width': 150,
	},
	{
		prop: 'createTime',
		label: '生成时间',
		'min-width': 180,
	},
	{
		prop: 'taskNumber',
		label: '任务编号',
		'min-width': 180,
	},
	{
		prop: 'undertakerCard',
		label: '承接人证件号码',
		'min-width': 180,
	},
	{
		prop: 'undertakerPhone',
		label: '承接人手机号',
		'min-width': 180,
	},
	{
		prop: 'taskName',
		label: '任务名称',
		'min-width': 180,
	},
	{
		prop: 'taskMoney',
		label: '任务金额(元)',
		'min-width': 180,
	},
	{
		prop: 'startTime',
		label: '承接开始时间',
		'min-width': 180,
	},
	{
		prop: 'doneTime',
		label: '承接完成时间',
		'min-width': 180,
	},
	{
		prop: 'spName',
		label: '服务商名称',
		'min-width': 180,
	},
	{
		prop: 'merchantName',
		label: '商户名称(客户)',
		'min-width': 180,
	},
	{
		prop: 'isSign',
		label: '是否签署协议',
		'min-width': 180,
		value: ({ isSign }: BatchUploadRecordPage) => batchMap.value.yes_no_type[isSign],
	},
	{
		prop: 'isBankFourEssentialFactor',
		label: '是否银行四要素校验',
		'min-width': 180,
		value: ({ isBankFourEssentialFactor }: BatchUploadRecordPage) => batchMap.value.yes_no_type[isBankFourEssentialFactor],
	},
	{
		prop: 'state',
		label: '状态',
		'min-width': 180,
		value: ({ state }: BatchUploadRecordPage) => batchMap.value.undertaking_status[state],
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 100,
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const refreshDataList = () => {
	nextTick(() => {
		undertakingRecordsRef?.value.resetQuery();
	});
};
</script>
