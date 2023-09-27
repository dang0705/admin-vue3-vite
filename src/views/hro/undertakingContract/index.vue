<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<form-view
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
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakingContract_add'">
						手动上传合同
					</el-button>
					<el-button icon="folder-add" type="primary" v-auth="'hro_undertakingContract_export'" @click="batchElectronicSignRef.openDialog()">
						批量电子签署
					</el-button>
					<right-toolbar v-model:showSearch="showSearch" class="ml10 mr20" style="float: right" @queryTable="getDataList" />
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
				<el-table-column prop="undertakerName" label="姓名" show-overflow-tooltip width="100" />
				<el-table-column prop="undertakerCard" label="证件号码" show-overflow-tooltip width="180" />
				<el-table-column prop="undertakerPhone" label="手机号码" show-overflow-tooltip width="120" />
				<el-table-column prop="contractName" label="合同名称" show-overflow-tooltip width="100" />
				<el-table-column prop="contractNumber" label="签约编号" show-overflow-tooltip width="100" />
				<el-table-column prop="createTime" label="发起签约时间" show-overflow-tooltip width="180" />
				<el-table-column prop="startTime" label="合同开始时间" show-overflow-tooltip width="180" />
				<el-table-column prop="endTime" label="合同结束时间" show-overflow-tooltip width="180" />
				<el-table-column prop="contractEndTime" label="合同终止时间" show-overflow-tooltip width="180" />
				<el-table-column prop="contractType" label="合同类型" show-overflow-tooltip width="100">
					<template #default="{ row: { contractType } }">
						<span v-text="contractTypeMap[contractType]" />
					</template>
				</el-table-column>
				<el-table-column prop="spName" label="签约服务商" show-overflow-tooltip width="100" />
				<el-table-column prop="state" label="签约状态" show-overflow-tooltip width="140">
					<template #default="{ row: { state } }"><span v-text="contractStatusMap[state]" /></template>
				</el-table-column>
				<el-table-column label="操作" width="150" fixed="right">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'hro_undertakingContract_view'" @click="formDialogRef.openDialog(scope.row.id)">
							查看
						</el-button>
						<el-button icon="delete" text type="primary" v-auth="'hro_undertakingContract_del'" @click="handleDelete([scope.row.id])">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<uploadExcel
			ref="batchElectronicSignRef"
			guidance="请按照导入模版填写承接人信息，承接人必须在18岁到70岁范围内。"
			main-label="待签署用户名单"
			upload-url="core/undertakerInfo/import"
			temp-url="/files/合同批量签署模板.xlsx"
			template-on-front
			title="添加合同签署"
			:forms="batchElectronicSignForms"
			submitButtonText="下一步"
		/>
	</div>
</template>

<script setup lang="ts" name="systemUndertakingContract">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/hro/undertakingContract';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { FormOptions } from '/@/components/Form-view.vue';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import Array2Object from '/@/utils/array-2-object';

const { t } = useI18n();
const { contract_type } = useDict('contract_type');
const { contract_status } = useDict('contract_status');
const input = 'el-input';
const i18 = (str = '', key = 'label') => ({ [key]: t(`undertakingContract.${str}`) });
// 筛选条件控件与数据
const conditionForms = computed(() => [
	{
		control: input,
		key: 'name',
		...i18('name'),
		props: {
			...i18('inputName', 'placeholder'),
		},
	},
	{
		control: input,
		key: 'undertakerCard',
		...i18('undertakerCard'),
		props: {
			...i18('inputUndertakerCard', 'placeholder'),
		},
	},
	{
		control: input,
		key: 'undertakerPhone',
		...i18('undertakerPhone'),
		props: {
			...i18('undertakerPhone', 'placeholder'),
		},
	},
	{
		control: input,
		key: 'contractNumber',
		...i18('contractNumber'),
		props: {
			...i18('inputContractNumberTip', 'placeholder'),
		},
	},
	{
		control: 'SpSelect',
		key: 'spName',
		label: '签约服务商',
	},
	{
		control: 'el-select',
		key: 'contractType',
		label: '合同类型',
		options: contract_type.value,
	},
]);
// 合同类型枚举
const contractTypeMap = computed(() => Array2Object(contract_type.value));
// 合同状态枚举
const contractStatusMap = computed(() => Array2Object(contract_status.value));

const batchElectronicSignRef = ref();
// 批量电子签署控件与数据
const batchElectronicSignForms = [
	{
		control: 'SpSelect',
		label: '服务商',
		key: 'spId ',
		rules: [
			{
				required: true,
			},
		],
	},
	{
		control: 'el-select',
		label: '合同模板',
		key: 'contractTemplate',
		options: 'contract_template',
		rules: [
			{
				required: true,
			},
		],
	},
];
// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	// 清空多选
	selectObjs.value = [];
	state.queryForm = {};
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/hro/undertakingContract/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakingContract.xlsx');
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
</script>
