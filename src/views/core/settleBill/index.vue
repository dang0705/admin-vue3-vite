<template>
	<div>
		<NewTable :columns="indexThead" module="core/settleBill.ts" isTab :condition-forms="conditionForms" labelWidth="120px">
			<template #actions="{ row }">
				<el-button icon="view" text type="primary" v-auth="'core_settleBill_view'" @click="view(row)"> 查看 </el-button>
			</template>
			<template #top-bar="{ otherInfo }">
				<el-button style="margin-right: 24px" icon="Upload" type="primary" class="ml10" @click="importBillRef.openDialog()"> 导入结算 </el-button>
				<div class="info_list">
					<div class="info_item" v-for="(item, index) in otherInfo.sumResp" :key="index">{{ item.label }}:{{ item.value }}元</div>
				</div>
			</template>
		</NewTable>
		<!-- 导入结算-->
		<uploadExcel
			ref="importBillRef"
			guidance="在批量结算之前，请确认所有任务承接已完成交付，然后请下载《任务承接明细表模版》，按照参考格式填写并在本页面上传"
			upload-label="导入结算"
			upload-url="core/settleBill/import"
			temp-url="/files/任务承接明细表.xlsx"
			template-on-front
			title="导入结算"
			label-width="178px"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		/>
	</div>
</template>

<script setup lang="ts" name="导入批次">
const ImportBill = defineAsyncComponent(() => import('./components/importBill.vue'));
const router = useRouter();
const importBillRef = ref();

const addUnderTakerForms = [
	{
		control: 'el-input',
		key: 'billName',
		label: '账单名称',
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '结算商户',
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	// {
	// 	control: 'el-select',
	// 	key: 'taskId',
	// 	label: '结算任务',
	// },
	// {
	// 	control: 'el-select',
	// 	key: 'paymentBankId',
	// 	label: '支付通道',
	// },
	// {
	// 	control: 'el-input',
	// 	key: 'platformBankId',
	// 	label: '平台支付通道',
	// },
	{
		control: 'el-radio-group',
		key: 'isSendMsg',
		label: '是否发送结算成功短信',
		options: [
			{
				label: '是',
				value: 1,
			},
			{
				label: '否',
				value: 0,
			},
		],
		rules: [
			{
				required: true,
			},
		],
		value: 1,
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
	router.push({
		path: '/core/settleBill/detail',
		query: {
			id: row.id,
		},
	});
};
</script>

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
</style>
