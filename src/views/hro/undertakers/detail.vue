<template>
	<el-dialog title="承接人详情" v-model="visible" :close-on-click-modal="false" draggable width="60%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules && false" formDialogRef label-width="120px" v-loading="loading">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item label="姓名:" prop="undertakerName">
						<el-input v-model="form.undertakerName" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="证件号码:" prop="undertakerCard">
						<el-input v-model="form.undertakerCard" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="手机号码:" prop="undertakerPhone">
						<el-input v-model="form.undertakerPhone" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="银行卡号:" prop="bankNumber">
						<el-input v-model="form.bankNumber" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="开户行:" prop="bankName">
						<el-input v-model="form.bankName" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="是否实名认证:" prop="isAuthentication">
						<el-select placeholder="" v-model="form.isAuthentication" disabled>
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in yes_no_type"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="性别:" prop="undertakerSex">
						<el-select placeholder="" v-model="form.undertakerSex" disabled>
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in gender"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="年龄:" prop="undertakerAge">
						<el-input v-model="form.undertakerAge" placeholder="" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="学历:" prop="undertakerEducation">
						<el-select placeholder="" v-model="form.undertakerEducation" disabled>
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in education"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20"></el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="服务商:" prop="spName">
						<span v-for="(_, i) in form.spList" :key="i"
							>{{ _.spName }}
							<span v-if="i != form.spList.length - 1">,</span>
						</span>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20"></el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="身份证正面:" prop="undertakerPortrait">
						<UploadFile v-if="form.undertakerPortrait.length > 0" :type="businessType" v-model="form.undertakerPortrait" disabled />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item label="身份证反面:" prop="undertakerNationalEmblem">
						<UploadFile v-if="form.undertakerNationalEmblem.length > 0" :type="businessType" v-model="form.undertakerNationalEmblem" disabled />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<span class="flex justify-center items-center">
			<!-- <el-button @click="visible = false">取消</el-button> -->
			<!-- <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button> -->
			<el-button type="primary" @click="visible = false">确认</el-button>
		</span>
	</el-dialog>
</template>

<script setup lang="ts" name="UndertakerInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/hro/undertakerInfo';
import { rule } from '/@/utils/validate';
import uploadBusinessType from '/@/enums/upload-business-type';
const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const businessType = uploadBusinessType.hro;
// 定义字典
const { yes_no_type, gender, education } = useDict('yes_no_type', 'gender', 'education');
// 提交表单数据
const form = reactive({
	id: '',
	undertakerName: '',
	undertakerCard: '',
	undertakerPhone: '',
	undertakerSex: '',
	undertakerAddress: '',
	undertakerClan: '',
	undertakerClanName: '',
	undertakerEducation: '',
	workTime: '',
	undertakerPortrait: [],
	undertakerNationalEmblem: [],
	isAuthentication: '',
	bankNumber: '',
	bankName: '',
	bankAddress: '',
	isBankFourEssentialFactor: '',
});

// 定义校验规则
const dataRules = ref({
	undertakerName: [{ required: true, message: '承接人姓名不能为空', trigger: 'blur' }],
	undertakerCard: [{ required: true, message: '承接人身份证号不能为空', trigger: 'blur' }],
	undertakerPhone: [{ required: true, message: '承接人手机号不能为空', trigger: 'blur' }],
	undertakerSex: [{ required: true, message: '承接人性别不能为空', trigger: 'blur' }],
	undertakerAddress: [{ required: true, message: '承接人家庭住址不能为空', trigger: 'blur' }],
	undertakerClanName: [{ required: true, message: '承接人 民族 名称不能为空', trigger: 'blur' }],
	undertakerEducation: [{ required: true, message: '承接人学历不能为空', trigger: 'blur' }],
	workTime: [{ required: true, message: '参加工作日期不能为空', trigger: 'blur' }],
	undertakerPortrait: [{ required: true, message: '承接人身份证正面不能为空', trigger: 'blur' }],
	undertakerNationalEmblem: [{ required: true, message: '承接人身份证国徽面不能为空', trigger: 'blur' }],
	isAuthentication: [{ required: true, message: '是否实名认证不能为空', trigger: 'blur' }],
	bankNumber: [{ required: true, message: '银行卡号不能为空', trigger: 'blur' }],
	bankName: [{ required: true, message: '银行名称不能为空', trigger: 'blur' }],
	bankAddress: [{ required: true, message: '银行开户地址不能为空', trigger: 'blur' }],
	isBankFourEssentialFactor: [{ required: true, message: '是否验证银行四要素不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取undertakerInfo信息
	if (id) {
		form.id = id;
		getundertakerInfoData(id);
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
const getundertakerInfoData = (id: string) => {
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