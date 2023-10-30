<template>
	<Table-view :columns="columns" :condition-forms="conditionForms" module="finance/merchantAccountCapital.ts">
		<template #tableTopTwo="{ otherInfo }">
			<div class="total_wrapper">
				<div class="total_list">
					<div class="total_item">
						<div class="info">
							<div class="info_label">发放笔数</div>
							<div class="price_box">
								<div class="price">{{ form.totalAmount }}</div>
								<div class="unit"></div>
							</div>
						</div>
					</div>
					<div class="total_item">
						<div class="info">
							<div class="info_label">发放总额</div>
							<div class="price_box">
								<div class="price">{{ thousandthDivision({ number: form.freeze }) }}</div>
								<div class="unit">元</div>
							</div>
						</div>
					</div>
					<div class="total_item">
						<div class="info">
							<div class="info_label">商户数量</div>
							<div class="price_box">
								<div class="price">{{ form.totalAmount }}</div>
								<div class="unit"></div>
							</div>
						</div>
					</div>
					<div class="total_item">
						<div class="info">
							<div class="info_label">开票总额</div>
							<div class="price_box">
								<div class="price">{{ thousandthDivision({ number: form.balance }) }}</div>
								<div class="unit">元</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template #xxx1>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看商户协议 </el-button>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看个人承揽协议 </el-button>
		</template>
		<template #xxx2>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看任务记录 </el-button>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看承揽记录 </el-button>
		</template>
		<template #xxx3>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 企业转账凭证 </el-button>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 个人结算凭证 </el-button>
		</template>
		<template #xxx4>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看发票 </el-button>
		</template>
		<template #xxx5>
			<el-button icon="view" text type="primary" @click="handleBtn(row)"> 查看完税凭证 </el-button>
		</template>
	</Table-view>
</template>

<script setup lang="ts" name="税务监管-首页">
import { useMessage, useMessageBox } from '/@/hooks/message';
import { payChannel } from '/@/configuration/dynamic-control';
import thousandthDivision from '/@/utils/thousandth-division';
const router = useRouter();
const form = reactive({
	totalAmount: 0,
	freeze: 0,
	balance: 0,
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
		prop: 'socialCreditCode',
		label: '统一信用代码',
		'min-width': 180,
	},
	{
		prop: 'xxx1',
		label: '签约协议',
		'min-width': 275,
		slot: true,
	},
	{
		prop: 'xxx2',
		label: '任务内容',
		'min-width': 250,
		slot: true,
	},
	{
		prop: 'xxx3',
		label: '转账凭证',
		'min-width': 250,
		slot: true,
	},
	{
		prop: 'xxx4',
		label: '发票信息',
		'min-width': 108,
		slot: true,
	},
	{
		prop: 'xxx5',
		label: '完税凭证',
		'min-width': 138,
		slot: true,
	},
	// {
	// 	label: '操作',
	// 	prop: 'actions',
	// 	fixed: 'right',
	// 	slot: true,
	// 	'min-width': 250,
	// },
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
		label: '查询时间',
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
