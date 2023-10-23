<template>
	<Table-view :columns="columns" exportAuth="xxx" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
		<template #actions="{ row }">
			<el-button icon="download" text type="primary" @click="handleBtn(row)"> 下载 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务监管-首页">
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
		label: '姓名',
		'min-width': 180,
	},
	{
		prop: 'xxx2',
		label: '身份证号',
		'min-width': 180,
	},
	{
		prop: 'xxx3',
		label: '签署日期',
		'min-width': 180,
	},
	{
		prop: 'xxx4',
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
		control: 'DateRange',
		key: 'dealTimeRange',
		label: '签署时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'InputPlus',
		key: 'xxx1',
		label: '姓名',
	},
	{
		control: 'InputPlus',
		key: 'xxx2',
		label: '身份证号',
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

<style lang="scss" scoped>
.total_list {
	background: #fafafa;
	display: flex;
	flex: 1;
	// margin-right: 36px;
	padding: 30px 0;
	.total_item {
		width: 33.33%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(0, 0, 0, 0.5);
		min-width: 100px;
	}
	.icon {
		width: 38px;
		height: 37px;
		margin-right: 15px;
	}
	.price_box {
		font-size: 30px;
		text-align: center;
	}
	.price {
		color: rgba(0, 0, 0, 0.8);
		display: inline-block;
	}
	.unit {
		font-size: 14px;
		vertical-align: baseline;
		display: inline-block;
	}
	.info_label {
		font-size: 14px;
	}
}
</style>
