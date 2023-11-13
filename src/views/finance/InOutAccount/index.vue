<template>
	<TableView
		ref="InOutAccountRef"
		:columns="columns"
		:module="tabType == 1 ? 'finance/merchantRecharge.ts' : 'finance/merchantRefund.ts'"
		:condition-forms="conditionForms"
		:actions="actions"
		labelWidth="120px"
		:exportAuth="tabType == 1 ? 'finance_merchantRecharge_export' : 'finance_merchantRefund_export'"
	>
		<!-- <template #tableTop>
			<TabView style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></TabView>
		</template> -->
		<!-- <template #top-bar="{ otherInfo }">
			<el-button
				v-auth="'finance_waterSpPaymentBank_import'"
				@click="inOutAccountAddFormsRef.openDialog()"
				style="margin-right: 24px"
				icon="Upload"
				type="primary"
			>
				批量导入银行交易流水
			</el-button>
		</template> -->
		<uploadExcel
			@refreshDataList="refreshDataList"
			ref="inOutAccountAddFormsRef"
			guidance="请按照导入模版填写银行交易流水，确保信息正确且无遗漏。"
			upload-label="批量导入银行交易流水"
			upload-url="core/excel/importWaterSpPaymentBank"
			temp-url="/files/银行交易流水模版.xlsx"
			template-on-front
			title="批量导入银行交易流水"
			:forms="inOutAccountAddForms"
		/>
	</TableView>
</template>

<script setup lang="ts">
const TabView = defineAsyncComponent(() => import('/@/components/Table-view/Tab-view.vue'));
import { payChannel } from '/@/configuration/dynamic-control';
import Array2Object from '/@/utils/array-2-object';
import columns from './configurations/columns';
import conditionForms from './configurations/condition-forms';
import actions from './configurations/tabel-actions';
interface BatchUploadRecordPage {
	status: string;
}
const batchMap = Array2Object({ dic: ['merchant_recharge_status'] });
const inOutAccountAddFormsRef = ref();
const tabType = ref(1);
const InOutAccountRef = ref();
const inOutAccountAddForms = [
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
		props: {
			platform: true,
		},
		rules: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	},
	payChannel({ key: 'channelId', rules: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }] }),
];

const tabs = ref([
	{
		label: '入账',
		value: '',
		attributeVal: 1,
	},
	{
		label: '出账',
		value: '',
		attributeVal: 2,
	},
]);
const toggleTab = (item: object) => {
	tabType.value = item.attributeVal;
	nextTick(() => {
		InOutAccountRef?.value.resetQuery();
	});
};
const refreshDataList = () => {
	nextTick(() => {
		InOutAccountRef?.value.resetQuery();
	});
};
</script>
<script lang="ts">
export default {
	created() {
		this.$options.name = this.$route.meta.title;
	},
};
</script>
