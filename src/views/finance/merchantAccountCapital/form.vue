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
					<el-form-item label="子账号" prop="subAccountNum">
						<InputPlus v-model="form.subAccountNum" placeholder="请输入子账号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道id" prop="paymentBankId">
						<el-input-number :min="1" :max="1000" v-model="form.paymentBankId" placeholder="请输入支付通道id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商id" prop="spId">
						<el-input-number :min="1" :max="1000" v-model="form.spId" placeholder="请输入服务商id"></el-input-number>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="可用余额" prop="balance">
						<InputPlus v-model="form.balance" placeholder="请输入可用余额" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="冻结金额" prop="freeze">
						<InputPlus v-model="form.freeze" placeholder="请输入冻结金额" />
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

<script setup lang="ts" name="MerchantAccountCapitalDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/finance/merchantAccountCapital';
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
	subAccountNum: '',
	paymentBankId: 0,
	spId: 0,
	balance: '',
	freeze: '',
});

// 定义校验规则
const dataRules = ref({
	merchantId: [{ required: true, message: '商户id不能为空', trigger: 'blur' }],
	subAccountNum: [{ required: true, message: '子账号不能为空', trigger: 'blur' }],
	paymentBankId: [{ required: true, message: '支付通道id不能为空', trigger: 'blur' }],
	spId: [{ required: true, message: '服务商id不能为空', trigger: 'blur' }],
	balance: [{ required: true, message: '可用余额不能为空', trigger: 'blur' }],
	freeze: [{ required: true, message: '冻结金额不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取merchantAccountCapital信息
	if (id) {
		form.id = id;
		getmerchantAccountCapitalData(id);
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
const getmerchantAccountCapitalData = (id: string) => {
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
