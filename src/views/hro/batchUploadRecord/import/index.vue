<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<Form-view
						label-width="90"
						v-model="state.queryForm"
						submit-button-text="查询"
						cancel-button-text="重置"
						:forms="conditionForms"
						:on-submit="getDataList"
						:on-cancel="resetQuery"
					/>
					<right-toolbar v-model:showSearch="showSearch" class="ml10 mr20" style="float: right" @queryTable="getDataList"></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@sort-change="sortChangeHandle"
			>
				<el-table-column prop="batchNumber" label="批次编号" show-overflow-tooltip />
				<el-table-column prop="batchType" label="批次类型" show-overflow-tooltip>
					<template #default="{ row: { batchType } }">
						<span v-text="batchMap?.batch_type[batchType]" />
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip />
				<el-table-column prop="doneTime" label="完成时间" show-overflow-tooltip />
				<el-table-column prop="createBy" label="创建人" show-overflow-tooltip />
				<el-table-column prop="batchState" label="状态" show-overflow-tooltip>
					<template #default="{ row: { batchState } }">
						<span v-text="batchMap?.batch_status[batchState]" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="{ row: { id, batchType, batchState } }">
						<el-button
							icon="view"
							text
							type="primary"
							v-auth="'core_batchUploadRecord_view'"
							@click="view({ id, type: batchType, state: batchState })"
						>
							查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<Dialog v-model="show" disabled title="导入详情" :forms="forms" v-model:form-data="formSecondLevelData" />
	</div>
</template>

<script setup lang="ts" name="导入批次">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/batchUploadRecord';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { getObj } from '/@/api/core/batchUploadRecord';
import Array2Object from '/@/utils/array-2-object';

const conditionForms = [
	{
		control: 'el-select',
		key: 'batchType',
		label: '批次类型',
		options: 'batch_type',
	},
	{
		control: 'DateRange',
		key: 'timeRange',
		label: '创建时间',
	},
	{
		control: 'el-select',
		key: 'batchState',
		label: '状态',
		options: 'batch_status',
	},
	{
		control: 'el-input',
		key: 'createBy',
		label: '创建人',
	},
];
enum Type {
	'批量导入承接人' = 1,
	'批量上传身份证' = 2,
	'批量绑定银行卡' = 3,
	'批量电子签署' = 4,
	'批量指派承接人' = 5,
}

const forms = computed(() => {
	let form = [];
	switch (currentType.value) {
		case Type['批量导入承接人']:
			form = [
				{
					control: 'el-radio',
					label: '是否存量用户',
					key: 'isInventoryUser',
					props: {},
				},
			];
			break;
		default:
			form = [];
	}
	return form;
});
const dialogFormData = reactive({});
const currentId = ref(''); // 主键
const currentType = ref(-1); // 批次类型
const currentState = ref(-1); // 批次状态
const show = ref(false);
let formFirstLevelData = ref({});

const formSecondLevelData = computed(() => formFirstLevelData.value.paramObject);
const view = async ({ id, type, state }) => {
	show.value = true;
	currentId.value = id;
	currentType.value = type;
	currentState.value = state;
	formFirstLevelData.value = (await getObj(id)).data;
};
// 定义查询字典
const batchMap = computed(() => Array2Object({ dic: ['batch_status', 'batch_type'] }).value);

// 搜索变量
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	selectObjs.value = [];
	getDataList();
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
