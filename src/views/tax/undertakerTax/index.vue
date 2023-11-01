<template>
	<Table-view
		:staticQuery="staticQuery"
		isTab
		:columns="columns"
		getListFnName="taxUndertakerTask"
		:condition-forms="conditionForms"
		module="tax/index.ts"
	>
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务-承接记录">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { payChannel } from '/@/configuration/dynamic-control';
const route: any = useRoute();
const router = useRouter();
const form = reactive({});

const staticQuery = computed(() => {
	return {
		spId: route.query.spId,
		merchantId: route.query.merchantId,
	};
});
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
		prop: 'undertakerName',
		label: '承接人',
		'min-width': 180,
	},
	{
		prop: 'undertakerCard',
		label: '证件号码',
		'min-width': 180,
	},
	{
		prop: 'contractName',
		label: '承揽电子协议',
		'min-width': 180,
	},
	{
		prop: 'taskMoney',
		label: '任务金额(元)',
		'min-width': 180,
	},
	{
		prop: 'startTime',
		label: '开始日期',
		'min-width': 180,
	},
	{
		prop: 'doneTime',
		label: '完成日期',
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
		value: route.query.spId,
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '商户',
		value: route.query.merchantId,
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'InputPlus',
		key: 'undertakerCard',
		label: '证件号码',
	},
	{
		control: 'DateRange',
		key: 'queryTimeRange',
		label: '开始时间',
		props: {
			valueType: 'string',
		},
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
</script>
