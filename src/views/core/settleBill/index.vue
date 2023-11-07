<template>
	<div>
		<TableView
			:condition-forms="conditionForms"
			:actions="actions"
			:columns="columns"
			action-body="账单"
			module="core/settleBill.ts"
			isTab
			labelWidth="120px"
		>
			<template #top-bar="{ otherInfo }">
				<el-button v-auth="'core_settleBill_add'" style="margin-right: 24px" icon="Upload" type="primary" class="ml10" @click="openDialog()">
					导入结算
				</el-button>
				<div class="info_list">
					<div class="info_item" v-for="(item, index) in otherInfo.sumResp" :key="index">{{ item.label }}:{{ item.value }}元</div>
				</div>
			</template>
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
				:forms="excelForms"
				submitButtonText="下一步"
			>
				<template #merchantId="{ formData }">
					<el-form-item label="结算商户" prop="merchantId" :rules="[{ required: true, message: '结算商户不能为空', trigger: 'blur' }]">
						<el-select @change="getTaskList(formData)" clearable v-model="formData.merchantId">
							<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in formInfo.merchantList" />
						</el-select>
					</el-form-item>
				</template>
				<template #spId="{ formData }">
					<el-form-item label="服务商" prop="spId" :rules="[{ required: true, message: '服务商不能为空', trigger: 'blur' }]">
						<el-select @change="getTaskList(formData), getSpPaymentChannelListData(formData)" clearable v-model="formData.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in formInfo.spinfoList" />
						</el-select>
					</el-form-item>
				</template>
				<template #taskId="{ formData }">
					<el-form-item prop="taskId" label="结算任务" :rules="[{ required: true, message: '结算任务不能为空', trigger: 'blur' }]">
						<el-select placeholder="请选择" class="w100" clearable v-model="formData.taskId">
							<el-option :key="item.taskId" :label="item.taskName" :value="item.taskId" v-for="item in formInfo.taskList" />
						</el-select>
					</el-form-item>
				</template>
				<template #paymentBankId="{ formData }">
					<el-form-item prop="paymentBankId" label="支付通道" :rules="[{ required: true, message: '支付通道不能为空', trigger: 'blur' }]">
						<el-select placeholder="请选择" class="w100" clearable v-model="formData.paymentBankId">
							<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in formInfo.spPaymentChannelList" />
						</el-select>
					</el-form-item>
				</template>
				<template #platformBankId="{ formData }">
					<el-form-item prop="platformBankId" label="平台支付通道" :rules="[{ required: true, message: '平台支付通道不能为空', trigger: 'blur' }]">
						<el-select placeholder="请选择" class="w100" clearable v-model="formData.platformBankId">
							<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in formInfo.spPaymentChannelList1" />
						</el-select>
					</el-form-item>
				</template>
			</uploadExcel>
		</TableView>
	</div>
</template>

<script setup lang="ts" name="结算账单">
import { taskDropList } from '/@/api/core/task';
import { getSpPaymentChannelList } from '/@/api/core/merchantInfo';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';
import conditionForms from './configurations/condition-forms';
import columns from './configurations/columns';
import actions from './configurations/tabel-actions';
import excelForms from './configurations/excel-forms';
const importBillRef = ref();
const { proxy } = getCurrentInstance();
const formInfo = reactive({
	taskList: [],
	spPaymentChannelList: [],
	spPaymentChannelList1: [],
	merchantList: [],
	spinfoList: [],
});

const openDialog = () => {
	formInfo.taskList = [];
	formInfo.spPaymentChannelList = [];
	getMerchantInfoData();
	getSpInfoData();
	getSpPaymentChannelListData1();
	importBillRef.value.openDialog();
};
// 初始化表单数据
const getTaskList = (formData: any) => {
	taskDropList({
		spId: formData.spId,
		merchantId: formData.merchantId,
		waitSettle: 1,
	})
		.then((res: any) => {
			formInfo.taskList = res.data || [];
		})
		.finally(() => {});
};
const getSpPaymentChannelListData = (formData: any) => {
	getSpPaymentChannelList({
		spId: formData.spId,
	}).then((res: any) => {
		formInfo.spPaymentChannelList = res.data || [];
	});
};
const getSpPaymentChannelListData1 = () => {
	getSpPaymentChannelList({
		isPlatform: 1,
	}).then((res: any) => {
		formInfo.spPaymentChannelList1 = res.data || [];
	});
};
// 获取数据
const getMerchantInfoData = () => {
	getMerchantInfoList().then((res: any) => {
		formInfo.merchantList = res.data || [];
	});
};
const getSpInfoData = () => {
	getSpInfoList('').then((res: any) => {
		formInfo.spinfoList = res.data || [];
	});
};
getMerchantInfoData();
getSpInfoData();
</script>

<style lang="scss" scoped>
.info_list {
	display: flex;
	.info_item {
		margin-right: 20px;
	}
}
</style>
