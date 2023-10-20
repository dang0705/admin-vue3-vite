<template>
	<Table-view
		v-model="selectedRows"
		:columns="columns"
		:condition-forms="conditionForms"
		module="finance/undertakerAgentPaying.ts"
		label-width="150"
		is-tab
		get-full-selection
		down-blob-file-url="/finance/undertakerAgentPaying/export"
		down-blob-file-name="任务支付流水.xlsx"
		export-auth="finance_undertakerAgentPaying_export"
		@get-tab-label="currentTab = $event"
	>
		<template #top-bar="{ refresh, query }" v-if="['支付失败', '待支付'].includes(currentTab)">
			<el-button type="primary" v-auth="`finance_undertakerAgentPaying_pay`" @click="confirmToPay"> 批量支付 </el-button>
			<el-button type="primary" v-auth="`finance_undertakerAgentPaying_pay`" @click="entirelyPay(refresh, query)"> 全部支付 </el-button>
		</template>
		<template #payStatus="{ row: { payStatus } }">
			{{ playStatusMapping['undertaker_agent_paying_pay_status'][payStatus] }}
		</template>
		<template #actions="{ row }">
			<el-button
				v-if="['待支付', '支付失败'].includes(playStatusMapping['undertaker_agent_paying_pay_status'][row.payStatus])"
				v-auth="`finance_undertakerAgentPaying_pay`"
				type="text"
				@click="confirmToPay('pay', row)"
				>支付</el-button
			>
		</template>
		<!--    付款弹框-->
		<Dialog
			vertical
			button-position="center"
			disabled
			v-model="dialog.show"
			v-model:form-data="dialog.data"
			label-width="180"
			:title="dialog.title"
			:show-cancel="false"
			:forms="dialog.forms"
			:columns="24"
			:on-submit="submit"
		/>
	</Table-view>
</template>

<script setup lang="ts" name="任务支付流水">
import { batchPayment, wholePayment } from '/@/api/finance/undertakerAgentPaying';
import Array2Object from '/@/utils/array-2-object';
import isArrayItemSame from '/@/utils/is-array-item-same';
import { useMessageBox } from '/@/hooks/message';
import thousandthDivision from '/@/utils/thousandth-division';
import columns from '/@/views/finance/undertakerAgentPaying/columns';
import conditionForms from '/@/views/finance/undertakerAgentPaying/conditionForms';
// 当前tab选中的中文
const currentTab = ref('');
// 付款弹框
const dialog = ref({
	title: '',
	show: false,
	forms: [] as any,
	data: {},
});
// 选中的表格行
const selectedRows = ref<any[]>([]);
const playStatusMapping = Array2Object({ dic: ['undertaker_agent_paying_pay_status'] });
// 批量支付
const confirmToPay = async (type = 'batch', { id, undertakerName, undertakerCard, undertakerBankName, undertakerBankNumber, paidAmount }: any) => {
	if (type === 'batch') {
		let summary = 0;
		let ids: string[] = [];
		const banks = selectedRows.value.map(({ paymentBankId, paidAmount, id }) => {
			summary += +paidAmount;
			ids.push(id);
			return paymentBankId;
		});
		if (!banks.length) {
			useMessageBox().error('至少选择一个对象');
			return;
		}
		if (!isArrayItemSame(banks)) {
			useMessageBox().error('所选支付渠道须一致');
			return;
		}
		dialog.value = {
			...dialog.value,
			title: '批量支付',
			show: true,
			forms: [
				{ label: '付款开户行', control: 'InputPlus', key: 'sendBankName', value: selectedRows.value[0].sendBankName },
				{ label: '付款银行账号', control: 'InputPlus', key: 'sendAccountNumber', value: selectedRows.value[0].paymentBankId },
				{
					label: '批量支付总金额（元）',
					control: 'InputPlus',
					key: 'paidAmount',
					value: `${thousandthDivision(+summary.toFixed(2))}`,
				},
				{
					label: '批量支付总笔数',
					control: 'InputPlus',
					key: 'totalCount',
					value: selectedRows.value.length,
				},
				{
					hidden: true,
					key: 'undertakerAgentPayingIds',
					value: ids,
				},
			],
		};
	} else {
		dialog.value = {
			...dialog.value,
			title: '支付信息',
			show: true,
			forms: [
				{
					label: '承接人姓名',
					control: 'InputPlus',
					key: 'undertakerName',
					value: undertakerName,
				},
				{
					label: '承接人身份证号',
					control: 'InputPlus',
					key: 'undertakerCard',
					value: undertakerCard,
				},
				{
					label: '承接人开户行',
					control: 'InputPlus',
					key: 'undertakerBankName',
					value: undertakerBankName,
				},
				{
					label: '承接人银行账号',
					control: 'InputPlus',
					key: 'undertakerBankNumber',
					value: undertakerBankNumber,
				},
				{
					label: '批量支付总笔数',
					hidden: true,
					control: 'InputPlus',
					key: 'totalCount',
					value: 1,
				},
				{
					label: '支付金额（元）',
					control: 'InputPlus',
					key: 'paidAmount',
					value: paidAmount,
				},
				{
					hidden: true,
					key: 'undertakerAgentPayingIds',
					value: [id],
				},
			],
		};
	}
};
const submit = async (refresh: Function) => {
	await batchPayment(dialog.value.data);
	refresh();
};
const entirelyPay = async (refresh: Function, data: any) => {
	await wholePayment(data);
	// todo 等tab组件更新
	location.reload();
};
</script>
