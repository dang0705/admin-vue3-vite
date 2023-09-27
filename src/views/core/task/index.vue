<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="任务编号" prop="id">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.id" />
					</el-form-item>
					<el-form-item label="任务名称" prop="taskName">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.taskName" />
					</el-form-item>
					<el-form-item label="服务商" prop="spId">
						<el-select placeholder="请选择" clearable v-model="state.queryForm.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
						</el-select>
					</el-form-item>
					<el-form-item label="客户 " prop="merchantId">
						<el-select placeholder="请选择" clearable v-model="state.queryForm.merchantId">
							<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in merchantList" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<div class="wr100">
							<el-button @click="getDataList" icon="search" type="primary">
								{{ $t('common.queryBtn') }}
							</el-button>
							<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-row> -->
			<form-view
				v-show="showSearch"
				v-model="state.queryForm"
				:forms="conditionForms"
				:on-cancel="resetQuery"
				:on-submit="getDataList"
				submit-button-text="查询"
				cancel-button-text="重置"
			>
				<template #taskTypeFirst="{ form }">
					<el-form-item :prop="form.key" :label="`${form.label}`" :rules="form.rules">
						<el-select
							:disabled="self_disabled"
							@change="handleTaskTypeLevel1"
							placeholder="一级分类"
							class="w100"
							clearable
							v-model="form.taskTypeFirst"
						>
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel1_option" />
						</el-select>
					</el-form-item>
				</template>
				<template #taskTypeSecond="{ form }">
					<el-form-item :prop="form.key" :label="`${form.label}`" :rules="form.rules">
						<el-select :disabled="self_disabled" placeholder="二级分类" class="w100" clearable v-model="form.taskTypeSecond">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in task_typeLevel_option.task_typeLevel2_option" />
						</el-select>
					</el-form-item>
				</template>
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
				<el-table-column prop="id" label="任务编号" show-overflow-tooltip />
				<el-table-column prop="taskName" label="任务名称" show-overflow-tooltip />
				<el-table-column prop="undertakeType" label="任务承接方式" show-overflow-tooltip />
				<el-table-column prop="taskTypeFirst" label="任务类型" show-overflow-tooltip />
				<!-- taskTypeSecond -->
				<el-table-column prop="startTime" label="开始时间" show-overflow-tooltip />
				<el-table-column prop="endTime" label="结束时间" show-overflow-tooltip />
				<el-table-column prop="spName" label="服务商" show-overflow-tooltip />
				<el-table-column prop="merchantName" label="客户" show-overflow-tooltip />
				<el-table-column prop="province" label="工作地区" show-overflow-tooltip />
				<!-- <el-table-column prop="city" label="城市" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="county" label="区县" show-overflow-tooltip /> -->
				<el-table-column prop="unitPrice" label="发包单价" show-overflow-tooltip />
				<el-table-column prop="measuringUnit" label="计量单位" show-overflow-tooltip />
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
				<el-table-column prop="businessMerchant" label="业务商户" show-overflow-tooltip />
				<el-table-column prop="businessPhone" label="业务商户手机号" show-overflow-tooltip /> -->
				<el-table-column label="操作" width="250" fixed="right">
					<template #default="scope">
						<el-button v-auth="'core_task_view'" icon="view" @click="openTask('view', scope.row.id)" text type="primary"> 查看 </el-button>
						<el-button icon="edit-pen" text type="primary" v-auth="'core_task_edit'" @click="openTask('edit', scope.row.id)">编辑</el-button>
						<el-button icon="edit-pen" text type="primary" v-auth="'core_task_exam'" @click="formDialogRef.openDialog(scope.row.id)">审核</el-button>
						<el-button icon="delete" text type="primary" v-auth="'core_task_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-audit ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemTask">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs, putAuditTask } from '/@/api/core/task';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';

// 引入组件
const FormAudit = defineAsyncComponent(() => import('./components/audit.vue'));
// 定义查询字典

// 定义查询字典
const inputType = {
	control: 'el-input',
	props: {
		placeholder: '请输入',
	},
};
const selectType = {
	control: 'el-select',
	props: {
		placeholder: '请选择',
	},
};

const task_typeLevel_option = reactive({
	task_typeLevel1_option: [],
	task_typeLevel2_option: [],
});

const placeholder = (strForI18n: string) => ({ placeholder: t(strForI18n) });
const conditionForms = [
	{
		...inputType,
		key: 'id',
		label: '任务编号',
	},
	{
		...inputType,
		key: 'taskName',
		label: '任务名称',
	},
	{
		...inputType,
		key: 'taskName',
		label: '任务名称',
	},
	{
		...inputType,
		control: 'el-input',
		key: 'taskTypeFirst',
		label: '行业一级',
		slot: true,
	},
	{
		...inputType,
		control: 'el-input',
		key: 'taskTypeSecond',
		label: '行业一级',
		slot: true,
	},
	{
		...selectType,
		control: 'SpSelect',
		key: 'spId',
		label: '服务商',
	},
	{
		...selectType,
		control: 'MerchantSelect',
		key: 'merchantId',
		label: '服务商',
	},
];

// 定义变量内容
const router = useRouter();

// 定义变量内容
const formDialogRef = ref();
const merchantList = ref([]);
const spinfoList = ref([]);
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

// 定义字典
const { task_type } = useDict('task_type');

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
	downBlobFile('/core/task/export', Object.assign(state.queryForm, { ids: selectObjs }), 'task.xlsx');
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
			});
			break;
		case 'edit':
			router.push({
				path: '/core/task/edit',
				query: {
					taskId: id,
				},
			});
			break;
		case 'add':
			router.push({
				path: '/core/task/add',
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
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 获取数据
getMerchantInfoList().then((res: any) => {
	merchantList.value = res.data || [];
});

// 获取数据
getSpInfoList().then((res: any) => {
	spinfoList.value = res.data || [];
});

task_type.value.forEach((item: object) => {
	if (state.queryForm.taskTypeFirst == item.parentValue) {
		task_typeLevel_option.task_typeLevel1_option.push(item);
		task_typeLevel_option.task_typeLevel2_option.push(item);
	} else if (!item.parentValue) {
		task_typeLevel_option.task_typeLevel1_option.push(item);
	}
});
</script>
