<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<!-- <el-row :gutter="24"> -->
					<!-- <el-col :md="8" :sm="24"> -->
					<el-form-item :label="$t('merchantInfo.merchantName')" prop="merchantName">
						<el-input :placeholder="$t('merchantInfo.inputMerchantNameTip')" clearable v-model="state.queryForm.merchantName" />
					</el-form-item>
					<!-- </el-col> -->
					<!-- <el-col :md="8" :sm="24"> -->
					<el-form-item :label="$t('merchantInfo.socialCreditCode')" prop="socialCreditCode">
						<el-input :placeholder="$t('merchantInfo.inputSocialCreditCodeTip')" clearable v-model="state.queryForm.socialCreditCode" />
					</el-form-item>
					<!-- </el-col> -->
					<!-- <el-col :md="8" :sm="24"> -->
					<el-form-item :label="$t('merchantInfo.spList')" prop="spList">
						<el-select :placeholder="$t('merchantInfo.inputSpListTip')" clearable v-model="state.queryForm.spList">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
						</el-select>
					</el-form-item>
					<!-- </el-col> -->
					<!-- <el-col :md="8" :sm="24"> -->
					<el-form-item :label="$t('merchantInfo.status')" prop="status">
						<el-select :placeholder="$t('merchantInfo.inputStatusTip')" clearable v-model="state.queryForm.status">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
						</el-select>
					</el-form-item>
					<!-- </el-col> -->
					<!-- <el-col :md="8" :sm="24"> -->
					<el-form-item>
						<div class="wr100">
							<el-button @click="getDataList" icon="search" type="primary">
								{{ $t('common.queryBtn') }}
							</el-button>
							<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
						</div>
					</el-form-item>
					<!-- </el-col> -->
					<!-- </el-row> -->
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="openMerchantForm('add')" v-auth="'core_merchantInfo_add'">
						新 增
					</el-button>
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
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
				@selection-change="selectionChangHandle"
				@sort-change="sortChangeHandle"
			>
				<el-table-column prop="merchantName" min-width="100" :label="$t('merchantInfo.merchantName')" show-overflow-tooltip />
				<el-table-column prop="socialCreditCode" min-width="140" :label="$t('merchantInfo.socialCreditCode')" show-overflow-tooltip />
				<el-table-column prop="spList" :label="$t('merchantInfo.spList')" show-overflow-tooltip />
				<el-table-column prop="contactName" :label="$t('merchantInfo.contactName')" show-overflow-tooltip />
				<el-table-column prop="contactPhone" min-width="120" :label="$t('merchantInfo.contactPhone')" show-overflow-tooltip />
				<el-table-column prop="createBy" :label="$t('merchantInfo.createBy')" show-overflow-tooltip />
				<el-table-column prop="createTime" min-width="160" :label="$t('merchantInfo.createTime')" show-overflow-tooltip />

				<el-table-column prop="status" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="merchant_status" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="300" fixed="right">
					<template #default="scope">
						<el-button icon="view" @click="openMerchantForm('view', scope.row.id)" size="small" text type="primary"> 查看 </el-button>
						<el-button icon="edit-pen" text type="primary" v-auth="'core_merchantInfo_edit'" @click="openMerchantForm('edit', scope.row.id)"
							>编辑</el-button
						>

						<el-button icon="delete" text type="primary" v-auth="'core_merchantInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
						<!-- <el-button icon="delete" text type="primary" v-auth="'core_merchantInfo_del'" @click="handleDelete([scope.row.id])">启用</el-button> -->
						<!-- <el-button
							icon="turn-off"
							text
							type="primary"
							v-auth="'core_spInfo_del'"
							@click="deactivateShow(scope.row.id, scope.row.spName, scope.row.status)"
							>{{ scope.row.status === '1' ? '停用' : '启用' }}</el-button
						> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

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

<script setup lang="ts" name="systemMerchantInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs, stopObj, getSpInfoList } from '/@/api/core/merchantInfo';
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
const multiple = ref(true);

// 停用服务商变量
const deactivateVisible = ref(false);
const deactivateInfo = ref({}) as any;
const spinfoList = ref([]) as array;

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
const handleDeactivate = async () => {
	try {
		await stopObj({
			id: deactivateInfo.value.id,
			status: deactivateInfo.value.status === '1' ? '0' : '1',
		});
		getDataList();
		useMessage().success(deactivateInfo.value.status === '1' ? '停用成功' : '启用成功');
		deactivateVisible.value = false;
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 新增/编辑/详情
const openMerchantForm = (type: string, id: number) => {
	console.log('id', id);
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
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

const getmerchantInfoData = () => {
	// 获取数据
	getSpInfoList().then((res: any) => {
		spinfoList.value = res.data || [];
	});
};

onMounted(async () => {
	await getmerchantInfoData();
});
</script>
