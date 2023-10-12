<template>
	<NewTable :columns="indexThead" module="core/settleBill.ts" isTab :condition-forms="conditionForms" labelWidth="120px">
		<template #tableTop="{ otherInfo }">
			<Form-view :otherInfo="otherInfo" class="mt-1" label-width="130px" disabled :showBtn="false" v-model="form" :forms="topInfoForms" />
		</template>
		<template #actions="{ row }">
			<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="view(row)"> 查看 </el-button>
		</template>
		<template #top-bar="{ otherInfo }">
			<div class="info_list">
				<div class="info_item" v-for="(item, index) in otherInfo.sumResp" :key="index">{{ item.label }}:{{ item.value }}元</div>
			</div>
		</template>
	</NewTable>
</template>

<script setup lang="ts" name="导入批次">
import { getObj, addObj, putObj } from '/@/api/core/settleBill';
const route: any = useRoute();
// 定义变量内容
const router = useRouter();
const loading = ref(false);
// 提交表单数据
const form = reactive({});
const topInfoForms = [
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '账单编号',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '账单名称',
	},
	{
		control: 'el-input',
		key: 'id',
		label: '服务商',
	},
	{
		control: 'el-input',
		key: 'billName',
		label: '客户',
	},
	{
		control: 'el-input',
		key: 'taskNum',
		label: '任务编号',
	},
	{
		control: 'el-input',
		key: 'channelId',
		label: '任务名称',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '任务承接数量',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '支付通道',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '平台支付通道',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '生成时间',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '管理费计算方式',
	},
	{
		control: 'el-input',
		key: 'createBillUser',
		label: '创建人',
	},
];
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
		key: 'taskNum',
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
		width: 150,
	},
	{
		prop: 'serviceAmountTotal',
		label: '服务费(元)',
		width: 150,
	},
	{
		prop: 'xxx',
		label: '结算总金额(元)',
		width: 150,
	},
	{
		prop: 'taskUndertakerCount',
		label: '任务承接数量',
		width: 150,
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
const view = (row: any) => {
	console.log(1111, row);
	router.push({
		path: '/core/settleBill/detail',
		query: {
			id: row.id,
		},
	});
};

// 初始化表单数据
const getmerchantInfoData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};
if (route.query.id) {
	getmerchantInfoData(route.query.id);
}
</script>

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
</style>
