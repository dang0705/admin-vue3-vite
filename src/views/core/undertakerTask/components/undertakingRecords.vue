<template>
	<Table-view
		isTab
		noPadding
		ref="undertakingRecordsRef"
		:columns="columns"
		label-width="130"
		exportAuth="hro_undertakerTask_export"
		:condition-forms="taskId ? conditionForms_task : conditionForms"
		module="core/undertakerTask.ts"
		downBlobFileUrl="/core/undertakerTask/export"
		downBlobFileName="undertakerTask.xlsx"
	>
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" v-auth="'hro_undertakerTask_view'" @click="detailDialogRef.openDialog(row.id)">查看</el-button>
			<el-button
				@click="detailDialogRef.openDialog(row.id, 2)"
				v-if="row.state == 60"
				icon="edit-pen"
				text
				type="primary"
				v-auth="'hro_undertakerTask_review'"
				>验收</el-button
			>
		</template>
		<detail-dialog ref="detailDialogRef" @refresh="getDataList(false)" />
	</Table-view>
</template>

<script setup lang="ts" name="systemUndertakerTask">
const DetailDialog = defineAsyncComponent(() => import('./detailDialog.vue'));
import { fetchList, delObjs } from '/@/api/core/undertakerTask';
const route = useRoute();
const prop = defineProps({
	taskId: {
		type: String,
		default: '',
	},
});
import { useMessage, useMessageBox } from '/@/hooks/message';
import { payChannel } from '/@/configuration/dynamic-control';
const router = useRouter();
const form = reactive({});
import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['undertaking_status', 'yes_no_type'] });
interface BatchUploadRecordPage {
	state: number;
	isBankFourEssentialFactor: number;
	isEffectiveContract: number;
}
// 搜索变量
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
		control: 'InputPlus',
		key: 'undertakerCard',
		label: '承接人证件号码',
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
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '生成时间',
		props: {
			valueType: 'string',
		},
	},
];
const columns = [
	{
		type: 'selection',
		width: '40',
	},
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
		label: '服务商',
		'min-width': 180,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 180,
	},
	{
		prop: 'isEffectiveContract',
		label: '是否存在生效协议',
		'min-width': 180,
		value: ({ isEffectiveContract }: BatchUploadRecordPage) => batchMap.value.yes_no_type[isEffectiveContract],
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
		'min-width': 150,
	},
];

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
	} catch {
		return;
	}
	try {
		await delObjs(ids);
		useMessage().success('删除成功');
		undertakingRecordsRef.value.resetQuery();
	} catch (err: any) {}
};
</script>
