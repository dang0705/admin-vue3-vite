<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="handleBtn('exam', row)"> 查看 </el-button>
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="handleBtn('toSubmit', row)"> 查看收款账号 </el-button>
		</template>
		<template #top-bar="{ otherInfo }">
			<el-button @click="handleBtn" style="margin-right: 24px" icon="Upload" type="primary" class="ml10"> 批量导出 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="systemMerchantAccountCapital">
import { delObjs, getObj, addObj } from '/@/api/finance/merchantAccountCapital';
import { useMessage, useMessageBox } from '/@/hooks/message';
const columns = [
	{
		prop: 'id',
		label: '资金账户',
		'min-width': 150,
	},
	{
		prop: 'spName',
		label: '服务商',
		'min-width': 150,
	},
	{
		prop: 'bankAccountNumber',
		label: '银行账号',
		'min-width': 150,
	},
	{
		prop: 'paymentBankName',
		label: '支付通道',
		'min-width': 150,
	},
	{
		prop: 'merchantName',
		label: '商户',
		'min-width': 150,
	},
	{
		prop: 'balance',
		label: '实时余额(元)',
		'min-width': 150,
	},
	{
		prop: 'statusDesc',
		label: '是否可用',
		'min-width': 150,
	},
	{
		prop: 'updateTime',
		label: '更新时间',
		'min-width': 150,
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
		control: 'el-input',
		key: 'undertakerName',
		label: '资金账户',
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
		control: 'el-select',
		key: 'xxx',
		label: '支付通道',
	},
];
const handleBtn = () => {
	useMessage().wraning('功能正在开发, 请等待~');
};
</script>
