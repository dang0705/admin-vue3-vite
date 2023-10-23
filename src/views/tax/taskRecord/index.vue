<template>
	<Table-view ref="taskRecordRef" :columns="columns" exportAuth="xxx" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
		<template #actions="{ row }">
			<el-button icon="download" text type="primary" @click="handleBtn(row)"> 查看 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务监管-首页">
import { useMessage, useMessageBox } from '/@/hooks/message';
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
import { payChannel } from '/@/configuration/dynamic-control';
const router = useRouter();
const form = reactive({});
const taskRecordRef = ref();
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
		prop: 'xxx',
		label: '任务名称',
		'min-width': 180,
	},

	{
		prop: 'xxx',
		label: '发包单价(元)',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '计量单位',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '承接数量',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '发布时间',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '结束时间',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '审核人',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '审核时间',
		'min-width': 180,
	},
	{
		prop: 'xxx',
		label: '状态',
		'min-width': 180,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 250,
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
		key: 'dealTimeRange',
		label: '发布时间',
		props: {
			valueType: 'string',
		},
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
const handleDetail = (row: any) => {
	router.push({
		path: '/finance/merchantAccountCapital/detail',
		query: {
			id: row.id,
		},
		state: {
			refresh: 1,
		},
	});
};
</script>
