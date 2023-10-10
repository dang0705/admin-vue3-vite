<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- <el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
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
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'core_spPaymentChannel_add'">
						添加支付通道
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_spPaymentChannel_export'"
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
				<el-table-column prop="channelName" label="支付通道名称" show-overflow-tooltip />
				<el-table-column prop="spName" label="服务商" show-overflow-tooltip />
				<!-- <el-table-column prop="bankName" label="账号类别（银行）" show-overflow-tooltip />
				<el-table-column prop="bankBranch" label="开户行" show-overflow-tooltip />
				<el-table-column prop="bankArea" label="开户地" show-overflow-tooltip />
				<el-table-column prop="interbankNumber" label="联行号" show-overflow-tooltip /> -->
				<el-table-column prop="mainAccount" label="主账号" show-overflow-tooltip />
				<el-table-column prop="bankNameDesc" label="账号类别" show-overflow-tooltip />
				<el-table-column prop="bankBranch" label="开户行" show-overflow-tooltip />
				<el-table-column prop="bankArea" label="开户地" show-overflow-tooltip />
				<el-table-column prop="channelStatusDesc" label="状态" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button v-auth="'core_spPaymentChannel_view'" icon="view" @click="formDialogRef.openDialog(scope.row.id, true)" text type="primary">
							查看
						</el-button>
						<el-button icon="edit-pen" text type="primary" v-auth="'core_spPaymentChannel_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="delete" text type="primary" v-auth="'core_spPaymentChannel_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemSpPaymentChannel">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/spPaymentChannel';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

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
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/core/spPaymentChannel/export', Object.assign(state.queryForm, { ids: selectObjs }), 'spPaymentChannel.xlsx');
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
