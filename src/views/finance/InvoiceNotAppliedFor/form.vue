<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="账单id" prop="settleBillId">
						<el-input-number :min="1" :max="1000" v-model="form.settleBillId" placeholder="请输入账单id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="账单名称" prop="settleBillName">
						<InputPlus v-model="form.settleBillName" placeholder="请输入账单名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算单类别(10:服务结算单,20:任务结算单)" prop="settleBillType">
						<el-radio-group v-model="form.settleBillType">
							<el-radio label="结算单类别(10:服务结算单,20:任务结算单)" border>结算单类别(10:服务结算单,20:任务结算单)</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道" prop="paymentBankId">
						<el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商id" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收款方银行账号" prop="bankAccountNumberRecipient">
						<InputPlus v-model="form.bankAccountNumberRecipient" placeholder="请输入收款方银行账号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="收款方户名" prop="accountNameRecipient">
						<InputPlus v-model="form.accountNameRecipient" placeholder="请输入收款方户名" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算金额(元)" prop="serviceAmount">
						<InputPlus v-model="form.serviceAmount" placeholder="请输入结算金额(元)" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="结算状态" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="结算状态" border>结算状态</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="付款时间" prop="payTime">
						<el-date-picker type="datetime" placeholder="请选择付款时间" v-model="form.payTime" :value-format="dateTimeStr"></el-date-picker>
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

<script setup lang="ts" name="SettleBillRecordDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/settleBillRecord';
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
	settleBillId: 0,
	settleBillName: '',
	settleBillType: '',
	paymentBankId: 0,
	spId: 0,
	bankAccountNumberRecipient: '',
	accountNameRecipient: '',
	serviceAmount: '',
	status: '',
	payTime: '',
});

// 定义校验规则
const dataRules = ref({
	settleBillId: [{ required: true, message: '账单id不能为空', trigger: 'blur' }],
	settleBillName: [{ required: true, message: '账单名称不能为空', trigger: 'blur' }],
	settleBillType: [{ required: true, message: '结算单类别(10:服务结算单,20:任务结算单)不能为空', trigger: 'blur' }],
	paymentBankId: [{ required: true, message: '支付通道不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	bankAccountNumberRecipient: [{ required: true, message: '收款方银行账号不能为空', trigger: 'blur' }],
	accountNameRecipient: [{ required: true, message: '收款方户名不能为空', trigger: 'blur' }],
	serviceAmount: [{ required: true, message: '结算金额(元)不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '结算状态不能为空', trigger: 'blur' }],
	payTime: [{ required: true, message: '付款时间不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取settleBillRecord信息
	if (id) {
		form.id = id;
		getsettleBillRecordData(id);
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
const getsettleBillRecordData = (id: string) => {
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
