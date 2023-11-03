<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="账单名称" prop="billName">
						<InputPlus v-model="form.billName" placeholder="请输入账单名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算商户" prop="merchantId">
						<el-input-number :min="1" :max="1000" v-model="form.merchantId" placeholder="请输入结算商户"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算商户名称" prop="merchantName">
						<InputPlus v-model="form.merchantName" placeholder="请输入结算商户名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商名称" prop="spName">
						<InputPlus v-model="form.spName" placeholder="请输入服务商名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算任务id" prop="taskId">
						<el-input-number :min="1" :max="1000" v-model="form.taskId" placeholder="请输入结算任务id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算任务名称" prop="taskName">
						<InputPlus v-model="form.taskName" placeholder="请输入结算任务名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道" prop="paymentBankId">
						<el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道名称" prop="paymentBankName">
						<InputPlus v-model="form.paymentBankName" placeholder="请输入支付通道名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务协议id" prop="serviceContractId">
						<el-input-number :min="1" :max="1000" v-model="form.serviceContractId" placeholder="请输入服务协议id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务协议-名称" prop="serviceContractName">
						<InputPlus v-model="form.serviceContractName" placeholder="请输入服务协议-名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="是否发送结算成功短信" prop="isSendMsg">
						<el-radio-group v-model="form.isSendMsg">
							<el-radio label="是否发送结算成功短信" border>是否发送结算成功短信</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务承接数量" prop="taskUndertakerCount">
						<el-input-number :min="1" :max="1000" v-model="form.taskUndertakerCount" placeholder="请输入任务承接数量"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="状态" border>状态</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核状态（10：待审核，20：审核通过，30：审核不通过）" prop="auditStatus">
						<el-radio-group v-model="form.auditStatus">
							<el-radio label="审核状态（10：待审核，20：审核通过，30：审核不通过）" border
								>审核状态（10：待审核，20：审核通过，30：审核不通过）</el-radio
							>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核说明" prop="auditPostscript">
						<InputPlus v-model="form.auditPostscript" placeholder="请输入审核说明" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="审核操作员" prop="auditUserId">
						<el-input-number :min="1" :max="1000" v-model="form.auditUserId" placeholder="请输入审核操作员"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="账单生成时间" prop="billCreateTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择账单生成时间"
							v-model="form.billCreateTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="账单发放时间" prop="billSettleTime">
						<el-date-picker
							type="datetime"
							placeholder="请选择账单发放时间"
							v-model="form.billSettleTime"
							:value-format="dateTimeStr"
						></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务费计算方式" prop="feeCalculationMethod">
						<el-radio-group v-model="form.feeCalculationMethod">
							<el-radio label="服务费计算方式" border>服务费计算方式</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务费计算方式-描述" prop="feeCalculationMethodDesc">
						<InputPlus v-model="form.feeCalculationMethodDesc" placeholder="请输入服务费计算方式-描述" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务费计算比例" prop="feeCalculationMethodRate">
						<InputPlus v-model="form.feeCalculationMethodRate" placeholder="请输入服务费计算比例" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="任务总金额" prop="taskAmountTotal">
						<InputPlus v-model="form.taskAmountTotal" placeholder="请输入任务总金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务费总金额" prop="serviceAmountTotal">
						<InputPlus v-model="form.serviceAmountTotal" placeholder="请输入服务费总金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算总金额" prop="billAmountTotal">
						<InputPlus v-model="form.billAmountTotal" placeholder="请输入结算总金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="账单创建人" prop="createBillUser">
						<InputPlus v-model="form.createBillUser" placeholder="请输入账单创建人" />
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

<script setup lang="ts" name="SettleBillDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/settleBill';
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
	billName: '',
	merchantId: 0,
	merchantName: '',
	spId: 0,
	spName: '',
	taskId: 0,
	taskName: '',
	paymentBankId: 0,
	paymentBankName: '',
	serviceContractId: 0,
	serviceContractName: '',
	isSendMsg: '',
	taskUndertakerCount: 0,
	status: '',
	auditStatus: '',
	auditPostscript: '',
	auditUserId: 0,
	billCreateTime: '',
	billSettleTime: '',
	feeCalculationMethod: '',
	feeCalculationMethodDesc: '',
	feeCalculationMethodRate: '',
	taskAmountTotal: '',
	serviceAmountTotal: '',
	billAmountTotal: '',
	createBillUser: '',
});

// 定义校验规则
const dataRules = ref({
	billName: [{ required: true, message: '账单名称不能为空', trigger: 'blur' }],
	merchantId: [{ required: true, message: '结算商户不能为空', trigger: 'blur' }],
	merchantName: [{ required: true, message: '结算商户名称不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	spName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	taskId: [{ required: true, message: '结算任务id不能为空', trigger: 'blur' }],
	taskName: [{ required: true, message: '结算任务名称不能为空', trigger: 'blur' }],
	paymentBankId: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }],
	paymentBankName: [{ required: true, message: '支付通道名称不能为空', trigger: 'blur' }],
	serviceContractId: [{ required: true, message: '服务协议id不能为空', trigger: 'blur' }],
	serviceContractName: [{ required: true, message: '服务协议-名称不能为空', trigger: 'blur' }],
	isSendMsg: [{ required: true, message: '是否发送结算成功短信不能为空', trigger: 'blur' }],
	taskUndertakerCount: [{ required: true, message: '任务承接数量不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
	auditStatus: [{ required: true, message: '审核状态（10：待审核，20：审核通过，30：审核不通过）不能为空', trigger: 'blur' }],
	auditPostscript: [{ required: true, message: '审核说明不能为空', trigger: 'blur' }],
	auditUserId: [{ required: true, message: '审核操作员不能为空', trigger: 'blur' }],
	billCreateTime: [{ required: true, message: '账单生成时间不能为空', trigger: 'blur' }],
	billSettleTime: [{ required: true, message: '账单发放时间不能为空', trigger: 'blur' }],
	feeCalculationMethod: [{ required: true, message: '服务费计算方式不能为空', trigger: 'blur' }],
	feeCalculationMethodDesc: [{ required: true, message: '服务费计算方式-描述不能为空', trigger: 'blur' }],
	feeCalculationMethodRate: [{ required: true, message: '服务费计算比例不能为空', trigger: 'blur' }],
	taskAmountTotal: [{ required: true, message: '任务总金额不能为空', trigger: 'blur' }],
	serviceAmountTotal: [{ required: true, message: '服务费总金额不能为空', trigger: 'blur' }],
	billAmountTotal: [{ required: true, message: '结算总金额不能为空', trigger: 'blur' }],
	createBillUser: [{ required: true, message: '账单创建人不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取settleBill信息
	if (id) {
		form.id = id;
		getsettleBillData(id);
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
const getsettleBillData = (id: string) => {
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
