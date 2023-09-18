<template>
	<el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-row :gutter="24">
				<el-divider>基本信息</el-divider>
				<el-col :span="12" class="mb20">
					<el-form-item label="服务商名称" prop="spName">
						<el-input v-model="form.spName" placeholder="请输入服务商名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="业务类型" prop="busiType">
						<el-radio-group v-model="form.busiType">
							<el-radio label="业务类型" border>业务类型</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="银行账户" prop="bankNumber">
						<el-input v-model="form.bankNumber" placeholder="请输入银行账户" />
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
					<el-form-item label="企业邮箱" prop="email">
						<el-input v-model="form.email" placeholder="请输入企业邮箱" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="营业执照" prop="businessLicense">
						<el-input v-model="form.businessLicense" placeholder="请输入营业执照" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="社会信用代码" prop="socialCreditCode">
						<el-input v-model="form.socialCreditCode" placeholder="请输入社会信用代码" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="经营范围" prop="businessScope">
						<el-input v-model="form.businessScope" placeholder="请输入经营范围" />
					</el-form-item>
				</el-col>

				<el-divider>税率设置</el-divider>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人姓名" prop="legalPersonName">
						<el-input v-model="form.legalPersonName" placeholder="请输入法人姓名" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人手机号" prop="legalPersonMobile">
						<el-input v-model="form.legalPersonMobile" placeholder="请输入法人手机号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人身份证号" prop="legalPersonIdCard">
						<el-input v-model="form.legalPersonIdCard" placeholder="请输入法人身份证号" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人身份证头像面" prop="legalPersonPortrait">
						<el-input v-model="form.legalPersonPortrait" placeholder="请输入法人身份证头像面" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="法人身份证国徽面" prop="legalPersonNationalEmblem">
						<el-input v-model="form.legalPersonNationalEmblem" placeholder="请输入法人身份证国徽面" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="状态" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio label="状态" border>状态</el-radio>
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
	busiType: '',
	bankNumber: '',
	bankName: '',
	bankArea: '',
	email: '',
	businessLicense: '',
	socialCreditCode: '',
	businessScope: '',
	legalPersonName: '',
	legalPersonMobile: '',
	legalPersonIdCard: '',
	legalPersonPortrait: '',
	legalPersonNationalEmblem: '',
	status: '',
});

// 定义校验规则
const dataRules = ref({
	spName: [{ required: true, message: '服务商名称不能为空', trigger: 'blur' }],
	busiType: [{ required: true, message: '业务类型不能为空', trigger: 'blur' }],
	bankNumber: [{ required: true, message: '银行账户不能为空', trigger: 'blur' }],
	bankName: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	bankArea: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
	email: [{ required: true, message: '企业邮箱不能为空', trigger: 'blur' }],
	businessLicense: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
	socialCreditCode: [{ required: true, message: '社会信用代码不能为空', trigger: 'blur' }],
	businessScope: [{ required: true, message: '经营范围不能为空', trigger: 'blur' }],
	legalPersonName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
	legalPersonMobile: [{ required: true, message: '法人手机号不能为空', trigger: 'blur' }],
	legalPersonIdCard: [{ required: true, message: '法人身份证号不能为空', trigger: 'blur' }],
	legalPersonPortrait: [{ required: true, message: '法人身份证头像面不能为空', trigger: 'blur' }],
	legalPersonNationalEmblem: [{ required: true, message: '法人身份证国徽面不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
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
