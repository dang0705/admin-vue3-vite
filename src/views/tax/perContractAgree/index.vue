<template>
	<Table-view
		:staticQuery="staticQuery"
		:columns="columns"
		getListFnName="taxUndertakingContract"
		:condition-forms="conditionForms"
		module="tax/index.ts"
	>
		<template #actions="{ row }">
			<el-button icon="download" text type="primary" @click="handleContractFile(row)"> 下载 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务-个人承揽协议">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { payChannel } from '/@/configuration/dynamic-control';
const { proxy } = getCurrentInstance();
const route: any = useRoute();
const router = useRouter();
const form = reactive({});
const columns = [
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	// {
	// 	prop: 'merchantName',
	// 	label: '商户',
	// 	'min-width': 150,
	// },
	{
		prop: 'undertakerName',
		label: '姓名',
		'min-width': 180,
	},
	{
		prop: 'undertakerIdCard',
		label: '身份证号',
		'min-width': 180,
	},
	{
		prop: 'startTime',
		label: '签署日期',
		'min-width': 180,
	},
	{
		prop: 'endTime',
		label: '到期日期',
		'min-width': 180,
	},
	{
		label: '操作',
		prop: 'actions',
		fixed: 'right',
		slot: true,
		'min-width': 90,
	},
];
const staticQuery = computed(() => {
	return {
		spId: route.query.spId,
		merchantId: route.query.merchantId,
	};
});
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
		control: 'DateRange',
		key: 'queryTimeRange',
		label: '签署时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '姓名',
	},
	{
		control: 'InputPlus',
		key: 'undertakerIdCard',
		label: '身份证号',
	},
];
const handleContractFile = (row: any) => {
	window.open(`${proxy.baseURL}/${row.contractFile}`);
};
</script>
