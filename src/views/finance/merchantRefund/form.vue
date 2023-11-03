<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="商户id" prop="merchantId">
						<el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入商户id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="商户资金账户id" prop="accountId">
						<el-input-number :min="1" :max="1000" v-model="form.accountId" placeholder="请输入商户资金账户id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态（10：待审核，20：已驳回，30：待退款，40：退款成功，50：退款失败）" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="状态（10：待审核，20：已驳回，30：待退款，40：退款成功，50：退款失败）" border
								>状态（10：待审核，20：已驳回，30：待退款，40：退款成功，50：退款失败）</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="退款金额" prop="receiptAmount">
						<el-input v-model="form.receiptAmount" placeholder="请输入退款金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收款户名" prop="receiptAccountName">
						<el-input v-model="form.receiptAccountName" placeholder="请输入收款户名" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收款账号" prop="receiptAccountNumber">
						<el-input v-model="form.receiptAccountNumber" placeholder="请输入收款账号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收款开户行" prop="receiptAccountBank">
						<el-input v-model="form.receiptAccountBank" placeholder="请输入收款开户行" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="发起退款时间" prop="refundStartTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择发起退款时间"
							v-model="form.refundStartTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="到账时间" prop="accountingTime">
						<el-date-picker type="datetime" placeholder="请选择到账时间" v-model="form.accountingTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商id" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道id" prop="paymentBankId">
						<el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核人userId" prop="auditUserId">
						<el-input-number :min="1" :max="1000" v-model="form.auditUserId" placeholder="请输入审核人userId"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核说明" prop="auditPostscript">
						<el-input v-model="form.auditPostscript" placeholder="请输入审核说明" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核时间" prop="auditTime">
						<el-date-picker type="datetime" placeholder="请选择审核时间" v-model="form.auditTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" v-debounce="onSubmit" :disabled="loading">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="MerchantRefundDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/finance/merchantRefund';
import { rule } from '/@/utils/validate';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	merchantId: 0,
	accountId: 0,
	status: '',
	receiptAmount: '',
	receiptAccountName: '',
	receiptAccountNumber: '',
	receiptAccountBank: '',
	refundStartTime: '',
	accountingTime: '',
	spId: 0,
	paymentBankId: 0,
	auditUserId: 0,
	auditPostscript: '',
	auditTime: '',
});

// 定义校验规则
const dataRules = ref({
	merchantId: [{ required: true, message: '商户id不能为空', trigger: 'blur' }],
	accountId: [{ required: true, message: '商户资金账户id不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态（10：待审核，20：已驳回，30：待退款，40：退款成功，50：退款失败）不能为空', trigger: 'blur' }],
	receiptAmount: [{ required: true, message: '退款金额不能为空', trigger: 'blur' }],
	receiptAccountName: [{ required: true, message: '收款户名不能为空', trigger: 'blur' }],
	receiptAccountNumber: [{ required: true, message: '收款账号不能为空', trigger: 'blur' }],
	receiptAccountBank: [{ required: true, message: '收款开户行不能为空', trigger: 'blur' }],
	refundStartTime: [{ required: true, message: '发起退款时间不能为空', trigger: 'blur' }],
	accountingTime: [{ required: true, message: '到账时间不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	paymentBankId: [{ required: true, message: '支付通道id不能为空', trigger: 'blur' }],
	auditUserId: [{ required: true, message: '审核人userId不能为空', trigger: 'blur' }],
	auditPostscript: [{ required: true, message: '审核说明不能为空', trigger: 'blur' }],
	auditTime: [{ required: true, message: '审核时间不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取merchantRefund信息
	if (id) {
		form.id = id;
		getmerchantRefundData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getmerchantRefundData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
