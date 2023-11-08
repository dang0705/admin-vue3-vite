<template>
	<Dialog
		v-model="visible"
		v-model:formData="formData"
		title="承接记录详情"
		:forms="forms"
		:columns="12"
		:label-width="140"
		:form-rules="dataRules"
		:on-submit="onSubmit"
		vertical
		:showBtn="showBtn"
	>
		<template #workload>
			<el-form-item label="确认工作量:" prop="workload">
				<InputPlus disabled :modelValue="formData.workload"></InputPlus>
				<div v-if="formData.workload && formData.measuringUnit">{{ batchMap?.task_unit[formData.measuringUnit] }}</div>
			</el-form-item>
		</template>
	</Dialog>
</template>

<script setup lang="ts">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, putTaskAcceptance } from '/@/api/core/undertakerTask';
import { rule } from '/@/utils/validate';
import uploadBusinessType from '/@/enums/upload-business-type';
import dynamicForms from '/@/views/task/undertaker/components/dynamic-forms';
defineOptions({ name: 'UndertakerInfoDialog' });
// import dynamicForms from '/@/views/batch/import/dynamic-forms';
const emit = defineEmits(['refresh']);
import Array2Object from '/@/utils/array-2-object';
const batchMap = Array2Object({ dic: ['task_unit'] });
const route = useRoute();
// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const showBtn = ref(true);
const currentType = ref(1);
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

let forms;

// 打开弹窗
const openDialog = (id: string, type: number = 1) => {
	visible.value = true;
	formData.id = '';
	currentType.value = type;
	if (type === 2) {
		showBtn.value = true;
		forms = dynamicForms({ type: 2 });
	} else {
		showBtn.value = false;
		forms = dynamicForms({ type: 1 });
	}
	console.log('forms', forms, type);

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
		if (currentType.value === 2) {
			loading.value = true;
			await putTaskAcceptance({
				...formData,
				taskId: route.query.taskId,
				undertakerId: formData.id,
			});
			useMessage().success('验收成功');
			visible.value = false;
			emit('refresh');
		} else {
			visible.value = false;
		}
	} catch (err: any) {
		console.log('err', err);

		// useMessage().error(err.msg);
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
