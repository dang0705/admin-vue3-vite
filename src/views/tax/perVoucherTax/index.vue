<template>
	<Table-view :columns="columns" exportAuth="xxx" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
		<template #actions="{ row }">
			<el-button icon="download" text type="primary" @click="handleBtn(row)"> 下载凭证 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务-商户转款凭证">
import { useMessage, useMessageBox } from '/@/hooks/message';
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
		prop: 'xxx',
		label: '任务名称',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '承接人',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '证件号码',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '承揽电子协议',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '发放时间',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '任务金额(元)',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '代扣税款(元)',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '实发金额(元)',
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
		key: 'xxx1',
		label: '承接人',
	},
	{
		control: 'InputPlus',
		key: 'xxx2',
		label: '证件号码',
	},
	{
		control: 'DateRange',
		key: 'dealTimeRange',
		label: '发放时间',
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
