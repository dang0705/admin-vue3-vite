<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" ref="queryRef">
					<el-form-item :label="$t('spInfo.shName')" prop="shName">
						<el-input :placeholder="$t('spInfo.inputShNameTip')" style="max-width: 180px" v-model="state.queryForm.shName" />
					</el-form-item>
					<el-form-item :label="$t('spInfo.socialCreditCode')" prop="socialCreditCode">
						<el-input :placeholder="$t('spInfo.inputSocialCreditCodeTip')" style="max-width: 180px" v-model="state.queryForm.socialCreditCode" />
					</el-form-item>
					<el-form-item :label="t('spInfo.spName')" class="ml2" prop="spName">
						<el-select :placeholder="t('spInfo.inputSpNameTip')" v-model="state.queryForm.spName">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('spInfo.status')" class="ml2" prop="status">
						<el-select :placeholder="t('spInfo.inputStatusTip')" v-model="state.queryForm.status">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
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
					<el-button type="primary" class="ml10" @click="$router.push({ name: '服务商详情' })" v-auth="'core_spInfo_add'"> +添加商户 </el-button>
					<el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'core_spInfo_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'core_spInfo_export'"
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
				<el-table-column prop="spName" label="服务商名称" show-overflow-tooltip />
				<el-table-column prop="busiType" label="业务类型" show-overflow-tooltip />
				<el-table-column prop="bankNumber" label="银行账户" show-overflow-tooltip />
				<el-table-column prop="bankName" label="开户行" show-overflow-tooltip />
				<el-table-column prop="bankArea" label="开户地" show-overflow-tooltip />
				<el-table-column prop="email" label="企业邮箱" show-overflow-tooltip />
				<el-table-column prop="businessLicense" label="营业执照" show-overflow-tooltip />
				<el-table-column prop="socialCreditCode" label="社会信用代码" show-overflow-tooltip />
				<el-table-column prop="businessScope" label="经营范围" show-overflow-tooltip />
				<el-table-column prop="legalPersonName" label="法人姓名" show-overflow-tooltip />
				<el-table-column prop="legalPersonMobile" label="法人手机号" show-overflow-tooltip />
				<el-table-column prop="legalPersonIdCard" label="法人身份证号" show-overflow-tooltip />
				<el-table-column prop="legalPersonPortrait" label="法人身份证头像面" show-overflow-tooltip />
				<el-table-column prop="legalPersonNationalEmblem" label="法人身份证国徽面" show-overflow-tooltip />
				<el-table-column prop="status" label="状态" show-overflow-tooltip />
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button icon="edit-pen" text type="primary" v-auth="'core_spInfo_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>编辑</el-button
						>
						<el-button icon="delete" text type="primary" v-auth="'core_spInfo_del'" @click="handleDelete([scope.row.id])">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemSpInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/core/spInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
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
	queryForm: {
		systemFlag: '',
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
	downBlobFile('/core/spInfo/export', Object.assign(state.queryForm, { ids: selectObjs }), 'spInfo.xlsx');
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
