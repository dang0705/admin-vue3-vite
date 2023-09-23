<template>
	<el-row shadow="hover" v-show="showSearch" class="ml10">
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
			<el-form-item :label="$t('merchantInfo.spList')" prop="spList">
				<el-select :placeholder="$t('merchantInfo.inputSelect')" clearable v-model="state.queryForm.spList">
					<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList" />
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('merchantInfo.serviceCalcMethod')" prop="serviceCalcMethod">
				<el-select :placeholder="$t('merchantInfo.inputSelect')" clearable v-model="state.queryForm.serviceCalcMethod">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in calcType" />
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('merchantInfo.isUploadTaskRes')" prop="isUploadTaskRes">
				<el-select :placeholder="$t('merchantInfo.inputSelect')" clearable v-model="state.queryForm.isUploadTaskRes">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in is_need" />
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
			<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'core_merchantServiceAgreement_add'">
				新 增
			</el-button>
			<right-toolbar
				v-model:showSearch="showSearch"
				:export="'core_merchantServiceAgreement_export'"
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
		@sort-change="sortChangeHandle"
	>
		<el-table-column prop="agreementName" min-width="140" label="服务协议名称" show-overflow-tooltip />
		<el-table-column prop="spId" label="服务商" show-overflow-tooltip />
		<!-- <el-table-column prop="serviceManager" label="服务负责人" show-overflow-tooltip /> -->
		<el-table-column prop="feeCalculationMethod" min-width="140" label="服务费计算方式" show-overflow-tooltip />
		<el-table-column prop="xxx" label="服务费率" min-width="100" show-overflow-tooltip />
		<el-table-column prop="isElectronicSignature" min-width="110" label="要求电子签署" show-overflow-tooltip />

		<el-table-column prop="isUploadAchievement" min-width="140" label="要求上传任务成果" show-overflow-tooltip />

		<el-table-column prop="startTime" min-width="100" label="起始时间" show-overflow-tooltip />
		<el-table-column prop="endTime" min-width="100" label="终止时间" show-overflow-tooltip />
		<el-table-column prop="status" min-width="100" label="协议状态" show-overflow-tooltip />
		<el-table-column label="操作" width="300" fixed="right">
			<template #default="scope">
				<el-button icon="edit-pen" text type="primary" v-auth="'core_merchantServiceAgreement_edit'" @click="formDialogRef.openDialog(scope.row.id)"
					>编辑</el-button
				>
				<el-button icon="delete" text type="primary" v-auth="'core_merchantServiceAgreement_del'" @click="handleDelete([scope.row.id])"
					>删除</el-button
				>
			</template>
		</el-table-column>
	</el-table>
	<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
	<!-- 编辑、新增  -->
	<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
</template>

<script setup lang="ts" name="systemMerchantServiceAgreement">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/merchantServiceAgreement';
import { getSpInfoList } from '/@/api/core/merchantInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
const route = useRoute();

const { is_need } = useDict('is_need');

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./spAgree_form.vue'));
// 定义查询字典

// 定义变量内容
const formDialogRef = ref();
const spinfoList = ref([]) as array;
const calcType = ref([
	{
		value: 1,
		label: '服务费 = 任务金额*服务费比例',
	},
	{
		value: 2,
		label: '服务费 = 任务金额/(1-服务费比例)*服务费比例',
	},
]);
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		merchantId: route.query.id,
	},
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
	downBlobFile('/core/merchantServiceAgreement/export', Object.assign(state.queryForm, { ids: selectObjs }), 'merchantServiceAgreement.xlsx');
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

const getmerchantInfoData = () => {
	// 获取数据
	getSpInfoList().then((res: any) => {
		spinfoList.value = res.data || [];
	});
};

getmerchantInfoData();
</script>
