<template>
	<form-view
		ref="queryRef"
		v-show="showSearch"
		v-model="state.queryForm"
		:forms="conditionForms"
		:on-cancel="resetQuery"
		:on-submit="getDataList"
		submit-button-text="查询"
		cancel-button-text="重置"
	>
	</form-view>
	<el-row>
		<div class="mb8" style="width: 100%">
			<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerTask_add'">
				新 增
			</el-button>
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
		<el-table-column prop="undertakerNumber" label="承接编号" show-overflow-tooltip />
		<el-table-column prop="undertakerName" label="承接人" show-overflow-tooltip />
		<el-table-column prop="createTime" label="生成时间" show-overflow-tooltip />
		<el-table-column prop="taskNumber" label="任务编号" show-overflow-tooltip />
		<el-table-column prop="undertakerCard" label="承接人证件号码" show-overflow-tooltip />
		<el-table-column prop="undertakerPhone" label="承接人手机号" show-overflow-tooltip />
		<el-table-column prop="taskName" label="任务名称" show-overflow-tooltip />
		<el-table-column prop="estimatedTaskAmount" label="预计任务金额(元)" show-overflow-tooltip />
		<el-table-column prop="taskMoney" label="任务金额(元)" show-overflow-tooltip />
		<el-table-column prop="startTime" label="承接开始时间" show-overflow-tooltip />
		<el-table-column prop="doneTime" label="承接完成时间" show-overflow-tooltip />
		<el-table-column prop="spName" label="服务商名称" show-overflow-tooltip />
		<el-table-column prop="merchantName" label="商户名称(客户)" show-overflow-tooltip />
		<el-table-column prop="isSign" label="是否签署协议" show-overflow-tooltip>
			<template #default="scope">
				<span v-if="scope.row.isSign == 1">是</span>
				<span v-if="scope.row.isSign == 0">否</span>
			</template>
		</el-table-column>
		<el-table-column prop="isBankFourEssentialFactor" label="是否银行四要素校验" show-overflow-tooltip>
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
		<el-table-column label="操作" width="250" fixed="right">
			<template #default="scope">
				<el-button icon="edit-pen" text type="primary" v-auth="'hro_undertakerTask_edit'" @click="formDialogRef.openDialog(scope.row.id)"
					>编辑</el-button
				>
				<el-button icon="delete" text type="primary" v-auth="'hro_undertakerTask_del'" @click="handleDelete([scope.row.id])">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
</template>

<script setup lang="ts" name="systemUndertakerTask">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/undertakerTask';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

const { undertaking_status } = useDict('undertaking_status');

// 引入组件
// const FormDialog = defineAsyncComponent(() => import('./form.vue'));
// 定义查询字典

// 定义变量内容
// const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const conditionForms = [
	{
		control: 'el-input',
		key: 'undertakerNumber',
		label: '承接编号',
	},
	{
		control: 'el-input',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'el-date-picker',
		key: 'createTime',
		label: '生成时间',
	},
];

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
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/core/undertakerTask/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerTask.xlsx');
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
</script>
