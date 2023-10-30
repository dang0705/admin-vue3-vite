<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<TabView @toggleTab="toggleTab" :tabs="state.countResp"></TabView>
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
				<template #taskTypeFirst="{ form }">
					<el-form-item :prop="form.key" :label="`${form.label}：`" :rules="form.rules">
						<div class="flex items-center">
							<el-select placeholder="一级分类" class="w100" v-model="state.queryForm.taskTypeFirst">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel1_option" />
							</el-select>
							<el-select style="margin-left: 10px" placeholder="二级分类" class="w100" v-model="state.queryForm.taskTypeSecond">
								<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel2_option" />
							</el-select>
						</div>
					</el-form-item>
				</template>
				<!-- <template #taskTypeSecond="{ form }">
					<el-form-item :prop="form.key" :label="`${form.label}：`" :rules="form.rules">
						<el-select placeholder="二级分类" class="w100" v-model="state.queryForm.taskTypeSecond">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel2_option" />
						</el-select>
					</el-form-item>
				</template> -->
			</form-view>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="openTask('add')" v-auth="'core_task_add'"> 新 增 </el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_task_export'"
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
				<el-table-column width="150px" prop="id" label="任务编号" show-overflow-tooltip />
				<el-table-column width="150px" prop="taskName" label="任务名称" show-overflow-tooltip />
				<el-table-column prop="undertakeTypeStr" label="任务承接方式" show-overflow-tooltip />
				<el-table-column min-width="150" prop="taskTypeDesc" label="任务类型" show-overflow-tooltip />
				<!-- taskTypeSecond -->
				<el-table-column width="170px" prop="startTime" label="开始时间" show-overflow-tooltip />
				<el-table-column width="170px" prop="endTime" label="结束时间" show-overflow-tooltip />
				<el-table-column width="120px" prop="spName" label="服务商" show-overflow-tooltip />
				<el-table-column width="120px" prop="merchantName" label="商户" show-overflow-tooltip />
				<el-table-column width="170px" prop="areaDescDatas" label="工作地区" show-overflow-tooltip />
				<!-- <el-table-column prop="city" label="城市" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="county" label="区县" show-overflow-tooltip /> -->
				<el-table-column prop="unitPrice" label="发包单价" show-overflow-tooltip />
				<el-table-column prop="measuringUnitStr" label="计量单位" show-overflow-tooltip />
				<el-table-column prop="userCount" label="需要人数" show-overflow-tooltip />

				<el-table-column prop="statusStr" min-width="100px" label="状态" show-overflow-tooltip />
				<!-- <el-table-column prop="auditStatus" label="审核状态" show-overflow-tooltip />
				<el-table-column prop="serviceContract" label="服务协议" show-overflow-tooltip />
				<el-table-column prop="address" label="工作地址" show-overflow-tooltip />
				<el-table-column prop="count" label="发包数量" show-overflow-tooltip />
				<el-table-column prop="taskDesc" label="任务描述" show-overflow-tooltip />
				<el-table-column prop="clockRequired" label=" 是否要求打卡（0：否，1：是）" show-overflow-tooltip />
				<el-table-column prop="clockRank" label="打卡范围" show-overflow-tooltip />
				<el-table-column prop="signInTime" label="签到时间" show-overflow-tooltip />
				<el-table-column prop="checkOutTime" label="签退时间" show-overflow-tooltip />
				<el-table-column prop="businessMerchant" label="业务联系人" show-overflow-tooltip />
				<el-table-column prop="businessPhone" label="联系人手机号" show-overflow-tooltip /> -->
				<el-table-column label="操作" width="250" fixed="right">
					<template #default="scope">
						<el-button v-auth="'core_task_view'" icon="view" @click="openTask('view', scope.row.id)" text type="primary"> 查看 </el-button>
						<el-button
							v-if="scope.row.status === '10' && scope.row.auditStatus === '10'"
							icon="edit-pen"
							text
							type="primary"
							v-auth="'core_task_edit'"
							@click="openTask('edit', scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="edit-pen" text type="primary" v-auth="'core_task_copy'" @click="openTask('copy', scope.row.id)">克隆</el-button>
						<el-button
							v-if="scope.row.status === '10' && scope.row.auditStatus === '10'"
							icon="edit-pen"
							text
							type="primary"
							v-auth="'core_task_exam'"
							@click="formDialogRef.openDialog(scope.row.id)"
							>审核</el-button
						>
						<el-button
							v-if="scope.row.status == 20"
							icon="edit-pen"
							text
							type="primary"
							v-auth="'core_task_assign'"
							@click="appointRef.openDialog(scope.row)"
							>指派承接人</el-button
						>
						<el-button
							v-if="scope.row.status == 20"
							icon="edit-pen"
							text
							type="primary"
							v-auth="'core_task_batch_assign'"
							@click="batchAddTask(scope.row)"
							>批量指派承接人</el-button
						>
						<el-button
							v-if="scope.row.status === '10' && (scope.row.auditStatus === '10' || scope.row.auditStatus === '30')"
							icon="delete"
							text
							type="primary"
							v-auth="'core_task_del'"
							@click="handleDelete([scope.row.id])"
							>删除</el-button
						>
						<el-button
							v-if="scope.row.status == 20 && scope.row.auditStatus == 20"
							icon="Remove"
							text
							type="primary"
							@click="handleTaskDown(scope.row.id)"
							v-auth="'core_task_xiajia'"
							>下架</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-audit ref="formDialogRef" @refresh="getDataList(true)" />
		<Appoint
			ref="appointRef"
			@refresh="getDataList(true)"
			list-url="/core/undertakerTask/getAssignUndertaker"
			save-url="/core/undertakerTask/determineAssignUndertaker"
		/>

		<!-- 批量指派承接人-->
		<uploadExcel
			ref="addUnderTakerRef"
			guidance="请先确保待指派的承接人已录入系统且已签署任务的承接服务商，然后按照导入模版填写承接人信息。"
			upload-label="待签署用户名单"
			upload-url="core/undertakerTask/batchAppointUndertaker"
			temp-url="/files/批量导入承接人模板.xlsx"
			template-on-front
			:params="params"
			title="批量指派承接人"
			:forms="addUnderTakerForms"
			submitButtonText="下一步"
		/>
	</div>
</template>

<script setup lang="ts" name="任务记录">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs, putAuditTask, taskDown } from '/@/api/core/task';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormAudit = defineAsyncComponent(() => import('./components/audit.vue'));
const Appoint = defineAsyncComponent(() => import('./components/appoint.vue'));
const TabView = defineAsyncComponent(() => import('/@/components/FormTable/Tab-view.vue'));
// 定义查询字典

const conditionForms = [
	{
		control: 'InputPlus',
		key: 'id',
		label: '任务编号',
	},
	{
		control: 'InputPlus',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'InputPlus',
		key: 'taskTypeFirst',
		label: '任务类型',
		slot: true,
	},
	// {
	// 	control: 'InputPlus',
	// 	key: 'taskTypeSecond',
	// 	label: '行业二级',
	// 	slot: true,
	// },
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
	// {
	// 	control: 'status',
	// 	key: 'merchantId',
	// 	label: '状态',
	// },
];
const addUnderTakerRef = ref();

// 定义变量内容
const router = useRouter();
const addUnderTakerForms = [];
// 定义变量内容
const formDialogRef = ref();
const appointRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
const params = ref({});
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	isPage: true,
	props: {
		item: 'list.records',
		totalCount: 'list.total',
	},
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 定义字典
const { task_type } = useDict('task_type');

// 清空搜索条件
const resetQuery = () => {
	state.queryForm = {};
	task_typeLevel_option.task_typeLevel2_option = [];
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/core/task/export', Object.assign(state.queryForm, { ids: selectObjs }), 'task.xlsx');
};

const batchAddTask = (row: any) => {
	params.value.taskId = row.id;
	addUnderTakerRef.value.openDialog(row);
};

// 新增/编辑/详情
const openTask = (type: string, id: number) => {
	switch (type) {
		case 'view':
			router.push({
				path: '/core/task/detail',
				query: {
					taskId: id,
				},
				state: {
					refresh: 1,
				},
			});
			break;
		case 'edit':
			router.push({
				path: '/core/task/edit',
				query: {
					taskId: id,
				},
				state: {
					refresh: 1,
				},
			});
			break;
		case 'add':
			router.push({
				path: '/core/task/add',
				state: {
					refresh: 1,
				},
			});
			break;
		case 'copy':
			router.push({
				path: '/core/task/copy',
				query: {
					taskId: id,
					copy: 1,
				},
				state: {
					refresh: 1,
				},
			});
			break;
	}
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
const handleTaskDown = async (id: string) => {
	try {
		await useMessageBox().confirm('您确定将下架该任务吗？');
	} catch {
		return;
	}

	try {
		await taskDown(id);
		getDataList();
		useMessage().success('下架任务成功');
	} catch (err: any) {}
};

const toggleTab = (item: any) => {
	let pro = item.attributeName;
	Object.assign(state.queryForm, { [pro]: item.attributeVal });
	getDataList();
};

const task_typeLevel_option = computed(() => {
	let task_typeLevel_option = {
		task_typeLevel1_option: [],
		task_typeLevel2_option: [],
	};
	state.queryForm.taskTypeSecond = '';
	task_type.value.forEach((item: object) => {
		if (!item.parentValue) {
			task_typeLevel_option.task_typeLevel1_option.push(item);
		}
		if (state.queryForm.taskTypeFirst == item.parentValue && state.queryForm.taskTypeFirst) {
			task_typeLevel_option.task_typeLevel2_option.push(item);
		}
	});
	return task_typeLevel_option;
});
$refreshList(resetQuery);
</script>
