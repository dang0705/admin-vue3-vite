<template>
	<el-row shadow="hover" v-show="showSearch" class="ml10">
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
			<!-- <el-form-item :label="$t('merchantInfo.spList')" prop="spList">
				<el-select placeholder="请选择" clearable v-model="state.queryForm.spList">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in merchant_status" />
				</el-select>
			</el-form-item> -->
			<el-form-item :label="$t('merchantInfo.spList')" prop="spId">
				<sp-select v-model="state.queryForm.spId" />
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
			<el-button icon="folder-add" type="primary" class="ml10" @click="openPayExit('add')">
				{{ $t('merchantInfo.openPayExit') }}
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
	<!-- :data="state.dataList" -->
	<el-table
		:data="state.dataList"
		v-loading="state.loading"
		border
		:cell-style="tableStyle.cellStyle"
		:header-cell-style="tableStyle.headerCellStyle"
		@selection-change="selectionChangHandle"
		@sort-change="sortChangeHandle"
	>
		<el-table-column prop="subAccountNum" min-width="100" :label="$t('merchantInfo.subAccount')" show-overflow-tooltip />
		<el-table-column prop="mainAccount" min-width="140" :label="$t('merchantInfo.mainAccount')" show-overflow-tooltip />
		<el-table-column prop="spName" :label="$t('merchantInfo.spList')" show-overflow-tooltip />
		<el-table-column prop="channelName" :label="$t('merchantInfo.payExit')" show-overflow-tooltip />
		<el-table-column prop="channelStatusDesc" label="状态" show-overflow-tooltip> </el-table-column>
		<el-table-column label="操作" width="300" fixed="right">
			<template #default="scope">
				<el-button icon="view" @click="payExitDetailDialogRef.openDialog(scope.row.id)" size="small" text type="primary"> 查看 </el-button>
			</template>
		</el-table-column>
	</el-table>
	<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />

	<el-dialog width="640px" title="开通支付通道" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="140px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item label="服务商" prop="spId">
						<sp-select v-model="form.spId" @change="getSpPaymentChannelListData(form.spId)" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item label="支付通道" prop="paymentChannelId">
						<el-select clearable v-model="form.paymentChannelId">
							<el-option :key="item.id" :label="item.channelName" :value="item.id" v-for="item in spPaymentChannelList" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
	<PayExitDetailDialog ref="payExitDetailDialogRef"></PayExitDetailDialog>
</template>

<script setup lang="ts" name="systemMerchantInfo">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { getMerchantSubAccountList, getSpPaymentChannelList, putMerchantSubAccount } from '/@/api/core/merchantInfo';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
const route = useRoute();
// import SpSelect from '/@/components/form-controls/sp-select.vue';
const PayExitDetailDialog = defineAsyncComponent(() => import('./payExitDetailDialog.vue'));

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
const payExitDetailDialogRef = ref();
const showSearch = ref(true);
const visible = ref(false);
const loading = ref(false);

const dataFormRef = ref();

// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
const spPaymentChannelList = ref([]) as array;
console.log('route.query.id', route.query.id);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		merchantId: route.query.id,
	},
	pageList: getMerchantSubAccountList,
});

// 提交表单数据
const form = reactive({
	id: '',
	merchantId: '',
	agreementName: '',
	spId: '',
	serviceManager: '',
	isUploadAchievement: '',
	feeCalculationMethod: '',
	invoiceCategory: '',
	isElectronicSignature: '',
	startTime: '',
	endTime: '',
	uploadAttachment: [],
	feeRates: [],
	status: '',
});

// 定义校验规则
const dataRules = ref({
	spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	paymentChannelId: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }],
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

const openPayExit = () => {
	console.log(111);
	visible.value = true;
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
			break;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	form.merchantId = route.query.id;
	try {
		loading.value = true;
		await putMerchantSubAccount(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		getDataList();
	} catch (err: any) {
	} finally {
		loading.value = false;
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

const getSpPaymentChannelListData = (spId) => {
	form.paymentChannelId = '';
	// 获取数据
	getSpPaymentChannelList({
		spId: spId,
	}).then((res: any) => {
		spPaymentChannelList.value = res.data || [];
	});
};
getSpPaymentChannelListData('');
</script>
