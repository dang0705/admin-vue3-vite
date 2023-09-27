<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<form-view
				ref="queryRef"
				v-show="showSearch"
				v-model="state.queryForm"
				:forms="conditionForms"
				:on-cancel="resetQuery"
				:on-submit="getDataList"
				submit-button-text="查询"
				cancel-button-text="重置"
			/>
			<!--			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="承接编号" prop="id">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.id" />
					</el-form-item>
					<el-form-item label="承接人" prop="undertakerName">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.undertakerName" />
					</el-form-item>
					&lt;!&ndash; <el-form-item label="生成时间" prop="id">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.taskId" />
					</el-form-item> &ndash;&gt;

					<el-form-item label="任务编号" prop="id">
						<el-input placeholder="请输入" clearable v-model="state.queryForm.taskId" />
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
					&lt;!&ndash; </el-col> &ndash;&gt;
					&lt;!&ndash; </el-row> &ndash;&gt;
				</el-form>
			</el-row>-->
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'core_undertakerInfo_add'">
						新 增
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_undertakerInfo_export'"
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
				<el-table-column prop="id" min-width="160px" label="承接编号" show-overflow-tooltip />
				<el-table-column prop="undertakerName" label="承接人" show-overflow-tooltip />
				<el-table-column prop="xxx" label="生成时间" show-overflow-tooltip />

				<el-table-column prop="undertakerCard" label="承接人身份证号" show-overflow-tooltip />
				<el-table-column prop="undertakerPhone" label="承接人手机号" show-overflow-tooltip />
				<!-- <el-table-column prop="undertakerAddress" label="承接人家庭住址" show-overflow-tooltip /> -->
				<el-table-column prop="taskId" label="任务编号" show-overflow-tooltip />
				<el-table-column prop="taskName" label="任务名称" show-overflow-tooltip />
				<el-table-column prop="xxx" label="任务金额" show-overflow-tooltip />
				<el-table-column prop="xxx" label="承接开始时间" show-overflow-tooltip />
				<el-table-column prop="xxx" label="承接结束时间" show-overflow-tooltip />
				<el-table-column prop="xxx" label="服务商" show-overflow-tooltip />
				<el-table-column prop="xxx" label="商户" show-overflow-tooltip />
				<!-- <el-table-column prop="workTime" label="参加工作日期" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="undertakerPortrait" label="承接人身份证正面" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="undertakerNationalEmblem" label="承接人身份证国徽面" show-overflow-tooltip /> -->
				<el-table-column prop="isAuthentication" label="是否实名认证" show-overflow-tooltip />
				<el-table-column prop="xxx" label="是否签署协议" show-overflow-tooltip />
				<!-- <el-table-column prop="bankNumber" label="银行卡号" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="bankName" label="银行名称" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="bankAddress" label="银行开户地址" show-overflow-tooltip /> -->
				<el-table-column prop="isBankFourEssentialFactor" label="是否验证银行四要素" show-overflow-tooltip />
				<el-table-column prop="xxx" label="状态" show-overflow-tooltip />
				<el-table-column prop="xxx" label="驳回原因" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'core_undertakerInfo_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="delete" text type="primary" v-auth="'core_undertakerInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemUndertakerInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/undertakerInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
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
const placeholder = (strForI18n: string) => ({ placeholder: t(strForI18n) });
const conditionForms = [
	{
		...inputType,
		key: 'id',
		label: '承接编号',
	},
	{
		...inputType,
		key: 'undertakerName',
		label: '承接人',
	},
	{
		...inputType,
		key: 'taskId',
		label: '任务编号',
	},
	{
		...inputType,
		key: 'taskName',
		label: '任务名称',
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
const formDialogRef = ref();
const spinfoList = ref([]);
const merchantList = ref([]);
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
	downBlobFile('/core/undertakerInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerInfo.xlsx');
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
</script>
