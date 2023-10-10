<template>
	<el-dialog title="添加支付通道" v-model="visible" :close-on-click-modal="false" draggable width="60%">
		<form-view
			ref="dataFormRef"
			v-model="form"
			:forms="conditionForms"
			:on-submit="onSubmit"
			:onCancel="() => (visible = false)"
			submit-button-text="确认"
			:columns="12"
			vertical
			:labelWidth="140"
			button-position="center"
		/>
	</el-dialog>
</template>

<script setup lang="ts" name="SpInfoDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
// import { spPaymentChannel } from '/@/api/core/spInfo';
import { getObj, addObj, putObj } from '/@/api/core/spPaymentChannel';
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
	spId: '',
	channelName: '',
	bankName: '',
	// bankNumber: '',
	bankBranch: '',
	bankArea: '',
	interbankNumber: '',
	mainAccount: '',
});
const self_disabled = ref(false);

const conditionForms = ref([
	{
		control: 'SpSelect',
		key: 'spId',
		label: '服务商:',
		rules: [{ required: true, message: '服务商名称不能为空', trigger: 'change' }],
	},
	{
		control: 'el-input',
		key: 'channelName',
		label: '支付通道名称:',
		props: {
			placeholder: '请输入支付通道名称',
		},
		rules: [{ required: true, message: '支付通道名称不能为空', trigger: 'blur' }],
	},
	{
		control: 'el-select',
		options: 'bank_name',
		key: 'bankName',
		label: '账号类别:',
		rules: [{ required: true, message: '账号类别不能为空', trigger: 'change' }],
	},
	// {
	// 	control: 'el-input',
	// 	key: 'bankNumber',
	// 	label: '网关地址:',
	// 	props: {
	// 		placeholder: '请输入网关地址',
	// 	},
	// 	rules: [{ required: true, message: '网关地址不能为空', trigger: 'blur' }],
	// },
	{
		control: 'el-input',
		key: 'bankBranch',
		label: '开户行:',
		props: {
			placeholder: '请输入开户行',
		},
		rules: [{ required: true, message: '开户行不能为空', trigger: 'blur' }],
	},
	{
		control: 'el-input',
		key: 'bankArea',
		label: '开户地:',
		props: {
			placeholder: '请输入开户地',
		},
		rules: [{ required: true, message: '开户地不能为空', trigger: 'blur' }],
	},
	{
		control: 'el-input',
		key: 'interbankNumber',
		label: '开户行联行号:',
		props: {
			placeholder: '请输入开户行联行号',
		},
		rules: [{ required: true, message: '开户行联行号不能为空', trigger: 'blur' }],
	},
	{
		control: 'el-input',
		key: 'mainAccount',
		label: '主账号:',
		props: {
			placeholder: '请输入主账号',
		},
		rules: [{ required: true, message: '主账号不能为空', trigger: 'blur' }],
	},
]);

// 打开弹窗
const openDialog = (id: string, disabled: boolean) => {
	self_disabled.value = disabled || false;
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取spPaymentChannel信息
	if (id) {
		form.id = id;
		getspPaymentChannelData(id);
	}
};
// 初始化表单数据
const getspPaymentChannelData = (id: string) => {
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
// 提交
const onSubmit = async () => {
	// const valid = await dataFormRef.value.validate().catch(() => {});
	// if (!valid) return false;
	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(form.id ? '修改成功' : '添加成功');
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
