<template>
	<!-- <div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'core_settleBill_add'">
						新 增
					</el-button>
					<el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'core_settleBill_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_settleBill_export'"
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
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" label="#" width="40" />
				<el-table-column prop="billName" label="账单名称" show-overflow-tooltip />
				<el-table-column prop="merchantId" label="结算商户" show-overflow-tooltip />
				<el-table-column prop="merchantName" label="结算商户名称" show-overflow-tooltip />
				<el-table-column prop="spId" label="服务商" show-overflow-tooltip />
				<el-table-column prop="spName" label="服务商名称" show-overflow-tooltip />
				<el-table-column prop="taskId" label="结算任务id" show-overflow-tooltip />
				<el-table-column prop="taskName" label="结算任务名称" show-overflow-tooltip />
				<el-table-column prop="paymentBankId" label="支付通道" show-overflow-tooltip />
				<el-table-column prop="paymentBankName" label="支付通道名称" show-overflow-tooltip />
				<el-table-column prop="serviceContractId" label="服务协议id" show-overflow-tooltip />
				<el-table-column prop="serviceContractName" label="服务协议-名称" show-overflow-tooltip />
				<el-table-column prop="isSendMsg" label="是否发送结算成功短信" show-overflow-tooltip />
				<el-table-column prop="taskUndertakerCount" label="任务承接数量" show-overflow-tooltip />
				<el-table-column prop="status" label="状态" show-overflow-tooltip />
				<el-table-column prop="auditStatus" label="审核状态" show-overflow-tooltip />
				<el-table-column prop="auditPostscript" label="审核说明" show-overflow-tooltip />
				<el-table-column prop="auditUserId" label="审核操作员" show-overflow-tooltip />
				<el-table-column prop="billCreateTime" label="账单生成时间" show-overflow-tooltip />
				<el-table-column prop="billSettleTime" label="账单发放时间" show-overflow-tooltip />
				<el-table-column prop="feeCalculationMethod" label="服务费计算方式" show-overflow-tooltip />
				<el-table-column prop="feeCalculationMethodDesc" label="服务费计算方式-描述" show-overflow-tooltip />
				<el-table-column prop="feeCalculationMethodRate" label="服务费计算比例" show-overflow-tooltip />
				<el-table-column prop="taskAmountTotal" label="任务总金额" show-overflow-tooltip />
				<el-table-column prop="serviceAmountTotal" label="服务费总金额" show-overflow-tooltip />
				<el-table-column prop="billAmountTotal" label="结算总金额" show-overflow-tooltip />
				<el-table-column prop="createBillUser" label="账单创建人" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'core_settleBill_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="delete" text type="primary" v-auth="'core_settleBill_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div> -->
	<NewTable :columns="indexThead" module="core/settleBill.ts" :condition-forms="conditionForms">
		<template #batchType="{ row: { batchType } }">
			<span v-text="batchMap?.batch_type[batchType]" />
		</template>
		<template #batchState="{ row: { batchState } }">
			<span v-text="batchMap?.batch_status[batchState]" />
		</template>
		<template #actions="{ row: { id, batchType, batchState } }">
			<el-button icon="view" text type="primary" v-auth="'core_batchUploadRecord_view'" @click="view({ id, type: batchType, state: batchState })">
				查看
			</el-button>
		</template>
		<Dialog
			vertical
			button-position="center"
			v-model="show"
			disabled
			:title="`【 ${currentTitle} 】 导入详情`"
			v-bind="{ fullscreen: hasFail }"
			:show-cancel="false"
			:label-width="160"
			:forms="forms"
			:columns="24"
			v-model:form-data="dialogFormData"
		>
			<template #status v-if="hasFail">
				<el-form-item label="状态明细：">
					<ul class="flex">
						<li class="mr20">成功 <span v-text="dialogFormData.success" class="text-success" /> 条</li>
						<li>失败 <span v-text="dialogFormData.fail" class="text-error" /> 条</li>
					</ul>
				</el-form-item>
			</template>
			<template #after-forms v-if="hasFail">
				<ul class="flex justify-between">
					<li class="mb-[20px] text-lg font-bold">失败记录表</li>
					<li>
						<el-button @click="exportFile">导出</el-button>
					</li>
				</ul>
				<NewTable :columns="failListHead" :params="failParams" module="core/batchUploadRecord.ts" get-list-fn-name="getFailList" />
			</template>
		</Dialog>
	</NewTable>
</template>

<script setup lang="ts" name="systemSettleBill">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/settleBill';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

console.log(111);

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
	props: {
		item: 'list.records',
		totalCount: 'list.total',
	},
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
	downBlobFile('/core/settleBill/export', Object.assign(state.queryForm, { ids: selectObjs }), 'settleBill.xlsx');
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
