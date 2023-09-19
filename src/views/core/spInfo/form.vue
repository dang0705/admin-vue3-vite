<template>
	<el-dialog title="添加支付通道" v-model="visible" :close-on-click-modal="false" draggable width="80%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="110px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="服务商" prop="spName">
						<el-input v-model="form.spName" placeholder="请输入服务商" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="支付通道名称" prop="payAccessName">
						<el-input v-model="form.payAccessName" placeholder="请输入支付通道名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="账号类别" prop="accountCategory">
						<el-select placeholder="请输入账号类别" v-model="form.accountCategory">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in dict_type"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="网关地址" prop="bankNumber">
						<el-input v-model="form.bankNumber" placeholder="请输入网关地址" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开户行" prop="bankName">
						<el-input v-model="form.bankName" placeholder="请输入开户行" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开户地" prop="bankArea">
						<el-input v-model="form.bankArea" placeholder="请输入开户地" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开户行联行号" prop="interbankNumber">
						<el-input v-model="form.interbankNumber" placeholder="请输入开户行联行号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="主账号" prop="bankCode">
						<el-input v-model="form.bankCode" placeholder="请输入主账号" />
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

<script setup lang="ts" name="SpInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/core/spInfo';
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
	spName: '',
	payAccessName: '',
	accountCategory: '',
	bankNumber: '',
	bankName: '',
	bankArea: '',
	interbankNumber: '',
	bankCode: '',
});

// 定义校验规则
const dataRules = ref({
	spName: [{ required: true, message: '服务商不能为空', trigger: 'blur' }],
	payAccessName: [{ required: true, message: '支付通道名称不能为空', trigger: 'blur' }],
	accountCategory: [{ required: true, message: '账号类别不能为空', trigger: 'blur' }],
	bankNumber: [{ required: true, message: '网关地址不能为空', trigger: 'blur' }],
	bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	bankArea: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
	interbankNumber: [{ required: true, message: '开户行联行号不能为空', trigger: 'blur' }],
	bankCode: [{ required: true, message: '主账号不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取spInfo信息
	if (id) {
		form.id = id;
		getspInfoData(id);
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
const getspInfoData = (id: string) => {
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
