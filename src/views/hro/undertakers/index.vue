<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<form-view
				ref="queryRef"
				v-show="showSearch"
				v-model="state.queryForm"
				:forms="conditionForms"
				:on-cancel="resetQuery"
				:on-submit="getDataList"
				submit-button-text="查询"
				cancel-button-text="重置"
			/>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="Upload" type="primary" class="ml10" @click="exportExcel"> 批量导出 </el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="batchCardDialogRef.openDialog()"> 批量上传身份证 </el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="bindBankRef.openDialog()"> 批量绑定银行卡 </el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="customersRef.openDialog()"> 发起批量签署 </el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="addUnderTakerRef.openDialog()"> 批量导入承接人 </el-button>
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						添加承接人
					</el-button>
					<!-- <el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'hro_undertakerInfo_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button> -->
					<right-toolbar
						v-model:showSearch="showSearch"
						@exportExcel="exportExcel"
						class="ml10 mr20"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
				@sort-change="sortChangeHandle"
			>
				<!-- <el-table-column type="selection" width="40" align="center" /> -->
				<!-- <el-table-column type="index" label="#" width="40" /> -->
				<el-table-column prop="undertakerName" label="姓名" width="100" show-overflow-tooltip />
				<el-table-column prop="undertakerCard" label="身份证号码" width="200" show-overflow-tooltip />
				<el-table-column prop="undertakerPhone" label="手机号码" width="120" show-overflow-tooltip />
				<el-table-column label="性别" width="60" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ scope.row.undertakerSex == 1 ? '男' : scope.row.undertakerSex == 1 ? '女' : '未知' }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="undertakerAge" label="年龄" width="60" show-overflow-tooltip />
				<el-table-column prop="undertakerEducationName" label="学历" width="60" show-overflow-tooltip />
				<el-table-column prop="bankName" label="开户行" width="150" show-overflow-tooltip />
				<el-table-column prop="bankNumber" label="银行卡号" width="200" show-overflow-tooltip />
				<el-table-column label="服务商" width="150" show-overflow-tooltip>
					<template #default="scope">
						<div v-for="(_, i) in scope.row.spList" :key="i">{{ _.spName }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否签署协议" width="150" show-overflow-tooltip>
					<template #default="scope">
						<div v-for="(_, i) in scope.row.spList" :key="i">{{ _.isSign == 0 ? '否' : '是' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否银行四要素验证" width="160" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ scope.row.isBankFourEssentialFactor == 0 ? '否' : '是' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="395" fixed="right">
					<template #default="scope">
						<el-button icon="view" text type="primary" v-auth="'hro_undertakerInfo_view'" @click="detailDialogRef.openDialog(scope.row.id)"
							>查看</el-button
						>
						<el-button
							icon="folder-add"
							text
							type="primary"
							v-auth="'hro_undertakerInfo_join'"
							@click="editDialogRef.openDialog(scope.row.id, 'addSp')"
							>加入服务商</el-button
						>
						<el-button
							icon="Upload"
							text
							type="primary"
							v-auth="'hro_undertakerInfo_uploadCard'"
							@click="editDialogRef.openDialog(scope.row.id, 'uploadCard')"
							>上传身份证</el-button
						>
						<el-button
							icon="edit-pen"
							text
							type="primary"
							v-auth="'hro_undertakerInfo_edit'"
							@click="editDialogRef.openDialog(scope.row.id, 'editPhone', scope.row.undertakerPhone)"
							>修改手机号码</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<!-- 查看 -->
		<detail-dialog ref="detailDialogRef" @refresh="getDataList(false)" />

		<!-- 加入服务商 上传身份证 修改手机号 -->
		<edit-dialog ref="editDialogRef" @refresh="getDataList(false)" />
		<!-- 批量上传身份证 -->
		<batchCard-dialog ref="batchCardDialogRef" @refresh="getDataList(false)" />

		<!-- 批量签署
		 ids-field:   自定义保存接口的字段名
		 save-method: 自定义保存接口的method
		 watch-field: 监听额外的表单中的某个字段，根据其值刷新列表
		 -->
		<Distribution
			:titles="['未签署承接人', '待签署承接人']"
			:forms="conditionForms2"
			ids-field="undertakerIds"
			ref="customersRef"
			dialog-width="60%"
			list-url="core/undertakerInfo/getUnsignedReceiverInformation"
			save-url="core/undertakingContract/undertakerSignContract"
			save-method="post"
			title="批量签署"
			watch-field="spId"
		>
			<template #contractTimeRange="{ formData }">
				<el-form-item
					label="开始结束日期:"
					prop="contractTimeRange"
					:rules="[{ required: true, trigger: 'change', message: '开始结束日期不能为空' }]"
				>
					<el-date-picker
						type="daterange"
						start-placeholder="请选择开始时间"
						end-placeholder="请选择结束时间"
						value-format="YYYY-MM-DD"
						v-model="formData.contractTimeRange"
					/>
				</el-form-item>
			</template>
		</Distribution>

		<!-- 批量导入承接人-->
		<uploadExcel
			ref="addUnderTakerRef"
			guidance="请按照导入模版填写承接人信息，承接人必须在18岁到70岁范围内。"
			upload-label="待签署用户名单"
			upload-url="core/undertakerInfo/import"
			temp-url="/files/批量导入承接人模板.xlsx"
			template-on-front
			title="批量导入承接人"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		/>

		<!-- 批量绑定银行卡 -->
		<uploadExcel
			ref="bindBankRef"
			guidance="请按照绑定银行卡模版填写信息，填写前请确认相关承接人存在于系统中。"
			upload-label="承接人银行卡信息表"
			upload-url="core/undertakerInfo/importUndertakerBank"
			temp-url="/files/批量绑定银行卡模板.xlsx"
			template-on-front
			formLabelWidth="170"
			title="批量绑定银行卡"
			submitButtonText="下一步"
		/>
	</div>
</template>

<script setup lang="ts" name="承接人名册">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/hro/undertakerInfo';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import FormView from '/@/components/Form-view.vue';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const DetailDialog = defineAsyncComponent(() => import('./detail.vue'));
const EditDialog = defineAsyncComponent(() => import('./edit.vue'));
const batchCardDialog = defineAsyncComponent(() => import('./batchCard.vue'));
const Distribution = defineAsyncComponent(() => import('/@/components/Distribution/index.vue'));
const { t } = useI18n();
const { yes_no_type } = useDict('yes_no_type');
const conditionForms = ref([
	{
		control: 'el-input',
		key: 'undertakerName',
		label: t('undertakerInfo.undertakerName'),
		props: {
			placeholder: t('undertakerInfo.inputUndertakerNameTip'),
		},
	},
	{
		control: 'el-input',
		key: 'undertakerCard',
		label: t('undertakerInfo.undertakerCard'),
		props: {
			placeholder: t('undertakerInfo.inputUndertakerCardTip'),
		},
	},
	{
		control: 'el-input',
		key: 'undertakerPhone',
		label: t('undertakerInfo.undertakerPhone'),
		props: {
			placeholder: t('undertakerInfo.inputUndertakerPhoneTip'),
		},
	},
	{
		control: 'YesOrNo',
		key: 'isAuthentication',
		label: t('undertakerInfo.isAuthentication'),
		props: {
			placeholder: t('undertakerInfo.inputIsAuthenticationTip'),
		},
	},
	{
		control: 'YesOrNo',
		key: 'isSign',
		label: t('undertakerInfo.isSign'),
		props: {
			placeholder: t('undertakerInfo.inputIsSignTip'),
		},
	},
	{
		control: 'SpSelect',
		key: 'spId',
		label: t('undertakerInfo.spName'),
	},
	{
		control: 'MerchantSelect',
		key: 'merchantId',
		label: t('undertakerInfo.merchantName'),
	},
]);
const conditionForms2 = ref([
	{
		control: 'SpSelect',
		key: 'spId',
		label: t('undertakerInfo.spName'),
		rules: [{ required: true, message: '服务商名称不能为空', trigger: 'change' }],
	},
	{
		key: 'contractTimeRange',
		rules: [{ required: true, trigger: 'change' }],
		slot: true,
	},
]);
// 定义查询字典
// 定义变量内容
const formDialogRef = ref();
const detailDialogRef = ref();
const editDialogRef = ref();
const batchCardDialogRef = ref();
const customersRef = ref();

const addUnderTakerRef = ref();
const bindBankRef = ref();

const addUnderTakerForms = [
	{
		control: 'el-radio-group',
		key: 'isInventoryUser',
		label: '是否存量用户',
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
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const spinfoList = ref([]) as array;
const merchantInfoList = ref([]) as array;

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	// 清空搜索条件
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/core/undertakerInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerInfo.xlsx');
};

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm('此操作将永久删除');
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		getDataList();
		useMessage().success('删除成功');
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/*const getUndertakerInfoData = () => {
	// 获取数据
	getSpInfoList().then((res: any) => {
		spinfoList.value = res.data || [];
	});
	getMerchantInfoList().then((res: any) => {
		merchantInfoList.value = res.data || [];
	});
};

getUndertakerInfoData();*/
</script>
