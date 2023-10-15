<template>
	<el-dialog :close-on-click-modal="false" :title="title" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" style="min-height: 150px" label-width="140px" formDialogRef ref="dataFormRef" v-loading="loading">
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
// 定义校验规则
const dataRules = ref({
	auditPass: [{ required: true, message: '审核结果不能为空', trigger: 'blur' }],
	auditPostscript: [{ required: true, message: '驳回原因不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string, type: number, billType: number) => {
	dialogType.value = type;
	visible.value = true;
	settleBillType.value = billType;
	if (type === 1) {
		title.value = '发起付款';
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
