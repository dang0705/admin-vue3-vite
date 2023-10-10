<template>
	<Dialog
		v-model="visible"
		v-model:formData="formData"
		title="承接纪录详情"
		:disabled="!!formData.id"
		:forms="forms"
		:columns="12"
		:label-width="140"
		:form-rules="dataRules"
		:on-submit="onSubmit"
		vertical
	>
	</Dialog>
</template>

<script setup lang="ts" name="UndertakerInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj } from '/@/api/core/undertakerTask';
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
const formData = reactive({
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

const forms = [
	{
		control: 'el-input',
		key: 'undertakerName',
		label: '承接人',
	},
	{
		control: 'el-input',
		key: 'undertakerCard',
		label: '身份证号码',
	},
	{
		control: 'el-input',
		key: 'undertakerPhone',
		label: '手机号码',
	},
	{
		control: 'el-input',
		key: 'taskName',
		label: '任务名称',
	},
	{
		control: 'el-input',
		key: 'createTime',
		label: '起始时间',
	},
	{
		control: 'el-input',
		// 伪代码
		key: 'xxx',
		label: '接单时间',
		title: '个人承接页',
	},
	{
		control: 'el-input',
		key: 'startTime',
		label: '开始时间',
	},
	{
		control: 'el-input',
		key: 'endTime',
		label: '完成时间',
	},
	{
		control: 'el-input',
		// 伪代码
		key: 'xxx',
		label: '确认工作量',
	},
	{
		control: 'el-input',
		key: 'taskMoney',
		label: '承接人确认金额',
	},
	{
		control: 'UploadFile',
		key: 'startImages',
		label: '开始前上传图片',
	},
	{
		control: 'UploadFile',
		key: 'doneImages',
		label: '完成成果图片',
	},

	{
		control: 'el-input',
		// 伪代码
		key: 'xxx',
		label: '企业验收时间',
		title: '企业验收页',
	},
	{
		control: 'el-input',
		key: 'xxx',
		label: '企业验收工作量',
	},
	{
		control: 'el-input',
		key: 'xxx',
		label: '企业验收金额',
	},
	{
		control: 'el-input',
		key: 'xxx',
		label: '验收上传图片',
	},
];

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	formData.id = '';
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取undertakerInfo信息
	if (id) {
		formData.id = id;
		getundertakerInfoData(id);
	}
};
// 提交
const onSubmit = async () => {
	try {
		loading.value = true;
		visible.value = false;
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
			Object.assign(formData, res.data);
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
