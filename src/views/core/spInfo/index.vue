<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('spInfo.spName')" prop="spName">
						<el-input style="max-width: 180px" v-model="state.queryForm.spName" />
					</el-form-item>
					<el-form-item :label="t('spInfo.status')" class="ml2" prop="status">
						<el-select v-model="state.queryForm.status">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in sp_status"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" formDialogRef icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }} </el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button type="primary" class="ml10" @click="$router.push({ path: '/core/spInfo/add' })" v-auth="'core_spInfo_add'">
						+添加服务商
					</el-button>
					<!-- <el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'core_spInfo_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button> -->
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_spInfo_export'"
						@exportExcel="exportExcel"
						class="ml10"
						style="float: right"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList.filter((v) => v.isPlatform !== '1')"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
				@sort-change="sortChangeHandle"
				style="width: 100%"
			>
				<!-- <el-table-column type="selection" width="100" align="center" /> -->
				<!-- <el-table-column type="index" label="#" width="200" /> -->
				<el-table-column prop="spName" label="服务商名称" width="200" show-overflow-tooltip />
				<el-table-column prop="socialCreditCode" label="社会统一信用代码" width="200" show-overflow-tooltip />
				<el-table-column prop="legalPersonName" label="法人姓名" width="200" show-overflow-tooltip />
				<el-table-column prop="legalPersonMobile" label="法人手机号" width="250" show-overflow-tooltip />
				<el-table-column label="状态" width="200">
					<template #default="scope">
						<div>{{ scope.row.statusDesc }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否开启支付通道" width="300">
					<template #default="scope">
						<div v-if="scope.row.hasPaymentChannel === '1'">是</div>
						<el-button v-else text type="primary" @click="formDialogRef.openDialog(scope.row.id)">否，立即前往开通</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="300" fixed="right">
					<template #default="scope">
						<el-button
							icon="view"
							text
							type="primary"
							v-auth="'core_spInfo_view'"
							@click="$router.push({ path: '/core/spInfo/detail', query: { id: scope.row.id, see: 1 } })"
							>查看</el-button
						>
						<el-button
							icon="edit-pen"
							text
							type="primary"
							v-auth="'core_spInfo_edit'"
							@click="$router.push({ path: '/core/spInfo/edit', query: { id: scope.row.id } })"
							>编辑</el-button
						>
						<el-button
							icon="turn-off"
							text
							type="primary"
							v-auth="'core_spInfo_switchStatus'"
							@click="deactivateShow(scope.row.id, scope.row.spName, scope.row.status)"
							>{{ scope.row.status === '1' ? '停用' : '启用' }}</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<!-- 停用服务商 -->
		<el-dialog v-model="deactivateVisible" title="停用服务商" width="40%">
			<div class="mb-5">您确定要停用服务商"{{ deactivateInfo.spName }}"吗？</div>
			<div>停用后服务商不可再承接新的任务；不可签署新的承接人；不可与商户添加新的服务协议</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="deactivateVisible = false">取消</el-button>
					<el-button type="primary" @click="handleDeactivate()">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemSpInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs, switchStatus } from '/@/api/core/spInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义查询字典
const { sp_status } = useDict('sp_status');

// 定义变量内容
const formDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 停用服务商变量
const deactivateVisible = ref(false);
const deactivateInfo = ref({}) as any;

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
	downBlobFile('/core/spInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'spInfo.xlsx');
};

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 停用操作
const deactivateShow = (id: string, spName: string, status: string) => {
	deactivateInfo.value.id = id;
	deactivateInfo.value.spName = spName;
	deactivateInfo.value.status = status;
	if (status === '1') {
		deactivateVisible.value = true;
	} else {
		handleDeactivate();
	}
};
const clearCache = async () => {
	const { useSpStore } = await import('/@/stores/sp');
	useSpStore().$patch((state) => (state.sp = state.spAll = []));
};
const handleDeactivate = async () => {
	try {
		await switchStatus({
			id: deactivateInfo.value.id,
			status: deactivateInfo.value.status === '1' ? '0' : '1',
		});
		getDataList();
		useMessage().success(deactivateInfo.value.status === '1' ? '停用成功' : '启用成功');
		deactivateVisible.value = false;
		clearCache();
	} catch (err: any) {}
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
		clearCache();
	} catch (err: any) {}
};
</script>
