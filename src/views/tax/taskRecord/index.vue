<template>
	<Table-view isTab :columns="columns" getListFnName="taxTaskPage" :condition-forms="conditionForms" module="tax/index.ts">
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" @click="handleView(row.taskId)"> 查看 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务-任务记录">
import { useMessage, useMessageBox } from '/@/hooks/message';
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
import { payChannel } from '/@/configuration/dynamic-control';
const router = useRouter();
const form = reactive({});
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
		prop: 'taskName',
		label: '任务名称',
		'min-width': 180,
	},

	{
		prop: 'unitPrice',
		label: '发包单价(元)',
		'min-width': 180,
	},
	{
		prop: 'measuringUnitDesc',
		label: '计量单位',
		'min-width': 180,
	},
	{
		prop: 'count',
		label: '承接数量',
		'min-width': 180,
	},
	{
		prop: 'startTime',
		label: '发布时间',
		'min-width': 180,
	},
	{
		prop: 'endTime',
		label: '结束时间',
		'min-width': 180,
	},
	{
		prop: 'auditUserName',
		label: '审核人',
		'min-width': 180,
	},
	{
		prop: 'auditTime',
		label: '审核时间',
		'min-width': 180,
	},
	{
		prop: 'statusDesc',
		label: '状态',
		'min-width': 180,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 120,
	},
];
const conditionForms = [
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
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'DateRange',
		key: 'queryTimeRange',
		label: '发布时间',
		props: {
			valueType: 'string',
		},
	},
];
const handleView = (taskId: string) => {
	router.push({
		path: '/core/task/detail',
		query: {
			taskId: taskId,
		},
		state: {
			refresh: 1,
		},
	});
};
</script>
