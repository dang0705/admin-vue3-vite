<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('undertakerInfo.undertakerName')" prop="undertakerName">
						<el-input :placeholder="$t('undertakerInfo.inputUndertakerNameTip')" style="max-width: 180px" v-model="state.queryForm.undertakerName" />
					</el-form-item>
					<el-form-item :label="$t('undertakerInfo.undertakerCard')" prop="undertakerCard">
						<el-input :placeholder="$t('undertakerInfo.inputUndertakerCardTip')" style="max-width: 180px" v-model="state.queryForm.undertakerCard" />
					</el-form-item>
					<el-form-item :label="$t('undertakerInfo.undertakerPhone')" prop="undertakerPhone">
						<el-input
							:placeholder="$t('undertakerInfo.inputUndertakerPhoneTip')"
							style="max-width: 180px"
							v-model="state.queryForm.undertakerPhone"
						/>
					</el-form-item>
					<!-- <el-form-item :label="t('undertakerInfo.isAuthentication')" class="ml2" prop="isAuthentication">
						<el-select :placeholder="t('undertakerInfo.inputIsAuthenticationTip')" v-model="state.queryForm.isAuthentication">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in sp_status"></el-option>
						</el-select>
					</el-form-item> -->
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
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						新 增
					</el-button>
					<el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'hro_undertakerInfo_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'hro_undertakerInfo_export'"
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
				<el-table-column prop="undertakerName" label="姓名" show-overflow-tooltip />
				<el-table-column prop="undertakerCard" label="身份证号码" show-overflow-tooltip />
				<el-table-column prop="undertakerPhone" label="手机号码" show-overflow-tooltip />
				<el-table-column prop="undertakerAddress" label="承接人家庭住址" show-overflow-tooltip />
				<el-table-column prop="undertakerClan" label="承接人 民族 id" show-overflow-tooltip />
				<el-table-column prop="undertakerClanName" label="承接人 民族 名称" show-overflow-tooltip />
				<el-table-column prop="undertakerEducation" label="承接人学历" show-overflow-tooltip />
				<el-table-column prop="undertakerEducationName" label="承接人 学历 名称" show-overflow-tooltip />
				<el-table-column prop="workTime" label="参加工作日期" show-overflow-tooltip />
				<el-table-column prop="undertakerPortrait" label="承接人身份证正面" show-overflow-tooltip />
				<el-table-column prop="undertakerNationalEmblem" label="承接人身份证国徽面" show-overflow-tooltip />
				<el-table-column prop="isAuthentication" label="是否实名认证" show-overflow-tooltip />
				<el-table-column prop="bankNumber" label="银行卡号" show-overflow-tooltip />
				<el-table-column prop="bankName" label="银行名称" show-overflow-tooltip />
				<el-table-column prop="bankAddress" label="银行开户地址" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'hro_undertakerInfo_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="delete" text type="primary" v-auth="'hro_undertakerInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
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
import { fetchList, delObjs } from '/@/api/hro/undertakerInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
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
	downBlobFile('/hro/undertakerInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'undertakerInfo.xlsx');
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