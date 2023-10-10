<template>
	<Dialog
		v-model="visible"
		v-model:formData="formData"
		title="账户详细信息"
		:disabled="!!formData.id"
		:forms="forms"
		:columns="24"
		:label-width="140"
		:on-submit="onSubmit"
		vertical
	>
	</Dialog>
</template>

<script setup lang="ts" name="UndertakerInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getMerchantSubAccountDetail } from '/@/api/core/merchantInfo';
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

const forms = [
	{
		control: 'el-input',
		key: 'merchantName',
		label: '商户名称',
	},
	{
		control: 'el-input',
		key: 'spName',
		label: '收款户名',
	},
	{
		control: 'el-input',
		key: 'mainAccount',
		label: '收款账号',
	},
	{
		control: 'el-input',
		key: 'bankBranch',
		label: '收款开户行',
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
	getMerchantSubAccountDetail(id)
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
