<template>
	<Form-view
		v-show="showSearch"
		label-width="90"
		v-model="state.queryForm"
		submit-button-text="查询"
		cancel-button-text="重置"
		:forms="taskId ? conditionForms_task : conditionForms"
		:on-submit="getDataList"
		:on-cancel="resetQuery"
		auth="hro_undertakerTask_export"
	/>
	<el-row>
		<div class="mb8" style="width: 100%">
			<el-button icon="download" v-auth="'hro_undertakerTask_export'" type="primary" class="ml10" @click="exportExcel"> 批量导出 </el-button>
			<right-toolbar
				v-model:showSearch="showSearch"
				:export="'hro_undertakerTask_export'"
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
		<el-table-column width="120px" prop="undertakerNumber" label="承接编号" show-overflow-tooltip />
		<el-table-column width="120px" prop="undertakerName" label="承接人" show-overflow-tooltip />
		<el-table-column width="170px" prop="createTime" label="生成时间" show-overflow-tooltip />
		<el-table-column width="160px" prop="taskNumber" label="任务编号" show-overflow-tooltip />
		<el-table-column width="160px" prop="undertakerCard" label="承接人证件号码" show-overflow-tooltip />
		<el-table-column width="120px" prop="undertakerPhone" label="承接人手机号" show-overflow-tooltip />
		<el-table-column width="120px" prop="taskName" label="任务名称" show-overflow-tooltip />
		<el-table-column width="120px" prop="taskMoney" label="任务金额(元)" show-overflow-tooltip />
		<el-table-column width="120px" prop="startTime" label="承接开始时间" show-overflow-tooltip />
		<el-table-column width="120px" prop="doneTime" label="承接完成时间" show-overflow-tooltip />
		<el-table-column width="120px" prop="spName" label="服务商名称" show-overflow-tooltip />
		<el-table-column width="120px" prop="merchantName" label="商户名称(商户)" show-overflow-tooltip />
		<el-table-column width="120px" prop="isSign" label="是否签署协议" show-overflow-tooltip>
			<template #default="scope">
				<span v-if="scope.row.isSign == 1">是</span>
				<span v-if="scope.row.isSign == 0">否</span>
			</template>
		</el-table-column>
		<el-table-column width="120px" prop="isBankFourEssentialFactor" label="是否银行四要素校验" show-overflow-tooltip>
			<template #default="scope">
				<span v-if="scope.row.isSign == 1">是</span>
				<span v-if="scope.row.isSign == 0">否</span>
			</template>
		</el-table-column>
		<el-table-column prop="state" label="状态" show-overflow-tooltip>
			<template #default="scope">
				<span>{{ undertaking_status.find((item) => item.value == scope.row.state).label }}</span>
			</template>
		</el-table-column>
		<el-table-column label="操作" width="150" fixed="right">
			<template #default="scope">
				<el-button icon="view" text type="primary" v-auth="'hro_undertakerTask_view'" @click="detailDialogRef.openDialog(scope.row.id)"
					>查看</el-button
				>
				<el-button v-if="scope.row.state == 10" icon="edit-pen" text type="primary" v-auth="'hro_undertakerTask_review'">审核</el-button>
			</template>
		</el-table-column>
	</el-table>
	<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
	<detail-dialog ref="detailDialogRef" @refresh="getDataList(false)" />
</template>

<script setup lang="ts" name="systemUndertakerTask">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/undertakerTask';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

const { undertaking_status } = useDict('undertaking_status');
// 引入组件
// const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const DetailDialog = defineAsyncComponent(() => import('./detailDialog.vue'));
// 定义查询字典
const route = useRoute();

// 定义变量内容
// const formDialogRef = ref();
// 搜索变量
const detailDialogRef = ref();
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const conditionForms_task = [
	{
		control: 'InputPlus',
		key: 'undertakerNumber',
		label: '承接编号',
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '生成时间',
	},
];
const conditionForms = [
	{
		control: 'InputPlus',
		key: 'undertakerNumber',
		label: '承接编号',
	},
	{
		control: 'InputPlus',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '生成时间',
		props: {
			valueType: 'string',
		},
	},
	{
		control: 'InputPlus',
		key: 'taskNumber',
		label: '任务编号',
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
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
];

const prop = defineProps({
	taskId: {
		type: String,
		default: '',
	},
});

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		taskId: route.query.taskId,
	},
	pageList: fetchList,
});
//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {
		taskId: route.query.taskId,
	};
	// 清空搜索条件
	queryRef.value?.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/core/undertakerTask/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerTask.xlsx');
	// downBlobFile('/core/undertakerInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerInfo.xlsx');
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
	} catch (err: any) {}
};
$refreshList(resetQuery);
</script>
