<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
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
					<el-form-item label="银行流水号" prop="bankSerialNumber">
						<InputPlus v-model="form.bankSerialNumber" placeholder="请输入银行流水号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="交易时间" prop="dealTime">
						<el-date-picker type="datetime" placeholder="请选择交易时间" v-model="form.dealTime" :value-format="dateTimeStr"></el-date-picker>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="借贷类型" prop="loanType">
						<InputPlus v-model="form.loanType" placeholder="请输入借贷类型" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="交易金额" prop="amount">
						<InputPlus v-model="form.amount" placeholder="请输入交易金额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="对方账号" prop="reciprocalAccountNumber">
						<InputPlus v-model="form.reciprocalAccountNumber" placeholder="请输入对方账号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="对方户名" prop="reciprocalAccountName">
						<InputPlus v-model="form.reciprocalAccountName" placeholder="请输入对方户名" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="对方开户行" prop="reciprocalBank">
						<InputPlus v-model="form.reciprocalBank" placeholder="请输入对方开户行" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="附言" prop="dealPostscript">
						<InputPlus v-model="form.dealPostscript" placeholder="请输入附言" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态（10：未认领，20：已认领）" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="状态（10：未认领，20：已认领）" border>状态（10：未认领，20：已认领）</el-radio>
						</el-radio-group>
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
</template>

<script setup lang="ts" name="WaterSpPaymentBankDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/finance/waterSpPaymentBank';
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
	spId: 0,
	paymentBankId: 0,
	bankSerialNumber: '',
	dealTime: '',
	loanType: '',
	amount: '',
	reciprocalAccountNumber: '',
	reciprocalAccountName: '',
	reciprocalBank: '',
	dealPostscript: '',
	status: '',
});

// 定义校验规则
const dataRules = ref({
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	paymentBankId: [{ required: true, message: '支付通道id不能为空', trigger: 'blur' }],
	bankSerialNumber: [{ required: true, message: '银行流水号不能为空', trigger: 'blur' }],
	dealTime: [{ required: true, message: '交易时间不能为空', trigger: 'blur' }],
	loanType: [{ required: true, message: '借贷类型不能为空', trigger: 'blur' }],
	amount: [{ required: true, message: '交易金额不能为空', trigger: 'blur' }],
	reciprocalAccountNumber: [{ required: true, message: '对方账号不能为空', trigger: 'blur' }],
	reciprocalAccountName: [{ required: true, message: '对方户名不能为空', trigger: 'blur' }],
	reciprocalBank: [{ required: true, message: '对方开户行不能为空', trigger: 'blur' }],
	dealPostscript: [{ required: true, message: '附言不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态（10：未认领，20：已认领）不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取waterSpPaymentBank信息
	if (id) {
		form.id = id;
		getwaterSpPaymentBankData(id);
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
const getwaterSpPaymentBankData = (id: string) => {
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
