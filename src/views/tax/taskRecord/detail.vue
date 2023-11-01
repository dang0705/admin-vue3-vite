<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<TabView style="padding-left: 20px" @toggleTab="toggleTab" :tabs="tabs"></TabView>
			<Form-view
				ref="queryRef"
				v-if="tabType == 1"
				v-model="formData"
				:forms="conditionForms"
				:columns="12"
				disabled
				:showBtn="false"
				label-width="130px"
			>
			</Form-view>
			<UndertakerTaxComponents ref="undertakerTaxComponentsRef" v-if="tabType == 2"></UndertakerTaxComponents>
		</div>
	</div>
</template>

<script setup lang="ts" name="税务-任务详情">
import { getObj, addObj, putObj } from '/@/api/core/task';
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
const UndertakerTaxComponents = defineAsyncComponent(() => import('/@/views/tax/undertakerTax/index.vue'));
const route: any = useRoute();
const tabType = ref(1);
const undertakerTaxComponentsRef = ref();
const formData = reactive({});
const tabs = ref([
	{
		label: '任务信息',
		value: '',
		attributeVal: 1,
	},
	{
		label: '承接列表',
		value: '',
		attributeVal: 2,
	},
]);
const conditionForms = ref([
	{
		control: 'SpSelect',
		key: 'merchantId',
		label: '商户',
		title: '基本信息',
	},
	{
		control: 'SpSelect',
		key: 'spName',
		label: '服务商',
	},
	{
		control: 'el-select',
		key: 'serviceContractId',
		label: '服务协议',
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'el-select',
		key: 'taskTypeFirst',
		label: '任务类型',
	},
	{
		control: 'InputPlus',
		key: 'userCount',
		label: '需要人数',
	},
	{
		control: 'InputPlus',
		key: 'areaDescDatas',
		label: '工作地区',
	},
	{
		control: 'InputPlus',
		key: 'address',
		label: '任务地址',
	},
	{
		control: 'InputPlus',
		key: 'startTime',
		label: '工作开始时间',
	},
	{
		control: 'InputPlus',
		key: 'endTime',
		label: '工作结束时间',
	},
	{
		control: 'InputPlus',
		key: 'unitPrice',
		label: '发包单价',
	},
	{
		control: 'InputPlus',
		key: 'count',
		label: '发包数量',
	},
	{
		control: 'InputPlus',
		key: 'measuringUnit',
		label: '计量单位',
	},
	{
		control: 'InputPlus',
		key: 'taskDesc',
		label: '任务描述',
	},
	{
		control: 'InputPlus',
		key: 'businessMerchant',
		label: '业务商户',
	},
	{
		control: 'InputPlus',
		key: 'businessPhone',
		label: '业务商户手机号',
	},
	{
		control: 'InputPlus',
		key: 'taskRequireInfo.requiredSex',
		label: '性别要求',
		title: '承揽要求',
	},
	{
		control: 'InputPlus',
		key: 'askRequireInfo.requiredAgeMin',
		label: '年龄要求',
	},
	{
		control: 'InputPlus',
		key: 'taskRequireInfo.educational',
		label: '学历要求',
	},
	{
		control: 'InputPlus',
		key: 'taskRequireInfo.experience',
		label: '经验要求',
	},
	{
		control: 'InputPlus',
		key: 'taskRequireInfo.workFare',
		label: '项目福利',
	},
	{
		control: 'UploadFile',
		key: 'taskRequireInfo.workEnvironment',
		label: '服务环境',
	},
]);
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
		slot: true,
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
const toggleTab = (item: any) => {
	tabType.value = item.attributeVal;
};
// 初始化表单数据
const gettaskData = () => {
	getObj(route.query.taskId)
		.then((res: any) => {
			Object.assign(formData, res.data);
		})
		.finally(() => {});
};
onMounted(() => {
	gettaskData();
});
</script>
