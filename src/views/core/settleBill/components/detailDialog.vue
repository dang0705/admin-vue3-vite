<template>
	<el-dialog :close-on-click-modal="false" :title="title" width="600" draggable v-model="visible">
		<el-form
			v-if="dialogType === 1 || dialogType === 2"
			:model="form"
			:rules="dataRules"
			style="min-height: 150px"
			label-width="140px"
			formDialogRef
			ref="dataFormRef"
			v-loading="loading"
		>
			<template v-if="dialogType === 1">
				<el-form-item label="资金账户可用余额">
					{{ settleBillType == 1 ? form.serviceAmountTotal : form.taskAmountTotal }}
				</el-form-item>
				<el-form-item label="当前结算单金额">
					{{ form.billAmountTotal }}
				</el-form-item>
			</template>
			<template v-if="dialogType === 2">
				您已为结算单 {{ settleBillType == 1 ? form.serviceBillRecord[0].id : form.taskBillRecord[0].id }} 成功发起付款！
			</template>
		</el-form>

		<div>
			<form-view
				v-if="dialogType == 3"
				:on-cancel="onCancel"
				:on-submit="onSubmit"
				submit-button-text="确认"
				cancel-button-text="取消"
				:columns="24"
				:vertical="true"
				label-width="160px"
				v-model="form"
				:forms="addUnderTakerForms"
			>
				<template #xxx5="{ form }">
					<el-form-item label="上传转账凭证" prop="xxx5">
						<UploadFile :type="businessType" v-model="form.xxx5" />
					</el-form-item>
				</template>
			</form-view>
		</div>
		<template #footer>
			<span v-if="dialogType === 1" class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary">为当前结算单付款</el-button>
			</span>
			<span v-if="dialogType === 2" class="dialog-footer">
				<el-button @click="visible = false" type="primary">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="distribution">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, payBillRecord } from '/@/api/core/settleBill';
const emit = defineEmits(['refresh']);
import uploadBusinessType from '/@/enums/upload-business-type';
const businessType = uploadBusinessType.merchant;
const route: any = useRoute();
const title = ref('');
const visible = ref(false);
const loading = ref(false);
const dialogType = ref(0);
const settleBillType = ref(0);
const form = reactive({
	serviceBillRecord: [],
	taskBillRecord: [],
});
const addUnderTakerForms = [
	{
		control: 'Upload',
		key: 'xxx5',
		label: '上传转账凭证',
		slot: true,
	},
	{
		control: 'el-input',
		key: 'xxx333',
		label: '付款户名',
		rules: [
			{
				required: true,
				message: '付款户名不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'el-input',
		key: 'xxx2',
		label: '付付款账号款户名',
		rules: [
			{
				required: true,
				message: '付款账号不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'el-input',
		key: 'xxx1',
		label: '开户行',
		rules: [
			{
				required: true,
				message: '开户行不能为空',
				trigger: 'blur',
			},
		],
	},
	{
		control: 'el-input',
		key: 'xxx',
		label: '付款金额',
		rules: [
			{
				required: true,
				message: '付款金额不能为空',
				trigger: 'blur',
			},
		],
	},
];
// 定义校验规则
const dataRules = ref({
	auditPass: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
	auditPostscript: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
});
const onCancel = () => {
	visible.value = false;
};
// 打开弹窗
const openDialog = async (id: string, dType: number, billType: number) => {
	dialogType.value = dType;
	visible.value = true;
	settleBillType.value = billType;
	if (dType === 1) {
		title.value = '发起付款';
	} else if (dType === 3) {
		title.value = '发起充值';
	}
	if (id) {
		getmerchantInfoData();
	}
};
// 初始化表单数据
const getmerchantInfoData = () => {
	// 获取数据
	loading.value = true;
	getObj(route.query.id)
		.then((res: any) => {
			Object.assign(form, res.data);
			console.log('form-1', form);
		})
		.finally(() => {
			loading.value = false;
		});
};
// 提交授权数据
const onSubmit = async () => {
	if (dialogType.value === 1) {
		let obj = settleBillType.value == 1 ? form.serviceBillRecord[0] : form.taskBillRecord[0] || {};
		loading.value = true;
		payBillRecord({
			billId: form.id,
			settleRecordId: obj.id,
		})
			.then((res: any) => {
				if (settleBillType.value === 1) {
					useMessage().success('服务结算单付款成功');
				} else if (settleBillType.value === 2) {
					useMessage().success('任务结算单付款成功');
				}
				dialogType.value = 2;
				title.value = '发起付款成功';
				// visible.value = false;
				emit('refresh');
			})
			.finally(() => {
				loading.value = false;
			});
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
::v-deep(.el-transfer__buttons) {
	display: flex;
	align-items: center;
	flex-direction: column;
	button {
		margin: 10px 0 0 0;
		width: 100%;
	}
}
::v-deep(.no-label) {
	.el-form-item__content {
		margin-left: 0 !important;
	}
}
::v-deep(.el-transfer-panel) {
	width: fit-content;
}
::v-deep(.el-checkbox) {
	margin-right: 0;
}
</style>
