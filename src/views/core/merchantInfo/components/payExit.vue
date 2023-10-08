<template>
	<el-row shadow="hover" v-show="showSearch" class="ml10">
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
			<el-form-item :label="$t('merchantInfo.spList')" prop="spList">
				<el-select placeholder="请选择" clearable v-model="state.queryForm.spList">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
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
	</el-row>
	<el-row>
		<div class="mb8" style="width: 100%">
			<!-- <el-button icon="folder-add" type="primary" class="ml10" @click="openMerchantForm('add')" v-auth="'core_merchantInfo_add'">
				{{ $t('merchantInfo.openPayExit') }}
			</el-button> -->
			<right-toolbar
				v-model:showSearch="showSearch"
				:export="'core_merchantInfo_export'"
				@exportExcel="exportExcel"
				class="ml10"
				style="float: right"
				@queryTable="getDataList"
			></right-toolbar>
		</div>
	</el-row>
	<!-- :data="state.dataList" -->
	<el-table
		:data="list"
		v-loading="state.loading"
		border
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
		@selection-change="selectionChangHandle"
		@sort-change="sortChangeHandle"
	>
		<el-table-column prop="subAccount" min-width="100" :label="$t('merchantInfo.subAccount')" show-overflow-tooltip />
		<el-table-column prop="mainAccount" min-width="140" :label="$t('merchantInfo.mainAccount')" show-overflow-tooltip />
		<el-table-column prop="spList" :label="$t('merchantInfo.spList')" show-overflow-tooltip />
		<el-table-column prop="payExit" :label="$t('merchantInfo.payExit')" show-overflow-tooltip />
		<el-table-column prop="status" label="状态" show-overflow-tooltip>
			<template #default="scope">
				<dict-tag :options="merchant_status" :value="scope.row.status"></dict-tag>
			</template>
		</el-table-column>
		<el-table-column label="操作" width="300" fixed="right">
			<template #default="scope">
				<el-button icon="edit-pen" text type="primary" v-auth="'core_merchantInfo_edit'" @click="openMerchantForm('edit', scope.row.id)"
					>编辑</el-button
				>
				<el-button icon="view" @click="openMerchantForm('view', scope.row.id)" size="small" text type="primary">
					{{ $t('common.detailBtn') }}
				</el-button>
				<el-button icon="delete" text type="primary" v-auth="'core_merchantInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
</template>

<script setup lang="ts" name="systemMerchantInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/merchantInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

// 定义变量内容
const router = useRouter();
// 引入组件
// 定义查询字典

const { enterprise_type, tax_type, merchant_status, enterprise_scale } = useDict(
	'enterprise_type',
	'tax_type',
	'merchant_status',
	'enterprise_scale'
);

// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const list = ref([]) as any;
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
	downBlobFile('/core/merchantInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'merchantInfo.xlsx');
};

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 新增/编辑/详情
const openMerchantForm = (type: string, id: number) => {
	switch (type) {
		case 'view':
			router.push({
				path: '/core/merchantInfo/detail',
				query: {
					id,
				},
			});
			break;
		case 'edit':
			router.push({
				path: '/core/merchantInfo/edit',
				query: {
					id,
				},
			});
			break;
		case 'add':
			router.push({
				path: '/core/merchantInfo/add',
			});
			break;
	}
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
