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
					<el-form-item :label="t('undertakerInfo.isAuthentication')" class="ml2" prop="isAuthentication">
						<el-select :placeholder="t('undertakerInfo.inputIsAuthenticationTip')" v-model="state.queryForm.isAuthentication">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in yes_no_type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('undertakerInfo.isSign')" class="ml2" prop="isSign">
						<el-select :placeholder="t('undertakerInfo.inputIsSignTip')" v-model="state.queryForm.isSign">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in yes_no_type"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('undertakerInfo.spName')" class="ml2" prop="spId">
						<el-select :placeholder="t('undertakerInfo.inputSpNameTip')" v-model="state.queryForm.spId">
							<el-option :key="item.id" :label="item.spName" :value="item.id" v-for="item in spinfoList"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="t('undertakerInfo.merchantName')" class="ml2" prop="merchantId">
						<el-select :placeholder="t('undertakerInfo.inputMerchantNameTip')" v-model="state.queryForm.merchantId">
							<el-option :key="item.id" :label="item.merchantName" :value="item.id" v-for="item in merchantInfoList"></el-option>
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
					<el-button icon="Upload" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						批量导出
					</el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						批量上传身份证
					</el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						批量绑定银行卡
					</el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						发起批量批量签署
					</el-button>
					<el-button icon="Upload" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						批量导入承接人
					</el-button>
					<el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()" v-auth="'hro_undertakerInfo_add'">
						添加承接人
					</el-button>
					<!-- <el-button plain :disabled="multiple" icon="Delete" type="primary" v-auth="'hro_undertakerInfo_del'" @click="handleDelete(selectObjs)">
						删除
					</el-button> -->
					<right-toolbar
						v-model:showSearch="showSearch"
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
				<!-- <el-table-column type="selection" width="40" align="center" /> -->
				<!-- <el-table-column type="index" label="#" width="40" /> -->
				<el-table-column prop="undertakerName" label="姓名" width="100" show-overflow-tooltip />
				<el-table-column prop="undertakerCard" label="身份证号码" width="200" show-overflow-tooltip />
				<el-table-column prop="undertakerPhone" label="手机号码" width="120" show-overflow-tooltip />
				<el-table-column label="性别" width="60" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ scope.row.undertakerSex == 0 ? '男' : '女' }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="undertakerAge" label="年龄" width="60" show-overflow-tooltip />
				<el-table-column prop="undertakerEducationName" label="学历" width="60" show-overflow-tooltip />
				<el-table-column prop="bankName" label="开户行" width="150" show-overflow-tooltip />
				<el-table-column prop="bankNumber" label="银行卡号" width="200" show-overflow-tooltip />
				<el-table-column label="服务商" width="150" show-overflow-tooltip>
					<template #default="scope">
						<div v-for="(_, i) in scope.row.spList" :key="i">{{ _.spName }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否签署协议" width="150" show-overflow-tooltip>
					<template #default="scope">
						<div v-for="(_, i) in scope.row.spList" :key="i">{{ _.isSign == 0 ? '否' : '是' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否银行四要素验证" width="160" show-overflow-tooltip>
					<template #default="scope">
						<div>{{ scope.row.isBankFourEssentialFactor == 0 ? '否' : '是' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="395" fixed="right">
					<template #default="scope">
						<el-button icon="view" text type="primary" v-auth="'hro_undertakerInfo_view'" @click="detailDialogRef.openDialog(scope.row.id)"
							>查看</el-button
						>
						<el-button icon="folder-add" text type="primary" v-auth="'hro_undertakerInfo_join'" @click="formDialogRef.openDialog(scope.row.id)"
							>加入服务商</el-button
						>
						<el-button icon="Upload" text type="primary" v-auth="'hro_undertakerInfo_uploadCard'" @click="formDialogRef.openDialog(scope.row.id)"
							>上传身份证</el-button
						>
						<el-button icon="edit-pen" text type="primary" v-auth="'hro_undertakerInfo_edit'" @click="formDialogRef.openDialog(scope.row.id)"
							>修改手机号码</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<!-- 查看 -->
		<detail-dialog ref="detailDialogRef" @refresh="getDataList(false)" />
	</div>
</template>

<script setup lang="ts" name="systemUndertakerInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/hro/undertakerInfo';
import { getSpInfoList, getMerchantInfoList } from '/@/api/core/merchantInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const DetailDialog = defineAsyncComponent(() => import('./detail.vue'));
const { t } = useI18n();
// 定义查询字典
const { yes_no_type } = useDict('yes_no_type');
// 定义变量内容
const formDialogRef = ref();
const detailDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const spinfoList = ref([]) as array;
const merchantInfoList = ref([]) as array;

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

const getUndertakerInfoData = () => {
	// 获取数据
	getSpInfoList().then((res: any) => {
		spinfoList.value = res.data || [];
	});
	getMerchantInfoList().then((res: any) => {
		merchantInfoList.value = res.data || [];
	});
};

getUndertakerInfoData();
</script>